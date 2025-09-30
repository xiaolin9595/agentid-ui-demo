import React, { useState, useMemo } from 'react';
import {
  Modal,
  Table,
  Button,
  Space,
  Tag,
  Badge,
  Statistic,
  Row,
  Col,
  Card,
  Descriptions,
  Tooltip,
  message,
  Popconfirm,
  Form,
  Select,
  Input,
  DatePicker,
  Collapse,
  Typography
} from 'antd';
import {
  SafetyCertificateOutlined,
  KeyOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  UnlockOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { Agent } from '../../types/agent';
import type {
  VerifiableCredential,
  AgentPermissionClaim,
  PermissionType,
  PermissionAction,
  CredentialStatus
} from '../../types/credential';

const { Option } = Select;
const { TextArea } = Input;
const { Panel } = Collapse;
const { Text } = Typography;

interface AgentPermissionModalProps {
  open: boolean;
  agent: Agent | null;
  onClose: () => void;
  onUpdate?: (agentId: string, credentials: VerifiableCredential[]) => void;
}

/**
 * Agent 权限管理模态框
 * 基于 W3C Verifiable Credentials 标准管理 Agent 权限
 */
const AgentPermissionModal: React.FC<AgentPermissionModalProps> = ({
  open,
  agent,
  onClose,
  onUpdate
}) => {
  const [credentials, setCredentials] = useState<VerifiableCredential[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form] = Form.useForm();

  // 初始化示例凭证数据
  React.useEffect(() => {
    if (agent && open) {
      // 生成示例 VC 凭证
      const mockCredentials = generateMockCredentials(agent);
      setCredentials(mockCredentials);
    }
  }, [agent, open]);

  // 统计信息
  const statistics = useMemo(() => {
    const total = credentials.length;
    const active = credentials.filter(c => isCredentialActive(c)).length;
    const revoked = credentials.filter(c => c.credentialStatus?.status === 'revoked').length;
    const expired = credentials.filter(c => isCredentialExpired(c)).length;

    return { total, active, revoked, expired };
  }, [credentials]);

  // 判断凭证是否活跃
  const isCredentialActive = (credential: VerifiableCredential): boolean => {
    if (credential.credentialStatus?.status !== 'active') return false;
    if (isCredentialExpired(credential)) return false;
    return true;
  };

  // 判断凭证是否过期
  const isCredentialExpired = (credential: VerifiableCredential): boolean => {
    if (!credential.expirationDate) return false;
    return new Date(credential.expirationDate) < new Date();
  };

  // 获取凭证状态
  const getCredentialStatus = (credential: VerifiableCredential): {
    status: 'success' | 'error' | 'warning' | 'default';
    text: string;
  } => {
    if (credential.credentialStatus?.status === 'revoked') {
      return { status: 'error', text: '已撤销' };
    }
    if (isCredentialExpired(credential)) {
      return { status: 'warning', text: '已过期' };
    }
    if (credential.credentialStatus?.status === 'suspended') {
      return { status: 'warning', text: '已暂停' };
    }
    return { status: 'success', text: '活跃' };
  };

  // 撤销凭证
  const handleRevokeCredential = (credentialId: string) => {
    const updatedCredentials = credentials.map(c => {
      if (c.id === credentialId) {
        return {
          ...c,
          credentialStatus: {
            id: `${c.id}/status`,
            type: 'CredentialStatusList2021',
            status: 'revoked' as const,
            statusReason: '管理员撤销',
            statusDate: new Date().toISOString()
          }
        };
      }
      return c;
    });

    setCredentials(updatedCredentials);
    message.success('凭证已撤销');

    if (onUpdate && agent) {
      onUpdate(agent.id, updatedCredentials);
    }
  };

  // 添加新凭证
  const handleAddCredential = async () => {
    try {
      const values = await form.validateFields();

      const newCredential: VerifiableCredential = {
        '@context': [
          'https://www.w3.org/2018/credentials/v1',
          'https://w3id.org/security/suites/jws-2020/v1'
        ],
        id: `urn:uuid:${generateUUID()}`,
        type: ['VerifiableCredential', 'AgentPermissionCredential'],
        issuer: {
          id: 'did:example:system-issuer',
          name: 'AgentID System',
          type: ['Organization']
        },
        issuanceDate: new Date().toISOString(),
        expirationDate: values.expirationDate ? values.expirationDate.toISOString() : undefined,
        credentialSubject: {
          id: agent?.agentId || '',
          name: agent?.name || '',
          type: 'Agent',
          permissions: [{
            id: `permission-${Date.now()}`,
            type: values.permissionType,
            resource: values.resource,
            actions: values.actions,
            constraints: values.constraints ? [{
              type: 'context' as const,
              value: values.constraints,
              description: values.constraints
            }] : [],
            grantedAt: new Date().toISOString(),
            grantedBy: 'system-admin',
            priority: 1,
            delegable: false
          }],
          scope: values.scope || [],
          validFrom: new Date().toISOString(),
          validUntil: values.expirationDate ? values.expirationDate.toISOString() : undefined
        },
        proof: {
          type: 'JsonWebSignature2020',
          created: new Date().toISOString(),
          proofPurpose: 'assertionMethod',
          verificationMethod: 'did:example:system-issuer#key-1',
          jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..' // 模拟签名
        },
        credentialStatus: {
          id: `urn:uuid:${generateUUID()}/status`,
          type: 'CredentialStatusList2021',
          status: 'active',
          statusDate: new Date().toISOString()
        }
      };

      setCredentials([...credentials, newCredential]);
      message.success('权限凭证添加成功');
      setShowAddForm(false);
      form.resetFields();

      if (onUpdate && agent) {
        onUpdate(agent.id, [...credentials, newCredential]);
      }
    } catch (error) {
      console.error('添加凭证失败:', error);
    }
  };

  // 表格列定义
  const columns: ColumnsType<VerifiableCredential> = [
    {
      title: '凭证ID',
      dataIndex: 'id',
      key: 'id',
      width: 200,
      render: (id: string) => (
        <Tooltip title={id}>
          <Tag color="blue">{id.substring(0, 20)}...</Tag>
        </Tooltip>
      ),
    },
    {
      title: '凭证类型',
      dataIndex: 'type',
      key: 'type',
      width: 200,
      render: (types: string[]) => (
        <Space>
          {types.filter(t => t !== 'VerifiableCredential').map(type => (
            <Tag key={type} color="purple">{type}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '发行者',
      dataIndex: 'issuer',
      key: 'issuer',
      width: 150,
      render: (issuer: any) => (
        <Tooltip title={typeof issuer === 'string' ? issuer : issuer.id}>
          <Text>{typeof issuer === 'string' ? issuer : issuer.name}</Text>
        </Tooltip>
      ),
    },
    {
      title: '发行日期',
      dataIndex: 'issuanceDate',
      key: 'issuanceDate',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '过期日期',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      width: 120,
      render: (date?: string) => date ? dayjs(date).format('YYYY-MM-DD') : '永久',
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_, record) => {
        const { status, text } = getCredentialStatus(record);
        return <Badge status={status} text={text} />;
      },
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Popconfirm
            title="确认撤销"
            description="撤销后该凭证将无法恢复，确定要撤销吗？"
            onConfirm={() => handleRevokeCredential(record.id)}
            okText="确定"
            cancelText="取消"
            disabled={record.credentialStatus?.status === 'revoked'}
          >
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              disabled={record.credentialStatus?.status === 'revoked'}
            >
              撤销
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 展开行渲染 - 显示详细权限
  const expandedRowRender = (record: VerifiableCredential) => {
    const permissions = record.credentialSubject.permissions;

    return (
      <Card size="small" title="权限详情">
        <Descriptions bordered size="small">
          <Descriptions.Item label="主体ID" span={3}>
            {record.credentialSubject.id}
          </Descriptions.Item>
          <Descriptions.Item label="作用域" span={3}>
            {record.credentialSubject.scope.map(s => (
              <Tag key={s} color="cyan">{s}</Tag>
            ))}
          </Descriptions.Item>
          <Descriptions.Item label="有效期" span={3}>
            {dayjs(record.credentialSubject.validFrom).format('YYYY-MM-DD HH:mm')} 至{' '}
            {record.credentialSubject.validUntil
              ? dayjs(record.credentialSubject.validUntil).format('YYYY-MM-DD HH:mm')
              : '永久'}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 16 }}>
          <h4>权限列表</h4>
          {permissions.map((permission, index) => (
            <Card key={permission.id} size="small" style={{ marginBottom: 8 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <strong>权限 {index + 1}:</strong>
                  <Tag color="green" style={{ marginLeft: 8 }}>{permission.type}</Tag>
                </div>
                <div>
                  <strong>资源:</strong> {permission.resource}
                </div>
                <div>
                  <strong>操作:</strong>
                  <Space style={{ marginLeft: 8 }}>
                    {permission.actions.map(action => (
                      <Tag key={action} color="blue">{action}</Tag>
                    ))}
                  </Space>
                </div>
                {permission.constraints && permission.constraints.length > 0 && (
                  <div>
                    <strong>约束条件:</strong>
                    {permission.constraints.map((constraint, i) => (
                      <Tag key={i} color="orange" style={{ marginLeft: 8 }}>
                        {constraint.type}: {constraint.description}
                      </Tag>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: '12px', color: '#999' }}>
                  授予时间: {dayjs(permission.grantedAt).format('YYYY-MM-DD HH:mm')} |
                  授予者: {permission.grantedBy}
                </div>
              </Space>
            </Card>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <Modal
      title={
        <Space>
          <SafetyCertificateOutlined />
          <span>Agent 权限管理 - {agent?.name}</span>
        </Space>
      }
      open={open}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="close" onClick={onClose}>
          关闭
        </Button>
      ]}
    >
      {/* 统计信息 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总凭证数"
              value={statistics.total}
              prefix={<SafetyCertificateOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃凭证"
              value={statistics.active}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已撤销"
              value={statistics.revoked}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已过期"
              value={statistics.expired}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 添加凭证按钮 */}
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '取消添加' : '添加权限凭证'}
        </Button>
      </div>

      {/* 添加凭证表单 */}
      {showAddForm && (
        <Card style={{ marginBottom: 16 }}>
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="权限类型"
                  name="permissionType"
                  rules={[{ required: true, message: '请选择权限类型' }]}
                >
                  <Select placeholder="选择权限类型">
                    <Option value="READ">读取</Option>
                    <Option value="WRITE">写入</Option>
                    <Option value="EXECUTE">执行</Option>
                    <Option value="DELETE">删除</Option>
                    <Option value="ADMIN">管理员</Option>
                    <Option value="API_ACCESS">API访问</Option>
                    <Option value="DATA_ACCESS">数据访问</Option>
                    <Option value="NETWORK_ACCESS">网络访问</Option>
                    <Option value="FILE_SYSTEM">文件系统</Option>
                    <Option value="DATABASE">数据库</Option>
                    <Option value="EXTERNAL_SERVICE">外部服务</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="资源名称"
                  name="resource"
                  rules={[{ required: true, message: '请输入资源名称' }]}
                >
                  <Input placeholder="例如: /api/users, database.users" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="操作权限"
              name="actions"
              rules={[{ required: true, message: '请选择至少一个操作' }]}
            >
              <Select mode="multiple" placeholder="选择允许的操作">
                <Option value="read">读取</Option>
                <Option value="write">写入</Option>
                <Option value="update">更新</Option>
                <Option value="delete">删除</Option>
                <Option value="create">创建</Option>
                <Option value="list">列表</Option>
                <Option value="get">获取</Option>
                <Option value="execute">执行</Option>
                <Option value="invoke">调用</Option>
                <Option value="call">呼叫</Option>
              </Select>
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="作用域" name="scope">
                  <Select mode="tags" placeholder="输入作用域标签">
                    <Option value="production">生产环境</Option>
                    <Option value="development">开发环境</Option>
                    <Option value="testing">测试环境</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="过期日期" name="expirationDate">
                  <DatePicker style={{ width: '100%' }} placeholder="不设置则永久有效" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="约束条件（可选）" name="constraints">
              <TextArea
                rows={2}
                placeholder="例如: 仅在工作时间访问, IP白名单限制等"
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" onClick={handleAddCredential}>
                  创建凭证
                </Button>
                <Button onClick={() => {
                  setShowAddForm(false);
                  form.resetFields();
                }}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      {/* 凭证列表表格 */}
      <Table
        columns={columns}
        dataSource={credentials}
        rowKey="id"
        expandable={{
          expandedRowRender,
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <UnlockOutlined onClick={e => onExpand(record, e)} style={{ cursor: 'pointer' }} />
            ) : (
              <LockOutlined onClick={e => onExpand(record, e)} style={{ cursor: 'pointer' }} />
            )
        }}
        pagination={{ pageSize: 5 }}
      />
    </Modal>
  );
};

// 辅助函数

/**
 * 生成示例 VC 凭证
 */
const generateMockCredentials = (agent: Agent): VerifiableCredential[] => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // 1年后

  return [
    {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/suites/jws-2020/v1'
      ],
      id: `urn:uuid:${generateUUID()}`,
      type: ['VerifiableCredential', 'AgentPermissionCredential'],
      issuer: {
        id: 'did:example:system-issuer',
        name: 'AgentID System',
        type: ['Organization']
      },
      issuanceDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      expirationDate: futureDate.toISOString(),
      credentialSubject: {
        id: agent.agentId,
        name: agent.name,
        type: 'Agent',
        permissions: [
          {
            id: `permission-${Date.now()}-1`,
            type: 'API_ACCESS' as PermissionType,
            resource: '/api/data/*',
            actions: ['read' as PermissionAction, 'write' as PermissionAction],
            constraints: [],
            grantedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            grantedBy: 'admin',
            priority: 1,
            delegable: false
          },
          {
            id: `permission-${Date.now()}-2`,
            type: 'DATABASE' as PermissionType,
            resource: 'database.users',
            actions: ['read' as PermissionAction, 'update' as PermissionAction],
            constraints: [{
              type: 'time',
              value: '09:00-18:00',
              description: '仅在工作时间访问'
            }],
            grantedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            grantedBy: 'admin',
            priority: 2,
            delegable: false
          }
        ],
        scope: ['production', 'api-access'],
        validFrom: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        validUntil: futureDate.toISOString()
      },
      proof: {
        type: 'JsonWebSignature2020',
        created: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        proofPurpose: 'assertionMethod',
        verificationMethod: 'did:example:system-issuer#key-1',
        jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..'
      },
      credentialStatus: {
        id: `urn:uuid:${generateUUID()}/status`,
        type: 'CredentialStatusList2021',
        status: 'active',
        statusDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://w3id.org/security/suites/jws-2020/v1'
      ],
      id: `urn:uuid:${generateUUID()}`,
      type: ['VerifiableCredential', 'AgentPermissionCredential'],
      issuer: 'did:example:security-team',
      issuanceDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      credentialSubject: {
        id: agent.agentId,
        name: agent.name,
        type: 'Agent',
        permissions: [
          {
            id: `permission-${Date.now()}-3`,
            type: 'FILE_SYSTEM' as PermissionType,
            resource: '/data/temp/*',
            actions: ['read' as PermissionAction, 'write' as PermissionAction, 'delete' as PermissionAction],
            constraints: [],
            grantedAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            grantedBy: 'security-admin',
            priority: 3,
            delegable: false
          }
        ],
        scope: ['file-system'],
        validFrom: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString()
      },
      proof: {
        type: 'JsonWebSignature2020',
        created: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        proofPurpose: 'assertionMethod',
        verificationMethod: 'did:example:security-team#key-1',
        jws: 'eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..'
      },
      credentialStatus: {
        id: `urn:uuid:${generateUUID()}/status`,
        type: 'CredentialStatusList2021',
        status: 'revoked',
        statusReason: '安全审计失败',
        statusDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    }
  ];
};

/**
 * 生成 UUID
 */
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export default AgentPermissionModal;