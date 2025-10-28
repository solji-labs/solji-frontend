import { Program, Wallet, BN } from '@coral-xyz/anchor';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createProgram, NETWORK_CONFIG, getCurrentNetwork } from '@/lib/solana';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Temple } from '@/types/temple';

// Metaplex Token Metadata Program ID
const MPL_TOKEN_METADATA_PROGRAM_ID = 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s';

/**
 * 捐赠参数接口
 */
export interface DonateFundParams {
    amount: number; // SOL 数量
}

/**
 * 捐赠结果接口
 */
export interface DonateFundResult {
    transactionSignature: string;
    rewardIncenseValue: number;
    rewardKarmaPoints: number;
    donationAmount: number;
    currentTimestamp: number;
    // 用户状态
    userState: {
        karmaPoints: number;
        totalIncenseValue: number;
        donationUnlockedBurns: number;
    };
    // 捐赠状态
    donationState: {
        totalDonationAmount: number;
        totalDonationCount: number;
        donationLevel: number;
        hasMintedBadgeNft: boolean;
    };
}

/**
 * 捐赠错误类
 */
export class DonateFundError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'DonateFundError';
    }
}

/**
 * 捐赠合约类
 * 基于 donate_fund.rs 和 donation.test.ts 实现
 */
export class DonateFundContract {
    private program: Program<Temple>;
    private wallet: Wallet;
    private programId: PublicKey;

    constructor(wallet: Wallet) {
        this.wallet = wallet;
        this.program = createProgram(wallet);
        const network = getCurrentNetwork();
        this.programId = new PublicKey(NETWORK_CONFIG[network as keyof typeof NETWORK_CONFIG].programId);
    }

    /**
     * 获取寺庙配置 PDA
     */
    getTempleConfigPda(): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from('temple_config_v1')],
            this.programId
        );
        return pda;
    }

    /**
     * 获取用户状态 PDA
     */
    getUserStatePda(userPubkey: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from('user_state_v1'), userPubkey.toBuffer()],
            this.programId
        );
        return pda;
    }

    /**
     * 获取用户香火状态 PDA
     */
    getUserIncenseStatePda(userPubkey: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from('user_incense_state_v1'), userPubkey.toBuffer()],
            this.programId
        );
        return pda;
    }

    /**
     * 获取用户捐赠状态 PDA
     */
    getUserDonationStatePda(userPubkey: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from('user_donation_state_v1'), userPubkey.toBuffer()],
            this.programId
        );
        return pda;
    }

    /**
     * 获取徽章 NFT Mint PDA
     */
    getBadgeNftMintPda(templeConfigPda: PublicKey, userPubkey: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from('badge_nft_v1'),
                templeConfigPda.toBuffer(),
                userPubkey.toBuffer()
            ],
            this.programId
        );
        return pda;
    }

    /**
     * 获取 NFT 关联代币账户
     */
    getAssociatedTokenAddress(mint: PublicKey, owner: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [
                owner.toBuffer(),
                TOKEN_PROGRAM_ID.toBuffer(),
                mint.toBuffer()
            ],
            ASSOCIATED_TOKEN_PROGRAM_ID
        );
        return pda;
    }

    /**
     * 获取 NFT 元数据账户 PDA
     */
    getMetadataAccountPda(mint: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from('metadata'),
                new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID).toBuffer(),
                mint.toBuffer()
            ],
            new PublicKey(MPL_TOKEN_METADATA_PROGRAM_ID)
        );
        return pda;
    }

    /**
     * 执行捐赠
     * 基于测试文件 donation.test.ts 和 donate_fund.rs 实现
     */
    async donateFund(
        userPubkey: PublicKey,
        params: DonateFundParams
    ): Promise<DonateFundResult> {
        try {
            console.log('💰 开始捐赠流程...');

            // 验证捐赠金额
            if (params.amount <= 0) {
                throw new DonateFundError('捐赠金额必须大于 0', 'INVALID_AMOUNT');
            }

            // 转换为 lamports
            const amountInLamports = Math.floor(params.amount * LAMPORTS_PER_SOL);
            console.log('💵 捐赠金额:', {
                sol: params.amount,
                lamports: amountInLamports
            });

            // 获取必要的 PDA 地址
            const templeConfigPda = this.getTempleConfigPda();
            const userStatePda = this.getUserStatePda(userPubkey);
            const userIncenseStatePda = this.getUserIncenseStatePda(userPubkey);
            const userDonationStatePda = this.getUserDonationStatePda(userPubkey);
            const nftMintAccount = this.getBadgeNftMintPda(templeConfigPda, userPubkey);
            const userNftAssociatedTokenAccount = this.getAssociatedTokenAddress(nftMintAccount, userPubkey);
            const metaAccount = this.getMetadataAccountPda(nftMintAccount);

            // 获取寺庙配置以获取 treasury 地址
            const templeConfig: any = await this.program.account.templeConfig.fetch(templeConfigPda);
            const templeTreasury = templeConfig.treasury;

            console.log('📍 账户地址:', {
                templeConfig: templeConfigPda.toString(),
                templeTreasury: templeTreasury.toString(),
                userState: userStatePda.toString(),
                userIncenseState: userIncenseStatePda.toString(),
                userDonationState: userDonationStatePda.toString(),
                nftMint: nftMintAccount.toString(),
                user: userPubkey.toString(),
            });

            // 调用捐赠指令 - 完全按照测试文件的方式
            console.log('📤 发送捐赠交易...');
            const tx = await this.program.methods
                .donateFund(new BN(amountInLamports))
                .accounts({
                    user: userPubkey,
                    templeTreasury: templeTreasury,
                    // 其他账户由 Anchor 自动推导
                })
                .rpc();

            console.log('✅ 捐赠交易提交成功:', tx);

            // 等待交易确认
            await this.program.provider.connection.confirmTransaction(tx, 'confirmed');
            console.log('✅ 交易确认成功');

            // 获取更新后的账户状态
            const userStateAfter: any = await this.program.account.userState.fetch(userStatePda);
            const userDonationStateAfter: any = await this.program.account.userDonationState.fetch(userDonationStatePda);

            console.log('📊 捐赠后用户状态:', {
                karmaPoints: userStateAfter.karmaPoints.toString(),
                totalIncenseValue: userStateAfter.totalIncenseValue.toString(),
                donationUnlockedBurns: userStateAfter.donationUnlockedBurns,
            });

            console.log('📊 捐赠后捐赠状态:', {
                totalDonationAmount: userDonationStateAfter.totalDonationAmount.toString(),
                totalDonationCount: userDonationStateAfter.totalDonationCount,
                donationLevel: userDonationStateAfter.donationLevel,
                hasMintedBadgeNft: userDonationStateAfter.hasMintedBadgeNft,
            });

            // 从交易日志中解析返回值
            const txDetails = await this.program.provider.connection.getTransaction(tx, {
                commitment: 'confirmed',
                maxSupportedTransactionVersion: 0
            });

            let rewardIncenseValue = 0;
            let rewardKarmaPoints = 0;

            if (txDetails?.meta?.logMessages) {
                console.log('📜 交易日志:', txDetails.meta.logMessages);
                
                // 解析日志中的返回值
                for (const log of txDetails.meta.logMessages) {
                    if (log.includes('donate_fund_result')) {
                        console.log('🎊 找到捐赠结果日志:', log);
                        // 尝试解析结构化数据
                        // 格式: "Program log: donate_fund_result: DonateFundResult { ... }"
                    }
                }
            }

            // 根据捐赠金额计算奖励（基于 Rust 代码逻辑）
            // Donation::calculate_donation(amount)
            // 功德值 = amount / 0.01 SOL * 13
            // 香火值 = amount / 0.01 SOL * 120
            const amountInSol = params.amount;
            const units = amountInSol / 0.01; // 每 0.01 SOL 为一个单位
            rewardKarmaPoints = Math.floor(units * 13);
            rewardIncenseValue = Math.floor(units * 120);

            console.log('🎁 计算的奖励:', {
                rewardKarmaPoints,
                rewardIncenseValue,
            });

            const result: DonateFundResult = {
                transactionSignature: tx,
                rewardIncenseValue,
                rewardKarmaPoints,
                donationAmount: amountInLamports,
                currentTimestamp: Date.now(),
                userState: {
                    karmaPoints: userStateAfter.karmaPoints.toNumber(),
                    totalIncenseValue: userStateAfter.totalIncenseValue.toNumber(),
                    donationUnlockedBurns: userStateAfter.donationUnlockedBurns,
                },
                donationState: {
                    totalDonationAmount: userDonationStateAfter.totalDonationAmount.toNumber(),
                    totalDonationCount: userDonationStateAfter.totalDonationCount,
                    donationLevel: userDonationStateAfter.donationLevel,
                    hasMintedBadgeNft: userDonationStateAfter.hasMintedBadgeNft,
                },
            };

            console.log('🎊 捐赠结果:', result);
            return result;

        } catch (error: any) {
            console.error('❌ 捐赠过程失败:', error);
            
            if (error.message?.includes('insufficient')) {
                throw new DonateFundError('余额不足', 'INSUFFICIENT_BALANCE');
            }
            
            throw new DonateFundError(
                `捐赠失败: ${error.message}`,
                error.code || 'UNKNOWN_ERROR'
            );
        }
    }

    /**
     * 获取用户状态
     */
    async getUserState(userPubkey: PublicKey): Promise<any> {
        const userStatePda = this.getUserStatePda(userPubkey);
        return await (this.program.account as any).userState.fetch(userStatePda);
    }

    /**
     * 获取用户捐赠状态
     */
    async getUserDonationState(userPubkey: PublicKey): Promise<any> {
        const userDonationStatePda = this.getUserDonationStatePda(userPubkey);
        return await (this.program.account as any).userDonationState.fetch(userDonationStatePda);
    }

    /**
     * 获取寺庙配置
     */
    async getTempleConfig(): Promise<any> {
        const templeConfigPda = this.getTempleConfigPda();
        return await (this.program.account as any).templeConfig.fetch(templeConfigPda);
    }
}
