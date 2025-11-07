// src/app/dashboard/licenses/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Modal, Form, Select, InputNumber, message, Descriptions } from 'antd';
import { PlusOutlined, EyeOutlined, StopOutlined } from '@ant-design/icons';
import { getLicenses, generateLicense, revokeLicense } from '@/services/api';

export default function LicensesPage() {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadLicenses();
  }, [currentPage]);

  const loadLicenses = async () => {
    setLoading(true);
    try {
      const res = await getLicenses(currentPage, pageSize);
      setLicenses(res.data?.items || []);
      setTotal(res.data?.total || 0);
    } catch (error: any) {
      message.error('加载许可证列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (values: any) => {
    try {
      const res = await generateLicense({
        type: values.type,
        durationDays: values.durationDays || 0, // 0 表示永久
      });
      
      Modal.success({
        title: '许可证生成成功',
        content: (
          <div>
            <p>许可证密钥：</p>
            <Input.TextArea
              value={res.data.licenseKey}
              autoSize
              readOnly
              style={{ marginTop: 8, fontFamily: 'monospace' }}
            />
          </div>
        ),
      });
      
      setModalOpen(false);
      form.resetFields();
      loadLicenses();
    } catch (error: any) {
      message.error(error.message || '生成失败');
    }
  };

  const handleViewDetail = (record: any) => {
    setSelectedLicense(record);
    setDetailModalOpen(true);
  };

  const handleRevoke = async (id: string, licenseKey: string) => {
    Modal.confirm({
      title: '确认吊销',
      content: `确定要吊销许可证 "${licenseKey.substring(0, 30)}..." 吗？`,
      okText: '确定',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await revokeLicense(id);
          message.success('吊销成功');
          loadLicenses();
        } catch (error) {
          message.error('吊销失败');
        }
      },
    });
  };

  const columns = [
    {
      title: '许可证密钥',
      dataIndex: 'licenseKey',
      key: 'licenseKey',
      width: 300,
      ellipsis: true,
      render: (key: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
          {key.substring(0, 30)}...
        </span>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          TRIAL: 'default',
          PRO: 'blue',
          ENTERPRISE: 'purple',
        };
        return <Tag color={colorMap[type]}>{type}</Tag>;
      },
    },
    {
      title: '用户',
      dataIndex: ['user', 'username'],
      key: 'username',
      render: (username: string) => username || '-',
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record: any) => {
        if (!isActive) return <Tag color="error">已禁用</Tag>;
        
        if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
          return <Tag color="warning">已过期</Tag>;
        }
        
        return <Tag color="success">正常</Tag>;
      },
    },
    {
      title: '激活时间',
      dataIndex: 'activatedAt',
      key: 'activatedAt',
      render: (date: string) => date ? new Date(date).toLocaleDateString('zh-CN') : '-',
    },
    {
      title: '过期时间',
      dataIndex: 'expiresAt',
      key: 'expiresAt',
      render: (date: string) => date ? new Date(date).toLocaleDateString('zh-CN') : '永久',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            详情
          </Button>
          {record.isActive && (
            <Button
              type="link"
              danger
              size="small"
              icon={<StopOutlined />}
              onClick={() => handleRevoke(record.id, record.licenseKey)}
            >
              吊销
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h1>🎫 许可证管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          生成许可证
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={licenses}
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

      {/* 生成许可证 Modal */}
      <Modal
        title="生成许可证"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleGenerate}>
          <Form.Item
            label="许可证类型"
            name="type"
            rules={[{ required: true, message: '请选择许可证类型' }]}
            initialValue="PRO"
          >
            <Select>
              <Select.Option value="TRIAL">试用版 (TRIAL)</Select.Option>
              <Select.Option value="PRO">专业版 (PRO)</Select.Option>
              <Select.Option value="ENTERPRISE">企业版 (ENTERPRISE)</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="有效期 (天)"
            name="durationDays"
            tooltip="0 或不填表示永久有效"
            initialValue={0}
          >
            <InputNumber
              min={0}
              max={3650}
              placeholder="0表示永久"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit">
                生成
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情 Modal */}
      <Modal
        title="许可证详情"
        open={detailModalOpen}
        onCancel={() => setDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalOpen(false)}>
            关闭
          </Button>,
        ]}
        width={700}
      >
        {selectedLicense && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="许可证密钥" span={2}>
              <span style={{ fontFamily: 'monospace', fontSize: 12, wordBreak: 'break-all' }}>
                {selectedLicense.licenseKey}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="类型">{selectedLicense.type}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={selectedLicense.isActive ? 'success' : 'error'}>
                {selectedLicense.isActive ? '正常' : '已禁用'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="用户">
              {selectedLicense.user?.username || '未激活'}
            </Descriptions.Item>
            <Descriptions.Item label="设备ID">
              {selectedLicense.deviceId || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="创建时间">
              {new Date(selectedLicense.createdAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
            <Descriptions.Item label="激活时间">
              {selectedLicense.activatedAt
                ? new Date(selectedLicense.activatedAt).toLocaleString('zh-CN')
                : '未激活'}
            </Descriptions.Item>
            <Descriptions.Item label="过期时间">
              {selectedLicense.expiresAt
                ? new Date(selectedLicense.expiresAt).toLocaleString('zh-CN')
                : '永久'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
}

