import { useState, useEffect, useCallback } from 'react';
import { getUserWishes, WishRecord } from '@/lib/api/temple';

interface UseUserWishesResult {
  wishes: WishRecord[];
  total: number;
  page: number;
  size: number;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

/**
 * 获取用户心愿列表的 Hook
 * @param userAddress 用户钱包地址
 * @param initialSize 初始每页数量
 */
export function useUserWishes(
  userAddress: string | undefined,
  initialSize: number = 10
): UseUserWishesResult {
  const [wishes, setWishes] = useState<WishRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size] = useState(initialSize);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWishes = useCallback(
    async (currentPage: number, append: boolean = false) => {
      if (!userAddress) {
        setWishes([]);
        setTotal(0);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await getUserWishes(userAddress, size, currentPage);

        if (append) {
          setWishes((prev) => [...prev, ...result.list]);
        } else {
          setWishes(result.list);
        }

        setTotal(result.total);
        setPage(currentPage);
      } catch (err: any) {
        console.error('Failed to fetch user wishes:', err);
        setError(err.message || '获取用户心愿失败');
      } finally {
        setLoading(false);
      }
    },
    [userAddress, size]
  );

  // 当用户地址变化时重新加载
  useEffect(() => {
    if (userAddress) {
      fetchWishes(1, false);
    } else {
      setWishes([]);
      setTotal(0);
      setError(null);
    }
  }, [userAddress, fetchWishes]);

  // 加载更多
  const loadMore = useCallback(() => {
    if (!loading && wishes.length < total) {
      fetchWishes(page + 1, true);
    }
  }, [loading, wishes.length, total, page, fetchWishes]);

  // 刷新
  const refresh = useCallback(() => {
    if (userAddress) {
      fetchWishes(1, false);
    }
  }, [userAddress, fetchWishes]);

  const hasMore = wishes.length < total;

  return {
    wishes,
    total,
    page,
    size,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
