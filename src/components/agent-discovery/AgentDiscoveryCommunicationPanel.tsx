import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Radio,
  Switch,
  Slider,
  Tag,
  Divider,
  Alert,
  Spin,
  Tooltip,
  Row,
  Col,
  Typography,
  message
} from 'antd';
import {
  SendOutlined,
  SecurityScanOutlined,
  HistoryOutlined,
  SettingOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useAgentDiscoveryStore } from '@/store/agentDiscoveryStore';
import {
  AgentDiscoveryItem,
  AgentCommunicationRequest,
  AgentCommunicationChannel,
  AgentCommunicationStatus
} from '@/types/agent-discovery';
import { AgentCommunicationModal } from './AgentCommunicationModal';
import { AgentCommunicationHistory } from './AgentCommunicationHistory';
import { AgentCommunicationTypes } from './AgentCommunicationTypes';
import { AgentCommunicationStatus as AgentCommunicationStatusComponent } from './AgentCommunicationStatus';
import './styles/AgentDiscoveryCommunicationPanel.css';

const { TextArea } = Input;
const { Option } = Select;
const { Text, Title } = Typography;
const { Group: RadioGroup } = Radio;

interface AgentDiscoveryCommunicationPanelProps {
  agent: AgentDiscoveryItem;
  className?: string;
}

interface CommunicationHistory {
  id: string;
  type: 'message' | 'call' | 'data_request' | 'command';
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  response?: string;
  metadata?: {
    duration?: number;
    error?: string;
  };
}

// 通信方式配置
const COMMUNICATION_TYPES = [
  {
    value: 'message',
    label: '消息通信',
    icon: <SendOutlined />,
    description: '发送文本或结构化消息',
    protocols: ['HTTP', 'WebSocket', 'MQTT']
  },
  {
    value: 'call',
    label: '函数调用',
    icon: <SettingOutlined />,
    description: '调用Agent的特定功能',
    protocols: ['gRPC', 'HTTP REST', 'WebSocket']
  },
  {
    value: 'data_request',
    label: '数据请求',
    icon: <HistoryOutlined />,
    description: '请求数据处理或查询',
    protocols: ['HTTP REST', 'GraphQL', 'WebSocket']
  },
  {
    value: 'command',
    label: '命令执行',
    icon: <SecurityScanOutlined />,
    description: '执行特定命令或操作',
    protocols: ['SSH', 'HTTP', 'Custom Protocol']
  }
];

// 安全级别选项
const SECURITY_LEVELS = [
  { value: 'low', label: '低', color: 'green' },
  { value: 'medium', label: '中', color: 'orange' },
  { value: 'high', label: '高', color: 'red' }
];

// 优先级选项
const PRIORITY_OPTIONS = [
  { value: 'low', label: '低', color: 'blue' },
  { value: 'medium', label: '中', color: 'orange' },
  { value: 'high', label: '高', color: 'red' },
  { value: 'urgent', label: '紧急', color: 'magenta' }
];

export const AgentDiscoveryCommunicationPanel: React.FC<AgentDiscoveryCommunicationPanelProps> = ({
  agent,
  className
}) => {
  const [form] = Form.useForm();
  const {
    communicationStatus,
    communicationChannels,
    isEstablishingCommunication,
    communicationError,
    establishCommunication,
    getCommunicationStatus
  } = useAgentDiscoveryStore();

  const [communicationType, setCommunicationType] = useState('message');
  const [selectedProtocol, setSelectedProtocol] = useState('HTTP');
  const [securityLevel, setSecurityLevel] = useState('medium');
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  const [timeout, setTimeout] = useState(30);
  const [showHistory, setShowHistory] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [localHistory, setLocalHistory] = useState<CommunicationHistory[]>([]);
  const [currentStatus, setCurrentStatus] = useState<AgentCommunicationStatus | null>(null);

  useEffect(() => {
    // 获取Agent通信状态
    if (agent.id) {
      getCommunicationStatus(agent.id);
    }
  }, [agent.id, getCommunicationStatus]);

  useEffect(() => {
    // 更新本地状态
    if (communicationStatus[agent.id]) {
      setCurrentStatus(communicationStatus[agent.id]);
    }
  }, [communicationStatus, agent.id]);

  // 获取当前通信类型的协议选项
  const getCurrentProtocols = () => {
    const typeConfig = COMMUNICATION_TYPES.find(t => t.value === communicationType);
    return typeConfig?.protocols || [];
  };

  // 获取可用的通信通道
  const getAvailableChannels = () => {
    return Object.values(communicationChannels).filter(
      channel => channel.status === 'connected'
    );
  };

  // 处理通信类型变更
  const handleTypeChange = (type: string) => {
    setCommunicationType(type);
    const protocols = COMMUNICATION_TYPES.find(t => t.value === type)?.protocols || [];
    if (protocols.length > 0) {
      setSelectedProtocol(protocols[0]);
    }
  };

  // 发送通信请求
  const handleSend = async (values: any) => {
    try {
      const request: AgentCommunicationRequest = {
        agentId: agent.id,
        type: communicationType as any,
        payload: {
          message: values.content,
          protocol: selectedProtocol,
          security: {
            level: securityLevel,
            encryption: encryptionEnabled
          }
        },
        priority: values.priority,
        timeout: timeout * 1000,
        requiresResponse: values.requiresResponse,
        metadata: {
          userId: 'current_user',
          sessionId: `session_${Date.now()}`,
          requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          tags: values.tags || []
        }
      };

      await establishCommunication(request);

      // 添加到本地历史记录
      const historyItem: CommunicationHistory = {
        id: request.metadata?.requestId || '',
        type: communicationType as any,
        content: values.content,
        timestamp: new Date(),
        status: 'sent'
      };

      setLocalHistory(prev => [historyItem, ...prev.slice(0, 49)]); // 保留最近50条
      message.success('通信请求已发送');

      // 重置表单
      form.resetFields(['content', 'priority', 'requiresResponse', 'tags']);
    } catch (error) {
      message.error('发送失败: ' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

  // 打开通信模态框
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // 关闭模态框
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'idle': return 'green';
      case 'busy': return 'orange';
      case 'offline': return 'red';
      case 'error': return 'red';
      default: return 'gray';
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'idle': return '空闲';
      case 'busy': return '忙碌';
      case 'offline': return '离线';
      case 'error': return '错误';
      default: return '未知';
    }
  };

  return (
    <div className={`agent-communication-panel ${className || ''}`}>
      {/* Agent信息头部 */}
      <Card className="agent-info-card" size="small">
        <Row align="middle" justify="space-between">
          <Col>
            <Space>
              <Title level={5} className="agent-name">{agent.name}</Title>
              {currentStatus && (
                <Tag color={getStatusColor(currentStatus.status)}>
                  {getStatusText(currentStatus.status)}
                </Tag>
              )}
            </Space>
            <Text type="secondary" className="agent-description">
              {agent.description}
            </Text>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<HistoryOutlined />}
                onClick={() => setShowHistory(!showHistory)}
                type={showHistory ? 'primary' : 'default'}
              >
                历史记录
              </Button>
              <Button
                type="primary"
                icon={<SendOutlined />}
                onClick={handleOpenModal}
                disabled={currentStatus?.status === 'offline'}
              >
                建立通信
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 历史记录面板 */}
      {showHistory && (
        <Card className="history-card" size="small" title="通信历史">
          <AgentCommunicationHistory
            agentId={agent.id}
            history={localHistory}
            maxHeight={300}
          />
        </Card>
      )}

      {/* 通信配置面板 */}
      <Card className="communication-config-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSend}
          initialValues={{
            priority: 'medium',
            requiresResponse: true,
            tags: []
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              {/* 通信方式选择 */}
              <Form.Item label="通信方式">
                <RadioGroup
                  value={communicationType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="communication-type-selector"
                >
                  {COMMUNICATION_TYPES.map(type => (
                    <Radio key={type.value} value={type.value}>
                      <Space>
                        {type.icon}
                        <div>
                          <div className="type-label">{type.label}</div>
                          <div className="type-description">{type.description}</div>
                        </div>
                      </Space>
                    </Radio>
                  ))}
                </RadioGroup>
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              {/* 协议和安全配置 */}
              <Form.Item label="通信协议">
                <Select
                  value={selectedProtocol}
                  onChange={setSelectedProtocol}
                  className="protocol-selector"
                >
                  {getCurrentProtocols().map(protocol => (
                    <Option key={protocol} value={protocol}>
                      {protocol}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="安全级别">
                <RadioGroup
                  value={securityLevel}
                  onChange={(e) => setSecurityLevel(e.target.value)}
                  className="security-level-selector"
                >
                  {SECURITY_LEVELS.map(level => (
                    <Radio key={level.value} value={level.value}>
                      <Tag color={level.color}>{level.label}</Tag>
                    </Radio>
                  ))}
                </RadioGroup>
              </Form.Item>

              <Form.Item label="加密传输">
                <Switch
                  checked={encryptionEnabled}
                  onChange={setEncryptionEnabled}
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24} md={16}>
              {/* 通信内容 */}
              <Form.Item
                name="content"
                label="通信内容"
                rules={[{ required: true, message: '请输入通信内容' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="请输入要发送的消息、请求或命令..."
                  showCount
                  maxLength={1000}
                />
              </Form.Item>

              <Form.Item name="tags" label="标签">
                <Select
                  mode="tags"
                  placeholder="添加标签（可选）"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              {/* 高级设置 */}
              <Form.Item name="priority" label="优先级">
                <RadioGroup className="priority-selector">
                  {PRIORITY_OPTIONS.map(priority => (
                    <Radio key={priority.value} value={priority.value}>
                      <Tag color={priority.color}>{priority.label}</Tag>
                    </Radio>
                  ))}
                </RadioGroup>
              </Form.Item>

              <Form.Item label="超时时间">
                <Space>
                  <Slider
                    value={timeout}
                    onChange={setTimeout}
                    min={5}
                    max={300}
                    step={5}
                    style={{ width: 120 }}
                  />
                  <Text>{timeout}秒</Text>
                </Space>
              </Form.Item>

              <Form.Item
                name="requiresResponse"
                label="需要响应"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          {/* 错误提示 */}
          {communicationError && (
            <Alert
              message="通信错误"
              description={communicationError}
              type="error"
              showIcon
              closable
              onClose={() => useAgentDiscoveryStore.getState().clearErrors()}
              style={{ marginBottom: 16 }}
            />
          )}

          {/* 操作按钮 */}
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                loading={isEstablishingCommunication}
                disabled={currentStatus?.status === 'offline'}
              >
                发送请求
              </Button>
              <Button onClick={() => form.resetFields()}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 通信模态框 */}
      <AgentCommunicationModal
        agent={agent}
        visible={showModal}
        onClose={handleCloseModal}
        onEstablish={(channel) => {
          console.log('建立通信通道:', channel);
          setShowModal(false);
        }}
      />

      {/* 通信状态指示器 */}
      {currentStatus && (
        <Card className="status-card" size="small">
          <AgentCommunicationStatusComponent
            agentId={agent.id}
            status={currentStatus}
            compact={true}
          />
        </Card>
      )}
    </div>
  );
};