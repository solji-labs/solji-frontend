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
