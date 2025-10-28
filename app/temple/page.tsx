'use client';

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Flame, ScrollText, Heart, TrendingUp, Users, Sparkles, BarChart3, ImageIcon } from "lucide-react"
import { useState, useEffect } from 'react';
import { 
  getRecentActivities, 
  getTopContributors,
  getTempleOverview,
  type RecentActivity,
  type TopContributor,
  type TempleOverview
} from '@/lib/api/temple';

export default function TempleHomePage() {
  // 状态管理
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [topContributors, setTopContributors] = useState<TopContributor[]>([]);
  const [templeOverview, setTempleOverview] = useState<TempleOverview | null>(null);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingContributors, setLoadingContributors] = useState(true);
  const [loadingOverview, setLoadingOverview] = useState(true);

  // 获取最近活动
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const data = await getRecentActivities(5, 1);
        setRecentActivities(data.list);
      } catch (error) {
        console.error('获取最近活动失败:', error);
      } finally {
        setLoadingActivities(false);
      }
    };

    fetchRecentActivities();
    // 每30秒刷新一次
    const interval = setInterval(fetchRecentActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  // 获取顶级贡献者
  useEffect(() => {
    const fetchTopContributors = async () => {
      try {
        const data = await getTopContributors(5, 1);
        setTopContributors(data.list);
      } catch (error) {
        console.error('获取顶级贡献者失败:', error);
      } finally {
        setLoadingContributors(false);
      }
    };

    fetchTopContributors();
    // 每60秒刷新一次
    const interval = setInterval(fetchTopContributors, 60000);
    return () => clearInterval(interval);
  }, []);

  // 获取寺庙概览
  useEffect(() => {
    const fetchTempleOverview = async () => {
      try {
        const data = await getTempleOverview();
        setTempleOverview(data);
      } catch (error) {
        console.error('获取寺庙概览失败:', error);
      } finally {
        setLoadingOverview(false);
      }
    };

    fetchTempleOverview();
    // 每5分钟刷新一次
    const interval = setInterval(fetchTempleOverview, 300000);
    return () => clearInterval(interval);
  }, []);

  // 寺庙统计数据 - 从 API 获取真实数据
  const templeStats = {
    level: 2,
    name: "赤庙",
    nameEn: "Vibrant Shrine",
    totalBelievers: templeOverview?.totalBelievers || 0,
    totalIncense: templeOverview?.totalIncenseCount || 0,
    totalFortunes: templeOverview?.totalFortuneCount || 0,
    totalWishes: templeOverview?.totalWishCount || 0,
    totalDonations: templeOverview?.totalDonationAmount || 0,
    nextLevel: {
      name: "灵殿",
      nameEn: "Temple of Spirit",
      progress: {
        incense: 65,
        fortunes: 45,
        wishes: 38,
        donations: 52,
      },
    },
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Temple Status Card */}
      <Card className="temple-card p-8 mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-primary animate-glow" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {templeStats.name} <span className="text-muted-foreground text-xl">Lv.{templeStats.level}</span>
                </h1>
                <p className="text-muted-foreground">{templeStats.nameEn}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{templeStats.totalBelievers.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Believers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{templeStats.totalIncense.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Incense</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{templeStats.totalFortunes.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Fortunes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{templeStats.totalDonations} SOL</div>
              <div className="text-xs text-muted-foreground">Donations</div>
            </div>
          </div>
        </div>

        {/* Temple Evolution Progress */}
        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">
              Next Level: {templeStats.nextLevel.name} ({templeStats.nextLevel.nameEn})
            </h3>
            <Link href="/temple/dashboard">
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Incense</span>
                <span className="text-muted-foreground">{templeStats.nextLevel.progress.incense}%</span>
              </div>
              <Progress value={templeStats.nextLevel.progress.incense} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Fortunes</span>
                <span className="text-muted-foreground">{templeStats.nextLevel.progress.fortunes}%</span>
              </div>
              <Progress value={templeStats.nextLevel.progress.fortunes} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Wishes</span>
                <span className="text-muted-foreground">{templeStats.nextLevel.progress.wishes}%</span>
              </div>
              <Progress value={templeStats.nextLevel.progress.wishes} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Donations</span>
                <span className="text-muted-foreground">{templeStats.nextLevel.progress.donations}%</span>
              </div>
              <Progress value={templeStats.nextLevel.progress.donations} className="h-2" />
            </div>
          </div>
        </div>
      </Card>

      {/* Main Actions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Burn Incense */}
        <Link href="/temple/incense" className="group">
          <Card className="temple-card p-6 h-full space-y-4 cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Flame className="w-7 h-7 text-orange-500 animate-glow" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Burn Incense</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Offer incense to earn merit points and mint exclusive NFTs
              </p>
            </div>
            <Button className="w-full bg-transparent" variant="outline">
              Enter Incense Hall
            </Button>
          </Card>
        </Link>

        {/* Draw Fortune */}
        <Link href="/temple/fortune" className="group">
          <Card className="temple-card p-6 h-full space-y-4 cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ScrollText className="w-7 h-7 text-purple-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Draw Fortune</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Receive your daily fortune with AI-powered interpretation
              </p>
            </div>
            <Button className="w-full bg-transparent" variant="outline">
              Draw Your Fortune
            </Button>
          </Card>
        </Link>

        {/* Make Wish */}
        <Link href="/temple/wishes" className="group">
          <Card className="temple-card p-6 h-full space-y-4 cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-7 h-7 text-pink-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Make a Wish</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Write your wish on a digital Ema plaque and mint as NFT
              </p>
            </div>
            <Button className="w-full bg-transparent" variant="outline">
              Write Your Wish
            </Button>
          </Card>
        </Link>

        {/* Donate */}
        <Link href="/temple/donate" className="group">
          <Card className="temple-card p-6 h-full space-y-4 cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Donate</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Support the temple and earn special badge NFTs
              </p>
            </div>
            <Button className="w-full bg-transparent" variant="outline">
              Make Donation
            </Button>
          </Card>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Link href="/temple/dashboard" className="group">
          <Card className="temple-card p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Temple Dashboard</h3>
                <p className="text-sm text-muted-foreground">View detailed metrics and leaderboards</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/temple/collection" className="group">
          <Card className="temple-card p-6 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon className="w-6 h-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">NFT Collection</h3>
                <p className="text-sm text-muted-foreground">Browse your sacred digital treasures</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Secondary Sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="temple-card p-6" id="recent-activities">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Activities</h2>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {loadingActivities ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">加载中...</p>
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">暂无活动记录</p>
              </div>
            ) : (
              recentActivities.map((activity, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm">
                        <span className="font-medium">{activity.user_address}</span>{" "}
                        <span className="text-muted-foreground">{activity.instruction_tag}</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.since_at}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Top Contributors */}
        <Card className="temple-card p-6" id="top-contributors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Top Contributors</h2>
            <Sparkles className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {loadingContributors ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">加载中...</p>
              </div>
            ) : topContributors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">暂无贡献者</p>
              </div>
            ) : (
              topContributors.map((contributor, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0
                        ? "bg-yellow-500/20 text-yellow-500"
                        : index === 1
                          ? "bg-gray-400/20 text-gray-400"
                          : index === 2
                            ? "bg-orange-500/20 text-orange-500"
                            : "bg-primary/10 text-primary"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{contributor.user_address}</p>
                    <p className="text-xs text-muted-foreground">{contributor.incense_value.toLocaleString()} Merit Points</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-primary">{contributor.karma_points.toLocaleString()}</span>
              </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
