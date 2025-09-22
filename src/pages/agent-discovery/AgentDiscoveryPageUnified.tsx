import React, { useEffect, useCallback, useMemo } from 'react';
import { Card, Row, Col, Button, Space, Spin, Alert, Result, Typography, Tabs, Breadcrumb } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  HistoryOutlined,
  ReloadOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
  TableOutlined,
  PlusOutlined,
  RobotOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useUnifiedAgentDiscoveryStore } from '../../store/unifiedAgentDiscoveryStore';
import { AgentDiscoverySearch } from '../../components/agent-discovery/AgentDiscoverySearch';
import { AgentDiscoveryFilters } from '../../components/agent-discovery/AgentDiscoveryFilters';
import { AgentDiscoverySort } from '../../components/agent-discovery/AgentDiscoverySort';
import { AgentDiscoveryList } from '../../components/agent-discovery/AgentDiscoveryList';
import { AgentDiscoveryStats } from '../../components/agent-discovery/AgentDiscoveryStats';
import { AgentDiscoverySearchHistory } from '../../components/agent-discovery/AgentDiscoverySearchHistory';
import { AgentDiscoveryCommunicationPanel } from '../../components/agent-discovery/AgentDiscoveryCommunicationPanel';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const AgentDiscoveryPageUnified: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 使用统一数据源的Store
  const {
    searchResults,
    isSearching,
    searchError,
    stats,
    isLoadingStats,
    statsError,
    viewMode,
    showFilters,
    showAdvancedFilters,
    searchAgents,
    fetchStatistics,
    setViewMode,
    toggleFilters,
    toggleAdvancedFilters,
    clearErrors,
    getFilteredAgents,
    getSelectedAgentsCount,
    getAverageRating,
    getTotalConnections,
    getActiveAgentsCount,
    searchHistory,
    communicationChannels
  } = useUnifiedAgentDiscoveryStore();

  // 页面加载时初始化数据
  useEffect(() => {
    const initializePage = async () => {
      try {
        await fetchStatistics();
        // 如果没有搜索结果，执行一次默认搜索
        if (!searchResults) {
          await searchAgents();
        }
      } catch (error) {
        console.error('页面初始化失败:', error);
      }
    };

    initializePage();
  }, []);

  // 处理搜索
  const handleSearch = useCallback(async () => {
    try {
      await searchAgents();
    } catch (error) {
      console.error('搜索失败:', error);
    }
  }, [searchAgents]);

  // 刷新数据
  const handleRefresh = useCallback(async () => {
    try {
      await fetchStatistics();
      await searchAgents();
    } catch (error) {
      console.error('刷新失败:', error);
    }
  }, [fetchStatistics, searchAgents]);

  // 创建新Agent
  const handleCreateAgent = useCallback(() => {
    navigate('/agents/create');
  }, [navigate]);

  // 计算统计信息
  const computedStats = useMemo(() => {
    const filteredAgents = getFilteredAgents();
    return {
      totalAgents: filteredAgents.length,
      selectedAgents: getSelectedAgentsCount(),
      averageRating: getAverageRating(),
      totalConnections: getTotalConnections(),
      activeAgents: getActiveAgentsCount()
    };
  }, [getFilteredAgents, getSelectedAgentsCount, getAverageRating, getTotalConnections, getActiveAgentsCount]);

  // 处理错误重试
  const handleRetry = useCallback(async () => {
    clearErrors();
    await handleRefresh();
  }, [clearErrors, handleRefresh]);

  // 渲染错误状态
  const renderError = useCallback((error: string, onRetry: () => void) => (
    <Result
      status="error"
      title="操作失败"
      subTitle={error}
      extra={[
        <Button key="retry" type="primary" onClick={onRetry}>
          重试
        </Button>
      ]}
    />
  ), []);

  // 渲染加载状态
  const renderLoading = useCallback((message = '加载中...') => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
      <Spin size="large" tip={message} />
    </div>
  ), []);

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      {/* 页面标题和导航 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Breadcrumb
            items={[
              { href: '/', title: <HomeOutlined /> },
              { href: '/agents', title: <RobotOutlined /> },
              { title: 'Agent发现' }
            ]}
          />
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Agent发现
              </Title>
              <Text type="secondary">
                发现、探索和连接智能代理
              </Text>
            </div>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateAgent}
              >
                创建Agent
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleRefresh}
                loading={isSearching || isLoadingStats}
              >
                刷新
              </Button>
            </Space>
          </div>
        </Col>
      </Row>

      {/* 统计信息卡片 */}
      {statsError ? (
        <Alert
          message="统计信息加载失败"
          description={statsError}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => fetchStatistics()}>
              重试
            </Button>
          }
          style={{ marginBottom: 24 }}
        />
      ) : (
        <AgentDiscoveryStats
          stats={stats}
          isLoading={isLoadingStats}
          computedStats={computedStats}
        />
      )}

      {/* 主要内容区域 */}
      <Card>
        {/* 搜索和过滤工具栏 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <AgentDiscoverySearch
              onSearch={handleSearch}
              loading={isSearching}
              error={searchError}
            />
          </Col>
        </Row>

        {/* 过滤器和排序 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Space>
              <Button
                icon={<FilterOutlined />}
                onClick={toggleFilters}
                type={showFilters ? 'primary' : 'default'}
              >
                过滤器
              </Button>
              <Button
                icon={<SortAscendingOutlined />}
                type="default"
              >
                排序
              </Button>
              <Button
                icon={<HistoryOutlined />}
                onClick={() => {}}
                type="default"
              >
                历史记录
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 过滤器面板 */}
        {showFilters && (
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col span={24}>
              <AgentDiscoveryFilters
                onApply={handleSearch}
                onClear={() => {}}
              />
            </Col>
          </Row>
        )}

        {/* 视图切换 */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={24}>
            <Space>
              <Button
                icon={<AppstoreOutlined />}
                onClick={() => setViewMode('grid')}
                type={viewMode === 'grid' ? 'primary' : 'default'}
              >
                网格
              </Button>
              <Button
                icon={<UnorderedListOutlined />}
                onClick={() => setViewMode('list')}
                type={viewMode === 'list' ? 'primary' : 'default'}
              >
                列表
              </Button>
              <Button
                icon={<TableOutlined />}
                onClick={() => setViewMode('table')}
                type={viewMode === 'table' ? 'primary' : 'default'}
              >
                表格
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 搜索结果 */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            {searchError ? (
              renderError(searchError, handleRetry)
            ) : isSearching ? (
              renderLoading('搜索中...')
            ) : searchResults ? (
              <AgentDiscoveryList
                agents={searchResults.agents}
                viewMode={viewMode}
                loading={isSearching}
                onSelect={(agent) => {}}
                onEdit={(agent) => {}}
                onDelete={(agent) => {}}
                pagination={searchResults.pagination}
              />
            ) : (
              renderLoading('准备数据...')
            )}
          </Col>
        </Row>
      </Card>

      {/* 侧边面板 */}
      <div style={{ position: 'fixed', right: 24, top: 100, width: 300, zIndex: 1000 }}>
        {/* 通信面板 */}
        <Card
          title="Agent通信"
          size="small"
          style={{ marginBottom: 16 }}
        >
          <AgentDiscoveryCommunicationPanel
            agents={getFilteredAgents()}
            onConnect={(agent) => {}}
            onDisconnect={(agent) => {}}
            communicationStatus={{}}
          />
        </Card>

        {/* 搜索历史 */}
        <Card
          title="搜索历史"
          size="small"
        >
          <AgentDiscoverySearchHistory
            history={searchHistory}
            onSelect={(history) => {}}
            onClear={() => {}}
          />
        </Card>
      </div>
    </div>
  );
};

export default AgentDiscoveryPageUnified;