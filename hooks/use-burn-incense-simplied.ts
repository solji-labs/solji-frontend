import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
    BurnIncenseSimpliedContract, 
    BurnIncenseSimpliedParams, 
    BurnIncenseSimpliedResult, 
    BurnIncenseSimpliedError 
} from '@/lib/contracts/burn-incense-simplied';
import { Wallet } from '@coral-xyz/anchor';
import { Transaction } from '@solana/web3.js';

export interface BurnIncenseSimpliedState {
    loading: boolean;
    error: string | null;
    result: BurnIncenseSimpliedResult | null;
}

/**
 * 简化版烧香 Hook
 * 基于测试文件 incense-burn-simplied.test.ts 实现
 */
export function useBurnIncenseSimplied() {
    const { publicKey, connected, signTransaction, signAllTransactions } = useWallet();
    const [state, setState] = useState<BurnIncenseSimpliedState>({
        loading: false,
        error: null,
        result: null,
    });

    /**
     * 执行简化版烧香
     */
    const burnIncenseSimplied = useCallback(async (
        params: BurnIncenseSimpliedParams
    ): Promise<BurnIncenseSimpliedResult> => {
        // 钱包连接检查
        if (!publicKey || !connected) {
            throw new BurnIncenseSimpliedError('请先连接钱包', 'WALLET_NOT_CONNECTED');
        }

        if (!signTransaction || !signAllTransactions) {
            throw new BurnIncenseSimpliedError('钱包不支持签名功能', 'WALLET_SIGNING_NOT_SUPPORTED');
        }

        // 防止重复点击
        if (state.loading) {
            throw new BurnIncenseSimpliedError('请等待当前操作完成', 'OPERATION_IN_PROGRESS');
        }

        // 参数验证
        if (params.amount < 1 || params.amount > 10) {
            throw new BurnIncenseSimpliedError('烧香数量必须在 1-10 之间', 'INVALID_AMOUNT');
        }

        if (params.incenseTypeId < 1 || params.incenseTypeId > 6) {
            throw new BurnIncenseSimpliedError('香型ID必须在 1-6 之间', 'INVALID_INCENSE_TYPE');
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

            // 创建简化版烧香合约实例
            const contract = new BurnIncenseSimpliedContract(walletAdapter);

            // 检查用户余额
            const hasEnoughBalance = await contract.checkUserBalance(publicKey, params.paymentAmount);
            if (!hasEnoughBalance) {
                throw new BurnIncenseSimpliedError('余额不足，无法完成烧香', 'INSUFFICIENT_BALANCE');
            }

            // 获取香型配置以验证价格（可选）
            try {
                const incenseTypeConfig = await contract.getIncenseTypeConfig(params.incenseTypeId);
                const expectedPayment = incenseTypeConfig.pricePerUnit.toNumber() * params.amount;
                
                console.log('🏷️ 香型配置:', {
                    name: incenseTypeConfig.name,
                    pricePerUnit: incenseTypeConfig.pricePerUnit.toString(),
                    karmaReward: incenseTypeConfig.karmaReward,
                    incenseValue: incenseTypeConfig.incenseValue,
                    isActive: incenseTypeConfig.isActive,
                });

                if (params.paymentAmount !== expectedPayment) {
                    console.warn('⚠️ 支付金额与预期不符:', {
                        expected: expectedPayment,
                        provided: params.paymentAmount
                    });
                }
            } catch (error) {
                console.warn('⚠️ 无法获取香型配置:', error);
            }

            // 执行烧香
            console.log('🔥 开始执行简化版烧香...');
            const result = await contract.burnIncenseSimplied(publicKey, params);

            setState(prev => ({ ...prev, loading: false, result }));
            return result;
        } catch (error: any) {
            const errorMessage = error instanceof BurnIncenseSimpliedError 
                ? error.message 
                : '烧香失败';
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
        burnIncenseSimplied,
        resetState,
    };
}

/**
 * 获取用户状态的 Hook
 */
export function useUserState() {
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

            const contract = new BurnIncenseSimpliedContract(walletAdapter);
            const state = await contract.getUserState(publicKey);
            
            console.log('📊 用户状态:', {
                karmaPoints: state.karmaPoints.toString(),
                totalIncenseValue: state.totalIncenseValue.toString(),
                totalSolSpent: state.totalSolSpent.toString(),
                dailyBurnCount: state.dailyBurnCount,
                dailyDrawCount: state.dailyDrawCount,
                dailyWishCount: state.dailyWishCount,
                totalBurnCount: state.totalBurnCount,
                totalDrawCount: state.totalDrawCount,
                totalWishCount: state.totalWishCount,
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
 * 获取香型配置的 Hook
 */
export function useIncenseTypeConfig(incenseTypeId: number) {
    const { publicKey, connected, signTransaction, signAllTransactions } = useWallet();
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchConfig = useCallback(async () => {
        if (!publicKey || !connected) {
            setConfig(null);
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

            const contract = new BurnIncenseSimpliedContract(walletAdapter);
            const incenseConfig = await contract.getIncenseTypeConfig(incenseTypeId);
            
            console.log('🏷️ 香型配置:', {
                incenseTypeId: incenseConfig.incenseTypeId,
                name: incenseConfig.name,
                description: incenseConfig.description,
                pricePerUnit: incenseConfig.pricePerUnit.toString(),
                karmaReward: incenseConfig.karmaReward,
                incenseValue: incenseConfig.incenseValue,
                isActive: incenseConfig.isActive,
                rarity: incenseConfig.rarity,
            });
            
            setConfig(incenseConfig);
        } catch (err: any) {
            setError(err.message);
            console.error('❌ 获取香型配置失败:', err);
        } finally {
            setLoading(false);
        }
    }, [publicKey, connected, signTransaction, signAllTransactions, incenseTypeId]);

    return {
        config,
        loading,
        error,
        fetchConfig,
    };
}
