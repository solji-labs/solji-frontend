"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Sparkles, Flame, ScrollText, Heart, Award, TrendingUp, Loader2 } from "lucide-react"
import { MeritBadge } from "@/components/merit-badge"
import { useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { DrawFortuneContract } from '@/lib/contracts/draw-fortune'
import { Wallet } from '@coral-xyz/anchor'
import { Transaction } from '@solana/web3.js'

interface UserStateData {
  karmaPoints: number;
  totalIncenseValue: number;
  totalSolSpent: number;
  totalDrawCount: number;
  totalWishCount: number;
  totalBurnCount: number;
  donationUnlockedBurns: number;
  dailyBurnCount: number;
  dailyDrawCount: number;
  dailyWishCount: number;
  createdAt: Date;
  lastActiveAt: Date;
}

export default function ProfilePage() {
  const { publicKey, connected, signTransaction, signAllTransactions } = useWallet();
  const [userState, setUserState] = useState<UserStateData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取用户状态
  useEffect(() => {
    async function fetchUserState() {
      if (!publicKey || !connected || !signTransaction || !signAllTransactions) {
        setUserState(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const walletAdapter = {
          publicKey,
          signTransaction: async (tx: Transaction) => {
            return await signTransaction(tx);
          },
          signAllTransactions: async (txs: Transaction[]) => {
            return await signAllTransactions(txs);
          },
        } as Wallet;

        const contract = new DrawFortuneContract(walletAdapter);
        const state = await contract.getUserState(publicKey);

        console.log('📊 用户状态:', {
          karmaPoints: state.karmaPoints.toString(),
          totalIncenseValue: state.totalIncenseValue.toString(),
          totalSolSpent: state.totalSolSpent.toString(),
          totalDrawCount: state.totalDrawCount,
          totalWishCount: state.totalWishCount,
          totalBurnCount: state.totalBurnCount,
          donationUnlockedBurns: state.donationUnlockedBurns,
          dailyBurnCount: state.dailyBurnCount,
          dailyDrawCount: state.dailyDrawCount,
          dailyWishCount: state.dailyWishCount,
          createdAt: new Date(state.createdAt.toNumber() * 1000).toISOString(),
          lastActiveAt: new Date(state.lastActiveAt.toNumber() * 1000).toISOString(),
        });

        setUserState({
          karmaPoints: state.karmaPoints.toNumber(),
          totalIncenseValue: state.totalIncenseValue.toNumber(),
          totalSolSpent: state.totalSolSpent.toNumber() / 1e9, // 转换为 SOL
          totalDrawCount: state.totalDrawCount,
          totalWishCount: state.totalWishCount,
          totalBurnCount: state.totalBurnCount,
          donationUnlockedBurns: state.donationUnlockedBurns,
          dailyBurnCount: state.dailyBurnCount,
          dailyDrawCount: state.dailyDrawCount,
          dailyWishCount: state.dailyWishCount,
          createdAt: new Date(state.createdAt.toNumber() * 1000),
          lastActiveAt: new Date(state.lastActiveAt.toNumber() * 1000),
        });
      } catch (err: any) {
        console.error('❌ 获取用户状态失败:', err);
        setError(err.message || '获取用户状态失败');
      } finally {
        setLoading(false);
      }
    }

    fetchUserState();
  }, [publicKey, connected, signTransaction, signAllTransactions]);

  // 格式化钱包地址
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // 根据功德值计算等级
  const getRank = (karmaPoints: number): string => {
    if (karmaPoints >= 10000) return '寺主';
    if (karmaPoints >= 5000) return '供奉';
    if (karmaPoints >= 2000) return '信徒';
    if (karmaPoints >= 500) return '香客';
    return '初心者';
  };

  // 加载中状态
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="temple-card p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">加载用户数据中...</p>
        </Card>
      </div>
    );
  }

  // 未连接钱包
  if (!connected || !publicKey) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="temple-card p-8 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">请连接钱包</h2>
          <p className="text-muted-foreground">连接钱包后查看您的个人资料</p>
        </Card>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="temple-card p-8 text-center">
          <p className="text-destructive mb-4">❌ {error}</p>
          <p className="text-sm text-muted-foreground">请确保您已经初始化用户账户（通过烧香或抽签）</p>
        </Card>
      </div>
    );
  }

  // 没有用户状态
  if (!userState) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="temple-card p-8 text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">未找到用户数据</h2>
          <p className="text-muted-foreground">请先进行烧香或抽签操作来初始化您的账户</p>
        </Card>
      </div>
    );
  }

  const userData = {
    username: `Believer_${publicKey.toString().slice(0, 4)}`,
    walletAddress: formatAddress(publicKey.toString()),
    meritPoints: userState.karmaPoints,
    rank: getRank(userState.karmaPoints),
    joinedDate: userState.createdAt.toLocaleDateString('zh-CN'),
    stats: {
      totalIncenseBurned: userState.totalBurnCount,
      totalFortunesDrawn: userState.totalDrawCount,
      totalWishesMade: userState.totalWishCount,
      totalDonated: userState.totalSolSpent,
    },
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile Header */}
      <Card className="temple-card p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <User className="w-10 h-10 text-primary" />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{userData.username}</h1>
            <p className="text-sm text-muted-foreground mb-4">{userData.walletAddress}</p>
            <MeritBadge points={userData.meritPoints} rank={userData.rank} />
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Member since</p>
            <p className="text-sm font-semibold">{userData.joinedDate}</p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="temple-card p-6 text-center">
          <div className="w-12 h-12 rounded-lg bg-orange-500/10 mx-auto mb-3 flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <div className="text-2xl font-bold mb-1">{userData.stats.totalIncenseBurned}</div>
          <div className="text-sm text-muted-foreground">Incense Burned</div>
          <div className="text-xs text-muted-foreground mt-1">Today: {userState.dailyBurnCount}</div>
        </Card>

        <Card className="temple-card p-6 text-center">
          <div className="w-12 h-12 rounded-lg bg-purple-500/10 mx-auto mb-3 flex items-center justify-center">
            <ScrollText className="w-6 h-6 text-purple-500" />
          </div>
          <div className="text-2xl font-bold mb-1">{userData.stats.totalFortunesDrawn}</div>
          <div className="text-sm text-muted-foreground">Fortunes Drawn</div>
          <div className="text-xs text-muted-foreground mt-1">Today: {userState.dailyDrawCount}</div>
        </Card>

        <Card className="temple-card p-6 text-center">
          <div className="w-12 h-12 rounded-lg bg-pink-500/10 mx-auto mb-3 flex items-center justify-center">
            <Heart className="w-6 h-6 text-pink-500" />
          </div>
          <div className="text-2xl font-bold mb-1">{userData.stats.totalWishesMade}</div>
          <div className="text-sm text-muted-foreground">Wishes Made</div>
          <div className="text-xs text-muted-foreground mt-1">Today: {userState.dailyWishCount}</div>
        </Card>

        <Card className="temple-card p-6 text-center">
          <div className="w-12 h-12 rounded-lg bg-yellow-500/10 mx-auto mb-3 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold mb-1">{userData.stats.totalDonated.toFixed(4)} SOL</div>
          <div className="text-sm text-muted-foreground">Total Spent</div>
          <div className="text-xs text-muted-foreground mt-1">Incense Value: {userState.totalIncenseValue}</div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="nfts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="nfts">My NFTs</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="nfts">
          <Card className="temple-card p-8 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                <Award className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">NFT Collection</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your collected NFTs from incense burning, wishes, and donations will appear here.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="temple-card p-6">
            <div className="space-y-3">
              {[
                { action: "Burned Supreme Incense", merit: "+30", time: "2 hours ago", icon: Flame },
                { action: "Drew Great Fortune", merit: "+2", time: "1 day ago", icon: ScrollText },
                { action: "Made a wish", merit: "+1", time: "2 days ago", icon: Heart },
                { action: "Donated 0.5 SOL", merit: "+1300", time: "3 days ago", icon: Sparkles },
                { action: "Burned Dragon Incense", merit: "+10", time: "4 days ago", icon: Flame },
              ].map((activity, i) => {
                const Icon = activity.icon
                return (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {activity.merit}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "First Incense",
                description: "Burned your first incense",
                unlocked: true,
                icon: Flame,
              },
              {
                title: "Fortune Seeker",
                description: "Drew 10 fortunes",
                unlocked: true,
                icon: ScrollText,
              },
              {
                title: "Wish Master",
                description: "Made 10 wishes",
                unlocked: true,
                icon: Heart,
              },
              {
                title: "Temple Supporter",
                description: "Donated to the temple",
                unlocked: true,
                icon: Sparkles,
              },
              {
                title: "Devotee",
                description: "Reach Devotee rank",
                unlocked: true,
                icon: TrendingUp,
              },
              {
                title: "Temple Master",
                description: "Reach Temple Master rank",
                unlocked: false,
                icon: Award,
              },
            ].map((achievement, i) => {
              const Icon = achievement.icon
              return (
                <Card key={i} className={`temple-card p-6 ${achievement.unlocked ? "" : "opacity-50 grayscale"}`}>
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-lg ${achievement.unlocked ? "bg-primary/10" : "bg-muted"} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`w-6 h-6 ${achievement.unlocked ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      {achievement.unlocked && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
