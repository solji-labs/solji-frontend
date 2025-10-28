export interface TempleLevelResponse {
    current_level: number;
    level_name: string;
    level_name_en: string;
    next_level_requirements: {
        level: number;
        level_name: string;
        level_name_en: string;
        requirements: {
            donations_sol: number;
            draw_fortune: number;
            fortune_nfts: number;
            incense_points: number;
            wishes: number;
        };
    };
    progress_percentage: number;
    stats: {
        total_donations_sol: number;
        total_draw_fortune: number;
        total_fortune_nfts: number;
        total_incense_points: number;
        total_wishes: number;
    };
    updated_at: number;
}

export interface DonationLeaderboardItem {
    rank: number;
    total_donated: number; // SOL
    user_pubkey: string;
}

export interface DonationLeaderboardResponse {
    leaderboard: DonationLeaderboardItem[];
    pagination: {
        count: number;
        limit: number;
        offset: number;
    };
}

export interface HonorWallEntry {
    rank: number;
    tier: string; // 'bronze' | 'silver' | 'gold' | 'supreme'
    total_donated: number; // SOL
    user_pubkey: string;
}

export interface HonorWallResponse {
    count: number;
    entries: HonorWallEntry[];
}

export interface TempleStatsResponse {
    level: number;
    level_name: string;
    level_name_en: string;
    total_believers: number;
    total_donations: number;
    total_fortunes: number;
    total_incense_value: number;
    total_interactions: number;
    total_wishes: number;
    updated_at: number;
}

export interface IncenseLeaderboardItem {
    rank: number;
    total_donated: number; // SOL
    user_pubkey: string;
}

export interface IncenseLeaderboardResponse {
    leaderboard: IncenseLeaderboardItem[];
    pagination: {
        count: number;
        limit: number;
        offset: number;
    };
}

export interface FortuneHistoryItem {
    id: number;
    fortune_text: string;
    created_at: string;
    is_free: boolean;
    merit_cost: number;
    transaction_signature: string;
}

export interface FortuneHistoryResponse {
    count: number;
    history: FortuneHistoryItem[];
    user_pubkey: string;
}

export interface WishItem {
    id: number;
    wish_id: number;
    content: string;
    user_pubkey: string;
    likes: number;
    created_at: string;
    updated_at: string;
}

export interface WishesResponse {
    wishes: WishItem[];
    pagination: {
        count: number;
        limit: number;
        offset: number;
    };
}

