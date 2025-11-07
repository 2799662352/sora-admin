// src/services/api.ts
// API 服务层 - 连接 Node.js 后端

import axios from 'axios';

// 动态获取 API 地址：优先使用环境变量，然后使用当前访问的主机名
const API_BASE_URL = typeof window !== 'undefined' 
  ? `http://${window.location.hostname}:3001` 
  : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

// 创建 axios 实例
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加 Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一错误处理
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期，跳转登录
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// ============ 用户相关 API ============

export const getUsers = async (page = 1, pageSize = 10) => {
  try {
    return await apiClient.get(`/api/admin/users`, {
      params: { page, pageSize },
    });
  } catch (error: any) {
    console.error('[API] 获取用户列表失败:', error);
    // 返回空数据而不是抛出错误
    return {
      success: false,
      data: { items: [], total: 0 },
      message: '管理API暂未实现',
    };
  }
};

export const createUser = async (data: {
  username: string;
  email: string;
  password: string;
  role?: string;
}) => {
  return apiClient.post('/api/admin/users', data);
};

export const updateUser = async (id: string, data: any) => {
  return apiClient.put(`/api/admin/users/${id}`, data);
};

export const deleteUser = async (id: string) => {
  return apiClient.delete(`/api/admin/users/${id}`);
};

// ============ 许可证相关 API ============

export const getLicenses = async (page = 1, pageSize = 10) => {
  try {
    return await apiClient.get(`/api/admin/licenses`, {
      params: { page, pageSize },
    });
  } catch (error: any) {
    console.error('[API] 获取许可证列表失败:', error);
    // 返回空数据而不是抛出错误
    return {
      success: false,
      data: { items: [], total: 0 },
      message: '管理API暂未实现',
    };
  }
};

export const generateLicense = async (data: {
  type: 'TRIAL' | 'PRO' | 'ENTERPRISE';
  durationDays?: number;
}) => {
  return apiClient.post('/api/admin/license/generate', data);
};

export const revokeLicense = async (id: string) => {
  return apiClient.post(`/api/admin/licenses/${id}/revoke`);
};

// ============ 日志相关 API ============

export const getLogs = async (page = 1, pageSize = 20, action?: string) => {
  return apiClient.get('/api/admin/logs', {
    params: { page, pageSize, action },
  });
};

// ============ 统计相关 API ============

export const getStatistics = async () => {
  return apiClient.get('/api/admin/statistics');
};

