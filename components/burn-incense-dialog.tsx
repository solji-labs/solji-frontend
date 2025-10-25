'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import type { IncenseType } from '@/lib/types';
import { CheckCircle2, Flame, Sparkles, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useBurnIncense } from '@/hooks/use-burn-incense';
import { useWallet } from '@solana/wallet-adapter-react';

interface BurnIncenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incense: IncenseType;
  onBurnSuccess?: () => void;
}

export function BurnIncenseDialog({
  open,
  onOpenChange,
  incense,
  onBurnSuccess
}: BurnIncenseDialogProps) {
  const [burned, setBurned] = useState(false);
  const { connected } = useWallet();
  const { loading, error, result, burnIncense, resetState } = useBurnIncense();

  // 重置状态当对话框关闭时
  useEffect(() => {
    if (!open) {
      setBurned(false);
      resetState();
    }
  }, [open, resetState]);

  const handleBurn = async () => {
    if (!connected) {
      alert('请先连接钱包');
      return;
    }

    try {
      console.log('[solji] Burning incense:', incense.name);

      // 将前端香类型映射到合约香类型ID
      const incenseIdMap: Record<string, number> = {
        'basic': 1,
        'sandalwood': 2,
        'dragon': 3,
        'supreme': 4,
      };

      const incenseId = incenseIdMap[incense.id] || 1;
      const amount = 1; // 每次烧一根香

      const burnResult = await burnIncense({
        incenseId,
        amount,
        hasMeritAmulet: true, // 暂时设为true，后续可以从用户状态获取
      });

      console.log('[solji] Incense burned successfully:', burnResult);
      setBurned(true);

      if (onBurnSuccess) {
        onBurnSuccess();
      }

      // Reset after showing success
      setTimeout(() => {
        setBurned(false);
        onOpenChange(false);
      }, 3000);
    } catch (error: any) {
      console.error('[solji] Burn incense failed:', error);
      // 错误已经在 hook 中处理，这里不需要额外处理
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        {!burned ? (
          <>
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <Flame className='w-5 h-5 text-orange-500' />
                Burn {incense.name}
              </DialogTitle>
              <DialogDescription>
                Offer this incense to earn merit points and mint an NFT
              </DialogDescription>
            </DialogHeader>

            <div className='space-y-6'>
              {/* Incense Preview */}
              <div className='relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-muted to-muted/50'>
                <Image
                  src={incense.image || '/placeholder.svg'}
                  alt={incense.name}
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, 400px'
                />
              </div>

              {/* Details */}
              <div className='space-y-3'>
                <div className='flex items-center justify-between py-2 border-b border-border'>
                  <span className='text-sm text-muted-foreground'>
                    Incense Type
                  </span>
                  <span className='text-sm font-medium'>{incense.nameEn}</span>
                </div>
                <div className='flex items-center justify-between py-2 border-b border-border'>
                  <span className='text-sm text-muted-foreground'>Cost</span>
                  <span className='text-sm font-medium'>
                    {incense.price} SOL
                  </span>
                </div>
                <div className='flex items-center justify-between py-2 border-b border-border'>
                  <span className='text-sm text-muted-foreground'>
                    Merit Points
                  </span>
                  <span className='text-sm font-medium flex items-center gap-1'>
                    <Sparkles className='w-4 h-4 text-primary' />+
                    {incense.meritPoints}
                  </span>
                </div>
                <div className='flex items-center justify-between py-2'>
                  <span className='text-sm text-muted-foreground'>
                    NFT Minted
                  </span>
                  <span className='text-sm font-medium'>Yes</span>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className='flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700'>
                  <AlertCircle className='w-4 h-4' />
                  <span className='text-sm'>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className='flex gap-3'>
                <Button
                  variant='outline'
                  onClick={() => onOpenChange(false)}
                  className='flex-1'
                  disabled={loading}>
                  Cancel
                </Button>
                <Button
                  onClick={handleBurn}
                  className='flex-1'
                  disabled={loading || !connected}>
                  {loading ? (
                    <>
                      <Flame className='w-4 h-4 mr-2 animate-pulse' />
                      Burning...
                    </>
                  ) : (
                    <>
                      <Flame className='w-4 h-4 mr-2' />
                      Burn Now
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className='py-8 text-center space-y-4'>
            <div className='w-16 h-16 rounded-full bg-green-500/20 mx-auto flex items-center justify-center'>
              <CheckCircle2 className='w-8 h-8 text-green-500' />
            </div>
            <div>
              <h3 className='text-xl font-semibold mb-2'>Incense Burned!</h3>
              <p className='text-sm text-muted-foreground'>
                You earned{' '}
                <span className='font-semibold text-primary'>
                  +{result?.meritPointsEarned || incense.meritPoints} merit points
                </span>{' '}
                and minted an Incense NFT
              </p>
              {result?.transactionSignature && (
                <p className='text-xs text-muted-foreground mt-2'>
                  Transaction: {result.transactionSignature.slice(0, 8)}...
                </p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
