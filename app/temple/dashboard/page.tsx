'use client';

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Flame,
  ScrollText,
  Heart,
  TrendingUp,
  Users,
  Sparkles,
  Trophy,
  Calendar,
  BarChart3,
  Target,
} from "lucide-react"
import { TEMPLE_LEVELS } from "@/lib/constants"
import { useState, useEffect } from 'react';
import { getLeaderboards, type LeaderboardData } from '@/lib/api/temple';

export default function TempleDashboardPage() {
  // 状态管理
  const [dailyLeaderboard, setDailyLeaderboard] = useState<LeaderboardData | null>(null);
  const [weeklyLeaderboard, setWeeklyLeaderboard] = useState<LeaderboardData | null>(null);
  const [monthlyLeaderboard, setMonthlyLeaderboard] = useState<LeaderboardData | null>(null);
  const [loadingLeaderboards, setLoadingLeaderboards] = useState(true);

  // 获取排行榜数据
  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        const [daily, weekly, monthly] = await Promise.all([
          getLeaderboards('daily', 10),
          getLeaderboards('weekly', 10),
          getLeaderboards('monthly', 10)
        ]);
        setDailyLeaderboard(daily);
        setWeeklyLeaderboard(weekly);
        setMonthlyLeaderboard(monthly);
      } catch (error) {
        console.error('获取排行榜失败:', error);
      } finally {
        setLoadingLeaderboards(false);
      }
    };

    fetchLeaderboards();
    // 每2分钟刷新一次
    const interval = setInterval(fetchLeaderboards, 120000);
    return () => clearInterval(interval);
  }, []);

  // Mock comprehensive temple data
  const templeData = {
    currentLevel: 2,
    stats: {
      totalBelievers: 10234,
      totalIncenseValue: 52341,
      totalFortunes: 25678,
      totalWishes: 15432,
      totalDonations: 234.5,
      totalInteractions: 93685,
      dailyActiveUsers: 1234,
      weeklyGrowth: 15.3,
    },
    nextLevel: TEMPLE_LEVELS[2],
    currentProgress: {
      incenseValue: 52341,
      fortunes: 25678,
      wishes: 15432,
      donations: 234.5,
    },
  }

  const calculateProgress = (current: number, required: number) => {
    return Math.min((current / required) * 100, 100)
  }

  // 根据功德值计算徽章等级
  const getBadgeLevel = (karmaPoints: number): string => {
    if (karmaPoints >= 10000) return "Supreme";
    if (karmaPoints >= 5000) return "Gold";
    if (karmaPoints >= 1000) return "Silver";
    return "Bronze";
  }

  // 排行榜数据 - 从 API 获取
  const dailyLeaders = dailyLeaderboard?.list.map((item, index) => ({
    rank: index + 1,
    user: item.user_address,
    merit: item.karma_points,
    incenseValue: item.incense_value,
    badge: getBadgeLevel(item.karma_points),
    avatar: index === 0 ? "🏆" : index === 1 ? "🥈" : index === 2 ? "🥉" : "⭐"
  })) || [];

  const weeklyLeaders = weeklyLeaderboard?.list.map((item, index) => ({
    rank: index + 1,
    user: item.user_address,
    merit: item.karma_points,
    incenseValue: item.incense_value,
    badge: getBadgeLevel(item.karma_points),
    avatar: index === 0 ? "🏆" : index === 1 ? "🥈" : index === 2 ? "🥉" : "⭐"
  })) || [];

  const monthlyLeaders = monthlyLeaderboard?.list.map((item, index) => ({
    rank: index + 1,
    user: item.user_address,
    merit: item.karma_points,
    incenseValue: item.incense_value,
    badge: getBadgeLevel(item.karma_points),
    avatar: index === 0 ? "🏆" : index === 1 ? "🥈" : index === 2 ? "🥉" : "⭐"
  })) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Temple Dashboard</h1>
        <p className="text-muted-foreground">Comprehensive metrics and community leaderboards</p>
      </div>

      {/* Temple Evolution Status */}
      <Card className="temple-card p-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Flame className="w-8 h-8 text-primary animate-glow" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">
              {TEMPLE_LEVELS[templeData.currentLevel - 1].name}{" "}
              <span className="text-muted-foreground text-xl">Lv.{templeData.currentLevel}</span>
            </h2>
            <p className="text-muted-foreground">{TEMPLE_LEVELS[templeData.currentLevel - 1].nameEn}</p>
          </div>
        </div>

        {/* Evolution Progress */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Next Evolution: {templeData.nextLevel.name} ({templeData.nextLevel.nameEn})
            </h3>
            <span className="text-sm text-muted-foreground">Level {templeData.nextLevel.level}</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Incense Progress */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="font-semibold">Incense Value</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {templeData.currentProgress.incenseValue.toLocaleString()} /{" "}
                    {templeData.nextLevel.requirements.incenseValue.toLocaleString()}
                  </span>
                  <span className="font-semibold">
                    {calculateProgress(
                      templeData.currentProgress.incenseValue,
                      templeData.nextLevel.requirements.incenseValue,
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <Progress
                  value={calculateProgress(
                    templeData.currentProgress.incenseValue,
                    templeData.nextLevel.requirements.incenseValue,
                  )}
                  className="h-3"
                />
              </div>
            </div>

            {/* Fortunes Progress */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-purple-500" />
                <span className="font-semibold">Fortunes</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {templeData.currentProgress.fortunes.toLocaleString()} /{" "}
                    {templeData.nextLevel.requirements.fortunes.toLocaleString()}
                  </span>
                  <span className="font-semibold">
                    {calculateProgress(
                      templeData.currentProgress.fortunes,
                      templeData.nextLevel.requirements.fortunes,
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <Progress
                  value={calculateProgress(
                    templeData.currentProgress.fortunes,
                    templeData.nextLevel.requirements.fortunes,
                  )}
                  className="h-3"
                />
              </div>
            </div>

            {/* Wishes Progress */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-500" />
                <span className="font-semibold">Wishes</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {templeData.currentProgress.wishes.toLocaleString()} /{" "}
                    {templeData.nextLevel.requirements.wishes.toLocaleString()}
                  </span>
                  <span className="font-semibold">
                    {calculateProgress(
                      templeData.currentProgress.wishes,
                      templeData.nextLevel.requirements.wishes,
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <Progress
                  value={calculateProgress(templeData.currentProgress.wishes, templeData.nextLevel.requirements.wishes)}
                  className="h-3"
                />
              </div>
            </div>

            {/* Donations Progress */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <span className="font-semibold">Donations</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {templeData.currentProgress.donations.toFixed(1)} SOL /{" "}
                    {templeData.nextLevel.requirements.donations} SOL
                  </span>
                  <span className="font-semibold">
                    {calculateProgress(
                      templeData.currentProgress.donations,
                      templeData.nextLevel.requirements.donations,
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <Progress
                  value={calculateProgress(
                    templeData.currentProgress.donations,
                    templeData.nextLevel.requirements.donations,
                  )}
                  className="h-3"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="temple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-primary" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold">{templeData.stats.totalBelievers.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Believers</p>
            <p className="text-xs text-green-500">+{templeData.stats.weeklyGrowth}% this week</p>
          </div>
        </Card>

        <Card className="temple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-orange-500" />
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold">{templeData.stats.dailyActiveUsers.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Daily Active Users</p>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </div>
        </Card>

        <Card className="temple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-purple-500" />
            <Sparkles className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold">{templeData.stats.totalInteractions.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Interactions</p>
            <p className="text-xs text-muted-foreground">All activities combined</p>
          </div>
        </Card>

        <Card className="temple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <Sparkles className="w-8 h-8 text-yellow-500" />
            <Trophy className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold">{templeData.stats.totalDonations.toFixed(1)} SOL</p>
            <p className="text-sm text-muted-foreground">Total Donations</p>
            <p className="text-xs text-muted-foreground">Community contributions</p>
          </div>
        </Card>
      </div>

      {/* Leaderboards */}
      <Card className="temple-card p-6" id="leaderboards">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Community Leaderboards</h2>
        </div>

        {loadingLeaderboards ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">加载排行榜中...</p>
          </div>
        ) : (
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>

            <TabsContent value="daily" className="space-y-4">
              {dailyLeaders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">暂无排行榜数据</p>
                </div>
              ) : (
                dailyLeaders.map((leader) => (
              <div
                key={leader.rank}
                className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border hover:bg-card/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      leader.rank === 1
                        ? "bg-yellow-500/20"
                        : leader.rank === 2
                          ? "bg-gray-400/20"
                          : leader.rank === 3
                            ? "bg-orange-500/20"
                            : "bg-primary/10"
                    }`}
                  >
                    {leader.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{leader.user}</p>
                    <p className="text-sm text-muted-foreground">{leader.badge} Badge</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{leader.merit}</p>
                  <p className="text-xs text-muted-foreground">merit points</p>
                </div>
              </div>
                ))
              )}
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            {weeklyLeaders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">暂无排行榜数据</p>
              </div>
            ) : (
              weeklyLeaders.map((leader) => (
              <div
                key={leader.rank}
                className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border hover:bg-card/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      leader.rank === 1
                        ? "bg-yellow-500/20"
                        : leader.rank === 2
                          ? "bg-gray-400/20"
                          : leader.rank === 3
                            ? "bg-orange-500/20"
                            : "bg-primary/10"
                    }`}
                  >
                    {leader.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{leader.user}</p>
                    <p className="text-sm text-muted-foreground">{leader.badge} Badge</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{leader.merit}</p>
                  <p className="text-xs text-muted-foreground">merit points</p>
                </div>
              </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            {monthlyLeaders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">暂无排行榜数据</p>
              </div>
            ) : (
              monthlyLeaders.map((leader) => (
              <div
                key={leader.rank}
                className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border hover:bg-card/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      leader.rank === 1
                        ? "bg-yellow-500/20"
                        : leader.rank === 2
                          ? "bg-gray-400/20"
                          : leader.rank === 3
                            ? "bg-orange-500/20"
                            : "bg-primary/10"
                    }`}
                  >
                    {leader.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{leader.user}</p>
                    <p className="text-sm text-muted-foreground">{leader.badge} Badge</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{leader.merit}</p>
                  <p className="text-xs text-muted-foreground">merit points</p>
                </div>
              </div>
              ))
            )}
          </TabsContent>
          </Tabs>
        )}
      </Card>
    </div>
  )
}
