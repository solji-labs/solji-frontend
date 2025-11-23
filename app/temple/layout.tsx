import type { Metadata } from 'next';
import type React from "react"
import { TempleBackground } from "@/components/temple-background"
import { TempleHeader } from "@/components/temple-header"
import { APP_BASE_URL } from '@/lib/constants';
import { generateFrameMetadata } from '@/lib/generateFrameMetadata';

export async function generateMetadata(): Promise<Metadata> {
  const baseMetadata: Metadata = {
    title: 'Solji Temple - Web3 Spiritual Temple',
    description: '进入 Solji 寺庙，体验烧香、抽签、许愿、捐赠等传统仪式，获得功德点和 NFT 奖励。',
  };

  // 生成 Farcaster Embed meta 标签
  const frameUrl = `${APP_BASE_URL}/temple`;
  const imageUrl = `${APP_BASE_URL}/temple-l1.png`; // 使用寺庙图片

  const frameMetadata = await generateFrameMetadata({
    name: 'Solji Temple',
    title: 'Solji Temple - Web3 Spiritual Temple',
    url: frameUrl,
    description: '进入 Solji 寺庙，体验烧香、抽签、许愿、捐赠等传统仪式，获得功德点和 NFT 奖励。',
    imageUrl: imageUrl,
    launchButtonName: '进入寺庙',
    launchButtonUrl: frameUrl,
  });

  return {
    ...baseMetadata,
    ...frameMetadata,
  };
}

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
