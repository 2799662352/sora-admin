# 🚀 GitHub 完整配置指南

## ✅ 仓库已创建

**仓库地址**: https://github.com/2799662352/sora-admin-nextjs

---

## 📦 推送代码到 GitHub

### 方式1: 命令行推送

**在本地项目目录执行：**

```bash
cd D:\tecx\text\25\soraui_4.0\sora-admin-nextjs

# 初始化 Git
git init

# 添加所有文件
git add .

# 提交
git commit -m "feat: 初始化 Next.js 管理后台项目"

# 设置远程仓库
git remote add origin https://github.com/2799662352/sora-admin-nextjs.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 方式2: GitHub Desktop (图形界面)

1. 打开 GitHub Desktop
2. File → Add Local Repository
3. 选择 `D:\tecx\text\25\soraui_4.0\sora-admin-nextjs`
4. Publish repository
5. 选择你的账号和仓库名
6. Publish

---

## 🐳 GitHub Container Registry (GHCR) 配置

### 自动构建 Docker 镜像

**已配置 GitHub Actions**:
- 文件: `.github/workflows/docker-publish.yml`
- 触发: 每次推送到 main 分支
- 功能: 自动构建并推送到 GHCR

### 镜像地址

```
ghcr.io/2799662352/sora-admin-nextjs:latest
ghcr.io/2799662352/sora-admin-nextjs:main
ghcr.io/2799662352/sora-admin-nextjs:v1.0.0
```

### 拉取镜像

```bash
# 登录 GHCR (首次)
echo $GITHUB_TOKEN | docker login ghcr.io -u 2799662352 --password-stdin

# 拉取镜像
docker pull ghcr.io/2799662352/sora-admin-nextjs:latest

# 运行
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.zuo2799662352.xyz \
  ghcr.io/2799662352/sora-admin-nextjs:latest
```

---

## 🔐 配置 GitHub Secrets

**为自动部署配置密钥：**

### 在 GitHub 仓库设置 Secrets

访问: https://github.com/2799662352/sora-admin-nextjs/settings/secrets/actions

添加以下 Secrets:

```
SERVER_HOST         → 175.27.250.155
SERVER_USER         → root
SERVER_PORT         → 22
SERVER_SSH_KEY      → (你的 SSH 私钥)
```

### 如何获取 SSH 私钥

**在本地 PowerShell 执行：**

```powershell
# 查看私钥
cat ~/.ssh/id_rsa

# 或生成新的密钥对
ssh-keygen -t rsa -b 4096 -C "your-email@gmail.com"

# 复制公钥到服务器
ssh-copy-id root@175.27.250.155
```

---

## 🚀 自动部署流程

### 触发部署

```bash
# 方式1: 推送代码自动构建
git push origin main

# 方式2: 创建标签自动部署
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 方式3: 手动触发
# 访问: https://github.com/2799662352/sora-admin-nextjs/actions
# 点击 "Deploy to Server" → "Run workflow"
```

### GitHub Actions 工作流程

```
1. 代码推送到 GitHub
   ↓
2. GitHub Actions 触发
   ↓
3. 构建 Docker 镜像
   ↓
4. 推送到 GHCR
   ↓
5. SSH 连接到服务器
   ↓
6. 拉取最新镜像
   ↓
7. 重启容器
   ↓
8. 部署完成 ✅
```

---

## 📋 完整配置文件

### 已创建的 GitHub Actions

```
.github/workflows/
├── docker-publish.yml    # 构建 Docker 镜像
└── deploy.yml            # 自动部署到服务器
```

### 镜像自动标签策略

```
ghcr.io/2799662352/sora-admin-nextjs:
  • main           (最新主分支)
  • latest         (最新稳定版)
  • v1.0.0         (版本标签)
  • sha-abc123     (commit SHA)
```

---

## 🌐 Cloudflare CDN 配置

### DNS 配置

**在 Cloudflare 添加记录：**

```
类型    名称      内容              代理状态
A      admin     175.27.250.155    ☁️ 已代理
```

### CDN 优化配置

**Speed 设置：**
```
✅ Auto Minify: JS + CSS + HTML
✅ Brotli: On
✅ Early Hints: On
✅ HTTP/2: On
✅ Rocket Loader: On
```

**Caching 规则：**
```
Page Rule 1: admin.zuo2799662352.xyz/_next/static/*
  • Cache Level: Cache Everything
  • Edge Cache TTL: 1 year
  • Browser Cache TTL: 1 year

Page Rule 2: admin.zuo2799662352.xyz/api/*
  • Cache Level: Bypass
```

**SSL/TLS:**
```
✅ Mode: Full (strict)
✅ Always Use HTTPS: On
✅ Automatic HTTPS Rewrites: On
✅ Minimum TLS: 1.2
```

---

## 🔧 服务器配置更新

### 更新 docker-compose.yml

**在服务器 `/opt/sora-ui-deploy/docker-compose.yml` 添加：**

```yaml
  # Next.js 管理后台
  admin:
    image: ghcr.io/2799662352/sora-admin-nextjs:latest
    container_name: sora-admin
    restart: always
    environment:
      - NEXT_PUBLIC_API_URL=https://api.zuo2799662352.xyz
      - NODE_ENV=production
    ports:
      - "3000:3000"
    networks:
      - sora-network
    depends_on:
      - api
```

### 更新 Nginx 配置

**创建 `nginx/conf.d/admin.conf`：**

```nginx
# Next.js 管理后台 - HTTP
server {
    listen 80;
    server_name admin.zuo2799662352.xyz;
    
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    
    location / {
        return 301 https://$host$request_uri;
    }
}

# Next.js 管理后台 - HTTPS
server {
    listen 443 ssl http2;
    server_name admin.zuo2799662352.xyz;
    
    ssl_certificate /etc/letsencrypt/live/api.zuo2799662352.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.zuo2799662352.xyz/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    add_header Strict-Transport-Security "max-age=31536000" always;
    
    location / {
        proxy_pass http://admin:3000;
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
        proxy_pass http://admin:3000;
        proxy_cache_valid 200 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 🎯 完整部署流程

### 步骤1: 推送代码到 GitHub (本地)

```bash
cd D:\tecx\text\25\soraui_4.0\sora-admin-nextjs

git init
git add .
git commit -m "feat: Next.js 管理后台初始版本"
git remote add origin https://github.com/2799662352/sora-admin-nextjs.git
git branch -M main
git push -u origin main
```

**推送后**:
- ✅ GitHub Actions 自动触发
- ✅ 构建 Docker 镜像
- ✅ 推送到 GHCR
- ✅ 镜像地址: `ghcr.io/2799662352/sora-admin-nextjs:latest`

### 步骤2: 配置 Cloudflare DNS (2分钟)

**添加 A 记录：**
```
A    admin    175.27.250.155    ☁️ 已代理
```

### 步骤3: 服务器部署 (5分钟)

**SSH 到服务器：**

```bash
ssh root@175.27.250.155

# 执行部署脚本
cd /opt/sora-ui-deploy

# 登录 GHCR
echo "YOUR_GITHUB_TOKEN" | docker login ghcr.io -u 2799662352 --password-stdin

# 拉取镜像
docker pull ghcr.io/2799662352/sora-admin-nextjs:latest

# 更新 SSL 证书 (添加 admin 域名)
docker compose stop nginx

docker run --rm \
  -v /opt/sora-ui-deploy/certbot/conf:/etc/letsencrypt \
  -v /opt/sora-ui-deploy/certbot/www:/var/www/certbot \
  -p 80:80 \
  certbot/certbot certonly \
  --standalone \
  --non-interactive \
  --expand \
  --email zuozuoliang999@gmail.com \
  --agree-tos \
  --no-eff-email \
  -d api.zuo2799662352.xyz \
  -d update.zuo2799662352.xyz \
  -d admin.zuo2799662352.xyz

# 创建 Nginx 配置 (上面的配置)

# 启动所有服务
docker compose up -d

# 查看状态
docker compose ps
```

---

## 🎊 完成后的架构

```
GitHub (代码托管 + CI/CD)
  ├── 代码仓库: github.com/2799662352/sora-admin-nextjs
  ├── Actions: 自动构建
  └── GHCR: Docker 镜像
        ↓
Docker 镜像: ghcr.io/2799662352/sora-admin-nextjs:latest
        ↓
        ↓ (自动部署或手动拉取)
        ↓
服务器: 175.27.250.155
  ├── Docker 运行: Port 3000
  ├── Nginx 代理: HTTPS
  └── 域名: admin.zuo2799662352.xyz
        ↓
Cloudflare CDN
  ├── 全球加速
  ├── 自动 HTTPS
  └── DDoS 防护
```

---

## 📝 GitHub Token 获取

**用于 GHCR 登录：**

1. 访问: https://github.com/settings/tokens
2. Generate new token (classic)
3. 选择权限:
   ```
   ✅ read:packages
   ✅ write:packages
   ✅ delete:packages
   ```
4. 生成并复制 Token
5. 在服务器登录:
   ```bash
   echo "YOUR_TOKEN" | docker login ghcr.io -u 2799662352 --password-stdin
   ```

---

## 🎯 完整命令清单

### 本地操作

```bash
# 1. 推送代码
git push origin main

# 2. 创建发布
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### 服务器操作

```bash
# 1. 拉取最新镜像
docker pull ghcr.io/2799662352/sora-admin-nextjs:latest

# 2. 重启服务
docker compose up -d admin

# 3. 查看日志
docker logs -f sora-admin
```

### Cloudflare 操作

```
1. 添加 DNS: admin → 175.27.250.155
2. 启用代理 (橙色云朵)
3. 配置缓存规则
```

---

## 🎊 最终效果

```
推送代码 → GitHub Actions 自动构建
   ↓
Docker 镜像 → GHCR 自动推送
   ↓
服务器拉取 → 自动或手动部署
   ↓
Cloudflare CDN → 全球加速
   ↓
用户访问 → https://admin.zuo2799662352.xyz
```

---

**现在准备推送代码到 GitHub！** 🚀

**需要我创建推送脚本吗？**

