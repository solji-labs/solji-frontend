import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { BurnIncenseContract, BurnIncenseParams, BurnIncenseResult, BurnIncenseError } from '@/lib/contracts/burn-incense';
import { Wallet } from '@coral-xyz/anchor';
import { Transaction } from '@solana/web3.js';

export interface BurnIncenseState {
    loading: boolean;
    error: string | null;
    result: BurnIncenseResult | null;
}

export function useBurnIncense() {
    const { publicKey, connected, signTransaction, signAllTransactions } = useWallet();
    const [state, setState] = useState<BurnIncenseState>({
        loading: false,
        error: null,
        result: null,
    });

    const burnIncense = useCallback(async (params: BurnIncenseParams): Promise<BurnIncenseResult> => {
        if (!publicKey || !connected) {
            throw new BurnIncenseError('请先连接钱包', 'WALLET_NOT_CONNECTED');
        }

        if (!signTransaction || !signAllTransactions) {
            throw new BurnIncenseError('钱包不支持签名功能', 'WALLET_SIGNING_NOT_SUPPORTED');
        }

        // 防止重复点击
        if (state.loading) {
            throw new BurnIncenseError('请等待当前操作完成', 'OPERATION_IN_PROGRESS');
        }

        setState(prev => ({ ...prev, loading: true, error: null, result: null }));

        try {
            // 创建钱包适配器
            const walletAdapter = {
                publicKey,
                signTransaction: async (tx: Transaction) => {
                    return await signTransaction(tx);
                },
                signAllTransactions: async (txs: Transaction[]) => {
                    return await signAllTransactions(txs);
                },
            } as Wallet;

            // 创建烧香合约实例
            const burnIncenseContract = new BurnIncenseContract(walletAdapter);

            // 检查用户余额 - 根据香火类型计算所需金额
            const incensePrices = {
                1: 0.01,  // 清香
                2: 0.05,  // 檀香
                3: 0.1,   // 龙涎香
                4: 0.3,   // 太上灵香
            };
            const pricePerIncense = incensePrices[params.incenseId as keyof typeof incensePrices] || 0.01;
            const requiredAmount = params.amount * pricePerIncense;
            const hasEnoughBalance = await burnIncenseContract.checkUserBalance(publicKey, requiredAmount);

            if (!hasEnoughBalance) {
                throw new BurnIncenseError('余额不足，无法完成烧香', 'INSUFFICIENT_BALANCE');
            }

            // 执行烧香
            const result = await burnIncenseContract.burnIncense(publicKey, params);

            setState(prev => ({ ...prev, loading: false, result }));
            return result;
        } catch (error: any) {
            const errorMessage = error instanceof BurnIncenseError ? error.message : '烧香失败';
            setState(prev => ({ ...prev, loading: false, error: errorMessage }));
            throw error;
        }
    }, [publicKey, connected, signTransaction, signAllTransactions, state.loading]);

    const resetState = useCallback(() => {
        setState({
            loading: false,
            error: null,
            result: null,
        });
    }, []);

    return {
        ...state,
        burnIncense,
        resetState,
    };
}

// 获取用户香火状态的 hook
export function useUserIncenseState() {
    const { publicKey, connected, signTransaction, signAllTransactions } = useWallet();
    const [userState, setUserState] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUserState = useCallback(async () => {
        if (!publicKey || !connected) {
            setUserState(null);
            return;
        }

        if (!signTransaction || !signAllTransactions) {
            setError('钱包不支持签名功能');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const walletAdapter = {
                publicKey,
                signTransaction: async (tx: Transaction) => {
                    return await signTransaction(tx);
                },
                signAllTransactions: async (txs: Transaction[]) => {
                    return await signAllTransactions(txs);
                },
            } as Wallet;

            const burnIncenseContract = new BurnIncenseContract(walletAdapter);
            const state = await burnIncenseContract.getUserIncenseState(publicKey);
            setUserState(state);
        } catch (err: any) {
            setError(err.message);
            console.error('获取用户状态失败:', err);
        } finally {
            setLoading(false);
        }
    }, [publicKey, connected]);

    return {
        userState,
        loading,
        error,
        fetchUserState,
    };
}
