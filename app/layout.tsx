import { I18nProvider } from '@/lib/i18n/context';
import { ThemeProvider } from '@/lib/theme/context';
import { Analytics } from '@vercel/analytics/next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import type React from 'react';
import { Suspense } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Solji - Web3 Spiritual Temple',
  description:
    'A blockchain-based interactive temple on Solana&BSC. Burn incense, draw fortunes, make wishes, and earn merit NFTs.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider>
          <I18nProvider>
            <Suspense fallback={null}>
              {children}
              <Analytics />
            </Suspense>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
