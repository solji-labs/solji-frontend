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
import { CheckCircle2, Flame, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

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
  const [burning, setBurning] = useState(false);
  const [burned, setBurned] = useState(false);

  const handleBurn = async () => {
    setBurning(true);
    console.log('[solji] Burning incense:', incense.name);

    // Simulate burning transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(
      '[solji] Incense burned successfully, merit points earned:',
      incense.meritPoints
    );
    setBurning(false);
    setBurned(true);

    if (onBurnSuccess) {
      onBurnSuccess();
    }

    // Reset after showing success
    setTimeout(() => {
      setBurned(false);
      onOpenChange(false);
    }, 2000);
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

              {/* Action Buttons */}
              <div className='flex gap-3'>
                <Button
                  variant='outline'
                  onClick={() => onOpenChange(false)}
                  className='flex-1'
                  disabled={burning}>
                  Cancel
                </Button>
                <Button
                  onClick={handleBurn}
                  className='flex-1'
                  disabled={burning}>
                  {burning ? (
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
                  +{incense.meritPoints} merit points
                </span>{' '}
                and minted an Incense NFT
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
