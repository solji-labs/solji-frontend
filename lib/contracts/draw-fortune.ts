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
    getNftMintPda,
    getMetadataPda,
    getAssociatedTokenAddress,
    CURRENT_NETWORK,
    NETWORK_CONFIG
} from '../solana';
import { Temple } from '../../types/temple';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

// 抽签参数接口
export interface DrawFortuneParams {
    useMerit: boolean;
    hasFortuneAmulet?: boolean;
    hasProtectionAmulet?: boolean;
}

// 抽签结果接口
export interface DrawFortuneResult {
    transactionSignature: string;
    fortune: string;
    timestamp: number;
    usedMerit: boolean;
    meritEarned: number;
    nftMinted: boolean;
    nftMintAddress?: string;
    amuletDropped?: boolean;
    amuletType?: number;
    // 用户状态信息
    userTotalDraws?: number;
    userDailyDrawCount?: number;
    userMerit?: number;
    userIncensePoints?: number;
}

// 抽签错误类型
export class DrawFortuneError extends Error {
    constructor(message: string, public code?: string) {
        super(message);
        this.name = 'DrawFortuneError';
    }
}

// 抽签合约调用类
export class DrawFortuneContract {
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
    async initializeUser(userPubkey: PublicKey): Promise<string> {
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
                    userState: userStatePda,
                    userIncenseState: userIncenseStatePda,
                    userMedalState: userMedalStatePda,
                    userDonationState: userDonationStatePda,
                    user: userPubkey,
                    systemProgram: SystemProgram.programId
                })
                .rpc({
                    skipPreflight: true,
                    preflightCommitment: 'processed',
                    commitment: 'confirmed',
                    maxRetries: 3
                });

            return tx;
        } catch (error: any) {
            // 检查是否是重复交易错误
            if (error.message && error.message.includes('already been processed')) {
                console.log('用户可能已经初始化，跳过错误');
                return 'User initialization may have already completed';
            }
            throw new DrawFortuneError(`初始化用户失败: ${error.message}`, 'INIT_USER_FAILED');
        }
    }

    // 抽签主函数
    async drawFortune(
        userPubkey: PublicKey,
        params: DrawFortuneParams
    ): Promise<DrawFortuneResult> {
        try {
            // 添加小延迟避免重复交易
            await new Promise(resolve => setTimeout(resolve, 100));

            // 检查寺庙配置是否存在，如果不存在则创建
            try {
                await this.getTempleConfig();
                console.log('寺庙配置存在');
            } catch (error: any) {
                console.log('寺庙配置不存在，正在创建...');
                await this.createTempleConfig(userPubkey);
            }

            // 检查用户是否已初始化
            if (!(await this.isUserInitialized(userPubkey))) {
                console.log('用户未初始化，正在初始化...');
                try {
                    await this.initializeUser(userPubkey);
                } catch (initError: any) {
                    // 如果初始化失败但是因为用户已经初始化，继续执行
                    if (initError.message && initError.message.includes('already been processed')) {
                        console.log('用户可能已经初始化，继续执行抽签...');
                    } else {
                        throw initError;
                    }
                }
            }

            // 获取抽签前的用户状态（用于对比）
            let userIncenseStateBefore = null;
            try {
                const userIncenseStatePda = this.getUserIncenseStatePda(userPubkey);
                userIncenseStateBefore = await this.program.account.userIncenseState.fetch(userIncenseStatePda);
                console.log('成功获取抽签前状态');
            } catch (error) {
                console.log('无法获取抽签前状态，可能是第一次抽签');
            }

            // 获取必要的账户地址
            const templeConfigPda = this.getTempleConfigPda();
            const userStatePda = this.getUserStatePda(userPubkey);
            const userIncenseStatePda = this.getUserIncenseStatePda(userPubkey);

            // 检查用户是否已初始化
            try {
                const userState = await this.program.account.userState.fetch(userStatePda);
                console.log('用户状态已初始化:', userState);
            } catch (error) {
                throw new DrawFortuneError('用户未初始化，请先进行烧香操作', 'USER_NOT_INITIALIZED');
            }

            // 检查寺庙配置是否存在
            try {
                const templeConfig = await this.program.account.templeConfig.fetch(templeConfigPda);
                console.log('寺庙配置已存在:', templeConfig);
            } catch (error) {
                throw new DrawFortuneError('寺庙配置未找到', 'TEMPLE_CONFIG_NOT_FOUND');
            }


            // 计算Fortune NFT相关账户 - 使用当前值，指令内部会递增
            const totalDraws = userIncenseStateBefore ? userIncenseStateBefore.totalDraws : 0;
            const fortuneNftPda = this.getFortuneNftPda(userPubkey, totalDraws);
            const fortuneNftMintPda = this.getFortuneNftMintPda(userPubkey, totalDraws);
            const fortuneNftTokenAccount = await this.getAssociatedTokenAddress(fortuneNftMintPda, userPubkey);
            const fortuneNftMetadata = this.getMetadataPda(fortuneNftMintPda);

            // 构建抽签交易账户结构
            // 注意：在 devnet/mainnet 环境中，需要在 fortuneNftMetadata 和 tokenProgram 之间添加 randomnessAccount
            // 这是 Rust 代码的条件编译导致的：#[cfg(not(feature = "localnet"))]

            // user: user.publicKey,
            // userState: userStatePda,
            // userIncenseState: userIncenseStatePda,
            // templeConfig: this.templeConfigPda,
            // fortuneNftAccount: fortuneNftPda,
            // fortuneNftMint: fortuneNftMintPda,
            // fortuneNftTokenAccount,
            // fortuneNftMetadata: metaAccount,
            // tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            // tokenMetadataProgram: this.TOKEN_METADATA_PROGRAM_ID,
            // associatedTokenProgram: this.ASSOCIATED_TOKEN_PROGRAM_ID,
            // systemProgram: anchor.web3.SystemProgram.programId,
            // rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            const accounts: any = {
                user: userPubkey,
                userState: userStatePda,
                userIncenseState: userIncenseStatePda,
                templeConfig: templeConfigPda,
                fortuneNftAccount: fortuneNftPda,
                fortuneNftMint: fortuneNftMintPda,
                fortuneNftTokenAccount: fortuneNftTokenAccount,
                fortuneNftMetadata: fortuneNftMetadata,
                // Devnet 环境下需要传入 randomnessAccount
                // randomnessAccount: TOKEN_PROGRAM_ID,
                tokenProgram: TOKEN_PROGRAM_ID,
                tokenMetadataProgram: new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
                associatedTokenProgram: new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
                systemProgram: SystemProgram.programId,
                rent: SYSVAR_RENT_PUBKEY,
            };

            console.log('抽签账户结构（devnet 需要 randomnessAccount）:', {
                user: userPubkey.toString(),
                userState: userStatePda.toString(),
                userIncenseState: userIncenseStatePda.toString(),
                templeConfig: templeConfigPda.toString(),
                fortuneNftAccount: fortuneNftPda.toString(),
                fortuneNftMint: fortuneNftMintPda.toString(),
                fortuneNftTokenAccount: fortuneNftTokenAccount.toString(),
                fortuneNftMetadata: fortuneNftMetadata.toString(),
                tokenProgram: TOKEN_PROGRAM_ID.toString(),
                tokenMetadataProgram: new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toString(),
                associatedTokenProgram: new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL').toString(),
                systemProgram: SystemProgram.programId.toString(),
                rent: SYSVAR_RENT_PUBKEY.toString(),
            });

            // 验证关键程序 ID
            console.log('程序 ID 验证:', {
                'TOKEN_PROGRAM_ID': TOKEN_PROGRAM_ID.toString(),
                '期望': 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
                '匹配': TOKEN_PROGRAM_ID.toString() === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
            });

            let tx: string | undefined;
            try {
                // 确保参数类型正确
                const useMerit = Boolean(params.useMerit);
                const hasFortuneAmulet = Boolean(params.hasFortuneAmulet || false);
                const hasProtectionAmulet = Boolean(params.hasProtectionAmulet || false);

                console.log('抽签参数:', {
                    useMerit,
                    hasFortuneAmulet,
                    hasProtectionAmulet
                });

                // 检查程序是否正确初始化
                console.log('程序ID:', this.programId.toString());
                console.log('程序方法:', Object.keys(this.program.methods));

                // 使用与 burn-incense.ts 完全相同的调用方式
                tx = await this.program.methods
                    .drawFortune(
                        useMerit,
                        hasFortuneAmulet,
                        hasProtectionAmulet
                    )
                    .accounts(accounts)
                    .rpc({
                        skipPreflight: true,  // 跳过预检查，减少模拟失败
                        preflightCommitment: 'processed',
                        commitment: 'confirmed',
                        maxRetries: 3
                    });

                console.log('抽签交易提交成功:', tx);

                // 等待交易确认
                const confirmation = await this.connection.confirmTransaction(tx, 'confirmed');
                if (confirmation.value.err) {
                    throw new Error(`交易确认失败: ${JSON.stringify(confirmation.value.err)}`);
                }

                console.log('交易确认成功');

                // 验证交易是否真正成功
                const txInfo = await this.connection.getTransaction(tx, {
                    commitment: 'confirmed'
                });

                if (txInfo && txInfo.meta && txInfo.meta.err) {
                    throw new Error(`交易执行失败: ${JSON.stringify(txInfo.meta.err)}`);
                }

                console.log('交易验证成功，开始检查用户状态变化');

                // 打印交易日志
                if (txInfo && txInfo.meta && txInfo.meta.logMessages) {
                    console.log('交易日志:', txInfo.meta.logMessages);
                }

            } catch (error: any) {
                // 处理重复交易错误
                if (error.message && error.message.includes('already been processed')) {
                    console.log('检测到重复交易，查找最近的抽签交易...');

                    try {
                        // 获取最近的交易记录
                        const signatures = await this.connection.getSignaturesForAddress(userPubkey, { limit: 3 });

                        for (const sig of signatures) {
                            const txInfo = await this.connection.getTransaction(sig.signature, { commitment: 'confirmed' });

                            // 检查是否是成功的抽签交易
                            if (txInfo && !txInfo.meta?.err &&
                                txInfo.meta?.logMessages?.some(log =>
                                    log.includes('Draw result:') || log.includes('Fortune NFT minted')
                                )) {
                                console.log('找到成功的抽签交易:', sig.signature);
                                tx = sig.signature;
                                break;
                            }
                        }

                        // 如果没找到成功交易，抛出原始错误
                        if (!tx) {
                            throw error;
                        }
                    } catch (fallbackError) {
                        throw error; // 查找失败，抛出原始错误
                    }
                } else {
                    throw error;
                }
            }

            // 确保交易签名存在
            if (!tx) {
                throw new DrawFortuneError('交易失败，无法获取交易签名', 'NO_TRANSACTION_SIGNATURE');
            }

            // 等待一段时间确保交易完全确认
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 获取抽签后的用户状态
            const userIncenseStateAfter = await this.program.account.userIncenseState.fetch(userIncenseStatePda);

            console.log('=== 抽签前后用户状态对比 ===');
            console.log('抽签前状态:', userIncenseStateBefore ? {
                merit: userIncenseStateBefore.merit.toString(),
                incensePoints: userIncenseStateBefore.incensePoints.toString(),
                totalDraws: userIncenseStateBefore.totalDraws,
                dailyDrawCount: userIncenseStateBefore.dailyDrawCount
            } : '首次抽签，无之前状态');

            console.log('抽签后状态:', {
                merit: userIncenseStateAfter.merit.toString(),
                incensePoints: userIncenseStateAfter.incensePoints.toString(),
                totalDraws: userIncenseStateAfter.totalDraws,
                dailyDrawCount: userIncenseStateAfter.dailyDrawCount
            });

            // 计算实际变化
            const actualMeritGained = userIncenseStateBefore ?
                userIncenseStateAfter.merit.toNumber() - userIncenseStateBefore.merit.toNumber() :
                userIncenseStateAfter.merit.toNumber();

            const actualIncensePointsGained = userIncenseStateBefore ?
                userIncenseStateAfter.incensePoints.toNumber() - userIncenseStateBefore.incensePoints.toNumber() :
                userIncenseStateAfter.incensePoints.toNumber();

            console.log('实际获得的功德:', actualMeritGained);
            console.log('实际获得的香火点:', actualIncensePointsGained);
            console.log('总抽签次数:', userIncenseStateAfter.totalDraws);
            console.log('今日抽签次数:', userIncenseStateAfter.dailyDrawCount);

            // 从交易日志中提取抽签结果
            let fortune = 'Neutral'; // 默认值
            let amuletDropped = false;
            let amuletType = 0;

            try {
                const txInfo = await this.connection.getTransaction(tx, {
                    commitment: 'confirmed'
                });

                if (txInfo && txInfo.meta && txInfo.meta.logMessages) {
                    for (const log of txInfo.meta.logMessages) {
                        if (log.includes('Draw result:')) {
                            const match = log.match(/Draw result: (.+)/);
                            if (match) {
                                fortune = match[1];
                            }
                        }
                        if (log.includes('Congratulations! Got')) {
                            amuletDropped = true;
                            // 提取护身符类型
                            if (log.includes('Fortune Amulet')) {
                                amuletType = 0;
                            }
                        }
                    }
                }
            } catch (error) {
                console.log('无法解析交易日志，使用默认值');
            }

            return {
                transactionSignature: tx,
                fortune,
                timestamp: Date.now(),
                usedMerit: params.useMerit,
                meritEarned: actualMeritGained,
                nftMinted: true,
                nftMintAddress: fortuneNftMintPda.toString(),
                amuletDropped,
                amuletType,
                userTotalDraws: userIncenseStateAfter.totalDraws,
                userDailyDrawCount: userIncenseStateAfter.dailyDrawCount,
                userMerit: userIncenseStateAfter.merit.toNumber(),
                userIncensePoints: userIncenseStateAfter.incensePoints.toNumber()
            };
        } catch (error: any) {
            console.error('抽签失败:', error);

            // 根据错误类型提供更具体的错误信息
            if (error.message.includes('Insufficient merit')) {
                throw new DrawFortuneError('功德不足，无法抽签', 'INSUFFICIENT_MERIT');
            } else if (error.message.includes('DailyIncenseLimitExceeded')) {
                throw new DrawFortuneError('今日免费抽签次数已用完', 'DAILY_LIMIT_EXCEEDED');
            } else if (error.message.includes('User has not been initialized')) {
                throw new DrawFortuneError('用户未初始化，请先初始化用户账户', 'USER_NOT_INITIALIZED');
            } else if (error.message.includes('Temple configuration not found')) {
                throw new DrawFortuneError('寺庙配置未找到', 'TEMPLE_CONFIG_NOT_FOUND');
            } else if (error.message.includes('already been processed')) {
                throw new DrawFortuneError('交易已处理，请稍后重试', 'TRANSACTION_ALREADY_PROCESSED');
            } else if (error.message.includes('Transaction simulation failed')) {
                throw new DrawFortuneError('交易模拟失败，请检查参数或稍后重试', 'TRANSACTION_SIMULATION_FAILED');
            } else if (error.message.includes('Unknown action')) {
                throw new DrawFortuneError('程序方法调用失败，请检查程序是否正确部署', 'UNKNOWN_ACTION');
            } else {
                console.error('详细错误信息:', {
                    message: error.message,
                    code: error.code,
                    logs: error.logs,
                    stack: error.stack
                });
                throw new DrawFortuneError(`抽签失败: ${error.message}`, 'DRAW_FORTUNE_FAILED');
            }
        }
    }

    // 获取用户香火状态
    async getUserIncenseState(userPubkey: PublicKey) {
        try {
            const userIncenseStatePda = this.getUserIncenseStatePda(userPubkey);
            return await this.program.account.userIncenseState.fetch(userIncenseStatePda);
        } catch (error: any) {
            throw new DrawFortuneError(`获取用户状态失败: ${error.message}`, 'FETCH_USER_STATE_FAILED');
        }
    }

    // 获取寺庙配置
    async getTempleConfig() {
        try {
            const templeConfigPda = this.getTempleConfigPda();
            return await this.program.account.templeConfig.fetch(templeConfigPda);
        } catch (error: any) {
            throw new DrawFortuneError(`获取寺庙配置失败: ${error.message}`, 'FETCH_TEMPLE_CONFIG_FAILED');
        }
    }

    // 检查用户余额是否足够
    async checkUserBalance(userPubkey: PublicKey, requiredAmount: number): Promise<boolean> {
        try {
            const balance = await this.connection.getBalance(userPubkey);
            const requiredLamports = requiredAmount * LAMPORTS_PER_SOL;
            return balance >= requiredLamports;
        } catch (error: any) {
            throw new DrawFortuneError(`检查余额失败: ${error.message}`, 'CHECK_BALANCE_FAILED');
        }
    }

    // 完全照搬setup.ts中的PDA计算函数
    private getTempleConfigPda(): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from("temple_v1")],
            this.programId
        );
        return pda;
    }

    private getUserStatePda(userPubkey: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from("user_state"), userPubkey.toBuffer()],
            this.programId
        );
        return pda;
    }

    private getUserIncenseStatePda(userPubkey: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from("user_incense"), userPubkey.toBuffer()],
            this.programId
        );
        return pda;
    }

    private getUserMedalStatePda(userPubkey: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from("user_medal"), userPubkey.toBuffer()],
            this.programId
        );
        return pda;
    }

    private getUserDonationStatePda(userPubkey: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from("user_donation"), userPubkey.toBuffer()],
            this.programId
        );
        return pda;
    }

    private getFortuneNftPda(userPubkey: PublicKey, totalDraws: number): PublicKey {
        const templeConfigPda = this.getTempleConfigPda();
        const [pda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("fortune_nft"),
                templeConfigPda.toBuffer(),
                userPubkey.toBuffer(),
                Buffer.from(totalDraws.toString())
            ],
            this.programId
        );
        return pda;
    }

    private getFortuneNftMintPda(userPubkey: PublicKey, totalDraws: number): PublicKey {
        const templeConfigPda = this.getTempleConfigPda();
        const [pda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("fortune_nft_mint"),
                templeConfigPda.toBuffer(),
                userPubkey.toBuffer(),
                Buffer.from(totalDraws.toString())
            ],
            this.programId
        );
        return pda;
    }

    private getMetadataPda(mint: PublicKey): PublicKey {
        const [metadataAccount] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("metadata"),
                new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
                mint.toBuffer(),
            ],
            new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
        );
        return metadataAccount;
    }

    private async getAssociatedTokenAddress(mint: PublicKey, owner: PublicKey): Promise<PublicKey> {
        const { getAssociatedTokenAddress } = await import('@solana/spl-token');
        return await getAssociatedTokenAddress(mint, owner);
    }

    // 创建寺庙配置 - 完全照搬setup.ts中的createTempleConfig实现
    private async createTempleConfig(userPubkey: PublicKey): Promise<string> {
        try {
            const templeConfigPda = this.getTempleConfigPda();
            const globalStatsPda = this.getGlobalStatsPda();

            // 使用默认配置 - 照搬setup.ts中的配置
            const regularFortune = {
                greatLuckProb: 10,    // 大吉: 10%
                goodLuckProb: 15,     // 中吉: 15%
                neutralProb: 20,      // 小吉: 20%
                badLuckProb: 25,      // 吉: 25%
                greatBadLuckProb: 30, // 末吉: 15% + 小凶: 10% + 大凶: 5% = 30%
            };

            const buddhaFortune = {
                greatLuckProb: 15,    // 大吉: 15% (佛像持有者概率更高)
                goodLuckProb: 20,     // 中吉: 20%
                neutralProb: 20,      // 小吉: 20%
                badLuckProb: 20,      // 吉: 20%
                greatBadLuckProb: 25, // 末吉: 10% + 小凶: 10% + 大凶: 5% = 25%
            };

            const donationLevels = [
                {
                    level: 1,
                    minAmountSol: 0.05, // 0.05 SOL
                    meritReward: new BN(65),
                    incenseReward: new BN(1200),
                },
                {
                    level: 2,
                    minAmountSol: 0.2, // 0.2 SOL
                    meritReward: new BN(1300),
                    incenseReward: new BN(6300),
                },
                {
                    level: 3,
                    minAmountSol: 1.0, // 1 SOL
                    meritReward: new BN(14000),
                    incenseReward: new BN(30000),
                },
                {
                    level: 4,
                    minAmountSol: 5.0, // 5 SOL
                    meritReward: new BN(120000),
                    incenseReward: new BN(100000),
                }
            ];

            const donationRewards = [
                {
                    minDonationSol: 0.0, // 每捐助0.01SOL增加烧香1次
                    incenseId: 0, // 0表示烧香次数奖励
                    incenseAmount: new BN(0),
                    burnBonusPer001Sol: new BN(1), // 每0.01SOL增加1次烧香
                },
                {
                    minDonationSol: 5.0, // 捐助5SOL以上获得秘制香
                    incenseId: 5, // 秘制香ID
                    incenseAmount: new BN(10), // 每5SOL获得10根
                    burnBonusPer001Sol: new BN(0),
                },
                {
                    minDonationSol: 50.0, // 捐助50SOL以上获得天界香
                    incenseId: 6, // 天界香ID
                    incenseAmount: new BN(5), // 每50SOL获得5根
                    burnBonusPer001Sol: new BN(0),
                }
            ];

            const tx = await (this.program.methods as any)
                .createTempleConfig(
                    userPubkey, // 使用当前用户作为treasury
                    regularFortune,
                    buddhaFortune,
                    donationLevels,
                    donationRewards,
                    [] // templeLevels - 空数组
                )
                .accounts({
                    owner: userPubkey, // 使用当前用户作为owner
                    templeConfig: templeConfigPda,
                    globalStats: globalStatsPda,
                    systemProgram: SystemProgram.programId,
                    rent: SYSVAR_RENT_PUBKEY,
                })
                .rpc({
                    skipPreflight: true,
                    preflightCommitment: 'processed',
                    commitment: 'confirmed',
                    maxRetries: 3
                });

            console.log(`寺庙配置创建成功: ${tx}`);
            return tx;
        } catch (error: any) {
            throw new DrawFortuneError(`创建寺庙配置失败: ${error.message}`, 'CREATE_TEMPLE_CONFIG_FAILED');
        }
    }

    private getGlobalStatsPda(): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from("global_stats_v1")],
            this.programId
        );
        return pda;
    }
}
