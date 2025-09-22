import React, { useState } from 'react';
import {
  Card,
  Radio,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Tag,
  Progress,
  List,
  Avatar,
  Badge,
  Tooltip,
  Alert,
  Divider,
  Switch,
  Select,
  InputNumber,
  Input,
  Form,
  Descriptions,
  Statistic
} from 'antd';
import {
  MessageOutlined,
  PhoneOutlined,
  DatabaseOutlined,
  ThunderboltOutlined,
  WifiOutlined,
  ApiOutlined,
  SafetyOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import {
  AgentCommunicationRequest,
  AgentCommunicationChannel
} from '@/types/agent-discovery';
import './styles/AgentCommunicationTypes.css';

const { Text, Title, Paragraph } = Typography;
const { Group: RadioGroup } = Radio;
const { Option } = Select;

interface AgentCommunicationTypesProps {
  selectedType?: string;
  onTypeChange?: (type: string) => void;
  disabledTypes?: string[];
  showAdvanced?: boolean;
  className?: string;
}

// 通信类型详细配置
const COMMUNICATION_TYPES = [
  {
    id: 'message',
    name: '消息通信',
    icon: <MessageOutlined />,
    description: '发送文本消息、结构化数据或简单指令',
    useCases: [
      '状态查询',
      '信息通知',
      '简单请求',
      '日志传递'
    ],
    protocols: [
      {
        name: 'HTTP REST',
        icon: <ApiOutlined />,
        reliability: 95,
        latency: '中',
        throughput: '中',
        features: ['RESTful API', 'JSON格式', '状态码', '易于集成']
      },
      {
        name: 'WebSocket',
        icon: <WifiOutlined />,
        reliability: 98,
        latency: '低',
        throughput: '高',
        features: ['双向通信', '实时推送', '持久连接', '低延迟']
      },
      {
        name: 'MQTT',
        icon: <WifiOutlined />,
        reliability: 92,
        latency: '低',
        throughput: '中',
        features: ['发布订阅', '轻量级', '低带宽', 'IoT优化']
      }
    ],
    security: {
      encryption: '可选',
      authentication: 'API密钥/JWT/OAuth',
      authorization: '基于角色',
      compliance: ['GDPR', 'SOC2']
    },
    performance: {
      maxConcurrent: 1000,
      avgResponseTime: 200,
      throughputPerSecond: 500,
      availability: 99.9
    },
    limitations: [
      '消息大小限制（通常10MB）',
      '不支持二进制数据',
      '需要网络连接'
    ],
    requirements: [
      'Agent需支持HTTP/WebSocket',
      '需要有效的认证信息',
      '网络可达性'
    ]
  },
  {
    id: 'call',
    name: '函数调用',
    icon: <PhoneOutlined />,
    description: '调用Agent的特定功能或方法',
    useCases: [
      '数据处理',
      '计算任务',
      '业务逻辑',
      'API调用'
    ],
    protocols: [
      {
        name: 'gRPC',
        icon: <ApiOutlined />,
        reliability: 99,
        latency: '低',
        throughput: '高',
        features: ['强类型', '流式处理', '高效二进制', '自动生成']
      },
      {
        name: 'HTTP REST',
        icon: <ApiOutlined />,
        reliability: 95,
        latency: '中',
        throughput: '中',
        features: ['RESTful API', 'JSON格式', '状态码', '易于调试']
      },
      {
        name: 'WebSocket RPC',
        icon: <WifiOutlined />,
        reliability: 97,
        latency: '低',
        throughput: '高',
        features: ['实时调用', '双向流', '持久连接', '高并发']
      }
    ],
    security: {
      encryption: 'TLS',
      authentication: 'JWT/API密钥',
      authorization: '方法级别',
      compliance: ['GDPR', 'SOC2', 'ISO27001']
    },
    performance: {
      maxConcurrent: 500,
      avgResponseTime: 150,
      throughputPerSecond: 300,
      availability: 99.5
    },
    limitations: [
      '需要明确的接口定义',
      '参数类型限制',
      '超时控制'
    ],
    requirements: [
      'Agent需暴露API接口',
      '需要完整的接口文档',
      '参数验证机制'
    ]
  },
  {
    id: 'data_request',
    name: '数据请求',
    icon: <DatabaseOutlined />,
    description: '请求数据查询、处理或转换',
    useCases: [
      '数据查询',
      '批量处理',
      '数据转换',
      '统计分析'
    ],
    protocols: [
      {
        name: 'HTTP REST',
        icon: <ApiOutlined />,
        reliability: 95,
        latency: '中',
        throughput: '中',
        features: ['RESTful API', '分页查询', '过滤排序', '格式转换']
      },
      {
        name: 'GraphQL',
        icon: <ApiOutlined />,
        reliability: 94,
        latency: '中',
        throughput: '中',
        features: ['灵活查询', '减少网络请求', '强类型', '实时订阅']
      },
      {
        name: 'WebSocket',
        icon: <WifiOutlined />,
        reliability: 98,
        latency: '低',
        throughput: '高',
        features: ['实时数据流', '增量更新', '长连接', '低延迟']
      }
    ],
    security: {
      encryption: 'TLS',
      authentication: 'OAuth/JWT',
      authorization: '数据级别',
      compliance: ['GDPR', 'CCPA', 'HIPAA']
    },
    performance: {
      maxConcurrent: 200,
      avgResponseTime: 500,
      throughputPerSecond: 100,
      availability: 99.0
    },
    limitations: [
      '大数据量可能超时',
      '需要分页或流式处理',
      '内存占用较高'
    ],
    requirements: [
      'Agent需有数据访问权限',
      '需要数据缓存机制',
      '支持数据格式转换'
    ]
  },
  {
    id: 'command',
    name: '命令执行',
    icon: <ThunderboltOutlined />,
    description: '执行特定命令或控制操作',
    useCases: [
      '系统控制',
      '配置修改',
      '任务调度',
      '状态同步'
    ],
    protocols: [
      {
        name: 'HTTP REST',
        icon: <ApiOutlined />,
        reliability: 95,
        latency: '中',
        throughput: '中',
        features: ['标准HTTP', '状态码', '错误处理', '幂等性']
      },
      {
        name: 'SSH',
        icon: <SafetyOutlined />,
        reliability: 96,
        latency: '中',
        throughput: '低',
        features: ['安全通道', '命令执行', '文件传输', '端口转发']
      },
      {
        name: 'Custom Protocol',
        icon: <ApiOutlined />,
        reliability: 90,
        latency: '低',
        throughput: '高',
        features: ['自定义格式', '专用通道', '加密传输', '高效处理']
      }
    ],
    security: {
      encryption: '强加密',
      authentication: '多因子认证',
      authorization: '命令级别',
      compliance: ['SOC2', 'ISO27001', 'NIST']
    },
    performance: {
      maxConcurrent: 50,
      avgResponseTime: 300,
      throughputPerSecond: 50,
      availability: 99.8
    },
    limitations: [
      '安全风险较高',
      '需要严格权限控制',
      '操作不可逆'
    ],
    requirements: [
      'Agent需有命令执行权限',
      '需要完善的日志记录',
      '支持操作回滚'
    ]
  }
];

// 安全级别选项
const SECURITY_LEVELS = [
  { level: 'low', label: '低', description: '基本认证，适用于内网环境' },
  { level: 'medium', label: '中', description: '标准认证，适用于大多数场景' },
  { level: 'high', label: '高', description: '强化认证，适用于敏感操作' }
];

// 性能等级
const PERFORMANCE_GRADES = [
  { min: 90, grade: 'A', color: '#52c41a', label: '优秀' },
  { min: 80, grade: 'B', color: '#faad14', label: '良好' },
  { min: 70, grade: 'C', color: '#fa8c16', label: '一般' },
  { min: 60, grade: 'D', color: '#f5222d', label: '较差' }
];

export const AgentCommunicationTypes: React.FC<AgentCommunicationTypesProps> = ({
  selectedType = 'message',
  onTypeChange,
  disabledTypes = [],
  showAdvanced = false,
  className
}) => {
  const [advancedConfig, setAdvancedConfig] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState('HTTP REST');
  const [securityLevel, setSecurityLevel] = useState('medium');
  const [timeoutValue, setTimeoutValue] = useState<number>(30);
  const [retryCountValue, setRetryCountValue] = useState<number>(3);
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // 获取当前选择的通信类型
  const getCurrentType = () => {
    return COMMUNICATION_TYPES.find(type => type.id === selectedType);
  };

  // 获取当前选择的协议
  const getCurrentProtocol = () => {
    const currentType = getCurrentType();
    return currentType?.protocols.find(p => p.name === selectedProtocol);
  };

  // 获取性能等级
  const getPerformanceGrade = (reliability: number) => {
    return PERFORMANCE_GRADES.find(grade => reliability >= grade.min) || PERFORMANCE_GRADES[PERFORMANCE_GRADES.length - 1];
  };

  // 处理类型变更
  const handleTypeChange = (typeId: string) => {
    if (onTypeChange) {
      onTypeChange(typeId);
    }
    // 设置默认协议
    const type = COMMUNICATION_TYPES.find(t => t.id === typeId);
    if (type && type.protocols.length > 0) {
      setSelectedProtocol(type.protocols[0].name);
    }
  };

  // 获取可靠性颜色
  const getReliabilityColor = (reliability: number) => {
    const grade = getPerformanceGrade(reliability);
    return grade.color;
  };

  return (
    <div className={`communication-types ${className || ''}`}>
      {/* 通信类型选择 */}
      <Card className="type-selection-card" title="选择通信类型">
        <RadioGroup
          value={selectedType}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="type-radio-group"
        >
          <Row gutter={[16, 16]}>
            {COMMUNICATION_TYPES.map(type => (
              <Col xs={24} sm={12} md={6} key={type.id}>
                <Radio
                  value={type.id}
                  disabled={disabledTypes.includes(type.id)}
                  className="type-radio"
                >
                  <Card
                    className={`type-card ${selectedType === type.id ? 'selected' : ''}`}
                    size="small"
                    hoverable
                  >
                    <div className="type-header">
                      <Avatar
                        icon={type.icon}
                        style={{ backgroundColor: selectedType === type.id ? '#1890ff' : '#f0f0f0' }}
                      />
                      <div className="type-info">
                        <Title level={5}>{type.name}</Title>
                        <Text type="secondary">{type.description}</Text>
                      </div>
                    </div>
                    <div className="type-stats">
                      <Space>
                        <Text type="secondary">可靠性: </Text>
                        <Progress
                          percent={type.performance.availability}
                          size="small"
                          strokeColor={getReliabilityColor(type.performance.availability)}
                          style={{ width: 60 }}
                        />
                      </Space>
                    </div>
                  </Card>
                </Radio>
              </Col>
            ))}
          </Row>
        </RadioGroup>
      </Card>

      {/* 协议选择 */}
      {getCurrentType() && (
        <Card className="protocol-selection-card" title="选择通信协议">
          <Row gutter={[16, 16]}>
            {getCurrentType()?.protocols.map(protocol => {
              const performanceGrade = getPerformanceGrade(protocol.reliability);
              return (
                <Col xs={24} md={8} key={protocol.name}>
                  <Card
                    className={`protocol-card ${selectedProtocol === protocol.name ? 'selected' : ''}`}
                    size="small"
                    hoverable
                    onClick={() => setSelectedProtocol(protocol.name)}
                  >
                    <div className="protocol-header">
                      <Avatar
                        icon={protocol.icon}
                        style={{ backgroundColor: selectedProtocol === protocol.name ? '#52c41a' : '#f0f0f0' }}
                      />
                      <div className="protocol-info">
                        <Title level={5}>{protocol.name}</Title>
                        <Space>
                          <Tag color={performanceGrade.color}>
                            {performanceGrade.grade}级
                          </Tag>
                          <Tag color="blue">{protocol.latency}延迟</Tag>
                          <Tag color="green">{protocol.throughput}吞吐</Tag>
                        </Space>
                      </div>
                    </div>
                    <div className="protocol-reliability">
                      <Space>
                        <Text>可靠性: </Text>
                        <Progress
                          percent={protocol.reliability}
                          size="small"
                          strokeColor={getReliabilityColor(protocol.reliability)}
                        />
                        <Text>{protocol.reliability}%</Text>
                      </Space>
                    </div>
                    <div className="protocol-features">
                      {protocol.features.slice(0, 3).map(feature => (
                        <Tag key={feature}>
                          {feature}
                        </Tag>
                      ))}
                      {protocol.features.length > 3 && (
                        <Tooltip title={protocol.features.slice(3).join(', ')}>
                          <Tag>+{protocol.features.length - 3}</Tag>
                        </Tooltip>
                      )}
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card>
      )}

      {/* 高级配置 */}
      {showAdvanced && (
        <Card className="advanced-config-card" title="高级配置">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Form.Item label="安全级别">
                <RadioGroup
                  value={securityLevel}
                  onChange={(e) => setSecurityLevel(e.target.value)}
                >
                  {SECURITY_LEVELS.map(level => (
                    <Radio key={level.level} value={level.level}>
                      <Space>
                        <Tag color={level.level === 'high' ? 'red' : level.level === 'medium' ? 'orange' : 'green'}>
                          {level.label}
                        </Tag>
                        <Text type="secondary">{level.description}</Text>
                      </Space>
                    </Radio>
                  ))}
                </RadioGroup>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="超时时间">
                <Space>
                  <InputNumber
                    value={timeoutValue}
                    onChange={(value) => setTimeoutValue(value || 0)}
                    min={5}
                    max={300}
                    style={{ width: 100 }}
                  />
                  <Text>秒</Text>
                </Space>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="重试次数">
                <InputNumber
                  value={retryCountValue}
                  onChange={(value) => setRetryCountValue(value || 0)}
                  min={0}
                  max={10}
                  style={{ width: 100 }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      )}

      {/* 详细信息 */}
      {getCurrentType() && (
        <Card className="details-card" title="详细信息">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <div className="use-cases">
                <Title level={5}>使用场景</Title>
                <List
                  dataSource={getCurrentType()?.useCases}
                  renderItem={(item) => (
                    <List.Item>
                      <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                      {item}
                    </List.Item>
                  )}
                />
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="limitations">
                <Title level={5}>限制条件</Title>
                <List
                  dataSource={getCurrentType()?.limitations}
                  renderItem={(item) => (
                    <List.Item>
                      <ExclamationCircleOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
                      {item}
                    </List.Item>
                  )}
                />
              </div>
            </Col>
          </Row>

          <Divider />

          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <div className="requirements">
                <Title level={5}>技术要求</Title>
                <List
                  dataSource={getCurrentType()?.requirements}
                  renderItem={(item) => (
                    <List.Item>
                      <InfoCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                      {item}
                    </List.Item>
                  )}
                />
              </div>
            </Col>
            <Col xs={24} md={12}>
              <div className="security-info">
                <Title level={5}>安全特性</Title>
                <Descriptions column={1} size="small">
                  <Descriptions.Item label="加密">
                    {getCurrentType()?.security.encryption}
                  </Descriptions.Item>
                  <Descriptions.Item label="认证">
                    {getCurrentType()?.security.authentication}
                  </Descriptions.Item>
                  <Descriptions.Item label="授权">
                    {getCurrentType()?.security.authorization}
                  </Descriptions.Item>
                  <Descriptions.Item label="合规性">
                    {getCurrentType()?.security.compliance?.join(', ')}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </Col>
          </Row>

          <Divider />

          <div className="performance-metrics">
            <Title level={5}>性能指标</Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={6}>
                <Card size="small">
                  <Statistic
                    title="最大并发"
                    value={getCurrentType()?.performance.maxConcurrent}
                  />
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card size="small">
                  <Statistic
                    title="平均响应时间"
                    value={getCurrentType()?.performance.avgResponseTime}
                    suffix="ms"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card size="small">
                  <Statistic
                    title="吞吐量"
                    value={getCurrentType()?.performance.throughputPerSecond}
                    suffix="/s"
                  />
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card size="small">
                  <Statistic
                    title="可用性"
                    value={getCurrentType()?.performance.availability}
                    suffix="%"
                    precision={1}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </Card>
      )}

      {/* 协议详情 */}
      {getCurrentProtocol() && (
        <Card className="protocol-details-card" title={`${getCurrentProtocol()?.name} 协议详情`}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <div className="protocol-metrics">
                <Space direction="vertical" size="middle">
                  <div>
                    <Text strong>可靠性评级: </Text>
                    <Tag color={getReliabilityColor(getCurrentProtocol()?.reliability || 0)}>
                      {getPerformanceGrade(getCurrentProtocol()?.reliability || 0).grade}级
                    </Tag>
                  </div>
                  <Progress
                    percent={getCurrentProtocol()?.reliability}
                    strokeColor={getReliabilityColor(getCurrentProtocol()?.reliability || 0)}
                  />
                  <Space>
                    <Text>延迟: </Text>
                    <Tag color={getCurrentProtocol()?.latency === '低' ? 'green' : getCurrentProtocol()?.latency === '中' ? 'orange' : 'red'}>
                      {getCurrentProtocol()?.latency}
                    </Tag>
                  </Space>
                  <Space>
                    <Text>吞吐: </Text>
                    <Tag color={getCurrentProtocol()?.throughput === '高' ? 'green' : getCurrentProtocol()?.throughput === '中' ? 'orange' : 'red'}>
                      {getCurrentProtocol()?.throughput}
                    </Tag>
                  </Space>
                </Space>
              </div>
            </Col>
            <Col xs={24} md={16}>
              <div className="protocol-features-list">
                <Title level={5}>特性</Title>
                <Row gutter={[8, 8]}>
                  {getCurrentProtocol()?.features.map(feature => (
                    <Col xs={12} sm={8} md={6} key={feature}>
                      <Tag color="blue" style={{ width: '100%', textAlign: 'center' }}>
                        {feature}
                      </Tag>
                    </Col>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      {/* 控制面板 */}
      <Card className="control-panel-card" size="small">
        <Row align="middle" justify="space-between">
          <Col>
            <Space>
              <Switch
                checked={advancedConfig}
                onChange={setAdvancedConfig}
                checkedChildren="高级配置"
                unCheckedChildren="基础配置"
              />
              {advancedConfig && (
                <Text type="secondary">显示高级配置选项</Text>
              )}
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  if (onTypeChange) {
                    onTypeChange(selectedType);
                  }
                }}
              >
                确认选择
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>
    </div>
  );
};