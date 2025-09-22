import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Space,
  Radio,
  Switch,
  Alert,
  Spin,
  Steps,
  Progress,
  Tag,
  Divider,
  Row,
  Col,
  Typography,
  message,
  Card
} from 'antd';
import {
  WifiOutlined,
  SecurityScanOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  ApiOutlined,
  KeyOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import { useAgentDiscoveryStore } from '@/store/agentDiscoveryStore';
import {
  AgentDiscoveryItem,
  AgentCommunicationChannel,
  AgentCommunicationRequest
} from '@/types/agent-discovery';
import './styles/AgentCommunicationModal.css';

const { Option } = Select;
const { Text, Title } = Typography;
const { Step } = Steps;
const { Group: RadioGroup } = Radio;
const { Password } = Input;

interface AgentCommunicationModalProps {
  agent: AgentDiscoveryItem;
  visible: boolean;
  onClose: () => void;
  onEstablish: (channel: AgentCommunicationChannel) => void;
}

// 通信协议配置
const COMMUNICATION_PROTOCOLS = [
  {
    value: 'websocket',
    label: 'WebSocket',
    icon: <WifiOutlined />,
    description: '实时双向通信',
    defaultPort: 8080,
    security: ['tls', 'auth_token'],
    performance: { latency: '低', throughput: '高', reliability: '高' }
  },
  {
    value: 'http',
    label: 'HTTP REST',
    icon: <ApiOutlined />,
    description: 'RESTful API通信',
    defaultPort: 3000,
    security: ['https', 'api_key', 'oauth'],
    performance: { latency: '中', throughput: '中', reliability: '高' }
  },
  {
    value: 'grpc',
    label: 'gRPC',
    icon: <ApiOutlined />,
    description: '高性能RPC通信',
    defaultPort: 50051,
    security: ['tls', 'jwt'],
    performance: { latency: '低', throughput: '高', reliability: '高' }
  },
  {
    value: 'mqtt',
    label: 'MQTT',
    icon: <WifiOutlined />,
    description: '轻量级消息传输',
    defaultPort: 1883,
    security: ['tls', 'username_password'],
    performance: { latency: '低', throughput: '中', reliability: '中' }
  }
];

// 认证方式
const AUTHENTICATION_METHODS = [
  {
    value: 'none',
    label: '无认证',
    description: '不进行身份验证',
    fields: []
  },
  {
    value: 'api_key',
    label: 'API密钥',
    description: '使用API密钥进行认证',
    fields: [
      { name: 'apiKey', label: 'API密钥', type: 'password', required: true }
    ]
  },
  {
    value: 'jwt',
    label: 'JWT令牌',
    description: '使用JWT令牌进行认证',
    fields: [
      { name: 'jwtToken', label: 'JWT令牌', type: 'password', required: true }
    ]
  },
  {
    value: 'oauth',
    label: 'OAuth',
    description: '使用OAuth进行认证',
    fields: [
      { name: 'clientId', label: '客户端ID', type: 'text', required: true },
      { name: 'clientSecret', label: '客户端密钥', type: 'password', required: true }
    ]
  },
  {
    value: 'certificate',
    label: '证书认证',
    description: '使用SSL证书进行认证',
    fields: [
      { name: 'certificate', label: '证书文件', type: 'upload', required: true },
      { name: 'privateKey', label: '私钥文件', type: 'upload', required: true }
    ]
  }
];

// 连接步骤
const CONNECTION_STEPS = [
  { title: '协议选择', icon: <ApiOutlined /> },
  { title: '安全配置', icon: <SecurityScanOutlined /> },
  { title: '认证设置', icon: <KeyOutlined /> },
  { title: '建立连接', icon: <WifiOutlined /> }
];

export const AgentCommunicationModal: React.FC<AgentCommunicationModalProps> = ({
  agent,
  visible,
  onClose,
  onEstablish
}) => {
  const [form] = Form.useForm();
  const {
    communicationChannels,
    isEstablishingCommunication,
    communicationError,
    establishCommunication
  } = useAgentDiscoveryStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedProtocol, setSelectedProtocol] = useState('websocket');
  const [authMethod, setAuthMethod] = useState('none');
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [connectionProgress, setConnectionProgress] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      resetForm();
    }
  }, [visible]);

  // 重置表单
  const resetForm = () => {
    setCurrentStep(0);
    setSelectedProtocol('websocket');
    setAuthMethod('none');
    setEncryptionEnabled(true);
    setConnectionProgress(0);
    setConnectionStatus('idle');
    setConnectionError(null);
    form.resetFields();
  };

  // 获取当前协议配置
  const getCurrentProtocol = () => {
    return COMMUNICATION_PROTOCOLS.find(p => p.value === selectedProtocol);
  };

  // 获取当前认证方法配置
  const getCurrentAuthMethod = () => {
    return AUTHENTICATION_METHODS.find(m => m.value === authMethod);
  };

  // 处理协议变更
  const handleProtocolChange = (protocol: string) => {
    setSelectedProtocol(protocol);

    // 根据协议推荐认证方式
    if (protocol === 'websocket') {
      setAuthMethod('api_key');
    } else if (protocol === 'http') {
      setAuthMethod('oauth');
    } else if (protocol === 'grpc') {
      setAuthMethod('jwt');
    } else {
      setAuthMethod('none');
    }
  };

  // 处理步骤变更
  const handleStepChange = (step: number) => {
    if (step >= 0 && step < CONNECTION_STEPS.length) {
      setCurrentStep(step);
    }
  };

  // 下一步
  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        // 验证协议选择
        if (!selectedProtocol) {
          message.error('请选择通信协议');
          return;
        }
      } else if (currentStep === 1) {
        // 验证安全配置
        await form.validateFields(['encryptionEnabled']);
      } else if (currentStep === 2) {
        // 验证认证信息
        const authFields = getCurrentAuthMethod()?.fields || [];
        if (authFields.length > 0) {
          await form.validateFields(authFields.map(f => f.name));
        }
      }

      if (currentStep < CONNECTION_STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        // 最后一步：建立连接
        await establishConnection();
      }
    } catch (error) {
      console.error('验证失败:', error);
    }
  };

  // 上一步
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 建立连接
  const establishConnection = async () => {
    setConnectionStatus('connecting');
    setConnectionProgress(0);

    // 模拟连接过程
    const progressInterval = setInterval(() => {
      setConnectionProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 20;
      });
    }, 200);

    try {
      const values = await form.validateFields();

      const request: AgentCommunicationRequest = {
        agentId: agent.id,
        type: 'message',
        payload: {
          protocol: selectedProtocol,
          auth: {
            method: authMethod,
            ...values
          },
          security: {
            encryption: encryptionEnabled
          }
        },
        priority: 'high',
        timeout: 30000,
        requiresResponse: true,
        metadata: {
          userId: 'current_user',
          sessionId: `session_${Date.now()}`,
          requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
      };

      await establishCommunication(request);

      clearInterval(progressInterval);
      setConnectionProgress(100);
      setConnectionStatus('success');

      // 创建通信通道
      const channel: AgentCommunicationChannel = {
        id: `channel_${Date.now()}`,
        name: `${agent.name} - ${selectedProtocol.toUpperCase()}`,
        type: selectedProtocol as any,
        endpoint: `${getCurrentProtocol()?.defaultPort}`,
        protocol: selectedProtocol,
        status: 'connected',
        lastConnected: new Date(),
        supportedMethods: ['message', 'call', 'data_request'],
        security: {
          authentication: authMethod as any,
          encryption: encryptionEnabled ? 'tls' : 'none',
          authorization: ['read', 'write']
        }
      };

      message.success('通信连接建立成功');

      setTimeout(() => {
        onEstablish(channel);
        onClose();
      }, 1500);

    } catch (error) {
      clearInterval(progressInterval);
      setConnectionStatus('error');
      setConnectionError(error instanceof Error ? error.message : '连接失败');
      message.error('连接建立失败');
    }
  };

  // 渲染步骤内容
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="protocol-selection">
            <Title level={4}>选择通信协议</Title>
            <RadioGroup
              value={selectedProtocol}
              onChange={(e) => handleProtocolChange(e.target.value)}
              className="protocol-radio-group"
            >
              {COMMUNICATION_PROTOCOLS.map(protocol => (
                <Radio key={protocol.value} value={protocol.value}>
                  <Card className="protocol-card" size="small">
                    <Row align="middle">
                      <Col span={4}>
                        <div className="protocol-icon">
                          {protocol.icon}
                        </div>
                      </Col>
                      <Col span={20}>
                        <Title level={5}>{protocol.label}</Title>
                        <Text type="secondary">{protocol.description}</Text>
                        <div className="protocol-performance">
                          <Tag>延迟: {protocol.performance.latency}</Tag>
                          <Tag>吞吐: {protocol.performance.throughput}</Tag>
                          <Tag>可靠性: {protocol.performance.reliability}</Tag>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Radio>
              ))}
            </RadioGroup>
          </div>
        );

      case 1:
        return (
          <div className="security-config">
            <Title level={4}>安全配置</Title>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Form.Item
                  name="encryptionEnabled"
                  label="加密传输"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch
                    checked={encryptionEnabled}
                    onChange={setEncryptionEnabled}
                    checkedChildren="开启"
                    unCheckedChildren="关闭"
                  />
                </Form.Item>
                {encryptionEnabled && (
                  <Alert
                    message="加密传输已启用"
                    description="所有通信数据将通过TLS/SSL加密传输"
                    type="success"
                    showIcon
                  />
                )}
              </Col>
              <Col span={12}>
                <Form.Item
                  name="compressEnabled"
                  label="数据压缩"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  name="keepAlive"
                  label="保持连接"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );

      case 2:
        return (
          <div className="auth-config">
            <Title level={4}>认证设置</Title>
            <Form.Item
              name="authMethod"
              label="认证方式"
              initialValue={authMethod}
            >
              <Select onChange={setAuthMethod}>
                {AUTHENTICATION_METHODS.map(method => (
                  <Option key={method.value} value={method.value}>
                    {method.label} - {method.description}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {getCurrentAuthMethod()?.fields.map(field => (
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                rules={[{ required: field.required, message: `请输入${field.label}` }]}
              >
                {field.type === 'password' ? (
                  <Password placeholder={`请输入${field.label}`} />
                ) : field.type === 'upload' ? (
                  <Input type="file" />
                ) : (
                  <Input placeholder={`请输入${field.label}`} />
                )}
              </Form.Item>
            ))}

            {authMethod !== 'none' && (
              <Alert
                message="认证已启用"
                description={`使用${getCurrentAuthMethod()?.label}进行身份验证`}
                type="info"
                showIcon
              />
            )}
          </div>
        );

      case 3:
        return (
          <div className="connection-process">
            <Title level={4}>建立连接</Title>
            <div className="connection-summary">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Card size="small">
                    <Text strong>协议</Text>
                    <div>{getCurrentProtocol()?.label}</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small">
                    <Text strong>认证</Text>
                    <div>{getCurrentAuthMethod()?.label}</div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small">
                    <Text strong>加密</Text>
                    <div>{encryptionEnabled ? '启用' : '禁用'}</div>
                  </Card>
                </Col>
              </Row>
            </div>

            <div className="connection-progress">
              <Progress
                percent={connectionProgress}
                status={connectionStatus === 'error' ? 'exception' : connectionStatus === 'success' ? 'success' : 'active'}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
              <Text type="secondary">
                {connectionStatus === 'connecting' && '正在建立连接...'}
                {connectionStatus === 'success' && '连接建立成功！'}
                {connectionStatus === 'error' && '连接建立失败'}
              </Text>
            </div>

            {connectionError && (
              <Alert
                message="连接错误"
                description={connectionError}
                type="error"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Modal
      title={`与 ${agent.name} 建立通信`}
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
      maskClosable={false}
      className="agent-communication-modal"
    >
      <Steps
        current={currentStep}
        items={CONNECTION_STEPS}
        className="connection-steps"
      />

      <div className="modal-content">
        {renderStepContent()}
      </div>

      <Divider />

      <div className="modal-footer">
        <Space>
          {currentStep > 0 && (
            <Button onClick={handlePrev}>
              上一步
            </Button>
          )}

          {currentStep < CONNECTION_STEPS.length - 1 ? (
            <Button type="primary" onClick={handleNext}>
              下一步
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={handleNext}
              loading={connectionStatus === 'connecting'}
              disabled={connectionStatus === 'success'}
            >
              {connectionStatus === 'connecting' ? '连接中...' : '建立连接'}
            </Button>
          )}

          <Button onClick={onClose}>
            取消
          </Button>
        </Space>
      </div>
    </Modal>
  );
};