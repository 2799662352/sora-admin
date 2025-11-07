@echo off
chcp 65001 >nul
cls
echo.
echo ╔══════════════════════════════════════════╗
echo ║  🎨 Sora Admin Next.js                  ║
echo ╚══════════════════════════════════════════╝
echo.

cd /d "%~dp0"

:menu
echo 请选择操作:
echo.
echo [1] 📦 安装依赖
echo [2] 🚀 启动开发服务器
echo [3] 🏗️ 构建生产版本
echo [4] ▶️ 启动生产服务器
echo [5] 🐳 Docker 构建并运行
echo [0] 退出
echo.
set /p choice=请输入选项 (0-5): 

if "%choice%"=="1" goto install
if "%choice%"=="2" goto dev
if "%choice%"=="3" goto build
if "%choice%"=="4" goto start
if "%choice%"=="5" goto docker
if "%choice%"=="0" goto end
goto menu

:install
echo.
echo 📦 安装依赖...
echo ════════════════════════════════════════════
echo.
call npm install
echo.
echo ✅ 依赖安装完成！
echo.
pause
goto menu

:dev
echo.
echo 🚀 启动开发服务器...
echo ════════════════════════════════════════════
echo.
if not exist "node_modules" (
    echo ⚠️ 依赖未安装，正在安装...
    call npm install
    echo.
)
echo ✅ 服务器将启动在: http://localhost:3000
echo.
call npm run dev
goto menu

:build
echo.
echo 🏗️ 构建生产版本...
echo ════════════════════════════════════════════
echo.
call npm run build
echo.
echo ✅ 构建完成！
echo.
pause
goto menu

:start
echo.
echo ▶️ 启动生产服务器...
echo ════════════════════════════════════════════
echo.
if not exist ".next" (
    echo ❌ 未找到构建文件，请先执行构建
    echo.
    pause
    goto menu
)
echo ✅ 服务器将启动在: http://localhost:3000
echo.
call npm start
goto menu

:docker
echo.
echo 🐳 Docker 构建并运行...
echo ════════════════════════════════════════════
echo.
echo [1/2] 构建 Docker 镜像...
docker build -t sora-admin-nextjs:latest .
if %errorlevel% neq 0 (
    echo.
    echo ❌ Docker 构建失败
    pause
    goto menu
)
echo ✅ 镜像构建完成
echo.
echo [2/2] 启动容器...
docker run -d ^
    -p 3000:3000 ^
    -e NEXT_PUBLIC_API_URL=https://api.zuo2799662352.xyz ^
    --name sora-admin ^
    sora-admin-nextjs:latest

if %errorlevel% neq 0 (
    echo.
    echo ❌ 容器启动失败
    echo 💡 可能容器已存在，尝试删除: docker rm -f sora-admin
    pause
    goto menu
)
echo.
echo ✅ 容器已启动！
echo 📡 访问地址: http://localhost:3000
echo.
pause
goto menu

:end
echo.
echo 👋 再见！
timeout /t 2 >nul
exit

