import { PublicKey, SystemProgram, Connection } from '@solana/web3.js';
import { Program, Wallet, BN } from '@coral-xyz/anchor';
import { 
    createConnection,
    createProgram, 
    NETWORK_CONFIG, 
    getCurrentNetwork,
    getTempleConfigPda,
    getUserStatePda,
    getWishPda
} from '@/lib/solana';
import { Temple } from '@/types/temple';

// 许愿参数接口
export interface CreateWishParams {
    wishId: number;           // 许愿ID，必须等于用户当前总许愿数+1
    contentHash: number[];    // 许愿内容的哈希值 (32 bytes)
    isAnonymous: boolean;     // 是否匿名许愿
}

// 许愿结果接口
export interface CreateWishResult {
    transactionSignature: string;
    wishId: number;
    contentHash: number[];
    isAnonymous: boolean;
    isFreewish: boolean;         // 是否免费许愿
    isAmuletDropped: boolean;    // 是否掉落御守
    rewardKarmaPoints: number;   // 奖励功德值
    reduceKarmaPoints: number;   // 消耗功德值
    currentTimestamp: number;    // 当前时间戳
}

// 许愿错误类型
export class CreateWishError extends Error {
    constructor(message: string, public code?: string) {
        super(message);
        this.name = 'CreateWishError';
    }
}

// 许愿合约调用类
export class CreateWishContract {
    private program: Program<Temple>;
    private connection: Connection;
    private programId: PublicKey;

    constructor(wallet: Wallet) {
        this.program = createProgram(wallet);
        this.connection = createConnection();
        const network = getCurrentNetwork();
        this.programId = new PublicKey(NETWORK_CONFIG[network as keyof typeof NETWORK_CONFIG].programId);
    }

    /**
     * 创建许愿
     * 基于测试文件 wish.test.ts 和 create_wish.rs 实现
     */
    async createWish(
        userPubkey: PublicKey,
        params: CreateWishParams
    ): Promise<CreateWishResult> {
        try {
            console.log('💛 开始许愿流程...');

            // 验证 contentHash 长度
            if (params.contentHash.length !== 32) {
                throw new CreateWishError('内容哈希必须为 32 字节', 'INVALID_CONTENT_HASH');
            }

            // 获取必要的 PDA 地址 - 使用统一的 PDA 函数
            const templeConfigPda = getTempleConfigPda(this.programId);
            const userStatePda = getUserStatePda(userPubkey, this.programId);
            const wishPda = getWishPda(userPubkey, params.wishId, this.programId);

            // 检查用户状态是否存在
            let userStateBefore: any;
            try {
                userStateBefore = await this.program.account.userState.fetch(userStatePda);
                console.log('📊 许愿前用户状态:', {
                    karmaPoints: userStateBefore.karmaPoints.toString(),
                    totalWishCount: userStateBefore.totalWishCount,
                    dailyWishCount: userStateBefore.dailyWishCount,
                });
            } catch (error) {
                throw new CreateWishError('用户状态不存在，请先进行烧香或抽签操作来初始化账户', 'USER_NOT_INITIALIZED');
            }

            console.log('📍 账户地址:', {
                templeConfig: templeConfigPda.toString(),
                userState: userStatePda.toString(),
                wish: wishPda.toString(),
                user: userPubkey.toString(),
            });

            // 调用许愿指令 - 完全按照测试文件的方式
            console.log('📤 发送许愿交易...');
            console.log('📝 许愿参数:', {
                wishId: params.wishId,
                contentHashLength: params.contentHash.length,
                isAnonymous: params.isAnonymous,
            });

            const tx = await (this.program.methods as any)
                .createWish(
                    new BN(params.wishId),
                    params.contentHash,
                    params.isAnonymous
                )
                .accounts({
                    user: userPubkey,
                })
                .rpc();

            console.log('✅ 许愿交易提交成功:', tx);

            // 等待交易确认
            await this.connection.confirmTransaction(tx, 'confirmed');
            console.log('✅ 交易确认成功');

            // 等待状态更新
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 获取许愿后的用户状态
            const userStateAfter = await this.program.account.userState.fetch(userStatePda);
            console.log('📊 许愿后用户状态:', {
                karmaPoints: userStateAfter.karmaPoints.toString(),
                totalWishCount: userStateAfter.totalWishCount,
                dailyWishCount: userStateAfter.dailyWishCount,
            });

            // 获取许愿账户信息
            const wishAccount = await this.program.account.wish.fetch(wishPda);
            console.log('📜 许愿账户:', {
                wishId: wishAccount.wishId.toString(),
                creator: wishAccount.creator.toString(),
                isAnonymous: wishAccount.isAnonymous,
                isFreeWish: wishAccount.isFreeWish,
                isAmuletDropped: wishAccount.isAmuletDropped,
            });

            // 计算实际变化
            const karmaPointsBefore = userStateBefore.karmaPoints.toNumber();
            const karmaPointsAfter = userStateAfter.karmaPoints.toNumber();
            const karmaPointsChange = karmaPointsAfter - karmaPointsBefore;

            // 判断是否为免费许愿（每日第一次）
            const isFreewish = wishAccount.isFreeWish;
            const reduceKarmaPoints = isFreewish ? 0 : 5; // Wish::KARMA_COST_PER_WISH = 5
            const rewardKarmaPoints = 1; // 固定奖励 1 功德

            console.log('📈 功德值变化:', {
                before: karmaPointsBefore,
                after: karmaPointsAfter,
                change: karmaPointsChange,
                expected: rewardKarmaPoints - reduceKarmaPoints,
                isFreewish,
            });

            // 从交易日志中解析御守掉落信息
            let isAmuletDropped = wishAccount.isAmuletDropped;
            try {
                const txInfo = await this.connection.getTransaction(tx, {
                    commitment: 'confirmed',
                    maxSupportedTransactionVersion: 0
                });

                if (txInfo && txInfo.meta && txInfo.meta.logMessages) {
                    console.log('📜 交易日志:', txInfo.meta.logMessages);
                    
                    // 查找包含 create_wish_result 的日志
                    for (const log of txInfo.meta.logMessages) {
                        if (log.includes('create_wish_result')) {
                            console.log('🎯 找到许愿结果日志:', log);
                        }
                        if (log.includes('恭喜！许愿时获得了') || log.includes('御守')) {
                            console.log('🎉 御守掉落:', log);
                            isAmuletDropped = true;
                        }
                    }
                }
            } catch (error) {
                console.warn('⚠️ 无法解析交易日志');
            }

            console.log('🎊 许愿结果:', {
                wishId: params.wishId,
                isFreewish,
                isAmuletDropped,
                rewardKarmaPoints,
                reduceKarmaPoints,
            });

            return {
                transactionSignature: tx,
                wishId: params.wishId,
                contentHash: params.contentHash,
                isAnonymous: params.isAnonymous,
                isFreewish,
                isAmuletDropped,
                rewardKarmaPoints,
                reduceKarmaPoints,
                currentTimestamp: Date.now() / 1000,
            };
        } catch (error: any) {
            console.error('❌ 许愿失败:', error);

            // 根据错误类型提供更具体的错误信息
            if (error.message.includes('NotEnoughKarmaPoints')) {
                throw new CreateWishError('功德值不足，无法许愿', 'NOT_ENOUGH_KARMA_POINTS');
            } else if (error.message.includes('USER_NOT_INITIALIZED')) {
                throw new CreateWishError('用户未初始化，请先进行烧香或抽签操作', 'USER_NOT_INITIALIZED');
            } else if (error.message.includes('INVALID_CONTENT_HASH')) {
                throw new CreateWishError('内容哈希格式错误', 'INVALID_CONTENT_HASH');
            } else {
                throw new CreateWishError(`许愿失败: ${error.message}`, 'CREATE_WISH_FAILED');
            }
        }
    }

    /**
     * 获取用户状态
     */
    async getUserState(userPubkey: PublicKey) {
        try {
            const userStatePda = getUserStatePda(userPubkey, this.programId);
            return await this.program.account.userState.fetch(userStatePda);
        } catch (error: any) {
            throw new CreateWishError(`获取用户状态失败: ${error.message}`, 'FETCH_USER_STATE_FAILED');
        }
    }

    /**
     * 获取许愿账户
     */
    async getWish(userPubkey: PublicKey, wishId: number) {
        try {
            const wishPda = getWishPda(userPubkey, wishId, this.programId);
            return await this.program.account.wish.fetch(wishPda);
        } catch (error: any) {
            throw new CreateWishError(`获取许愿账户失败: ${error.message}`, 'FETCH_WISH_FAILED');
        }
    }

    // PDA 函数已迁移到 @/lib/solana.ts
    // 使用统一的 PDA 计算函数，提高代码复用性和可维护性
}

/**
 * 辅助函数：生成内容哈希
 */
export function generateContentHash(content: string): number[] {
    // 使用 Web Crypto API 生成 SHA-256 哈希
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    
    // 注意：这是同步版本，实际使用时应该使用异步版本
    // 这里仅作为示例，实际项目中应该使用 crypto.subtle.digest
    // 或者使用 js-sha256 等库
    throw new Error('请使用 crypto.subtle.digest 或 js-sha256 库生成哈希');
}

/**
 * 辅助函数：生成内容哈希（异步）
 * TODO: 后续集成真正的 SHA-256 哈希（使用 crypto.subtle.digest 或 js-sha256 库）
 * 当前使用伪随机生成用于开发测试
 */
export async function generateContentHashAsync(content: string): Promise<number[]> {
    console.log('⚠️ 使用临时哈希生成方法（开发模式）');
    
    // 临时方案：基于内容生成伪哈希（32 字节）
    // 这不是真正的加密哈希，仅用于开发测试
    const hash: number[] = [];
    const contentBytes = new TextEncoder().encode(content);
    
    for (let i = 0; i < 32; i++) {
        // 使用内容、索引和时间戳生成伪随机值
        const seed = contentBytes[i % contentBytes.length] || 0;
        const value = (seed + i + Date.now()) % 256;
        hash.push(value);
    }
    
    console.log('📝 生成的内容哈希（临时）:', hash.slice(0, 8), '... (32 bytes total)');
    
    return hash;
    
    /* TODO: 后续使用真正的 SHA-256 哈希
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(content);
        
        // 尝试使用 Web Crypto API
        let cryptoObj: any = null;
        if (typeof window !== 'undefined' && window.crypto) {
            cryptoObj = window.crypto;
        } else if (typeof globalThis !== 'undefined' && globalThis.crypto) {
            cryptoObj = globalThis.crypto;
        }
        
        if (cryptoObj && cryptoObj.subtle) {
            const hashBuffer = await cryptoObj.subtle.digest('SHA-256', data);
            return Array.from(new Uint8Array(hashBuffer));
        }
        
        // 或者使用 js-sha256 库
        // import sha256 from 'js-sha256';
        // const hash = sha256.array(content);
        // return hash;
        
    } catch (error) {
        console.error('SHA-256 哈希生成失败:', error);
    }
    */
}
