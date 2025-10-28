'use client';

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestWalletPage() {
    const { wallets, wallet, connect, disconnect, connected, publicKey, select } = useWallet();
    const { connection } = useConnection();
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
        console.log(message);
    };

    useEffect(() => {
        addLog(`📱 检测到 ${wallets.length} 个钱包`);
        wallets.forEach(w => {
            addLog(`  - ${w.adapter.name}: ${w.adapter.readyState}`);
        });
    }, [wallets]);

    useEffect(() => {
        if (wallet) {
            addLog(`✅ 当前选择的钱包: ${wallet.adapter.name}`);
        }
    }, [wallet]);

    useEffect(() => {
        if (connected && publicKey) {
            addLog(`🎉 钱包已连接: ${publicKey.toString()}`);
        }
    }, [connected, publicKey]);

    const handleSelectPhantom = async () => {
        addLog('🔍 尝试选择 Phantom 钱包...');
        const phantomWallet = wallets.find(w => w.adapter.name === 'Phantom');
        
        if (!phantomWallet) {
            addLog('❌ 未找到 Phantom 钱包');
            addLog('💡 请确保已安装 Phantom 浏览器插件');
            return;
        }

        addLog(`📋 Phantom 状态: ${phantomWallet.adapter.readyState}`);
        
        if (phantomWallet.adapter.readyState === 'NotDetected') {
            addLog('❌ Phantom 未安装');
            addLog('💡 请访问 https://phantom.app 安装插件');
            return;
        }

        try {
            addLog('🔄 选择 Phantom...');
            select(phantomWallet.adapter.name);
            
            addLog('⏳ 等待钱包选择生效...');
            // 等待 select 生效，让 wallet 状态更新
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // 检查是否选择成功
            if (!wallet || wallet.adapter.name !== 'Phantom') {
                addLog('⚠️ 钱包选择可能未生效，继续尝试连接...');
            }
            
            addLog('🔌 尝试连接...');
            await connect();
            
            addLog('✅ 连接成功！');
        } catch (error: any) {
            addLog(`❌ 连接失败: ${error.message}`);
            addLog(`错误类型: ${error.name}`);
            console.error('详细错误:', error);
            
            if (error.name === 'WalletNotSelectedError') {
                addLog('💡 钱包未被正确选择，请直接点击钱包列表中的"连接"按钮');
            }
        }
    };

    const handleDisconnect = async () => {
        try {
            addLog('🔌 断开连接...');
            await disconnect();
            addLog('✅ 已断开连接');
        } catch (error: any) {
            addLog(`❌ 断开失败: ${error.message}`);
        }
    };

    const handleCheckWindow = () => {
        addLog('🔍 检查 window 对象...');
        
        // @ts-ignore
        if (window.phantom?.solana) {
            addLog('✅ window.phantom.solana 存在');
            // @ts-ignore
            addLog(`  - isPhantom: ${window.phantom.solana.isPhantom}`);
            // @ts-ignore
            addLog(`  - isConnected: ${window.phantom.solana.isConnected}`);
        } else {
            addLog('❌ window.phantom.solana 不存在');
        }

        // @ts-ignore
        if (window.solana) {
            addLog('✅ window.solana 存在');
            // @ts-ignore
            addLog(`  - isPhantom: ${window.solana.isPhantom}`);
        } else {
            addLog('❌ window.solana 不存在');
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle>钱包连接诊断工具</CardTitle>
                    <CardDescription>
                        用于测试和诊断 Phantom 钱包连接问题
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* 状态信息 */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                        <div>
                            <div className="text-sm text-muted-foreground">连接状态</div>
                            <div className="font-medium">{connected ? '✅ 已连接' : '❌ 未连接'}</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">检测到的钱包</div>
                            <div className="font-medium">{wallets.length} 个</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">当前钱包</div>
                            <div className="font-medium">{wallet?.adapter.name || '未选择'}</div>
                        </div>
                        <div>
                            <div className="text-sm text-muted-foreground">RPC 端点</div>
                            <div className="font-medium text-xs">{connection.rpcEndpoint}</div>
                        </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={handleCheckWindow} variant="outline">
                            检查 Window 对象
                        </Button>
                        <Button onClick={handleSelectPhantom} disabled={connected}>
                            选择并连接 Phantom
                        </Button>
                        <Button onClick={handleDisconnect} disabled={!connected} variant="destructive">
                            断开连接
                        </Button>
                        <Button onClick={() => setLogs([])} variant="ghost">
                            清空日志
                        </Button>
                    </div>

                    {/* 钱包列表 */}
                    <div>
                        <h3 className="font-semibold mb-2">检测到的钱包:</h3>
                        <div className="space-y-2">
                            {wallets.length === 0 ? (
                                <div className="text-sm text-muted-foreground p-4 bg-muted rounded">
                                    ⚠️ 没有检测到任何钱包
                                </div>
                            ) : (
                                wallets.map((w, i) => (
                                    <div key={i} className="text-sm p-3 bg-muted rounded flex justify-between items-center">
                                        <div>
                                            <div className="font-medium">{w.adapter.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                状态: {w.adapter.readyState}
                                            </div>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            onClick={async () => {
                                                try {
                                                    addLog(`🔄 选择 ${w.adapter.name}...`);
                                                    select(w.adapter.name);
                                                    
                                                    // 等待选择生效
                                                    await new Promise(resolve => setTimeout(resolve, 300));
                                                    
                                                    addLog(`🔌 连接 ${w.adapter.name}...`);
                                                    await connect();
                                                    
                                                    addLog(`✅ ${w.adapter.name} 连接成功！`);
                                                } catch (error: any) {
                                                    addLog(`❌ ${w.adapter.name} 连接失败: ${error.message}`);
                                                }
                                            }}
                                            disabled={connected}
                                        >
                                            连接
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* 日志输出 */}
                    <div>
                        <h3 className="font-semibold mb-2">日志输出:</h3>
                        <div className="bg-black text-green-400 p-4 rounded font-mono text-xs h-64 overflow-y-auto">
                            {logs.length === 0 ? (
                                <div className="text-gray-500">等待操作...</div>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i}>{log}</div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* 帮助信息 */}
                    <div className="text-sm text-muted-foreground space-y-2 p-4 bg-muted rounded">
                        <div className="font-semibold">故障排查步骤:</div>
                        <ol className="list-decimal list-inside space-y-1">
                            <li>点击"检查 Window 对象"确认 Phantom 已安装</li>
                            <li>如果未检测到钱包，刷新页面或重启浏览器</li>
                            <li>确保 Phantom 钱包已解锁</li>
                            <li>检查 Phantom 钱包的网络设置（应为 Devnet）</li>
                            <li>尝试点击"选择并连接 Phantom"</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
