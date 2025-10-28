'use client';

import { useMemo, useCallback } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork, WalletError } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { 
    PhantomWalletAdapter, 
    SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';

// 导入钱包适配器样式
require('@solana/wallet-adapter-react-ui/styles.css');

interface WalletContextProviderProps {
    children: React.ReactNode;
}

export function WalletContextProvider({ children }: WalletContextProviderProps) {
    // 网络配置
    // 从环境变量读取网络类型，默认为 Devnet
    const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK as WalletAdapterNetwork) || WalletAdapterNetwork.Devnet;
    
    // 端点配置优先级：
    // 1. 环境变量 NEXT_PUBLIC_SOLANA_RPC_URL（用于本地或自定义 RPC）
    // 2. 默认使用 clusterApiUrl
    const endpoint = useMemo(() => {
        const customRpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
        if (customRpcUrl) {
            return customRpcUrl;
        }
        return clusterApiUrl(network);
    }, [network]);

    // 只添加 Solana 原生钱包适配器
    // 不添加 MetaMask 等以太坊钱包，避免与 Standard Wallets 冲突
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter({ network }),
        ],
        [network]
    );

    // 错误处理回调
    const onError = useCallback((error: WalletError) => {
        console.error('钱包错误:', error);
    }, []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={false} onError={onError}>
                <WalletModalProvider>
                    {children}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
