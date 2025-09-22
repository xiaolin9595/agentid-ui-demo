import React, { useState } from 'react';
import { Card, Checkbox, Select, Slider, Space, Button, Divider, Tag, Collapse } from 'antd';
import { FilterOutlined, ClearOutlined, CheckOutlined } from '@ant-design/icons';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

import { useAgentDiscoveryStore } from '@/store/agentDiscoveryStore';

const { Panel } = Collapse;

interface AgentDiscoveryFiltersProps {
  className?: string;
  style?: React.CSSProperties;
}

export const AgentDiscoveryFilters: React.FC<AgentDiscoveryFiltersProps> = ({
  className,
  style,
}) => {
  const {
    activeFilters,
    availableFilters,
    setActiveFilters,
    clearFilters,
    applyFilters,
  } = useAgentDiscoveryStore();

  const [expandedPanels, setExpandedPanels] = useState<string[]>(['status', 'type', 'rating']);
  const [hasChanged, setHasChanged] = useState(false);

  // 状态选项
  const statusOptions = [
    { label: '活跃', value: 'active' },
    { label: '非活跃', value: 'inactive' },
    { label: '待定', value: 'pending' },
    { label: '暂停', value: 'suspended' },
  ];

  // 类型选项
  const typeOptions = [
    { label: 'AI Agent', value: 'ai_agent' },
    { label: 'Data Agent', value: 'data_agent' },
    { label: 'Blockchain Agent', value: 'blockchain_agent' },
    { label: 'Hybrid Agent', value: 'hybrid_agent' },
  ];

  // 能力选项
  const capabilityOptions = [
    { label: 'AI/ML', value: 'AI/ML' as const },
    { label: '数据处理', value: '数据处理' as const },
    { label: '区块链', value: '区块链' as const },
    { label: '自动化', value: '自动化' as const },
    { label: '通信', value: '通信' as const },
    { label: '安全', value: '安全' as const },
    { label: '分析', value: '分析' as const },
    { label: '监控', value: '监控' as const },
  ];

  // 网络选项
  const networkOptions = [
    { label: 'Ethereum', value: 'Ethereum' },
    { label: 'BSC', value: 'BSC' },
    { label: 'Polygon', value: 'Polygon' },
    { label: 'Arbitrum', value: 'Arbitrum' },
    { label: 'Optimism', value: 'Optimism' },
  ];

  // 处理过滤器变化
  const handleFilterChange = (key: keyof typeof activeFilters, value: any) => {
    setActiveFilters({ [key]: value });
    setHasChanged(true);
  };

  // 处理多选变化
  const handleMultiSelectChange = (key: keyof typeof activeFilters, checked: boolean, itemValue: any) => {
    const currentValues = activeFilters[key] as any[] || [];
    let newValues: any[];

    if (checked) {
      newValues = [...currentValues, itemValue];
    } else {
      newValues = currentValues.filter(v => v !== itemValue);
    }

    setActiveFilters({ [key]: newValues });
    setHasChanged(true);
  };

  // 应用过滤器
  const handleApplyFilters = () => {
    applyFilters();
    setHasChanged(false);
  };

  // 清除过滤器
  const handleClearFilters = () => {
    clearFilters();
    setHasChanged(false);
  };

  // 处理折叠面板变化
  const handleCollapseChange = (keys: string | string[]) => {
    setExpandedPanels(Array.isArray(keys) ? keys : [keys]);
  };

  return (
    <Card
      title={
        <div className="flex items-center">
          <FilterOutlined className="mr-2" />
          过滤器
          {hasChanged && (
            <Tag color="orange" className="ml-2">
              有未保存的更改
            </Tag>
          )}
        </div>
      }
      className={className}
      style={style}
      extra={
        <Space>
          <Button
            icon={<ClearOutlined />}
            onClick={handleClearFilters}
            size="small"
          >
            清除
          </Button>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleApplyFilters}
            disabled={!hasChanged}
            size="small"
          >
            应用
          </Button>
        </Space>
      }
    >
      <Collapse
        activeKey={expandedPanels}
        onChange={handleCollapseChange}
        ghost
        className="agent-discovery-filters"
      >
        {/* 状态过滤器 */}
        <Panel header="状态" key="status">
          <Space direction="vertical" className="w-full">
            {statusOptions.map((option) => (
              <Checkbox
                key={option.value}
                checked={activeFilters.statuses?.includes(option.value as any) || false}
                onChange={(e: CheckboxChangeEvent) =>
                  handleMultiSelectChange('statuses', e.target.checked, option.value)
                }
              >
                {option.label}
              </Checkbox>
            ))}
          </Space>
        </Panel>

        {/* 类型过滤器 */}
        <Panel header="类型" key="type">
          <Space direction="vertical" className="w-full">
            {typeOptions.map((option) => (
              <Checkbox
                key={option.value}
                checked={activeFilters.types?.includes(option.value as any) || false}
                onChange={(e: CheckboxChangeEvent) =>
                  handleMultiSelectChange('types', e.target.checked, option.value)
                }
              >
                {option.label}
              </Checkbox>
            ))}
          </Space>
        </Panel>

        {/* 语言过滤器 */}
        <Panel header="编程语言" key="language">
          <Space direction="vertical" className="w-full">
            {availableFilters.languages.map((language) => (
              <Checkbox
                key={language}
                checked={activeFilters.languages?.includes(language) || false}
                onChange={(e: CheckboxChangeEvent) =>
                  handleMultiSelectChange('languages', e.target.checked, language)
                }
              >
                {language}
              </Checkbox>
            ))}
          </Space>
        </Panel>

        {/* 能力过滤器 */}
        <Panel header="能力" key="capabilities">
          <Space direction="vertical" className="w-full">
            {capabilityOptions.map((option) => (
              <Checkbox
                key={option.value}
                checked={activeFilters.capabilities?.includes(option.value as any) || false}
                onChange={(e: CheckboxChangeEvent) =>
                  handleMultiSelectChange('capabilities', e.target.checked, option.value)
                }
              >
                {option.label}
              </Checkbox>
            ))}
          </Space>
        </Panel>

        {/* 评分过滤器 */}
        <Panel header="评分范围" key="rating">
          <div className="p-4">
            <Slider
              range
              min={0}
              max={5}
              step={0.5}
              value={[
                activeFilters.ratingRange?.min || 0,
                activeFilters.ratingRange?.max || 5,
              ]}
              onChange={(value) =>
                handleFilterChange('ratingRange', { min: value[0], max: value[1] })
              }
              marks={{
                0: '0',
                1: '1',
                2: '2',
                3: '3',
                4: '4',
                5: '5',
              }}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>最低: {activeFilters.ratingRange?.min || 0}</span>
              <span>最高: {activeFilters.ratingRange?.max || 5}</span>
            </div>
          </div>
        </Panel>

        {/* 代码大小过滤器 */}
        <Panel header="代码大小 (行)" key="codeSize">
          <div className="p-4">
            <Slider
              range
              min={0}
              max={1000000}
              step={1000}
              value={[
                activeFilters.codeSizeRange?.min || 0,
                activeFilters.codeSizeRange?.max || 1000000,
              ]}
              onChange={(value) =>
                handleFilterChange('codeSizeRange', { min: value[0], max: value[1] })
              }
              marks={{
                0: '0',
                100000: '100K',
                500000: '500K',
                1000000: '1M',
              }}
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>最小: {(activeFilters.codeSizeRange?.min || 0).toLocaleString()}</span>
              <span>最大: {(activeFilters.codeSizeRange?.max || 1000000).toLocaleString()}</span>
            </div>
          </div>
        </Panel>

        {/* 区块链状态过滤器 */}
        <Panel header="区块链状态" key="blockchain">
          <Space direction="vertical" className="w-full">
            <Checkbox
              checked={activeFilters.hasContract || false}
              onChange={(e: CheckboxChangeEvent) =>
                handleFilterChange('hasContract', e.target.checked)
              }
            >
              有智能合约
            </Checkbox>
            <Checkbox
              checked={activeFilters.isVerified || false}
              onChange={(e: CheckboxChangeEvent) =>
                handleFilterChange('isVerified', e.target.checked)
              }
            >
              已验证
            </Checkbox>
            <Checkbox
              checked={activeFilters.isActive || false}
              onChange={(e: CheckboxChangeEvent) =>
                handleFilterChange('isActive', e.target.checked)
              }
            >
              活跃状态
            </Checkbox>
          </Space>
        </Panel>

        {/* 网络过滤器 */}
        <Panel header="网络" key="network">
          <Space direction="vertical" className="w-full">
            {networkOptions.map((option) => (
              <Checkbox
                key={option.value}
                checked={activeFilters.networks?.includes(option.value) || false}
                onChange={(e: CheckboxChangeEvent) =>
                  handleMultiSelectChange('networks', e.target.checked, option.value)
                }
              >
                {option.label}
              </Checkbox>
            ))}
          </Space>
        </Panel>

        {/* 标签过滤器 */}
        <Panel header="标签" key="tags">
          <Select
            mode="multiple"
            placeholder="选择标签"
            value={activeFilters.tags || []}
            onChange={(value) => handleFilterChange('tags', value)}
            className="w-full"
            options={availableFilters.tags.map((tag) => ({
              label: tag,
              value: tag,
            }))}
          />
        </Panel>

        {/* 所有者过滤器 */}
        <Panel header="所有者" key="owners">
          <Select
            mode="multiple"
            placeholder="输入所有者地址"
            value={activeFilters.owners || []}
            onChange={(value) => handleFilterChange('owners', value)}
            className="w-full"
            tokenSeparators={[',', ' ']}
          />
        </Panel>
      </Collapse>

      {/* 当前过滤器摘要 */}
      {(activeFilters.statuses?.length ||
        activeFilters.types?.length ||
        activeFilters.languages?.length ||
        activeFilters.capabilities?.length ||
        activeFilters.networks?.length ||
        activeFilters.tags?.length ||
        activeFilters.owners?.length ||
        activeFilters.hasContract ||
        activeFilters.isVerified ||
        activeFilters.isActive) && (
        <>
          <Divider />
          <div className="space-y-2">
            <h4 className="font-medium text-sm">当前过滤器：</h4>
            <div className="flex flex-wrap gap-1">
              {activeFilters.statuses?.map((status) => (
                <Tag key={status} color="blue">
                  状态: {status}
                </Tag>
              ))}
              {activeFilters.types?.map((type) => (
                <Tag key={type} color="green">
                  类型: {type}
                </Tag>
              ))}
              {activeFilters.languages?.map((lang) => (
                <Tag key={lang} color="orange">
                  语言: {lang}
                </Tag>
              ))}
              {activeFilters.capabilities?.map((cap) => (
                <Tag key={cap} color="purple">
                  能力: {cap}
                </Tag>
              ))}
              {activeFilters.networks?.map((net) => (
                <Tag key={net} color="cyan">
                  网络: {net}
                </Tag>
              ))}
              {activeFilters.tags?.map((tag) => (
                <Tag key={tag} color="red">
                  标签: {tag}
                </Tag>
              ))}
              {activeFilters.hasContract && (
                <Tag color="gold">有合约</Tag>
              )}
              {activeFilters.isVerified && (
                <Tag color="success">已验证</Tag>
              )}
              {activeFilters.isActive && (
                <Tag color="processing">活跃</Tag>
              )}
            </div>
          </div>
        </>
      )}
    </Card>
  );
};