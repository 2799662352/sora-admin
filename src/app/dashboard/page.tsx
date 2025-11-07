// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Alert } from 'antd';
import {
  UserOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { getUsers, getLicenses } from '@/services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLicenses: 0,
    activeLicenses: 0,
    todayLogins: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    console.log('[Dashboard] 开始加载数据...');
    
    try {
      // 加载用户数据 - 优雅降级
      try {
        console.log('[Dashboard] 请求用户数据...');
        const usersRes = await getUsers(1, 5);
        console.log('[Dashboard] 用户数据响应:', usersRes);
        
        if (usersRes.success && usersRes.data) {
          setStats(prev => ({
            ...prev,
            totalUsers: usersRes.data?.total || 0,
          }));
          setRecentUsers(usersRes.data?.items || []);
        }
      } catch (error) {
        console.warn('[Dashboard] 用户数据加载失败:', error);
        setHasError(true);
      }
      
      // 加载许可证数据 - 优雅降级
      try {
        console.log('[Dashboard] 请求许可证数据...');
        const licensesRes = await getLicenses(1, 10);
        console.log('[Dashboard] 许可证数据响应:', licensesRes);
        
        if (licensesRes.success && licensesRes.data) {
          setStats(prev => ({
            ...prev,
            totalLicenses: licensesRes.data?.total || 0,
            activeLicenses: licensesRes.data?.items?.filter((l: any) => l.isActive).length || 0,
          }));
        }
      } catch (error) {
        console.warn('[Dashboard] 许可证数据加载失败:', error);
        setHasError(true);
      }

    } catch (error) {
      console.error('[Dashboard] 加载仪表盘数据失败:', error);
      setHasError(true);
    } finally {
      setLoading(false);
      console.log('[Dashboard] 数据加载完成');
    }
  };

  const userColumns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'ADMIN' ? 'red' : 'blue'}>{role}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'success' : 'default'}>
          {isActive ? '活跃' : '禁用'}
        </Tag>
      ),
    },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>📊 仪表盘</h1>

      {hasError && (
        <Alert
          message="提示"
          description="部分管理 API 尚未实现，显示默认数据。后端需要添加 /api/admin/* 路由。"
          type="info"
          showIcon
          closable
          style={{ marginBottom: 24 }}
        />
      )}

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总用户数"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总许可证"
              value={stats.totalLicenses}
              prefix={<SafetyCertificateOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="激活许可证"
              value={stats.activeLicenses}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日登录"
              value={stats.todayLogins}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {recentUsers.length > 0 ? (
        <Card title="最近注册用户" style={{ marginTop: 24 }}>
          <Table
            columns={userColumns}
            dataSource={recentUsers}
            rowKey="id"
            loading={loading}
            pagination={false}
          />
        </Card>
      ) : (
        <Card title="欢迎使用 Sora UI 管理后台" style={{ marginTop: 24 }}>
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: 16, color: '#666', marginBottom: 16 }}>
              🎉 管理后台已成功启动！
            </p>
            <p style={{ color: '#999' }}>
              当前后端运行正常，可以开始使用管理功能
            </p>
            <p style={{ color: '#999', marginTop: 8 }}>
              💡 提示：部分管理功能需要后端实现对应的 API 接口
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
