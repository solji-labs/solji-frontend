"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { INCENSE_TYPES } from "@/lib/constants"
import { Flame, Sparkles, Info } from "lucide-react"
import { useState } from "react"
import { BurnIncenseDialog } from "@/components/burn-incense-dialog"
import Image from "next/image"
import { AmuletDropNotification } from "@/components/amulet-drop-notification"
import { checkAmuletDrop } from "@/lib/amulet-system"

export default function IncensePage() {
  const [selectedIncense, setSelectedIncense] = useState<string | null>(null)
  const [burnDialogOpen, setBurnDialogOpen] = useState(false)
  const [droppedAmulet, setDroppedAmulet] = useState<any>(null)

  // Mock user burn counts - will be replaced with real data
  const [burnCounts] = useState<Record<string, number>>({
    basic: 3,
    sandalwood: 1,
    dragon: 0,
    supreme: 0,
  })

  const handleBurnClick = (incenseId: string) => {
    setSelectedIncense(incenseId)
    setBurnDialogOpen(true)
  }

  const handleBurnSuccess = () => {
    const dropResult = checkAmuletDrop()
    if (dropResult.dropped && dropResult.amulet) {
      setDroppedAmulet(dropResult.amulet)
    }
  }

  const selectedIncenseData = INCENSE_TYPES.find((i) => i.id === selectedIncense)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
            <Flame className="w-6 h-6 text-orange-500 animate-glow" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Incense Hall</h1>
            <p className="text-muted-foreground">Burn incense to earn merit and mint NFTs</p>
          </div>
        </div>

        <Card className="temple-card p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground leading-relaxed">
              <p>
                Each incense type has a daily limit of 10 burns. Burning incense earns you merit points and mints
                exclusive Incense NFTs. Higher quality incense grants more merit points.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Incense Types Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {INCENSE_TYPES.map((incense) => {
          const burnCount = burnCounts[incense.id] || 0
          const remaining = incense.dailyLimit - burnCount

          return (
            <Card key={incense.id} className="temple-card p-6 space-y-4">
              {/* Incense Image */}
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                <Image
                  src={incense.image || "/placeholder.svg"}
                  alt={incense.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                    {incense.price} SOL
                  </Badge>
                </div>
              </div>

              {/* Incense Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">{incense.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-primary">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-semibold">+{incense.meritPoints}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{incense.nameEn}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{incense.description}</p>
              </div>

              {/* Daily Limit Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Daily Burns</span>
                  <span className="font-medium">
                    {burnCount}/{incense.dailyLimit}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(burnCount / incense.dailyLimit) * 100}%` }}
                  />
                </div>
              </div>

              {/* Burn Button */}
              <Button className="w-full" onClick={() => handleBurnClick(incense.id)} disabled={remaining === 0}>
                {remaining === 0 ? (
                  "Daily Limit Reached"
                ) : (
                  <>
                    <Flame className="w-4 h-4 mr-2" />
                    Burn Incense ({remaining} left)
                  </>
                )}
              </Button>
            </Card>
          )
        })}
      </div>

      {/* My Incense NFTs Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">My Incense NFTs</h2>
        <Card className="temple-card p-8 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
              <Flame className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">No Incense NFTs Yet</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Burn incense to mint your first Incense NFT. Each burn creates a unique collectible that proves your
                devotion.
              </p>
            </div>
            <Button variant="outline" onClick={() => handleBurnClick(INCENSE_TYPES[0].id)}>
              Burn Your First Incense
            </Button>
          </div>
        </Card>
      </div>

      {/* Burn Incense Dialog */}
      {selectedIncenseData && (
        <BurnIncenseDialog
          open={burnDialogOpen}
          onOpenChange={setBurnDialogOpen}
          incense={selectedIncenseData}
          onBurnSuccess={handleBurnSuccess}
        />
      )}

      {droppedAmulet && <AmuletDropNotification amulet={droppedAmulet} onClose={() => setDroppedAmulet(null)} />}
    </div>
  )
}
