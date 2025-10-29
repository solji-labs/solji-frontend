import { MeritBadge } from '@/components/merit-badge';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getProfile } from '@/lib/api';
import type {
  ProfileAchievementItem,
  ProfileActivityItem,
  ProfileResponse
} from '@/lib/api/types';
import type { LucideIcon } from 'lucide-react';
import {
  Award,
  Flame,
  Heart,
  ScrollText,
  Sparkles,
  TrendingUp,
  User
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

const DEFAULT_PROFILE: ProfileResponse = {
  user_pubkey: '',
  merit_points: 0,
  incense_points: 0,
  rank: '—',
  joined_date: '',
  stats: {
    total_incense_burned: 0,
    total_fortunes_drawn: 0,
    total_wishes_made: 0,
    total_donated_sol: 0
  },
  nfts: {
    amulet_count: 0,
    fortune_nft_count: 0,
    buddha_nft_count: 0
  },
  recent_activity: [],
  achievements: []
};

const MOCK_PROFILE: ProfileResponse = {
  user_pubkey: 'UserPubkey...',
  merit_points: 1520,
  incense_points: 0,
  rank: '供奉',
  joined_date: '2025-01-01T00:00:00Z',
  stats: {
    total_incense_burned: 45,
    total_fortunes_drawn: 23,
    total_wishes_made: 12,
    total_donated_sol: 1.5
  },
  nfts: {
    amulet_count: 0,
    fortune_nft_count: 0,
    buddha_nft_count: 0
  },
  recent_activity: [
    {
      activity_type: 'incense_burn',
      description: 'Burned Supreme Incense',
      merit_gained: 30,
      created_at: '2025-01-01T12:00:00Z'
    }
  ],
  achievements: [
    {
      title: 'First Incense',
      description: 'Burned your first incense',
      unlocked: true,
      unlocked_at: '2025-01-01T10:00:00Z'
    }
  ]
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

const getActivityIcon = (item: ProfileActivityItem) => {
  return ACTIVITY_ICON_MAP[item.activity_type] ?? TrendingUp;
};

const getAchievementIcon = (item: ProfileAchievementItem) => {
  return ACHIEVEMENT_ICON_MAP[item.title] ?? TrendingUp;
};

export default async function ProfilePage() {
  let profile: ProfileResponse | null = null;
  let loadError: unknown = null;

  try {
    profile = await getProfile();
    if (!profile) {
      loadError = new Error('Profile not found');
      profile = MOCK_PROFILE;
    }
  } catch (error) {
    loadError = error;
    profile = MOCK_PROFILE;
  }

  const data = profile ?? DEFAULT_PROFILE;
  const walletAddress = data.user_pubkey || '—';
  const username = walletAddress
    ? `Believer_${walletAddress.slice(0, 4)}`
    : 'Believer';
  const joinedDate = formatDate(data.joined_date);
  const stats = data.stats ?? DEFAULT_PROFILE.stats;
  const nftCounts = data.nfts ?? DEFAULT_PROFILE.nfts;
  const activities = data.recent_activity ?? [];
  const achievements = data.achievements ?? [];
  const showLoadError = profile === MOCK_PROFILE && Boolean(loadError);

  return (
    <div className='container mx-auto px-4 py-8 max-w-6xl'>
      {showLoadError && (
        <Card className='temple-card border border-amber-500/30 text-muted-foreground mb-6 px-1'>
          <h2 className='text-base font-semibold mb-1 p-2'>
            Profile service unavailable
          </h2>
          <p className='text-xs p-2'>
            Showing a sample profile until the profile API is reachable. Try
            again later to view your live data.
          </p>
        </Card>
      )}

      {/* Profile Header */}
      <Card className='temple-card p-8 mb-8'>
        <div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
          <div className='w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center'>
            <User className='w-10 h-10 text-primary' />
          </div>

          <div className='flex-1'>
            <h1 className='text-3xl font-bold mb-2'>{username}</h1>
            <p className='text-sm text-muted-foreground mb-4'>
              {shortenAddress(walletAddress, 6)}
            </p>
            <MeritBadge points={data.merit_points} rank={data.rank} />
          </div>

          <div className='text-right'>
            <p className='text-sm text-muted-foreground'>Member since</p>
            <p className='text-sm font-semibold'>{joinedDate}</p>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
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
      <Tabs defaultValue='nfts' className='space-y-6'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='nfts'>My NFTs</TabsTrigger>
          <TabsTrigger value='activity'>Activity</TabsTrigger>
          <TabsTrigger value='achievements'>Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value='nfts'>
          <div className='grid md:grid-cols-3 gap-6'>
            <Card className='temple-card p-6 text-center'>
              <div className='w-12 h-12 rounded-lg bg-primary/10 mx-auto mb-3 flex items-center justify-center'>
                <Sparkles className='w-6 h-6 text-primary' />
              </div>
              <div className='text-2xl font-bold mb-1'>
                {nftCounts.amulet_count.toLocaleString()}
              </div>
              <div className='text-sm text-muted-foreground'>Amulets</div>
            </Card>
            <Card className='temple-card p-6 text-center'>
              <div className='w-12 h-12 rounded-lg bg-purple-500/10 mx-auto mb-3 flex items-center justify-center'>
                <ScrollText className='w-6 h-6 text-purple-500' />
              </div>
              <div className='text-2xl font-bold mb-1'>
                {nftCounts.fortune_nft_count.toLocaleString()}
              </div>
              <div className='text-sm text-muted-foreground'>Fortune NFTs</div>
            </Card>
            <Card className='temple-card p-6 text-center'>
              <div className='w-12 h-12 rounded-lg bg-amber-500/10 mx-auto mb-3 flex items-center justify-center'>
                <Award className='w-6 h-6 text-amber-500' />
              </div>
              <div className='text-2xl font-bold mb-1'>
                {nftCounts.buddha_nft_count.toLocaleString()}
              </div>
              <div className='text-sm text-muted-foreground'>Buddha NFTs</div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value='activity'>
          <Card className='temple-card p-6'>
            {activities.length === 0 ? (
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
                          <p className='text-sm font-medium'>
                            {activity.description}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            {formatDateTime(activity.created_at)}
                          </p>
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
          </Card>
        </TabsContent>

        <TabsContent value='achievements'>
          {achievements.length === 0 ? (
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
                    className={`temple-card p-6 ${
                      unlocked ? '' : 'opacity-50 grayscale'
                    }`}>
                    <div className='flex items-start gap-4'>
                      <div
                        className={`w-12 h-12 rounded-lg ${
                          unlocked ? 'bg-primary/10' : 'bg-muted'
                        } flex items-center justify-center flex-shrink-0`}>
                        <Icon
                          className={`w-6 h-6 ${
                            unlocked ? 'text-primary' : 'text-muted-foreground'
                          }`}
                        />
                      </div>
                      <div className='flex-1'>
                        <h3 className='text-lg font-semibold mb-1'>
                          {achievement.title}
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                          {achievement.description}
                        </p>
                        {unlocked ? (
                          <Badge variant='secondary' className='mt-2 text-xs'>
                            Unlocked ·{' '}
                            {formatDateTime(achievement.unlocked_at ?? '')}
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
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
