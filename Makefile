# Makefile for Sora Admin Next.js

.PHONY: help install dev build start docker-build docker-run clean

## help: 显示帮助信息
help:
	@echo "Sora Admin Next.js - 可用命令:"
	@echo ""
	@echo "  make install       - 安装依赖"
	@echo "  make dev           - 启动开发服务器"
	@echo "  make build         - 构建生产版本"
	@echo "  make start         - 启动生产服务器"
	@echo "  make docker-build  - 构建 Docker 镜像"
	@echo "  make docker-run    - 运行 Docker 容器"
	@echo "  make clean         - 清理构建文件"
	@echo ""

## install: 安装依赖
install:
	@echo "📦 安装依赖..."
	npm install
	@echo "✅ 依赖安装完成"

## dev: 启动开发服务器
dev:
	@echo "🚀 启动开发服务器..."
	npm run dev

## build: 构建生产版本
build:
	@echo "📦 构建生产版本..."
	npm run build
	@echo "✅ 构建完成"

## start: 启动生产服务器
start:
	@echo "🚀 启动生产服务器..."
	npm start

## docker-build: 构建 Docker 镜像
docker-build:
	@echo "🐳 构建 Docker 镜像..."
	docker build -t sora-admin-nextjs:latest .
	@echo "✅ Docker 镜像构建完成"

## docker-run: 运行 Docker 容器
docker-run:
	@echo "🚀 运行 Docker 容器..."
	docker run -d \
		-p 3000:3000 \
		-e NEXT_PUBLIC_API_URL=https://api.zuo2799662352.xyz \
		--name sora-admin \
		sora-admin-nextjs:latest
	@echo "✅ 容器已启动: http://localhost:3000"

## clean: 清理构建文件
clean:
	@echo "🧹 清理构建文件..."
	rm -rf .next
	rm -rf node_modules
	@echo "✅ 清理完成"

