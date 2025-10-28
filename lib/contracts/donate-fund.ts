import { Connection, PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, Wallet, Idl } from '@coral-xyz/anchor';
import { BN } from 'bn.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
    createConnection,
    createProgram,
    CURRENT_NETWORK,
    NETWORK_CONFIG,
} from '../solana';

import type { Temple } from '../../types/temple';

export class DonateFundError extends Error {
    constructor(message: string, public code?: string) {
        super(message);
        this.name = 'DonateFundError';
    }
}

export class DonateFundContract {
    private program: Program<Temple>;
    private connection: Connection;
    private programId: PublicKey;

    constructor(wallet: Wallet) {
        this.program = createProgram(wallet);
        this.connection = createConnection();
        this.programId = new PublicKey(NETWORK_CONFIG[CURRENT_NETWORK as keyof typeof NETWORK_CONFIG].programId);
    }

    async isUserInitialized(userPubkey: PublicKey): Promise<boolean> {
        try {
            const userStatePda = this.getUserStatePda(userPubkey);
            await this.program.account.userState.fetch(userStatePda);
            return true;
        } catch {
            return false;
        }
    }

    async initializeUser(userPubkey: PublicKey): Promise<string> {
        try {
            if (await this.isUserInitialized(userPubkey)) {
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
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            return tx;
        } catch (error: any) {
            throw new DonateFundError(`初始化用户失败: ${error.message}`, 'INIT_USER_FAILED');
        }
    }

    async donate(userPubkey: PublicKey, amountSol: number): Promise<string> {
        try {
            if (!(await this.isUserInitialized(userPubkey))) {
                await this.initializeUser(userPubkey);
            }

            const templeConfigPda = this.getTempleConfigPda();
            const globalStatsPda = this.getGlobalStatsPda();
            const userStatePda = this.getUserStatePda(userPubkey);
            const userDonationStatePda = this.getUserDonationStatePda(userPubkey);
            const userIncenseStatePda = this.getUserIncenseStatePda(userPubkey);

            // 读取寺庙配置以获取 treasury
            const templeConfig = await this.program.account.templeConfig.fetch(templeConfigPda);
            const templeTreasury: PublicKey = templeConfig.treasury as PublicKey;

            // 勋章NFT相关 PDA（照抄 setup.ts）
            const medalNftAccountPda = this.getMedalNftPda(userPubkey);
            const medalNftMintPda = this.getMedalNftMintPda(userPubkey);
            const medalNftTokenAccount = await this.getAssociatedTokenAddress(medalNftMintPda, userPubkey);
            const medalNftMetadataPda = this.getMetadataPda(medalNftMintPda);

            const lamports = new BN(Math.floor(amountSol * LAMPORTS_PER_SOL));

            const accounts: any = {
                donor: userPubkey,
                templeConfig: templeConfigPda,
                globalStats: globalStatsPda,
                userState: userStatePda,
                userDonationState: userDonationStatePda,
                userIncenseState: userIncenseStatePda,
                templeTreasury: templeTreasury,
                medalNftAccount: medalNftAccountPda,
                medalNftMint: medalNftMintPda,
                medalNftTokenAccount: medalNftTokenAccount,
                medalNftMetadata: medalNftMetadataPda,
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
                tokenMetadataProgram: new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
                associatedTokenProgram: new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
                rent: SYSVAR_RENT_PUBKEY,
            };

            const tx = await (this.program.methods as any)
                .donateFund(lamports)
                .accounts(accounts)
                .rpc({
                    skipPreflight: true,
                    preflightCommitment: 'processed',
                    commitment: 'confirmed',
                    maxRetries: 3,
                });

            // 简单确认
            const conf = await this.connection.confirmTransaction(tx, 'confirmed');
            if (conf.value.err) {
                throw new Error(JSON.stringify(conf.value.err));
            }
            return tx;
        } catch (error: any) {
            throw new DonateFundError(`捐赠失败: ${error.message}`, 'DONATE_FUND_FAILED');
        }
    }

    // === PDA 计算（参考 setup.ts） ===
    private getTempleConfigPda(): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync([Buffer.from('temple_v1')], this.programId);
        return pda;
    }

    private getGlobalStatsPda(): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync([Buffer.from('global_stats_v1')], this.programId);
        return pda;
    }

    private getUserStatePda(userPubkey: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync([Buffer.from('user_state'), userPubkey.toBuffer()], this.programId);
        return pda;
    }

    private getUserDonationStatePda(userPubkey: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync([Buffer.from('user_donation'), userPubkey.toBuffer()], this.programId);
        return pda;
    }

    private getUserIncenseStatePda(userPubkey: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync([Buffer.from('user_incense'), userPubkey.toBuffer()], this.programId);
        return pda;
    }

    private getUserMedalStatePda(userPubkey: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync([Buffer.from('user_medal'), userPubkey.toBuffer()], this.programId);
        return pda;
    }

    private getMedalNftPda(userPubkey: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from('medal_nft'), Buffer.from('account'), this.getTempleConfigPda().toBuffer(), userPubkey.toBuffer()],
            this.programId,
        );
        return pda;
    }

    private getMedalNftMintPda(userPubkey: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from('medal_nft'), this.getTempleConfigPda().toBuffer(), userPubkey.toBuffer()],
            this.programId,
        );
        return pda;
    }

    private getMetadataPda(mint: PublicKey): PublicKey {
        const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from('metadata'), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
            TOKEN_METADATA_PROGRAM_ID,
        );
        return pda;
    }

    private async getAssociatedTokenAddress(mint: PublicKey, owner: PublicKey): Promise<PublicKey> {
        const { getAssociatedTokenAddress } = await import('@solana/spl-token');
        return getAssociatedTokenAddress(mint, owner);
    }
}


