import type { Metadata } from 'next';
import { APP_BASE_URL } from '@/lib/constants';
import { generateFrameMetadata } from '@/lib/generateFrameMetadata';

export async function generateMetadata(): Promise<Metadata> {
    const baseMetadata: Metadata = {
        title: '烧香 - Solji Temple',
        description: '在 Solji 寺庙烧香祈福，购买不同类型的香，获得功德点和 Merit Incense NFTs。',
    };

    // 生成 Farcaster Embed meta 标签
    const frameUrl = `${APP_BASE_URL}/temple/incense`;
    // 使用烧香相关的图片
    const imageUrl = `${APP_BASE_URL}/traditional-incense-stick-glowing.jpg`;

    const frameMetadata = await generateFrameMetadata({
        name: 'Solji - 烧香',
        title: '烧香 - Solji Temple',
        url: frameUrl,
        description: '在 Solji 寺庙烧香祈福，购买不同类型的香，获得功德点和 Merit Incense NFTs。',
        imageUrl: imageUrl,
        launchButtonName: '前往烧香',
        launchButtonUrl: frameUrl,
    });

    return {
        ...baseMetadata,
        ...frameMetadata,
    };
}

export default function IncenseLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

