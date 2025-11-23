import type { Metadata } from 'next';
import { APP_BASE_URL } from '@/lib/constants';
import { generateFrameMetadata } from '@/lib/generateFrameMetadata';

export async function generateMetadata(): Promise<Metadata> {
    const baseMetadata: Metadata = {
        title: '抽签 - Solji Temple',
        description: '在 Solji 寺庙抽取每日运势签，获得 AI 解读的运势预测和功德奖励。',
    };

    // 生成 Farcaster Embed meta 标签
    const frameUrl = `${APP_BASE_URL}/temple/fortune`;
    // 使用寺庙相关的图片
    const imageUrl = `${APP_BASE_URL}/logo.png`;

    const frameMetadata = await generateFrameMetadata({
        name: 'Solji - 抽签',
        title: '抽签 - Solji Temple',
        url: frameUrl,
        description: '在 Solji 寺庙抽取每日运势签，获得 AI 解读的运势预测和功德奖励。',
        imageUrl: imageUrl,
        launchButtonName: '前往抽签',
        launchButtonUrl: frameUrl,
    });

    return {
        ...baseMetadata,
        ...frameMetadata,
    };
}

export default function FortuneLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

