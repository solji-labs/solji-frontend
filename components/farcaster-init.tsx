'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

/**
 * Farcaster Mini App 初始化组件
 * 在应用加载完成后调用 sdk.actions.ready() 来隐藏启动画面并显示内容
 */
export function FarcasterInit() {
    useEffect(() => {
        const initFarcaster = async () => {
            try {
                // 应用加载完成后，调用 ready() 来隐藏启动画面并显示内容
                await sdk.actions.ready();
            } catch (error) {
                // 如果不在 Farcaster 环境中，忽略错误
                // 这样应用在普通浏览器中也能正常运行
                console.log('Farcaster SDK not available:', error);
            }
        };

        initFarcaster();
    }, []);

    return null; // 此组件不渲染任何内容
}
