"use client"

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
import { useEffect, useState } from "react"
import { getTempleLevel, getTempleStats, getDonationLeaderboard } from "@/lib/api"
import type { TempleLevelResponse, TempleStatsResponse, DonationLeaderboardItem } from "@/lib/api/types"

export default function TempleDashboardPage() {
  const [templeLevel, setTempleLevel] = useState<TempleLevelResponse | null>(null)
  const [templeStats, setTempleStats] = useState<TempleStatsResponse | null>(null)
  const [leaderboard, setLeaderboard] = useState<DonationLeaderboardItem[]>([])
  const [activePeriod, setActivePeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    setLoading(true)

    Promise.all([
      getTempleLevel(),
      getTempleStats(),
      getDonationLeaderboard(activePeriod),
    ])
      .then(([level, stats, board]) => {
        if (!mounted) return
        setTempleLevel(level)
        setTempleStats(stats)
        setLeaderboard(board.leaderboard || [])
      })
      .catch((e) => console.error('Failed to load dashboard data:', e))
      .finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [])

  const handlePeriodChange = async (period: 'daily' | 'weekly' | 'monthly') => {
    setActivePeriod(period)
    try {
      const board = await getDonationLeaderboard(period)
      setLeaderboard(board.leaderboard || [])
    } catch (e) {
      console.error('Failed to load leaderboard:', e)
    }
  }

  const calculateProgress = (current: number, required: number) => {
    return Math.min((current / required) * 100, 100)
  }

  const shortKey = (k: string) => (k ? `${k.slice(0, 4)}...${k.slice(-4)}` : '')

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
              {templeLevel?.level_name || '——'}{" "}
              <span className="text-muted-foreground text-xl">Lv.{templeLevel?.current_level || '-'}</span>
            </h2>
            <p className="text-muted-foreground">{templeLevel?.level_name_en || ''}</p>
          </div>
        </div>

        {/* Evolution Progress */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Next Evolution: {templeLevel?.next_level_requirements?.level_name || '—'} ({templeLevel?.next_level_requirements?.level_name_en || ''})
            </h3>
            <span className="text-sm text-muted-foreground">Level {templeLevel?.next_level_requirements?.level || '-'}</span>
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
                    {(templeStats?.total_incense_value || 0).toLocaleString()} /{" "}
                    {(templeLevel?.next_level_requirements?.requirements?.incense_points || 0).toLocaleString()}
                  </span>
                  <span className="font-semibold">
                    {calculateProgress(
                      templeStats?.total_incense_value || 0,
                      templeLevel?.next_level_requirements?.requirements?.incense_points || 1,
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <Progress
                  value={calculateProgress(
                    templeStats?.total_incense_value || 0,
                    templeLevel?.next_level_requirements?.requirements?.incense_points || 1,
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
                    {(templeStats?.total_fortunes || 0).toLocaleString()} /{" "}
                    {(templeLevel?.next_level_requirements?.requirements?.draw_fortune || 0).toLocaleString()}
                  </span>
                  <span className="font-semibold">
                    {calculateProgress(
                      templeStats?.total_fortunes || 0,
                      templeLevel?.next_level_requirements?.requirements?.draw_fortune || 1,
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <Progress
                  value={calculateProgress(
                    templeStats?.total_fortunes || 0,
                    templeLevel?.next_level_requirements?.requirements?.draw_fortune || 1,
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
                    {(templeStats?.total_wishes || 0).toLocaleString()} /{" "}
                    {(templeLevel?.next_level_requirements?.requirements?.wishes || 0).toLocaleString()}
                  </span>
                  <span className="font-semibold">
                    {calculateProgress(
                      templeStats?.total_wishes || 0,
                      templeLevel?.next_level_requirements?.requirements?.wishes || 1,
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <Progress
                  value={calculateProgress(templeStats?.total_wishes || 0, templeLevel?.next_level_requirements?.requirements?.wishes || 1)}
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
                    {(templeStats?.total_donations || 0).toFixed(1)} SOL /{" "}
                    {(templeLevel?.next_level_requirements?.requirements?.donations_sol || 0)} SOL
                  </span>
                  <span className="font-semibold">
                    {calculateProgress(
                      templeStats?.total_donations || 0,
                      templeLevel?.next_level_requirements?.requirements?.donations_sol || 1,
                    ).toFixed(1)}
                    %
                  </span>
                </div>
                <Progress
                  value={calculateProgress(
                    templeStats?.total_donations || 0,
                    templeLevel?.next_level_requirements?.requirements?.donations_sol || 1,
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
            <p className="text-3xl font-bold">{(templeStats?.total_believers || 0).toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Believers</p>
            <p className="text-xs text-green-500">Active community</p>
          </div>
        </Card>

        <Card className="temple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8 text-orange-500" />
            <Calendar className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold">{(templeStats?.total_fortunes || 0).toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Fortunes</p>
            <p className="text-xs text-muted-foreground">Divinations drawn</p>
          </div>
        </Card>

        <Card className="temple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <Target className="w-8 h-8 text-purple-500" />
            <Sparkles className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold">{(templeStats?.total_interactions || 0).toLocaleString()}</p>
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
            <p className="text-3xl font-bold">{(templeStats?.total_donations || 0).toFixed(1)} SOL</p>
            <p className="text-sm text-muted-foreground">Total Donations</p>
            <p className="text-xs text-muted-foreground">Community contributions</p>
          </div>
        </Card>
      </div>

      {/* Leaderboards */}
      <Card className="temple-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h2 className="text-2xl font-bold">Community Leaderboards</h2>
        </div>

        <Tabs value={activePeriod} onValueChange={(v) => handlePeriodChange(v as 'daily' | 'weekly' | 'monthly')} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-4">
            {leaderboard.map((leader) => (
              <div
                key={leader.rank}
                className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border hover:bg-card/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${leader.rank === 1
                      ? "bg-yellow-500/20"
                      : leader.rank === 2
                        ? "bg-gray-400/20"
                        : leader.rank === 3
                          ? "bg-orange-500/20"
                          : "bg-primary/10"
                      }`}
                  >
                    {leader.rank === 1 ? "🏆" : leader.rank === 2 ? "🥈" : leader.rank === 3 ? "🥉" : "⭐"}
                  </div>
                  <div>
                    <p className="font-semibold">{shortKey(leader.user_pubkey)}</p>
                    <p className="text-sm text-muted-foreground">Donated</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{leader.total_donated} SOL</p>
                  <p className="text-xs text-muted-foreground">total donated</p>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            {leaderboard.map((leader) => (
              <div
                key={leader.rank}
                className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border hover:bg-card/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${leader.rank === 1
                      ? "bg-yellow-500/20"
                      : leader.rank === 2
                        ? "bg-gray-400/20"
                        : leader.rank === 3
                          ? "bg-orange-500/20"
                          : "bg-primary/10"
                      }`}
                  >
                    {leader.rank === 1 ? "🏆" : leader.rank === 2 ? "🥈" : leader.rank === 3 ? "🥉" : "⭐"}
                  </div>
                  <div>
                    <p className="font-semibold">{shortKey(leader.user_pubkey)}</p>
                    <p className="text-sm text-muted-foreground">Donated</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{leader.total_donated} SOL</p>
                  <p className="text-xs text-muted-foreground">total donated</p>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            {leaderboard.map((leader) => (
              <div
                key={leader.rank}
                className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border hover:bg-card/80 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${leader.rank === 1
                      ? "bg-yellow-500/20"
                      : leader.rank === 2
                        ? "bg-gray-400/20"
                        : leader.rank === 3
                          ? "bg-orange-500/20"
                          : "bg-primary/10"
                      }`}
                  >
                    {leader.rank === 1 ? "🏆" : leader.rank === 2 ? "🥈" : leader.rank === 3 ? "🥉" : "⭐"}
                  </div>
                  <div>
                    <p className="font-semibold">{shortKey(leader.user_pubkey)}</p>
                    <p className="text-sm text-muted-foreground">Donated</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{leader.total_donated} SOL</p>
                  <p className="text-xs text-muted-foreground">total donated</p>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
