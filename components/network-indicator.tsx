'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi, AlertTriangle } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface NetworkInfo {
    name: string;
    shortName: string;
    color: string;
}

export function NetworkIndicator() {
    const { connection } = useConnection();
    const { connected } = useWallet();
    const [appNetwork, setAppNetwork] = useState<NetworkInfo | null>(null);

    useEffect(() => {
        const detectNetwork = async () => {
            try {
                const endpoint = connection.rpcEndpoint;
                
                let name = '未知网络';
                let shortName = 'Unknown';
                let color = 'bg-gray-500';

                if (endpoint.includes('localhost') || endpoint.includes('127.0.0.1')) {
                    name = '本地网络';
                    shortName = 'Local';
                    color = 'bg-purple-500';
                } else if (endpoint.includes('devnet')) {
                    name = 'Devnet';
                    shortName = 'Dev';
                    color = 'bg-yellow-500';
                } else if (endpoint.includes('testnet')) {
                    name = 'Testnet';
                    shortName = 'Test';
                    color = 'bg-blue-500';
                } else if (endpoint.includes('mainnet')) {
                    name = 'Mainnet';
                    shortName = 'Main';
                    color = 'bg-green-500';
                }

                setAppNetwork({ name, shortName, color });
            } catch (error) {
                console.error('检测网络失败:', error);
            }
        };

        detectNetwork();
    }, [connection]);

    if (!appNetwork) return null;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge 
                        variant="outline" 
                        className={`${appNetwork.color} text-white border-none flex items-center gap-1 hidden sm:flex cursor-help`}
                    >
                        <Wifi className="w-3 h-3" />
                        <span className="hidden md:inline">{appNetwork.name}</span>
                        <span className="md:hidden">{appNetwork.shortName}</span>
                        {connected && (
                            <AlertTriangle className="w-3 h-3 ml-1" />
                        )}
                    </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                    <div className="space-y-2 text-sm">
                        <div>
                            <strong>应用 RPC 端点:</strong> {appNetwork.name}
                        </div>
                        {connected && (
                            <div className="text-yellow-500 flex items-start gap-1">
                                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <div>
                                    <strong>重要提示:</strong> 请确保钱包插件中的网络设置与应用一致！
                                    <br />
                                    在 Phantom/Solflare 设置中切换到 <strong>{appNetwork.name}</strong>
                                </div>
                            </div>
                        )}
                        {!connected && (
                            <div className="text-muted-foreground">
                                连接钱包后，请确保钱包网络与应用一致
                            </div>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
