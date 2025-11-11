'use client';

import { TempleBackground } from '@/components/temple-background';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/lib/i18n/context';
import { Flame, Heart, ScrollText, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getStats } from '@/lib/api';
import type { StatsResponse } from '@/lib/api/types';

export default function LandingPage() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  // 格式化数字显示
  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      const k = num / 1000;
      return `${k.toFixed(1)}K+`.replace('.0', '');
    }
    return `${num}+`;
  };

  return (
    <div className='min-h-screen'>
      <TempleBackground />

      {/* Header */}
      <header className='fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg'>
        <div className='container mx-auto px-4 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <img src='/logo.png' alt='Solji Logo' className='w-8 h-8' />
            <span className='text-xl font-bold'>{t.landing.title}</span>
          </div>

          <nav className='hidden md:flex items-center gap-6'>
            <Link
              href='#features'
              className='text-sm hover:text-primary transition-colors'>
              {t.landing.features.incense.title}
            </Link>
            <Link
              href='#about'
              className='text-sm hover:text-primary transition-colors'>
              About
            </Link>
            <Link
              href='#roadmap'
              className='text-sm hover:text-primary transition-colors'>
              {t.landing.roadmap.title}
            </Link>
          </nav>

          <Button asChild>
            <Link href='/temple'>{t.landing.enterTemple}</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className='pt-32 pb-20 px-4'>
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center space-y-6'>
            <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4'>
              <Sparkles className='w-4 h-4 text-primary' />
              <span className='text-sm font-medium'>{t.landing.subtitle}</span>
            </div>

            <h1 className='text-5xl md:text-7xl font-bold text-balance leading-tight'>
              {t.landing.title.split(' ')[0]}{' '}
              <span className='neon-text text-primary'>
                {t.landing.title.split(' ')[1] || t.landing.title}
              </span>
            </h1>

            <p className='text-xl md:text-2xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed'>
              {t.landing.description}
            </p>

            <div className='flex flex-col sm:flex-row items-center justify-center gap-4 pt-6'>
              <Button size='lg' asChild className='text-lg px-8'>
                <Link href='/temple'>
                  <Flame className='w-5 h-5 mr-2' />
                  {t.landing.enterTemple}
                </Link>
              </Button>
              <Button
                size='lg'
                variant='outline'
                asChild
                className='text-lg px-8 bg-transparent'>
                <Link href='#features'>Learn More</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-primary'>
                  {loading ? '—' : stats ? formatNumber(stats.total_users) : '—'}
                </div>
                <div className='text-sm text-muted-foreground'>
                  {t.temple.stats.believers}
                </div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-primary'>
                  {loading ? '—' : stats ? formatNumber(stats.total_incense_points) : '—'}
                </div>
                <div className='text-sm text-muted-foreground'>
                  {t.incense.burned}
                </div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-primary'>
                  {loading ? '—' : stats ? formatNumber(stats.total_draw_fortune) : '—'}
                </div>
                <div className='text-sm text-muted-foreground'>
                  {t.temple.stats.fortunes}
                </div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-primary'>
                  {loading ? '—' : stats ? formatNumber(stats.total_wishes) : '—'}
                </div>
                <div className='text-sm text-muted-foreground'>
                  {t.temple.stats.wishes}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id='features' className='py-20 px-4'>
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold mb-4'>Temple Features</h2>
            <p className='text-xl text-muted-foreground text-balance'>
              Experience spiritual practices on the blockchain
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <Card className='temple-card p-6 space-y-4'>
              <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center'>
                <Flame className='w-6 h-6 text-primary' />
              </div>
              <h3 className='text-xl font-semibold'>
                {t.landing.features.incense.title}
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                {t.landing.features.incense.description}
              </p>
            </Card>

            <Card className='temple-card p-6 space-y-4'>
              <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center'>
                <ScrollText className='w-6 h-6 text-primary' />
              </div>
              <h3 className='text-xl font-semibold'>
                {t.landing.features.fortune.title}
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                {t.landing.features.fortune.description}
              </p>
            </Card>

            <Card className='temple-card p-6 space-y-4'>
              <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center'>
                <Heart className='w-6 h-6 text-primary' />
              </div>
              <h3 className='text-xl font-semibold'>
                {t.landing.features.wishes.title}
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                {t.landing.features.wishes.description}
              </p>
            </Card>

            <Card className='temple-card p-6 space-y-4'>
              <div className='w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center'>
                <TrendingUp className='w-6 h-6 text-primary' />
              </div>
              <h3 className='text-xl font-semibold'>
                {t.temple.evolution.title}
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                {t.landing.features.donate.description}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id='about' className='py-20 px-4 bg-muted/30'>
        <div className='container mx-auto max-w-4xl'>
          <div className='text-center space-y-6'>
            <h2 className='text-4xl font-bold'>About Solji</h2>
            <p className='text-lg text-muted-foreground leading-relaxed text-balance'>
              Solji is a Web3 spiritual experience that bridges ancient temple
              traditions with modern blockchain technology. Built on Solana&BSC,
              it offers a unique blend of meditation, gamification, and NFT
              collectibles.
            </p>
            <p className='text-lg text-muted-foreground leading-relaxed text-balance'>
              Earn merit points through spiritual activities, collect rare NFTs,
              and watch the temple evolve as the community grows. From humble
              beginnings as a rustic shrine to the ultimate cyber shrine, your
              participation shapes the temple's destiny.
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id='roadmap' className='py-20 px-4'>
        <div className='container mx-auto max-w-6xl'>
          <div className='text-center mb-12'>
            <h2 className='text-4xl font-bold mb-4'>
              {t.landing.roadmap.title}
            </h2>
            <p className='text-xl text-muted-foreground'>
              Our journey to enlightenment
            </p>
          </div>

          <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
            <Card className='temple-card p-6 space-y-4'>
              <div className='text-sm font-semibold text-primary'>
                Phase 1 - Q4 2025
              </div>
              <h3 className='text-xl font-semibold'>MVP Launch</h3>
              <p className='text-sm text-muted-foreground'>
                {t.landing.roadmap.phase1}
              </p>
            </Card>

            <Card className='temple-card p-6 space-y-4'>
              <div className='text-sm font-semibold text-primary'>
                Phase 2 - Q1 2026
              </div>
              <h3 className='text-xl font-semibold'>TempleDAO Activation</h3>
              <p className='text-sm text-muted-foreground'>
                {t.landing.roadmap.phase2}
              </p>
            </Card>

            <Card className='temple-card p-6 space-y-4'>
              <div className='text-sm font-semibold text-primary'>
                Phase 3 - Q2 2026
              </div>
              <h3 className='text-xl font-semibold'>Emotional-Fi Oracle</h3>
              <p className='text-sm text-muted-foreground'>
                {t.landing.roadmap.phase3}
              </p>
            </Card>

            <Card className='temple-card p-6 space-y-4'>
              <div className='text-sm font-semibold text-primary'>
                Phase 4 - Q3 2026
              </div>
              <h3 className='text-xl font-semibold'>Cross-Chain Expansion</h3>
              <p className='text-sm text-muted-foreground'>
                {t.landing.roadmap.phase4}
              </p>
            </Card>

            <Card className='temple-card p-6 space-y-4'>
              <div className='text-sm font-semibold text-primary'>
                Phase 5 - Q4 2026
              </div>
              <h3 className='text-xl font-semibold'>Templeverse SDK</h3>
              <p className='text-sm text-muted-foreground'>
                {t.landing.roadmap.phase5}
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-4'>
        <div className='container mx-auto max-w-4xl'>
          <Card className='temple-card p-12 text-center space-y-6'>
            <h2 className='text-4xl font-bold'>Begin Your Spiritual Journey</h2>
            <p className='text-xl text-muted-foreground text-balance'>
              Connect your wallet and start earning merit in the Solji
            </p>
            <Button size='lg' asChild className='text-lg px-8'>
              <Link href='/temple'>
                <Flame className='w-5 h-5 mr-2' />
                {t.landing.enterTemple}
              </Link>
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-border/40 py-8 px-4'>
        <div className='container mx-auto max-w-6xl'>
          <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
            <div className='flex items-center gap-2'>
              <img src='/logo.png' alt='Solji Logo' className='w-8 h-8' />
              <span className='font-semibold'>Solji</span>
              <span className='text-sm text-muted-foreground'>© 2025</span>
            </div>

            <div className='flex items-center gap-6'>
              <Link
                href='https://x.com/solji_xyz'
                className='text-sm text-muted-foreground hover:text-primary transition-colors'>
                X
              </Link>
              <Link
                href='https://t.me/solji_xyz'
                className='text-sm text-muted-foreground hover:text-primary transition-colors'>
                Telegram
              </Link>
              <Link
                href='https://docs.solji.fun/docs'
                className='text-sm text-muted-foreground hover:text-primary transition-colors'>
                Whitepaper
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
