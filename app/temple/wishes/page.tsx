'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Globe, Heart, Info, Lock, Share2, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useCreateWish, generateWishId } from '@/hooks/use-create-wish';
import { usePublicWishes } from '@/hooks/use-public-wishes';
import { useUserWishes } from '@/hooks/use-user-wishes';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';
import { saveWishContent } from '@/lib/api/temple';
import { cidToContentHash, contentHashToCid } from '@/lib/utils/cid-converter';

export default function WishesPage() {
  const [wishText, setWishText] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [wishesCount, setWishesCount] = useState(1);
  const maxFreeWishes = 3;

  const { publicKey, connected } = useWallet();
  const { createWish, loading, error, result, resetState } = useCreateWish();
  const { wishes, total, loading: wishesLoading, error: wishesError, hasMore, loadMore, refresh } = usePublicWishes(20);
  const { 
    wishes: myWishes, 
    total: myTotal, 
    loading: myWishesLoading, 
    error: myWishesError, 
    hasMore: myHasMore, 
    loadMore: myLoadMore, 
    refresh: myRefresh 
  } = useUserWishes(publicKey?.toBase58(), 10);

  const handleSubmitWish = async () => {
    if (!wishText.trim()) {
      toast.error('请输入许愿内容');
      return;
    }
    if (!connected || !publicKey) {
      toast.error('请先连接钱包');
      return;
    }

    try {
      console.log('[solji] 开始许愿:', { text: wishText, isPublic });

      // 1. 生成许愿 ID（使用时间戳）
      const wishId = generateWishId();
      console.log('[solji] 生成许愿 ID:', wishId);

      // 2. 先保存心愿内容到 IPFS
      toast.loading('正在保存心愿内容到 IPFS...', { id: 'save-wish' });
      const ipfsResult = await saveWishContent({
        wish_id: wishId,
        content: wishText,
        user_address: publicKey.toBase58(),
        metadata: {
          is_public: isPublic.toString(),
          timestamp: new Date().toISOString(),
        },
      });
      console.log('[solji] IPFS 保存成功:', ipfsResult);
      toast.success('心愿内容已保存到 IPFS', { id: 'save-wish' });

      // 3. 从 IPFS CID 提取 32 字节哈希（可逆转换）
      const contentHash = cidToContentHash(ipfsResult.cid);
      console.log('[solji] 从 CID 提取哈希:', {
        cid: ipfsResult.cid,
        hash: contentHash.slice(0, 8),
        hashLength: contentHash.length
      });
      
      // 验证：可以从哈希重建 CID
      const rebuiltCid = contentHashToCid(contentHash);
      console.log('[solji] 验证 CID 转换:', {
        original: ipfsResult.cid,
        rebuilt: rebuiltCid,
        match: rebuiltCid === ipfsResult.cid
      });

      // 4. 执行链上许愿
      toast.loading('正在提交到区块链...', { id: 'submit-wish' });
      const result = await createWish({
        wishId,
        contentHash,
        isAnonymous: !isPublic
      });

      console.log('[solji] 许愿成功:', result);
      toast.dismiss('submit-wish');

      // 显示成功消息
      if (result.isFreewish) {
        toast.success(`✨ 免费许愿成功！获得 +${result.rewardKarmaPoints} 功德`);
      } else {
        toast.success(`✨ 许愿成功！消耗 ${result.reduceKarmaPoints} 功德，获得 +${result.rewardKarmaPoints} 功德`);
      }

      // 检查御守掉落
      if (result.isAmuletDropped) {
        toast.success('🎉 恭喜！许愿时获得了御守铸造机会！');
      }

      // 更新状态
      setWishesCount(wishesCount + 1);
      setWishText('');
      
      // 刷新用户心愿列表
      myRefresh();

    } catch (err: any) {
      console.error('[solji] 许愿失败:', err);
      
      // 特殊处理用户未初始化错误
      if (err.code === 'USER_NOT_INITIALIZED') {
        toast.error('请先进行烧香或抽签操作来初始化您的账户', {
          description: '初始化后即可许愿',
          duration: 5000,
        });
      } else {
        toast.error(err.message || '许愿失败');
      }
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
                disabled={!wishText.trim() || loading || !connected}
                className='w-full'
                size='lg'>
                {loading ? (
                  <>
                    <Heart className='w-5 h-5 mr-2 animate-pulse' />
                    许愿中...
                  </>
                ) : !connected ? (
                  <>
                    <Heart className='w-5 h-5 mr-2' />
                    请先连接钱包
                  </>
                ) : (
                  <>
                    <Heart className='w-5 h-5 mr-2' />
                    {remainingFreeWishes > 0
                      ? '许愿 (免费)'
                      : '许愿 (消耗 5 功德)'}
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
        <div className='space-y-6' id='public-wishes'>
          <Card className='temple-card p-6'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl font-semibold'>Public Wishes</h2>
              <div className='flex items-center gap-2'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={refresh}
                  disabled={wishesLoading}>
                  <RefreshCw className={`w-4 h-4 ${wishesLoading ? 'animate-spin' : ''}`} />
                </Button>
                <Badge variant='secondary'>
                  <Globe className='w-3 h-3 mr-1' />
                  {total.toLocaleString()} wishes
                </Badge>
              </div>
            </div>

            {/* Error State */}
            {wishesError && (
              <div className='p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm'>
                {wishesError}
              </div>
            )}

            {/* Loading State */}
            {wishesLoading && wishes.length === 0 && (
              <div className='flex items-center justify-center py-12'>
                <Loader2 className='w-8 h-8 animate-spin text-muted-foreground' />
              </div>
            )}

            {/* Wishes List */}
            {!wishesLoading && wishes.length === 0 && !wishesError && (
              <div className='text-center py-12 text-muted-foreground'>
                <Heart className='w-12 h-12 mx-auto mb-3 opacity-50' />
                <p>还没有公开的心愿</p>
              </div>
            )}

            <div className='space-y-3 max-h-[600px] overflow-y-auto'>
              {wishes.map((wish) => (
                <Card
                  key={wish.wish_id}
                  className='p-4 bg-muted/30 hover:bg-muted/50 transition-colors'>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-xs font-medium text-muted-foreground'>
                        {wish.is_anonymous ? 'Anonymous' : wish.user_address}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        {wish.synced_at}
                      </span>
                    </div>
                    <p className='text-sm leading-relaxed break-words'>
                      {wish.wish_content}
                    </p>
                    <div className='flex items-center justify-between pt-2'>
                      <div className='flex items-center gap-2'>
                        <Heart className='w-4 h-4 text-pink-500' />
                        <span className='text-xs text-muted-foreground'>
                          {wish.total_likes} likes
                        </span>
                      </div>
                      <span className='text-xs text-muted-foreground'>
                        {wish.create_at}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Load More Button */}
              {hasMore && (
                <div className='flex justify-center pt-4'>
                  <Button
                    variant='outline'
                    onClick={loadMore}
                    disabled={wishesLoading}>
                    {wishesLoading ? (
                      <>
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                        加载中...
                      </>
                    ) : (
                      '加载更多'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* My Wishes */}
      <div className='mt-12' id='my-wishes'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold'>My Wishes</h2>
          {connected && myWishes.length > 0 && (
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='sm'
                onClick={myRefresh}
                disabled={myWishesLoading}>
                <RefreshCw className={`w-4 h-4 ${myWishesLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Badge variant='secondary'>
                {myTotal} {myTotal === 1 ? 'wish' : 'wishes'}
              </Badge>
            </div>
          )}
        </div>

        {/* Not Connected State */}
        {!connected && (
          <Card className='temple-card p-8 text-center'>
            <div className='max-w-md mx-auto space-y-4'>
              <div className='w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center'>
                <Lock className='w-8 h-8 text-muted-foreground' />
              </div>
              <div>
                <h3 className='text-lg font-semibold mb-2'>Connect Wallet</h3>
                <p className='text-sm text-muted-foreground leading-relaxed'>
                  Connect your wallet to view your wishes.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Loading State */}
        {connected && myWishesLoading && myWishes.length === 0 && (
          <Card className='temple-card p-8'>
            <div className='flex items-center justify-center py-8'>
              <Loader2 className='w-8 h-8 animate-spin text-muted-foreground' />
            </div>
          </Card>
        )}

        {/* Error State */}
        {connected && myWishesError && (
          <Card className='temple-card p-8'>
            <div className='p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center'>
              {myWishesError}
            </div>
          </Card>
        )}

        {/* Empty State */}
        {connected && !myWishesLoading && myWishes.length === 0 && !myWishesError && (
          <Card className='temple-card p-8 text-center'>
            <div className='max-w-md mx-auto space-y-4'>
              <div className='w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center'>
                <Heart className='w-8 h-8 text-muted-foreground' />
              </div>
              <div>
                <h3 className='text-lg font-semibold mb-2'>No Wishes Yet</h3>
                <p className='text-sm text-muted-foreground leading-relaxed'>
                  Make your first wish to start your collection of Ema plaque NFTs.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Wishes Grid */}
        {connected && myWishes.length > 0 && (
          <div className='space-y-4'>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {myWishes.map((wish) => (
                <Card
                  key={wish.wish_id}
                  className='temple-card p-6 hover:shadow-lg transition-shadow'>
                  <div className='space-y-4'>
                    {/* Wish Header */}
                    <div className='flex items-center justify-between'>
                      <Badge variant={wish.is_anonymous ? 'secondary' : 'default'}>
                        {wish.is_anonymous ? (
                          <>
                            <Lock className='w-3 h-3 mr-1' />
                            Anonymous
                          </>
                        ) : (
                          <>
                            <Globe className='w-3 h-3 mr-1' />
                            Public
                          </>
                        )}
                      </Badge>
                      <span className='text-xs text-muted-foreground'>
                        #{wish.wish_id}
                      </span>
                    </div>

                    {/* Wish Content */}
                    <div className='min-h-[80px]'>
                      <p className='text-sm leading-relaxed break-words'>
                        {wish.wish_content}
                      </p>
                    </div>

                    {/* Wish Footer */}
                    <div className='pt-4 border-t space-y-2'>
                      <div className='flex items-center justify-between text-xs text-muted-foreground'>
                        <div className='flex items-center gap-2'>
                          <Heart className='w-4 h-4 text-pink-500' />
                          <span>{wish.total_likes} likes</span>
                        </div>
                        <span>{wish.synced_at}</span>
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        {wish.create_at}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {myHasMore && (
              <div className='flex justify-center pt-4'>
                <Button
                  variant='outline'
                  onClick={myLoadMore}
                  disabled={myWishesLoading}>
                  {myWishesLoading ? (
                    <>
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      加载中...
                    </>
                  ) : (
                    '加载更多'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
