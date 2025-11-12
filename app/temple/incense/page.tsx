"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { INCENSE_TYPES } from "@/lib/constants"
import { Flame, Sparkles, Info } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { BurnIncenseDialog } from "@/components/burn-incense-dialog"
import Image from "next/image"
import { AmuletDropNotification } from "@/components/amulet-drop-notification"
import { checkAmuletDrop } from "@/lib/amulet-system"
import { useWallet } from "@solana/wallet-adapter-react"
import type { BurnIncenseResult } from "@/lib/contracts/burn-incense"
import type { IncenseType } from "@/lib/types"
import { getIncenseBurnCount, getIncenseHistory } from "@/lib/api"

const INCENSE_ID_LIST = ["basic", "sandalwood", "dragon", "supreme"] as const
type IncenseId = (typeof INCENSE_ID_LIST)[number]
type FilterValue = "all" | IncenseId

interface OwnedIncenseNft {
  id: string
  serial: number
  incenseId: IncenseId
  name: string
  nameEn: string
  meritPoints: number
  mintedAt: string
  mintAddress?: string
  transactionSignature?: string
  image?: string
}

const RARITY_STYLES: Record<
  IncenseId,
  { label: string; gradient: string; badgeClass: string }
> = {
  basic: {
    label: "Common",
    gradient: "from-slate-500/25 via-slate-500/10 to-transparent",
    badgeClass: "bg-slate-500/20 text-slate-100 border border-slate-500/40",
  },
  sandalwood: {
    label: "Rare",
    gradient: "from-amber-500/25 via-amber-500/10 to-transparent",
    badgeClass: "bg-amber-500/20 text-amber-100 border border-amber-500/40",
  },
  dragon: {
    label: "Epic",
    gradient: "from-purple-500/30 via-purple-500/15 to-transparent",
    badgeClass: "bg-purple-500/25 text-purple-50 border border-purple-500/40",
  },
  supreme: {
    label: "Legendary",
    gradient: "from-orange-500/35 via-red-500/20 to-transparent",
    badgeClass: "bg-orange-500/25 text-orange-50 border border-orange-500/40",
  },
}

const FILTER_OPTIONS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "supreme", label: "Supreme Incense" },
  { value: "dragon", label: "Dragon Incense" },
  { value: "sandalwood", label: "Sandalwood" },
  { value: "basic", label: "Basic Incense" },
]

const formatMintedAt = (value: string) => {
  try {
    return new Date(value).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return value
  }
}

const shorten = (value: string, size = 4) => {
  if (!value) return ""
  if (value.length <= size * 2) return value
  return `${value.slice(0, size)}...${value.slice(-size)}`
}

const isIncenseId = (value: string): value is IncenseId => {
  return (INCENSE_ID_LIST as readonly string[]).includes(value)
}


const mapApiHistoryToOwnedNfts = (history: Array<{
  id: number
  incenseId: string
  serial: number
  name: string
  nameEn: string
  meritPoints: number
  mintedAt: string
  transactionSignature: string
  image: string
}>): OwnedIncenseNft[] => {
  return history
    .filter((item) => isIncenseId(item.incenseId))
    .map((item) => ({
      id: String(item.id),
      serial: item.serial,
      incenseId: item.incenseId as IncenseId,
      name: item.name,
      nameEn: item.nameEn,
      meritPoints: item.meritPoints,
      mintedAt: item.mintedAt,
      mintAddress: undefined,
      transactionSignature: item.transactionSignature,
      image: item.image,
    }))
}

export default function IncensePage() {
  const { publicKey } = useWallet()
  const [selectedIncense, setSelectedIncense] = useState<string | null>(null)
  const [burnDialogOpen, setBurnDialogOpen] = useState(false)
  const [droppedAmulet, setDroppedAmulet] = useState<any>(null)
  const [incenseNfts, setIncenseNfts] = useState<OwnedIncenseNft[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all")

  useEffect(() => {
    if (!publicKey) {
      setIncenseNfts([])
      return
    }

    const loadIncenseHistory = async () => {
      try {
        const userPubkey = publicKey.toBase58()
        const response = await getIncenseHistory(userPubkey, 20)
        const mappedNfts = mapApiHistoryToOwnedNfts(response.history)
        setIncenseNfts(mappedNfts)
      } catch (error) {
        console.error("[solji] Failed to load incense NFTs from API:", error)
        setIncenseNfts([])
      }
    }

    loadIncenseHistory()
  }, [publicKey])

  // 移除 localStorage 写入逻辑，因为数据现在从 API 读取
  // useEffect(() => {
  //   if (!storageLoaded || typeof window === "undefined") {
  //     return
  //   }

  //   try {
  //     window.localStorage.setItem(storageKey, JSON.stringify(incenseNfts))
  //   } catch (error) {
  //     console.error("[solji] Failed to persist incense NFTs:", error)
  //   }
  // }, [incenseNfts, storageKey, storageLoaded])

  const filteredNfts = useMemo(
    () => (activeFilter === "all" ? incenseNfts : incenseNfts.filter((nft) => nft.incenseId === activeFilter)),
    [incenseNfts, activeFilter],
  )
  const mintedCounts = useMemo(() => {
    return incenseNfts.reduce((acc, nft) => {
      acc[nft.incenseId] = (acc[nft.incenseId] ?? 0) + 1
      return acc
    }, {} as Record<IncenseId, number>)
  }, [incenseNfts])

  const totalMerit = useMemo(() => incenseNfts.reduce((sum, nft) => sum + nft.meritPoints, 0), [incenseNfts])

  // 香型ID到incense_type的映射
  const incenseTypeMap: Record<IncenseId, number> = {
    basic: 1,
    sandalwood: 2,
    dragon: 3,
    supreme: 4,
  }

  const [burnCounts, setBurnCounts] = useState<Record<IncenseId, number>>({
    basic: 0,
    sandalwood: 0,
    dragon: 0,
    supreme: 0,
  })

  // 加载所有香型的燃烧次数
  const loadBurnCounts = async () => {
    if (!publicKey) return
    const userPubkey = publicKey.toString()
    const counts: Record<IncenseId, number> = {
      basic: 0,
      sandalwood: 0,
      dragon: 0,
      supreme: 0,
    }
    try {
      await Promise.all(
        INCENSE_ID_LIST.map(async (incenseId) => {
          const incenseType = incenseTypeMap[incenseId]
          try {
            const response = await getIncenseBurnCount(userPubkey, incenseType)
            counts[incenseId] = response.burn_count
          } catch (error) {
            console.error(`Failed to load burn count for ${incenseId}:`, error)
          }
        })
      )
      setBurnCounts(counts)
    } catch (error) {
      console.error('Failed to load burn counts:', error)
    }
  }

  // 页面加载时获取燃烧次数
  useEffect(() => {
    if (publicKey) {
      loadBurnCounts()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicKey])

  const handleBurnClick = (incenseId: string) => {
    setSelectedIncense(incenseId)
    setBurnDialogOpen(true)
  }

  const handleBurnSuccess = async (result: BurnIncenseResult, incense: IncenseType) => {
    if (isIncenseId(incense.id)) {
      setActiveFilter((current) => {
        if (current === "all" || current === incense.id) {
          return current
        }
        return "all"
      })

      // 烧香成功后，统一从 API 获取最新数据
      if (publicKey && incenseTypeMap[incense.id]) {
        // 设置延时后再触发获取并更新数据（给后端一些时间处理交易）
        setTimeout(async () => {
          try {
            const userPubkey = publicKey.toBase58()
            // 重新获取 incense 历史记录
            const historyResponse = await getIncenseHistory(userPubkey, 20)
            const mappedNfts = mapApiHistoryToOwnedNfts(historyResponse.history)
            setIncenseNfts(mappedNfts)

            // 更新燃烧次数
            const burnCountResponse = await getIncenseBurnCount(userPubkey, incenseTypeMap[incense.id as IncenseId])
            setBurnCounts((prev) => ({
              ...prev,
              [incense.id]: burnCountResponse.burn_count,
            }))
          } catch (error) {
            console.error(`Failed to update data after burn for ${incense.id}:`, error)
          }
        }, 5000);
      }
    } else {
      console.warn("[solji] Received incense with unsupported id:", incense.id)
    }

    const dropResult = checkAmuletDrop()
    if (dropResult.dropped && dropResult.amulet) {
      setDroppedAmulet(dropResult.amulet)
    }
  }

  const handleRefreshRecords = async () => {
    if (!publicKey) {
      return
    }
    try {
      const userPubkey = publicKey.toBase58()
      const response = await getIncenseHistory(userPubkey, 20)
      const mappedNfts = mapApiHistoryToOwnedNfts(response.history)
      setIncenseNfts(mappedNfts)
    } catch (error) {
      console.error("[solji] Failed to refresh incense NFTs from API:", error)
    }
  }

  const selectedIncenseData = useMemo(
    () => INCENSE_TYPES.find((i) => i.id === selectedIncense) ?? null,
    [selectedIncense],
  )

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
          const burnCount = (isIncenseId(incense.id) ? burnCounts[incense.id] : 0) || 0
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
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">My Incense NFTs</h2>
            <p className="text-sm text-muted-foreground">
              Every burn mints a soul-bound incense NFT. Track your devotion and merit milestones here.
            </p>
          </div>
          {incenseNfts.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>
                NFTs{" "}
                <span className="font-semibold text-primary">{incenseNfts.length}</span>
              </span>
              <span className="hidden sm:inline">
                Merit earned{" "}
                <span className="font-semibold text-primary">+{totalMerit}</span>
              </span>
              <Button variant="outline" size="sm" onClick={handleRefreshRecords}>
                Refresh
              </Button>
            </div>
          )}
        </div>

        {incenseNfts.length === 0 ? (
          <Card className="temple-card p-8 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                <Flame className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">No Incense NFTs Yet</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Burn incense to mint your first incense NFT. Each burn creates a unique collectible and appears
                  here instantly.
                </p>
              </div>
              <Button variant="outline" onClick={() => handleBurnClick(INCENSE_TYPES[0].id)}>
                Burn Your First Incense
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex flex-wrap gap-2">
                {FILTER_OPTIONS.map((option) => {
                  let count = incenseNfts.length
                  if (option.value !== "all") {
                    count = mintedCounts[option.value] ?? 0
                  }
                  return (
                    <Button
                      key={option.value}
                      size="sm"
                      variant={activeFilter === option.value ? "default" : "outline"}
                      onClick={() => setActiveFilter(option.value)}
                    >
                      {option.label}
                      <span className="ml-1 text-xs text-muted-foreground">{count}</span>
                    </Button>
                  )
                })}
              </div>
              <span className="text-xs text-muted-foreground">
                Showing {filteredNfts.length} / {incenseNfts.length}
              </span>
            </div>

            {filteredNfts.length === 0 ? (
              <Card className="temple-card p-8 text-center">
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">No NFTs for this incense yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Burn{" "}
                    {FILTER_OPTIONS.find((option) => option.value === activeFilter)?.label ?? "this incense"} to
                    mint your first NFT in this category.
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNfts.map((nft) => (
                  <Card key={nft.id} className="temple-card overflow-hidden group">
                    <div
                      className={`relative aspect-square overflow-hidden bg-gradient-to-br ${RARITY_STYLES[nft.incenseId].gradient}`}
                    >
                      <Image
                        src={nft.image || "/placeholder.svg"}
                        alt={nft.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      <Badge className={`absolute top-3 left-3 ${RARITY_STYLES[nft.incenseId].badgeClass}`}>
                        {RARITY_STYLES[nft.incenseId].label}
                      </Badge>
                      <Badge className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm font-mono">
                        #{String(nft.serial).padStart(3, "0")}
                      </Badge>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold">{nft.name}</h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide">{nft.nameEn}</p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Sparkles className="w-4 h-4 text-primary" />
                          Merit
                        </span>
                        <span className="font-semibold text-primary">+{nft.meritPoints}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Minted</span>
                        <span>{formatMintedAt(nft.mintedAt)}</span>
                      </div>
                      {nft.mintAddress && (
                        <div className="text-xs text-muted-foreground font-mono">
                          Mint: {shorten(nft.mintAddress)}
                        </div>
                      )}
                      {nft.transactionSignature && (
                        <div className="text-xs text-muted-foreground font-mono">
                          Tx: {shorten(nft.transactionSignature)}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
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
