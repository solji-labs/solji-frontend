'use client';

import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useState } from 'react';

export function WalletButton() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string>('');

  const connectWallet = async () => {
    try {
      // Check if Phantom wallet is installed
      if ('solana' in window) {
        const provider = (window as any).solana;
        if (provider.isPhantom) {
          const response = await provider.connect();
          setAddress(response.publicKey.toString());
          setConnected(true);
          console.log(
            '[solji] Connected to wallet:',
            response.publicKey.toString()
          );
        }
      } else {
        // Fallback for demo purposes
        const demoAddress = 'Demo' + Math.random().toString(36).substring(2, 8);
        setAddress(demoAddress);
        setConnected(true);
        console.log('[solji] Demo wallet connected:', demoAddress);
      }
    } catch (error) {
      console.error('[solji] Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setAddress('');
    console.log('[solji] Wallet disconnected');
  };

  if (connected) {
    return (
      <Button variant='outline' onClick={disconnectWallet}>
        <Wallet className='w-4 h-4 mr-2' />
        {address.slice(0, 4)}...{address.slice(-4)}
      </Button>
    );
  }

  return (
    <Button onClick={connectWallet}>
      <Wallet className='w-4 h-4 mr-2' />
      Connect Wallet
    </Button>
  );
}
