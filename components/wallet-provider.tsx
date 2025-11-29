'use client';

import { useMemo } from 'react';
import { FarcasterSolanaProvider } from '@farcaster/mini-app-solana';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Cluster, clusterApiUrl } from '@solana/web3.js';
import StakefyProvider from './stakefy-provider';

// 导入钱包适配器样式
require('@solana/wallet-adapter-react-ui/styles.css');

interface WalletContextProviderProps {
    children: React.ReactNode;
}

export function WalletContextProvider({ children }: WalletContextProviderProps) {
    // 网络配置
    // const network = WalletAdapterNetwork.Devnet;
    // const endpoint = useMemo(() => clusterApiUrl(process.env.RPC_URL as Cluster), []);

    return (
        // FarcasterSolanaProvider 内部已经包含了 ConnectionProvider 和 WalletProvider
        // 它会自动注册 Farcaster 钱包并通过 Wallet Standard 使用
        // 在 Farcaster 环境中会自动选择 Farcaster 钱包
        // 在非 Farcaster 环境中，仍然可以通过 WalletModalProvider 选择其他钱包
        <FarcasterSolanaProvider endpoint={process.env.RPC_URL as string}>
            <WalletModalProvider>
                <StakefyProvider apiUrl="https://stakefy-x402-production.up.railway.app" network="devnet">
                    {children}
                </StakefyProvider>
            </WalletModalProvider>
        </FarcasterSolanaProvider>
    );
}
