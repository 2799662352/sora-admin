# 🎨 Sora UI 管理后台 (Next.js)

> 基于 Next.js 14 + Ant Design 5 的现代化管理后台

[![Next.js](https://img.shields.io/badge/Next.js-14.1-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-5.12-red)](https://ant.design/)

---

## ✨ 功能特性

- 📊 **仪表盘** - 数据统计和可视化
- 👥 **用户管理** - 用户列表、创建、编辑
- 🎫 **许可证管理** - 生成、激活、查询
- 📝 **日志查询** - 操作日志、登录日志
- ⚙️ **系统设置** - 配置管理

---

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **UI**: Ant Design 5
- **语言**: TypeScript
- **状态**: React Query + Zustand
- **HTTP**: Axios
- **部署**: Docker

---

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问: http://localhost:3000
```

### 生产构建

```bash
# 构建
npm run build

# 启动
npm start
```

### Docker 部署

```bash
# 构建镜像
docker build -t sora-admin-nextjs .

# 运行容器
docker run -p 3000:3000 sora-admin-nextjs
```

---

## 📋 API 配置

配置后端 API 地址:

```env
# .env.local (本地开发)
NEXT_PUBLIC_API_URL=http://localhost:3001

# .env (生产环境)
NEXT_PUBLIC_API_URL=https://api.zuo2799662352.xyz
```

---

## 📁 项目结构

```
sora-admin-nextjs/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # 根布局
│   │   ├── page.tsx      # 首页
│   │   ├── login/        # 登录页
│   │   └── dashboard/    # 仪表盘
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── users/    # 用户管理
│   │       ├── licenses/ # 许可证管理
│   │       └── logs/     # 日志查询
│   │
│   ├── services/         # API 服务
│   │   ├── api.ts
│   │   └── auth.ts
│   │
│   ├── components/       # 组件
│   └── utils/            # 工具函数
│
├── public/               # 静态资源
├── Dockerfile            # Docker 配置
├── next.config.js        # Next.js 配置
├── package.json          # 依赖配置
└── tsconfig.json         # TypeScript 配置
```

---

## 🔐 默认登录

```
用户名: admin
密码: admin123
```

---

## 📦 部署

### 部署到生产服务器

```bash
# 1. 构建镜像
docker build -t sora-admin:latest .

# 2. 运行容器
docker run -d \
  -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://api.zuo2799662352.xyz \
  --name sora-admin \
  sora-admin:latest

# 3. 查看日志
docker logs -f sora-admin
```

---

## 🌐 访问地址

**开发环境**: http://localhost:3000  
**生产环境**: https://admin.zuo2799662352.xyz

---

## 📚 开发指南

### 添加新页面

```tsx
// src/app/dashboard/new-page/page.tsx
export default function NewPage() {
  return <div>New Page</div>;
}
```

### 调用 API

```tsx
import { getUsers } from '@/services/api';

const users = await getUsers(1, 10);
```

---

## 🎯 功能模块

### 已实现

- ✅ 登录认证
- ✅ 仪表盘
- ✅ 用户管理 (列表)
- ✅ 许可证管理 (列表)
- ✅ 日志查询 (列表)

### 待完善

- 🔄 用户创建/编辑
- 🔄 许可证生成
- 🔄 数据图表
- 🔄 高级搜索
- 🔄 导出功能

---

## 📄 许可证

MIT

---

**🎬 Sora UI Admin - 让管理更简单！**

