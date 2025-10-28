import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
    DonateFundContract, 
    DonateFundParams, 
    DonateFundResult, 
    DonateFundError 
} from '@/lib/contracts/donate-fund';
import { Wallet } from '@coral-xyz/anchor';
import { Transaction } from '@solana/web3.js';

export interface DonateFundState {
    loading: boolean;
    error: string | null;
    result: DonateFundResult | null;
}

/**
 * 捐赠 Hook
 * 基于测试文件 donation.test.ts 实现
 */
export function useDonateFund() {
    const { publicKey, connected, signTransaction, signAllTransactions } = useWallet();
    const [state, setState] = useState<DonateFundState>({
        loading: false,
        error: null,
        result: null,
    });

    /**
     * 执行捐赠
     */
    const donateFund = useCallback(async (
        params: DonateFundParams
    ): Promise<DonateFundResult> => {
        // 钱包连接检查
        if (!publicKey || !connected) {
            throw new DonateFundError('请先连接钱包', 'WALLET_NOT_CONNECTED');
        }

        if (!signTransaction || !signAllTransactions) {
            throw new DonateFundError('钱包不支持签名功能', 'WALLET_SIGNING_NOT_SUPPORTED');
        }

        // 防止重复点击
        if (state.loading) {
            throw new DonateFundError('请等待当前操作完成', 'OPERATION_IN_PROGRESS');
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

            // 创建捐赠合约实例
            const contract = new DonateFundContract(walletAdapter);

            // 执行捐赠
            console.log('💰 开始执行捐赠...');
            const result = await contract.donateFund(publicKey, params);

            setState(prev => ({ ...prev, loading: false, result }));
            return result;
        } catch (error: any) {
            const errorMessage = error instanceof DonateFundError 
                ? error.message 
                : '捐赠失败';
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
        donateFund,
        resetState,
    };
}

/**
 * 获取用户捐赠状态的 Hook
 */
export function useUserDonationState() {
    const { publicKey, connected, signTransaction, signAllTransactions } = useWallet();
    const [donationState, setDonationState] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDonationState = useCallback(async () => {
        if (!publicKey || !connected) {
            setDonationState(null);
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

            const contract = new DonateFundContract(walletAdapter);
            const state = await contract.getUserDonationState(publicKey);
            
            console.log('📊 用户捐赠状态:', {
                totalDonationAmount: state.totalDonationAmount.toString(),
                totalDonationCount: state.totalDonationCount,
                donationLevel: state.donationLevel,
                hasMintedBadgeNft: state.hasMintedBadgeNft,
            });
            
            setDonationState(state);
        } catch (err: any) {
            setError(err.message);
            console.error('❌ 获取捐赠状态失败:', err);
        } finally {
            setLoading(false);
        }
    }, [publicKey, connected, signTransaction, signAllTransactions]);

    return {
        donationState,
        loading,
        error,
        fetchDonationState,
    };
}

/**
 * 捐赠等级配置
 */
export const DONATION_LEVELS = {
    1: {
        level: 1,
        name: '青铜信徒',
        minAmount: 0.05, // SOL
        badge: 'Bronze Believer',
    },
    2: {
        level: 2,
        name: '白银信徒',
        minAmount: 0.2,
        badge: 'Silver Believer',
    },
    3: {
        level: 3,
        name: '黄金信徒',
        minAmount: 1.0,
        badge: 'Gold Believer',
    },
    4: {
        level: 4,
        name: '至尊信徒',
        minAmount: 5.0,
        badge: 'Supreme Believer',
    },
};

/**
 * 根据捐赠金额计算捐赠等级
 */
export function calculateDonationLevel(totalAmount: number): number {
    const amountInSol = totalAmount / 1_000_000_000; // 转换为 SOL
    
    if (amountInSol >= 5.0) return 4;
    if (amountInSol >= 1.0) return 3;
    if (amountInSol >= 0.2) return 2;
    if (amountInSol >= 0.05) return 1;
    return 0;
}

/**
 * 根据捐赠金额计算奖励
 */
export function calculateDonationRewards(amount: number): {
    karmaPoints: number;
    incenseValue: number;
} {
    // 基于 Rust 代码逻辑
    // 功德值 = amount / 0.01 SOL * 13
    // 香火值 = amount / 0.01 SOL * 120
    const units = amount / 0.01;
    return {
        karmaPoints: Math.floor(units * 13),
        incenseValue: Math.floor(units * 120),
    };
}
