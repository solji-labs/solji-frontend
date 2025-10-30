

### 方式二：使用 Docker 命令

```bash
# 1. 克隆项目
git clone https://github.com/solji-labs/solji-frontend.git
cd 
cd solji-frontend

# 2. 配置环境变量
cp env.example .env.local

# 3. 构建镜像

## 3.1 本地开发（Mac ARM64）
docker build -t solji-frontend:2025103001 .

## 3.2 生产服务器（Linux AMD64）- 推荐使用此方式
docker buildx build --platform linux/amd64 -t solji-frontend:2025103001-amd64 .

# 导出镜像
cd /Users/samxie/dev/remote-work/solji/images-files
docker save -o solji-frontend-2025103001-amd64.tar solji-frontend:2025103001-amd64

# 服务器端操作（Linux AMD64）
cd /data
docker load -i solji-frontend-2025103001-amd64.tar

docker stop solji-web && docker rm solji-web

# 4. 运行容器
docker run -d --name solji-web -p 10082:3000 --env-file /data/solji-web/.env.local solji-frontend:2025103001-amd64

# 5. 查看日志
docker logs -f --tail 100 solji-web

# 6. 访问应用
# 浏览器打开: http://localhost:10082
# 浏览器打开: http://185.234.74.185:10082
```