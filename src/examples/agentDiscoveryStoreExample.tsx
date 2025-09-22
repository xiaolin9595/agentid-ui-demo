import React, { useEffect, useState } from 'react';
import { useAgentDiscoveryStore } from '../store';

/**
 * Agent发现Store使用示例
 * 展示如何在React组件中使用AgentDiscoveryStore
 */
export const AgentDiscoveryStoreExample: React.FC = () => {
  const {
    // 搜索状态
    searchParams,
    searchResults,
    isSearching,
    searchError,

    // 选中状态
    selectedAgent,
    selectedAgents,

    // 过滤和排序
    activeFilters,
    currentSort,

    // 统计信息
    stats,
    isLoadingStats,

    // UI状态
    viewMode,
    showFilters,

    // Actions
    searchAgents,
    updateSearchParams,
    setSelectedAgent,
    toggleAgentSelection,
    setActiveFilters,
    setCurrentSort,
    fetchStatistics,
    setViewMode,
    toggleFilters,

    // 计算属性
    getFilteredAgents,
    getSelectedAgentsCount,
    getAverageRating,
    getActiveAgentsCount,
    getFeaturedAgents,
    getSearchSuggestions
  } = useAgentDiscoveryStore();

  const [searchQuery, setSearchQuery] = useState('');

  // 组件挂载时获取统计数据
  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // 处理搜索
  const handleSearch = () => {
    if (searchQuery.trim()) {
      updateSearchParams({ search: searchQuery, page: 1 });
      searchAgents();
    }
  };

  // 处理Agent选择
  const handleAgentSelect = (agent: any) => {
    setSelectedAgent(agent);
  };

  // 处理过滤
  const handleFilterChange = (filterType: string, value: any) => {
    setActiveFilters({ [filterType]: value });
  };

  // 处理排序
  const handleSortChange = (field: string, order: 'asc' | 'desc') => {
    setCurrentSort({ field: field as any, order });
    searchAgents();
  };

  // 获取计算属性
  const filteredAgents = getFilteredAgents();
  const selectedCount = getSelectedAgentsCount();
  const averageRating = getAverageRating();
  const activeCount = getActiveAgentsCount();
  const featuredAgents = getFeaturedAgents();

  return (
    <div className="agent-discovery-example">
      <h2>Agent发现功能示例</h2>

      {/* 搜索栏 */}
      <div className="search-section">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜索Agent..."
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? '搜索中...' : '搜索'}
        </button>
        <button onClick={() => toggleFilters()}>
          {showFilters ? '隐藏过滤' : '显示过滤'}
        </button>
      </div>

      {/* 过滤面板 */}
      {showFilters && (
        <div className="filters-section">
          <h3>过滤选项</h3>
          <div>
            <label>状态：</label>
            <select
              value={activeFilters.statuses?.[0] || ''}
              onChange={(e) => handleFilterChange('statuses', e.target.value ? [e.target.value] : [])}
            >
              <option value="">全部</option>
              <option value="active">活跃</option>
              <option value="inactive">非活跃</option>
              <option value="stopped">已停止</option>
            </select>
          </div>
          <div>
            <label>语言：</label>
            <select
              value={activeFilters.languages?.[0] || ''}
              onChange={(e) => handleFilterChange('languages', e.target.value ? [e.target.value] : [])}
            >
              <option value="">全部</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="solidity">Solidity</option>
            </select>
          </div>
        </div>
      )}

      {/* 统计信息 */}
      {stats && (
        <div className="stats-section">
          <h3>统计信息</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <h4>总Agent数</h4>
              <p>{stats.totalAgents}</p>
            </div>
            <div className="stat-item">
              <h4>活跃Agent</h4>
              <p>{stats.activeAgents}</p>
            </div>
            <div className="stat-item">
              <h4>平均评分</h4>
              <p>{stats.averageRating.toFixed(1)}</p>
            </div>
            <div className="stat-item">
              <h4>总连接数</h4>
              <p>{stats.totalConnections}</p>
            </div>
          </div>
        </div>
      )}

      {/* 排序选项 */}
      <div className="sort-section">
        <label>排序：</label>
        <select
          value={currentSort.field}
          onChange={(e) => handleSortChange(e.target.value, currentSort.order)}
        >
          <option value="createdAt">创建时间</option>
          <option value="name">名称</option>
          <option value="rating">评分</option>
          <option value="connections">连接数</option>
        </select>
        <select
          value={currentSort.order}
          onChange={(e) => handleSortChange(currentSort.field, e.target.value as 'asc' | 'desc')}
        >
          <option value="asc">升序</option>
          <option value="desc">降序</option>
        </select>
      </div>

      {/* 视图模式切换 */}
      <div className="view-mode-section">
        <button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'active' : ''}>
          网格视图
        </button>
        <button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'active' : ''}>
          列表视图
        </button>
        <button onClick={() => setViewMode('table')} className={viewMode === 'table' ? 'active' : ''}>
          表格视图
        </button>
      </div>

      {/* 搜索结果 */}
      {searchError && (
        <div className="error-message">
          {searchError}
        </div>
      )}

      {isSearching ? (
        <div className="loading">搜索中...</div>
      ) : (
        <div className={`results-section ${viewMode}`}>
          {filteredAgents.length > 0 ? (
            <div className="results-grid">
              {filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  className={`agent-card ${selectedAgent?.id === agent.id ? 'selected' : ''}`}
                  onClick={() => handleAgentSelect(agent)}
                >
                  <h4>{agent.name}</h4>
                  <p>{agent.description}</p>
                  <div className="agent-info">
                    <span>状态: {agent.status}</span>
                    <span>评分: {agent.rating?.toFixed(1)}</span>
                    <span>连接数: {agent.connections}</span>
                  </div>
                  <div className="agent-tags">
                    {agent.tags?.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAgentSelection(agent);
                    }}
                    className={selectedAgents.some(a => a.id === agent.id) ? 'selected' : ''}
                  >
                    {selectedAgents.some(a => a.id === agent.id) ? '已选择' : '选择'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">未找到匹配的Agent</div>
          )}
        </div>
      )}

      {/* 选中信息 */}
      {selectedCount > 0 && (
        <div className="selection-info">
          <p>已选择 {selectedCount} 个Agent</p>
          <p>平均评分: {averageRating.toFixed(1)}</p>
          <p>活跃Agent: {activeCount}</p>
        </div>
      )}

      {/* 特色Agent */}
      {featuredAgents.length > 0 && (
        <div className="featured-section">
          <h3>特色Agent</h3>
          <div className="featured-grid">
            {featuredAgents.slice(0, 3).map((agent) => (
              <div key={agent.id} className="featured-card">
                <h4>{agent.name}</h4>
                <p>{agent.description}</p>
                <div className="featured-badge">✨ 特色</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .agent-discovery-example {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .search-section {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .search-section input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .search-section button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          background: #007bff;
          color: white;
          cursor: pointer;
        }

        .search-section button:disabled {
          background: #ccc;
        }

        .filters-section {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .filters-section div {
          margin-bottom: 10px;
        }

        .stats-section {
          background: #e9ecef;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 10px;
        }

        .stat-item {
          background: white;
          padding: 10px;
          border-radius: 4px;
          text-align: center;
        }

        .stat-item h4 {
          margin: 0 0 5px 0;
          font-size: 14px;
          color: #666;
        }

        .stat-item p {
          margin: 0;
          font-size: 24px;
          font-weight: bold;
          color: #007bff;
        }

        .sort-section {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 20px;
        }

        .view-mode-section {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }

        .view-mode-section button {
          padding: 8px 16px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          border-radius: 4px;
        }

        .view-mode-section button.active {
          background: #007bff;
          color: white;
        }

        .results-section {
          margin-bottom: 20px;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .results-section.list .results-grid {
          grid-template-columns: 1fr;
        }

        .results-section.table .results-grid {
          display: block;
        }

        .agent-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .agent-card:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .agent-card.selected {
          border-color: #007bff;
          background: #f8f9ff;
        }

        .agent-card h4 {
          margin: 0 0 10px 0;
          color: #333;
        }

        .agent-card p {
          margin: 0 0 10px 0;
          color: #666;
          font-size: 14px;
        }

        .agent-info {
          display: flex;
          gap: 15px;
          margin-bottom: 10px;
          font-size: 12px;
          color: #888;
        }

        .agent-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 10px;
        }

        .tag {
          background: #e9ecef;
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 12px;
          color: #666;
        }

        .agent-card button {
          padding: 5px 10px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          border-radius: 4px;
          font-size: 12px;
        }

        .agent-card button.selected {
          background: #007bff;
          color: white;
        }

        .selection-info {
          background: #d4edda;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .featured-section {
          margin-top: 30px;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin-top: 10px;
        }

        .featured-card {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 8px;
          padding: 15px;
          position: relative;
        }

        .featured-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #ffc107;
          color: white;
          padding: 2px 6px;
          border-radius: 12px;
          font-size: 12px;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 20px;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #666;
        }

        .no-results {
          text-align: center;
          padding: 40px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default AgentDiscoveryStoreExample;