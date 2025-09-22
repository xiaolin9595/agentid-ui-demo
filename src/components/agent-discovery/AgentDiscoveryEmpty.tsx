import React from 'react';
import { Empty, Button, Space, Typography, Card, List, Avatar, Tag } from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  PlusOutlined,
  ThunderboltOutlined,
  UserOutlined,
  FilterOutlined,
  StarOutlined,
} from '@ant-design/icons';

import { useAgentDiscoveryStore } from '@/store/agentDiscoveryStore';

const { Text, Paragraph } = Typography;

interface AgentDiscoveryEmptyProps {
  onRefresh?: () => void;
  onCreateAgent?: () => void;
  onClearFilters?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const AgentDiscoveryEmpty: React.FC<AgentDiscoveryEmptyProps> = ({
  onRefresh,
  onCreateAgent,
  onClearFilters,
  className,
  style,
}) => {
  const {
    searchParams,
    searchHistory,
    clearFilters,
  } = useAgentDiscoveryStore();

  // 判断是否有筛选条件
  const hasActiveFilters = () => {
    return (
      searchParams.search ||
      searchParams.status ||
      searchParams.type ||
      searchParams.capabilities?.length ||
      searchParams.language ||
      searchParams.minRating ||
      searchParams.maxRating ||
      searchParams.tags?.length
    );
  };

  // 判断是否有搜索历史
  const hasSearchHistory = () => {
    return searchHistory && searchHistory.length > 0;
  };

  // 处理清除筛选
  const handleClearFilters = () => {
    clearFilters();
    if (onClearFilters) {
      onClearFilters();
    }
  };

  // 处理刷新
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  // 获取空状态描述
  const getEmptyDescription = () => {
    if (hasActiveFilters()) {
      return {
        title: '未找到匹配的Agent',
        description: '当前筛选条件下没有找到匹配的Agent，请尝试调整筛选条件。',
        showClearFilters: true,
      };
    }

    if (searchParams.search) {
      return {
        title: '未找到相关Agent',
        description: `没有找到与"${searchParams.search}"相关的Agent，请尝试其他关键词。`,
        showClearFilters: true,
      };
    }

    return {
      title: '暂无Agent数据',
      description: '还没有可用的Agent，您可以创建新的Agent或稍后再试。',
      showClearFilters: false,
    };
  };

  // 获取建议操作
  const getSuggestedActions = () => {
    const actions = [];

    if (hasActiveFilters() || searchParams.search) {
      actions.push({
        icon: <FilterOutlined />,
        text: '清除筛选',
        onClick: handleClearFilters,
        type: 'default' as const,
      });
    }

    actions.push({
      icon: <ReloadOutlined />,
      text: '刷新',
      onClick: handleRefresh,
      type: 'primary' as const,
    });

    if (onCreateAgent) {
      actions.push({
        icon: <PlusOutlined />,
        text: '创建Agent',
        onClick: onCreateAgent,
        type: 'dashed' as const,
      });
    }

    return actions;
  };

  // 渲染推荐Agent（示例数据）
  const renderRecommendedAgents = () => {
    const recommendedAgents = [
      {
        id: '1',
        name: '智能客服助手',
        description: '专业的客户服务支持Agent',
        status: 'active',
        rating: 4.5,
        capabilities: ['对话管理', '问题解答', '情感分析'],
      },
      {
        id: '2',
        name: '数据分析专家',
        description: '专业的数据分析和可视化Agent',
        status: 'active',
        rating: 4.8,
        capabilities: ['数据处理', '统计分析', '图表生成'],
      },
      {
        id: '3',
        name: '内容生成器',
        description: '创意内容生成和文案写作Agent',
        status: 'active',
        rating: 4.3,
        capabilities: ['文本生成', '创意写作', '内容优化'],
      },
    ];

    return (
      <div className="agent-discovery-empty-recommendations">
        <div style={{ marginBottom: 16 }}>
          <Text strong>推荐Agent</Text>
        </div>
        <List
          dataSource={recommendedAgents}
          renderItem={(agent) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    size={48}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: '#1890ff' }}
                  />
                }
                title={
                  <div>
                    <Text strong>{agent.name}</Text>
                    <div style={{ marginTop: 4 }}>
                      <Space>
                        <Tag color="green">活跃</Tag>
                        <span style={{ fontSize: 12 }}>
                          <StarOutlined style={{ color: '#fa8c16' }} />
                          {' '}
                          {agent.rating}
                        </span>
                      </Space>
                    </div>
                  </div>
                }
                description={
                  <div>
                    <Paragraph style={{ fontSize: 12, margin: '4px 0' }}>
                      {agent.description}
                    </Paragraph>
                    <Space wrap size={[4, 4]}>
                      {agent.capabilities.map(cap => (
                        <Tag key={cap} color="blue" style={{ fontSize: 10 }}>
                          {cap}
                        </Tag>
                      ))}
                    </Space>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>
    );
  };

  // 渲染搜索历史
  const renderSearchHistory = () => {
    if (!hasSearchHistory()) return null;

    return (
      <div className="agent-discovery-empty-history">
        <div style={{ marginBottom: 12 }}>
          <Text strong>搜索历史</Text>
        </div>
        <Space wrap size={[4, 4]}>
          {searchHistory.slice(0, 5).map((history, index) => (
            <Tag
              key={index}
              color="blue"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                // 这里可以添加点击搜索历史的处理逻辑
              }}
            >
              {history.params?.search || '搜索'}
            </Tag>
          ))}
        </Space>
      </div>
    );
  };

  const emptyInfo = getEmptyDescription();
  const actions = getSuggestedActions();

  return (
    <div className={`agent-discovery-empty ${className || ''}`} style={style}>
      <Card className="agent-discovery-empty-card">
        {/* 主要空状态 */}
        <div className="agent-discovery-empty-content">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div>
                <Paragraph type="secondary" style={{ marginBottom: 16 }}>
                  {emptyInfo.description}
                </Paragraph>
                <Space size={8}>
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      type={action.type}
                      icon={action.icon}
                      onClick={action.onClick}
                    >
                      {action.text}
                    </Button>
                  ))}
                </Space>
              </div>
            }
          >
            <Text>{emptyInfo.title}</Text>
          </Empty>
        </div>

        {/* 搜索历史 */}
        {renderSearchHistory()}

        {/* 推荐Agent */}
        {!(hasActiveFilters() || searchParams.search) && renderRecommendedAgents()}

        {/* 快速提示 */}
        <div className="agent-discovery-empty-tips" style={{ marginTop: 24 }}>
          <div style={{ marginBottom: 12 }}>
            <Text type="secondary">
              <ThunderboltOutlined /> 使用提示
            </Text>
          </div>
          <ul style={{ fontSize: 12, color: '#666', paddingLeft: 20 }}>
            <li>使用更具体的关键词进行搜索</li>
            <li>尝试使用能力标签进行筛选</li>
            <li>查看搜索历史中的相关查询</li>
            <li>创建符合您需求的自定义Agent</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};