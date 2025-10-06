'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BUDDHA_STATUES } from '@/lib/constants';
import { Check, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function BuddhaStatuePage() {
  const [selectedBuddha, setSelectedBuddha] = useState<string | null>(
    'guanyin'
  );
  const [isMinting, setIsMinting] = useState(false);

  const handleSelectBuddha = async (buddhaId: string) => {
    setIsMinting(true);
    // Simulate minting process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setSelectedBuddha(buddhaId);
    setIsMinting(false);
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-7xl'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-4xl font-bold mb-2'>Buddha Statue NFT</h1>
        <p className='text-muted-foreground'>
          Choose your spiritual guardian - a soulbound NFT that grants special
          abilities
        </p>
      </div>

      {/* Info Card */}
      <Card className='temple-card p-6 mb-8'>
        <div className='flex items-start gap-4'>
          <div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0'>
            <Sparkles className='w-6 h-6 text-primary' />
          </div>
          <div className='space-y-2'>
            <h3 className='text-lg font-semibold'>About Buddha Statue NFTs</h3>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              Buddha Statue NFTs are <strong>Soulbound Tokens (SBT)</strong>{' '}
              that represent your spiritual identity in Solji. Each statue
              grants unique abilities that enhance your temple experience. You
              can only hold one Buddha Statue at a time, and it cannot be
              transferred or sold - it's bound to your soul (wallet) forever.
            </p>
            <div className='flex items-center gap-2 text-sm'>
              <Badge variant='outline'>Limited to 10,000</Badge>
              <Badge variant='outline'>Soulbound (Non-transferable)</Badge>
              <Badge variant='outline'>Free to Mint</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Buddha Selection Grid */}
      <div className='grid md:grid-cols-2 gap-6'>
        {BUDDHA_STATUES.map((buddha) => (
          <Card
            key={buddha.id}
            className={`temple-card p-6 cursor-pointer transition-all ${
              selectedBuddha === buddha.id
                ? 'ring-2 ring-primary shadow-lg shadow-primary/20'
                : 'hover:shadow-lg'
            }`}
            onClick={() => !isMinting && handleSelectBuddha(buddha.id)}>
            <div className='flex items-start gap-6'>
              {/* Buddha Image */}
              <div className='relative'>
                <div className='w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-7xl'>
                  {buddha.image}
                </div>
                {selectedBuddha === buddha.id && (
                  <div className='absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center'>
                    <Check className='w-5 h-5 text-primary-foreground' />
                  </div>
                )}
              </div>

              {/* Buddha Info */}
              <div className='flex-1 space-y-3'>
                <div>
                  <h3 className='text-2xl font-bold mb-1'>{buddha.name}</h3>
                  <p className='text-lg text-muted-foreground'>
                    {buddha.nameZh}
                  </p>
                </div>

                <p className='text-sm text-muted-foreground leading-relaxed'>
                  {buddha.description}
                </p>

                <div className='pt-3 border-t border-border'>
                  <div className='flex items-start gap-2'>
                    <Sparkles className='w-4 h-4 text-primary mt-0.5 flex-shrink-0' />
                    <div>
                      <p className='text-xs text-muted-foreground mb-1'>
                        Special Ability
                      </p>
                      <p className='text-sm font-semibold text-primary'>
                        {buddha.specialAbility}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedBuddha === buddha.id && (
                  <Badge className='bg-primary/10 text-primary hover:bg-primary/20'>
                    Currently Selected
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Action Button */}
      <div className='mt-8 flex justify-center'>
        <Card className='temple-card p-6 max-w-md w-full'>
          <div className='text-center space-y-4'>
            <h3 className='text-lg font-semibold'>
              {selectedBuddha
                ? 'Change Your Buddha Statue'
                : 'Select Your Buddha Statue'}
            </h3>
            <p className='text-sm text-muted-foreground'>
              {selectedBuddha
                ? 'You can change your Buddha Statue at any time. Your previous statue will be replaced.'
                : 'Choose a Buddha Statue to begin your spiritual journey in Solji.'}
            </p>
            <Button
              size='lg'
              className='w-full'
              disabled={!selectedBuddha || isMinting}
              onClick={() =>
                selectedBuddha && handleSelectBuddha(selectedBuddha)
              }>
              {isMinting ? (
                <>
                  <Sparkles className='w-4 h-4 mr-2 animate-spin' />
                  Minting Buddha Statue NFT...
                </>
              ) : selectedBuddha ? (
                'Confirm Selection'
              ) : (
                'Select a Buddha Statue'
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
