// src/app/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '@/services/auth';

const { Title, Text } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    
    try {
      const result = await login(values.username, values.password);
      
      console.log('[Login] API 响应:', result);
      
      if (result.success && result.data) {
        message.success('登录成功！');
        
        // 保存 Token 和用户信息
        const token = result.data.token;
        const user = result.data.user;
        
        console.log('[Login] Token:', token);
        console.log('[Login] User:', user);
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_token', token);
          localStorage.setItem('admin_user', JSON.stringify(user));
          
          console.log('[Login] 数据已保存到 localStorage');
        }
        
        // 延迟跳转，确保数据保存完成
        setTimeout(() => {
          console.log('[Login] 跳转到仪表盘...');
          router.push('/dashboard');
          // 强制刷新确保跳转
          window.location.href = '/dashboard';
        }, 500);
      } else {
        message.error(result.message || '登录失败');
      }
    } catch (error: any) {
      console.error('[Login] 错误:', error);
      message.error(error.message || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }}>
      <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 8 }}>
            🎬 Sora UI
          </Title>
          <Text type="secondary">管理后台</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Sora UI Admin v1.0.0
          </Text>
        </div>
      </Card>
    </div>
  );
}

