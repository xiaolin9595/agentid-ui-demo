import React from 'react';
import { Card, List, Button, Badge, Tooltip, Empty, Tag, Typography } from 'antd';
import {
  HistoryOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  ClearOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ListProps } from 'antd';

import { useAgentDiscoveryStore } from '@/store/agentDiscoveryStore';

const { Text } = Typography;

interface AgentDiscoverySearchHistoryProps {
  className?: string;
  style?: React.CSSProperties;
  maxItems?: number;
}

export const AgentDiscoverySearchHistory: React.FC<AgentDiscoverySearchHistoryProps> = ({
  className,
  style,
  maxItems = 10,
}) => {
  const {
    searchHistory,
    removeFromHistory,
    clearHistory,
    updateSearchParams,
    searchAgents,
  } = useAgentDiscoveryStore();

  // 处理历史记录点击
  const handleHistoryClick = (historyId: string) => {
    const history = searchHistory.find(h => h.id === historyId);
    if (history) {
      updateSearchParams(history.params);
      searchAgents();
    }
  };

  // 格式化时间
  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;

    return timestamp.toLocaleDateString();
  };

  // 获取搜索条件标签
  const getSearchConditionTags = (params: any) => {
    const tags: React.ReactNode[] = [];

    if (params.search) {
      tags.push(<Tag key="search" color="blue">搜索: {params.search}</Tag>);
    }
    if (params.capabilities?.length) {
      tags.push(<Tag key="capabilities" color="green">{params.capabilities.length} 能力</Tag>);
    }
    if (params.status) {
      tags.push(<Tag key="status" color="orange">状态: {params.status}</Tag>);
    }
    if (params.type) {
      tags.push(<Tag key="type" color="purple">类型: {params.type}</Tag>);
    }
    if (params.language) {
      tags.push(<Tag key="language" color="cyan">语言: {params.language}</Tag>);
    }

    return tags;
  };

  // 自定义列表项渲染
  const renderItem: ListProps<any>['renderItem'] = (item) => {
    const history = typeof item === 'object' ? item : item;
    const isRecent = new Date().getTime() - history.timestamp.getTime() < 3600000; // 1小时内

    return (
      <List.Item
        key={history.id}
        actions={[
          <Tooltip title="重新搜索">
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleHistoryClick(history.id);
              }}
              size="small"
            />
          </Tooltip>,
          <Tooltip title="删除">
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                removeFromHistory(history.id);
              }}
              size="small"
              danger
            />
          </Tooltip>,
        ]}
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => handleHistoryClick(history.id)}
      >
        <List.Item.Meta
          avatar={
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <SearchOutlined className="text-blue-600" />
            </div>
          }
          title={
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {isRecent && <Badge status="processing" className="mr-2" />}
                <Text strong>{history.params.search || '全部Agent'}</Text>
              </div>
              <div className="flex items-center space-x-2">
                <Text type="secondary" className="text-xs">
                  {history.resultCount} 结果
                </Text>
                <Tag color={isRecent ? 'green' : 'default'}>
                  {formatTime(history.timestamp)}
                </Tag>
              </div>
            </div>
          }
          description={
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1">
                {getSearchConditionTags(history.params)}
              </div>
              <Text type="secondary" className="text-xs">
                <ClockCircleOutlined className="mr-1" />
                {history.timestamp.toLocaleString()}
              </Text>
            </div>
          }
        />
      </List.Item>
    );
  };

  // 按时间排序的历史记录
  const sortedHistory = [...searchHistory]
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, maxItems);

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <HistoryOutlined className="mr-2" />
            搜索历史
            <Badge count={searchHistory.length} size="small" className="ml-2" />
          </div>
          {searchHistory.length > 0 && (
            <Button
              type="text"
              icon={<ClearOutlined />}
              onClick={clearHistory}
              size="small"
              danger
            >
              清除全部
            </Button>
          )}
        </div>
      }
      className={className}
      style={style}
    >
      {searchHistory.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无搜索历史"
          className="py-8"
        >
          <Text type="secondary">开始搜索Agent后，历史记录将显示在这里</Text>
        </Empty>
      ) : (
        <div className="space-y-4">
          {/* 最近搜索 */}
          {sortedHistory.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <Text strong>最近搜索</Text>
                <Text type="secondary" className="text-xs">
                  显示最近 {Math.min(maxItems, sortedHistory.length)} 条
                </Text>
              </div>

              <List
                itemLayout="horizontal"
                dataSource={sortedHistory}
                renderItem={renderItem}
                size="small"
                className="search-history-list"
              />
            </div>
          )}

          {/* 统计信息 */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{searchHistory.length}</div>
                <div className="text-gray-500">总搜索次数</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {searchHistory.reduce((sum, h) => sum + h.resultCount, 0)}
                </div>
                <div className="text-gray-500">累计结果数</div>
              </div>
            </div>
          </div>

          {/* 热门搜索 */}
          {searchHistory.length >= 3 && (
            <div>
              <Text strong className="mb-2 block">热门搜索条件</Text>
              <div className="flex flex-wrap gap-2">
                {Array.from(
                  new Set(
                    searchHistory
                      .filter(h => h.params.search)
                      .map(h => h.params.search)
                  )
                )
                  .slice(0, 5)
                  .map((search, index) => {
                    const count = searchHistory.filter(h => h.params.search === search).length;
                    return (
                      <Tag
                        key={index}
                        color={count >= 3 ? 'red' : count >= 2 ? 'orange' : 'blue'}
                        className="cursor-pointer"
                        onClick={() => {
                          const history = searchHistory.find(h => h.params.search === search);
                          if (history) {
                            updateSearchParams(history.params);
                            searchAgents();
                          }
                        }}
                      >
                        {search} ({count})
                      </Tag>
                    );
                  })}
              </div>
            </div>
          )}

          {/* 使用提示 */}
          <div className="text-xs text-gray-500 p-2 bg-blue-50 rounded">
            <p className="mb-1">💡 搜索历史提示：</p>
            <ul className="list-disc list-inside space-y-1">
              <li>点击历史记录可快速重新搜索</li>
              <li>历史记录最多保存10条</li>
              <li>热门标签显示搜索频率较高的条件</li>
              <li>绿色标签表示1小时内的搜索</li>
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
};