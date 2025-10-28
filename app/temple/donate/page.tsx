'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DONATION_TIERS } from '@/lib/constants';
import type { DonationTier } from '@/lib/types';
import {
  Award,
  CheckCircle2,
  Crown,
  Info,
  Shield,
  Sparkles,
  Zap
} from 'lucide-react';
import { useState } from 'react';
import { useDonateFund, calculateDonationRewards } from '@/hooks/use-donate-fund';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'sonner';

const TIER_ICONS = {
  bronze: Award,
  silver: Shield,
  gold: Crown,
  supreme: Zap
};

const TIER_COLORS = {
  bronze: 'from-orange-500/20 to-amber-500/20',
  silver: 'from-gray-400/20 to-slate-400/20',
  gold: 'from-yellow-500/20 to-amber-500/20',
  supreme: 'from-purple-500/20 to-pink-500/20'
};

const TIER_TEXT_COLORS = {
  bronze: 'text-orange-500',
  silver: 'text-gray-400',
  gold: 'text-yellow-500',
  supreme: 'text-purple-500'
};

export default function DonatePage() {
  const [selectedTier, setSelectedTier] = useState<DonationTier | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [donated, setDonated] = useState(false);
  const [lastResult, setLastResult] = useState<any>(null);

  const { publicKey, connected } = useWallet();
  const { donateFund, loading, error, result, resetState } = useDonateFund();

  const handleDonate = async () => {
    if (!customAmount || !selectedTier) {
      toast.error('请输入捐赠金额');
      return;
    }

    if (!connected || !publicKey) {
      toast.error('请先连接钱包');
      return;
    }

    const amount = parseFloat(customAmount);
    if (amount < DONATION_TIERS[selectedTier].minAmount) {
      toast.error(`最低捐赠金额为 ${DONATION_TIERS[selectedTier].minAmount} SOL`);
      return;
    }

    try {
      console.log('[solji] 开始捐赠:', {
        tier: selectedTier,
        amount: customAmount
      });

      // 预览奖励
      const rewards = calculateDonationRewards(amount);
      console.log('[solji] 预计奖励:', rewards);

      // 执行捐赠
      const result = await donateFund({ amount });

      console.log('[solji] 捐赠成功:', result);

      // 显示成功消息
      toast.success(`✨ 捐赠成功！获得 +${result.rewardKarmaPoints} 功德 +${result.rewardIncenseValue} 香火值`);

      // 检查徽章 NFT
      if (result.donationState.hasMintedBadgeNft) {
        const level = result.donationState.donationLevel;
        toast.success(`🎖️ 徽章 NFT 已${result.donationState.totalDonationCount === 1 ? '铸造' : '升级'}！当前等级: ${level}`);
      }

      // 检查香火空投
      if (amount >= 5.0) {
        toast.success('🎁 恭喜！获得高级香型空投！');
      }

      setLastResult(result);
      setDonated(true);

      setTimeout(() => {
        setDonated(false);
        setSelectedTier(null);
        setCustomAmount('');
        resetState();
      }, 5000);

    } catch (err: any) {
      console.error('[solji] 捐赠失败:', err);
      toast.error(err.message || '捐赠失败');
    }
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-7xl'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center gap-3 mb-3'>
          <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center'>
            <Sparkles className='w-6 h-6 text-yellow-500' />
          </div>
          <div>
            <h1 className='text-3xl font-bold'>Support the Temple</h1>
            <p className='text-muted-foreground'>
              Donate to evolve the temple and earn special badges
            </p>
          </div>
        </div>

        <Card className='temple-card p-4'>
          <div className='flex items-start gap-3'>
            <Info className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
            <div className='text-sm text-muted-foreground leading-relaxed'>
              <p>
                Your donations help the temple evolve and unlock new features
                for the entire community. Each donation tier grants you a
                special upgradeable badge NFT and exclusive privileges.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Donation Tiers */}
      <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
        {(
          Object.entries(DONATION_TIERS) as [
            DonationTier,
            (typeof DONATION_TIERS)[DonationTier]
          ][]
        ).map(([tier, data]) => {
          const Icon = TIER_ICONS[tier];
          const isSelected = selectedTier === tier;

          return (
            <Card
              key={tier}
              className={`temple-card p-6 cursor-pointer transition-all ${
                isSelected ? 'ring-2 ring-primary scale-105' : ''
              }`}
              onClick={() => setSelectedTier(tier)}>
              <div className='space-y-4'>
                {/* Tier Icon & Name */}
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${TIER_COLORS[tier]} flex items-center justify-center`}>
                  <Icon className={`w-7 h-7 ${TIER_TEXT_COLORS[tier]}`} />
                </div>

                <div>
                  <h3 className='text-xl font-semibold mb-1'>{data.badge}</h3>
                  <p className='text-sm text-muted-foreground'>{data.name}</p>
                </div>

                {/* Amount & Merit */}
                <div className='space-y-2'>
                  <div className='flex items-center justify-between py-2 border-b border-border'>
                    <span className='text-sm text-muted-foreground'>
                      Min Amount
                    </span>
                    <span className='text-sm font-semibold'>
                      {data.minAmount} SOL
                    </span>
                  </div>
                  <div className='flex items-center justify-between py-2 border-b border-border'>
                    <span className='text-sm text-muted-foreground'>
                      Merit Points
                    </span>
                    <span className='text-sm font-semibold flex items-center gap-1'>
                      <Sparkles className='w-4 h-4 text-primary' />
                      {data.meritPoints.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Benefits */}
                <div className='space-y-2'>
                  <p className='text-xs font-semibold text-muted-foreground'>
                    Benefits:
                  </p>
                  <ul className='text-xs text-muted-foreground space-y-1'>
                    {data.benefits.map((benefit, i) => (
                      <li key={i} className='flex items-start gap-2'>
                        <CheckCircle2 className='w-3 h-3 text-primary mt-0.5 flex-shrink-0' />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Select Button */}
                <Button
                  variant={isSelected ? 'default' : 'outline'}
                  className='w-full'
                  size='sm'>
                  {isSelected ? 'Selected' : 'Select Tier'}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Donation Form */}
      {selectedTier && !donated && (
        <Card className='temple-card p-8 max-w-2xl mx-auto'>
          <h2 className='text-2xl font-semibold mb-6'>
            Complete Your Donation
          </h2>

          <div className='space-y-6'>
            {/* Selected Tier Summary */}
            <div className='p-4 rounded-lg bg-muted/50'>
              <div className='flex items-center justify-between mb-3'>
                <span className='text-sm font-semibold'>Selected Tier</span>
                <Badge variant='secondary'>
                  {DONATION_TIERS[selectedTier].badge}
                </Badge>
              </div>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <p className='text-muted-foreground'>Minimum Amount</p>
                  <p className='font-semibold'>
                    {DONATION_TIERS[selectedTier].minAmount} SOL
                  </p>
                </div>
                <div>
                  <p className='text-muted-foreground'>Merit Points</p>
                  <p className='font-semibold'>
                    {DONATION_TIERS[selectedTier].meritPoints.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Amount Input */}
            <div className='space-y-2'>
              <Label htmlFor='donation-amount'>Donation Amount (SOL)</Label>
              <Input
                id='donation-amount'
                type='number'
                placeholder={`Min: ${DONATION_TIERS[selectedTier].minAmount} SOL`}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                min={DONATION_TIERS[selectedTier].minAmount}
                step='0.01'
              />
              <p className='text-xs text-muted-foreground'>
                Enter an amount equal to or greater than the minimum for this
                tier
              </p>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-3'>
              <Button
                variant='outline'
                onClick={() => setSelectedTier(null)}
                className='flex-1'
                disabled={loading}>
                取消
              </Button>
              <Button
                onClick={handleDonate}
                className='flex-1'
                disabled={
                  loading ||
                  !connected ||
                  !customAmount ||
                  Number.parseFloat(customAmount) <
                    DONATION_TIERS[selectedTier].minAmount
                }>
                {loading ? (
                  <>
                    <Sparkles className='w-4 h-4 mr-2 animate-pulse' />
                    捐赠中...
                  </>
                ) : !connected ? (
                  <>
                    <Sparkles className='w-4 h-4 mr-2' />
                    请先连接钱包
                  </>
                ) : (
                  <>
                    <Sparkles className='w-4 h-4 mr-2' />
                    捐赠{' '}
                    {customAmount || DONATION_TIERS[selectedTier].minAmount} SOL
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Success Message */}
      {donated && (
        <Card className='temple-card p-8 max-w-2xl mx-auto'>
          <div className='text-center space-y-4'>
            <div className='w-16 h-16 rounded-full bg-green-500/20 mx-auto flex items-center justify-center'>
              <CheckCircle2 className='w-8 h-8 text-green-500' />
            </div>
            <div>
              <h3 className='text-2xl font-semibold mb-2'>
                感谢您的捐赠！
              </h3>
              <p className='text-muted-foreground leading-relaxed'>
                {lastResult?.donationState.hasMintedBadgeNft && (
                  <>
                    您的 {DONATION_TIERS[selectedTier!].badge} 徽章 NFT 已
                    {lastResult.donationState.totalDonationCount === 1 ? '铸造' : '升级'}！
                    <br />
                  </>
                )}
                获得{' '}
                <span className='font-semibold text-primary'>
                  +{lastResult?.rewardKarmaPoints || DONATION_TIERS[selectedTier!].meritPoints}{' '}
                  功德值
                </span>{' '}
                和{' '}
                <span className='font-semibold text-primary'>
                  +{lastResult?.rewardIncenseValue || 0}{' '}
                  香火值
                </span>
                {lastResult && parseFloat(customAmount) >= 5.0 && (
                  <>
                    <br />
                    <span className='font-semibold text-amber-500'>
                      🎁 额外获得高级香型空投！
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Honor Wall */}
      <div className='mt-12'>
        <h2 className='text-2xl font-bold mb-6'>Honor Wall</h2>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {[
            {
              user: '0x1a2b...3c4d',
              amount: 5.5,
              tier: 'supreme',
              date: '2025-01-05'
            },
            {
              user: '0x5e6f...7g8h',
              amount: 2.3,
              tier: 'gold',
              date: '2025-01-05'
            },
            {
              user: '0x9i0j...1k2l',
              amount: 1.8,
              tier: 'gold',
              date: '2025-01-04'
            },
            {
              user: '0x3m4n...5o6p',
              amount: 0.5,
              tier: 'silver',
              date: '2025-01-04'
            },
            {
              user: '0x7q8r...9s0t',
              amount: 0.3,
              tier: 'silver',
              date: '2025-01-03'
            },
            {
              user: '0x1u2v...3w4x',
              amount: 0.1,
              tier: 'bronze',
              date: '2025-01-03'
            }
          ].map((donation, i) => {
            const Icon = TIER_ICONS[donation.tier as DonationTier];
            return (
              <Card key={i} className='temple-card p-4'>
                <div className='flex items-center gap-3'>
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                      TIER_COLORS[donation.tier as DonationTier]
                    } flex items-center justify-center flex-shrink-0`}>
                    <Icon
                      className={`w-5 h-5 ${
                        TIER_TEXT_COLORS[donation.tier as DonationTier]
                      }`}
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-semibold truncate'>
                      {donation.user}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {donation.amount} SOL • {donation.date}
                    </p>
                  </div>
                  <Badge variant='secondary' className='text-xs'>
                    {DONATION_TIERS[donation.tier as DonationTier].badge}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
