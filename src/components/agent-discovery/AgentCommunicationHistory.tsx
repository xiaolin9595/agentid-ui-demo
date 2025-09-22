import React, { useState, useEffect } from 'react';
import {
  Card,
  List,
  Tag,
  Button,
  Space,
  Typography,
  Empty,
  Tooltip,
  Dropdown,
  Menu,
  Modal,
  Descriptions,
  Row,
  Col,
  Avatar,
  Badge,
  Alert,
  Input,
  Select,
  DatePicker,
  Statistic
} from 'antd';
import {
  HistoryOutlined,
  MessageOutlined,
  PhoneOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  SendOutlined,
  DeleteOutlined,
  RedoOutlined,
  EyeOutlined,
  FilterOutlined,
  SearchOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import './styles/AgentCommunicationHistory.css';

dayjs.extend(relativeTime);

const { Text, Title } = Typography;
const { Item: ListItem } = List;
const { Search } = Input;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface CommunicationHistory {
  id: string;
  type: 'message' | 'call' | 'data_request' | 'command';
  content: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'failed' | 'pending';
  response?: string;
  metadata?: {
    duration?: number;
    error?: string;
    protocol?: string;
    priority?: string;
    tags?: string[];
    responseTime?: number;
  };
}

interface AgentCommunicationHistoryProps {
  agentId: string;
  history: CommunicationHistory[];
  maxHeight?: number;
  showControls?: boolean;
  onResend?: (historyId: string) => void;
  onDelete?: (historyId: string) => void;
  onViewDetails?: (historyId: string) => void;
  onExport?: () => void;
}

// 通信类型配置
const COMMUNICATION_TYPE_CONFIG = {
  message: {
    label: '消息',
    icon: <MessageOutlined />,
    color: 'blue',
    description: '文本消息通信'
  },
  call: {
    label: '调用',
    icon: <PhoneOutlined />,
    color: 'green',
    description: '函数调用'
  },
  data_request: {
    label: '数据请求',
    icon: <DatabaseOutlined />,
    color: 'orange',
    description: '数据查询请求'
  },
  command: {
    label: '命令',
    icon: <ThunderboltOutlined />,
    color: 'red',
    description: '命令执行'
  }
};

// 状态配置
const STATUS_CONFIG = {
  sent: {
    label: '已发送',
    color: 'blue',
    icon: <SendOutlined />
  },
  delivered: {
    label: '已送达',
    color: 'green',
    icon: <SendOutlined />
  },
  failed: {
    label: '失败',
    color: 'red',
    icon: <SendOutlined />
  },
  pending: {
    label: '待处理',
    color: 'orange',
    icon: <SendOutlined />
  }
};

export const AgentCommunicationHistory: React.FC<AgentCommunicationHistoryProps> = ({
  agentId,
  history,
  maxHeight = 400,
  showControls = true,
  onResend,
  onDelete,
  onViewDetails,
  onExport
}) => {
  const [filteredHistory, setFilteredHistory] = useState<CommunicationHistory[]>(history);
  const [selectedHistory, setSelectedHistory] = useState<CommunicationHistory | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null] | null>(null);

  // 过滤历史记录
  useEffect(() => {
    let filtered = [...history];

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 类型过滤
    if (typeFilter !== 'all') {
      filtered = filtered.filter(item => item.type === typeFilter);
    }

    // 状态过滤
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }

    // 日期范围过滤
    if (dateRange && dateRange[0] && dateRange[1]) {
      const [start, end] = dateRange;
      filtered = filtered.filter(item => {
        const itemDate = dayjs(item.timestamp);
        return itemDate.isAfter(start) && itemDate.isBefore(end);
      });
    }

    // 按时间倒序排列
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    setFilteredHistory(filtered);
  }, [history, searchTerm, typeFilter, statusFilter, dateRange]);

  // 获取类型配置
  const getTypeConfig = (type: string) => {
    return COMMUNICATION_TYPE_CONFIG[type as keyof typeof COMMUNICATION_TYPE_CONFIG] || COMMUNICATION_TYPE_CONFIG.message;
  };

  // 获取状态配置
  const getStatusConfig = (status: string) => {
    return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.sent;
  };

  // 查看详情
  const handleViewDetails = (item: CommunicationHistory) => {
    setSelectedHistory(item);
    setShowDetails(true);
    if (onViewDetails) {
      onViewDetails(item.id);
    }
  };

  // 重发
  const handleResend = (item: CommunicationHistory) => {
    if (onResend) {
      onResend(item.id);
    }
  };

  // 删除
  const handleDelete = (item: CommunicationHistory) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这条通信记录吗？',
      onOk: () => {
        if (onDelete) {
          onDelete(item.id);
        }
      }
    });
  };

  // 导出
  const handleExport = () => {
    if (onExport) {
      onExport();
    } else {
      // 默认导出逻辑
      const dataStr = JSON.stringify(filteredHistory, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `communication_history_${agentId}_${dayjs().format('YYYY-MM-DD')}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  // 清空过滤器
  const clearFilters = () => {
    setSearchTerm('');
    setTypeFilter('all');
    setStatusFilter('all');
    setDateRange(null);
  };

  // 操作菜单
  const getActionMenu = (item: CommunicationHistory) => (
    <Menu>
      <Menu.Item
        key="view"
        icon={<EyeOutlined />}
        onClick={() => handleViewDetails(item)}
      >
        查看详情
      </Menu.Item>
      <Menu.Item
        key="resend"
        icon={<RedoOutlined />}
        onClick={() => handleResend(item)}
        disabled={item.status === 'pending'}
      >
        重新发送
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="delete"
        icon={<DeleteOutlined />}
        onClick={() => handleDelete(item)}
        danger
      >
        删除记录
      </Menu.Item>
    </Menu>
  );

  // 统计信息
  const getStatistics = () => {
    const total = history.length;
    const sent = history.filter(h => h.status === 'sent').length;
    const delivered = history.filter(h => h.status === 'delivered').length;
    const failed = history.filter(h => h.status === 'failed').length;
    const pending = history.filter(h => h.status === 'pending').length;

    return { total, sent, delivered, failed, pending };
  };

  const stats = getStatistics();

  return (
    <div className="communication-history">
      {/* 控制面板 */}
      {showControls && (
        <Card className="controls-card" size="small">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Search
                placeholder="搜索通信记录..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                value={typeFilter}
                onChange={setTypeFilter}
                style={{ width: '100%' }}
                placeholder="通信类型"
              >
                <Option value="all">全部类型</Option>
                {Object.entries(COMMUNICATION_TYPE_CONFIG).map(([key, config]) => (
                  <Option key={key} value={key}>
                    {config.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: '100%' }}
                placeholder="状态"
              >
                <Option value="all">全部状态</Option>
                {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                  <Option key={key} value={key}>
                    {config.label}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <RangePicker
                style={{ width: '100%' }}
                value={dateRange}
                onChange={setDateRange}
                placeholder={['开始日期', '结束日期']}
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Space>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={handleExport}
                  disabled={filteredHistory.length === 0}
                  size="small"
                >
                  导出
                </Button>
                <Button
                  icon={<FilterOutlined />}
                  onClick={clearFilters}
                  size="small"
                >
                  清空
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
      )}

      {/* 统计信息 */}
      <Row gutter={[16, 16]} className="statistics-row">
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic title="总记录" value={stats.total} />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="已送达"
              value={stats.delivered}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="已发送"
              value={stats.sent}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={6}>
          <Card size="small">
            <Statistic
              title="失败"
              value={stats.failed}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 通信记录列表 */}
      <Card
        className="history-list-card"
        title={
          <Space>
            <HistoryOutlined />
            通信记录
            <Badge count={filteredHistory.length} showZero />
          </Space>
        }
      >
        <div style={{ maxHeight, overflowY: 'auto' }}>
          {filteredHistory.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无通信记录"
            />
          ) : (
            <List
              dataSource={filteredHistory}
              renderItem={(item) => {
                const typeConfig = getTypeConfig(item.type);
                const statusConfig = getStatusConfig(item.status);

                return (
                  <ListItem
                    actions={[
                      <Dropdown
                        overlay={getActionMenu(item)}
                        trigger={['click']}
                      >
                        <Button type="text" size="small">
                          操作
                        </Button>
                      </Dropdown>
                    ]}
                  >
                    <ListItem.Meta
                      avatar={
                        <Avatar
                          icon={typeConfig.icon}
                          style={{ backgroundColor: typeConfig.color }}
                        />
                      }
                      title={
                        <Space>
                          <Text strong>{typeConfig.label}</Text>
                          <Tag color={statusConfig.color}>
                            {statusConfig.label}
                          </Tag>
                          {item.metadata?.priority && (
                            <Tag color="orange">
                              {item.metadata.priority}
                            </Tag>
                          )}
                          {item.metadata?.protocol && (
                            <Tag color="blue">
                              {item.metadata.protocol}
                            </Tag>
                          )}
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size="small">
                          <Text>{item.content}</Text>
                          <Space>
                            <Text type="secondary" className="timestamp">
                              {dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                              <Text type="secondary">
                                ({dayjs(item.timestamp).fromNow()})
                              </Text>
                            </Text>
                            {item.metadata?.duration && (
                              <Text type="secondary">
                                耗时: {item.metadata.duration}ms
                              </Text>
                            )}
                            {item.metadata?.responseTime && (
                              <Text type="secondary">
                                响应: {item.metadata.responseTime}ms
                              </Text>
                            )}
                          </Space>
                          {item.response && (
                            <Alert
                              message="响应"
                              description={item.response}
                              type="info"
                              style={{ marginTop: 8 }}
                            />
                          )}
                          {item.metadata?.error && (
                            <Alert
                              message="错误"
                              description={item.metadata.error}
                              type="error"
                              style={{ marginTop: 8 }}
                            />
                          )}
                          {item.metadata?.tags && item.metadata.tags.length > 0 && (
                            <Space>
                              {item.metadata.tags.map(tag => (
                                <Tag key={tag}>
                                  {tag}
                                </Tag>
                              ))}
                            </Space>
                          )}
                        </Space>
                      }
                    />
                  </ListItem>
                );
              }}
            />
          )}
        </div>
      </Card>

      {/* 详情模态框 */}
      <Modal
        title="通信记录详情"
        open={showDetails}
        onCancel={() => setShowDetails(false)}
        footer={null}
        width={800}
      >
        {selectedHistory && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="ID">{selectedHistory.id}</Descriptions.Item>
            <Descriptions.Item label="类型">
              <Space>
                {getTypeConfig(selectedHistory.type).icon}
                <Text>{getTypeConfig(selectedHistory.type).label}</Text>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={getStatusConfig(selectedHistory.status).color}>
                {getStatusConfig(selectedHistory.status).label}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="时间">
              {dayjs(selectedHistory.timestamp).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="内容" span={2}>
              {selectedHistory.content}
            </Descriptions.Item>
            {selectedHistory.response && (
              <Descriptions.Item label="响应" span={2}>
                {selectedHistory.response}
              </Descriptions.Item>
            )}
            {selectedHistory.metadata && (
              <>
                {selectedHistory.metadata.duration && (
                  <Descriptions.Item label="耗时">
                    {selectedHistory.metadata.duration}ms
                  </Descriptions.Item>
                )}
                {selectedHistory.metadata.responseTime && (
                  <Descriptions.Item label="响应时间">
                    {selectedHistory.metadata.responseTime}ms
                  </Descriptions.Item>
                )}
                {selectedHistory.metadata.protocol && (
                  <Descriptions.Item label="协议">
                    {selectedHistory.metadata.protocol}
                  </Descriptions.Item>
                )}
                {selectedHistory.metadata.priority && (
                  <Descriptions.Item label="优先级">
                    <Tag color="orange">{selectedHistory.metadata.priority}</Tag>
                  </Descriptions.Item>
                )}
                {selectedHistory.metadata.error && (
                  <Descriptions.Item label="错误" span={2}>
                    <Text type="danger">{selectedHistory.metadata.error}</Text>
                  </Descriptions.Item>
                )}
                {selectedHistory.metadata.tags && selectedHistory.metadata.tags.length > 0 && (
                  <Descriptions.Item label="标签" span={2}>
                    <Space>
                      {selectedHistory.metadata.tags.map(tag => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </Space>
                  </Descriptions.Item>
                )}
              </>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};