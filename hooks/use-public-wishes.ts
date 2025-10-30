import { useState, useEffect, useCallback } from 'react';
import { getPublicWishes, PublicWishItem } from '@/lib/api/temple';

interface UsePublicWishesResult {
  wishes: PublicWishItem[];
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
 * 获取公开心愿列表的 Hook
 * @param initialSize 初始每页数量
 */
export function usePublicWishes(initialSize: number = 10): UsePublicWishesResult {
  const [wishes, setWishes] = useState<PublicWishItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [size] = useState(initialSize);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWishes = useCallback(async (currentPage: number, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await getPublicWishes(size, currentPage);
      
      if (append) {
        setWishes(prev => [...prev, ...result.list]);
      } else {
        setWishes(result.list);
      }
      
      setTotal(result.total);
      setPage(currentPage);
    } catch (err: any) {
      console.error('Failed to fetch public wishes:', err);
      setError(err.message || '获取公开心愿失败');
    } finally {
      setLoading(false);
    }
  }, [size]);

  // 初始加载
  useEffect(() => {
    fetchWishes(1, false);
  }, [fetchWishes]);

  // 加载更多
  const loadMore = useCallback(() => {
    if (!loading && wishes.length < total) {
      fetchWishes(page + 1, true);
    }
  }, [loading, wishes.length, total, page, fetchWishes]);

  // 刷新
  const refresh = useCallback(() => {
    fetchWishes(1, false);
  }, [fetchWishes]);

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
