import { useCallback, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Wallet } from '@coral-xyz/anchor';
import { Transaction } from '@solana/web3.js';
import { DonateFundContract, DonateFundError } from '@/lib/contracts/donate-fund';

export interface DonateState {
    loading: boolean;
    error: string | null;
    signature: string | null;
}

export function useDonateFund() {
    const { publicKey, connected, signTransaction, signAllTransactions } = useWallet();
    const [state, setState] = useState<DonateState>({ loading: false, error: null, signature: null });

    const donate = useCallback(async (amountSol: number): Promise<string> => {
        if (!publicKey || !connected) {
            throw new DonateFundError('请先连接钱包', 'WALLET_NOT_CONNECTED');
        }
        if (!signTransaction || !signAllTransactions) {
            throw new DonateFundError('钱包不支持签名功能', 'WALLET_SIGNING_NOT_SUPPORTED');
        }
        if (state.loading) {
            throw new DonateFundError('请等待当前操作完成', 'OPERATION_IN_PROGRESS');
        }

        setState({ loading: true, error: null, signature: null });

        try {
            const walletAdapter = {
                publicKey,
                signTransaction: async (tx: Transaction) => await signTransaction(tx),
                signAllTransactions: async (txs: Transaction[]) => await signAllTransactions(txs),
            } as Wallet;

            const contract = new DonateFundContract(walletAdapter);
            const sig = await contract.donate(publicKey, amountSol);
            setState({ loading: false, error: null, signature: sig });
            return sig;
        } catch (err: any) {
            const message = err instanceof DonateFundError ? err.message : '捐赠失败';
            setState({ loading: false, error: message, signature: null });
            throw err;
        }
    }, [publicKey, connected, signTransaction, signAllTransactions, state.loading]);

    const reset = useCallback(() => setState({ loading: false, error: null, signature: null }), []);

    return { ...state, donate, reset };
}


