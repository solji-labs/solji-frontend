import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { DrawFortuneContract, DrawFortuneParams, DrawFortuneResult, DrawFortuneError } from '@/lib/contracts/draw-fortune';
import { Wallet } from '@coral-xyz/anchor';
import { Transaction } from '@solana/web3.js';

export interface DrawFortuneState {
    loading: boolean;
    error: string | null;
    result: DrawFortuneResult | null;
}

export function useDrawFortune() {
    const { publicKey, connected, signTransaction, signAllTransactions } = useWallet();
    const [state, setState] = useState<DrawFortuneState>({
        loading: false,
        error: null,
        result: null,
    });

    const drawFortune = useCallback(async (params: DrawFortuneParams): Promise<DrawFortuneResult> => {
        if (!publicKey || !connected) {
            throw new DrawFortuneError('请先连接钱包', 'WALLET_NOT_CONNECTED');
        }

        if (!signTransaction || !signAllTransactions) {
            throw new DrawFortuneError('钱包不支持签名功能', 'WALLET_SIGNING_NOT_SUPPORTED');
        }

        // 防止重复点击
        if (state?.loading) {
            throw new DrawFortuneError('请等待当前操作完成', 'OPERATION_IN_PROGRESS');
        }

        setState(prev => ({ ...prev, loading: true, error: null, result: null }));

        try {
            console.log('[solji] 开始抽签:', params);

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
            const drawFortuneContract = new DrawFortuneContract(walletAdapter);

            // 执行抽签
            const result = await drawFortuneContract.drawFortune(publicKey, params);

            console.log('[solji] 抽签成功:', result);
            setState(prev => ({ ...prev, loading: false, result }));
            return result;

        } catch (error: any) {
            const errorMessage = error instanceof DrawFortuneError ? error.message : '抽签失败';
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
        drawFortune,
        resetState,
    };
}
