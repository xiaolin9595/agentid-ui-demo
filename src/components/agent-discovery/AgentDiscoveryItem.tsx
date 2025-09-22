import React from 'react';
import {
  List,
  Avatar,
  Tag,
  Button,
  Space,
  Tooltip,
  Rate,
  Badge,
  Typography,
  Checkbox,
} from 'antd';
import {
  EyeOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  LinkOutlined,
  CodeOutlined,
  ApiOutlined,
  SafetyCertificateOutlined,
  StarOutlined,
} from '@ant-design/icons';

import type { Agent, BlockchainAgent } from '@/types';
import type { AgentDiscoverySearchParams } from '@/types/agent-discovery';

const { Text, Paragraph } = Typography;

interface AgentDiscoveryItemProps {
  agent: Agent | BlockchainAgent;
  onViewDetails: (agent: Agent | BlockchainAgent) => void;
  onConnect?: (agent: Agent | BlockchainAgent) => void;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const AgentDiscoveryItem: React.FC<AgentDiscoveryItemProps> = ({
  agent,
  onViewDetails,
  onConnect,
  isSelected = false,
  onSelect,
  className,
  style,
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

  const statusInfo = getStatusInfo();

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

  const capabilityTags = getCapabilityTags();

  return (
    <List.Item
      className={`agent-discovery-item ${className || ''}`}
      style={style}
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
      {/* 选择框 */}
      {onSelect && (
        <List.Item.Meta
          avatar={
            <Checkbox
              checked={isSelected}
              onChange={(e) => onSelect(e.target.checked)}
            />
          }
        />
      )}

      {/* 主要内容 */}
      <List.Item.Meta
        avatar={
          <Avatar
            size={48}
            icon={<UserOutlined />}
          />
        }
        title={
          <div className="agent-item-title">
            <Space align="center" size={8}>
              <Text strong>{agent.name}</Text>
              <Badge
                color={statusInfo.color}
                text={
                  <Text type={statusInfo.color as any}>
                    {statusInfo.icon} {statusInfo.text}
                  </Text>
                }
              />
              {isBlockchainAgent && (
                <div className="agent-rating">
                  <Rate disabled defaultValue={4.5} style={{ fontSize: 12 }} />
                  <Text type="secondary" style={{ marginLeft: 4, fontSize: 12 }}>
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
            </Space>
          </div>
        }
        description={
          <div className="agent-item-description">
            {agent.description && (
              <Paragraph
                ellipsis={{ rows: 1, expandable: false }}
                type="secondary"
                style={{ fontSize: 13, margin: '4px 0' }}
              >
                {agent.description}
              </Paragraph>
            )}

            {/* 能力标签 */}
            {capabilityTags && (
              <Space wrap size={[4, 4]} style={{ marginTop: 8 }}>
                {capabilityTags}
              </Space>
            )}

            {/* 统计信息 */}
            <Space size={16} style={{ marginTop: 8 }}>
              {isBlockchainAgent && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <ApiOutlined /> v{(agent as BlockchainAgent).version || '1.0.0'}
                </Text>
              )}
              <Text type="secondary" style={{ fontSize: 12 }}>
                <ClockCircleOutlined /> {new Date().toLocaleDateString()}
              </Text>
            </Space>

            {/* 元信息 */}
            <Space size={12} style={{ marginTop: 4 }}>
              <Text type="secondary" style={{ fontSize: 11 }}>
                <UserOutlined /> {isBlockchainAgent ? (agent as BlockchainAgent).owner : '未知'}
              </Text>
              {isBlockchainAgent && (
                <Text type="secondary" style={{ fontSize: 11 }}>
                  <ApiOutlined /> {(agent as BlockchainAgent).version || '1.0.0'}
                </Text>
              )}
            </Space>
          </div>
        }
      />
    </List.Item>
  );
};