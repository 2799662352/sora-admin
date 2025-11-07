// src/app/dashboard/logs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Table, Tag, Select, Space } from 'antd';
import { getLogs } from '@/services/api';

export default function LogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [actionFilter, setActionFilter] = useState<string | undefined>(undefined);

  useEffect(() => {
    loadLogs();
  }, [currentPage, actionFilter]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await getLogs(currentPage, pageSize, actionFilter);
      setLogs(res.data?.items || []);
      setTotal(res.data?.total || 0);
    } catch (error) {
      console.error('加载日志失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '用户',
      dataIndex: ['user', 'username'],
      key: 'username',
      render: (username: string) => username || '-',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (action: string) => {
        const colorMap: Record<string, string> = {
          login: 'blue',
          register: 'green',
          activate_license: 'purple',
          generate_video: 'orange',
          download_update: 'cyan',
        };
        return <Tag color={colorMap[action] || 'default'}>{action}</Tag>;
      },
    },
    {
      title: 'IP 地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '详情',
      dataIndex: 'details',
      key: 'details',
      ellipsis: true,
      render: (details: any) => JSON.stringify(details),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>📝 操作日志</h1>
        <Space>
          <Select
            placeholder="筛选操作类型"
            allowClear
            style={{ width: 200 }}
            onChange={setActionFilter}
          >
            <Select.Option value="login">登录</Select.Option>
            <Select.Option value="register">注册</Select.Option>
            <Select.Option value="activate_license">激活许可证</Select.Option>
            <Select.Option value="generate_video">生成视频</Select.Option>
            <Select.Option value="download_update">下载更新</Select.Option>
          </Select>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={logs}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: setCurrentPage,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />
    </div>
  );
}

