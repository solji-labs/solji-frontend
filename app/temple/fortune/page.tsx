'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FORTUNE_LEVELS } from '@/lib/constants';
import type { FortuneLevel } from '@/lib/types';
import { Info, RefreshCw, ScrollText, Share2, Sparkles, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useDrawFortune } from '@/hooks/use-draw-fortune';
import { useWallet } from '@solana/wallet-adapter-react';
import { getUserFortune, type FortuneRecord } from '@/lib/api/temple';
import { toast } from 'sonner';

const FORTUNE_TEXTS: Record<FortuneLevel, string[]> = {
  大吉: [
    'Great fortune awaits you. Your endeavors will flourish beyond expectations.',
    'The stars align in your favor. Success follows your every step.',
    'Abundance flows to you like a mighty river. Embrace the opportunities ahead.'
  ],
  中吉: [
    'Good fortune smiles upon you. Your efforts will be rewarded.',
    'Positive energy surrounds you. Trust in your path forward.',
    'Harmony and prosperity are within reach. Stay focused on your goals.'
  ],
  小吉: [
    'Small blessings come your way. Appreciate the little joys in life.',
    'Gentle winds of fortune blow in your direction. Be patient and persistent.',
    'Modest gains lead to greater things. Keep moving forward steadily.'
  ],
  吉: [
    'Fortune favors the prepared. Your hard work will pay off.',
    'Balance and stability guide your journey. Trust the process.',
    'Opportunities arise from unexpected places. Stay open and alert.'
  ],
  末吉: [
    'Minor fortune comes with patience. Good things take time.',
    "Small steps lead to big changes. Don't rush your journey.",
    'Subtle blessings surround you. Look closely to find them.'
  ],
  凶: [
    'Challenges test your resolve. Face them with courage and wisdom.',
    'Difficult times are temporary. Your strength will see you through.',
    'Obstacles appear on your path. Learn from them and grow stronger.'
  ],
  大凶: [
    'Great trials await, but they bring great lessons. Stay strong and vigilant.',
    'Dark clouds gather, but remember: storms always pass. Hold firm to your values.',
    'Adversity strikes hard, yet it forges the strongest spirits. Do not lose hope.'
  ]
};

export default function FortunePage() {
  const [selectedLevel, setSelectedLevel] = useState<FortuneLevel | null>(null);
  const [fortuneText, setFortuneText] = useState<string>('');
  const [fortuneHistory, setFortuneHistory] = useState<FortuneRecord[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [hasDrawnToday, setHasDrawnToday] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [currentFortune, setCurrentFortune] = useState<{
    level: FortuneLevel;
    text: string;
    meritBonus: number;
  } | null>(null);

  const { publicKey, connected } = useWallet();
  const { drawFortune, loading, error, result, resetState } = useDrawFortune();

  // 获取用户运势历史记录
  useEffect(() => {
    async function fetchFortuneHistory() {
      if (!publicKey) {
        setFortuneHistory([]);
        return;
      }

      try {
        setIsLoadingHistory(true);
        const response = await getUserFortune(publicKey.toBase58(), 10, 1);
        setFortuneHistory(response.list);
      } catch (error) {
        console.error('获取运势历史失败:', error);
        // 不显示错误提示，静默失败
      } finally {
        setIsLoadingHistory(false);
      }
    }

    fetchFortuneHistory();
  }, [publicKey]);

  // 运势类型ID映射到运势等级
  const getFortuneLevel = (fortuneTypeId: number): FortuneLevel => {
    const fortuneMap: Record<number, FortuneLevel> = {
      0: '大吉',
      1: '中吉',
      2: '小吉',
      3: '吉',
      4: '末吉',
      5: '凶',
      6: '大凶'
    };
    return fortuneMap[fortuneTypeId] || '吉';
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // 重置状态当页面加载时
  useEffect(() => {
    resetState();
  }, [resetState]);

  const handleDrawFortune = async () => {
    if (!connected) {
      alert('请先连接钱包');
      return;
    }

    try {
      console.log('[solji] 开始抽签...');

      // 执行抽签（新版本不需要参数）
      const drawResult = await drawFortune();

      console.log('[solji] 抽签成功:', drawResult);
      console.log('[solji] 运势:', drawResult.fortuneText);
      console.log('[solji] 描述:', drawResult.fortuneDescription);
      console.log('[solji] 是否免费:', drawResult.isFreeDraw);

      // 将合约返回的运势结果映射到前端显示
      // FortuneType: GreatLuck, Lucky, Good, Normal, Nobad, Bad, VeryBad
      const fortuneMapping: Record<string, FortuneLevel> = {
        'GreatLuck': '大吉',
        'Lucky': '吉',
        'Good': '小吉',
        'Normal': '吉',
        'Nobad': '末吉',
        'Bad': '凶',
        'VeryBad': '大凶'
      };

      const fortuneLevel = fortuneMapping[drawResult.fortune] || '小吉';
      const selectedLevel = FORTUNE_LEVELS.find(level => level.level === fortuneLevel) || FORTUNE_LEVELS[2];
      
      // 使用合约返回的运势描述，如果没有则使用默认文本
      const fortuneText = drawResult.fortuneDescription || FORTUNE_TEXTS[fortuneLevel][0];

      const fortune = {
        level: fortuneLevel,
        text: fortuneText,
        meritBonus: drawResult.rewardKarmaPoints
      };

      setCurrentFortune(fortune);
      setHasDrawnToday(true);

      // 抽签成功后刷新历史记录
      if (publicKey) {
        try {
          const response = await getUserFortune(publicKey.toBase58(), 10, 1);
          setFortuneHistory(response.list);
        } catch (error) {
          console.error('刷新运势历史失败:', error);
        }
      }

    } catch (error: any) {
      console.error('[solji] 抽签失败:', error);
      // 错误已经在 hook 中处理，这里不需要额外处理
    }
  };

  const shareFortune = () => {
    console.log('[solji] Sharing fortune to social media');
    alert('Share to X (Twitter) to earn +1 merit point!');
  };

  const getFortuneColor = (level: FortuneLevel) => {
    if (level.includes('大吉') || level.includes('中吉'))
      return 'text-green-500';
    if (level.includes('小吉') || level === '吉') return 'text-blue-500';
    if (level.includes('末吉')) return 'text-yellow-500';
    if (level === '凶') return 'text-orange-500';
    return 'text-red-500';
  };

  const getFortuneGradient = (level: FortuneLevel) => {
    if (level.includes('大吉') || level.includes('中吉'))
      return 'from-green-500/20 to-emerald-500/20';
    if (level.includes('小吉') || level === '吉')
      return 'from-blue-500/20 to-cyan-500/20';
    if (level.includes('末吉')) return 'from-yellow-500/20 to-amber-500/20';
    if (level === '凶') return 'from-orange-500/20 to-red-500/20';
    return 'from-red-500/20 to-rose-500/20';
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-3'>
          <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center'>
            <ScrollText className='w-6 h-6 text-purple-500' />
          </div>
          <div>
            <h1 className='text-3xl font-bold'>Fortune Drawing</h1>
            <p className='text-muted-foreground'>
              Receive your daily fortune and guidance
            </p>
          </div>
        </div>

        <Card className='temple-card p-4'>
          <div className='flex items-start gap-3'>
            <Info className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
            <div className='text-sm text-muted-foreground leading-relaxed'>
              <p>
                Draw one free fortune per day. Additional draws cost 5 merit
                points. Each draw earns you 2 merit points (or 3 for rare
                fortunes). Share your fortune to social media for +1 bonus merit
                point.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Fortune Drawing Area */}
      {!currentFortune ? (
        <Card className='temple-card p-12'>
          <div className='text-center space-y-6'>
            <div className='w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 mx-auto flex items-center justify-center'>
              <ScrollText className='w-12 h-12 text-purple-500' />
            </div>

            <div>
              <h2 className='text-2xl font-bold mb-2'>Draw Your Fortune</h2>
              <p className='text-muted-foreground leading-relaxed'>
                {hasDrawnToday
                  ? "You've already drawn your free fortune today. Additional draws cost 5 merit points."
                  : 'Receive your daily fortune and discover what the universe has in store for you.'}
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className='flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700'>
                <AlertCircle className='w-4 h-4' />
                <span className='text-sm'>{error}</span>
              </div>
            )}

            <Button
              size='lg'
              onClick={handleDrawFortune}
              disabled={loading || !connected}
              className='px-8'>
              {loading ? (
                <>
                  <RefreshCw className='w-5 h-5 mr-2 animate-spin' />
                  Drawing Fortune...
                </>
              ) : (
                <>
                  <ScrollText className='w-5 h-5 mr-2' />
                  {hasDrawnToday ? 'Draw Again (5 Merit)' : 'Draw Free Fortune'}
                </>
              )}
            </Button>

            {/* Fortune Levels Reference */}
            <div className='pt-6 border-t border-border'>
              <h3 className='text-sm font-semibold mb-3'>Fortune Levels</h3>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
                {FORTUNE_LEVELS.map((level) => (
                  <div
                    key={level.level}
                    className='text-center p-2 rounded-lg bg-muted/50'>
                    <div
                      className={`text-sm font-semibold ${getFortuneColor(
                        level.level as FortuneLevel
                      )}`}>
                      {level.level}
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {level.nameEn}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card
          className={`temple-card p-8 bg-gradient-to-br ${getFortuneGradient(
            currentFortune.level
          )}`}>
          <div className='space-y-6'>
            {/* Fortune Level Badge */}
            <div className='flex items-center justify-center gap-3'>
              <Badge
                variant='secondary'
                className='text-lg px-4 py-2 bg-background/80 backdrop-blur-sm'>
                <span
                  className={`font-bold ${getFortuneColor(
                    currentFortune.level
                  )}`}>
                  {currentFortune.level}
                </span>
              </Badge>
              <Badge
                variant='secondary'
                className='px-3 py-1 bg-background/80 backdrop-blur-sm'>
                <Sparkles className='w-4 h-4 mr-1 text-primary' />+
                {currentFortune.meritBonus} Merit
              </Badge>
            </div>

            {/* Fortune Text */}
            <div className='text-center space-y-4'>
              <div className='w-16 h-16 rounded-full bg-background/50 backdrop-blur-sm mx-auto flex items-center justify-center'>
                <ScrollText className='w-8 h-8 text-primary' />
              </div>
              <p className='text-xl font-medium leading-relaxed text-balance'>
                {currentFortune.text}
              </p>
            </div>

            {/* AI Interpretation Placeholder */}
            <Card className='p-4 bg-background/50 backdrop-blur-sm'>
              <div className='flex items-start gap-3'>
                <Sparkles className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                <div className='text-sm leading-relaxed'>
                  <p className='font-semibold mb-1'>
                    AI Interpretation (Coming Soon)
                  </p>
                  <p className='text-muted-foreground'>
                    Personalized fortune interpretation powered by AI will be
                    available in Temple Level 4.
                  </p>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className='flex gap-3'>
              <Button
                variant='outline'
                onClick={shareFortune}
                className='flex-1 bg-background/50 backdrop-blur-sm'>
                <Share2 className='w-4 h-4 mr-2' />
                Share (+1 Merit)
              </Button>
              <Button
                onClick={async () => {
                  setCurrentFortune(null);
                  await handleDrawFortune();
                }}
                className='flex-1'
                disabled={loading}>
                <RefreshCw className='w-4 h-4 mr-2' />
                Draw Again (5 Merit)
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Fortune History */}
      <div className='mt-12' id='fortune-history'>
        <div className='flex items-center justify-between mb-6'>
          <h2 className='text-2xl font-bold'>运势历史</h2>
          {connected && fortuneHistory && (
            <Badge variant='outline' className='text-xs'>
              {fortuneHistory.length} 条记录
            </Badge>
          )}
        </div>

        {!connected ? (
          <Card className='temple-card p-8 text-center'>
            <AlertCircle className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
            <p className='text-muted-foreground'>请连接钱包查看您的运势历史</p>
          </Card>
        ) : isLoadingHistory || !fortuneHistory ? (
          <div className='space-y-3'>
            {[...Array(3)].map((_, i) => (
              <Card key={i} className='temple-card p-4 animate-pulse'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-lg bg-muted' />
                  <div className='flex-1 space-y-2'>
                    <div className='h-4 bg-muted rounded w-20' />
                    <div className='h-3 bg-muted rounded w-32' />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : fortuneHistory.length === 0 ? (
          <Card className='temple-card p-8 text-center'>
            <ScrollText className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
            <p className='text-muted-foreground mb-2'>暂无运势记录</p>
            <p className='text-xs text-muted-foreground'>抽取您的第一支签吧！</p>
          </Card>
        ) : (
          <div className='space-y-3'>
            {fortuneHistory.map((fortune, i) => {
              const level = getFortuneLevel(fortune.fortune_type_id);
              return (
                <Card key={i} className='temple-card p-4 hover:shadow-lg transition-shadow'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 rounded-lg bg-muted flex items-center justify-center'>
                        <ScrollText className='w-5 h-5 text-muted-foreground' />
                      </div>
                      <div>
                        <p className={`font-semibold ${getFortuneColor(level)}`}>
                          {level}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          {formatDate(fortune.created_at)}
                        </p>
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='text-xs text-muted-foreground'>
                        {fortune.fortune_content}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
