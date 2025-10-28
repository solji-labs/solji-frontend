'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletInfo } from '@/hooks/use-wallet';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';

export function WalletButton() {
    const { connected, publicKey, disconnect, wallet, connect, select, wallets } = useWallet();
    const { balance, loading } = useWalletInfo();
    const { setVisible } = useWalletModal();
    const [copied, setCopied] = useState(false);
    
    // 调试：显示可用的钱包
    useEffect(() => {
        console.log('📱 可用钱包列表:');
        wallets.forEach((w, index) => {
            console.log(`  ${index + 1}. ${w.adapter.name} - ${w.adapter.readyState}`);
        });
        
        // 检查是否有重复的钱包
        const walletNames = wallets.map(w => w.adapter.name);
        const duplicates = walletNames.filter((name, index) => walletNames.indexOf(name) !== index);
        if (duplicates.length > 0) {
            console.warn('⚠️ 检测到重复的钱包:', [...new Set(duplicates)]);
            console.log('💡 这是正常的，Standard Wallets 和手动适配器可能会重复注册');
        }
    }, [wallets]);

    // 当钱包被选择但未连接时，自动连接
    useEffect(() => {
        // 添加一个标志来防止重复连接
        let isConnecting = false;
        
        const attemptConnect = async () => {
            if (!wallet || connected || isConnecting) {
                return;
            }
            
            // 检查钱包是否已安装
            if (wallet.adapter.readyState === 'NotDetected') {
                console.error('❌ 钱包未安装！请先安装', wallet.adapter.name);
                return;
            }
            
            // 只在钱包准备好时才连接
            if (wallet.adapter.readyState !== 'Installed' && wallet.adapter.readyState !== 'Loadable') {
                console.log('⏳ 等待钱包准备就绪...', wallet.adapter.readyState);
                return;
            }
            
            isConnecting = true;
            console.log('🔍 钱包已选择:', wallet.adapter.name);
            console.log('🔍 钱包状态:', {
                readyState: wallet.adapter.readyState,
                connected: wallet.adapter.connected,
                publicKey: wallet.adapter.publicKey
            });
            console.log('⚠️ 提示：如果连接失败，请确保钱包插件中的网络设置与应用一致');
            
            try {
                await connect();
                console.log('✅ 连接成功！');
            } catch (error: any) {
                console.error('❌ 连接失败:', error);
                console.error('错误详情:', {
                    message: error.message,
                    code: error.code,
                    name: error.name
                });
                
                // 提示用户检查钱包网络设置
                if (error.message?.includes('User rejected')) {
                    console.log('👤 用户拒绝了连接请求');
                } else if (error.name === 'WalletNotReadyError') {
                    console.log('⏳ 钱包未准备好，请稍后重试');
                } else if (error.message?.includes('wallet')) {
                    console.log('💡 请检查钱包插件的网络设置是否正确');
                    console.log('💡 确保钱包已安装并已解锁');
                } else {
                    console.log('💡 未知错误，请刷新页面重试');
                }
            } finally {
                isConnecting = false;
            }
        };
        
        // 延迟执行以确保钱包状态已更新
        const timer = setTimeout(attemptConnect, 100);
        
        return () => {
            clearTimeout(timer);
            isConnecting = false;
        };
    }, [wallet, connected, connect]);

    const handleConnect = () => {
        console.log('🚀 打开钱包选择模态框...');
        console.log('📱 当前可用钱包数量:', wallets.length);
        if (wallets.length === 0) {
            console.warn('⚠️ 警告：没有检测到可用的钱包！');
            console.log('💡 请确保已安装 Phantom 或 Solflare 钱包插件');
        }
        setVisible(true);
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
