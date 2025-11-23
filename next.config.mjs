// Farcaster Manifest 生成
// 当配置了 NEXT_PUBLIC_APP_DOMAIN 时自动生成
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

if (process.env.NODE_ENV !== 'test') {
  try {
    // 只有在配置了域名时才生成（避免 localhost 警告）
    if (process.env.NEXT_PUBLIC_APP_DOMAIN || process.env.NEXT_PUBLIC_APP_BASE_URL) {
      require('./scripts/generate-farcaster-json.cjs');
    }
  } catch (error) {
    // 如果生成失败，只显示警告，不影响项目运行
    console.warn('⚠️  Farcaster Manifest 生成失败（可忽略）:', error.message);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      'pino-pretty': false,
      'pino-abstract-transport': false,
      'sonic-boom': false,
    }
    return config
  },
}

export default nextConfig
