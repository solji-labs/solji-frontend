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

// 烧香参数接口
export interface BurnIncenseParams {
    incenseId: number;
    amount: number;
    hasMeritAmulet?: boolean;
}

// 烧香结果接口
export interface BurnIncenseResult {
    transactionSignature: string;
    meritPointsEarned: number;
    incensePointsEarned: number;
    nftMinted: boolean;
    nftMintAddress?: string;
    // 用户状态信息
    userIncenseNumber?: number;
    userTotalDraws?: number;
    userTotalWishes?: number;
    userTitle?: any;
}

// 烧香错误类型
export class BurnIncenseError extends Error {
    constructor(message: string, public code?: string) {
        super(message);
        this.name = 'BurnIncenseError';
    }
}

// 烧香合约调用类
export class BurnIncenseContract {
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

    // 初始化用户 - 完全照搬setup.ts中的initUser实现
    async initializeUser(userPubkey: PublicKey): Promise<string> {
        try {
            // 添加小延迟避免重复交易
            await new Promise(resolve => setTimeout(resolve, 100));

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
                    skipPreflight: false,
                    preflightCommitment: 'confirmed',
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
            throw new BurnIncenseError(`初始化用户失败: ${error.message}`, 'INIT_USER_FAILED');
        }
    }

    // 烧香主函数 - 完全照搬setup.ts中的burnIncense实现
    async burnIncense(
        userPubkey: PublicKey,
        params: BurnIncenseParams
    ): Promise<BurnIncenseResult> {
        try {
            // 添加小延迟避免重复交易
            await new Promise(resolve => setTimeout(resolve, 100));
            // 检查寺庙配置是否存在，如果不存在则创建 - 照搬测试文件beforeEach逻辑
            try {
                await this.getTempleConfig();
                console.log('寺庙配置存在');
            } catch (error: any) {
                console.log('寺庙配置不存在，正在创建...');
                await this.createTempleConfig(userPubkey);
            }

            // 获取寺庙配置以获取权限账户和国库账户
            const templeConfig = await this.getTempleConfig();
            console.log('寺庙配置信息:', {
                owner: templeConfig.owner.toString(),
                treasury: templeConfig.treasury.toString(),
                level: templeConfig.level,
                status: templeConfig.status
            });

            // 检查 owner 是否是管理员地址
            const adminPubkey = new PublicKey("FcKkQZRxD5P6JwGv58vGRAcX3CkjbX8oqFiygz6ohceU");
            const isAdminOwner = templeConfig.owner.equals(adminPubkey);
            console.log('寺庙配置 owner 是否为管理员:', isAdminOwner);

            // 确保NFT铸造账户存在 - 照搬测试文件beforeEach逻辑
            // await this.ensureNftMintExists(params.incenseId, userPubkey);

            // 检查用户是否已初始化
            if (!(await this.isUserInitialized(userPubkey))) {
                console.log('用户未初始化，正在初始化...');
                try {
                    await this.initializeUser(userPubkey);
                } catch (initError: any) {
                    // 如果初始化失败但是因为用户已经初始化，继续执行
                    if (initError.message && initError.message.includes('already been processed')) {
                        console.log('用户可能已经初始化，继续执行烧香...');
                    } else {
                        throw initError;
                    }
                }
            }

            // 获取必要的账户地址 - 完全照搬setup.ts中的实现
            const templeConfigPda = this.getTempleConfigPda();
            const userStatePda = this.getUserStatePda(userPubkey);
            const userIncenseStatePda = this.getUserIncenseStatePda(userPubkey);
            const nftMintPda = this.getNftMintPda(templeConfigPda, params.incenseId);
            const nftAssociatedTokenAccount = await this.getAssociatedTokenAddress(nftMintPda, userPubkey);



            const templeAuthority = templeConfig.owner;
            const templeTreasury = templeConfig.treasury;

            // 构建烧香交易 - 完全照搬setup.ts中的账户结构
            const accounts: any = {
                authority: userPubkey,
                templeAuthority: templeAuthority,
                templeTreasury: templeTreasury,
                templeConfig: templeConfigPda,
                globalStats: this.getGlobalStatsPda(),
                userState: userStatePda,
                userIncenseState: userIncenseStatePda,
                nftMintAccount: nftMintPda,
                nftAssociatedTokenAccount,
                metaAccount: this.getMetadataPda(nftMintPda),
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                tokenMetadataProgram: new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
                associatedTokenProgram: new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
                rent: SYSVAR_RENT_PUBKEY,
            };

            // 获取烧香前的用户状态（用于对比）
            let userIncenseStateBefore = null;
            try {
                userIncenseStateBefore = await this.program.account.userIncenseState.fetch(userIncenseStatePda);
                console.log('成功获取烧香前状态');
            } catch (error) {
                console.log('无法获取烧香前状态，可能是第一次烧香');
            }

            let tx: string;
            try {
                tx = await (this.program.methods as any)
                    .burnIncense(params.incenseId, new BN(params.amount), params.hasMeritAmulet || false)
                    .accounts(accounts)
                    .rpc({
                        skipPreflight: true,  // 跳过预检查，减少模拟失败
                        preflightCommitment: 'processed',
                        commitment: 'confirmed',
                        maxRetries: 3
                    });

                console.log('烧香交易提交成功:', tx);

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
                // 如果错误是 "already been processed"，检查交易是否实际成功
                if (error.message && error.message.includes('already been processed')) {
                    console.log('检测到重复交易错误，检查交易状态...');

                    // 尝试从错误中提取交易签名
                    const errorString = error.toString();
                    const signatureMatch = errorString.match(/signature:\s*['"]([^'"]+)['"]/);

                    if (signatureMatch) {
                        const signature = signatureMatch[1];
                        console.log('从错误中提取到交易签名:', signature);

                        // 检查交易是否实际成功
                        try {
                            const txInfo = await this.connection.getTransaction(signature, {
                                commitment: 'confirmed'
                            });

                            if (txInfo && !txInfo.meta?.err) {
                                console.log('交易实际已成功，使用提取的签名');
                                tx = signature;
                            } else {
                                throw error; // 重新抛出原始错误
                            }
                        } catch (checkError) {
                            console.log('无法验证交易状态，重新抛出原始错误');
                            throw error;
                        }
                    } else {
                        throw error; // 重新抛出原始错误
                    }
                } else {
                    throw error; // 重新抛出原始错误
                }
            }

            // 等待一段时间确保交易完全确认
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 获取烧香后的用户状态
            const userIncenseStateAfter = await this.program.account.userIncenseState.fetch(userIncenseStatePda);

            // 根据setup.ts中的配置计算功德和香火点
            const meritPointsEarned = this.calculateMeritPoints(params.incenseId, params.amount);
            const incensePointsEarned = this.calculateIncensePoints(params.incenseId, params.amount);

            console.log('=== 烧香前后用户状态对比 ===');
            console.log('烧香前状态:', userIncenseStateBefore ? {
                incensePoints: userIncenseStateBefore.incensePoints.toString(),
                merit: userIncenseStateBefore.merit.toString(),
                incenseNumber: userIncenseStateBefore.incenseNumber,
                totalDraws: userIncenseStateBefore.totalDraws,
                totalWishes: userIncenseStateBefore.totalWishes,
                title: userIncenseStateBefore.title
            } : '首次烧香，无之前状态');

            console.log('烧香后状态:', {
                incensePoints: userIncenseStateAfter.incensePoints.toString(),
                merit: userIncenseStateAfter.merit.toString(),
                incenseNumber: userIncenseStateAfter.incenseNumber,
                totalDraws: userIncenseStateAfter.totalDraws,
                totalWishes: userIncenseStateAfter.totalWishes,
                title: userIncenseStateAfter.title
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
            console.log('烧香次数增加:', userIncenseStateAfter.incenseNumber - (userIncenseStateBefore?.incenseNumber || 0));

            return {
                transactionSignature: tx,
                meritPointsEarned: actualMeritGained,
                incensePointsEarned: actualIncensePointsGained,
                nftMinted: true,
                nftMintAddress: nftMintPda.toString(),
                // 添加更多用户状态信息
                userIncenseNumber: userIncenseStateAfter.incenseNumber,
                userTotalDraws: userIncenseStateAfter.totalDraws,
                userTotalWishes: userIncenseStateAfter.totalWishes,
                userTitle: userIncenseStateAfter.title
            };
        } catch (error: any) {
            console.error('烧香失败:', error);

            // 根据错误类型提供更具体的错误信息
            if (error.message.includes('Insufficient SOL balance')) {
                throw new BurnIncenseError('余额不足，无法完成烧香', 'INSUFFICIENT_BALANCE');
            } else if (error.message.includes('User has not been initialized')) {
                throw new BurnIncenseError('用户未初始化，请先初始化用户账户', 'USER_NOT_INITIALIZED');
            } else if (error.message.includes('Invalid incense type')) {
                throw new BurnIncenseError('无效的香类型', 'INVALID_INCENSE_TYPE');
            } else if (error.message.includes('Temple configuration not found')) {
                throw new BurnIncenseError('寺庙配置未找到', 'TEMPLE_CONFIG_NOT_FOUND');
            } else if (error.message.includes('already been processed')) {
                throw new BurnIncenseError('交易已处理，请稍后重试', 'TRANSACTION_ALREADY_PROCESSED');
            } else if (error.message.includes('Transaction simulation failed')) {
                throw new BurnIncenseError('交易模拟失败，请检查参数或稍后重试', 'TRANSACTION_SIMULATION_FAILED');
            } else {
                throw new BurnIncenseError(`烧香失败: ${error.message}`, 'BURN_INCENSE_FAILED');
            }
        }
    }

    // 获取用户香火状态
    async getUserIncenseState(userPubkey: PublicKey) {
        try {
            const userIncenseStatePda = this.getUserIncenseStatePda(userPubkey);
            return await this.program.account.userIncenseState.fetch(userIncenseStatePda);
        } catch (error: any) {
            throw new BurnIncenseError(`获取用户状态失败: ${error.message}`, 'FETCH_USER_STATE_FAILED');
        }
    }

    // 获取寺庙配置
    async getTempleConfig() {
        try {
            const templeConfigPda = this.getTempleConfigPda();
            return await this.program.account.templeConfig.fetch(templeConfigPda);
        } catch (error: any) {
            throw new BurnIncenseError(`获取寺庙配置失败: ${error.message}`, 'FETCH_TEMPLE_CONFIG_FAILED');
        }
    }

    // 检查用户余额是否足够
    async checkUserBalance(userPubkey: PublicKey, requiredAmount: number): Promise<boolean> {
        try {
            const balance = await this.connection.getBalance(userPubkey);
            const requiredLamports = requiredAmount * LAMPORTS_PER_SOL;
            return balance >= requiredLamports;
        } catch (error: any) {
            throw new BurnIncenseError(`检查余额失败: ${error.message}`, 'CHECK_BALANCE_FAILED');
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

    private getNftMintPda(templeConfigPda: PublicKey, incenseId: number): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("IncenseNFT_V1"),
                templeConfigPda.toBuffer(),
                Buffer.from([incenseId])
            ],
            this.programId
        );
        return pda;
    }

    private getGlobalStatsPda(): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from("global_stats_v1")],
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

    // 根据setup.ts中的配置计算功德点
    private calculateMeritPoints(incenseId: number, amount: number): number {
        const meritMap: Record<number, number> = {
            1: 10,   // 清香
            2: 65,   // 檀香
            3: 1200, // 龙涎香
            4: 3400, // 太上灵香
            5: 5000, // 秘制香
            6: 10000, // 天界香
        };
        return (meritMap[incenseId] || 10) * amount;
    }

    // 根据setup.ts中的配置计算香火点
    private calculateIncensePoints(incenseId: number, amount: number): number {
        const incensePointsMap: Record<number, number> = {
            1: 100,   // 清香
            2: 600,  // 檀香
            3: 3100, // 龙涎香
            4: 9000, // 太上灵香
            5: 15000, // 秘制香
            6: 30000, // 天界香
        };
        return (incensePointsMap[incenseId] || 100) * amount;
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
                    skipPreflight: false,
                    preflightCommitment: 'confirmed',
                    commitment: 'confirmed',
                    maxRetries: 3
                });

            console.log(`寺庙配置创建成功: ${tx}`);
            return tx;
        } catch (error: any) {
            throw new BurnIncenseError(`创建寺庙配置失败: ${error.message}`, 'CREATE_TEMPLE_CONFIG_FAILED');
        }
    }

    // 确保NFT铸造账户存在 - 完全照搬setup.ts中的createNftMint实现
    private async ensureNftMintExists(incenseId: number, userPubkey: PublicKey): Promise<void> {
        try {
            console.log(`Ensuring NFT mint exists for incense type ${incenseId}...`);
            await this.createNftMint(incenseId, userPubkey);
        } catch (error: any) {
            if (error.message && error.message.includes('custom program error: 0xc7')) {
                console.log(`NFT mint already exists for incense type ${incenseId}, skipping creation`);
            } else {
                console.warn(`Failed to create NFT mint for incense type ${incenseId}:`, error.message);
                // 继续执行，让烧香交易来处理这个错误
            }
        }
    }

    // 创建NFT铸造账户 - 完全照搬setup.ts中的createNftMint实现
    private async createNftMint(incenseId: number, userPubkey: PublicKey): Promise<string> {
        try {
            const templeConfigPda = this.getTempleConfigPda();

            // 计算NFT铸造账户PDA - 照搬setup.ts中的计算方式
            const [nftMintPda] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("IncenseNFT_V1"),
                    templeConfigPda.toBuffer(),
                    Buffer.from([incenseId])
                ],
                this.programId
            );

            // 计算metadata和master edition PDAs - 照搬setup.ts中的计算方式
            const tokenMetadataProgram = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
            const [metaAccount] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("metadata"),
                    tokenMetadataProgram.toBuffer(),
                    nftMintPda.toBuffer(),
                ],
                tokenMetadataProgram
            );

            const [masterEditionAccount] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("metadata"),
                    tokenMetadataProgram.toBuffer(),
                    nftMintPda.toBuffer(),
                    Buffer.from("edition"),
                ],
                tokenMetadataProgram
            );

            // 获取寺庙配置以获取权限账户
            const templeConfig = await this.getTempleConfig();

            // 在 devnet 环境中使用写死的管理员地址
            const adminPubkey = new PublicKey("FcKkQZRxD5P6JwGv58vGRAcX3CkjbX8oqFiygz6ohceU");

            const tx = await (this.program.methods as any)
                .createNftMint(incenseId)
                .accounts({
                    authority: userPubkey,  // 使用当前用户作为权限账户
                    templeAuthority: templeConfig.owner,  // 使用 devnet 管理员地址
                    nftMintAccount: nftMintPda,
                    templeConfig: templeConfigPda,
                    metaAccount: metaAccount,
                    masterEditionAccount: masterEditionAccount,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    tokenMetadataProgram: tokenMetadataProgram,
                    systemProgram: SystemProgram.programId,
                    rent: SYSVAR_RENT_PUBKEY,
                })
                .rpc({
                    skipPreflight: false,
                    preflightCommitment: 'confirmed',
                    commitment: 'confirmed',
                    maxRetries: 3
                });

            console.log(`NFT mint created for incense type ${incenseId}: ${tx}`);
            return tx;
        } catch (error: any) {
            if (error.message && error.message.includes('custom program error: 0xc7')) {
                console.log(`NFT mint already exists for incense type ${incenseId}, skipping creation`);
                return 'NFT mint already exists';
            } else {
                throw new BurnIncenseError(`创建NFT铸造账户失败: ${error.message}`, 'CREATE_NFT_MINT_FAILED');
            }
        }
    }
}