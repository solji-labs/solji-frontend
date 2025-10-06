"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, X } from "lucide-react"

interface AmuletDropNotificationProps {
  amulet: {
    name: string
    type: string
    effect: string
    rarity: string
    image: string
  }
  onClose: () => void
}

export function AmuletDropNotification({ amulet, onClose }: AmuletDropNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }

  const rarityColors = {
    common: "from-gray-500/20 to-gray-600/20",
    rare: "from-blue-500/20 to-blue-600/20",
    epic: "from-purple-500/20 to-purple-600/20",
    legendary: "from-yellow-500/20 to-orange-600/20",
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <Card
        className={`temple-card p-8 max-w-md w-full transform transition-all duration-300 ${
          isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/50 hover:bg-background flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-6">
          {/* Sparkle Animation */}
          <div className="flex justify-center">
            <div className="relative">
              <Sparkles className="w-12 h-12 text-primary animate-pulse" />
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="w-12 h-12 text-primary opacity-75" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">Amulet Dropped!</h2>
            <p className="text-sm text-muted-foreground">You received a rare treasure from the temple</p>
          </div>

          {/* Amulet Display */}
          <div
            className={`p-6 rounded-2xl bg-gradient-to-br ${rarityColors[amulet.rarity as keyof typeof rarityColors] || rarityColors.common}`}
          >
            <div className="text-6xl mb-4">{amulet.image}</div>
            <h3 className="text-xl font-bold mb-2">{amulet.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{amulet.type} Amulet</p>
            <div className="inline-block px-3 py-1 rounded-full bg-background/50 backdrop-blur-sm">
              <p className="text-xs font-semibold text-primary">{amulet.effect}</p>
            </div>
          </div>

          <Button onClick={handleClose} className="w-full" size="lg">
            Claim Amulet
          </Button>
        </div>
      </Card>
    </div>
  )
}
