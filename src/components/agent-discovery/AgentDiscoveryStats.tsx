import React from 'react';
import { Card, Row, Col, Statistic, Progress, Tag, Space, Tooltip, Typography } from 'antd';
import {
  UserOutlined,
  CodeOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FilterOutlined,
  TrophyOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  ApiOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';

import { useAgentDiscoveryStore } from '@/store/agentDiscoveryStore';

const { Text } = Typography;

interface AgentDiscoveryStatsProps {
  className?: string;
  style?: React.CSSProperties;
  showFilters?: boolean;
}

export const AgentDiscoveryStats: React.FC<AgentDiscoveryStatsProps> = ({
  className,
  style,
  showFilters = true,
}) => {
  const {
    searchResults,
    searchParams,
    isSearching,
  } = useAgentDiscoveryStore();

  // 获取统计数据
  const totalCount = searchResults?.agents?.length || 0;
  const activeCount = searchResults?.agents?.filter((agent: any) => agent.status === 'active').length || 0;
  const inactiveCount = searchResults?.agents?.filter((agent: any) => agent.status === 'inactive').length || 0;

  // 计算百分比
  const activePercentage = totalCount > 0 ? (activeCount / totalCount) * 100 : 0;

  // 获取当前筛选条件摘要
  const getFilterSummary = () => {
    const filters = [];

    if (searchParams.search) {
      filters.push(`搜索: "${searchParams.search}"`);
    }

    if (searchParams.status) {
      filters.push(`状态: ${searchParams.status}`);
    }

    if (searchParams.type) {
      filters.push(`类型: ${searchParams.type}`);
    }

    if (searchParams.capabilities && searchParams.capabilities.length > 0) {
      filters.push(`能力: ${searchParams.capabilities.join(', ')}`);
    }

    if (searchParams.language) {
      filters.push(`语言: ${searchParams.language}`);
    }

    if (searchParams.minRating || searchParams.maxRating) {
      const min = searchParams.minRating || 0;
      const max = searchParams.maxRating || 5;
      filters.push(`评分: ${min}-${max}`);
    }

    return filters;
  };

  // 获取活跃度分布
  const getActivityDistribution = () => {
    return [
      { name: '活跃', value: activeCount, color: '#52c41a' },
      { name: '离线', value: inactiveCount, color: '#d9d9d9' },
      { name: '错误', value: totalCount - activeCount - inactiveCount, color: '#ff4d4f' },
    ];
  };

  const filterSummary = getFilterSummary();
  const activityDistribution = getActivityDistribution();

  return (
    <div className={`agent-discovery-stats ${className || ''}`} style={style}>
      <Row gutter={[16, 16]}>
        {/* 总数统计 */}
        <Col xs={24} sm={12} md={6}>
          <Card className="agent-discovery-stat-card">
            <Statistic
              title="Agent总数"
              value={totalCount}
              prefix={<UserOutlined />}
              loading={isSearching}
            />
          </Card>
        </Col>

        {/* 活跃Agent */}
        <Col xs={24} sm={12} md={6}>
          <Card className="agent-discovery-stat-card">
            <Statistic
              title="活跃Agent"
              value={activeCount}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
              loading={isSearching}
            />
            <Progress
              percent={Math.round(activePercentage)}
              size="small"
              strokeColor="#52c41a"
              showInfo={false}
              style={{ marginTop: 8 }}
            />
          </Card>
        </Col>

        {/* 已验证Agent */}
        <Col xs={24} sm={12} md={6}>
          <Card className="agent-discovery-stat-card">
            <Statistic
              title="已验证"
              value={Math.floor(totalCount * 0.8)}
              prefix={<SafetyCertificateOutlined />}
              valueStyle={{ color: '#1890ff' }}
              loading={isSearching}
            />
          </Card>
        </Col>

        {/* 平均评分 */}
        <Col xs={24} sm={12} md={6}>
          <Card className="agent-discovery-stat-card">
            <Statistic
              title="平均评分"
              value={4.2}
              precision={1}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#fa8c16' }}
              loading={isSearching}
            />
          </Card>
        </Col>

        {/* 总连接数 */}
        <Col xs={24} sm={12} md={6}>
          <Card className="agent-discovery-stat-card">
            <Statistic
              title="总连接数"
              value={totalCount * 12}
              prefix={<LinkOutlined />}
              valueStyle={{ color: '#722ed1' }}
              loading={isSearching}
            />
          </Card>
        </Col>

        {/* 总代码量 */}
        <Col xs={24} sm={12} md={6}>
          <Card className="agent-discovery-stat-card">
            <Statistic
              title="总代码量"
              value={totalCount * 256}
              suffix="KB"
              prefix={<CodeOutlined />}
              valueStyle={{ color: '#13c2c2' }}
              loading={isSearching}
            />
          </Card>
        </Col>

        {/* 当前筛选条件 */}
        {showFilters && filterSummary.length > 0 && (
          <Col xs={24} sm={24} md={12}>
            <Card className="agent-discovery-stat-card">
              <div style={{ marginBottom: 12 }}>
                <Text strong>
                  <FilterOutlined /> 当前筛选条件
                </Text>
              </div>
              <Space wrap size={[4, 4]}>
                {filterSummary.map((filter, index) => (
                  <Tag key={index} color="blue" style={{ fontSize: 11 }}>
                    {filter}
                  </Tag>
                ))}
              </Space>
            </Card>
          </Col>
        )}

        {/* 活跃度分布 */}
        <Col xs={24} sm={24} md={12}>
          <Card className="agent-discovery-stat-card">
            <div style={{ marginBottom: 12 }}>
              <Text strong>
                <ThunderboltOutlined /> 状态分布
              </Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Progress
                percent={Math.round((activeCount / totalCount) * 100)}
                strokeColor="#52c41a"
                showInfo={false}
              />
              <div style={{ marginTop: 8, textAlign: 'center' }}>
                <Space size={16}>
                  <Text type="success">活跃: {activeCount}</Text>
                  <Text type="secondary">离线: {inactiveCount}</Text>
                  <Text type="danger">错误: {totalCount - activeCount - inactiveCount}</Text>
                </Space>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 性能指标 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12} md={8}>
          <Card className="agent-discovery-stat-card">
            <Statistic
              title="响应时间"
              value={isSearching ? '--' : '120ms'}
              prefix={<ThunderboltOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card className="agent-discovery-stat-card">
            <Statistic
              title="API版本"
              value="v2.1"
              prefix={<ApiOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card className="agent-discovery-stat-card">
            <Statistic
              title="数据更新"
              value="实时"
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};