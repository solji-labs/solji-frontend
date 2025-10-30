/**
 * 寺庙相关 API
 * 基于 solji-chain-scanner API 文档
 */

// API 基础 URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://185.234.74.185:10081';

/**
 * 通用响应格式
 */
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 分页响应格式
 */
interface PaginatedResponse<T> {
  total: number;
  size: number;
  page: number;
  list: T[];
}

// ==================== 数据接口定义 ====================

/**
 * 最近活动记录
 */
export interface RecentActivity {
  user_address: string;
  instruction_type: string;
  instruction_tag: string;
  create_at: string;
  since_at: string;
}

/**
 * 顶级贡献者
 */
export interface TopContributor {
  user_address: string;
  karma_points: number;
  incense_value: number;
}

/**
 * 排行榜项
 */
export interface LeaderboardItem {
  user_address: string;
  karma_points: number;
  incense_value: number;
}

/**
 * 排行榜数据
 */
export interface LeaderboardData {
  dateRangeType: 'daily' | 'weekly' | 'monthly';
  total: number;
  list: LeaderboardItem[];
}

/**
 * 寺庙概览
 */
export interface TempleOverview {
  totalBelievers: number;
  totalIncenseCount: number;
  totalFortuneCount: number;
  totalWishCount: number;
  totalDonationAmount: number;
  totalInteractions: number;
  totalIncenseValue: number;
  dailyActiveUsers: number;
}

/**
 * 用户运势记录
 */
export interface FortuneRecord {
  signature: string;
  user_address: string;
  fortune_type_id: number;
  fortune_content: string;
  created_at: string;
}

/**
 * 用户心愿记录
 */
export interface WishRecord {
  wish_id: number;
  user_address: string;
  wish_content: string;
  is_anonymous: boolean;
  create_at: string;
  synced_at: string;
  total_likes: number;
}

/**
 * 公开心愿记录（与后端 WishItem 对应）
 */
export interface PublicWishItem {
  wish_id: number;
  user_address: string;
  wish_content: string;
  is_anonymous: boolean;
  create_at: string;
  synced_at: string;
  total_likes: number;
}

/**
 * 捐赠荣誉墙记录
 */
export interface DonationRecord {
  user_address: string;
  donation_amount: number;
  create_date: string;
}

/**
 * 用户活动记录
 */
export interface UserActivity {
  signature: string;
  slot: number;
  instruction_type: string;
  instruction_tag: string;
  user_address: string;
  created_at: string;
  reward_karma_points: number;
}

// ==================== API 函数 ====================

/**
 * 获取最近活动记录
 * @param size 每页数量，范围：1-100，默认10
 * @param page 页码，从1开始，默认1
 */
export async function getRecentActivities(
  size: number = 10,
  page: number = 1
): Promise<PaginatedResponse<RecentActivity>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/temple/recentActivities?size=${size}&page=${page}`
    );
    const result: ApiResponse<PaginatedResponse<RecentActivity>> = await response.json();
    
    if (result.code === 0) {
      return result.data;
    }
    
    throw new Error(result.message || '获取最近活动失败');
  } catch (error) {
    console.error('获取最近活动失败:', error);
    throw error;
  }
}

/**
 * 获取顶级贡献者
 * @param size 每页数量，范围：1-100，默认10
 * @param page 页码，从1开始，默认1
 */
export async function getTopContributors(
  size: number = 10,
  page: number = 1
): Promise<PaginatedResponse<TopContributor>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/temple/topContributors?size=${size}&page=${page}`
    );
    const result: ApiResponse<PaginatedResponse<TopContributor>> = await response.json();
    
    if (result.code === 0) {
      return result.data;
    }
    
    throw new Error(result.message || '获取顶级贡献者失败');
  } catch (error) {
    console.error('获取顶级贡献者失败:', error);
    throw error;
  }
}

/**
 * 获取排行榜
 * @param dateRangeType 时间范围类型：daily(日榜)、weekly(周榜)、monthly(月榜)
 * @param limit 排行榜数量，范围：1-1000，默认100
 */
export async function getLeaderboards(
  dateRangeType: 'daily' | 'weekly' | 'monthly' = 'daily',
  limit: number = 100
): Promise<LeaderboardData> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/temple/dashboard/leaderboards?dateRangeType=${dateRangeType}&limit=${limit}`
    );
    const result: ApiResponse<LeaderboardData> = await response.json();
    
    if (result.code === 0) {
      return result.data;
    }
    
    throw new Error(result.message || '获取排行榜失败');
  } catch (error) {
    console.error('获取排行榜失败:', error);
    throw error;
  }
}

/**
 * 获取寺庙概览
 */
export async function getTempleOverview(): Promise<TempleOverview> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/temple/overview`);
    const result: ApiResponse<TempleOverview> = await response.json();
    
    if (result.code === 0) {
      return result.data;
    }
    
    throw new Error(result.message || '获取寺庙概览失败');
  } catch (error) {
    console.error('获取寺庙概览失败:', error);
    throw error;
  }
}

/**
 * 获取用户运势记录
 * @param userAddress 用户钱包地址（完整地址）
 * @param size 每页数量，范围：1-100，默认10
 * @param page 页码，从1开始，默认1
 */
export async function getUserFortune(
  userAddress: string,
  size: number = 10,
  page: number = 1
): Promise<PaginatedResponse<FortuneRecord>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/temple/fortune/recentFortune?userAddress=${encodeURIComponent(userAddress)}&size=${size}&page=${page}`
    );
    const result: ApiResponse<PaginatedResponse<FortuneRecord>> = await response.json();
    
    if (result.code === 0) {
      return result.data;
    }
    
    throw new Error(result.message || '获取用户运势记录失败');
  } catch (error) {
    console.error('获取用户运势记录失败:', error);
    throw error;
  }
}

/**
 * 获取用户心愿记录
 * @param userAddress 用户钱包地址（完整地址）
 * @param size 每页数量，范围：1-100，默认10
 * @param page 页码，从1开始，默认1
 */
export async function getUserWishes(
  userAddress: string,
  size: number = 10,
  page: number = 1
): Promise<PaginatedResponse<WishRecord>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/temple/wishes/userWish?userAddress=${encodeURIComponent(userAddress)}&size=${size}&page=${page}`
    );
    const result: ApiResponse<PaginatedResponse<WishRecord>> = await response.json();
    
    if (result.code === 0) {
      return result.data;
    }
    
    throw new Error(result.message || '获取用户心愿记录失败');
  } catch (error) {
    console.error('获取用户心愿记录失败:', error);
    throw error;
  }
}

/**
 * 获取公开心愿记录
 * @param size 每页数量，范围：1-100，默认10
 * @param page 页码，从1开始，默认1
 */
export async function getPublicWishes(
  size: number = 10,
  page: number = 1
): Promise<PaginatedResponse<PublicWishItem>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/temple/wishes/publicWish?size=${size}&page=${page}`
    );
    const result: ApiResponse<PaginatedResponse<PublicWishItem>> = await response.json();
    
    if (result.code === 0) {
      return result.data;
    }
    
    throw new Error(result.message || '获取公开心愿记录失败');
  } catch (error) {
    console.error('获取公开心愿记录失败:', error);
    throw error;
  }
}

/**
 * 保存心愿内容到 IPFS
 */
export interface SaveWishContentRequest {
  wish_id: number;
  content: string;
  user_address: string;
  metadata?: Record<string, string>;
}

export interface SaveWishContentResponse {
  wish_id: number;
  cid: string;
  gateway_url: string;
  size: number;
  uploaded_at: string;
}

export async function saveWishContent(
  request: SaveWishContentRequest
): Promise<SaveWishContentResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/wishes/saveWishContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      }
    );
    const result: ApiResponse<SaveWishContentResponse> = await response.json();
    
    if (result.code === 0) {
      return result.data;
    }
    
    throw new Error(result.message || '保存心愿内容失败');
  } catch (error) {
    console.error('保存心愿内容失败:', error);
    throw error;
  }
}

/**
 * 获取捐赠荣誉墙
 * @param size 每页数量，范围：1-100，默认10
 * @param page 页码，从1开始，默认1
 */
export async function getDonationHonorWall(
  size: number = 10,
  page: number = 1
): Promise<PaginatedResponse<DonationRecord>> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/temple/donate/honorWall?size=${size}&page=${page}`
    );
    const result: ApiResponse<PaginatedResponse<DonationRecord>> = await response.json();
    
    if (result.code === 0) {
      return result.data;
    }
    
    throw new Error(result.message || '获取捐赠荣誉墙失败');
  } catch (error) {
    console.error('获取捐赠荣誉墙失败:', error);
    throw error;
  }
}

/**
 * 获取用户活动记录
 * @param userAddress 用户钱包地址（完整地址）
 * @param size 每页数量，范围：1-100，默认10
 * @param page 页码，从1开始，默认1
 */
export async function getUserActivities(
  userAddress: string,
  size: number = 10,
  page: number = 1
): Promise<{
  activities: UserActivity[];
  total: number;
  size: number;
  page: number;
}> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/profile/activities?userAddress=${encodeURIComponent(userAddress)}&size=${size}&page=${page}`
    );
    const result: ApiResponse<{
      activities: UserActivity[];
      total: number;
      size: number;
      page: number;
    }> = await response.json();
    
    if (result.code === 0) {
      return result.data;
    }
    
    throw new Error(result.message || '获取用户活动记录失败');
  } catch (error) {
    console.error('获取用户活动记录失败:', error);
    throw error;
  }
}
