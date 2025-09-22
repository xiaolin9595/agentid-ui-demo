import React from 'react';
import { Card, Badge, Tag, Button, Space, Tooltip, Rate, Avatar, Typography } from 'antd';
import {
  EyeOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  ApiOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
} from '@ant-design/icons';

import type { Agent, BlockchainAgent } from '@/types';
import type { AgentDiscoverySearchParams } from '@/types/agent-discovery';

const { Text, Paragraph } = Typography;

interface AgentDiscoveryCardProps {
  agent: Agent | BlockchainAgent;
  onViewDetails: (agent: Agent | BlockchainAgent) => void;
  onConnect?: (agent: Agent | BlockchainAgent) => void;
  className?: string;
  style?: React.CSSProperties;
  isCompact?: boolean;
}

export const AgentDiscoveryCard: React.FC<AgentDiscoveryCardProps> = ({
  agent,
  onViewDetails,
  onConnect,
  className,
  style,
  isCompact = false,
}) => {
  const isBlockchainAgent = 'contractAddress' in agent;

  // 获取Agent状态
  const getStatusInfo = () => {
    switch (agent.status) {
      case 'active':
        return {
          color: 'green',
          icon: <CheckCircleOutlined />,
          text: '活跃',
        };
      case 'inactive':
        return {
          color: 'default',
          icon: <ClockCircleOutlined />,
          text: '离线',
        };
      case 'error':
        return {
          color: 'red',
          icon: <ExclamationCircleOutlined />,
          text: '错误',
        };
      default:
        return {
          color: 'default',
          icon: <ClockCircleOutlined />,
          text: '未知',
        };
    }
  };

  // 获取能力标签
  const getCapabilityTags = () => {
    if (isBlockchainAgent && 'capabilities' in agent && Array.isArray(agent.capabilities)) {
      return agent.capabilities.slice(0, 3).map(cap => (
        <Tag key={cap} color="blue" className="agent-discovery-tag">
          {cap}
        </Tag>
      ));
    }
    return null;
  };

  const statusInfo = getStatusInfo();

  return (
    <Card
      className={`agent-discovery-card ${className || ''}`}
      style={style}
      hoverable
      size={isCompact ? 'small' : 'default'}
      actions={[
        <Tooltip title="查看详情">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => onViewDetails(agent)}
          >
            详情
          </Button>
        </Tooltip>,
        onConnect && (
          <Tooltip title="建立通信">
            <Button
              type="text"
              icon={<MessageOutlined />}
              onClick={() => onConnect(agent)}
            >
              连接
            </Button>
          </Tooltip>
        ),
      ]}
    >
      {/* 头部信息 */}
      <div className="agent-card-header">
        <Space align="start">
          <Avatar
            size={isCompact ? 40 : 64}
            icon={<UserOutlined />}
          />
          <div className="agent-card-info">
            <div className="agent-card-title">
              <Text strong style={{ fontSize: isCompact ? 14 : 16 }}>
                {agent.name}
              </Text>
              <Badge
                color={statusInfo.color}
                text={
                  <Text type={statusInfo.color as any}>
                    {statusInfo.icon} {statusInfo.text}
                  </Text>
                }
              />
            </div>
            {isBlockchainAgent && (
              <div className="agent-rating">
                <Rate disabled defaultValue={4.5} style={{ fontSize: 14 }} />
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  4.5
                </Text>
              </div>
            )}
            {isBlockchainAgent && (
              <Badge
                color="green"
                text={
                  <Text type="success">
                    <SafetyCertificateOutlined /> 已验证
                  </Text>
                }
              />
            )}
          </div>
        </Space>
      </div>

      {/* 描述信息 */}
      {agent.description && !isCompact && (
        <div className="agent-card-description" style={{ marginTop: 12 }}>
          <Paragraph
            ellipsis={{ rows: 2, expandable: false }}
            type="secondary"
            style={{ fontSize: 13, margin: 0 }}
          >
            {agent.description}
          </Paragraph>
        </div>
      )}

      {/* 能力标签 */}
      {getCapabilityTags() && (
        <div className="agent-card-capabilities" style={{ marginTop: 12 }}>
          <Space wrap size={[4, 4]}>
            {getCapabilityTags()}
          </Space>
        </div>
      )}

      {/* 统计信息 */}
      {!isCompact && (
        <div className="agent-card-stats" style={{ marginTop: 12 }}>
          <Space size={16}>
            {isBlockchainAgent && (
              <Text type="secondary">
                <ApiOutlined /> v{(agent as BlockchainAgent).version || '1.0.0'}
              </Text>
            )}
            <Text type="secondary">
              <ClockCircleOutlined /> {new Date().toLocaleDateString()}
            </Text>
          </Space>
        </div>
      )}

      {/* 额外信息 */}
      {!isCompact && (
        <div className="agent-card-meta" style={{ marginTop: 8 }}>
          <Space size={12}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <UserOutlined /> {isBlockchainAgent ? (agent as BlockchainAgent).owner : '未知'}
            </Text>
            {isBlockchainAgent && (
              <Text type="secondary" style={{ fontSize: 12 }}>
                <ApiOutlined /> {(agent as BlockchainAgent).version || 'v1.0.0'}
              </Text>
            )}
          </Space>
        </div>
      )}
    </Card>
  );
};