# 生产环境 Farcaster 配置说明

## ✅ 已完成的配置

### 1. 环境变量配置

已创建 `.env.production` 文件：
```bash
NEXT_PUBLIC_APP_BASE_URL=https://devnet.solji.fun
```

### 2. Farcaster Manifest

已更新 `public/.well-known/farcaster.json`：
- **URL**: `https://devnet.solji.fun/temple`
- **图片**: `https://devnet.solji.fun/logo.png`
- **Manifest 路径**: `https://devnet.solji.fun/.well-known/farcaster.json`

### 3. 图片配置

已更新所有使用图片的地方：
- `app/layout.tsx`: 使用 `/logo.png`
- `app/temple/wishes/layout.tsx`: 使用 `/logo.png`
- `scripts/generate-farcaster-json.cjs`: 使用 `/logo.png`

## 📝 关于 Public 文件夹图片访问

在 Next.js 中，`public` 文件夹下的文件应该可以通过根路径直接访问：

- `/logo.png` → `public/logo.png`
- `/temple-l1.png` → `public/temple-l1.png`
- `/favicon.ico` → `public/favicon.ico`

### 如果部署后图片无法访问，请检查：

1. **部署平台配置**（如 Vercel）：
   - 确保 `public` 文件夹被正确部署
   - 检查构建输出是否包含 `public` 文件夹

2. **路由冲突**：
   - 确保没有路由与图片路径冲突（如 `/logo` 路由会覆盖 `/logo.png`）

3. **使用绝对 URL**：
   - 代码中已使用 `${APP_BASE_URL}/logo.png`，确保 `APP_BASE_URL` 正确配置

4. **验证图片访问**：
   ```bash
   # 部署后测试
   curl https://devnet.solji.fun/logo.png
   curl https://devnet.solji.fun/.well-known/farcaster.json
   ```

## 🚀 部署步骤

1. **确保环境变量已配置**：
   ```bash
   # 生产环境会自动读取 .env.production
   # 或在部署平台配置环境变量
   NEXT_PUBLIC_APP_BASE_URL=https://devnet.solji.fun
   ```

2. **构建项目**：
   ```bash
   pnpm run build
   ```

3. **部署后验证**：
   - ✅ Manifest: https://devnet.solji.fun/.well-known/farcaster.json
   - ✅ 图片: https://devnet.solji.fun/logo.png
   - ✅ 主页: https://devnet.solji.fun
   - ✅ 寺庙页面: https://devnet.solji.fun/temple

4. **测试 Farcaster**：
   - 访问: https://farcaster.xyz/~/developers/mini-apps/debug
   - 输入: `https://devnet.solji.fun/temple`

## 🔧 如果图片仍然无法访问

### 方案 1: 使用 CDN 或外部存储

如果 `public` 文件夹的图片无法访问，可以：
1. 将图片上传到 CDN（如 Cloudinary、Imgur）
2. 更新代码中的 `imageUrl` 为 CDN URL

### 方案 2: 使用 Next.js Image API

创建 API 路由来提供图片：
```typescript
// app/api/image/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageName = searchParams.get('name');
  
  if (!imageName) {
    return new NextResponse('Missing image name', { status: 400 });
  }
  
  const imagePath = path.join(process.cwd(), 'public', imageName);
  
  if (!fs.existsSync(imagePath)) {
    return new NextResponse('Image not found', { status: 404 });
  }
  
  const imageBuffer = fs.readFileSync(imagePath);
  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': 'image/png',
    },
  });
}
```

### 方案 3: 检查部署平台文档

不同部署平台可能有不同的配置：
- **Vercel**: 自动处理 `public` 文件夹
- **Netlify**: 需要配置 `_redirects` 或 `netlify.toml`
- **自定义服务器**: 需要配置静态文件服务

## 📚 参考

- [Next.js Static File Serving](https://nextjs.org/docs/app/building-your-application/optimizing/static-assets)
- [Farcaster Mini Apps](https://miniapps.farcaster.xyz/)

