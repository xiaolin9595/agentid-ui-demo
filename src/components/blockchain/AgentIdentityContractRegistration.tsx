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
  Progress,
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
import { useIdentityStore } from '../../store/identityStore';
import {
  ZKKYCProof,
  ZKProofGenerationConfig,
  ZKProofGenerationProcess
} from '../../types/identity';
import { sharedAgentData } from '../../mocks/sharedAgentData';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Step } = Steps;
const { Option } = Select;

// 从共享数据源获取Agent列表
const getMockAgents = (): MockAgent[] => {
  const sharedAgents = sharedAgentData.getAgents();
  return sharedAgents.map(agent => ({
    id: agent.id,
    name: agent.name,
    type: 'AI Assistant',
    capabilities: ['私人助理', '工作助理', '学习助理'],
    description: agent.description,
    version: '1.0.0',
    model: agent.language || 'GPT-4',
    apiEndpoint: 'https://api.example.com/v1',
    status: agent.status as 'active' | 'inactive' | 'development' | 'deprecated',
    owner: agent.boundUser || 'Unknown'
  }));
};

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
  const [completedContract, setCompletedContract] = useState<AgentIdentityContract | null>(null);
  const [zkProofConfig, setZkProofConfig] = useState<ZKProofGenerationConfig>({
    proofType: 'comprehensive_kyc',
    securityLevel: 'medium',
    validityPeriod: 365,
    includeDetailedInfo: true
  });
  const [selectedIdentityId, setSelectedIdentityId] = useState<string>('');
  const [generatedZKProof, setGeneratedZKProof] = useState<ZKKYCProof | null>(null);

  // 从共享数据源获取Agent列表
  const mockAgents = getMockAgents();

  // 从identityStore获取数据和操作
  const {
    identities,
    zkProofs,
    currentZKProcess,
    zkGenerating,
    generateZKProof,
    getZKProofsByIdentity,
    verifyZKProof
  } = useIdentityStore();

  const handleAgentChange = (agentId: string) => {
    const agent = mockAgents.find(a => a.id === agentId);
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
        setCurrentStep(3); // 进入ZK-KYC证明生成步骤

        // 查找选中的Agent
        const selectedAgentData = mockAgents.find(agent => agent.id === values.agentId);

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


        // 存储完成的Agent信息和合约对象用于成功页面显示
        setCompletedAgentInfo(agentInfo);
        setCompletedContract(contract);

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
    setCompletedContract(null);
    setSelectedIdentityId('');
    setGeneratedZKProof(null);
  };

  const handleGenerateZKProof = async () => {
    if (!selectedIdentityId) {
      message.error('请先选择身份凭证');
      return;
    }

    try {
      await generateZKProof(selectedIdentityId, zkProofConfig);
      message.success('ZK-KYC证明生成成功！');

      // 获取刚生成的证明
      const identityProofs = getZKProofsByIdentity(selectedIdentityId);
      if (identityProofs.length > 0) {
        const latestProof = identityProofs[identityProofs.length - 1];
        setGeneratedZKProof(latestProof);
        setCurrentStep(4); // 进入最终完成步骤
      }
    } catch (error) {
      message.error(error instanceof Error ? error.message : '生成ZK-KYC证明失败');
    }
  };

  const handleVerifyZKProof = async (proofId: string) => {
    try {
      const result = await verifyZKProof(proofId);
      if (result.isValid) {
        message.success('证明验证成功！');
      } else {
        message.error('证明验证失败');
      }
    } catch (error) {
      message.error('验证过程中出现错误');
    }
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
            title="生成ZK-KYC证明"
            status={getStepStatus(3)}
            icon={<SecurityScanOutlined />}
          />
          <Step
            title="完成注册"
            status={getStepStatus(4)}
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
            agentId: mockAgents[0]?.id || '',
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
                  {mockAgents.map(agent => (
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
            message="Agent合约注册成功！"
            description="您的Agent身份合约已成功部署到区块链上，现在可以生成ZK-KYC证明"
            type="success"
            showIcon
            className="mb-4"
          />

          <Row gutter={[16, 16]} className="mb-6">
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
                  </div>
                  <div>
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

          <Divider orientation="left">生成ZK-KYC证明</Divider>

          {/* ZK-KYC证明生成配置 */}
          <Row gutter={[16, 16]} className="mb-6">
            <Col span={12}>
              <Card size="small" title="选择身份凭证">
                <Space direction="vertical" className="w-full">
                  <div>
                    <Text strong>选择用于生成证明的身份凭证:</Text>
                  </div>
                  <Select
                    placeholder="选择身份凭证"
                    value={selectedIdentityId}
                    onChange={setSelectedIdentityId}
                    className="w-full"
                  >
                    {identities.map(identity => (
                      <Option key={identity.identityId} value={identity.identityId}>
                        <div>
                          <div className="font-medium">{identity.credentialData.name}</div>
                          <div className="text-xs text-gray-500">
                            {identity.identityId} - 置信度: {(identity.confidence * 100).toFixed(1)}%
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Space>
              </Card>
            </Col>

            <Col span={12}>
              <Card size="small" title="证明配置">
                <Space direction="vertical" className="w-full">
                  <div>
                    <Text strong>证明类型:</Text>
                  </div>
                  <Select
                    value={zkProofConfig.proofType}
                    onChange={(value) => setZkProofConfig(prev => ({ ...prev, proofType: value as any }))}
                    className="w-full mb-3"
                  >
                    <Option value="age_verification">年龄验证</Option>
                    <Option value="nationality_verification">国籍验证</Option>
                    <Option value="document_validity">证件有效性</Option>
                    <Option value="comprehensive_kyc">综合KYC验证</Option>
                  </Select>

                  <div>
                    <Text strong>安全级别:</Text>
                  </div>
                  <Select
                    value={zkProofConfig.securityLevel}
                    onChange={(value) => setZkProofConfig(prev => ({ ...prev, securityLevel: value as any }))}
                    className="w-full mb-3"
                  >
                    <Option value="low">
                      <Tag color="default">低</Tag>
                      快速生成
                    </Option>
                    <Option value="medium">
                      <Tag color="warning">中</Tag>
                      平衡性能
                    </Option>
                    <Option value="high">
                      <Tag color="success">高</Tag>
                      最高安全性
                    </Option>
                  </Select>

                  <div>
                    <Text strong>有效期:</Text>
                  </div>
                  <Select
                    value={zkProofConfig.validityPeriod}
                    onChange={(value) => setZkProofConfig(prev => ({ ...prev, validityPeriod: value as number }))}
                    className="w-full"
                  >
                    <Option value={30}>30天</Option>
                    <Option value={90}>90天</Option>
                    <Option value={365}>1年</Option>
                    <Option value={730}>2年</Option>
                  </Select>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* ZK-KYC证明生成进度 */}
          {currentZKProcess && (
            <Card size="small" title="证明生成进度" className="mb-6">
              <Progress percent={Math.round(currentZKProcess.progress * 100)} status={currentZKProcess.status === 'failed' ? 'exception' : 'active'} />
              <div className="mt-4">
                <Text strong>当前步骤: </Text>
                <Text>{currentZKProcess.steps[currentZKProcess.currentStep]?.name}</Text>
              </div>
              <div className="mt-2">
                <Text type="secondary">{currentZKProcess.steps[currentZKProcess.currentStep]?.description}</Text>
              </div>
            </Card>
          )}

          {/* 已生成的证明展示 */}
          {generatedZKProof && (
            <Card size="small" title="生成的ZK-KYC证明" className="mb-6">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Space direction="vertical" className="w-full">
                    <div>
                      <Text type="secondary">证明ID:</Text>
                      <div className="font-mono text-sm">{generatedZKProof.id}</div>
                    </div>
                    <div>
                      <Text type="secondary">证明类型:</Text>
                      <Tag color="blue">{generatedZKProof.proofType}</Tag>
                    </div>
                    <div>
                      <Text type="secondary">验证状态:</Text>
                      <Tag color={
                        generatedZKProof.verificationStatus === 'verified' ? 'success' :
                        generatedZKProof.verificationStatus === 'failed' ? 'error' : 'warning'
                      }>
                        {generatedZKProof.verificationStatus}
                      </Tag>
                    </div>
                    <div>
                      <Text type="secondary">置信度:</Text>
                      <Text> {(generatedZKProof.confidence * 100).toFixed(1)}%</Text>
                    </div>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" className="w-full">
                    <div>
                      <Text type="secondary">算法:</Text>
                      <Text> {generatedZKProof.metadata.algorithm}</Text>
                    </div>
                    <div>
                      <Text type="secondary">生成时间:</Text>
                      <Text> {new Date(generatedZKProof.metadata.generatedAt).toLocaleString()}</Text>
                    </div>
                    <div>
                      <Text type="secondary">有效期至:</Text>
                      <Text> {new Date(generatedZKProof.metadata.expiresAt).toLocaleDateString()}</Text>
                    </div>
                    <div>
                      <Text type="secondary">Gas消耗:</Text>
                      <Text> {generatedZKProof.metadata.gasUsed.toLocaleString()}</Text>
                    </div>
                  </Space>
                </Col>
              </Row>
            </Card>
          )}

          <div className="flex justify-between space-x-4">
            <Button onClick={() => setCurrentStep(2)}>
              上一步：部署合约
            </Button>
            <div className="flex space-x-4">
              <Button onClick={resetForm}>
                重新开始
              </Button>
              <Button
                type="primary"
                onClick={handleGenerateZKProof}
                loading={zkGenerating}
                disabled={!selectedIdentityId}
                icon={<SecurityScanOutlined />}
              >
                生成ZK-KYC证明
              </Button>
              {generatedZKProof && (
                <Button
                  type="default"
                  onClick={() => setCurrentStep(4)}
                  icon={<CheckCircleOutlined />}
                >
                  完成注册
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 新增第4步：完成注册 */}
      {currentStep === 4 && registrationResult && generatedZKProof && (
        <div>
          <Alert
            message="注册完成！"
            description="您的Agent身份合约和ZK-KYC证明都已成功生成"
            type="success"
            showIcon
            className="mb-4"
          />

          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card size="small" title="合约信息">
                <Space direction="vertical" className="w-full">
                  <div>
                    <Text type="secondary">合约地址:</Text>
                    <div className="font-mono text-xs break-all">
                      {registrationResult.contractAddress}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">交易哈希:</Text>
                    <div className="font-mono text-xs break-all">
                      {registrationResult.transactionHash}
                    </div>
                  </div>
                </Space>
              </Card>
            </Col>

            <Col span={8}>
              <Card size="small" title="Agent信息">
                <Space direction="vertical" className="w-full">
                  <div>
                    <Text type="secondary">名称:</Text>
                    <Text strong> {completedAgentInfo?.name}</Text>
                  </div>
                  <div>
                    <Text type="secondary">类型:</Text>
                    <Tag color="blue">{completedAgentInfo?.type}</Tag>
                  </div>
                  <div>
                    <Text type="secondary">状态:</Text>
                    <Tag color="success">活跃</Tag>
                  </div>
                </Space>
              </Card>
            </Col>

            <Col span={8}>
              <Card size="small" title="ZK-KYC证明">
                <Space direction="vertical" className="w-full">
                  <div>
                    <Text type="secondary">证明ID:</Text>
                    <div className="font-mono text-xs break-all">
                      {generatedZKProof.id}
                    </div>
                  </div>
                  <div>
                    <Text type="secondary">验证状态:</Text>
                    <Tag color="success">{generatedZKProof.verificationStatus}</Tag>
                  </div>
                  <div>
                    <Text type="secondary">置信度:</Text>
                    <Text> {(generatedZKProof.confidence * 100).toFixed(1)}%</Text>
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
            <Button
              type="primary"
              onClick={() => {
                message.success('合约详情和ZK-KYC证明已保存，您可以在Agent管理页面查看');
              }}
            >
              查看完整信息
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