import type { Metadata } from 'next';
import { APP_BASE_URL } from '@/lib/constants';
import { generateFrameMetadata } from '@/lib/generateFrameMetadata';

export async function generateMetadata(): Promise<Metadata> {
    const baseMetadata: Metadata = {
        title: '捐赠 - Solji Temple',
        description: '向 Solji 寺庙捐赠 SOL，升级寺庙等级，获得特殊徽章 NFT 和特权。',
    };

    // 生成 Farcaster Embed meta 标签
    const frameUrl = `${APP_BASE_URL}/temple/donate`;
    // 使用寺庙相关的图片
    const imageUrl = `${APP_BASE_URL}/logo.png`;

    const frameMetadata = await generateFrameMetadata({
        name: 'Solji - 捐赠',
        title: '捐赠 - Solji Temple',
        url: frameUrl,
        description: '向 Solji 寺庙捐赠 SOL，升级寺庙等级，获得特殊徽章 NFT 和特权。',
        imageUrl: imageUrl,
        launchButtonName: '前往捐赠',
        launchButtonUrl: frameUrl,
    });

    return {
        ...baseMetadata,
        ...frameMetadata,
    };
}

export default function DonateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

