import { useState, useEffect, useCallback } from 'react';
import { getTempleOverview, TempleOverview } from '@/lib/api/temple';

interface UseTempleOverviewResult {
  overview: TempleOverview | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * 获取寺庙概览数据的 Hook
 * @param autoRefreshInterval 自动刷新间隔（毫秒），默认 120000 (2分钟)
 */
export function useTempleOverview(autoRefreshInterval: number = 120000): UseTempleOverviewResult {
  const [overview, setOverview] = useState<TempleOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getTempleOverview();
      setOverview(data);
    } catch (err: any) {
      console.error('Failed to fetch temple overview:', err);
      setError(err.message || '获取寺庙概览失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  // 自动刷新
  useEffect(() => {
    if (autoRefreshInterval > 0) {
      const interval = setInterval(fetchOverview, autoRefreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefreshInterval, fetchOverview]);

  // 手动刷新
  const refresh = useCallback(() => {
    fetchOverview();
  }, [fetchOverview]);

  return {
    overview,
    loading,
    error,
    refresh,
  };
}
