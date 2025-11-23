import type { Metadata } from 'next';

export interface FrameMetadataOptions {
    name: string;
    title: string;
    url: string;
    description?: string;
    imageUrl?: string;
    launchButtonName?: string;
    launchButtonUrl?: string;
}

/**
 * 生成 Farcaster Mini App Embed meta 标签
 * 参考: https://miniapps.farcaster.xyz/docs/specification
 */
export async function generateFrameMetadata(
    options: FrameMetadataOptions
): Promise<Metadata> {
    const {
        name,
        title,
        url,
        description,
        imageUrl,
        launchButtonName = 'Launch App',
        launchButtonUrl,
    } = options;

    // 构建 Farcaster Mini App 配置对象
    const frameConfig = {
        version: '1' as const,
        imageUrl: imageUrl || `${url}/logo.png`,
        title: title,
        ...(description && { description }),
        ...(launchButtonName && {
            buttons: [
                {
                    label: launchButtonName,
                    action: {
                        type: 'launch_miniapp' as const,
                        url: launchButtonUrl || url,
                    },
                },
            ],
        }),
    };

    // 序列化为 JSON 字符串
    const frameContent = JSON.stringify(frameConfig);

    return {
        other: {
            'fc:miniapp': frameContent,
        },
        openGraph: {
            title,
            description: description || title,
            url,
            siteName: name,
            images: imageUrl
                ? [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: title,
                    },
                ]
                : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: description || title,
            images: imageUrl ? [imageUrl] : [],
        },
    };
}


