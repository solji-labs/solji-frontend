import { httpGet, httpPost } from '@/lib/http';
import type {
    DonationLeaderboardResponse,
    FortuneHistoryResponse,
    HonorWallResponse,
    IncenseLeaderboardResponse,
    ProfileResponse,
    ProfileBasicResponse,
    TempleLevelResponse,
    TempleStatsResponse,
    WishesResponse,
    ProfileNftsResponse,
    ProfileActivitiesResponse,
    ProfileAchievementsResponse
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

export async function getWishes(userPubkey?: string): Promise<WishesResponse> {
    return httpGet<WishesResponse>('/api/wishes', {
        headers: {
            'Content-Type': 'application/json',
            ...(userPubkey ? { 'X-User-Pubkey': userPubkey } : {}),
        },
        cache: 'no-store',
    });
}

export async function likeWish(wishId: number, userPubkey?: string): Promise<any> {
    return httpPost<any>(`/api/wishes/${wishId}/like`, { wish_id: wishId }, {
        headers: {
            'Content-Type': 'application/json',
            ...(userPubkey ? { 'X-User-Pubkey': userPubkey } : {}),
        },
    });
}

export async function getProfileBasic(userPubkey: string): Promise<ProfileBasicResponse> {
    return httpGet<ProfileBasicResponse>(`/api/profile/${userPubkey}/basic`);
}

export async function getProfileNfts(userPubkey: string): Promise<ProfileNftsResponse> {
    return httpGet<ProfileNftsResponse>(`/api/profile/${userPubkey}/nfts`);
}

export async function getProfileActivities(userPubkey: string): Promise<ProfileActivitiesResponse> {
    return httpGet<ProfileActivitiesResponse>(`/api/profile/${userPubkey}/activities`);
}

export async function getProfileAchievements(userPubkey: string): Promise<ProfileAchievementsResponse> {
    return httpGet<ProfileAchievementsResponse>(`/api/profile/${userPubkey}/achievements`);
}

const isNotFoundError = (error: unknown) => {
    return error instanceof Error && /HTTP\s+404/i.test(error.message);
};

export async function getProfile(): Promise<ProfileResponse | null> {
    try {
        return await httpGet<ProfileResponse>('/api/profile');
    } catch (error) {
        if (!isNotFoundError(error)) {
            throw error;
        }

        try {
            return await httpGet<ProfileResponse>('/api/user/profile');
        } catch (innerError) {
            if (isNotFoundError(innerError)) {
                return null;
            }
            throw innerError;
        }
    }
}

export async function ipfsUpload(content: string): Promise<{ hash: string; size: number; url: string }> {
    return httpPost<{ hash: string; size: number; url: string }>(`/api/ipfs/upload`, { content });
}
