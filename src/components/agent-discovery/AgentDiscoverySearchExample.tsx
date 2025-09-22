import React from 'react';
import { Row, Col, Card, Space, Button, Result, Spin } from 'antd';
import { AppstoreOutlined, UnorderedListOutlined, TableOutlined } from '@ant-design/icons';

import { useAgentDiscoveryStore } from '@/store/agentDiscoveryStore';
import {
  AgentDiscoverySearch,
  AgentDiscoveryFilters,
  AgentDiscoverySort,
  AgentDiscoverySearchHistory,
} from './index';

/**
 * Agent发现搜索功能完整示例
 *
 * 这个组件展示了如何组合使用所有Agent发现搜索相关的组件
 * 包括搜索输入、过滤器、排序和搜索历史
 */
export const AgentDiscoverySearchExample: React.FC = () => {
  const {
    searchResults,
    isSearching,
    searchError,
    viewMode,
    showFilters,
    showAdvancedFilters,
    setViewMode,
    toggleFilters,
    searchAgents,
    fetchStatistics,
  } = useAgentDiscoveryStore();

  // 初始化数据
  React.useEffect(() => {
    searchAgents();
    fetchStatistics();
  }, [searchAgents, fetchStatistics]);

  // 视图模式切换按钮
  const viewModeButtons = [
    {
      mode: 'grid' as const,
      icon: <AppstoreOutlined />,
      tooltip: '网格视图',
    },
    {
      mode: 'list' as const,
      icon: <UnorderedListOutlined />,
      tooltip: '列表视图',
    },
    {
      mode: 'table' as const,
      icon: <TableOutlined />,
      tooltip: '表格视图',
    },
  ];

  return (
    <div className="agent-discovery-search-example p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Agent 发现中心
          </h1>
          <p className="text-gray-600">
            搜索、过滤和发现符合您需求的Agent
          </p>
        </div>

        {/* 操作栏 */}
        <div className="mb-4 flex items-center justify-between">
          <Space>
            <Button
              type="primary"
              onClick={searchAgents}
              loading={isSearching}
            >
              搜索Agent
            </Button>
            <Button onClick={() => fetchStatistics()}>
              刷新统计
            </Button>
          </Space>

          <Space>
            {viewModeButtons.map(({ mode, icon, tooltip }) => (
              <Button
                key={mode}
                type={viewMode === mode ? 'primary' : 'default'}
                icon={icon}
                onClick={() => setViewMode(mode)}
                title={tooltip}
              />
            ))}
            <Button onClick={toggleFilters}>
              {showFilters ? '隐藏过滤器' : '显示过滤器'}
            </Button>
          </Space>
        </div>

        {/* 主要内容区域 */}
        <Row gutter={[16, 16]}>
          {/* 左侧搜索和过滤区域 */}
          <Col xs={24} lg={showFilters ? 8 : 24} xl={showFilters ? 6 : 24}>
            <Space direction="vertical" className="w-full" size="middle">
              {/* 搜索组件 */}
              <AgentDiscoverySearch />

              {/* 高级过滤器面板 */}
              {showAdvancedFilters && (
                <AgentDiscoveryFilters />
              )}

              {/* 排序选项 */}
              <AgentDiscoverySort />

              {/* 搜索历史 */}
              <AgentDiscoverySearchHistory maxItems={5} />
            </Space>
          </Col>

          {/* 右侧结果区域 */}
          <Col xs={24} lg={showFilters ? 16 : 24} xl={showFilters ? 18 : 24}>
            {isSearching ? (
              <Card>
                <div className="flex items-center justify-center py-12">
                  <Space direction="vertical" align="center">
                    <Spin size="large" />
                    <p>正在搜索Agent...</p>
                  </Space>
                </div>
              </Card>
            ) : searchError ? (
              <Result
                status="error"
                title="搜索失败"
                subTitle={searchError}
                extra={
                  <Button type="primary" onClick={searchAgents}>
                    重试
                  </Button>
                }
              />
            ) : searchResults ? (
              <div className="space-y-4">
                {/* 搜索结果概览 */}
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        搜索结果
                      </h3>
                      <p className="text-gray-600">
                        找到 {searchResults.pagination.total} 个Agent
                        (第 {searchResults.pagination.page} 页，
                        每页 {searchResults.pagination.pageSize} 个)
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      搜索耗时: {searchResults.searchTime}ms
                    </div>
                  </div>
                </Card>

                {/* Agent列表展示 */}
                <Card title="Agent列表">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.agents.map((agent) => (
                      <Card
                        key={agent.id}
                        size="small"
                        className="hover:shadow-md transition-shadow"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium truncate">{agent.name}</h4>
                            {agent.isVerified && (
                              <span className="text-green-500">✓</span>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 line-clamp-2">
                            {agent.description}
                          </p>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{agent.language}</span>
                            <span>评分: {agent.rating || 'N/A'}</span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {agent.tags?.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                            {(agent.tags?.length || 0) > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                +{(agent.tags?.length || 0) - 3}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-xs">
                            <span className={`px-2 py-1 rounded ${
                              agent.status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {agent.status}
                            </span>
                            <span className="text-gray-500">
                              {agent.connections || 0} 连接
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </div>
            ) : (
              <Card>
                <Result
                  status="info"
                  title="开始搜索"
                  subTitle="请使用搜索框输入关键词或应用过滤器来发现Agent"
                />
              </Card>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};