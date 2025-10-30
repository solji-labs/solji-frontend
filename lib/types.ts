// Core data types for Solji DApp
 


export interface UserState {
  walletAddress: string;
  karmaPoints: number;
  totalIncenseValue: number;
  totalDonationAmount: number;

  totalBurnCount: number;
  totalDrawCount: number;
  totalWishCount: number;
  totalDonationCount: number;


  dailyBurnCount: number;
  dailyDrawCount: number;
  dailyWishCount: number;

  createdAt: Date;
  lastActiveAt: Date;

  karmaLevel: KarmaLevel;
  
}

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
  incenseTypeId: number;
  name: string;
  nameEn: string;
  price: number; // in SOL
  meritPoints: number;
  incenseValue: number;
  description: string;
  image: string;
  dailyLimit: number;
}
 

export type FortuneLevel =
  | '大吉'
  | '中吉'
  | '小吉'
  | '吉'
  | '末吉'
  | '凶'
  | '大凶';
 

export type DonationTier = 'bronze' | 'silver' | 'gold' | 'supreme';
 

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
 




/**
 * 捐赠等级系统
 * Donate Level System
 */
export interface DonateLevel {
  level: number;
  name: string;
  nameEn: string;
  minAmount: number;
  badgeLevel: 'Bronze' | 'Silver' | 'Gold' | 'Supreme';
}

/**
 * 功德值等级配置
 * 居士 → 香客 → 供奉 → 寺主
 */
export const DONATE_LEVELS: readonly DonateLevel[] = [
  {
    level: 1,
    name: '铜德徽章',
    nameEn: 'Bronze',
    minAmount: 0.05,
    badgeLevel: 'Bronze'
  },
  {
    level: 2,
    name: '银德徽章',
    nameEn: 'Silver',
    minAmount: 0.2,
    badgeLevel: 'Silver'
  },
  {
    level: 3,
    name: '金德徽章',
    nameEn: 'Gold',
    minAmount: 1,
    badgeLevel: 'Gold'
  },
  {
    level: 4,
    name: '至尊徽章',
    nameEn: 'Supreme',
    minAmount: 5,
    badgeLevel: 'Supreme'
  }
] as const;






/**
 * 捐赠等级系统
 * Donate Level System
 */
export interface TempleLevel {
  level: number;
  name: string;
  nameEn: string;
  incenseValue: number;
  donationAmount: number;
  drawFortuneCount: number;
  wishCount: number;
}

/**
 * 功德值等级配置
 * 居士 → 香客 → 供奉 → 寺主
 */
export const TEMPLE_LEVELS: readonly TempleLevel[] = [
  {
    level: 1,
    name: '草庙',
    nameEn: 'Rustic Shrine',
    incenseValue: 0,
    donationAmount: 0,
    drawFortuneCount: 0,
    wishCount: 0
  },
  {
    level: 2,
    name: '赤庙',
    nameEn: 'Vibrant Shrine',
    incenseValue: 100000,
    donationAmount: 100,
    drawFortuneCount: 5000,
    wishCount: 3000
  },
  {
    level: 3,
    name: '灵殿',
    nameEn: 'Temple of Spirit',
    incenseValue: 1000000,
    donationAmount: 1000,
    drawFortuneCount: 50000,
    wishCount: 30000
  },
  {
    level: 4,
    name: '赛博神殿',
    nameEn: 'Cyber Temple',
    incenseValue: 10000000,
    donationAmount: 10000,
    drawFortuneCount: 500000,
    wishCount: 300000
  }
] as const;

/**
 * 根据寺庙数据计算当前等级
 * @param incenseValue 香火值
 * @param donationAmount 捐赠金额
 * @param drawFortuneCount 抽签次数
 * @param wishCount 心愿次数
 * @returns 寺庙等级
 */
export function getTempleLevel(
  incenseValue: number,
  donationAmount: number,
  drawFortuneCount: number,
  wishCount: number
): TempleLevel {
  // 从高到低遍历，找到第一个满足所有条件的等级
  for (let i = TEMPLE_LEVELS.length - 1; i >= 0; i--) {
    const level = TEMPLE_LEVELS[i];
    if (
      incenseValue >= level.incenseValue &&
      donationAmount >= level.donationAmount &&
      drawFortuneCount >= level.drawFortuneCount &&
      wishCount >= level.wishCount
    ) {
      return level;
    }
  }
  // 默认返回第一级
  return TEMPLE_LEVELS[0];
}

/**
 * 获取下一个寺庙等级
 * @param currentLevel 当前等级
 * @returns 下一个等级，如果已是最高等级则返回 null
 */
export function getNextTempleLevel(currentLevel: number): TempleLevel | null {
  if (currentLevel >= TEMPLE_LEVELS.length) {
    return null;
  }
  return TEMPLE_LEVELS[currentLevel];
}