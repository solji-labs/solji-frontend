import { httpGet } from '@/lib/http';
import type {
  DonationLeaderboardResponse,
  FortuneHistoryResponse,
  HonorWallResponse,
  IncenseLeaderboardResponse,
  TempleLevelResponse,
  TempleStatsResponse,
  WishesResponse
} from './types';

export async function getTempleLevel(): Promise<TempleLevelResponse> {
  return httpGet<TempleLevelResponse>('/api/temple/level');
}

export async function getDonationLeaderboard(
  period?: 'daily' | 'weekly' | 'monthly'
): Promise<DonationLeaderboardResponse> {
  return httpGet<DonationLeaderboardResponse>(
    `/api/donation/leaderboard?period=${period}`
  );
}

export async function getHonorWall(): Promise<HonorWallResponse> {
  return httpGet<HonorWallResponse>('/api/donation/honor-wall');
}

export async function getTempleStats(): Promise<TempleStatsResponse> {
  return httpGet<TempleStatsResponse>('/api/temple/stats');
}

export async function getIncenseLeaderboard(
  period: 'daily' | 'weekly' | 'monthly'
): Promise<IncenseLeaderboardResponse> {
  return httpGet<IncenseLeaderboardResponse>(
    `/api/incense/leaderboard?period=${period}`
  );
}

export async function getFortuneHistory(
  userPubkey: string,
  limit: number = 3
): Promise<FortuneHistoryResponse> {
  return httpGet<FortuneHistoryResponse>(
    `/api/fortune/user/${userPubkey}/history?limit=${limit}`
  );
}

export async function getWishes(): Promise<WishesResponse> {
  return httpGet<WishesResponse>('/api/wishes');
}

export async function getProfile(
  userPubkey: string
): Promise<FortuneHistoryResponse> {
  return httpGet<FortuneHistoryResponse>(`/api/profile/${userPubkey}`);
}
