"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Sparkles, Flame, ScrollText, Heart, Award, TrendingUp } from "lucide-react"
import { MeritBadge } from "@/components/merit-badge"

export default function ProfilePage() {
  // Mock user data
  const userData = {
    username: "Believer_7a3b",
    walletAddress: "0x7a3b...4f2c",
    meritPoints: 1520,
    rank: "供奉",
    joinedDate: "2025-01-01",
    stats: {
      totalIncenseBurned: 45,
      totalFortunesDrawn: 23,
      totalWishesMade: 12,
      totalDonated: 1.5,
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
        </Card>

        <Card className="temple-card p-6 text-center">
          <div className="w-12 h-12 rounded-lg bg-purple-500/10 mx-auto mb-3 flex items-center justify-center">
            <ScrollText className="w-6 h-6 text-purple-500" />
          </div>
          <div className="text-2xl font-bold mb-1">{userData.stats.totalFortunesDrawn}</div>
          <div className="text-sm text-muted-foreground">Fortunes Drawn</div>
        </Card>

        <Card className="temple-card p-6 text-center">
          <div className="w-12 h-12 rounded-lg bg-pink-500/10 mx-auto mb-3 flex items-center justify-center">
            <Heart className="w-6 h-6 text-pink-500" />
          </div>
          <div className="text-2xl font-bold mb-1">{userData.stats.totalWishesMade}</div>
          <div className="text-sm text-muted-foreground">Wishes Made</div>
        </Card>

        <Card className="temple-card p-6 text-center">
          <div className="w-12 h-12 rounded-lg bg-yellow-500/10 mx-auto mb-3 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="text-2xl font-bold mb-1">{userData.stats.totalDonated} SOL</div>
          <div className="text-sm text-muted-foreground">Total Donated</div>
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
