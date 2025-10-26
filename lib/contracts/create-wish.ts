import {
    Connection,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
    LAMPORTS_PER_SOL,
    SYSVAR_RENT_PUBKEY,
    SystemProgram
} from '@solana/web3.js';
import { Program, AnchorProvider, Wallet, Idl } from '@coral-xyz/anchor';
import { BN } from 'bn.js';
import {
    createConnection,
    createProgram,
    getTempleConfigPda,
    getGlobalStatsPda,
    getUserStatePda,
    getUserIncenseStatePda,
    getAssociatedTokenAddress,
    CURRENT_NETWORK,
    NETWORK_CONFIG
} from '../solana';
import { Temple } from '../../types/temple';

// 许愿参数接口
export interface CreateWishParams {
    contentHash: number[]; // [u8; 32]
    isAnonymous: boolean;
}

// 许愿结果接口
export interface CreateWishResult {
    transactionSignature: string;
    wishId: number;
    timestamp: number;
    amuletDropped: boolean;
    amuletType?: number;
    // 用户状态信息
    userTotalWishes?: number;
    userMerit?: number;
    userIncensePoints?: number;
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
        this.programId = new PublicKey(NETWORK_CONFIG[CURRENT_NETWORK as keyof typeof NETWORK_CONFIG].programId);
    }

    // 检查用户是否已初始化
    async isUserInitialized(userPubkey: PublicKey): Promise<boolean> {
        try {
            const userStatePda = this.getUserStatePda(userPubkey);
            await this.program.account.userState.fetch(userStatePda);
            return true;
        } catch {
            return false;
        }
    }

    // 初始化用户
    async initializeUser(userPubkey: PublicKey): Promise<string | undefined> {
        try {
            // 再次检查用户是否已初始化，避免重复初始化
            if (await this.isUserInitialized(userPubkey)) {
                console.log('用户已经初始化，跳过初始化步骤');
                return 'User already initialized';
            }

            const userStatePda = this.getUserStatePda(userPubkey);
            const userIncenseStatePda = this.getUserIncenseStatePda(userPubkey);
            const userMedalStatePda = this.getUserMedalStatePda(userPubkey);
            const userDonationStatePda = this.getUserDonationStatePda(userPubkey);

            const tx = await (this.program.methods as any)
                .initUser()
                .accounts({
                    user: userPubkey,
                    userState: userStatePda,
                    userIncenseState: userIncenseStatePda,
                    userMedalState: userMedalStatePda,
                    userDonationState: userDonationStatePda,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            console.log('用户初始化成功:', tx);
            return tx;
        } catch (error: any) {
            console.error('用户初始化失败:', error);
            throw new CreateWishError(`用户初始化失败: ${error.message}`, 'USER_INITIALIZATION_FAILED');
        }
    }

    // 创建许愿
    async createWish(userPubkey: PublicKey, params: CreateWishParams): Promise<CreateWishResult | undefined> {
        try {
            console.log('开始创建许愿...', { user: userPubkey.toString(), params });

            // 确保用户已初始化
            if (!(await this.isUserInitialized(userPubkey))) {
                console.log('用户未初始化，开始初始化...');
                try {
                    await this.initializeUser(userPubkey);
                } catch (initError: any) {
                    // 如果初始化失败但是因为用户已经初始化，继续执行
                    if (initError.message && initError.message.includes('already been processed')) {
                        console.log('用户可能已经初始化，继续执行许愿...');
                    } else {
                        throw initError;
                    }
                }
            }

            // 获取必要的账户地址
            const templeConfigPda = this.getTempleConfigPda();
            const userStatePda = this.getUserStatePda(userPubkey);
            const userIncenseStatePda = this.getUserIncenseStatePda(userPubkey);
            const globalStatsPda = this.getGlobalStatsPda();

            // 获取许愿前的用户状态（用于对比）
            let userIncenseStateBefore = null;
            let userStateBefore = null;
            try {
                userIncenseStateBefore = await this.program.account.userIncenseState.fetch(userIncenseStatePda);
                userStateBefore = await this.program.account.userState.fetch(userStatePda);
                console.log('成功获取许愿前状态');
            } catch (error) {
                console.log('无法获取许愿前状态，可能是第一次许愿');
            }

            // 检查用户是否已初始化
            try {
                const userState = await this.program.account.userState.fetch(userStatePda);
                console.log('用户状态已初始化:', userState);
            } catch (error) {
                throw new CreateWishError('用户未初始化，请先进行烧香操作', 'USER_NOT_INITIALIZED');
            }

            // 检查寺庙配置是否存在
            try {
                const templeConfig = await this.program.account.templeConfig.fetch(templeConfigPda);
                console.log('寺庙配置已存在:', templeConfig);
            } catch (error) {
                throw new CreateWishError('寺庙配置未找到', 'TEMPLE_CONFIG_NOT_FOUND');
            }

            // 计算许愿相关账户 - 使用当前值，指令内部会递增
            const totalWishes = userIncenseStateBefore ? userIncenseStateBefore.totalWishes : 0;
            const expectedWishId = totalWishes + 1;
            const wishPda = this.getWishPda(userPubkey, expectedWishId);
            const wishTowerPda = this.getWishTowerPda(userPubkey);

            // 构建许愿交易账户结构
            // 按照 create_wish.rs 的账户顺序：
            // user, wish_account, wish_tower_account, user_state, user_incense_state, temple_config, global_stats, system_program
            const accounts: any = {
                user: userPubkey,
                wishAccount: wishPda,
                wishTowerAccount: wishTowerPda,
                userState: userStatePda,
                userIncenseState: userIncenseStatePda,
                templeConfig: templeConfigPda,
                globalStats: globalStatsPda,
                systemProgram: SystemProgram.programId,
            };

            console.log('许愿账户结构:', {
                user: userPubkey.toString(),
                wishAccount: wishPda.toString(),
                wishTowerAccount: wishTowerPda.toString(),
                userState: userStatePda.toString(),
                userIncenseState: userIncenseStatePda.toString(),
                templeConfig: templeConfigPda.toString(),
                globalStats: globalStatsPda.toString(),
                systemProgram: SystemProgram.programId.toString(),
            });

            let tx: string | undefined;
            try {
                // 确保参数类型正确
                const contentHash = params.contentHash;
                const isAnonymous = Boolean(params.isAnonymous);

                console.log('许愿参数:', {
                    contentHash,
                    isAnonymous
                });

                // 检查程序是否正确初始化
                console.log('程序ID:', this.programId.toString());
                console.log('程序方法:', Object.keys(this.program.methods));

                // 使用与测试文件完全相同的调用方式
                tx = await this.program.methods
                    .createWish(
                        contentHash,
                        isAnonymous
                    )
                    .accounts(accounts)
                    .rpc({
                        skipPreflight: true,  // 跳过预检查，减少模拟失败
                        preflightCommitment: 'processed',
                        commitment: 'confirmed',
                        maxRetries: 3
                    });

                console.log('许愿交易提交成功:', tx);

                // 等待交易确认
                const confirmation = await this.connection.confirmTransaction(tx, 'confirmed');
                if (confirmation.value.err) {
                    throw new Error(`交易确认失败: ${JSON.stringify(confirmation.value.err)}`);
                }

                console.log('交易确认成功');

                // 等待一段时间确保交易完全确认
                await new Promise(resolve => setTimeout(resolve, 2000));

                // 获取许愿后的用户状态
                let userIncenseStateAfter = null;
                try {
                    userIncenseStateAfter = await this.program.account.userIncenseState.fetch(userIncenseStatePda);
                    console.log('成功获取许愿后状态');
                } catch (error) {
                    console.log('无法获取许愿后状态');
                }

                // 获取许愿账户信息
                let wishAccount = null;
                try {
                    wishAccount = await this.program.account.wish.fetch(wishPda);
                    console.log('成功获取许愿账户信息');
                } catch (error) {
                    console.log('无法获取许愿账户信息');
                }

                // 获取许愿后的用户状态（检查是否获得护身符）
                let userStateAfter = null;
                try {
                    userStateAfter = await this.program.account.userState.fetch(userStatePda);
                    console.log('成功获取许愿后用户状态');
                } catch (error) {
                    console.log('无法获取许愿后用户状态');
                }

                // 打印许愿前后状态对比
                console.log('=== 许愿前后用户状态对比 ===');
                console.log('许愿前状态:', userIncenseStateBefore ? {
                    merit: userIncenseStateBefore.merit.toString(),
                    incensePoints: userIncenseStateBefore.incensePoints.toString(),
                    totalWishes: userIncenseStateBefore.totalWishes,
                    totalDraws: userIncenseStateBefore.totalDraws,
                    incenseNumber: userIncenseStateBefore.incenseNumber,
                    title: userIncenseStateBefore.title
                } : '首次许愿，无之前状态');

                console.log('许愿后状态:', userIncenseStateAfter ? {
                    merit: userIncenseStateAfter.merit.toString(),
                    incensePoints: userIncenseStateAfter.incensePoints.toString(),
                    totalWishes: userIncenseStateAfter.totalWishes,
                    totalDraws: userIncenseStateAfter.totalDraws,
                    incenseNumber: userIncenseStateAfter.incenseNumber,
                    title: userIncenseStateAfter.title
                } : '无法获取许愿后状态');

                // 计算实际变化
                const actualMeritGained = userIncenseStateBefore && userIncenseStateAfter ?
                    userIncenseStateAfter.merit.toNumber() - userIncenseStateBefore.merit.toNumber() :
                    (userIncenseStateAfter ? userIncenseStateAfter.merit.toNumber() : 0);

                const actualIncensePointsGained = userIncenseStateBefore && userIncenseStateAfter ?
                    userIncenseStateAfter.incensePoints.toNumber() - userIncenseStateBefore.incensePoints.toNumber() :
                    (userIncenseStateAfter ? userIncenseStateAfter.incensePoints.toNumber() : 0);

                const actualWishesGained = userIncenseStateBefore && userIncenseStateAfter ?
                    userIncenseStateAfter.totalWishes - userIncenseStateBefore.totalWishes :
                    (userIncenseStateAfter ? userIncenseStateAfter.totalWishes : 0);

                console.log('实际获得的功德:', actualMeritGained);
                console.log('实际获得的香火点:', actualIncensePointsGained);
                console.log('总许愿次数:', userIncenseStateAfter ? userIncenseStateAfter.totalWishes : 0);
                console.log('许愿次数增加:', actualWishesGained);

                // 从交易日志中提取护身符掉落信息
                let amuletDropped = false;
                let amuletType = undefined;
                try {
                    const txInfo = await this.connection.getTransaction(tx, {
                        commitment: 'confirmed'
                    });

                    if (txInfo && txInfo.meta && txInfo.meta.logMessages) {
                        console.log('交易日志:', txInfo.meta.logMessages);

                        for (const log of txInfo.meta.logMessages) {
                            if (log.includes('Congratulations! Got') && log.includes('Protection Amulet')) {
                                amuletDropped = true;
                                amuletType = 1; // Protection Amulet
                                console.log('检测到护身符掉落:', log);
                            }
                        }
                    }
                } catch (error) {
                    console.log('无法解析交易日志，使用默认值');
                }

                const result: CreateWishResult = {
                    transactionSignature: tx,
                    wishId: wishAccount ? wishAccount.id.toNumber() : expectedWishId,
                    timestamp: Date.now(),
                    amuletDropped: amuletDropped,
                    amuletType: amuletType, // 从日志中提取的护身符类型
                    userTotalWishes: userIncenseStateAfter ? userIncenseStateAfter.totalWishes : undefined,
                    userMerit: userIncenseStateAfter ? userIncenseStateAfter.merit.toNumber() : undefined,
                    userIncensePoints: userIncenseStateAfter ? userIncenseStateAfter.incensePoints.toNumber() : undefined,
                };

                // 确保交易签名存在
                if (!tx) {
                    throw new CreateWishError('交易失败，无法获取交易签名', 'NO_TRANSACTION_SIGNATURE');
                }

                console.log('许愿成功完成:', result);
                return result;

            } catch (error: any) {
                // 处理重复交易错误
                if (error.message && error.message.includes('already been processed')) {
                    console.log('检测到重复交易，查找最近的许愿交易...');

                    try {
                        // 获取最近的交易记录
                        const signatures = await this.connection.getSignaturesForAddress(userPubkey, { limit: 3 });

                        for (const sig of signatures) {
                            const txInfo = await this.connection.getTransaction(sig.signature, { commitment: 'confirmed' });

                            // 检查是否是成功的许愿交易
                            if (txInfo && !txInfo.meta?.err &&
                                txInfo.meta?.logMessages?.some(log =>
                                    log.includes('Wish created') || log.includes('Wish ID:')
                                )) {
                                console.log('找到成功的许愿交易:', sig.signature);
                                tx = sig.signature;
                                break;
                            }
                        }

                        // 如果没找到成功交易，抛出原始错误
                        if (!tx) {
                            throw error;
                        }

                        // 如果找到了成功的交易，也需要获取状态变化
                        console.log('重复交易处理：获取许愿后状态...');
                        try {
                            const userIncenseStateAfter = await this.program.account.userIncenseState.fetch(userIncenseStatePda);
                            const wishAccount = await this.program.account.wish.fetch(wishPda);

                            console.log('=== 重复交易处理：许愿前后状态对比 ===');
                            console.log('许愿前状态:', userIncenseStateBefore ? {
                                merit: userIncenseStateBefore.merit.toString(),
                                incensePoints: userIncenseStateBefore.incensePoints.toString(),
                                totalWishes: userIncenseStateBefore.totalWishes,
                                totalDraws: userIncenseStateBefore.totalDraws,
                                incenseNumber: userIncenseStateBefore.incenseNumber,
                                title: userIncenseStateBefore.title
                            } : '首次许愿，无之前状态');

                            console.log('许愿后状态:', {
                                merit: userIncenseStateAfter.merit.toString(),
                                incensePoints: userIncenseStateAfter.incensePoints.toString(),
                                totalWishes: userIncenseStateAfter.totalWishes,
                                totalDraws: userIncenseStateAfter.totalDraws,
                                incenseNumber: userIncenseStateAfter.incenseNumber,
                                title: userIncenseStateAfter.title
                            });

                            // 计算实际变化
                            const actualMeritGained = userIncenseStateBefore ?
                                userIncenseStateAfter.merit.toNumber() - userIncenseStateBefore.merit.toNumber() :
                                userIncenseStateAfter.merit.toNumber();

                            const actualIncensePointsGained = userIncenseStateBefore ?
                                userIncenseStateAfter.incensePoints.toNumber() - userIncenseStateBefore.incensePoints.toNumber() :
                                userIncenseStateAfter.incensePoints.toNumber();

                            const actualWishesGained = userIncenseStateBefore ?
                                userIncenseStateAfter.totalWishes - userIncenseStateBefore.totalWishes :
                                userIncenseStateAfter.totalWishes;

                            console.log('实际获得的功德:', actualMeritGained);
                            console.log('实际获得的香火点:', actualIncensePointsGained);
                            console.log('总许愿次数:', userIncenseStateAfter.totalWishes);
                            console.log('许愿次数增加:', actualWishesGained);
                            console.log('许愿ID:', wishAccount.id.toNumber());
                        } catch (stateError) {
                            console.log('重复交易处理：无法获取状态信息');
                        }
                    } catch (fallbackError) {
                        throw error; // 查找失败，抛出原始错误
                    }
                } else {
                    console.error('许愿交易失败:', error);

                    // 解析 Anchor 错误
                    if (error.message && error.message.includes('AnchorError')) {
                        const errorMatch = error.message.match(/Error Code: (\w+)/);
                        if (errorMatch) {
                            const errorCode = errorMatch[1];
                            throw new CreateWishError(`许愿失败: ${errorCode}`, errorCode);
                        }
                    }

                    throw new CreateWishError(`许愿失败: ${error.message}`, 'CREATE_WISH_FAILED');
                }
            }

        } catch (error: any) {
            console.error('许愿过程失败:', error);
            if (error instanceof CreateWishError) {
                throw error;
            }
            throw new CreateWishError(`许愿过程失败: ${error.message}`, 'CREATE_WISH_PROCESS_FAILED');
        }
    }

    // 获取寺庙配置 PDA
    private getTempleConfigPda(): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from("temple_v1")],
            this.programId
        );
        return pda;
    }

    // 获取全局统计 PDA
    private getGlobalStatsPda(): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from("global_stats_v1")],
            this.programId
        );
        return pda;
    }

    // 获取用户状态 PDA
    private getUserStatePda(userPubkey: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from("user_state"), userPubkey.toBuffer()],
            this.programId
        );
        return pda;
    }

    // 获取用户香火状态 PDA
    private getUserIncenseStatePda(userPubkey: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from("user_incense"), userPubkey.toBuffer()],
            this.programId
        );
        return pda;
    }

    // 获取用户勋章状态 PDA
    private getUserMedalStatePda(userPubkey: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from("user_medal"), userPubkey.toBuffer()],
            this.programId
        );
        return pda;
    }

    // 获取用户捐赠状态 PDA
    private getUserDonationStatePda(userPubkey: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from("user_donation"), userPubkey.toBuffer()],
            this.programId
        );
        return pda;
    }

    // 获取许愿 PDA
    private getWishPda(userPubkey: PublicKey, wishId: number): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("wish"),
                userPubkey.toBuffer(),
                Buffer.from(wishId.toString())
            ],
            this.programId
        );
        return pda;
    }

    // 获取许愿塔 PDA
    private getWishTowerPda(userPubkey: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("wish_tower"),
                userPubkey.toBuffer()
            ],
            this.programId
        );
        return pda;
    }
}
