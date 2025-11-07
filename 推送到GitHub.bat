@echo off
chcp 65001 >nul
cls
echo.
echo ╔══════════════════════════════════════════════════╗
echo ║   📤 推送 Next.js 管理后台到 GitHub             ║
echo ╚══════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo 🎯 仓库地址: https://github.com/2799662352/sora-admin-nextjs
echo.

REM 检查 Git 是否已初始化
if not exist ".git" (
    echo [1/5] 初始化 Git 仓库...
    git init
    echo ✅ Git 已初始化
) else (
    echo ✅ Git 仓库已存在
)
echo.

echo [2/5] 添加所有文件...
git add .
echo ✅ 文件已添加
echo.

echo [3/5] 提交代码...
git commit -m "feat: 初始化 Next.js 管理后台项目

- Next.js 14 + Ant Design 5
- 用户管理
- 许可证管理
- 日志查询
- Docker 支持
- GitHub Actions CI/CD"

echo ✅ 代码已提交
echo.

echo [4/5] 设置远程仓库...
git remote remove origin 2>nul
git remote add origin https://github.com/2799662352/sora-admin-nextjs.git
echo ✅ 远程仓库已设置
echo.

echo [5/5] 推送到 GitHub...
git branch -M main
git push -u origin main --force

if %errorlevel% equ 0 (
    echo.
    echo ╔══════════════════════════════════════════════════╗
    echo ║   🎉 推送成功！                                  ║
    echo ╚══════════════════════════════════════════════════╝
    echo.
    echo 📦 仓库地址: https://github.com/2799662352/sora-admin-nextjs
    echo.
    echo 🔄 GitHub Actions 将自动:
    echo    1. 构建 Docker 镜像
    echo    2. 推送到 GHCR
    echo.
    echo 🐳 镜像地址:
    echo    ghcr.io/2799662352/sora-admin-nextjs:latest
    echo.
    echo 📋 查看 Actions:
    echo    https://github.com/2799662352/sora-admin-nextjs/actions
    echo.
) else (
    echo.
    echo ❌ 推送失败
    echo.
    echo 💡 可能需要先登录 GitHub
    echo    使用 GitHub Desktop 或配置 SSH key
    echo.
)

pause

