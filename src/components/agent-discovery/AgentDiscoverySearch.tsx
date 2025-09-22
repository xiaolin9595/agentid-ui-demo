import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Dropdown, Badge, Tooltip } from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  HistoryOutlined,
  ClearOutlined,
  SettingOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

import { useAgentDiscoveryStore } from '@/store/agentDiscoveryStore';
import { DebouncedSearchInput } from './DebouncedSearchInput';

interface AgentDiscoverySearchProps {
  className?: string;
  style?: React.CSSProperties;
}

export const AgentDiscoverySearch: React.FC<AgentDiscoverySearchProps> = ({
  className,
  style,
}) => {
  const {
    searchParams,
    searchHistory,
    isSearching,
    updateSearchParams,
    searchAgents,
    clearHistory,
    getSearchSuggestions,
    showAdvancedFilters,
    toggleAdvancedFilters,
  } = useAgentDiscoveryStore();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchInputValue, setSearchInputValue] = useState(searchParams.search || '');

  // 更新搜索输入框的值
  useEffect(() => {
    setSearchInputValue(searchParams.search || '');
  }, [searchParams.search]);

  // 获取搜索建议
  useEffect(() => {
    if (searchInputValue && searchInputValue.length >= 2) {
      const newSuggestions = getSearchSuggestions(searchInputValue);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [searchInputValue, getSearchSuggestions]);

  // 处理搜索输入变化
  const handleSearchChange = (value: string) => {
    setSearchInputValue(value);
    updateSearchParams({ search: value });
  };

  // 处理搜索
  const handleSearch = () => {
    searchAgents();
    setShowSuggestions(false);
  };

  // 处理建议点击
  const handleSuggestionClick = (suggestion: string) => {
    setSearchInputValue(suggestion);
    updateSearchParams({ search: suggestion });
    searchAgents();
    setShowSuggestions(false);
  };

  // 快速搜索菜单
  const quickSearchMenuItems: MenuProps['items'] = [
    {
      key: 'active',
      label: (
        <div className="flex items-center justify-between">
          <span>活跃Agent</span>
          <Badge count={searchHistory.length} size="small" />
        </div>
      ),
      children: searchHistory.slice(0, 5).map((history) => ({
        key: history.id,
        label: (
          <div className="flex flex-col">
            <span className="font-medium">{history.params.search}</span>
            <span className="text-xs text-gray-500">
              {history.timestamp.toLocaleString()} · {history.resultCount} 结果
            </span>
          </div>
        ),
        onClick: () => {
          updateSearchParams(history.params);
          searchAgents();
        },
      })),
    },
    {
      key: 'clear',
      label: (
        <Button
          type="text"
          icon={<ClearOutlined />}
          onClick={clearHistory}
          className="w-full text-left"
        >
          清除历史
        </Button>
      ),
    },
  ];

  // 高级搜索菜单
  const advancedSearchMenuItems: MenuProps['items'] = [
    {
      key: 'capability',
      label: '能力',
      children: ['AI/ML', '数据处理', '区块链', '自动化', '通信'].map((cap) => ({
        key: cap,
        label: cap,
        onClick: () => {
          const currentCapabilities = searchParams.capabilities || [];
          const newCapabilities = currentCapabilities.includes(cap as any)
            ? currentCapabilities.filter(c => c !== cap)
            : [...currentCapabilities, cap as any];
          updateSearchParams({ capabilities: newCapabilities });
          searchAgents();
        },
      })),
    },
    {
      key: 'status',
      label: '状态',
      children: ['active', 'inactive', 'pending'].map((status) => ({
        key: status,
        label: (
          <div className="flex items-center">
            <Badge
              status={status === 'active' ? 'success' : status === 'inactive' ? 'error' : 'warning'}
              text={status === 'active' ? '活跃' : status === 'inactive' ? '非活跃' : '待定'}
            />
          </div>
        ),
        onClick: () => {
          updateSearchParams({ status: status as any });
          searchAgents();
        },
      })),
    },
    {
      key: 'type',
      label: '类型',
      children: ['ai_agent', 'data_agent', 'blockchain_agent', 'hybrid_agent'].map((type) => ({
        key: type,
        label: type.replace('_', ' '),
        onClick: () => {
          updateSearchParams({ type: type as any });
          searchAgents();
        },
      })),
    },
    {
      key: 'language',
      label: '语言',
      children: ['javascript', 'python', 'solidity', 'typescript', 'go'].map((lang) => ({
        key: lang,
        label: lang,
        onClick: () => {
          updateSearchParams({ language: lang });
          searchAgents();
        },
      })),
    },
  ];

  return (
    <Card className={className} style={style}>
      <div className="space-y-4">
        {/* 主要搜索输入 */}
        <div className="relative">
          <DebouncedSearchInput
            placeholder="搜索Agent名称、描述或标签..."
            value={searchInputValue}
            onChange={handleSearchChange}
            onSearch={handleSearch}
            size="large"
            className="w-full"
          />

          {/* 搜索建议下拉 */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="text-sm text-gray-700 truncate">{suggestion}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 搜索操作按钮 */}
        <div className="flex items-center justify-between">
          <Space>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              loading={isSearching}
            >
              搜索
            </Button>

            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                updateSearchParams({ search: '' });
                setSearchInputValue('');
                searchAgents();
              }}
              disabled={isSearching}
            >
              重置
            </Button>

            <Dropdown menu={{ items: quickSearchMenuItems }} trigger={['click']}>
              <Button icon={<HistoryOutlined />}>
                搜索历史
                {searchHistory.length > 0 && (
                  <Badge count={searchHistory.length} size="small" className="ml-1" />
                )}
              </Button>
            </Dropdown>

            <Dropdown menu={{ items: advancedSearchMenuItems }} trigger={['click']}>
              <Button
                icon={<FilterOutlined />}
                type={showAdvancedFilters ? 'primary' : 'default'}
              >
                高级搜索
              </Button>
            </Dropdown>

            <Tooltip title="显示/隐藏高级过滤器面板">
              <Button
                icon={<SettingOutlined />}
                onClick={toggleAdvancedFilters}
                type={showAdvancedFilters ? 'primary' : 'default'}
              />
            </Tooltip>
          </Space>

          <Space>
            {/* 当前搜索条件显示 */}
            {searchParams.search && (
              <Badge
                count={`"${searchParams.search}"`}
                status="processing"
                className="mr-2"
              />
            )}
            {searchParams.capabilities && searchParams.capabilities.length > 0 && (
              <Badge
                count={`${searchParams.capabilities.length} 能力`}
                status="warning"
                className="mr-2"
              />
            )}
            {searchParams.status && (
              <Badge
                count={`状态: ${searchParams.status}`}
                status={searchParams.status === 'active' ? 'success' : 'error'}
              />
            )}
          </Space>
        </div>

        {/* 当前搜索条件概览 */}
        {(searchParams.search ||
          (searchParams.capabilities && searchParams.capabilities.length > 0) ||
          searchParams.status ||
          searchParams.type ||
          searchParams.language) && (
          <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">当前条件：</span>
            {searchParams.search && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                搜索: {searchParams.search}
              </span>
            )}
            {searchParams.capabilities && searchParams.capabilities.length > 0 && (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                能力: {searchParams.capabilities.join(', ')}
              </span>
            )}
            {searchParams.status && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">
                状态: {searchParams.status}
              </span>
            )}
            {searchParams.type && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm">
                类型: {searchParams.type}
              </span>
            )}
            {searchParams.language && (
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-sm">
                语言: {searchParams.language}
              </span>
            )}
          </div>
        )}

        {/* 搜索提示 */}
        <div className="text-xs text-gray-500">
          <p>提示：输入2个字符以上可显示搜索建议</p>
          <p>支持搜索Agent名称、描述、标签等信息</p>
        </div>
      </div>
    </Card>
  );
};