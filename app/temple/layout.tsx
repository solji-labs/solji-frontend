import type React from "react"
import { TempleBackground } from "@/components/temple-background"
import { TempleHeader } from "@/components/temple-header"

export default function TempleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <TempleBackground />
      <TempleHeader />
      <main className="pt-20">{children}</main>
    </div>
  )
}
