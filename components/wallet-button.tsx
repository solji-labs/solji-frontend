'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletActions, useWalletInfo } from '@/hooks/use-wallet';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export function WalletButton() {
    const { connected, publicKey } = useWallet();
    const { connect, disconnect } = useWalletActions();
    const { balance, loading } = useWalletInfo();
    const { setVisible } = useWalletModal();
    const [copied, setCopied] = useState(false);

    const handleConnect = async () => {
        try {
            setVisible(true);
        } catch (error) {
            console.error('打开钱包选择失败:', error);
        }
    };

    const handleDisconnect = async () => {
        try {
            await disconnect();
        } catch (error) {
            console.error('断开连接失败:', error);
        }
    };

    const handleCopyAddress = async () => {
        if (publicKey) {
            try {
                await navigator.clipboard.writeText(publicKey.toString());
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (error) {
                console.error('复制地址失败:', error);
            }
        }
    };

    if (!connected) {
        return (
            <Button onClick={handleConnect} className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Connect Wallet
            </Button>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">
                    {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
                </span>
                <span className="text-sm text-muted-foreground">
                    {loading ? '...' : `${balance.toFixed(4)} SOL`}
                </span>
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={handleCopyAddress}
                className="flex items-center gap-1"
            >
                {copied ? (
                    <Check className="w-3 h-3" />
                ) : (
                    <Copy className="w-3 h-3" />
                )}
            </Button>

            <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="flex items-center gap-1"
            >
                <LogOut className="w-3 h-3" />
            </Button>
        </div>
    );
}
