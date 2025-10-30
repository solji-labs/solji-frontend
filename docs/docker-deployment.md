# Solji Frontend Docker 部署指南

## 📋 目录

- [项目概述](#项目概述)
- [前置要求](#前置要求)
- [快速开始](#快速开始)
- [详细部署步骤](#详细部署步骤)
- [环境变量配置](#环境变量配置)
- [常见问题](#常见问题)
- [维护与监控](#维护与监控)

---

## 项目概述

**Solji** 是一个基于 Solana 区块链的 Web3 应用前端项目，提供寺庙互动、心愿祈福、抽签占卜等功能。

### 技术栈

- **框架**: Next.js 15.2.4 (React 19)
- **包管理器**: pnpm 9.15.0
- **区块链**: Solana Web3.js + Anchor
- **UI 组件**: Radix UI + TailwindCSS
- **钱包集成**: Solana Wallet Adapter

### 项目结构

```text
solji-frontend/
├── app/                    # Next.js App Router 页面
│   ├── temple/            # 寺庙相关页面
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # React 组件
├── hooks/                 # 自定义 Hooks
├── lib/                   # 工具函数和 API
├── public/                # 静态资源
├── styles/                # 样式文件
├── package.json           # 依赖配置
├── next.config.mjs        # Next.js 配置
└── env.example            # 环境变量示例
```

---

## 前置要求

### 系统要求

- **操作系统**: Linux / macOS / Windows (with WSL2)
- **Docker**: >= 20.10.0
- **Docker Compose**: >= 2.0.0 (可选)
- **内存**: >= 2GB
- **磁盘空间**: >= 5GB

### 安装 Docker

#### macOS

```bash
# 使用 Homebrew 安装
brew install --cask docker

# 或下载 Docker Desktop
# https://www.docker.com/products/docker-desktop
```

#### Linux (Ubuntu/Debian)

```bash
# 更新包索引
sudo apt-get update

# 安装依赖
sudo apt-get install ca-certificates curl gnupg lsb-release

# 添加 Docker 官方 GPG 密钥
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 设置仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 验证安装
docker --version
```

---

## 快速开始

### 一键启动（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/solji-labs/solji-frontend.git
cd solji-frontend

# 2. 配置环境变量
cp env.example .env.local

# 3. 构建并运行 Docker 容器
docker build -t solji-frontend .
docker run -d \
  --name solji-app \
  -p 3000:3000 \
  --env-file .env.local \
  solji-frontend

# 4. 访问应用
# 浏览器打开: http://localhost:3000
```

---

## 详细部署步骤

### 步骤 1: 准备项目文件

#### 1.1 克隆代码仓库

```bash
# 使用 HTTPS
git clone https://github.com/solji-labs/solji-frontend.git

# 或使用 SSH
git clone git@github.com:solji-labs/solji-frontend.git

# 进入项目目录
cd solji-frontend
```

#### 1.2 检查项目结构

```bash
# 确认关键文件存在
ls -la

# 应该看到以下文件:
# - package.json
# - next.config.mjs
# - env.example
# - app/
# - components/
```

### 步骤 2: 创建 Dockerfile

在项目根目录创建 `Dockerfile`:

```dockerfile
# ============================================
# 阶段 1: 依赖安装
# ============================================
FROM node:20-alpine AS deps

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# 设置工作目录
WORKDIR /app

# 复制依赖配置文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖（仅生产依赖）
RUN pnpm install --frozen-lockfile --prod=false

# ============================================
# 阶段 2: 构建应用
# ============================================
FROM node:20-alpine AS builder

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# 从 deps 阶段复制 node_modules
COPY --from=deps /app/node_modules ./node_modules

# 复制项目文件
COPY . .

# 设置环境变量（构建时）
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# 构建 Next.js 应用
RUN pnpm build

# ============================================
# 阶段 3: 生产运行
# ============================================
FROM node:20-alpine AS runner

WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要的文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 启动应用
CMD ["node", "server.js"]
```

**注意**: 由于项目使用了 `output: 'standalone'` 模式，需要在 `next.config.mjs` 中添加配置:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // 添加这一行
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

### 步骤 3: 配置环境变量

#### 3.1 创建 .env.local 文件

```bash
# 复制示例文件
cp env.example .env.local

# 编辑环境变量
vim .env.local  # 或使用其他编辑器
```

#### 3.2 配置说明

```bash
# ============================================
# Solana 网络配置
# ============================================

# 网络类型: devnet | testnet | mainnet-beta
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# 自定义 RPC 端点（可选）
# Devnet 示例:
# NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
# NEXT_PUBLIC_SOLANA_RPC_URL=https://rpc.ankr.com/solana_devnet/YOUR_API_KEY

# Mainnet 示例（生产环境推荐使用付费 RPC）:
# NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# ============================================
# 后端 API 配置
# ============================================

# 后端服务地址
NEXT_PUBLIC_API_BASE_URL=http://185.234.74.185:10081

# 本地开发时使用:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:10081
```

### 步骤 4: 构建 Docker 镜像

#### 4.1 基础构建

```bash
# 构建镜像（标签为 solji-frontend:latest）
docker build -t solji-frontend:latest .

# 查看构建的镜像
docker images | grep solji-frontend
```

#### 4.2 带版本号构建

```bash
# 构建带版本号的镜像
docker build -t solji-frontend:0.1.1 -t solji-frontend:latest .

# 查看镜像
docker images | grep solji-frontend
# 输出示例:
# solji-frontend   0.1.1    abc123def456   2 minutes ago   150MB
# solji-frontend   latest   abc123def456   2 minutes ago   150MB
```

#### 4.3 构建优化选项

```bash
# 使用 BuildKit 加速构建
DOCKER_BUILDKIT=1 docker build -t solji-frontend:latest .

# 不使用缓存重新构建
docker build --no-cache -t solji-frontend:latest .

# 指定平台构建（多架构支持）
docker buildx build --platform linux/amd64,linux/arm64 -t solji-frontend:latest .
```

### 步骤 5: 运行 Docker 容器

#### 5.1 基础运行

```bash
# 运行容器（后台模式）
docker run -d \
  --name solji-app \
  -p 3000:3000 \
  --env-file .env.local \
  solji-frontend:latest

# 查看运行状态
docker ps | grep solji-app
```

#### 5.2 完整运行配置

```bash
docker run -d \
  --name solji-app \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.local \
  --memory="2g" \
  --cpus="1.0" \
  --health-cmd="curl -f http://localhost:3000 || exit 1" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  -v /path/to/logs:/app/logs \
  solji-frontend:latest

# 参数说明:
# --restart unless-stopped: 容器异常退出时自动重启
# -p 3000:3000: 端口映射（主机:容器）
# --env-file: 环境变量文件
# --memory: 内存限制
# --cpus: CPU 限制
# --health-cmd: 健康检查命令
# -v: 挂载日志目录（可选）
```

#### 5.3 前台运行（调试模式）

```bash
# 前台运行，查看实时日志
docker run --rm \
  --name solji-app-debug \
  -p 3000:3000 \
  --env-file .env.local \
  solji-frontend:latest
```

### 步骤 6: 验证部署

#### 6.1 检查容器状态

```bash
# 查看运行中的容器
docker ps

# 查看容器详细信息
docker inspect solji-app

# 查看容器资源使用
docker stats solji-app
```

#### 6.2 查看日志

```bash
# 查看实时日志
docker logs -f solji-app

# 查看最近 100 行日志
docker logs --tail 100 solji-app

# 查看带时间戳的日志
docker logs -t solji-app
```

#### 6.3 访问应用

```bash
# 本地访问
curl http://localhost:3000

# 或在浏览器打开
open http://localhost:3000  # macOS
xdg-open http://localhost:3000  # Linux
```

---

## 使用 Docker Compose 部署（推荐）

### 创建 docker-compose.yml

在项目根目录创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  solji-frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: solji-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - .env.local
    environment:
      - NODE_ENV=production
      - NEXT_TELEMETRY_DISABLED=1
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 1G
    networks:
      - solji-network

networks:
  solji-network:
    driver: bridge
```

### 使用 Docker Compose 命令

```bash
# 启动服务（后台运行）
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 停止服务
docker-compose stop

# 停止并删除容器
docker-compose down

# 重新构建并启动
docker-compose up -d --build

# 查看资源使用
docker-compose stats
```

---

## 环境变量配置

### 必需环境变量

| 变量名 | 说明 | 示例值 | 必需 |
|--------|------|--------|------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | Solana 网络类型 | `devnet` / `mainnet-beta` | ✅ |
| `NEXT_PUBLIC_API_BASE_URL` | 后端 API 地址 | `http://185.234.74.185:10081` | ✅ |

### 可选环境变量

| 变量名 | 说明 | 示例值 | 必需 |
|--------|------|--------|------|
| `NEXT_PUBLIC_SOLANA_RPC_URL` | 自定义 RPC 端点 | `https://api.devnet.solana.com` | ❌ |
| `PORT` | 应用监听端口 | `3000` | ❌ |
| `NODE_ENV` | 运行环境 | `production` | ❌ |

### 不同环境配置示例

#### 开发环境 (.env.development)

```bash
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_API_BASE_URL=http://localhost:10081
```

#### 测试环境 (.env.test)

```bash
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://rpc.ankr.com/solana_devnet
NEXT_PUBLIC_API_BASE_URL=http://test-api.solji.com
```

#### 生产环境 (.env.production)

```bash
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY
NEXT_PUBLIC_API_BASE_URL=https://api.solji.com
```

---

## 常见问题

### 1. 构建失败

#### 问题: pnpm 安装依赖失败

```bash
# 错误信息
ERROR: failed to solve: process "/bin/sh -c pnpm install" did not complete successfully
```

**解决方案**:

```bash
# 清理 Docker 缓存
docker builder prune -a

# 使用 --no-cache 重新构建
docker build --no-cache -t solji-frontend:latest .
```

#### 问题: Next.js 构建超时

```bash
# 错误信息
Error: Build timeout exceeded
```

**解决方案**:

```dockerfile
# 在 Dockerfile 中增加构建超时时间
ENV NEXT_BUILD_TIMEOUT=600000
```

### 2. 运行时错误

#### 问题: 端口被占用

```bash
# 错误信息
Error: bind: address already in use
```

**解决方案**:

```bash
# 查看占用端口的进程
lsof -i :3000

# 停止占用端口的容器
docker stop $(docker ps -q --filter "publish=3000")

# 或使用其他端口
docker run -d -p 3001:3000 solji-frontend:latest
```

#### 问题: 环境变量未生效

```bash
# 错误信息
API connection failed
```

**解决方案**:

```bash
# 检查环境变量是否正确加载
docker exec solji-app env | grep NEXT_PUBLIC

# 重新指定环境变量
docker run -d \
  -e NEXT_PUBLIC_API_BASE_URL=http://185.234.74.185:10081 \
  -e NEXT_PUBLIC_SOLANA_NETWORK=devnet \
  solji-frontend:latest
```

### 3. 性能问题

#### 问题: 容器内存不足

```bash
# 错误信息
JavaScript heap out of memory
```

**解决方案**:

```bash
# 增加内存限制
docker run -d --memory="4g" solji-frontend:latest

# 或在 docker-compose.yml 中配置
deploy:
  resources:
    limits:
      memory: 4G
```

#### 问题: 构建速度慢

**解决方案**:

```dockerfile
# 使用 .dockerignore 排除不必要的文件
# 创建 .dockerignore 文件:
node_modules
.next
.git
.env.local
*.log
.DS_Store
```

### 4. 网络问题

#### 问题: 无法连接到 Solana RPC

```bash
# 错误信息
Failed to connect to Solana network
```

**解决方案**:

```bash
# 1. 检查网络连接
docker exec solji-app ping -c 3 api.devnet.solana.com

# 2. 使用自定义 DNS
docker run -d --dns 8.8.8.8 --dns 8.8.4.4 solji-frontend:latest

# 3. 使用 host 网络模式（仅 Linux）
docker run -d --network host solji-frontend:latest
```

---

## 维护与监控

### 日常维护

#### 查看容器状态

```bash
# 查看所有容器
docker ps -a

# 查看容器详细信息
docker inspect solji-app

# 查看容器资源使用
docker stats solji-app
```

#### 更新应用

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新构建镜像
docker build -t solji-frontend:latest .

# 3. 停止旧容器
docker stop solji-app
docker rm solji-app

# 4. 启动新容器
docker run -d \
  --name solji-app \
  -p 3000:3000 \
  --env-file .env.local \
  solji-frontend:latest

# 或使用 Docker Compose
docker-compose up -d --build
```

#### 备份与恢复

```bash
# 导出镜像
docker save solji-frontend:latest > solji-frontend-backup.tar

# 导入镜像
docker load < solji-frontend-backup.tar

# 导出容器
docker export solji-app > solji-app-backup.tar

# 导入容器
docker import solji-app-backup.tar solji-frontend:restored
```

### 日志管理

#### 配置日志驱动

```bash
# 使用 json-file 日志驱动（限制大小）
docker run -d \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  solji-frontend:latest
```

#### 日志分析

```bash
# 查看错误日志
docker logs solji-app 2>&1 | grep -i error

# 导出日志到文件
docker logs solji-app > /path/to/logs/solji-app.log

# 实时监控日志
docker logs -f --since 10m solji-app
```

### 性能监控

#### 使用 Docker Stats

```bash
# 实时监控资源使用
docker stats solji-app

# 输出格式化
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

#### 健康检查

```bash
# 查看健康状态
docker inspect --format='{{.State.Health.Status}}' solji-app

# 查看健康检查日志
docker inspect --format='{{json .State.Health}}' solji-app | jq
```

### 清理与优化

```bash
# 清理停止的容器
docker container prune

# 清理未使用的镜像
docker image prune -a

# 清理所有未使用的资源
docker system prune -a

# 查看 Docker 磁盘使用
docker system df
```

---

## 生产环境最佳实践

### 1. 使用反向代理

#### Nginx 配置示例

```nginx
upstream solji_frontend {
    server localhost:3000;
}

server {
    listen 80;
    server_name solji.com www.solji.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name solji.com www.solji.com;

    # SSL 证书配置
    ssl_certificate /etc/nginx/ssl/solji.com.crt;
    ssl_certificate_key /etc/nginx/ssl/solji.com.key;

    # SSL 优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 日志
    access_log /var/log/nginx/solji-access.log;
    error_log /var/log/nginx/solji-error.log;

    # 代理配置
    location / {
        proxy_pass http://solji_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态资源缓存
    location /_next/static {
        proxy_pass http://solji_frontend;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
```

### 2. 使用 HTTPS

```bash
# 使用 Let's Encrypt 获取免费 SSL 证书
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d solji.com -d www.solji.com
```

### 3. 配置自动重启

```bash
# 使用 systemd 管理 Docker 容器
sudo vim /etc/systemd/system/solji-frontend.service
```

```ini
[Unit]
Description=Solji Frontend Container
Requires=docker.service
After=docker.service

[Service]
Restart=always
ExecStart=/usr/bin/docker start -a solji-app
ExecStop=/usr/bin/docker stop -t 10 solji-app

[Install]
WantedBy=multi-user.target
```

```bash
# 启用服务
sudo systemctl enable solji-frontend.service
sudo systemctl start solji-frontend.service
```

### 4. 监控告警

使用 Prometheus + Grafana 监控 Docker 容器:

```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

---

## 附录

### A. 完整的 .dockerignore 示例

```gitignore
# 依赖
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# 构建产物
.next
out
dist
build

# 环境变量
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# 版本控制
.git
.gitignore
.gitattributes

# IDE
.vscode
.idea
*.swp
*.swo
*~

# 操作系统
.DS_Store
Thumbs.db

# 测试
coverage
.nyc_output

# 日志
*.log
logs

# 其他
README.md
LICENSE
.editorconfig
.prettierrc
.eslintrc
```

### B. 常用 Docker 命令速查

```bash
# 镜像管理
docker images                    # 列出所有镜像
docker rmi <image_id>           # 删除镜像
docker pull <image>             # 拉取镜像
docker push <image>             # 推送镜像

# 容器管理
docker ps                       # 列出运行中的容器
docker ps -a                    # 列出所有容器
docker start <container>        # 启动容器
docker stop <container>         # 停止容器
docker restart <container>      # 重启容器
docker rm <container>           # 删除容器

# 日志与调试
docker logs <container>         # 查看日志
docker exec -it <container> sh  # 进入容器
docker inspect <container>      # 查看容器详情
docker stats <container>        # 查看资源使用

# 清理
docker system prune             # 清理未使用的资源
docker volume prune             # 清理未使用的卷
docker network prune            # 清理未使用的网络
```

### C. 故障排查检查清单

- [ ] Docker 服务是否正常运行
- [ ] 镜像是否成功构建
- [ ] 环境变量是否正确配置
- [ ] 端口是否被占用
- [ ] 网络连接是否正常
- [ ] 容器日志是否有错误信息
- [ ] 资源（CPU/内存）是否充足
- [ ] 防火墙规则是否正确
- [ ] DNS 解析是否正常
- [ ] SSL 证书是否有效

---

## 联系与支持

- **项目地址**: <https://github.com/solji-labs/solji-frontend>
- **问题反馈**: <https://github.com/solji-labs/solji-frontend/issues>
- **文档更新日期**: 2025-10-30

---

**祝您部署顺利！** 🚀
