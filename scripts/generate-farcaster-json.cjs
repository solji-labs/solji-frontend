const fs = require('fs');
const path = require('path');

/**
 * 自动生成 Farcaster Manifest 文件
 * 支持本地开发（ngrok）和生产环境
 */
function generateFarcasterJson() {
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN;
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL;

  // 确定使用的域名
  let domain;
  let baseUrl;

  if (appDomain) {
    // 本地开发使用 ngrok 域名
    domain = appDomain;
    baseUrl = `https://${domain}`;
  } else if (appBaseUrl) {
    // 生产环境使用配置的 base URL
    try {
      const url = new URL(appBaseUrl);
      domain = url.hostname;
      baseUrl = appBaseUrl;
    } catch (e) {
      console.error('❌ NEXT_PUBLIC_APP_BASE_URL 格式错误:', e.message);
      process.exit(1);
    }
  } else {
    // 默认使用 localhost（仅用于开发，Farcaster 不支持）
    domain = 'localhost:3000';
    baseUrl = 'http://localhost:3000';
    console.warn('⚠️  未配置 NEXT_PUBLIC_APP_DOMAIN 或 NEXT_PUBLIC_APP_BASE_URL');
    console.warn('⚠️  Farcaster 不支持 localhost，请使用 ngrok 或配置生产域名');
  }

  // Manifest 配置
  // 使用 public 下的实际图片（logo.png 或 temple-l1.png）
  // 在 Next.js 中，public 下的文件可以通过根路径访问，如 /logo.png
  const imageUrl = `${baseUrl}/logo.png`; // 使用 logo.png 作为默认图片
  
  const manifest = {
    accountAssociation: {
      header: 'x-farcaster-miniapp-account',
    },
    frame: {
      version: 'next',
      imageUrl: imageUrl,
      button: {
        title: 'Launch Solji',
        action: {
          type: 'launch_miniapp',
          url: `${baseUrl}/temple`, // 指向寺庙页面
        },
      },
    },
  };

  // 确保目录存在
  const wellKnownDir = path.join(process.cwd(), 'public', '.well-known');
  if (!fs.existsSync(wellKnownDir)) {
    fs.mkdirSync(wellKnownDir, { recursive: true });
  }

  // 写入文件
  const manifestPath = path.join(wellKnownDir, 'farcaster.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  // 输出日志信息
  console.log('\n📄 Farcaster Manifest 已生成');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 域名: ${domain}`);
  console.log(`🔗 Base URL: ${baseUrl}`);
  console.log(`📝 Manifest 路径: ${manifestPath}`);
  console.log('\n🧪 测试链接:');
  console.log(`   ${baseUrl}`);
  console.log('\n🔍 Farcaster 调试工具:');
  console.log('   https://farcaster.xyz/~/developers/mini-apps/debug');
  console.log('\n💡 提示:');
  if (appDomain) {
    console.log('   ✅ 使用 ngrok 域名，适合本地测试');
    console.log(`   📋 在调试工具中输入: ${baseUrl}`);
  } else if (appBaseUrl && !appBaseUrl.includes('localhost')) {
    console.log('   ✅ 使用生产域名');
    console.log(`   📋 在调试工具中输入: ${baseUrl}`);
  } else {
    console.log('   ⚠️  请配置 NEXT_PUBLIC_APP_DOMAIN (ngrok) 或 NEXT_PUBLIC_APP_BASE_URL (生产)');
    console.log('   📋 本地开发示例:');
    console.log('      1. 运行: ngrok http 3000');
    console.log('      2. 在 .env.local 中添加: NEXT_PUBLIC_APP_DOMAIN=your-ngrok-domain.ngrok-free.app');
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// 执行生成
generateFarcasterJson();


