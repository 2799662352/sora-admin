// src/services/auth.ts
// 认证服务

import { apiClient } from './api';

export interface LoginResponse {
  success: boolean;
  data?: {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
    };
    expiresAt: number;
  };
  message?: string;
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    console.log('[Auth Service] 登录请求:', { username });
    
    const response = await apiClient.post('/api/auth/login', {
      username,
      password,
    });
    
    console.log('[Auth Service] 登录响应:', response);
    
    // 适配后端响应格式
    const result = {
      success: (response as any).success || true,
      data: (response as any).data || response,
      message: (response as any).message,
    };
    
    console.log('[Auth Service] 格式化后:', result);
    
    return result as LoginResponse;
  } catch (error: any) {
    console.error('[Auth Service] 登录错误:', error);
    throw new Error(error.message || '登录失败');
  }
};

export const logout = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem('admin_user');
  return userData ? JSON.parse(userData) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('admin_token');
};

