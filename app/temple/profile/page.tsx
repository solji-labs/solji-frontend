"use client"

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Sparkles, Flame, ScrollText, Heart, Award, TrendingUp, Loader2 } from "lucide-react"
import { MeritBadge } from "@/components/merit-badge"
import { useWallet } from '@solana/wallet-adapter-react'
import { useUserState } from '@/hooks/use-user-state'
import { getUserActivities, type UserActivity } from '@/lib/api/temple'

export default function ProfilePage() {
  const { publicKey, connected } = useWallet();
  const { userState, loading, error } = useUserState();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);
  const [activitiesPage, setActivitiesPage] = useState(1);
  const [activitiesTotal, setActivitiesTotal] = useState(0);

  // 格式化钱包地址
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // 格式化 SOL 数量
  const formatSol = (lamports: number): string => {
    return (lamports / 1e9).toFixed(4);
  };

  // 获取指令类型的显示信息
  const getInstructionDisplay = (instructionType: string) => {
    const instructionMap: Record<string, { label: string; icon: any; color: string }> = {
      'burn_incense_simplied': { label: '烧香', icon: Flame, color: 'text-orange-500' },
      'draw_fortune': { label: '求签', icon: ScrollText, color: 'text-purple-500' },
      'create_wish': { label: '许愿', icon: Heart, color: 'text-pink-500' },
      'donate_fund': { label: '捐赠', icon: Sparkles, color: 'text-yellow-500' },
      'like_wish': { label: '点赞心愿', icon: Heart, color: 'text-red-500' },
      'cancel_like_wish': { label: '取消点赞', icon: Heart, color: 'text-gray-500' },
      'init_user': { label: '初始化用户', icon: User, color: 'text-blue-500' },
    };
    return instructionMap[instructionType] || { label: instructionType, icon: Award, color: 'text-gray-500' };
  };

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('zh-CN');
  };

  // 获取用户活动记录
  useEffect(() => {
    if (!publicKey) return;

    const fetchActivities = async () => {
      setActivitiesLoading(true);
      setActivitiesError(null);
      try {
        const result = await getUserActivities(publicKey.toString(), 10, activitiesPage);
        setActivities(result.activities);
        setActivitiesTotal(result.total);
      } catch (err: any) {
        console.error('获取活动记录失败:', err);
        setActivitiesError(err.message || '获取活动记录失败');
      } finally {
        setActivitiesLoading(false);
      }
    };

    fetchActivities();
  }, [publicKey, activitiesPage]);

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
    rank: userState.karmaLevel.name,
    rankEn: userState.karmaLevel.nameEn,
    badgeLevel: userState.karmaLevel.badgeLevel,
    joinedDate: userState.createdAt.toLocaleDateString('zh-CN'),
    stats: {
      totalIncenseBurned: userState.totalBurnCount,
      totalFortunesDrawn: userState.totalDrawCount,
      totalWishesMade: userState.totalWishCount,
      totalIncenseValue: userState.totalIncenseValue,
      totalDonateAmount: userState.totalDonationAmount / 1_000_000_000, // Convert lamports to SOL
    },
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile Header */}
      <Card className="temple-card p-8 mb-8" id="profile-header">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <User className="w-10 h-10 text-primary" />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{userData.username}</h1>
            <p className="text-sm text-muted-foreground mb-4">{userData.walletAddress}</p>
            <MeritBadge points={userData.meritPoints} rank={userData.rank} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Total Incense Value</p>
            <p className="text-sm font-semibold">{userData.stats.totalIncenseValue}</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Member since</p>
            <p className="text-sm font-semibold">{userData.joinedDate}</p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8" id="stats-grid">
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
          <div className="text-2xl font-bold mb-1">{userData.stats.totalDonateAmount.toFixed(4)} SOL</div>
          <div className="text-sm text-muted-foreground">Total Donate Amount</div>
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
            {activitiesLoading ? (
              <div className="text-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-sm text-muted-foreground">加载活动记录中...</p>
              </div>
            ) : activitiesError ? (
              <div className="text-center py-8">
                <p className="text-sm text-red-500">{activitiesError}</p>
              </div>
            ) : !activities || activities.length === 0 ? (
              <div className="text-center py-8">
                <Award className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">暂无活动记录</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activities.map((activity) => {
                  const display = getInstructionDisplay(activity.instruction_type);
                  const Icon = display.icon;
                  return (
                    <div key={activity.signature} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${display.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{activity.instruction_tag}</p>
                          <p className="text-xs text-muted-foreground">{formatTime(activity.created_at)}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        +{activity.reward_karma_points}
                      </Badge>
                    </div>
                  );
                })}
                {/* {activities && activitiesTotal > activities.length && (
                  <div className="text-center pt-4">
                    <p className="text-xs text-muted-foreground">
                      显示 {activities.length} / {activitiesTotal} 条记录
                    </p>
                  </div>
                )} */}
              </div>
            )}
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
