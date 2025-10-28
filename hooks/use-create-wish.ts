import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
    CreateWishContract, 
    CreateWishParams, 
    CreateWishResult, 
    CreateWishError,
    generateContentHashAsync
} from '@/lib/contracts/create-wish';
import { Wallet } from '@coral-xyz/anchor';
import { Transaction } from '@solana/web3.js';

export interface CreateWishState {
    loading: boolean;
    error: string | null;
    result: CreateWishResult | null;
}

/**
 * 许愿 Hook
 * 基于测试文件 wish.test.ts 实现
 */
export function useCreateWish() {
    const { publicKey, connected, signTransaction, signAllTransactions } = useWallet();
    const [state, setState] = useState<CreateWishState>({
        loading: false,
        error: null,
        result: null,
    });

    /**
     * 执行许愿
     */
    const createWish = useCallback(async (
        params: CreateWishParams
    ): Promise<CreateWishResult> => {
        // 钱包连接检查
        if (!publicKey || !connected) {
            throw new CreateWishError('请先连接钱包', 'WALLET_NOT_CONNECTED');
        }

        if (!signTransaction || !signAllTransactions) {
            throw new CreateWishError('钱包不支持签名功能', 'WALLET_SIGNING_NOT_SUPPORTED');
        }

        // 防止重复点击
        if (state.loading) {
            throw new CreateWishError('请等待当前操作完成', 'OPERATION_IN_PROGRESS');
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

            // 创建许愿合约实例
            const contract = new CreateWishContract(walletAdapter);

            // 执行许愿
            console.log('💛 开始执行许愿...');
            const result = await contract.createWish(publicKey, params);

            setState(prev => ({ ...prev, loading: false, result }));
            return result;
        } catch (error: any) {
            const errorMessage = error instanceof CreateWishError 
                ? error.message 
                : '许愿失败';
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
        createWish,
        resetState,
    };
}

/**
 * 获取用户许愿状态的 Hook
 */
export function useUserWishState() {
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

            const contract = new CreateWishContract(walletAdapter);
            const state = await contract.getUserState(publicKey);
            
            console.log('📊 用户许愿状态:', {
                karmaPoints: state.karmaPoints.toString(),
                totalWishCount: state.totalWishCount,
                dailyWishCount: state.dailyWishCount,
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

/**
 * 获取许愿详情的 Hook
 */
export function useWish(wishId: number | null) {
    const { publicKey, connected, signTransaction, signAllTransactions } = useWallet();
    const [wish, setWish] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWish = useCallback(async () => {
        if (!publicKey || !connected || wishId === null) {
            setWish(null);
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

            const contract = new CreateWishContract(walletAdapter);
            const wishData = await contract.getWish(publicKey, wishId);
            
            console.log('📜 许愿详情:', {
                wishId: wishData.wishId.toString(),
                creator: wishData.creator.toString(),
                isAnonymous: wishData.isAnonymous,
                isFreeWish: wishData.isFreeWish,
                isAmuletDropped: wishData.isAmuletDropped,
            });
            
            setWish(wishData);
        } catch (err: any) {
            setError(err.message);
            console.error('❌ 获取许愿详情失败:', err);
        } finally {
            setLoading(false);
        }
    }, [publicKey, connected, signTransaction, signAllTransactions, wishId]);

    return {
        wish,
        loading,
        error,
        fetchWish,
    };
}

/**
 * 辅助函数：生成许愿 ID
 * 使用当前时间戳作为唯一 ID
 */
export function generateWishId(): number {
    return Date.now();
}

/**
 * 辅助函数：从内容生成哈希
 */
export async function hashWishContent(content: string): Promise<number[]> {
    return await generateContentHashAsync(content);
}
