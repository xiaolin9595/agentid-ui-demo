import React from 'react';
import { Pagination, Select, Space, Tooltip, Typography, Button } from 'antd';
import {
  LeftOutlined,
  RightOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

import { useAgentDiscoveryStore } from '@/store/agentDiscoveryStore';

const { Text } = Typography;
const { Option } = Select;

interface AgentDiscoveryPaginationProps {
  className?: string;
  style?: React.CSSProperties;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  showInfo?: boolean;
  pageSizeOptions?: string[];
}

export const AgentDiscoveryPagination: React.FC<AgentDiscoveryPaginationProps> = ({
  className,
  style,
  showSizeChanger = true,
  showQuickJumper = true,
  showTotal = true,
  showInfo = true,
  pageSizeOptions = ['12', '24', '48', '96'],
}) => {
  const {
    searchParams,
    searchResults,
    searchAgents,
    updateSearchParams,
  } = useAgentDiscoveryStore();

  // 获取总数
  const totalCount = searchResults?.agents?.length || 0;

  // 如果没有数据或只有一页，不显示分页
  if (totalCount <= (searchParams.pageSize || 12)) {
    return null;
  }

  // 当前页码
  const currentPage = searchParams.page || 1;
  const pageSize = searchParams.pageSize || 12;

  // 处理页码变化
  const handlePageChange = (page: number, newPageSize?: number) => {
    const finalPageSize = newPageSize || pageSize;
    updateSearchParams({
      ...searchParams,
      page,
      pageSize: finalPageSize,
    });
    searchAgents();
  };

  // 处理页面大小变化
  const handlePageSizeChange = (newPageSize: number) => {
    updateSearchParams({
      ...searchParams,
      pageSize: newPageSize,
      page: 1, // 重置到第一页
    });
    searchAgents();
  };

  // 自定义分页项渲染
  const itemRender = (
    current: number,
    type: string,
    originalElement: React.ReactNode
  ) => {
    if (type === 'prev') {
      return (
        <Tooltip title="上一页">
          <Button
            type="text"
            icon={<LeftOutlined />}
            disabled={current === 1}
          />
        </Tooltip>
      );
    }

    if (type === 'next') {
      const totalPages = Math.ceil(totalCount / pageSize);
      return (
        <Tooltip title="下一页">
          <Button
            type="text"
            icon={<RightOutlined />}
            disabled={current === totalPages}
          />
        </Tooltip>
      );
    }

    if (type === 'jump-prev') {
      return (
        <Tooltip title="向前5页">
          <Button type="text" icon={<DoubleLeftOutlined />} />
        </Tooltip>
      );
    }

    if (type === 'jump-next') {
      return (
        <Tooltip title="向后5页">
          <Button type="text" icon={<DoubleRightOutlined />} />
        </Tooltip>
      );
    }

    return originalElement;
  };

  // 计算当前显示范围
  const getCurrentRange = () => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalCount);
    return { start, end };
  };

  // 渲染信息区域
  const renderInfo = () => {
    if (!showInfo) return null;

    const { start, end } = getCurrentRange();
    const totalPages = Math.ceil(totalCount / pageSize);

    return (
      <div className="agent-discovery-pagination-info">
        <Space size={16}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            显示第 {start}-{end} 条，共 {totalCount} 条
          </Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            第 {currentPage} / {totalPages} 页
          </Text>
        </Space>
      </div>
    );
  };

  // 渲染页面大小选择器
  const renderPageSizeChanger = () => {
    if (!showSizeChanger) return null;

    return (
      <div className="agent-discovery-page-size-changer">
        <Space size={8}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            每页显示：
          </Text>
          <Select
            value={pageSize}
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
      </div>
    );
  };

  // 渲染快速跳转
  const renderQuickJumper = () => {
    if (!showQuickJumper) return null;

    const totalPages = Math.ceil(totalCount / pageSize);
    if (totalPages <= 5) return null; // 页数太少时不显示快速跳转

    return (
      <div className="agent-discovery-quick-jumper">
        <Space size={8}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            跳转到：
          </Text>
          <Select
            value={currentPage}
            onChange={(page) => {
              if (page >= 1 && page <= totalPages) {
                updateSearchParams({
                  ...searchParams,
                  page,
                });
                searchAgents();
              }
            }}
            style={{ width: 60 }}
            size="small"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Option key={page} value={page}>
                {page}
              </Option>
            ))}
          </Select>
        </Space>
      </div>
    );
  };

  return (
    <div className={`agent-discovery-pagination ${className || ''}`} style={style}>
      <div className="agent-discovery-pagination-container">
        {/* 信息区域 */}
        {renderInfo()}

        {/* 分页控制 */}
        <div className="agent-discovery-pagination-controls">
          <Space size={16}>
            {/* 页面大小选择器 */}
            {renderPageSizeChanger()}

            {/* 快速跳转 */}
            {renderQuickJumper()}

            {/* 主要分页组件 */}
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalCount}
              onChange={handlePageChange}
              itemRender={itemRender}
              showSizeChanger={false}
              showQuickJumper={false}
              showTotal={(total, range) => `共 ${total} 条`}
            />
          </Space>
        </div>
      </div>

      {/* 移动端适配 */}
      <div className="agent-discovery-pagination-mobile">
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          {renderInfo()}
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalCount}
              onChange={handlePageChange}
              simple
              showSizeChanger={false}
              showQuickJumper={false}
              showTotal={(total, range) => `共 ${total} 条`}
            />
          </div>
          {renderPageSizeChanger()}
        </Space>
      </div>
    </div>
  );
};