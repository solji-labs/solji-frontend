# ============================================
# 阶段 1: 依赖安装
# ============================================
FROM node:20-alpine AS deps

# 安装构建依赖（Python、make、g++ 等）
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    py3-pip \
    linux-headers \
    eudev-dev \
    libusb-dev

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
