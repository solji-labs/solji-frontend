import type { IncenseType, DonationTier } from "./types"

export const INCENSE_TYPES: IncenseType[] = [
  {
    id: "basic",
    name: "清香",
    nameEn: "Basic Incense",
    price: 0.01,
    meritPoints: 1,
    description: "Simple and pure, for daily devotion",
    image: "/traditional-incense-stick-glowing.jpg",
    dailyLimit: 10,
  },
  {
    id: "sandalwood",
    name: "檀香",
    nameEn: "Sandalwood",
    price: 0.05,
    meritPoints: 5,
    description: "Premium sandalwood for deeper meditation",
    image: "/sandalwood-incense-with-golden-glow.jpg",
    dailyLimit: 10,
  },
  {
    id: "dragon",
    name: "龙香",
    nameEn: "Dragon Incense",
    price: 0.1,
    meritPoints: 10,
    description: "Rare dragon incense for great fortune",
    image: "/mystical-dragon-incense-with-purple-smoke.jpg",
    dailyLimit: 10,
  },
  {
    id: "supreme",
    name: "至尊香",
    nameEn: "Supreme Incense",
    price: 0.3,
    meritPoints: 30,
    description: "The ultimate offering for enlightenment",
    image: "/supreme-golden-incense-with-rainbow-aura.jpg",
    dailyLimit: 10,
  },
]

export const DONATION_TIERS: Record<
  DonationTier,
  {
    name: string
    nameEn: string
    minAmount: number
    meritPoints: number
    badge: string
    benefits: string[]
  }
> = {
  bronze: {
    name: "铜德徽章",
    nameEn: "Bronze Merit Badge",
    minAmount: 0.05,
    meritPoints: 65,
    badge: "Bronze",
    benefits: ["Name on honor wall", "Bronze badge NFT"],
  },
  silver: {
    name: "银进徽章",
    nameEn: "Silver Progress Badge",
    minAmount: 0.2,
    meritPoints: 1300,
    badge: "Silver",
    benefits: ["Vote on proposals", "Silver badge NFT", "All Bronze benefits"],
  },
  gold: {
    name: "金护徽章",
    nameEn: "Gold Guardian Badge",
    minAmount: 1,
    meritPoints: 14000,
    badge: "Gold",
    benefits: ["NFT governance rights", "Gold badge NFT", "All Silver benefits"],
  },
  supreme: {
    name: "至尊龙徽",
    nameEn: "Supreme Dragon Badge",
    minAmount: 5,
    meritPoints: 120000,
    badge: "Supreme",
    benefits: ["Co-builder status", "Easter eggs access", "Supreme badge NFT", "All Gold benefits"],
  },
}

export const FORTUNE_LEVELS = [
  { level: "大吉", nameEn: "Excellent Fortune", probability: 0.05, meritBonus: 3 },
  { level: "中吉", nameEn: "Great Fortune", probability: 0.15, meritBonus: 2 },
  { level: "小吉", nameEn: "Good Fortune", probability: 0.25, meritBonus: 2 },
  { level: "吉", nameEn: "Fortune", probability: 0.3, meritBonus: 2 },
  { level: "末吉", nameEn: "Minor Fortune", probability: 0.15, meritBonus: 2 },
  { level: "凶", nameEn: "Bad Fortune", probability: 0.08, meritBonus: 2 },
  { level: "大凶", nameEn: "Terrible Fortune", probability: 0.02, meritBonus: 3 },
] as const

export const USER_RANKS = [
  { rank: "居士", nameEn: "Layman", minMerit: 0 },
  { rank: "香客", nameEn: "Pilgrim", minMerit: 100 },
  { rank: "供奉", nameEn: "Devotee", minMerit: 1000 },
  { rank: "寺主", nameEn: "Temple Master", minMerit: 10000 },
] as const

export const TEMPLE_LEVELS = [
  {
    level: 1,
    name: "草庙",
    nameEn: "Rustic Shrine",
    requirements: {
      incenseValue: 0,
      fortunes: 0,
      wishes: 0,
      donations: 0,
    },
  },
  {
    level: 2,
    name: "赤庙",
    nameEn: "Vibrant Shrine",
    requirements: {
      incenseValue: 10000,
      fortunes: 5000,
      wishes: 3000,
      donations: 100,
    },
  },
  {
    level: 3,
    name: "灵殿",
    nameEn: "Temple of Spirit",
    requirements: {
      incenseValue: 500000,
      fortunes: 30000,
      wishes: 10000,
      donations: 1000,
    },
  },
  {
    level: 4,
    name: "赛博神殿",
    nameEn: "Cyber Shrine",
    requirements: {
      incenseValue: 1000000,
      fortunes: 100000,
      wishes: 50000,
      donations: 5000,
    },
  },
] as const

export const AMULET_TYPES = [
  {
    type: "fortune",
    name: "Fortune Amulet",
    nameZh: "福运护符",
    effect: "+5% Fortune Draw Luck",
    rarity: "rare",
    dropChance: 0.1,
  },
  {
    type: "merit",
    name: "Merit Amulet",
    nameZh: "功德护符",
    effect: "+10% Merit Points",
    rarity: "epic",
    dropChance: 0.05,
  },
  {
    type: "protection",
    name: "Protection Amulet",
    nameZh: "守护护符",
    effect: "Prevents Bad Fortune Once",
    rarity: "legendary",
    dropChance: 0.02,
  },
  {
    type: "wealth",
    name: "Wealth Amulet",
    nameZh: "财富护符",
    effect: "+5% SOL Rewards",
    rarity: "epic",
    dropChance: 0.05,
  },
  {
    type: "health",
    name: "Health Amulet",
    nameZh: "健康护符",
    effect: "Daily Merit Bonus +2",
    rarity: "rare",
    dropChance: 0.1,
  },
] as const

export const BUDDHA_STATUES = [
  {
    id: "guanyin",
    name: "Guanyin",
    nameZh: "观音菩萨",
    description: "Goddess of Mercy and Compassion",
    specialAbility: "Increases wish fulfillment rate by 10%",
    image: "🙏",
  },
  {
    id: "maitreya",
    name: "Maitreya Buddha",
    nameZh: "弥勒佛",
    description: "The Laughing Buddha of Happiness",
    specialAbility: "Doubles merit points from donations",
    image: "😊",
  },
  {
    id: "amitabha",
    name: "Amitabha Buddha",
    nameZh: "阿弥陀佛",
    description: "Buddha of Infinite Light",
    specialAbility: "Grants one extra fortune draw per day",
    image: "✨",
  },
  {
    id: "ksitigarbha",
    name: "Ksitigarbha",
    nameZh: "地藏菩萨",
    description: "Bodhisattva of the Earth",
    specialAbility: "Protects from bad fortunes",
    image: "🌍",
  },
] as const
