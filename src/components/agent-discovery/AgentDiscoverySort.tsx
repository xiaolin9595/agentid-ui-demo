import React from 'react';
import { Card, Select, Button, Space, Tooltip, Radio, Divider } from 'antd';
import {
  SortAscendingOutlined,
  SortDescendingOutlined,
  SwapOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import type { SelectProps } from 'antd';

import { useAgentDiscoveryStore } from '@/store/agentDiscoveryStore';
import { AgentDiscoverySortParams } from '@/types/agent-discovery';

interface AgentDiscoverySortProps {
  className?: string;
  style?: React.CSSProperties;
}

const sortOptions: Array<{
  value: AgentDiscoverySortParams['field'];
  label: string;
  description: string;
  icon: React.ReactNode;
}> = [
  {
    value: 'name',
    label: '名称',
    description: '按Agent名称排序',
    icon: <OrderedListOutlined />,
  },
  {
    value: 'createdAt',
    label: '创建时间',
    description: '按创建时间排序',
    icon: <OrderedListOutlined />,
  },
  {
    value: 'updatedAt',
    label: '更新时间',
    description: '按最后更新时间排序',
    icon: <OrderedListOutlined />,
  },
  {
    value: 'rating',
    label: '评分',
    description: '按用户评分排序',
    icon: <OrderedListOutlined />,
  },
  {
    value: 'status',
    label: '状态',
    description: '按Agent状态排序',
    icon: <OrderedListOutlined />,
  },
  {
    value: 'type',
    label: '类型',
    description: '按Agent类型排序',
    icon: <OrderedListOutlined />,
  },
  {
    value: 'capabilities',
    label: '能力',
    description: '按能力数量排序',
    icon: <OrderedListOutlined />,
  },
  {
    value: 'codeSize',
    label: '代码大小',
    description: '按代码行数排序',
    icon: <OrderedListOutlined />,
  },
  {
    value: 'connections',
    label: '连接数',
    description: '按连接数排序',
    icon: <OrderedListOutlined />,
  },
];

const orderOptions = [
  {
    label: '升序',
    value: 'asc' as const,
    icon: <SortAscendingOutlined />,
    description: '从小到大排列',
  },
  {
    label: '降序',
    value: 'desc' as const,
    icon: <SortDescendingOutlined />,
    description: '从大到小排列',
  },
];

export const AgentDiscoverySort: React.FC<AgentDiscoverySortProps> = ({
  className,
  style,
}) => {
  const {
    currentSort,
    setCurrentSort,
    resetSort,
    searchAgents,
  } = useAgentDiscoveryStore();

  // 自定义下拉选项渲染
  const customRender: SelectProps['optionRender'] = (option) => {
    const sortOption = sortOptions.find(opt => opt.value === option.value);
    if (!sortOption) return option.label;

    return (
      <div className="flex items-center p-2">
        <span className="mr-2 text-gray-500">{sortOption.icon}</span>
        <div className="flex-1">
          <div className="font-medium">{sortOption.label}</div>
          <div className="text-xs text-gray-500">{sortOption.description}</div>
        </div>
      </div>
    );
  };

  // 自定义下拉标签渲染
  const customTagRender: SelectProps['tagRender'] = (props) => {
    const { value, onClose } = props;
    const sortOption = sortOptions.find(opt => opt.value === value);
    const orderOption = orderOptions.find(opt => opt.value === currentSort.order);

    if (!sortOption) return <></>;

    return (
      <span className="ant-select-selection-item">
        <span className="mr-1">{sortOption.icon}</span>
        {sortOption.label}
        {orderOption && (
          <span className="ml-1">
            ({orderOption.icon} {orderOption.label})
          </span>
        )}
        <span
          className="ant-select-selection-item-remove"
          onClick={onClose}
        >
          ×
        </span>
      </span>
    );
  };

  // 处理排序字段变化
  const handleSortFieldChange = (field: AgentDiscoverySortParams['field']) => {
    setCurrentSort({
      ...currentSort,
      field,
    });
  };

  // 处理排序方向变化
  const handleSortOrderChange = (order: 'asc' | 'desc') => {
    setCurrentSort({
      ...currentSort,
      order,
    });
  };

  // 切换排序方向
  const toggleSortOrder = () => {
    setCurrentSort({
      ...currentSort,
      order: currentSort.order === 'asc' ? 'desc' : 'asc',
    });
  };

  // 应用排序
  const applySort = () => {
    searchAgents();
  };

  // 获取当前排序选项
  const currentSortOption = sortOptions.find(opt => opt.value === currentSort.field);
  const currentOrderOption = orderOptions.find(opt => opt.value === currentSort.order);

  return (
    <Card
      title={
        <div className="flex items-center">
          <OrderedListOutlined className="mr-2" />
          排序选项
        </div>
      }
      className={className}
      style={style}
      extra={
        <Space>
          <Button
            icon={<SwapOutlined />}
            onClick={toggleSortOrder}
            size="small"
          >
            切换方向
          </Button>
          <Button
            type="primary"
            onClick={applySort}
            size="small"
          >
            应用排序
          </Button>
          <Button
            onClick={resetSort}
            size="small"
          >
            重置
          </Button>
        </Space>
      }
    >
      <div className="space-y-4">
        {/* 当前排序状态 */}
        {currentSortOption && currentOrderOption && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2 text-blue-600">{currentSortOption.icon}</span>
                <span className="font-medium text-blue-800">
                  {currentSortOption.label}
                </span>
                <span className="mx-2 text-blue-400">|</span>
                <span className="flex items-center text-blue-600">
                  {currentOrderOption.icon}
                  <span className="ml-1">{currentOrderOption.label}</span>
                </span>
              </div>
              <Button
                type="link"
                size="small"
                onClick={resetSort}
                className="text-blue-600 hover:text-blue-800"
              >
                清除
              </Button>
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {currentSortOption.description}
            </div>
          </div>
        )}

        {/* 排序字段选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            排序字段
          </label>
          <Select
            value={currentSort.field}
            onChange={handleSortFieldChange}
            className="w-full"
            optionRender={customRender}
            optionLabelProp="children"
            options={sortOptions.map(option => ({
              value: option.value,
              label: (
                <div className="flex items-center">
                  <span className="mr-2">{option.icon}</span>
                  {option.label}
                </div>
              ),
            }))}
          />
        </div>

        <Divider />

        {/* 排序方向选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            排序方向
          </label>
          <Radio.Group
            value={currentSort.order}
            onChange={(e) => handleSortOrderChange(e.target.value)}
            className="w-full"
          >
            <div className="grid grid-cols-2 gap-2">
              {orderOptions.map((option) => (
                <Radio.Button
                  key={option.value}
                  value={option.value}
                  className="text-center"
                >
                  <div className="flex items-center justify-center">
                    <span className="mr-1">{option.icon}</span>
                    {option.label}
                  </div>
                </Radio.Button>
              ))}
            </div>
          </Radio.Group>
        </div>

        <Divider />

        {/* 快速排序选项 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            快速排序
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { field: 'rating', label: '评分最高', order: 'desc' },
              { field: 'createdAt', label: '最新创建', order: 'desc' },
              { field: 'connections', label: '连接最多', order: 'desc' },
              { field: 'name', label: '名称 A-Z', order: 'asc' },
            ].map((option) => (
              <Tooltip key={option.field} title={option.label}>
                <Button
                  size="small"
                  onClick={() => {
                    setCurrentSort({
                      field: option.field as AgentDiscoverySortParams['field'],
                      order: option.order as 'asc' | 'desc',
                    });
                    searchAgents();
                  }}
                  className="text-xs"
                >
                  {option.label}
                </Button>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* 排序说明 */}
        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
          <p className="mb-1">💡 排序提示：</p>
          <ul className="list-disc list-inside space-y-1">
            <li>评分排序：根据用户评分从高到低排列</li>
            <li>时间排序：创建时间或更新时间</li>
            <li>连接数排序：按Agent的连接数量排序</li>
            <li>代码大小排序：按代码行数排序</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};