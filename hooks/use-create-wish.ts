import { useState, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { CreateWishContract, CreateWishParams, CreateWishResult, CreateWishError } from '@/lib/contracts/create-wish';

export interface UseCreateWishReturn {
    createWish: (params: CreateWishParams) => Promise<CreateWishResult>;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
}

export function useCreateWish(): UseCreateWishReturn {
    const { wallet, publicKey } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    const createWish = useCallback(async (params: CreateWishParams): Promise<CreateWishResult> => {
        if (!wallet || !publicKey) {
            throw new CreateWishError('请先连接钱包', 'WALLET_NOT_CONNECTED');
        }

        setIsLoading(true);
        setError(null);

        try {
            console.log('[useCreateWish] 开始创建许愿...', {
                user: publicKey.toString(),
                params
            });

            // 创建合约实例
            const contract = new CreateWishContract(wallet.adapter as any);

            // 调用许愿方法
            const result = await contract.createWish(publicKey, params);

            console.log('[useCreateWish] 许愿成功:', result);
            return result as CreateWishResult;

        } catch (err: any) {
            console.error('[useCreateWish] 许愿失败:', err);

            let errorMessage = '许愿失败';
            if (err instanceof CreateWishError) {
                errorMessage = err.message;
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [wallet, publicKey]);

    return {
        createWish,
        isLoading,
        error,
        clearError,
    };
}
