import {
    Connection,
    PublicKey,
    LAMPORTS_PER_SOL,
    SYSVAR_RENT_PUBKEY,
    SystemProgram
} from '@solana/web3.js';
import { Program, AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { BN } from 'bn.js';
import {
    createConnection,
    createProgram,
    CURRENT_NETWORK,
    NETWORK_CONFIG,
    getTempleConfigPda,
    getUserStatePda,
    getIncenseTypeConfigPda,
    getIncenseNftMintPda,
    getAssociatedTokenAddressSync,
    getMetadataPda
} from '../solana';
import { Temple } from '../../types/temple';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

// 简化版烧香参数接口
export interface BurnIncenseSimpliedParams {
    incenseTypeId: number;  // 香型ID (1-6)
    amount: number;         // 数量 (1-10)
    paymentAmount: number;  // 支付金额 (lamports)
}

// 简化版烧香结果接口
export interface BurnIncenseSimpliedResult {
    transactionSignature: string;
    rewardIncenseValue: number;   // 奖励的香火值
    rewardKarmaPoints: number;    // 奖励的功德值
    incenseTypeId: number;        // 香型ID
    amount: number;               // 烧香数量
    paymentAmount: number;        // 支付金额
    currentTimestamp: number;     // 当前时间戳
}

// 烧香错误类型
export class BurnIncenseSimpliedError extends Error {
    constructor(message: string, public code?: string) {
        super(message);
        this.name = 'BurnIncenseSimpliedError';
    }
}

// Token Metadata Program ID
const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

// 简化版烧香合约调用类
export class BurnIncenseSimpliedContract {
    private program: Program<Temple>;
    private connection: Connection;
    private programId: PublicKey;

    constructor(wallet: Wallet) {
        this.program = createProgram(wallet);
        this.connection = createConnection();
        this.programId = new PublicKey(NETWORK_CONFIG[CURRENT_NETWORK as keyof typeof NETWORK_CONFIG].programId);
    }

    /**
     * 简化版烧香主函数
     * 基于测试文件 burnIncenseSimplied 实现
     */
    async burnIncenseSimplied(
        userPubkey: PublicKey,
        params: BurnIncenseSimpliedParams
    ): Promise<BurnIncenseSimpliedResult> {
        try {
            console.log('🔥 开始简化版烧香流程...');
            console.log('参数:', params);

            // 参数验证
            if (params.amount < 1 || params.amount > 10) {
                throw new BurnIncenseSimpliedError('烧香数量必须在 1-10 之间', 'INVALID_AMOUNT');
            }

            // 获取必要的 PDA 地址 - 使用统一的 PDA 函数
            const templeConfigPda = getTempleConfigPda(this.programId);
            const incenseTypeConfigPda = getIncenseTypeConfigPda(params.incenseTypeId, this.programId);
            const userStatePda = getUserStatePda(userPubkey, this.programId);
            const incenseNftMintPda = getIncenseNftMintPda(params.incenseTypeId, this.programId);
            const userNftAssociatedTokenAccount = getAssociatedTokenAddressSync(
                incenseNftMintPda,
                userPubkey
            );
            const nftMetadataPda = getMetadataPda(incenseNftMintPda);

            // 获取寺庙配置以获取权限账户
            const templeConfig = await this.getTempleConfig();
            const templeAuthority = templeConfig.authority;

            console.log('📍 账户地址:', {
                templeConfig: templeConfigPda.toString(),
                incenseTypeConfig: incenseTypeConfigPda.toString(),
                userState: userStatePda.toString(),
                nftMint: incenseNftMintPda.toString(),
                templeAuthority: templeAuthority.toString(),
            });

            // 获取烧香前的用户状态
            let userStateBefore: any = null;
            try {
                userStateBefore = await this.program.account.userState.fetch(userStatePda);
                console.log('📊 烧香前用户状态:', {
                    karmaPoints: userStateBefore.karmaPoints.toString(),
                    totalIncenseValue: userStateBefore.totalIncenseValue.toString(),
                });
            } catch (error) {
                console.log('📊 用户状态不存在，将在烧香时自动初始化');
            }

            // 调用简化版烧香指令 - 完全按照测试文件的方式
            console.log('📤 发送烧香交易...');
            const tx = await (this.program.methods as any)
                .burnIncenseSimplied(
                    params.incenseTypeId,
                    params.amount,
                    new BN(params.paymentAmount)
                )
                .accounts({
                    user: userPubkey,
                    incenseTypeConfig: incenseTypeConfigPda,
                    templeAuthority: templeAuthority,
                    nftMintAccount: incenseNftMintPda,
                })
                .rpc();

            console.log('✅ 烧香交易提交成功:', tx);

            // 等待交易确认
            await this.connection.confirmTransaction(tx, 'confirmed');
            console.log('✅ 交易确认成功');

            // 等待状态更新
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 获取烧香后的用户状态
            const userStateAfter = await this.program.account.userState.fetch(userStatePda);
            console.log('📊 烧香后用户状态:', {
                karmaPoints: userStateAfter.karmaPoints.toString(),
                totalIncenseValue: userStateAfter.totalIncenseValue.toString(),
                dailyBurnCount: userStateAfter.dailyBurnCount,
                totalBurnCount: userStateAfter.totalBurnCount,
            });

            // 计算实际奖励
            let rewardKarmaPoints = 0;
            let rewardIncenseValue = 0;

            if (userStateBefore) {
                rewardKarmaPoints = userStateAfter.karmaPoints.sub(userStateBefore.karmaPoints).toNumber();
                rewardIncenseValue = userStateAfter.totalIncenseValue.sub(userStateBefore.totalIncenseValue).toNumber();
            } else {
                rewardKarmaPoints = userStateAfter.karmaPoints.toNumber();
                rewardIncenseValue = userStateAfter.totalIncenseValue.toNumber();
            }

            console.log('🎁 获得奖励:', {
                karmaPoints: rewardKarmaPoints,
                incenseValue: rewardIncenseValue,
            });

            // 验证NFT是否铸造成功
            try {
                const nftAccountInfo = await this.connection.getTokenAccountBalance(userNftAssociatedTokenAccount);
                console.log('🎨 NFT铸造成功，余额:', nftAccountInfo.value.amount);
            } catch (error) {
                console.log('⚠️ 无法验证NFT:', error);
            }

            return {
                transactionSignature: tx,
                rewardIncenseValue,
                rewardKarmaPoints,
                incenseTypeId: params.incenseTypeId,
                amount: params.amount,
                paymentAmount: params.paymentAmount,
                currentTimestamp: Date.now() / 1000,
            };
        } catch (error: any) {
            console.error('❌ 简化版烧香失败:', error);

            // 根据错误类型提供更具体的错误信息
            if (error.message.includes('insufficient funds')) {
                throw new BurnIncenseSimpliedError('余额不足，无法完成烧香', 'INSUFFICIENT_BALANCE');
            } else if (error.message.includes('InvalidAmount')) {
                throw new BurnIncenseSimpliedError('烧香数量无效', 'INVALID_AMOUNT');
            } else if (error.message.includes('InvalidPaymentAmount')) {
                throw new BurnIncenseSimpliedError('支付金额不正确', 'INVALID_PAYMENT_AMOUNT');
            } else if (error.message.includes('DailyBurnLimitExceeded')) {
                throw new BurnIncenseSimpliedError('今日烧香次数已达上限', 'DAILY_BURN_LIMIT_EXCEEDED');
            } else if (error.message.includes('InactiveIncenseType')) {
                throw new BurnIncenseSimpliedError('该香型未激活', 'INACTIVE_INCENSE_TYPE');
            } else {
                throw new BurnIncenseSimpliedError(`烧香失败: ${error.message}`, 'BURN_INCENSE_FAILED');
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
            throw new BurnIncenseSimpliedError(`获取用户状态失败: ${error.message}`, 'FETCH_USER_STATE_FAILED');
        }
    }

    /**
     * 获取寺庙配置
     */
    async getTempleConfig() {
        try {
            const templeConfigPda = getTempleConfigPda(this.programId);
            return await this.program.account.templeConfig.fetch(templeConfigPda);
        } catch (error: any) {
            throw new BurnIncenseSimpliedError(`获取寺庙配置失败: ${error.message}`, 'FETCH_TEMPLE_CONFIG_FAILED');
        }
    }

    /**
     * 获取香型配置
     */
    async getIncenseTypeConfig(incenseTypeId: number) {
        try {
            const incenseTypeConfigPda = getIncenseTypeConfigPda(incenseTypeId, this.programId);
            return await this.program.account.incenseTypeConfig.fetch(incenseTypeConfigPda);
        } catch (error: any) {
            throw new BurnIncenseSimpliedError(`获取香型配置失败: ${error.message}`, 'FETCH_INCENSE_TYPE_CONFIG_FAILED');
        }
    }

    /**
     * 检查用户余额是否足够
     */
    async checkUserBalance(userPubkey: PublicKey, requiredLamports: number): Promise<boolean> {
        try {
            const balance = await this.connection.getBalance(userPubkey);
            return balance >= requiredLamports;
        } catch (error: any) {
            throw new BurnIncenseSimpliedError(`检查余额失败: ${error.message}`, 'CHECK_BALANCE_FAILED');
        }
    }

    // PDA 函数已迁移到 @/lib/solana.ts
    // 使用统一的 PDA 计算函数，提高代码复用性和可维护性
}
