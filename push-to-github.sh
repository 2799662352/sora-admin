#!/bin/bash

# 初始化 Git (如果还未初始化)
if [ ! -d .git ]; then
    git init
    git add .
    git commit -m "feat: 初始化 Sora Admin 管理后台

- Next.js 14 + Ant Design 5
- TypeScript 类型安全
- Docker 容器化部署
- GitHub Actions 自动构建镜像
- 用户管理、许可证管理、日志查询"
fi

# 设置远程仓库
git remote remove origin 2>/dev/null
git remote add origin https://github.com/2799662352/sora-admin-nextjs.git

# 设置主分支为 main
git branch -M main

# 推送到 GitHub
git push -u origin main --force

echo "✅ 代码已推送到 GitHub!"
echo "🔗 仓库地址: https://github.com/2799662352/sora-admin-nextjs"


# 初始化 Git (如果还未初始化)
if [ ! -d .git ]; then
    git init
    git add .
    git commit -m "feat: 初始化 Sora Admin 管理后台

- Next.js 14 + Ant Design 5
- TypeScript 类型安全
- Docker 容器化部署
- GitHub Actions 自动构建镜像
- 用户管理、许可证管理、日志查询"
fi

# 设置远程仓库
git remote remove origin 2>/dev/null
git remote add origin https://github.com/2799662352/sora-admin-nextjs.git

# 设置主分支为 main
git branch -M main

# 推送到 GitHub
git push -u origin main --force

echo "✅ 代码已推送到 GitHub!"
echo "🔗 仓库地址: https://github.com/2799662352/sora-admin-nextjs"

