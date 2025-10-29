'use client';

import { ReactNode } from 'react';
import { UserStateContext, useUserStateManager } from '@/hooks/use-user-state';

/**
 * 用户状态 Provider 组件
 */
export function UserStateProvider({ children }: { children: ReactNode }) {
  const value = useUserStateManager();

  return (
    <UserStateContext.Provider value={value}>
      {children}
    </UserStateContext.Provider>
  );
}
