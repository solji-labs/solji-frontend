'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';
import { getUserStatePda, createConnection, createProgram } from '@/lib/solana';
import { UserState, getKarmaLevel } from '@/lib/types';
import { useWallet } from '@solana/wallet-adapter-react';

/**
 * 用户状态上下文类型
 */
interface UserStateContextType {
  userState: UserState | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchUserState: (walletAddress: string) => Promise<void>;
  clearUserState: () => void;
  updateUserState: (userState: UserState) => void;
}

/**
 * 创建上下文
 */
export const UserStateContext = createContext<UserStateContextType | undefined>(undefined);

/**
 * 创建初始用户状态
 */
function createInitialUserState(walletAddress: string): UserState {
  const karmaPoints = 0;
  return {
    walletAddress,
    karmaPoints,
    totalIncenseValue: 0,
    totalDonationAmount: 0,
    totalBurnCount: 0,
    totalDrawCount: 0,
    totalWishCount: 0,
    totalDonationCount: 0,
    dailyBurnCount: 0,
    dailyDrawCount: 0,
    dailyWishCount: 0,
    createdAt: new Date(),
    lastActiveAt: new Date(),
    karmaLevel: getKarmaLevel(karmaPoints), // 自动计算等级
  };
}

/**
 * 使用用户状态的 Hook
 */
export function useUserState() {
  const context = useContext(UserStateContext);
  if (context === undefined) {
    throw new Error('useUserState must be used within a UserStateProvider');
  }
  return context;
}

/**
 * 创建用户状态管理的 Hook（用于 Provider 内部）
 */
export function useUserStateManager() {
  const [userState, setUserState] = useState<UserState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wallet = useWallet();

  /**
   * 从链上获取用户状态
   */
  const fetchUserState = useCallback(async (walletAddress: string) => {
    setLoading(true);
    setError(null);

    try {
      const userPubkey = new PublicKey(walletAddress);
      const userStatePda = getUserStatePda(userPubkey);

      console.log('🔍 获取用户状态 PDA:', userStatePda.toString());

      // 创建连接
      const connection = createConnection();
      
      try {
        // 尝试从链上获取用户状态
        const accountInfo = await connection.getAccountInfo(userStatePda);
        
        if (!accountInfo) {
          console.log('⚠️ 用户状态账户不存在，使用初始状态');
          const initialState = createInitialUserState(walletAddress);
          setUserState(initialState);
          setLoading(false);
          return;
        }

        console.log('✅ 找到用户状态账户');
        
        // 使用 Anchor 程序解析数据
        if (wallet.wallet) {
          try {
            const program = createProgram(wallet.wallet.adapter as any);
            const accountData = await program.account.userState.fetch(userStatePda);
            
            console.log('📊 用户状态:', accountData);
            
            // 将链上数据转换为 UserState 格式
            const karmaPoints = accountData.karmaPoints?.toNumber() || 0;
            const parsedState: UserState = {
              walletAddress,
              karmaPoints,
              totalIncenseValue: accountData.totalIncenseValue?.toNumber() || 0,
              totalDonationAmount: accountData.totalDonationAmount?.toNumber() || 0,
              totalDonationCount: accountData.totalDonationCount?.toNumber() || 0,
              totalBurnCount: accountData.totalBurnCount || 0,
              totalDrawCount: accountData.totalDrawCount || 0,
              totalWishCount: accountData.totalWishCount || 0,
              dailyBurnCount: accountData.dailyBurnCount || 0,
              dailyDrawCount: accountData.dailyDrawCount || 0,
              dailyWishCount: accountData.dailyWishCount || 0,
              createdAt: accountData.createdAt 
                ? new Date(accountData.createdAt.toNumber() * 1000) 
                : new Date(),
              lastActiveAt: accountData.lastActiveAt 
                ? new Date(accountData.lastActiveAt.toNumber() * 1000) 
                : new Date(),
              karmaLevel: getKarmaLevel(karmaPoints),
            };
            
            console.log('✅ 成功解析用户状态:', parsedState);
            setUserState(parsedState);
            setLoading(false);
            return;
          } catch (parseError: any) {
            console.warn('⚠️ 解析用户状态失败:', parseError.message);
          }
        }
        
        // 如果没有 wallet 或解析失败，使用初始状态
        const initialState = createInitialUserState(walletAddress);
        setUserState(initialState);
        setLoading(false);
        
      } catch (fetchError: any) {
        console.warn('⚠️ 获取用户状态失败，使用初始状态:', fetchError.message);
        const initialState = createInitialUserState(walletAddress);
        setUserState(initialState);
        setLoading(false);
      }
    } catch (error: any) {
      console.error('❌ 获取用户状态出错:', error);
      setError(error.message || '获取用户状态失败');
      setLoading(false);
      
      // 即使出错也提供初始状态
      const initialState = createInitialUserState(walletAddress);
      setUserState(initialState);
    }
  }, [wallet]);

  /**
   * 清除用户状态（用户断开连接时）
   */
  const clearUserState = useCallback(() => {
    setUserState(null);
    setLoading(false);
    setError(null);
  }, []);

  /**
   * 更新用户状态（用于手动更新）
   */
  const updateUserState = useCallback((newUserState: UserState) => {
    setUserState(newUserState);
    setError(null);
  }, []);

  return {
    userState,
    loading,
    error,
    fetchUserState,
    clearUserState,
    updateUserState,
  };
}

/**
 * 使用 Anchor 程序获取用户状态的辅助函数
 * 需要在有 wallet 实例的地方调用
 */
export async function fetchUserStateWithProgram(
  walletAddress: string,
  program: any
): Promise<UserState> {
  try {
    const userPubkey = new PublicKey(walletAddress);
    const userStatePda = getUserStatePda(userPubkey);

    console.log('🔍 使用 Anchor 程序获取用户状态...');
    
    const accountData = await program.account.userState.fetch(userStatePda);
    
    // 将链上数据转换为 UserState 格式
    const karmaPoints = accountData.karmaPoints?.toNumber() || 0;
    const userState: UserState = {
      walletAddress,
      karmaPoints,
      totalIncenseValue: accountData.totalIncenseValue?.toNumber() || 0,
      totalDonationAmount: accountData.totalDonationAmount?.toNumber() || 0,
      totalDonationCount: accountData.totalDonationCount || 0,
      totalBurnCount: accountData.totalBurnCount || 0,
      totalDrawCount: accountData.totalDrawCount || 0,
      totalWishCount: accountData.totalWishCount || 0,
      dailyBurnCount: accountData.dailyBurnCount || 0,
      dailyDrawCount: accountData.dailyDrawCount || 0,
      dailyWishCount: accountData.dailyWishCount || 0,
      createdAt: accountData.createdAt 
        ? new Date(accountData.createdAt.toNumber() * 1000) 
        : new Date(),
      lastActiveAt: accountData.lastActiveAt 
        ? new Date(accountData.lastActiveAt.toNumber() * 1000) 
        : new Date(),
      karmaLevel: getKarmaLevel(karmaPoints), // 自动计算等级
    };

    console.log('✅ 成功获取用户状态:', userState);
    return userState;
  } catch (error: any) {
    console.warn('⚠️ 获取用户状态失败，返回初始状态:', error.message);
    return createInitialUserState(walletAddress);
  }
}
