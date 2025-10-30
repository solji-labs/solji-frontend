'use client';
import { MeritBadge } from '@/components/merit-badge';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWalletInfo } from '@/hooks/use-wallet';
import { useEffect, useState } from 'react';
import { getProfileBasic, getProfileNfts, getProfileActivities, getProfileAchievements } from '@/lib/api';
import type { ProfileBasicResponse, ProfileNftsResponse, ProfileActivitiesResponse, ProfileAchievementsResponse } from '@/lib/api/types';
import type { LucideIcon } from 'lucide-react';
import {
  Award,
  Flame,
  Heart,
  ScrollText,
  Sparkles,
  TrendingUp,
  User,
  RefreshCw
} from 'lucide-react';

const ACTIVITY_ICON_MAP: Record<string, LucideIcon> = {
  incense_burn: Flame,
  fortune_draw: ScrollText,
  wish_made: Heart,
  donation: Sparkles
};

const ACHIEVEMENT_ICON_MAP: Record<string, LucideIcon> = {
  'First Incense': Flame,
  'Fortune Seeker': ScrollText,
  'Wish Master': Heart,
  'Temple Supporter': Sparkles,
  'Merit Keeper': TrendingUp,
  'Temple Master': Award
};


const shortenAddress = (value: string, size = 4) => {
  if (!value) return '—';
  if (value.length <= size * 2) return value;
  return `${value.slice(0, size)}...${value.slice(-size)}`;
};

const formatDate = (value: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString();
};

const formatDateTime = (value: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
};

const toMeritLabel = (value: number | null | undefined) => {
  const merit = typeof value === 'number' && Number.isFinite(value) ? value : 0;
  return merit > 0 ? `+${merit}` : `${merit}`;
};

const getActivityIcon = (item: any) => {
  return ACTIVITY_ICON_MAP[item.activity_type] ?? TrendingUp;
};

const getAchievementIcon = (item: any) => {
  return ACHIEVEMENT_ICON_MAP[item.title] ?? TrendingUp;
};

export default function ProfilePage() {
  const { publicKey, connected } = useWalletInfo();
  const userPubkey = publicKey?.toString() ?? '';

  const [basic, setBasic] = useState<ProfileBasicResponse | null>(null);
  const [nfts, setNfts] = useState<ProfileNftsResponse['nfts'] | null>(null);
  const [activities, setActivities] = useState<ProfileActivitiesResponse['activities']>([]);
  const [achievements, setAchievements] = useState<ProfileAchievementsResponse['achievements']>([]);
  const [loading, setLoading] = useState(false);
  const [nftsLoading, setNftsLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [achievementsLoading, setAchievementsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'nfts' | 'activity' | 'achievements'>('nfts');

  useEffect(() => {
    if (!userPubkey) return;
    setLoading(true);
    setError(null);
    Promise.all([
      getProfileBasic(userPubkey).catch(() => null),
      getProfileNfts(userPubkey).catch(() => null),
    ]).then(([b, n]) => {
      setBasic(b);
      setNfts(n?.nfts ?? null);
    }).catch((e) => {
      setError(String(e));
    }).finally(() => setLoading(false));
  }, [userPubkey]);

  // Tab 切换延迟请求
  useEffect(() => {
    if (!userPubkey) return;
    if (activeTab === 'activity' && !activitiesLoading) {
      setActivitiesLoading(true);
      getProfileActivities(userPubkey).then(a => setActivities(a?.activities || [])).catch(() => { }).finally(() => setActivitiesLoading(false));
    } else if (activeTab === 'achievements' && !achievementsLoading) {
      setAchievementsLoading(true);
      getProfileAchievements(userPubkey).then(a => setAchievements(a?.achievements || [])).catch(() => { }).finally(() => setAchievementsLoading(false));
    } else if (activeTab === 'nfts' && !nftsLoading) {
      setNftsLoading(true);
      getProfileNfts(userPubkey).then(n => setNfts(n?.nfts ?? null)).catch(() => { }).finally(() => setNftsLoading(false));
    }
  }, [activeTab, userPubkey]);

  if (!connected || !userPubkey) {
    return <div className='container mx-auto p-16 text-center text-muted-foreground'>请先连接钱包</div>;
  }
  if (loading) {
    return <div className='container mx-auto flex justify-center items-center p-16'><RefreshCw className='w-8 h-8 animate-spin text-muted-foreground' /></div>;
  }
  if (error) {
    return <div className='container mx-auto p-16 text-center text-muted-foreground'>加载失败: {error}</div>;
  }

  const stats = basic?.stats ?? {
    total_incense_burned: 0,
    total_fortunes_drawn: 0,
    total_wishes_made: 0,
    total_donated_sol: 0,
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-6xl'>
      {/* Profile Header (基础) */}
      <Card className='temple-card p-8 mb-8'>
        <div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
          <div className='w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center'>
            <User className='w-10 h-10 text-primary' />
          </div>

          <div className='flex-1'>
            <h1 className='text-3xl font-bold mb-2'>Believer_{basic?.user_pubkey?.slice(0, 4) || '—'}</h1>
            <p className='text-sm text-muted-foreground mb-4'>
              {shortenAddress(basic?.user_pubkey || '', 6)}
            </p>
            <MeritBadge points={basic?.merit_points || 0} rank={basic?.rank || '—'} />
          </div>

          <div className='text-right'>
            <p className='text-sm text-muted-foreground'>Member since</p>
            <p className='text-sm font-semibold'>{formatDate(basic?.joined_date || '')}</p>
          </div>
        </div>
      </Card>

      {/* Stats Grid (基础) */}
      <div className='grid md:grid-cols-4 gap-6 mb-8'>
        <Card className='temple-card p-6 text-center'>
          <div className='w-12 h-12 rounded-lg bg-orange-500/10 mx-auto mb-3 flex items-center justify-center'>
            <Flame className='w-6 h-6 text-orange-500' />
          </div>
          <div className='text-2xl font-bold mb-1'>
            {stats.total_incense_burned.toLocaleString()}
          </div>
          <div className='text-sm text-muted-foreground'>Incense Burned</div>
        </Card>
        <Card className='temple-card p-6 text-center'>
          <div className='w-12 h-12 rounded-lg bg-purple-500/10 mx-auto mb-3 flex items-center justify-center'>
            <ScrollText className='w-6 h-6 text-purple-500' />
          </div>
          <div className='text-2xl font-bold mb-1'>
            {stats.total_fortunes_drawn.toLocaleString()}
          </div>
          <div className='text-sm text-muted-foreground'>Fortunes Drawn</div>
        </Card>
        <Card className='temple-card p-6 text-center'>
          <div className='w-12 h-12 rounded-lg bg-pink-500/10 mx-auto mb-3 flex items-center justify-center'>
            <Heart className='w-6 h-6 text-pink-500' />
          </div>
          <div className='text-2xl font-bold mb-1'>
            {stats.total_wishes_made.toLocaleString()}
          </div>
          <div className='text-sm text-muted-foreground'>Wishes Made</div>
        </Card>
        <Card className='temple-card p-6 text-center'>
          <div className='w-12 h-12 rounded-lg bg-yellow-500/10 mx-auto mb-3 flex items-center justify-center'>
            <Sparkles className='w-6 h-6 text-yellow-500' />
          </div>
          <div className='text-2xl font-bold mb-1'>
            {stats.total_donated_sol.toLocaleString()} SOL
          </div>
          <div className='text-sm text-muted-foreground'>Total Donated</div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'nfts' | 'activity' | 'achievements')} className='space-y-6'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='nfts'>My NFTs</TabsTrigger>
          <TabsTrigger value='activity'>Activity</TabsTrigger>
          <TabsTrigger value='achievements'>Achievements</TabsTrigger>
        </TabsList>
        {/* NFTs Tab */}
        <TabsContent value='nfts'>
          {nftsLoading ? <div className='flex justify-center items-center py-8'><RefreshCw className='w-8 h-8 animate-spin text-muted-foreground' /></div> : (
            <div className='grid md:grid-cols-3 gap-6'>
              <Card className='temple-card p-6 text-center'>
                <div className='w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-3 flex items-center justify-center'>
                  <Sparkles className='w-6 h-6 text-primary' />
                </div>
                <div className='text-2xl font-bold mb-1'>
                  {nfts?.amulet_count?.toLocaleString?.() || '0'}
                </div>
                <div className='text-sm text-muted-foreground'>Amulets</div>
              </Card>
              <Card className='temple-card p-6 text-center'>
                <div className='w-12 h-12 rounded-lg bg-purple-500/10 mx-auto mb-3 flex items-center justify-center'>
                  <ScrollText className='w-6 h-6 text-purple-500' />
                </div>
                <div className='text-2xl font-bold mb-1'>
                  {nfts?.fortune_nft_count?.toLocaleString?.() || '0'}
                </div>
                <div className='text-sm text-muted-foreground'>Fortune NFTs</div>
              </Card>
              <Card className='temple-card p-6 text-center'>
                <div className='w-12 h-12 rounded-lg bg-amber-500/10 mx-auto mb-3 flex items-center justify-center'>
                  <Award className='w-6 h-6 text-amber-500' />
                </div>
                <div className='text-2xl font-bold mb-1'>
                  {nfts?.buddha_nft_count?.toLocaleString?.() || '0'}
                </div>
                <div className='text-sm text-muted-foreground'>Buddha NFTs</div>
              </Card>
            </div>)}
        </TabsContent>
        {/* Activity Tab */}
        <TabsContent value='activity'>
          {activitiesLoading
            ? <div className='flex justify-center items-center py-8'><RefreshCw className='w-8 h-8 animate-spin text-muted-foreground' /></div>
            :
            <Card className='temple-card p-6'>
              {!activities?.length ? (
                <p className='text-sm text-muted-foreground text-center'>
                  No activity recorded yet. Burn incense, draw fortunes, or donate
                  to build your history.
                </p>
              ) : (
                <div className='space-y-3'>
                  {activities.map((activity, index) => {
                    const Icon = getActivityIcon(activity);
                    return (
                      <div
                        key={`${activity.activity_type}-${activity.created_at}-${index}`}
                        className='flex items-center justify-between py-3 border-b border-border last:border-0'>
                        <div className='flex items-center gap-3'>
                          <div className='w-10 h-10 rounded-lg bg-muted flex items-center justify-center'>
                            <Icon className='w-5 h-5 text-muted-foreground' />
                          </div>
                          <div>
                            <p className='text-sm font-medium'>{activity.description}</p>
                            <p className='text-xs text-muted-foreground'>{formatDateTime(activity.created_at)}</p>
                          </div>
                        </div>
                        <Badge variant='secondary' className='text-xs'>
                          <Sparkles className='w-3 h-3 mr-1' />
                          {toMeritLabel(activity.merit_gained)}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>}
        </TabsContent>
        {/* Achievements Tab */}
        <TabsContent value='achievements'>
          {achievementsLoading
            ? <div className='flex justify-center items-center py-8'><RefreshCw className='w-8 h-8 animate-spin text-muted-foreground' /></div>
            :
            (!achievements?.length ? (
              <Card className='temple-card p-6 text-center'>
                <p className='text-sm text-muted-foreground'>
                  Start your temple journey to unlock achievements.
                </p>
              </Card>
            ) : (
              <div className='grid md:grid-cols-2 gap-6'>
                {achievements.map((achievement, index) => {
                  const Icon = getAchievementIcon(achievement);
                  const unlocked = Boolean(achievement.unlocked);
                  return (
                    <Card
                      key={`${achievement.title}-${index}`}
                      className={`temple-card p-6 ${unlocked ? '' : 'opacity-50 grayscale'}`}>
                      <div className='flex items-start gap-4'>
                        <div
                          className={`w-12 h-12 rounded-lg ${unlocked ? 'bg-primary/10' : 'bg-muted'} flex items-center justify-center flex-shrink-0`}>
                          <Icon
                            className={`w-6 h-6 ${unlocked ? 'text-primary' : 'text-muted-foreground'}`}
                          />
                        </div>
                        <div className='flex-1'>
                          <h3 className='text-lg font-semibold mb-1'>{achievement.title}</h3>
                          <p className='text-sm text-muted-foreground'>{achievement.description}</p>
                          {unlocked ? (
                            <Badge variant='secondary' className='mt-2 text-xs'>
                              Unlocked · {formatDateTime(achievement.unlocked_at ?? '')}
                            </Badge>
                          ) : (
                            <Badge variant='outline' className='mt-2 text-xs'>
                              Locked
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
