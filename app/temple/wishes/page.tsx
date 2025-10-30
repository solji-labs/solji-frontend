'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Globe, Heart, Info, Lock, Share2, Sparkles, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCreateWish } from '@/hooks/use-create-wish';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import { getWishes, likeWish, ipfsUpload } from '@/lib/api';
import type { WishItem } from '@/lib/api/types';

const mockMyWishes: WishItem[] = [
  {
    id: 9001,
    wish_id: 108,
    content: 'Wishing my family good health, peace, and joyful news all year.',
    user_pubkey: 'DemoUser1111AAAA',
    likes: 42,
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 80).toISOString()
  },
  {
    id: 9002,
    wish_id: 256,
    content:
      'Hoping our startup launches smoothly this year and the whole team finds their shine.',
    user_pubkey: 'DemoUser2222BBBB',
    likes: 37,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  },
  {
    id: 9003,
    wish_id: 512,
    content: 'May the world see less conflict and more warmth and understanding.',
    user_pubkey: 'DemoUser3333CCCC',
    likes: 58,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString()
  }
];

export default function WishesPage() {
  const [wishText, setWishText] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [wishesCount, setWishesCount] = useState(0);
  const [wishes, setWishes] = useState<WishItem[]>([]);
  const [wishesLoading, setWishesLoading] = useState(false);
  const [totalWishesCount, setTotalWishesCount] = useState(0);
  const maxFreeWishes = 3;

  const { wallet, connected, publicKey } = useWallet();
  const { createWish, isLoading, error, clearError } = useCreateWish();
  const userPubkey = publicKey?.toBase58();

  // 点赞loading状态，用wishId作为key
  const [liking, setLiking] = useState<number | null>(null);
  const [ipfsLoading, setIpfsLoading] = useState(false);

  // 加载许愿墙数据
  const loadWishes = async () => {
    setWishesLoading(true);
    try {
      const response = await getWishes(publicKey?.toString());
      setWishes(response.wishes);
      setTotalWishesCount(response.pagination.count);
    } catch (error) {
      console.error('Failed to load wishes:', error);
      toast.error('failed to load wishes');
    } finally {
      setWishesLoading(false);
    }
  };

  // 页面加载时获取许愿数据
  useEffect(() => {
    loadWishes();
  }, []);

  useEffect(() => {
    if (!userPubkey) {
      setWishesCount(0);
      return;
    }

    const today = new Date();
    const todaysWishes = wishes.filter(
      (wish) =>
        wish.user_pubkey === userPubkey && isSameDay(wish.created_at, today)
    );
    setWishesCount(todaysWishes.length);
  }, [userPubkey, wishes]);
  const handleSubmitWish = async () => {
    if (!wishText.trim()) return;
    if (!connected) {
      toast.error('请先连接钱包');
      return;
    }
    try {
      setIpfsLoading(true);
      const ipfs = await ipfsUpload(wishText.trim());
      setIpfsLoading(false);
      // 将 ipfs.hash 编码为32字节数组，满足合约要求
      const encoder = new TextEncoder();
      const hashBytes = encoder.encode(ipfs.hash);
      const contentHash = Array.from({ length: 32 }, (_, i) => hashBytes[i] ?? 0);
      // 合约调用loading由isLoading（useCreateWish）管理
      const result = await createWish({
        contentHash,
        isAnonymous: !isPublic
      });
      console.log('[solji] Wish submitted successfully:', result, ipfs);
      toast.success(`wish submitted successfully! get ${result.wishId} wish NFT`);
      if (result.amuletDropped) {
        toast.success('congratulations! you got amulet!');
      }
      setWishesCount(wishesCount + 1);
      setWishText('');
      await loadWishes();
    } catch (err: any) {
      setIpfsLoading(false);
      console.error('[solji] Wish submission failed:', err);
      toast.error(err.message || 'wish submission failed');
    }
  };

  const handleLikeWish = async (wishId: number) => {
    if (liking) return;
    setLiking(wishId);
    try {
      await likeWish(wishId, publicKey?.toString());
      await loadWishes();
    } catch (e) {
      toast.error('like failed');
    } finally {
      setLiking(null);
    }
  };

  // 格式化时间显示
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const isSameDay = (dateString: string, referenceDate: Date) => {
    const date = new Date(dateString);
    return (
      date.getFullYear() === referenceDate.getFullYear() &&
      date.getMonth() === referenceDate.getMonth() &&
      date.getDate() === referenceDate.getDate()
    );
  };

  // 缩短用户公钥显示
  const shortKey = (pubkey: string) => {
    return pubkey ? `${pubkey.slice(0, 4)}...${pubkey.slice(-4)}` : '';
  };

  const hasWallet = connected && Boolean(userPubkey);
  const myWishes = hasWallet
    ? wishes.filter((wish) => wish.user_pubkey === userPubkey)
    : [];
  const sortedMyWishes = hasWallet
    ? [...myWishes].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    : [];
  const hasUserWishes = sortedMyWishes.length > 0;
  const displayMyWishes = hasUserWishes ? sortedMyWishes : mockMyWishes;
  const showConnectNotice = !hasWallet;
  const showMockNotice = !hasUserWishes;

  const remainingFreeWishes = Math.max(0, maxFreeWishes - wishesCount);
  const characterCount = wishText.length;
  const maxCharacters = 200;

  return (
    <div className='container mx-auto px-4 py-8 max-w-6xl'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-3'>
          <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center'>
            <Heart className='w-6 h-6 text-pink-500' />
          </div>
          <div>
            <h1 className='text-3xl font-bold'>Wish Hall</h1>
            <p className='text-muted-foreground'>
              Write your wishes on digital Ema plaques
            </p>
          </div>
        </div>

        <Card className='temple-card p-4'>
          <div className='flex items-start gap-3'>
            <Info className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
            <div className='text-sm text-muted-foreground leading-relaxed'>
              <p>
                Make 3 free wishes per day. Additional wishes cost 5 merit
                points. Each wish is minted as an NFT and earns you +1 merit
                point. Share your wish to social media for +1 bonus merit point.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className='grid lg:grid-cols-2 gap-8'>
        {/* Make a Wish Form */}
        <div className='space-y-6'>
          <Card className='temple-card p-6'>
            <h2 className='text-xl font-semibold mb-4'>Make a Wish</h2>

            <div className='space-y-4'>
              {/* Wish Text */}
              <div className='space-y-2'>
                <Label htmlFor='wish-text'>Your Wish</Label>
                <Textarea
                  id='wish-text'
                  placeholder='Write your wish here... (max 200 characters)'
                  value={wishText}
                  onChange={(e) =>
                    setWishText(e.target.value.slice(0, maxCharacters))
                  }
                  className='min-h-32 resize-none'
                />
                <div className='flex items-center justify-between text-xs text-muted-foreground'>
                  <span>
                    {remainingFreeWishes > 0
                      ? `${remainingFreeWishes} free wishes remaining today`
                      : 'Additional wishes cost 5 merit points'}
                  </span>
                  <span
                    className={
                      characterCount > maxCharacters * 0.9
                        ? 'text-orange-500'
                        : ''
                    }>
                    {characterCount}/{maxCharacters}
                  </span>
                </div>
              </div>

              {/* Privacy Toggle */}
              <div className='flex items-center justify-between p-4 rounded-lg bg-muted/50'>
                <div className='flex items-center gap-3'>
                  {isPublic ? (
                    <Globe className='w-5 h-5 text-primary' />
                  ) : (
                    <Lock className='w-5 h-5 text-muted-foreground' />
                  )}
                  <div>
                    <Label htmlFor='public-wish' className='cursor-pointer'>
                      {isPublic ? 'Public Wish' : 'Anonymous Wish'}
                    </Label>
                    <p className='text-xs text-muted-foreground'>
                      {isPublic
                        ? 'Visible to all believers'
                        : 'Only you can see this wish'}
                    </p>
                  </div>
                </div>
                <Switch
                  id='public-wish'
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                />
              </div>

              {/* Rewards Info */}
              <div className='p-4 rounded-lg bg-primary/5 border border-primary/20'>
                <div className='flex items-start gap-3'>
                  <Sparkles className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                  <div className='text-sm'>
                    <p className='font-semibold mb-1'>Rewards</p>
                    <ul className='text-muted-foreground space-y-1'>
                      <li>• +1 merit point for making a wish</li>
                      <li>• Wish minted as NFT on Solana&BSC</li>
                      <li>• +1 bonus merit for sharing</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmitWish}
                disabled={!wishText.trim() || isLoading || !connected || ipfsLoading}
                className='w-full'
                size='lg'>
                {(ipfsLoading || isLoading) ? (
                  <>
                    <Heart className='w-5 h-5 mr-2 animate-pulse' />
                    {ipfsLoading ? 'Uploading to IPFS...' : 'Minting Wish NFT...'}
                  </>
                ) : !connected ? (
                  <>
                    <Heart className='w-5 h-5 mr-2' />
                    Connect Wallet First
                  </>
                ) : (
                  <>
                    <Heart className='w-5 h-5 mr-2' />
                    {remainingFreeWishes > 0
                      ? 'Make Wish (Free)'
                      : 'Make Wish (5 Merit)'}
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Ema Plaque Preview */}
          <Card className='temple-card p-6 bg-gradient-to-br from-pink-500/10 to-rose-500/10'>
            <h3 className='text-sm font-semibold mb-3'>Ema Plaque Preview</h3>
            <div className='aspect-[4/3] rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 p-6 flex flex-col justify-between border-2 border-amber-300/50 dark:border-amber-700/50'>
              <div className='text-center'>
                <div className='w-8 h-8 rounded-full bg-red-500/20 mx-auto mb-2' />
                <p className='text-xs text-muted-foreground'>
                  Solji Wish Plaque
                </p>
              </div>
              <div className='flex-1 flex items-center justify-center'>
                <p className='text-sm text-center text-balance leading-relaxed text-foreground/80'>
                  {wishText || 'Your wish will appear here...'}
                </p>
              </div>
              <div className='text-center'>
                <p className='text-xs text-muted-foreground'>
                  {isPublic ? 'Public' : 'Anonymous'} •{' '}
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Public Wishes Wall */}
        <div className='space-y-6'>
          <Card className='temple-card p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold'>Public Wishes</h2>
              <div className='flex items-center gap-2'>
                <Badge variant='secondary'>
                  <Globe className='w-3 h-3 mr-1' />
                  {totalWishesCount.toLocaleString()} wishes
                </Badge>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={loadWishes}
                  disabled={wishesLoading}
                >
                  <RefreshCw className={`w-3 h-3 mr-1 ${wishesLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>

            {wishesLoading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin mr-2" />
                <span>Loading wishes...</span>
              </div>
            ) : wishes.length > 0 ? (
              <div className='space-y-3 max-h-[600px] overflow-y-auto'>
                {wishes.map((wish) => (
                  <Card
                    key={wish.id}
                    className='p-4 bg-muted/30 hover:bg-muted/50 transition-colors'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <span className='text-xs font-medium text-muted-foreground'>
                          {shortKey(wish.user_pubkey)}
                        </span>
                        <span className='text-xs text-muted-foreground'>
                          {formatTimeAgo(wish.created_at)}
                        </span>
                      </div>
                      <p className='text-sm leading-relaxed truncate'>{wish.content}</p>
                      <div className='flex items-center justify-between pt-2'>
                        <div className='flex items-center gap-2'>
                          <button
                            disabled={liking === wish.wish_id || wishesLoading || wish.is_liked}
                            onClick={() => { if (!wish.is_liked) handleLikeWish(wish.wish_id); }}
                            className={`group flex items-center px-2 py-1 rounded transition-colors ${(liking === wish.wish_id || wish.is_liked) ? 'opacity-70 pointer-events-none' : ''}`}
                            aria-label='like'
                            aria-disabled={wish.is_liked}
                          >
                            <Heart
                              className={`w-4 h-4 ${(liking === wish.wish_id) ? 'animate-pulse text-pink-500' : 'text-pink-500 group-hover:scale-110'}`}
                              fill={wish.is_liked ? 'currentColor' : 'none'}
                            />
                            <span className='ml-1 text-xs text-muted-foreground'>{wish.likes} likes</span>
                          </button>
                        </div>
                        <Badge variant='secondary' className='text-xs'>
                          <Share2 className='w-3 h-3 mr-1' />
                          Shared
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No wishes yet</p>
                <p className="text-sm">Be the first to make a wish!</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* My Wishes */}
      <div className='mt-12'>
        <h2 className='text-2xl font-bold mb-6'>My Wishes</h2>
        <Card className='temple-card p-8'>
          {wishesLoading && hasWallet ? (
            <div className='flex items-center justify-center gap-2 text-muted-foreground'>
              <RefreshCw className='w-5 h-5 animate-spin' />
              <span className='text-sm'>Loading your wishes...</span>
            </div>
          ) : (
            <div className='space-y-4'>
              {showConnectNotice && (
                <div className='text-center text-sm text-muted-foreground'>
                  Connect your wallet to view your on-chain wishes. Showing demo
                  wishes below.
                </div>
              )}
              {!showConnectNotice && showMockNotice && (
                <div className='text-center text-sm text-muted-foreground'>
                  You have not minted any wishes yet. Showing demo wishes for
                  preview.
                </div>
              )}
              {displayMyWishes.map((wish) => (
                <div
                  key={`${wish.id}-${wish.created_at}`}
                  className='rounded-lg border border-border/50 bg-muted/30 p-4'>
                  <div className='flex items-start justify-between gap-4'>
                    <div className='space-y-2'>
                      <p className='text-sm leading-relaxed whitespace-pre-wrap break-words'>
                        {wish.content}
                      </p>
                      <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                        <span>Minted {formatTimeAgo(wish.created_at)}</span>
                        <span className='flex items-center gap-1'>
                          <Heart className='w-3 h-3 text-pink-500' />
                          {wish.likes} likes
                        </span>
                      </div>
                    </div>
                    <Badge variant='secondary' className='shrink-0'>
                      #{wish.wish_id}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
