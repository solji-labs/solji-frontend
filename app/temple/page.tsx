import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { Flame, ScrollText, Heart, TrendingUp, Users, Sparkles, BarChart3, ImageIcon } from "lucide-react"

export default function TempleHomePage() {
  // Mock temple stats - will be replaced with real data
  const templeStats = {
    level: 2,
    name: "赤庙",
    nameEn: "Vibrant Shrine",
    totalBelievers: 10234,
    totalIncense: 52341,
    totalFortunes: 25678,
    totalWishes: 15432,
    totalDonations: 234.5,
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
        <Card className="temple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Activities</h2>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {[
              { user: "0x7a3b...4f2c", action: "burned Supreme Incense", time: "2 min ago" },
              { user: "0x9d1e...8a6b", action: "drew Great Fortune", time: "5 min ago" },
              { user: "0x4c2f...1d9e", action: "made a wish", time: "8 min ago" },
              { user: "0x6b8a...3e7c", action: "donated 1 SOL", time: "12 min ago" },
              { user: "0x2e5d...9f1a", action: "burned Dragon Incense", time: "15 min ago" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      <span className="text-muted-foreground">{activity.action}</span>
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Contributors */}
        <Card className="temple-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Top Contributors</h2>
            <Sparkles className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {[
              { rank: 1, user: "0x1a2b...3c4d", merit: 15420, badge: "Supreme" },
              { rank: 2, user: "0x5e6f...7g8h", merit: 12350, badge: "Gold" },
              { rank: 3, user: "0x9i0j...1k2l", merit: 9870, badge: "Gold" },
              { rank: 4, user: "0x3m4n...5o6p", merit: 7650, badge: "Silver" },
              { rank: 5, user: "0x7q8r...9s0t", merit: 6420, badge: "Silver" },
            ].map((contributor) => (
              <div
                key={contributor.rank}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      contributor.rank === 1
                        ? "bg-yellow-500/20 text-yellow-500"
                        : contributor.rank === 2
                          ? "bg-gray-400/20 text-gray-400"
                          : contributor.rank === 3
                            ? "bg-orange-500/20 text-orange-500"
                            : "bg-primary/10 text-primary"
                    }`}
                  >
                    {contributor.rank}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{contributor.user}</p>
                    <p className="text-xs text-muted-foreground">{contributor.badge} Badge</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-primary">{contributor.merit.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
