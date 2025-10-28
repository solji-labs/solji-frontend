'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Globe, Heart, Info, Lock, Share2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useCreateWish } from '@/hooks/use-create-wish';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';

export default function WishesPage() {
  const [wishText, setWishText] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [wishesCount, setWishesCount] = useState(1);
  const maxFreeWishes = 3;

  const { wallet, connected } = useWallet();
  const { createWish, isLoading, error, clearError } = useCreateWish();

  const handleSubmitWish = async () => {
    if (!wishText.trim()) return;
    if (!connected) {
      toast.error('请先连接钱包');
      return;
    }

    try {
      console.log('[solji] Submitting wish:', { text: wishText, isPublic });

      // 生成内容哈希 (简化版本，实际应该上传到IPFS)
      const contentHash = Array.from({ length: 32 }, (_, i) =>
        wishText.charCodeAt(i % wishText.length) % 256
      );

      const result = await createWish({
        contentHash,
        isAnonymous: !isPublic
      });

      console.log('[solji] Wish submitted successfully:', result);

      toast.success(`许愿成功！获得 ${result.wishId} 号许愿NFT`);

      if (result.amuletDropped) {
        toast.success('恭喜！获得了护符！');
      }

      setWishesCount(wishesCount + 1);
      setWishText('');

    } catch (err: any) {
      console.error('[solji] Wish submission failed:', err);
      toast.error(err.message || '许愿失败');
    }
  };

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
                disabled={!wishText.trim() || isLoading || !connected}
                className='w-full'
                size='lg'>
                {isLoading ? (
                  <>
                    <Heart className='w-5 h-5 mr-2 animate-pulse' />
                    Minting Wish NFT...
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
              <Badge variant='secondary'>
                <Globe className='w-3 h-3 mr-1' />
                15,432 wishes
              </Badge>
            </div>

            <div className='space-y-3 max-h-[600px] overflow-y-auto'>
              {[
                {
                  user: '0x7a3b...4f2c',
                  wish: 'May my family be healthy and happy always',
                  time: '2 min ago',
                  shared: true
                },
                {
                  user: '0x9d1e...8a6b',
                  wish: 'Wishing for success in my new business venture',
                  time: '5 min ago',
                  shared: false
                },
                {
                  user: '0x4c2f...1d9e',
                  wish: 'May I find true love this year',
                  time: '8 min ago',
                  shared: true
                },
                {
                  user: '0x6b8a...3e7c',
                  wish: 'Hoping for world peace and harmony',
                  time: '12 min ago',
                  shared: true
                },
                {
                  user: '0x2e5d...9f1a',
                  wish: 'May my crypto portfolio moon to the stars',
                  time: '15 min ago',
                  shared: false
                },
                {
                  user: '0x8f3c...6d2b',
                  wish: 'Wishing for good health for my parents',
                  time: '18 min ago',
                  shared: true
                }
              ].map((wish, i) => (
                <Card
                  key={i}
                  className='p-4 bg-muted/30 hover:bg-muted/50 transition-colors'>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-xs font-medium text-muted-foreground'>
                        {wish.user}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        {wish.time}
                      </span>
                    </div>
                    <p className='text-sm leading-relaxed'>{wish.wish}</p>
                    <div className='flex items-center justify-between pt-2'>
                      <div className='flex items-center gap-2'>
                        <Heart className='w-4 h-4 text-pink-500' />
                        <span className='text-xs text-muted-foreground'>
                          {Math.floor(Math.random() * 50) + 5} likes
                        </span>
                      </div>
                      {wish.shared && (
                        <Badge variant='secondary' className='text-xs'>
                          <Share2 className='w-3 h-3 mr-1' />
                          Shared
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* My Wishes */}
      <div className='mt-12'>
        <h2 className='text-2xl font-bold mb-6'>My Wishes</h2>
        <Card className='temple-card p-8 text-center'>
          <div className='max-w-md mx-auto space-y-4'>
            <div className='w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center'>
              <Heart className='w-8 h-8 text-muted-foreground' />
            </div>
            <div>
              <h3 className='text-lg font-semibold mb-2'>No Wishes Yet</h3>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                Make your first wish to start your collection of Ema plaque
                NFTs.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
