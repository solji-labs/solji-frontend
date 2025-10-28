import { Connection, PublicKey, Keypair, clusterApiUrl } from '@solana/web3.js';
import { AnchorProvider, Program, Wallet, Idl } from '@coral-xyz/anchor';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import templeIdl from './idl/temple.json';
import { Temple } from '../types/temple';

// 网络配置
export const NETWORK_CONFIG = {
    devnet: {
        rpcUrl: 'https://api.devnet.solana.com',
        programId: '81BWs7RGtN2EEvaGWZe8EQ8nhswHTHVzYUn5iPFoRr9o', // 从 Anchor.toml 获取
    },
    mainnet: {
        rpcUrl: 'https://api.mainnet-beta.solana.com',
        programId: '81BWs7RGtN2EEvaGWZe8EQ8nhswHTHVzYUn5iPFoRr9o',
    },
    'mainnet-beta': {
        rpcUrl: 'https://api.mainnet-beta.solana.com',
        programId: '81BWs7RGtN2EEvaGWZe8EQ8nhswHTHVzYUn5iPFoRr9o',
    },
};

// 获取当前网络 - 与 wallet-provider.tsx 保持一致
export function getCurrentNetwork(): string {
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
    return network.toLowerCase();
}

// 当前使用的网络（动态获取）
export const CURRENT_NETWORK = getCurrentNetwork();

// 获取 RPC URL - 与 wallet-provider.tsx 保持一致
export function getRpcUrl(): string {
    // 优先使用环境变量中的自定义 RPC URL
    const customRpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    if (customRpcUrl) {
        return customRpcUrl;
    }
    
    // 否则使用配置中的 RPC URL
    const network = getCurrentNetwork();
    const config = NETWORK_CONFIG[network as keyof typeof NETWORK_CONFIG];
    if (config) {
        return config.rpcUrl;
    }
    
    // 最后使用 clusterApiUrl 作为后备
    return clusterApiUrl(network as WalletAdapterNetwork);
}

// 创建连接
export function createConnection(): Connection {
    const rpcUrl = getRpcUrl();
    console.log('[Solana] Creating connection to:', rpcUrl, '(network:', CURRENT_NETWORK, ')');
    return new Connection(rpcUrl, 'confirmed');
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
    return getPdaAddress([Buffer.from('temple_config_v1')], programId);
}

// 获取全局统计 PDA
export function getGlobalStatsPda(programId: PublicKey): PublicKey {
    return getPdaAddress([Buffer.from('temple_config_v1')], programId);
}

// 获取用户状态 PDA
export function getUserStatePda(userPubkey: PublicKey, programId: PublicKey): PublicKey {
    return getPdaAddress([Buffer.from('user_state_v1'), userPubkey.toBuffer()], programId);
}

// 获取用户香火状态 PDA
export function getUserIncenseStatePda(userPubkey: PublicKey, programId: PublicKey): PublicKey {
    return getPdaAddress([Buffer.from('user_incense_state_v1'), userPubkey.toBuffer()], programId);
}

// 获取 NFT 铸造账户 PDA
export function getNftMintPda(templeConfigPda: PublicKey, incenseId: number, programId: PublicKey): PublicKey {
    return getPdaAddress([
        Buffer.from('IncenseNFT'),
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
