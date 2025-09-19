import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Alert,
  Space,
  Typography,
  Tag,
  Divider,
  Row,
  Col,
  Steps,
  Spin,
  message,
  Switch
} from 'antd';
import {
  RobotOutlined,
  ApiOutlined,
  SecurityScanOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  SettingOutlined
} from '@ant-design/icons';
import {
  AgentIdentityContract,
  AgentContractRegistrationForm,
  AgentContractRegistrationResult,
  BlockchainAgent,
  MockAgent,
  BlockchainAgentType,
  AgentCapability
} from '../../types/blockchain';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Step } = Steps;
const { Option } = Select;

// Mock agents data
const MOCK_AGENTS: MockAgent[] = [
  {
    id: 'agent_001',
    name: 'Claude AI Assistant',
    type: 'AI Assistant',
    capabilities: ['私人助理', '工作助理', '学习助理'],
    description: '基于大语言模型的AI助手，支持自然语言交互和代码生成',
    version: '3.5',
    model: 'Claude-3.5-Sonnet',
    apiEndpoint: 'https://api.claude.ai/v1',
    status: 'active',
    owner: 'Anthropic'
  },
  {
    id: 'agent_002',
    name: 'Data Analyzer Pro',
    type: 'Data Processing',
    capabilities: ['财务助理', '健康助理', '生活助理'],
    description: '专业数据分析工具，支持机器学习模型训练和预测',
    version: '2.1',
    model: 'XGBoost-2.1',
    apiEndpoint: 'https://api.analyzer.pro/v2',
    status: 'active',
    owner: 'DataTech Corp'
  },
  {
    id: 'agent_003',
    name: 'Chatbot Service',
    type: 'Chatbot',
    capabilities: ['客服助理', '旅行助理', '娱乐助理'],
    description: '多语言聊天机器人服务，支持语音识别和翻译',
    version: '1.8',
    model: 'GPT-4',
    apiEndpoint: 'https://chatbot.service.ai/v1',
    status: 'active',
    owner: 'ChatBot Inc'
  },
  {
    id: 'agent_004',
    name: 'Security Monitor',
    type: 'Security',
    capabilities: ['健康助理', '生活助理', '客服助理'],
    description: 'AI安全监控系统，支持异常检测和威胁识别',
    version: '3.0',
    model: 'SecurityNet-V3',
    apiEndpoint: 'https://security.monitor.ai/v3',
    status: 'development',
    owner: 'SecureAI'
  },
  {
    id: 'agent_005',
    name: 'Content Generator',
    type: 'Content Generation',
    capabilities: ['私人助理', '工作助理', '学习助理'],
    description: '智能内容生成工具，支持文本、代码和图像生成',
    version: '2.5',
    model: 'ContentGen-2.5',
    apiEndpoint: 'https://content.gen.ai/v2',
    status: 'active',
    owner: 'CreativeAI'
  }
];

const AGENT_TYPES: BlockchainAgentType[] = [
  'AI Assistant',
  'Chatbot',
  'Automation',
  'Data Processing',
  'Content Generation',
  'Analysis',
  'Security'
];

const CAPABILITY_OPTIONS: AgentCapability[] = [
  '私人助理',
  '购物助理',
  '生活助理',
  '健康助理',
  '学习助理',
  '工作助理',
  '旅行助理',
  '财务助理',
  '娱乐助理',
  '客服助理'
];

const PREDEFINED_TAGS = [
  'AI服务',
  '机器学习',
  '自然语言处理',
  '数据分析',
  '自动化',
  '安全认证',
  '企业级',
  '高可用',
  '实时处理',
  '多语言'
];

interface AgentIdentityContractRegistrationProps {
  onSuccess?: (contract: AgentIdentityContract) => void;
  onError?: (error: string) => void;
}

export const AgentIdentityContractRegistration: React.FC<AgentIdentityContractRegistrationProps> = ({
  onSuccess,
  onError
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [registrationResult, setRegistrationResult] = useState<AgentContractRegistrationResult | null>(null);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<MockAgent | null>(null);
  const [completedAgentInfo, setCompletedAgentInfo] = useState<BlockchainAgent | null>(null);

  const handleAgentChange = (agentId: string) => {
    const agent = MOCK_AGENTS.find(a => a.id === agentId);
    setSelectedAgent(agent || null);

    if (agent) {
      // 自动填充表单字段
      form.setFieldsValue({
        agentType: agent.type,
        capabilities: agent.capabilities,
        apiEndpoint: agent.apiEndpoint,
        version: agent.version,
        model: agent.model,
        description: agent.description
      });
    }
  };

  const handleSubmit = async (values: AgentContractRegistrationForm) => {
    setLoading(true);
    try {
      // 模拟合约注册过程
      const result = await simulateAgentContractRegistration(values);
      setRegistrationResult(result);

      if (result.success) {
        message.success('Agent身份合约注册成功！');
        setCurrentStep(3);

        // 查找选中的Agent
        const selectedAgentData = MOCK_AGENTS.find(agent => agent.id === values.agentId);

        // 创建Agent对象
        const agentInfo: BlockchainAgent = {
          id: values.agentId,
          name: selectedAgentData?.name || 'Unknown Agent',
          type: values.agentType,
          capabilities: values.capabilities,
          description: values.description,
          version: values.version,
          model: values.model,
          apiEndpoint: values.apiEndpoint,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date(),
          owner: selectedAgentData?.owner || 'Unknown'
        };

        // 创建合约对象
        const contract: AgentIdentityContract = {
          id: `agent_contract_${Date.now()}`,
          contractAddress: result.contractAddress || generateContractAddress(),
          contractName: values.contractName,
          ownerAddress: generateWalletAddress(),
          agentId: values.agentId,
          agentInfo,
          permissions: values.permissions,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'active',
          metadata: {
            tags: [...values.tags, ...customTags],
            description: values.description,
            securityLevel: values.securityLevel,
            compliance: ['GDPR', 'SOC2', 'ISO27001']
          },
          blockchain: {
            network: 'Ethereum Testnet',
            blockNumber: result.blockNumber || Math.floor(Math.random() * 1000000),
            transactionHash: result.transactionHash || generateTransactionHash(),
            gasUsed: result.gasUsed || Math.floor(Math.random() * 100000) + 50000
          }
        };


        // 存储完成的Agent信息用于成功页面显示
        setCompletedAgentInfo(agentInfo);        

        onSuccess?.(contract);
      } else {
        message.error(result.error || 'Agent合约注册失败');
        onError?.(result.error || 'Agent合约注册失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      message.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTagChange = (tags: string[]) => {
    const newCustomTags = tags.filter(tag => !PREDEFINED_TAGS.includes(tag));
    setCustomTags(newCustomTags);
  };

  const resetForm = () => {
    form.resetFields();
    setRegistrationResult(null);
    setCurrentStep(0);
    setCustomTags([]);
    setSelectedAgent(null);
    setCompletedAgentInfo(null);
  };

  const getStepStatus = (step: number) => {
    if (currentStep > step) return 'finish';
    if (currentStep === step) return 'process';
    return 'wait';
  };

  return (
    <Card title="Agent身份合约注册" className="h-full">
      <div className="mb-6">
        <Steps current={currentStep} size="small">
          <Step
            title="选择Agent"
            status={getStepStatus(0)}
            icon={<RobotOutlined />}
          />
          <Step
            title="配置合约"
            status={getStepStatus(1)}
            icon={<SettingOutlined />}
          />
          <Step
            title="部署合约"
            status={getStepStatus(2)}
            icon={<LoadingOutlined />}
          />
          <Step
            title="完成注册"
            status={getStepStatus(3)}
            icon={<CheckCircleOutlined />}
          />
        </Steps>
      </div>

      {currentStep === 0 && (
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            setCurrentStep(1);
            form.setFieldsValue(values);
          }}
          initialValues={{
            agentId: MOCK_AGENTS[0]?.id || '',
            contractName: '',
            agentType: '',
            capabilities: [],
            permissions: 'read-only',
            apiEndpoint: '',
            version: '',
            model: '',
            description: '',
            tags: [],
            securityLevel: 'medium'
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                label="选择Agent"
                name="agentId"
                rules={[{ required: true, message: '请选择一个Agent' }]}
              >
                <Select
                  placeholder="选择要注册的Agent"
                  onChange={handleAgentChange}
                >
                  {MOCK_AGENTS.map(agent => (
                    <Option key={agent.id} value={agent.id}>
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-xs text-gray-500">
                          {agent.type} v{agent.version} - {agent.model}
                          <Tag color={agent.status === 'active' ? 'success' : 'processing'} className="ml-2">
                            {agent.status === 'active' ? '活跃' : '开发中'}
                          </Tag>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {agent.capabilities.slice(0, 3).join(', ')}
                          {agent.capabilities.length > 3 && '...'}
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {selectedAgent && (
              <Col span={24}>
                <Card size="small" title="Agent信息预览">
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Space direction="vertical" className="w-full">
                        <div>
                          <Text type="secondary">名称:</Text>
                          <Text strong> {selectedAgent.name}</Text>
                        </div>
                        <div>
                          <Text type="secondary">类型:</Text>
                          <Tag color="blue">{selectedAgent.type}</Tag>
                        </div>
                        <div>
                          <Text type="secondary">版本:</Text>
                          <Text> {selectedAgent.version}</Text>
                        </div>
                      </Space>
                    </Col>
                    <Col span={12}>
                      <Space direction="vertical" className="w-full">
                        <div>
                          <Text type="secondary">模型:</Text>
                          <Text> {selectedAgent.model}</Text>
                        </div>
                        <div>
                          <Text type="secondary">API端点:</Text>
                          <Text className="text-xs break-all"> {selectedAgent.apiEndpoint}</Text>
                        </div>
                        <div>
                          <Text type="secondary">状态:</Text>
                          <Tag color={selectedAgent.status === 'active' ? 'success' : 'processing'}>
                            {selectedAgent.status === 'active' ? '活跃' : '开发中'}
                          </Tag>
                        </div>
                      </Space>
                    </Col>
                  </Row>
                  <div className="mt-3">
                    <Text type="secondary">描述:</Text>
                    <Paragraph className="text-sm">{selectedAgent.description}</Paragraph>
                  </div>
                </Card>
              </Col>
            )}

            <Col span={24}>
              <Form.Item
                label="合约名称"
                name="contractName"
                rules={[
                  { required: true, message: '请输入合约名称' },
                  { min: 3, message: '合约名称至少3个字符' },
                  { max: 50, message: '合约名称最多50个字符' }
                ]}
              >
                <Input
                  prefix={<RobotOutlined />}
                  placeholder="例如：Claude AI身份合约"
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end space-x-4">
            <Button onClick={resetForm}>
              重置
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<RobotOutlined />}
            >
              下一步：配置合约
            </Button>
          </div>
        </Form>
      )}

      {currentStep === 1 && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                label="Agent类型"
                name="agentType"
                rules={[{ required: true, message: '请选择Agent类型' }]}
              >
                <Select placeholder="选择Agent类型">
                  {AGENT_TYPES.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="权限级别"
                name="permissions"
                rules={[{ required: true, message: '请选择权限级别' }]}
              >
                <Select placeholder="选择权限级别">
                  <Option value="read-only">
                    <Space>
                      <SecurityScanOutlined />
                      只读权限
                    </Space>
                  </Option>
                  <Option value="read-write">
                    <Space>
                      <SettingOutlined />
                      读写权限
                    </Space>
                  </Option>
                  <Option value="admin">
                    <Space>
                      <SecurityScanOutlined />
                      管理员权限
                    </Space>
                  </Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="扮演角色"
                name="capabilities"
                rules={[{ required: true, message: '请至少选择一个角色' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="选择Agent扮演的角色"
                  style={{ width: '100%' }}
                >
                  {CAPABILITY_OPTIONS.map(capability => (
                    <Option key={capability} value={capability}>{capability}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="API端点"
                name="apiEndpoint"
                rules={[
                  { required: true, message: '请输入API端点' },
                  { type: 'url', message: '请输入有效的URL' }
                ]}
              >
                <Input
                  prefix={<ApiOutlined />}
                  placeholder="https://api.agent.example.com/v1"
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="版本"
                name="version"
                rules={[{ required: true, message: '请输入版本号' }]}
              >
                <Input placeholder="1.0.0" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="模型"
                name="model"
                rules={[{ required: true, message: '请输入模型名称' }]}
              >
                <Input placeholder="GPT-4" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="安全级别"
                name="securityLevel"
                rules={[{ required: true, message: '请选择安全级别' }]}
              >
                <Select placeholder="选择安全级别">
                  <Option value="low">
                    <Tag color="default">低</Tag>
                    适合开发测试
                  </Option>
                  <Option value="medium">
                    <Tag color="warning">中</Tag>
                    适合生产环境
                  </Option>
                  <Option value="high">
                    <Tag color="success">高</Tag>
                    适合敏感数据
                  </Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="标签"
                name="tags"
              >
                <Select
                  mode="tags"
                  placeholder="选择或输入标签"
                  style={{ width: '100%' }}
                  onChange={handleTagChange}
                >
                  {PREDEFINED_TAGS.map(tag => (
                    <Option key={tag} value={tag}>{tag}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="描述"
                name="description"
              >
                <TextArea
                  rows={4}
                  placeholder="描述此Agent合约的用途和特点..."
                  maxLength={500}
                  showCount
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-between space-x-4">
            <Button onClick={() => setCurrentStep(0)}>
              上一步：选择Agent
            </Button>
            <div className="flex space-x-4">
              <Button onClick={resetForm}>
                重置
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<RobotOutlined />}
              >
                部署合约
              </Button>
            </div>
          </div>
        </Form>
      )}

      {currentStep === 2 && (
        <div className="text-center py-8">
          <Spin size="large" />
          <div className="mt-4">
            <Title level={4}>正在部署Agent身份合约...</Title>
            <Paragraph type="secondary">
              请稍候，系统正在区块链上部署您的Agent身份合约
            </Paragraph>
          </div>
        </div>
      )}

      {currentStep === 3 && registrationResult && (
        <div>
          <Alert
            message="Agent合约注册成功"
            description="您的Agent身份合约已成功部署到区块链上"
            type="success"
            showIcon
            className="mb-4"
          />

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card size="small" title="合约信息">
                <Space direction="vertical" className="w-full">
                  <div>
                    <Text type="secondary">合约地址:</Text>
                    <div className="font-mono text-sm break-all">
                      {registrationResult.contractAddress}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">交易哈希:</Text>
                    <div className="font-mono text-sm break-all">
                      {registrationResult.transactionHash}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">区块号:</Text>
                    <Text> #{registrationResult.blockNumber}</Text>
                  </div>
                  <div>
                    <Text type="secondary">Gas消耗:</Text>
                    <Text> {registrationResult.gasUsed?.toLocaleString()}</Text>
                  </div>
                </Space>
              </Card>
            </Col>

            <Col span={12}>
              <Card size="small" title="Agent信息">
                <Space direction="vertical" className="w-full">
                  <div>
                    <Text type="secondary">Agent名称:</Text>
                    <Text strong> {completedAgentInfo?.name}</Text>
                  </div>
                  <div>
                    <Text type="secondary">Agent类型:</Text>
                    <Tag color="blue">{completedAgentInfo?.type}</Tag>
                  </div>
                  <div>
                    <Text type="secondary">版本:</Text>
                    <Text> {completedAgentInfo?.version}</Text>
                  </div>
                  <div>
                    <Text type="secondary">模型:</Text>
                    <Text> {completedAgentInfo?.model}</Text>
                  </div>                  <div>
                    <Text type="secondary">权限级别:</Text>
                    <Tag color={
                      form.getFieldValue('permissions') === 'admin' ? 'red' :
                      form.getFieldValue('permissions') === 'read-write' ? 'orange' : 'green'
                    }>
                      {form.getFieldValue('permissions')}
                    </Tag>
                  </div>
                  <div>
                    <Text type="secondary">安全级别:</Text>
                    <Tag color={
                      form.getFieldValue('securityLevel') === 'high' ? 'success' :
                      form.getFieldValue('securityLevel') === 'medium' ? 'warning' : 'default'
                    }>
                      {form.getFieldValue('securityLevel')}
                    </Tag>
                  </div>
                  <div>
                    <Text type="secondary">状态:</Text>
                    <Tag color="success">活跃</Tag>
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>

          <Divider />

          <div className="flex justify-center space-x-4">
            <Button onClick={resetForm}>
              注册新合约
            </Button>
            <Button type="primary">
              查看合约详情
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

// 辅助函数
async function simulateAgentContractRegistration(
  values: AgentContractRegistrationForm
): Promise<AgentContractRegistrationResult> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

  // 模拟90%成功率
  if (Math.random() < 0.9) {
    return {
      success: true,
      contractAddress: generateContractAddress(),
      transactionHash: generateTransactionHash(),
      blockNumber: Math.floor(Math.random() * 1000000),
      gasUsed: Math.floor(Math.random() * 100000) + 50000
    };
  } else {
    return {
      success: false,
      error: 'Agent合约部署失败：Gas不足或网络拥堵'
    };
  }
}

function generateContractAddress(): string {
  return '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function generateWalletAddress(): string {
  return generateContractAddress();
}

function generateTransactionHash(): string {
  return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}