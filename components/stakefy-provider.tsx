'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
    StakefyX402Client,
    payToX as stakefyPayToX,
} from 'x402-stakefy-sdk';

interface StakefyContextValue {
    client: any | null;
    ready: boolean;
    error: string | null;
    // helpers
    payToX: (handle: string, amount: number) => Promise<any>;
}

const StakefyContext = createContext<StakefyContextValue | undefined>(undefined);

interface StakefyProviderProps {
    children: React.ReactNode;
    apiUrl?: string;
    network?: 'mainnet-beta' | 'devnet';
}

function StakefyProvider({
    children,
    apiUrl = 'https://stakefy-x402-production.up.railway.app',
    network = 'devnet',
}: StakefyProviderProps) {
    const [client, setClient] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const c = new StakefyX402Client({
                    apiUrl,
                    network,
                } as any);
                if (cancelled) return;
                setClient(c);
                // 暴露到 window 便于临时调试
                if (typeof window !== 'undefined') {
                    // @ts-ignore
                    window.stakefy = {
                        client: c,
                        payToX: stakefyPayToX,
                    };
                }
            } catch (e: any) {
                if (!cancelled) setError(e?.message || 'failed to init stakefy');
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [apiUrl, network]);

    const value = useMemo<StakefyContextValue>(() => {
        const ready = !!client;
        return {
            client,
            ready,
            error,
            payToX: async (handle: string, amount: number) => {
                if (!ready) throw new Error('stakefy not ready');
                return stakefyPayToX(client, handle, amount);
            },
        };
    }, [client, error]);

    return <StakefyContext.Provider value={value}>{children}</StakefyContext.Provider>;
}

export function useStakefy() {
    const ctx = useContext(StakefyContext);
    if (!ctx) {
        throw new Error('useStakefy must be used within StakefyProvider');
    }
    return ctx;
}

export default StakefyProvider;

