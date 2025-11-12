'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getDonationLeaderboard, getTempleLevel, getRecentActivities } from '@/lib/api';
import type {
  DonationLeaderboardItem,
  TempleLevelResponse,
  RecentActivityItem
} from '@/lib/api/types';
import {
  BarChart3,
  Flame,
  Heart,
  ImageIcon,
  ScrollText,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export default function TempleHomePage() {
  const [data, setData] = useState<TempleLevelResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leaderboard, setLeaderboard] = useState<DonationLeaderboardItem[]>([]);
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([getTempleLevel(), getDonationLeaderboard(), getRecentActivities()])
      .then(([level, board, activities]) => {
        if (!mounted) return;
        setData(level);
        setLeaderboard(board.leaderboard || []);
        setActivities(activities.activities || []);
        setError(null);
      })
      .catch((e) => {
        if (mounted) {
          setError(e.message || '加载失败');
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const progress = useMemo(() => {
    const donations = data?.stats.total_donations_sol ?? 0;
    const wishes = data?.stats.total_wishes ?? 0;
    const fortunes = data?.stats.total_draw_fortune ?? 0;
    const incensePoints = data?.stats.total_incense_points ?? 0;
    console.log("ssssss", wishes)

    const req = data?.next_level_requirements?.requirements;
    const clampPct = (pct: number) =>
      Math.min(100, Math.max(0, inscenceSafe(pct)));

    const donationsPct =
      req && req.donations_sol > 0
        ? clampPct((donations / req.donations_sol) * 100)
        : 0;
    const wishesPct =
      req && req.wishes > 0 ? clampPct((wishes / req.wishes) * 100) : 0;
    const fortunesPct =
      req && req.draw_fortune > 0
        ? clampPct((fortunes / req.draw_fortune) * 100)
        : 0;
    const incensePct =
      req && req.incense_points > 0
        ? clampPct((incensePoints / req.incense_points) * 100)
        : 0;

    return {
      donations: donationsPct,
      wishes: wishesPct,
      fortunes: fortunesPct,
      incense: incensePct
    };
  }, [data]);

  function inscenceSafe(v: number) {
    return isFinite(v) ? v : 0;
  }

  function formatPercent(pct: number) {
    if (pct >= 1) {
      return `${Math.round(pct)}`;
    }
    if (pct > 0) {
      const digits = pct >= 0.1 ? 1 : 2;
      const fixed = pct.toFixed(digits);
      return fixed.replace(/0+$/, '').replace(/\.$/, '') || '0';
    }
    return '0';
  }
  function shortKey(k: string) {
    return k ? `${k.slice(0, 4)}...${k.slice(-4)}` : '';
  }
  function formatTimeAgo(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  }

  const templeName = data?.level_name_en
    ? { cn: data.level_name, en: data.level_name_en }
    : { cn: '——', en: '' };
  const nextLevel = data?.next_level_requirements;

  return (
    <div className='container mx-auto px-4 py-8 max-w-7xl'>
      {/* Temple Status Card */}
      <Card className='temple-card p-8 mb-8'>
        <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6'>
          <div className='space-y-2'>
            <div className='flex items-center gap-3'>
              <div className='w-24 rounded-full bg-primary/10 flex items-center justify-center'>
                {/* <Flame className="w-6 h-6 text-primary animate-glow" /> */}
                <img
                  src='/temple-l1.png'
                  alt='Temple Icon'
                  className='animate-glow'
                />
              </div>
              <div>
                <h1 className='text-3xl font-bold'>
                  {templeName.cn}{' '}
                  <span className='text-muted-foreground text-xl'>
                    Lv.{data?.current_level ?? '-'}
                  </span>
                </h1>
                <p className='text-muted-foreground'>{templeName.en}</p>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-primary'>
                {(data?.stats.total_draw_fortune ?? 0).toLocaleString()}
              </div>
              <div className='text-xs text-muted-foreground'>Believers</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-primary'>
                {(data?.stats.total_incense_points ?? 0).toLocaleString()}
              </div>
              <div className='text-xs text-muted-foreground'>Incense</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-primary'>
                {(data?.stats.total_fortune_nfts ?? 0).toLocaleString()}
              </div>
              <div className='text-xs text-muted-foreground'>Fortunes</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold text-primary'>
                {data?.stats.total_donations_sol ?? 0} SOL
              </div>
              <div className='text-xs text-muted-foreground'>Donations</div>
            </div>
          </div>
        </div>

        {/* Temple Evolution Progress */}
        <div className='mt-6 pt-6 border-t border-border'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-semibold'>
              Next Level: {nextLevel?.level_name ?? '—'} (
              {nextLevel?.level_name_en ?? ''})
            </h3>
            <Link href='/temple/dashboard'>
              <Button variant='ghost' size='sm'>
                View Details
              </Button>
            </Link>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
            <div className='space-y-2'>
              <div className='flex items-center justify-between text-xs'>
                <span>Incense</span>
                <span className='text-muted-foreground'>
                  {formatPercent(progress.incense)}%
                </span>
              </div>
              <Progress value={progress.incense} className='h-2' />
            </div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between text-xs'>
                <span>Fortunes</span>
                <span className='text-muted-foreground'>
                  {formatPercent(progress.fortunes)}%
                </span>
              </div>
              <Progress value={progress.fortunes} className='h-2' />
            </div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between text-xs'>
                <span>Wishes</span>
                <span className='text-muted-foreground'>
                  {formatPercent(progress.wishes)}%
                </span>
              </div>
              <Progress value={progress.wishes} className='h-2' />
            </div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between text-xs'>
                <span>Donations</span>
                <span className='text-muted-foreground'>
                  {formatPercent(progress.donations)}%
                </span>
              </div>
              <Progress value={progress.donations} className='h-2' />
            </div>
          </div>
        </div>
      </Card>

      {/* Main Actions Grid */}
      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {/* Burn Incense */}
        <Link href='/temple/incense' className='group'>
          <Card className='temple-card p-6 h-full space-y-4 cursor-pointer'>
            <div className='w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform'>
              <Flame className='w-7 h-7 text-orange-500 animate-glow' />
            </div>
            <div>
              <h3 className='text-xl font-semibold mb-2'>Burn Incense</h3>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                Offer incense to earn merit points and mint exclusive NFTs
              </p>
            </div>
            <Button className='w-full bg-transparent' variant='outline'>
              Enter Incense Hall
            </Button>
          </Card>
        </Link>

        {/* Draw Fortune */}
        <Link href='/temple/fortune' className='group'>
          <Card className='temple-card p-6 h-full space-y-4 cursor-pointer'>
            <div className='w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform'>
              <ScrollText className='w-7 h-7 text-purple-500' />
            </div>
            <div>
              <h3 className='text-xl font-semibold mb-2'>Draw Fortune</h3>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                Receive your daily fortune with AI-powered interpretation
              </p>
            </div>
            <Button className='w-full bg-transparent' variant='outline'>
              Draw Your Fortune
            </Button>
          </Card>
        </Link>

        {/* Make Wish */}
        <Link href='/temple/wishes' className='group'>
          <Card className='temple-card p-6 h-full space-y-4 cursor-pointer'>
            <div className='w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center group-hover:scale-110 transition-transform'>
              <Heart className='w-7 h-7 text-pink-500' />
            </div>
            <div>
              <h3 className='text-xl font-semibold mb-2'>Make a Wish</h3>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                Write your wish on a digital Ema plaque and mint as NFT
              </p>
            </div>
            <Button className='w-full bg-transparent' variant='outline'>
              Write Your Wish
            </Button>
          </Card>
        </Link>

        {/* Donate */}
        <Link href='/temple/donate' className='group'>
          <Card className='temple-card p-6 h-full space-y-4 cursor-pointer'>
            <div className='w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform'>
              <Sparkles className='w-7 h-7 text-yellow-500' />
            </div>
            <div>
              <h3 className='text-xl font-semibold mb-2'>Donate</h3>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                Support the temple and earn special badge NFTs
              </p>
            </div>
            <Button className='w-full bg-transparent' variant='outline'>
              Make Donation
            </Button>
          </Card>
        </Link>
      </div>

      <div className='grid md:grid-cols-2 gap-6 mb-8'>
        <Link href='/temple/dashboard' className='group'>
          <Card className='temple-card p-6 cursor-pointer hover:shadow-lg transition-shadow'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform'>
                <BarChart3 className='w-6 h-6 text-blue-500' />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold mb-1'>Temple Dashboard</h3>
                <p className='text-sm text-muted-foreground'>
                  View detailed metrics and leaderboards
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href='/temple/collection' className='group'>
          <Card className='temple-card p-6 cursor-pointer hover:shadow-lg transition-shadow'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform'>
                <ImageIcon className='w-6 h-6 text-purple-500' />
              </div>
              <div className='flex-1'>
                <h3 className='text-lg font-semibold mb-1'>NFT Collection</h3>
                <p className='text-sm text-muted-foreground'>
                  Browse your sacred digital treasures
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Secondary Sections */}
      <div className='grid lg:grid-cols-2 gap-6'>
        {/* Recent Activities */}
        <Card className='temple-card p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold'>Recent Activities</h2>
            <TrendingUp className='w-5 h-5 text-muted-foreground' />
          </div>
          <div className='space-y-3'>
            {activities.length === 0 ? (
              <p className='text-sm text-muted-foreground text-center py-4'>
                No recent activities
              </p>
            ) : (
              activities.map((activity) => (
                <div
                  key={`${activity.user_pubkey}-${activity.created_at}`}
                  className='flex items-center justify-between py-2 border-b border-border/50 last:border-0'>
                  <div className='flex items-center gap-3'>
                    <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
                      <Users className='w-4 h-4 text-primary' />
                    </div>
                    <div>
                      <p className='text-sm'>
                        <span className='font-medium'>{shortKey(activity.user_pubkey)}</span>{' '}
                        <span className='text-muted-foreground'>
                          {activity.action}
                        </span>
                      </p>
                    </div>
                  </div>
                  <span className='text-xs text-muted-foreground'>
                    {formatTimeAgo(activity.created_at)}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Top Contributors */}
        <Card className='temple-card p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-semibold'>Top Contributors</h2>
            <Sparkles className='w-5 h-5 text-muted-foreground' />
          </div>
          <div className='space-y-3'>
            {leaderboard.map((contributor) => (
              <div
                key={contributor.rank}
                className='flex items-center justify-between py-2 border-b border-border/50 last:border-0'>
                <div className='flex items-center gap-3'>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${contributor.rank === 1
                      ? 'bg-yellow-500/20 text-yellow-500'
                      : contributor.rank === 2
                        ? 'bg-gray-400/20 text-gray-400'
                        : contributor.rank === 3
                          ? 'bg-orange-500/20 text-orange-500'
                          : 'bg-primary/10 text-primary'
                      }`}>
                    {contributor.rank}
                  </div>
                  <div>
                    <p className='text-sm font-medium'>
                      {shortKey(contributor.user_pubkey)}
                    </p>
                    <p className='text-xs text-muted-foreground'>Donated</p>
                  </div>
                </div>
                <span className='text-sm font-semibold text-primary'>
                  {contributor.total_donated} SOL
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
