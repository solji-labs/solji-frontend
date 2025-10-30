# Solji Frontend 快速启动指南

## 🚀 5 分钟快速部署

### 方式一：使用 Docker Compose（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/solji-labs/solji-frontend.git
cd solji-frontend

# 2. 配置环境变量
cp env.example .env.local

# 3. 启动服务
docker-compose up -d

# 4. 查看日志
docker-compose logs -f

# 5. 访问应用
# 浏览器打开: http://localhost:3000
```

### 方式二：使用 Docker 命令

```bash
# 1. 克隆项目
git clone https://github.com/solji-labs/solji-frontend.git
cd solji-frontend

# 2. 配置环境变量
cp env.example .env.local

# 3. 构建镜像
docker build -t solji-frontend:latest .

# 4. 运行容器
docker run -d \
  --name solji-app \
  -p 3000:3000 \
  --env-file .env.local \
  solji-frontend:latest

# 5. 查看日志
docker logs -f solji-app

# 6. 访问应用
# 浏览器打开: http://localhost:3000
```

### 方式三：本地开发

```bash
# 1. 克隆项目
git clone https://github.com/solji-labs/solji-frontend.git
cd solji-frontend

# 2. 安装依赖（需要 pnpm）
pnpm install

# 3. 配置环境变量
cp env.example .env.local

# 4. 启动开发服务器
pnpm dev

# 5. 访问应用
# 浏览器打开: http://localhost:3000
```

## 📝 环境变量配置

编辑 `.env.local` 文件：

```bash
# Solana 网络配置
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# 后端 API 地址
NEXT_PUBLIC_API_BASE_URL=http://185.234.74.185:10081

# 可选：自定义 RPC 端点
# NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

## 🔧 常用命令

### Docker Compose

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose stop

# 重启服务
docker-compose restart

# 查看日志
docker-compose logs -f

# 停止并删除容器
docker-compose down

# 重新构建并启动
docker-compose up -d --build
```

### Docker

```bash
# 查看运行中的容器
docker ps

# 查看日志
docker logs -f solji-app

# 进入容器
docker exec -it solji-app sh

# 停止容器
docker stop solji-app

# 启动容器
docker start solji-app

# 删除容器
docker rm solji-app
```

## 🐛 常见问题

### 端口被占用

```bash
# 查看占用 3000 端口的进程
lsof -i :3000

# 使用其他端口
docker run -d -p 3001:3000 solji-frontend:latest
```

### 环境变量未生效

```bash
# 检查环境变量
docker exec solji-app env | grep NEXT_PUBLIC

# 重新启动容器
docker-compose restart
```

### 构建失败

```bash
# 清理 Docker 缓存
docker builder prune -a

# 重新构建
docker-compose up -d --build --no-cache
```

## 📚 更多文档

- [完整部署指南](./docker-deployment.md)
- [项目仓库](https://github.com/solji-labs/solji-frontend)

---

**祝您使用愉快！** ✨
