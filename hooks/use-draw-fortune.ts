import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
    DrawFortuneContract, 
    DrawFortuneParams, 
    DrawFortuneResult, 
    DrawFortuneError 
} from '@/lib/contracts/draw-fortune';
import { Wallet } from '@coral-xyz/anchor';
import { Transaction } from '@solana/web3.js';

export interface DrawFortuneState {
    loading: boolean;
    error: string | null;
    result: DrawFortuneResult | null;
}

/**
 * 抽签 Hook
 * 基于测试文件 draw-fortune.test.ts 实现
 */
export function useDrawFortune() {
    const { publicKey, connected, signTransaction, signAllTransactions } = useWallet();
    const [state, setState] = useState<DrawFortuneState>({
        loading: false,
        error: null,
        result: null,
    });

    /**
     * 执行抽签
     */
    const drawFortune = useCallback(async (
        params?: DrawFortuneParams
    ): Promise<DrawFortuneResult> => {
        // 钱包连接检查
        if (!publicKey || !connected) {
            throw new DrawFortuneError('请先连接钱包', 'WALLET_NOT_CONNECTED');
        }

        if (!signTransaction || !signAllTransactions) {
            throw new DrawFortuneError('钱包不支持签名功能', 'WALLET_SIGNING_NOT_SUPPORTED');
        }

        // 防止重复点击
        if (state.loading) {
            throw new DrawFortuneError('请等待当前操作完成', 'OPERATION_IN_PROGRESS');
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

            // 创建抽签合约实例
            const contract = new DrawFortuneContract(walletAdapter);

            // 执行抽签
            console.log('🔮 开始执行抽签...');
            const result = await contract.drawFortune(publicKey, params);

            setState(prev => ({ ...prev, loading: false, result }));
            return result;
        } catch (error: any) {
            const errorMessage = error instanceof DrawFortuneError 
                ? error.message 
                : '抽签失败';
            setState(prev => ({ ...prev, loading: false, error: errorMessage }));
            throw error;
        }
    }, [publicKey, connected, signTransaction, signAllTransactions, state.loading]);

    /**
     * 重置状态
     */
    const resetState = useCallback(() => {
        setState({
            loading: false,
            error: null,
            result: null,
        });
    }, []);

    return {
        ...state,
        drawFortune,
        resetState,
    };
}

/**
 * 获取用户状态的 Hook
 */
export function useUserDrawState() {
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

            const contract = new DrawFortuneContract(walletAdapter);
            const state = await contract.getUserState(publicKey);
            
            console.log('📊 用户抽签状态:', {
                karmaPoints: state.karmaPoints.toString(),
                dailyDrawCount: state.dailyDrawCount,
                totalDrawCount: state.totalDrawCount,
            });
            
            setUserState(state);
        } catch (err: any) {
            setError(err.message);
            console.error('❌ 获取用户状态失败:', err);
        } finally {
            setLoading(false);
        }
    }, [publicKey, connected, signTransaction, signAllTransactions]);

    return {
        userState,
        loading,
        error,
        fetchUserState,
    };
}
