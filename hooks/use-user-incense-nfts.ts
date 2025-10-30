import { useState, useEffect, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { getIncenseNftMintPda, getAssociatedTokenAddressSync } from '@/lib/solana';
import { INCENSE_TYPES, INCENSE_ID_TO_TYPE_ID } from '@/lib/constants';

export interface UserIncenseNFT {
  incenseTypeId: number;
  incenseId: string;
  incenseName: string;
  incenseNameEn: string;
  amount: number; // 持有数量
  mintAddress: string;
  tokenAccountAddress: string;
  image?: string;
  price: number;
  meritPoints: number;
}

export function useUserIncenseNfts() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [nfts, setNfts] = useState<UserIncenseNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserIncenseNfts = useCallback(async () => {
    if (!publicKey) {
      setNfts([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userNfts: UserIncenseNFT[] = [];

      // 遍历所有香型，检查用户是否持有对应的 NFT
      for (const incenseType of INCENSE_TYPES) {
        try {
          // 获取链上 type ID
          const typeId = INCENSE_ID_TO_TYPE_ID[incenseType.id];
          if (!typeId) {
            console.warn(`No type ID mapping for incense: ${incenseType.id}`);
            continue;
          }

          // 1. 获取该香型的 Mint PDA
          const mintPda = getIncenseNftMintPda(typeId);

          // 2. 获取用户的关联代币账户地址
          const userTokenAccount = getAssociatedTokenAddressSync(mintPda, publicKey);

          // 3. 查询用户的代币账户余额
          const tokenAccountInfo = await connection.getTokenAccountBalance(userTokenAccount);

          // 4. 如果用户持有该 NFT（余额 > 0）
          if (tokenAccountInfo && tokenAccountInfo.value.uiAmount && tokenAccountInfo.value.uiAmount > 0) {
            userNfts.push({
              incenseTypeId: typeId,
              incenseId: incenseType.id,
              incenseName: incenseType.name,
              incenseNameEn: incenseType.nameEn,
              amount: tokenAccountInfo.value.uiAmount,
              mintAddress: mintPda.toString(),
              tokenAccountAddress: userTokenAccount.toString(),
              image: incenseType.image,
              price: incenseType.price,
              meritPoints: incenseType.meritPoints,
            });
          }
        } catch (err) {
          // 如果代币账户不存在，说明用户没有持有该 NFT，跳过
          console.log(`User does not own incense type ${incenseType.id}`);
        }
      }

      setNfts(userNfts);
    } catch (err) {
      console.error('Failed to fetch user incense NFTs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch NFTs');
    } finally {
      setLoading(false);
    }
  }, [publicKey, connection]);

  // 当钱包连接或断开时，自动获取 NFT
  useEffect(() => {
    fetchUserIncenseNfts();
  }, [fetchUserIncenseNfts]);

  return {
    nfts,
    loading,
    error,
    refresh: fetchUserIncenseNfts,
    totalNfts: nfts.reduce((sum, nft) => sum + nft.amount, 0),
  };
}
