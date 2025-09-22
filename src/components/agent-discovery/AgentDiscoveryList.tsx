import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  List,
  Card,
  Button,
  Radio,
  Space,
  Spin,
  Alert,
  Empty,
  Grid,
  Pagination,
  Select,
  Tooltip,
  Typography
} from 'antd';
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  ReloadOutlined,
} from '@ant-design/icons';

import { useAgentDiscoveryStore } from '@/store/agentDiscoveryStore';
import { AgentDiscoveryCard } from './AgentDiscoveryCard';
import { AgentDiscoveryItem } from './AgentDiscoveryItem';
import { AgentDiscoveryStats } from './AgentDiscoveryStats';
import { AgentDiscoveryEmpty } from './AgentDiscoveryEmpty';

import type { Agent, BlockchainAgent } from '@/types';
import type { AgentDiscoverySearchParams } from '@/types/agent-discovery';

const { useBreakpoint } = Grid;
const { Option } = Select;
const { Text } = Typography;

interface AgentDiscoveryListProps {
  onViewDetails: (agent: Agent | BlockchainAgent) => void;
  onConnect?: (agent: Agent | BlockchainAgent) => void;
  className?: string;
  style?: React.CSSProperties;
  showControls?: boolean;
  showStats?: boolean;
}

export const AgentDiscoveryList: React.FC<AgentDiscoveryListProps> = ({
  onViewDetails,
  onConnect,
  className,
  style,
  showControls = true,
  showStats = true,
}) => {
  const screens = useBreakpoint();
  const {
    searchResults,
    searchParams,
    isSearching,
    searchError,
    searchAgents,
    updateSearchParams,
  } = useAgentDiscoveryStore();

  // 视图模式
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set());

  // 页面大小选项
  const pageSizeOptions = ['12', '24', '48', '96'];

  // 处理分页变化
  const handlePageChange = (page: number, pageSize?: number) => {
    updateSearchParams({
      ...searchParams,
      page,
      pageSize: pageSize || searchParams.pageSize || 12,
    });
    searchAgents();
  };

  // 处理页面大小变化
  const handlePageSizeChange = (pageSize: number) => {
    updateSearchParams({
      ...searchParams,
      pageSize,
      page: 1, // 重置到第一页
    });
    searchAgents();
  };

  // 刷新搜索
  const handleRefresh = () => {
    searchAgents();
  };

  // 获取网格列数
  const getGridCols = () => {
    if (screens.xs) return 1;
    if (screens.sm) return 2;
    if (screens.md) return 3;
    if (screens.lg) return 4;
    return 4;
  };

  // 渲染加载状态
  const renderLoading = () => (
    <div className="agent-discovery-loading">
      <Spin size="large" tip="正在加载Agent..." />
    </div>
  );

  // 渲染错误状态
  const renderError = () => (
    <Alert
      message="加载失败"
      description={searchError || '获取Agent列表时发生错误'}
      type="error"
      showIcon
      action={
        <Button size="small" onClick={handleRefresh}>
          重试
        </Button>
      }
    />
  );

  // 渲染控制面板
  const renderControls = () => (
    <Card size="small" className="agent-discovery-controls">
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={8}>
          <Space>
            <Radio.Group
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="grid">
                <Tooltip title="网格视图">
                  <AppstoreOutlined />
                </Tooltip>
              </Radio.Button>
              <Radio.Button value="list">
                <Tooltip title="列表视图">
                  <UnorderedListOutlined />
                </Tooltip>
              </Radio.Button>
            </Radio.Group>
          </Space>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Space>
            <Tooltip title="刷新">
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={isSearching}
              >
                刷新
              </Button>
            </Tooltip>
          </Space>
        </Col>

        <Col xs={24} sm={24} md={8}>
          <Space>
            <Text type="secondary">每页显示：</Text>
            <Select
              value={searchParams.pageSize || 12}
              onChange={handlePageSizeChange}
              style={{ width: 80 }}
              size="small"
            >
              {pageSizeOptions.map(size => (
                <Option key={size} value={Number(size)}>
                  {size}
                </Option>
              ))}
            </Select>
          </Space>
        </Col>
      </Row>
    </Card>
  );

  // 渲染网格视图
  const renderGridView = () => (
    <Row gutter={[16, 16]} className="agent-discovery-grid">
      {searchResults?.agents?.map((agent: any) => (
        <Col key={agent.id} xs={24} sm={12} md={8} lg={6}>
          <AgentDiscoveryCard
            agent={agent}
            onViewDetails={onViewDetails}
            onConnect={onConnect}
            isCompact={screens.xs}
          />
        </Col>
      ))}
    </Row>
  );

  // 渲染列表视图
  const renderListView = () => (
    <List
      className="agent-discovery-list-view"
      dataSource={searchResults?.agents || []}
      renderItem={(agent: any) => (
        <List.Item>
          <AgentDiscoveryItem
            agent={agent}
            onViewDetails={onViewDetails}
            onConnect={onConnect}
            isSelected={selectedAgents.has(agent.id)}
            onSelect={(selected) => {
              const newSelection = new Set(selectedAgents);
              if (selected) {
                newSelection.add(agent.id);
              } else {
                newSelection.delete(agent.id);
              }
              setSelectedAgents(newSelection);
            }}
          />
        </List.Item>
      )}
    />
  );

  // 渲染分页
  const renderPagination = () => {
    const totalCount = searchResults?.agents?.length || 0;
    if (totalCount <= (searchParams.pageSize || 12)) return null;

    return (
      <div className="agent-discovery-pagination">
        <Pagination
          current={searchParams.page || 1}
          pageSize={searchParams.pageSize || 12}
          total={totalCount}
          onChange={handlePageChange}
          showSizeChanger={false}
          showQuickJumper
          showTotal={(total, range) =>
            `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
          }
        />
      </div>
    );
  };

  return (
    <div className={`agent-discovery-list ${className || ''}`} style={style}>
      {/* 统计信息 */}
      {showStats && <AgentDiscoveryStats />}

      {/* 控制面板 */}
      {showControls && renderControls()}

      {/* 主要内容 */}
      <div className="agent-discovery-content">
        {isSearching && renderLoading()}
        {searchError && renderError()}

        {!isSearching && !searchError && (!searchResults || !searchResults.agents || searchResults.agents.length === 0) && (
          <AgentDiscoveryEmpty onRefresh={handleRefresh} />
        )}

        {!isSearching && !searchError && searchResults && searchResults.agents && searchResults.agents.length > 0 && (
          <>
            {viewMode === 'grid' ? renderGridView() : renderListView()}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
};