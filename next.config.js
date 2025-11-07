/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  
  // 环境变量
  env: {
    NEXT_PUBLIC_APP_NAME: 'Sora UI Admin',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },

  // 图片优化
  images: {
    domains: ['api.zuo2799662352.xyz', 'update.zuo2799662352.xyz'],
  },

  // 实验性功能
  experimental: {
    optimizePackageImports: ['antd', '@ant-design/icons'],
  },
};

module.exports = nextConfig;

