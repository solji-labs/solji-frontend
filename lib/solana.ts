import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { AnchorProvider, Program, Wallet, Idl } from '@coral-xyz/anchor';
import templeIdl from './idl/temple.json';
import { Temple } from '../types/temple';

// 网络配置
export const NETWORK_CONFIG = {
    devnet: {
        rpcUrl: 'https://api.devnet.solana.com',
        programId: 'D9immZaczS2ASFqqSux2iCCAaFat7vcusB1PQ2SW6d95', // 从 Anchor.toml 获取
    },
    mainnet: {
        rpcUrl: 'https://api.mainnet-beta.solana.com',
        programId: 'D9immZaczS2ASFqqSux2iCCAaFat7vcusB1PQ2SW6d95',
    },
};

// 当前使用的网络
export const CURRENT_NETWORK = 'devnet';

// 创建连接
export function createConnection(): Connection {
    const config = NETWORK_CONFIG[CURRENT_NETWORK as keyof typeof NETWORK_CONFIG];
    return new Connection(config.rpcUrl, 'confirmed');
}

// 创建程序实例
export function createProgram(wallet: Wallet): Program<Temple> {
    const connection = createConnection();
    const provider = new AnchorProvider(connection, wallet, {
        commitment: 'confirmed',
        preflightCommitment: 'confirmed',
    });

    const programId = new PublicKey(NETWORK_CONFIG[CURRENT_NETWORK as keyof typeof NETWORK_CONFIG].programId);

    return new Program(templeIdl as Idl, provider) as Program<Temple>;
}

// 获取 PDA 地址的工具函数
export function getPdaAddress(seeds: (Buffer | Uint8Array)[], programId: PublicKey): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(seeds, programId);
    return pda;
}

// 获取寺庙配置 PDA
export function getTempleConfigPda(programId: PublicKey): PublicKey {
    return getPdaAddress([Buffer.from('temple_v1')], programId);
}

// 获取全局统计 PDA
export function getGlobalStatsPda(programId: PublicKey): PublicKey {
    return getPdaAddress([Buffer.from('global_stats_v1')], programId);
}

// 获取用户状态 PDA
export function getUserStatePda(userPubkey: PublicKey, programId: PublicKey): PublicKey {
    return getPdaAddress([Buffer.from('user_state'), userPubkey.toBuffer()], programId);
}

// 获取用户香火状态 PDA
export function getUserIncenseStatePda(userPubkey: PublicKey, programId: PublicKey): PublicKey {
    return getPdaAddress([Buffer.from('user_incense'), userPubkey.toBuffer()], programId);
}

// 获取 NFT 铸造账户 PDA
export function getNftMintPda(templeConfigPda: PublicKey, incenseId: number, programId: PublicKey): PublicKey {
    return getPdaAddress([
        Buffer.from('IncenseNFT_V1'),
        templeConfigPda.toBuffer(),
        Buffer.from([incenseId])
    ], programId);
}

// 获取元数据账户 PDA
export function getMetadataPda(mint: PublicKey): PublicKey {
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
    return getPdaAddress([
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
    ], TOKEN_METADATA_PROGRAM_ID);
}

// 获取关联代币账户地址
export async function getAssociatedTokenAddress(mint: PublicKey, owner: PublicKey): Promise<PublicKey> {
    const { getAssociatedTokenAddress } = await import('@solana/spl-token');
    return getAssociatedTokenAddress(mint, owner);
}
