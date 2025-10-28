// Core data types for Solji DApp

export interface User {
  id: string;
  walletAddress: string;
  username: string;
  avatar?: string;
  meritPoints: number;
  rank: UserRank;
  createdAt: Date;
}

export type UserRank = '居士' | '香客' | '供奉' | '寺主';

/**
 * 用户功德值等级系统
 * Karma Points Level System
 */
export interface KarmaLevel {
  level: number;
  name: string;
  nameEn: string;
  minKarmaPoints: number;
  badgeLevel: 'Bronze' | 'Silver' | 'Gold' | 'Supreme';
}

/**
 * 功德值等级配置
 * 居士 → 香客 → 供奉 → 寺主
 */
export const KARMA_LEVELS: readonly KarmaLevel[] = [
  {
    level: 1,
    name: '居士',
    nameEn: 'Lay Buddhist',
    minKarmaPoints: 5000,
    badgeLevel: 'Bronze'
  },
  {
    level: 2,
    name: '香客',
    nameEn: 'Pilgrim',
    minKarmaPoints: 30000,
    badgeLevel: 'Silver'
  },
  {
    level: 3,
    name: '供奉',
    nameEn: 'Devotee',
    minKarmaPoints: 150000,
    badgeLevel: 'Gold'
  },
  {
    level: 4,
    name: '寺主',
    nameEn: 'Temple Master',
    minKarmaPoints: 500000,
    badgeLevel: 'Supreme'
  }
] as const;

/**
 * 根据功德值获取用户等级
 * @param karmaPoints 功德值
 * @returns 用户等级信息
 */
export function getKarmaLevel(karmaPoints: number): KarmaLevel {
  // 从高到低遍历，找到第一个满足条件的等级
  for (let i = KARMA_LEVELS.length - 1; i >= 0; i--) {
    if (karmaPoints >= KARMA_LEVELS[i].minKarmaPoints) {
      return KARMA_LEVELS[i];
    }
  }
  // 如果功德值低于最低等级，返回最低等级但标记为未达标
  return {
    level: 0,
    name: '新人',
    nameEn: 'Newcomer',
    minKarmaPoints: 0,
    badgeLevel: 'Bronze'
  };
}

/**
 * 获取下一个等级信息
 * @param currentKarmaPoints 当前功德值
 * @returns 下一个等级信息，如果已是最高等级则返回 null
 */
export function getNextKarmaLevel(currentKarmaPoints: number): KarmaLevel | null {
  for (const level of KARMA_LEVELS) {
    if (currentKarmaPoints < level.minKarmaPoints) {
      return level;
    }
  }
  return null; // 已达到最高等级
}

/**
 * 计算到下一等级的进度百分比
 * @param currentKarmaPoints 当前功德值
 * @returns 进度百分比 (0-100)
 */
export function getKarmaLevelProgress(currentKarmaPoints: number): number {
  const currentLevel = getKarmaLevel(currentKarmaPoints);
  const nextLevel = getNextKarmaLevel(currentKarmaPoints);
  
  if (!nextLevel) {
    return 100; // 已达到最高等级
  }
  
  const currentMin = currentLevel.minKarmaPoints;
  const nextMin = nextLevel.minKarmaPoints;
  const progress = ((currentKarmaPoints - currentMin) / (nextMin - currentMin)) * 100;
  
  return Math.min(Math.max(progress, 0), 100);
}

export interface IncenseType {
  id: string;
  name: string;
  nameEn: string;
  price: number; // in SOL
  meritPoints: number;
  description: string;
  image: string;
  dailyLimit: number;
}

export interface Fortune {
  id: string;
  userId: string;
  level: FortuneLevel;
  text: string;
  interpretation?: string;
  createdAt: Date;
}

export type FortuneLevel =
  | '大吉'
  | '中吉'
  | '小吉'
  | '吉'
  | '末吉'
  | '凶'
  | '大凶';

export interface Wish {
  id: string;
  userId: string;
  content: string;
  isPublic: boolean;
  nftMinted: boolean;
  nftAddress?: string;
  createdAt: Date;
}

export interface Donation {
  id: string;
  userId: string;
  amount: number; // in SOL
  tier: DonationTier;
  badgeNftAddress?: string;
  createdAt: Date;
}

export type DonationTier = 'bronze' | 'silver' | 'gold' | 'supreme';

export interface TempleStats {
  level: number;
  totalIncenseValue: number;
  totalDonations: number;
  totalBelievers: number;
  totalFortunes: number;
  totalWishes: number;
  totalInteractions: number;
}

export interface NFT {
  id: string;
  type: NFTType;
  name: string;
  image: string;
  mintAddress: string;
  owner: string;
  metadata: Record<string, any>;
}

export type NFTType = 'incense' | 'buddha' | 'amulet' | 'wish-tower' | 'badge';

export interface Amulet {
  id: string;
  name: string;
  type: AmuletType;
  effect: string;
  rarity: AmuletRarity;
  image: string;
  owner: string;
  mintDate: Date;
}

export type AmuletType =
  | 'fortune'
  | 'merit'
  | 'protection'
  | 'wealth'
  | 'health';
export type AmuletRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface BuddhaStatue {
  id: string;
  name: string;
  description: string;
  image: string;
  specialAbility: string;
  owner: string;
  isSoulbound: boolean;
}
