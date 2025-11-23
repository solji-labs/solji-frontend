import { I18nProvider } from '@/lib/i18n/context';
import { ThemeProvider } from '@/lib/theme/context';
import { WalletContextProvider } from '@/components/wallet-provider';
import { MeritRefreshProvider } from '@/lib/merit-refresh/context';
import { Analytics } from '@vercel/analytics/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import type React from 'react';
import { Suspense } from 'react';
import Script from 'next/script';
import { APP_BASE_URL } from '@/lib/constants';
import { generateFrameMetadata } from '@/lib/generateFrameMetadata';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
  const baseMetadata: Metadata = {
    title: 'Solji - Web3 Spiritual Temple',
    description:
      'A blockchain-based interactive temple on Solana&BSC. Burn incense, draw fortunes, make wishes, and earn merit NFTs.',
  };

  // 生成 Farcaster Embed meta 标签
  const frameUrl = APP_BASE_URL;
  // 使用 public 下的实际图片，Next.js 会自动处理 public 文件夹的路径
  const imageUrl = `${frameUrl}/logo.png`; // 或使用 /temple-l1.png

  const frameMetadata = await generateFrameMetadata({
    name: 'Solji',
    title: 'Solji - Web3 Spiritual Temple',
    url: frameUrl,
    description:
      'A blockchain-based interactive temple on Solana&BSC. Burn incense, draw fortunes, make wishes, and earn merit NFTs.',
    imageUrl: imageUrl,
    launchButtonName: '进入 Solji 寺庙',
    launchButtonUrl: `${frameUrl}/temple`,
  });

  return {
    ...baseMetadata,
    ...frameMetadata,
  };
}

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        {GA_MEASUREMENT_ID ? (
          <>
            {/* Google tag (gtag.js) */}
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy='afterInteractive'
            />
            <Script id='google-analytics' strategy='afterInteractive'>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        ) : null}
        <WalletContextProvider>
          <ThemeProvider>
            <I18nProvider>
              <MeritRefreshProvider>
                <Suspense fallback={null}>
                  {children}
                  <Analytics />
                </Suspense>
              </MeritRefreshProvider>
            </I18nProvider>
          </ThemeProvider>
        </WalletContextProvider>
      </body>
    </html>
  );
}
