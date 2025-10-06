import { cn } from "@/lib/utils"

interface MeritBadgeProps {
  points: number
  rank: string
  className?: string
}

export function MeritBadge({ points, rank, className }: MeritBadgeProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="merit-gradient px-3 py-1 rounded-full">
        <span className="text-sm font-semibold text-white">{points.toLocaleString()} Merit</span>
      </div>
      <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
        <span className="text-sm font-medium text-primary">{rank}</span>
      </div>
    </div>
  )
}
