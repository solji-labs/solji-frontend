import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import { createConnection } from '@/lib/solana';
import { WalletName } from '@solana/wallet-adapter-base';

export interface WalletInfo {
    publicKey: PublicKey | null;
    connected: boolean;
    balance: number;
    loading: boolean;
}

export function useWalletInfo(): WalletInfo {
    const { publicKey, connected } = useWallet();
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(false);

    const updateBalance = useCallback(async () => {
        if (!publicKey || !connected) {
            setBalance(0);
            return;
        }

        setLoading(true);
        try {
            const connection = createConnection();
            const balance = await connection.getBalance(publicKey);
            setBalance(balance / 1e9); // 转换为 SOL
        } catch (error) {
            console.error('获取余额失败:', error);
            setBalance(0);
        } finally {
            setLoading(false);
        }
    }, [publicKey, connected]);

    useEffect(() => {
        updateBalance();
    }, [updateBalance]);

    return {
        publicKey,
        connected,
        balance,
        loading,
    };
}

export function useWalletActions() {
    const { connect, disconnect, select, wallet } = useWallet();

    const handleConnect = useCallback(async (walletName?: string) => {
        try {
            if (walletName) {
                select(walletName as WalletName);
            }
            await connect();
        } catch (error) {
            console.error('连接钱包失败:', error);
            throw error;
        }
    }, [connect, select]);

    const handleDisconnect = useCallback(async () => {
        try {
            await disconnect();
        } catch (error) {
            console.error('断开钱包连接失败:', error);
            throw error;
        }
    }, [disconnect]);

    const handleSelectWallet = useCallback((walletName: string) => {
        try {
            //增加钱包名字枚举属性
            select(walletName as WalletName);
        } catch (error) {
            console.error('选择钱包失败:', error);
            throw error;
        }
    }, [select]);

    return {
        connect: handleConnect,
        disconnect: handleDisconnect,
        selectWallet: handleSelectWallet,
        currentWallet: wallet,
    };
}
