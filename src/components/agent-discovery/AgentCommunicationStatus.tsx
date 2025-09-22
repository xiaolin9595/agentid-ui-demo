import React, { useState, useEffect } from 'react';
import {
  Card,
  Progress,
  Tag,
  Button,
  Space,
  Tooltip,
  Row,
  Col,
  Typography,
  Badge,
  Statistic,
  List,
  Avatar,
  Alert,
  Divider,
  Dropdown,
  Menu
} from 'antd';
import {
  WifiOutlined,
  DisconnectOutlined,
  ReloadOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  SignalFilled,
  SettingOutlined,
  DeleteOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { useAgentDiscoveryStore } from '@/store/agentDiscoveryStore';
import {
  AgentCommunicationStatus as AgentCommunicationStatusType,
  AgentCommunicationChannel
} from '@/types/agent-discovery';
import './styles/AgentCommunicationStatus.css';

const { Text, Title } = Typography;
const { Item: ListItem } = List;

interface AgentCommunicationStatusProps {
  agentId: string;
  status: AgentCommunicationStatusType;
  compact?: boolean;
  onRefresh?: () => void;
  onDisconnect?: (channelId: string) => void;
  onReconnect?: (channelId: string) => void;
}

// 状态配置
const STATUS_CONFIG = {
  idle: {
    color: 'green',
    text: '空闲',
    icon: <CheckCircleOutlined />,
    description: 'Agent处于空闲状态，可以接受通信'
  },
  busy: {
    color: 'orange',
    text: '忙碌',
    icon: <ClockCircleOutlined />,
    description: 'Agent正在处理请求，响应可能较慢'
  },
  offline: {
    color: 'red',
    text: '离线',
    icon: <DisconnectOutlined />,
    description: 'Agent当前不可用'
  },
  error: {
    color: 'red',
    text: '错误',
    icon: <ExclamationCircleOutlined />,
    description: 'Agent通信出现错误'
  }
};

// 通道状态配置
const CHANNEL_STATUS_CONFIG = {
  connected: {
    color: 'green',
    text: '已连接',
    icon: <CheckCircleOutlined />
  },
  disconnected: {
    color: 'red',
    text: '已断开',
    icon: <DisconnectOutlined />
  },
  error: {
    color: 'red',
    text: '错误',
    icon: <ExclamationCircleOutlined />
  },
  connecting: {
    color: 'orange',
    text: '连接中',
    icon: <ClockCircleOutlined />
  }
};

export const AgentCommunicationStatus: React.FC<AgentCommunicationStatusProps> = ({
  agentId,
  status,
  compact = false,
  onRefresh,
  onDisconnect,
  onReconnect
}) => {
  const {
    communicationChannels,
    getCommunicationStatus,
    closeCommunication
  } = useAgentDiscoveryStore();

  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [showChannels, setShowChannels] = useState(false);

  // 获取状态配置
  const getStatusConfig = () => {
    return STATUS_CONFIG[status.status] || STATUS_CONFIG.idle;
  };

  // 获取通道状态配置
  const getChannelStatusConfig = (channelStatus: string) => {
    return CHANNEL_STATUS_CONFIG[channelStatus as keyof typeof CHANNEL_STATUS_CONFIG] || CHANNEL_STATUS_CONFIG.disconnected;
  };

  // 获取可用通道
  const getAvailableChannels = () => {
    return status.channels || [];
  };

  // 获取活跃通道
  const getActiveChannels = () => {
    return getAvailableChannels().filter(channel => channel.status === 'connected');
  };

  // 计算连接质量
  const getConnectionQuality = () => {
    const activeChannels = getActiveChannels().length;
    const totalChannels = getAvailableChannels().length;

    if (totalChannels === 0) return 0;
    return (activeChannels / totalChannels) * 100;
  };

  // 计算负载百分比
  const getLoadPercentage = () => {
    if (!status.currentLoad || !status.maxCapacity) return 0;
    return (status.currentLoad / status.maxCapacity) * 100;
  };

  // 刷新状态
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await getCommunicationStatus(agentId);
      setLastRefreshed(new Date());
    } finally {
      setRefreshing(false);
    }
  };

  // 断开通道
  const handleDisconnect = (channelId: string) => {
    if (onDisconnect) {
      onDisconnect(channelId);
    } else {
      closeCommunication(channelId);
    }
  };

  // 重连通道
  const handleReconnect = (channelId: string) => {
    if (onReconnect) {
      onReconnect(channelId);
    }
  };

  // 通道操作菜单
  const getChannelMenu = (channel: AgentCommunicationChannel) => (
    <Menu>
      <Menu.Item
        key="reconnect"
        icon={<ReloadOutlined />}
        onClick={() => handleReconnect(channel.id)}
        disabled={channel.status === 'connecting'}
      >
        重新连接
      </Menu.Item>
      <Menu.Item
        key="settings"
        icon={<SettingOutlined />}
      >
        通道设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="disconnect"
        icon={<DeleteOutlined />}
        onClick={() => handleDisconnect(channel.id)}
        disabled={channel.status !== 'connected'}
        danger
      >
        断开连接
      </Menu.Item>
    </Menu>
  );

  // 渲染紧凑状态
  if (compact) {
    const statusConfig = getStatusConfig();
    const loadPercentage = getLoadPercentage();
    const activeChannels = getActiveChannels().length;

    return (
      <div className="communication-status-compact">
        <Space>
          <Badge status={statusConfig.color as any} text={statusConfig.text} />
          {activeChannels > 0 && (
            <Text type="secondary">{activeChannels} 个通道</Text>
          )}
          {loadPercentage > 0 && (
            <Progress
              percent={loadPercentage}
              size="small"
              status={loadPercentage > 80 ? 'exception' : 'normal'}
              style={{ width: 100 }}
            />
          )}
          <Tooltip title="刷新状态">
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={refreshing}
              size="small"
            />
          </Tooltip>
        </Space>
      </div>
    );
  }

  // 渲染完整状态
  const statusConfig = getStatusConfig();
  const connectionQuality = getConnectionQuality();
  const loadPercentage = getLoadPercentage();
  const activeChannels = getActiveChannels();
  const availableChannels = getAvailableChannels();

  return (
    <div className="communication-status-full">
      {/* 状态概览 */}
      <Card className="status-overview-card" size="small">
        <Row align="middle" justify="space-between">
          <Col>
            <Space>
              <Avatar
                icon={statusConfig.icon}
                style={{ backgroundColor: statusConfig.color }}
              />
              <div>
                <Title level={5} className="status-title">
                  通信状态: {statusConfig.text}
                </Title>
                <Text type="secondary" className="status-description">
                  {statusConfig.description}
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              <Text type="secondary" className="last-refreshed">
                最后更新: {lastRefreshed.toLocaleTimeString()}
              </Text>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={refreshing}
                size="small"
              >
                刷新
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 关键指标 */}
      <Row gutter={[16, 16]} className="status-metrics">
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="连接质量"
              value={connectionQuality}
              suffix="%"
              precision={0}
              valueStyle={{ color: connectionQuality > 80 ? '#3f8600' : connectionQuality > 50 ? '#cf1322' : '#d4b106' }}
            />
            <Progress
              percent={connectionQuality}
              size="small"
              status={connectionQuality > 80 ? 'success' : connectionQuality > 50 ? 'normal' : 'exception'}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="当前负载"
              value={status.currentLoad || 0}
              suffix={`/ ${status.maxCapacity || 0}`}
              precision={0}
            />
            <Progress
              percent={loadPercentage}
              size="small"
              status={loadPercentage > 80 ? 'exception' : 'normal'}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="活跃通道"
              value={activeChannels.length}
              suffix={`/ ${availableChannels.length}`}
              precision={0}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <Statistic
              title="响应时间"
              value={status.responseTime || 0}
              suffix="ms"
              precision={0}
            />
          </Card>
        </Col>
      </Row>

      {/* 通信通道 */}
      <Card
        className="channels-card"
        size="small"
        title={
          <Space>
            <SignalFilled />
            通信通道
            <Badge count={availableChannels.length} showZero />
          </Space>
        }
        extra={
          <Space>
            <Button
              type="text"
              onClick={() => setShowChannels(!showChannels)}
              size="small"
            >
              {showChannels ? '收起' : '展开'}
            </Button>
          </Space>
        }
      >
        {showChannels && (
          <List
            dataSource={availableChannels}
            renderItem={(channel) => {
              const channelStatusConfig = getChannelStatusConfig(channel.status);
              return (
                <ListItem
                  actions={[
                    <Dropdown
                      overlay={getChannelMenu(channel)}
                      trigger={['click']}
                    >
                      <Button type="text" icon={<MoreOutlined />} size="small" />
                    </Dropdown>
                  ]}
                >
                  <ListItem.Meta
                    avatar={
                      <Avatar
                        icon={channelStatusConfig.icon}
                        style={{ backgroundColor: channelStatusConfig.color }}
                      />
                    }
                    title={
                      <Space>
                        <Text strong>{channel.name}</Text>
                        <Tag color={channelStatusConfig.color}>
                          {channelStatusConfig.text}
                        </Tag>
                        <Tag color="blue">{channel.protocol}</Tag>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size="small">
                        <Text type="secondary">
                          端点: {channel.endpoint} |
                          认证: {channel.security.authentication} |
                          加密: {channel.security.encryption}
                        </Text>
                        {channel.lastConnected && (
                          <Text type="secondary">
                            最后连接: {new Date(channel.lastConnected).toLocaleString()}
                          </Text>
                        )}
                      </Space>
                    }
                  />
                </ListItem>
              );
            }}
          />
        )}
      </Card>

      {/* 状态详情 */}
      {status.error && (
        <Alert
          message="通信错误"
          description={status.error}
          type="error"
          showIcon
          action={
            <Button size="small" type="link" onClick={handleRefresh}>
              重试
            </Button>
          }
          style={{ marginTop: 16 }}
        />
      )}

      {status.lastActivity && (
        <Card className="activity-card" size="small">
          <Text type="secondary">
            最后活动时间: {new Date(status.lastActivity).toLocaleString()}
          </Text>
        </Card>
      )}

      {/* 推荐操作 */}
      {status.status === 'offline' && (
        <Card className="recommendations-card" size="small">
          <Title level={5}>推荐操作</Title>
          <Space direction="vertical" size="small">
            <Alert
              message="Agent离线"
              description="Agent当前处于离线状态，请尝试以下操作："
              type="warning"
              showIcon
            />
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={refreshing}
              >
                检查状态
              </Button>
              <Button
                icon={<WifiOutlined />}
                onClick={() => {
                  // 触发重新连接逻辑
                  availableChannels.forEach(channel => handleReconnect(channel.id));
                }}
              >
                重新连接
              </Button>
            </Space>
          </Space>
        </Card>
      )}
    </div>
  );
};