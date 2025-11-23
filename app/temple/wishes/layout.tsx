import type { Metadata } from 'next';
import { APP_BASE_URL } from '@/lib/constants';
import { generateFrameMetadata } from '@/lib/generateFrameMetadata';

export async function generateMetadata(): Promise<Metadata> {
    const baseMetadata: Metadata = {
        title: '许愿池 - Solji Temple',
        description: '在 Solji 寺庙许下你的愿望，与其他香客分享你的心愿，获得祝福和点赞。',
    };

    // 生成 Farcaster Embed meta 标签
    const frameUrl = `${APP_BASE_URL}/temple/wishes`;
    // 使用 public 下的实际图片
    const imageUrl = `${APP_BASE_URL}/logo.png`;

    const frameMetadata = await generateFrameMetadata({
        name: 'Solji - 许愿池',
        title: '许愿池 - Solji Temple',
        url: frameUrl,
        description: '在 Solji 寺庙许下你的愿望，与其他香客分享你的心愿，获得祝福和点赞。',
        imageUrl: imageUrl,
        launchButtonName: '前往许愿池',
        launchButtonUrl: frameUrl,
    });

    return {
        ...baseMetadata,
        ...frameMetadata,
    };
}

export default function WishesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}


