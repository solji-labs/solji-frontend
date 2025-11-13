'use client';

import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode
} from 'react';

interface MeritRefreshContextValue {
    refreshToken: number;
    triggerRefresh: () => void;
}

const MeritRefreshContext = createContext<MeritRefreshContextValue | null>(null);

export function MeritRefreshProvider({ children }: { children: ReactNode }) {
    const [refreshToken, setRefreshToken] = useState(0);

    const triggerRefresh = useCallback(() => {
        setRefreshToken((prev) => prev + 1);
    }, []);

    return (
        <MeritRefreshContext.Provider value={{ refreshToken, triggerRefresh }}>
            {children}
        </MeritRefreshContext.Provider>
    );
}

export function useMeritRefresh() {
    const context = useContext(MeritRefreshContext);
    if (!context) {
        throw new Error('useMeritRefresh must be used within a MeritRefreshProvider');
    }
    return context;
}

