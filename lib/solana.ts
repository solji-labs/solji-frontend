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
        // Switchboard 随机数账户（devnet）
        // 注意：这是一个示例地址，实际使用时需要：
        // 1. 创建自己的 Switchboard randomness account
        // 2. 或者使用 Switchboard On-Demand 服务
        // 3. 如果不提供，后端会降级到伪随机数（仅用于测试）
        randomnessAccount: 'GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR',
    },
    mainnet: {
        rpcUrl: 'https://api.mainnet-beta.solana.com',
        programId: '81BWs7RGtN2EEvaGWZe8EQ8nhswHTHVzYUn5iPFoRr9o',
        // Switchboard VRF 随机数账户（mainnet）
        randomnessAccount: 'GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR',
    },
    'mainnet-beta': {
        rpcUrl: 'https://api.mainnet-beta.solana.com',
        programId: '81BWs7RGtN2EEvaGWZe8EQ8nhswHTHVzYUn5iPFoRr9o',
        // Switchboard VRF 随机数账户（mainnet）
        randomnessAccount: 'GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR',
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

// ==================== 通用 PDA 工具函数 ====================

/**
 * 获取 PDA 地址的通用工具函数
 */
export function getPdaAddress(seeds: (Buffer | Uint8Array)[], programId: PublicKey): PublicKey {
    const [pda] = PublicKey.findProgramAddressSync(seeds, programId);
    return pda;
}

/**
 * 获取当前程序 ID
 */
export function getProgramId(): PublicKey {
    const network = getCurrentNetwork();
    return new PublicKey(NETWORK_CONFIG[network as keyof typeof NETWORK_CONFIG].programId);
}

// ==================== 寺庙相关 PDA ====================

/**
 * 获取寺庙配置 PDA
 * Seeds: ["temple_config_v1"]
 */
export function getTempleConfigPda(programId?: PublicKey): PublicKey {
    const pid = programId || getProgramId();
    return getPdaAddress([Buffer.from('temple_config_v1')], pid);
}

/**
 * 获取用户状态 PDA
 * Seeds: ["user_state_v2", userPubkey]
 */
export function getUserStatePda(userPubkey: PublicKey, programId?: PublicKey): PublicKey {
    const pid = programId || getProgramId();
    return getPdaAddress([
        Buffer.from('user_state_v2'),
        userPubkey.toBuffer()
    ], pid);
}

/**
 * 获取用户香火状态 PDA
 * Seeds: ["user_incense_state_v1", userPubkey]
 */
export function getUserIncenseStatePda(userPubkey: PublicKey, programId?: PublicKey): PublicKey {
    const pid = programId || getProgramId();
    return getPdaAddress([
        Buffer.from('user_incense_state_v1'),
        userPubkey.toBuffer()
    ], pid);
}

/**
 * 获取用户捐赠状态 PDA
 * Seeds: ["user_donation_state_v1", userPubkey]
 */
export function getUserDonationStatePda(userPubkey: PublicKey, programId?: PublicKey): PublicKey {
    const pid = programId || getProgramId();
    return getPdaAddress([
        Buffer.from('user_donation_state_v1'),
        userPubkey.toBuffer()
    ], pid);
}

// ==================== 香火相关 PDA ====================

/**
 * 获取香火类型配置 PDA
 * Seeds: ["incense_type_v1", incenseTypeId]
 */
export function getIncenseTypeConfigPda(incenseTypeId: number, programId?: PublicKey): PublicKey {
    const pid = programId || getProgramId();
    return getPdaAddress([
        Buffer.from('incense_type_v1'),
        Buffer.from([incenseTypeId])
    ], pid);
}

/**
 * 获取香火 NFT Mint PDA
 * Seeds: ["IncenseNFT", templeConfigPda, incenseTypeId]
 */
export function getIncenseNftMintPda(incenseTypeId: number, programId?: PublicKey): PublicKey {
    const pid = programId || getProgramId();
    const templeConfigPda = getTempleConfigPda(pid);
    return getPdaAddress([
        Buffer.from('IncenseNFT'),
        templeConfigPda.toBuffer(),
        Buffer.from([incenseTypeId])
    ], pid);
}

// ==================== 许愿相关 PDA ====================

/**
 * 获取许愿 PDA
 * Seeds: ["wish_v1", creator, wishId]
 */
export function getWishPda(creator: PublicKey, wishId: number, programId?: PublicKey): PublicKey {
    const pid = programId || getProgramId();
    const wishIdBuffer = Buffer.alloc(8);
    wishIdBuffer.writeBigUInt64LE(BigInt(wishId));
    
    return getPdaAddress([
        Buffer.from('wish_v1'),
        creator.toBuffer(),
        wishIdBuffer
    ], pid);
}

// ==================== 捐赠相关 PDA ====================

/**
 * 获取徽章 NFT Mint PDA
 * Seeds: ["badge_nft_v1", templeConfigPda, userPubkey]
 */
export function getBadgeNftMintPda(userPubkey: PublicKey, programId?: PublicKey): PublicKey {
    const pid = programId || getProgramId();
    const templeConfigPda = getTempleConfigPda(pid);
    return getPdaAddress([
        Buffer.from('badge_nft_v1'),
        templeConfigPda.toBuffer(),
        userPubkey.toBuffer()
    ], pid);
}

// ==================== NFT 相关 PDA ====================

/**
 * 获取元数据账户 PDA
 * Seeds: ["metadata", TOKEN_METADATA_PROGRAM_ID, mint]
 */
export function getMetadataPda(mint: PublicKey): PublicKey {
    const TOKEN_METADATA_PROGRAM_ID = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');
    return getPdaAddress([
        Buffer.from('metadata'),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
    ], TOKEN_METADATA_PROGRAM_ID);
}

/**
 * 获取关联代币账户地址（同步版本）
 */
export function getAssociatedTokenAddressSync(mint: PublicKey, owner: PublicKey): PublicKey {
    const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
    const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL');
    
    return getPdaAddress([
        owner.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mint.toBuffer()
    ], ASSOCIATED_TOKEN_PROGRAM_ID);
}

/**
 * 获取关联代币账户地址（异步版本，兼容旧代码）
 */
export async function getAssociatedTokenAddress(mint: PublicKey, owner: PublicKey): Promise<PublicKey> {
    return getAssociatedTokenAddressSync(mint, owner);
}

// ==================== 随机数相关 ====================

/**
 * 获取 Switchboard 随机数账户地址
 * 根据当前网络返回对应的随机数账户
 * 
 * @returns {PublicKey} Switchboard 随机数账户的公钥
 * 
 * @remarks
 * - 后端程序使用 `Option<AccountInfo>` 接收此账户
 * - 如果不提供此账户，后端会降级到伪随机数（slot + timestamp）
 * - 在 devnet 环境下，可以选择性传递此账户
 * - 在生产环境（mainnet）下，强烈建议提供有效的 Switchboard 账户
 * 
 * @example
 * ```typescript
 * try {
 *   const randomnessAccount = getRandomnessAccount();
 *   accounts.randomness_account = randomnessAccount;
 * } catch (error) {
 *   // 不传递账户，后端使用降级方案
 * }
 * ```
 */
export function getRandomnessAccount(): PublicKey {
    const network = getCurrentNetwork();
    const config = NETWORK_CONFIG[network as keyof typeof NETWORK_CONFIG];
    
    if (!config || !config.randomnessAccount) {
        console.warn(`⚠️ 未配置 ${network} 网络的随机数账户，使用默认值`);
        // 返回一个默认的 Switchboard devnet 随机数账户
        return new PublicKey('GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR');
    }
    
    return new PublicKey(config.randomnessAccount);
}
