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
  message
} from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import {
  IdentityContract,
  ContractRegistrationForm,
  ContractRegistrationResult,
  IdentityCredential,
  BlockchainUser as User
} from '../../types/blockchain';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Step } = Steps;
const { Option } = Select;

// Mock identity credentials data
const MOCK_IDENTITY_CREDENTIALS: IdentityCredential[] = [
  {
    id: 'cred_001',
    name: '张三的身份证',
    type: 'id_card',
    fileUrl: '/mock/id_card_zhangsan.jpg',
    uploadDate: new Date('2024-01-15'),
    verified: true,
    verificationScore: 95
  },
  {
    id: 'cred_002',
    name: '李四的护照',
    type: 'passport',
    fileUrl: '/mock/passport_lisi.pdf',
    uploadDate: new Date('2024-02-20'),
    verified: true,
    verificationScore: 98
  },
  {
    id: 'cred_003',
    name: '王五的驾驶证',
    type: 'driver_license',
    fileUrl: '/mock/driver_license_wangwu.jpg',
    uploadDate: new Date('2024-03-10'),
    verified: false
  },
  {
    id: 'cred_004',
    name: '某科技公司营业执照',
    type: 'business_license',
    fileUrl: '/mock/business_license_tech.pdf',
    uploadDate: new Date('2024-01-30'),
    verified: true,
    verificationScore: 92
  }
];

// Mock users data
const MOCK_USERS: User[] = [
  {
    id: 'user_001',
    name: '张三',
    email: 'zhangsan@example.com',
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    createdAt: new Date('2024-01-10'),
    status: 'active'
  },
  {
    id: 'user_002',
    name: '李四',
    email: 'lisi@example.com',
    walletAddress: '0x2345678901bcdef2345678901bcdef23456789',
    createdAt: new Date('2024-02-15'),
    status: 'active'
  },
  {
    id: 'user_003',
    name: '王五',
    email: 'wangwu@example.com',
    walletAddress: '0x3456789012cdefg3456789012cdefg34567890',
    createdAt: new Date('2024-03-05'),
    status: 'inactive'
  },
  {
    id: 'user_004',
    name: '赵六',
    email: 'zhaoliu@example.com',
    walletAddress: '0x4567890123defgh4567890123defgh45678901',
    createdAt: new Date('2024-03-12'),
    status: 'active'
  }
];

const IDENTITY_TYPES = [
  '个人身份',
  '企业身份',
  '开发者身份',
  '机构身份',
  '设备身份'
];

const PREDEFINED_TAGS = [
  'KYC验证',
  '企业认证',
  '开发者',
  '高级用户',
  '实名认证',
  '多因素认证'
];

interface IdentityContractRegistrationProps {
  onSuccess?: (contract: IdentityContract) => void;
  onError?: (error: string) => void;
}

export const IdentityContractRegistration: React.FC<IdentityContractRegistrationProps> = ({
  onSuccess,
  onError
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [registrationResult, setRegistrationResult] = useState<ContractRegistrationResult | null>(null);
  const [customTags, setCustomTags] = useState<string[]>([]);

  const handleSubmit = async (values: ContractRegistrationForm) => {
    setLoading(true);
    try {
      // 模拟合约注册过程
      const result = await simulateContractRegistration(values);
      setRegistrationResult(result);

      if (result.success) {
        message.success('身份合约注册成功！');
        setCurrentStep(2);

        // 查找选中的身份凭证和用户
        const selectedCredential = MOCK_IDENTITY_CREDENTIALS.find(cred => cred.id === values.identityCredential);
        const selectedUser = MOCK_USERS.find(user => user.id === values.userId);

        // 创建合约对象
        const contract: IdentityContract = {
          id: `contract_${Date.now()}`,
          contractAddress: result.contractAddress || generateContractAddress(),
          contractName: values.contractName,
          ownerAddress: selectedUser?.walletAddress || generateWalletAddress(),
          identityHash: generateIdentityHash(),
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'active',
          metadata: {
            identityType: values.identityType,
            identityCredential: selectedCredential || MOCK_IDENTITY_CREDENTIALS[0],
            userId: values.userId,
            tags: [...values.tags, ...customTags],
            description: values.description
          },
          blockchain: {
            network: 'Ethereum Testnet',
            blockNumber: result.blockNumber || Math.floor(Math.random() * 1000000),
            transactionHash: result.transactionHash || generateTransactionHash(),
            gasUsed: result.gasUsed || Math.floor(Math.random() * 100000) + 50000
          }
        };

        onSuccess?.(contract);
      } else {
        message.error(result.error || '合约注册失败');
        onError?.(result.error || '合约注册失败');
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
  };

  const getStepStatus = (step: number) => {
    if (currentStep > step) return 'finish';
    if (currentStep === step) return 'process';
    return 'wait';
  };

  return (
    <Card title="用户身份合约注册" className="h-full">
      <div className="mb-6">
        <Steps current={currentStep} size="small">
          <Step
            title="填写信息"
            status={getStepStatus(0)}
            icon={<FileTextOutlined />}
          />
          <Step
            title="部署合约"
            status={getStepStatus(1)}
            icon={<LoadingOutlined />}
          />
          <Step
            title="完成注册"
            status={getStepStatus(2)}
            icon={<CheckCircleOutlined />}
          />
        </Steps>
      </div>

      {currentStep === 0 && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            identityType: '个人身份',
            identityCredential: MOCK_IDENTITY_CREDENTIALS[0]?.id || '',
            userId: MOCK_USERS[0]?.id || '',
            tags: [],
            description: ''
          }}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
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
                  prefix={<FileTextOutlined />}
                  placeholder="例如：我的身份合约"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="身份类型"
                name="identityType"
                rules={[{ required: true, message: '请选择身份类型' }]}
              >
                <Select placeholder="选择身份类型">
                  {IDENTITY_TYPES.map(type => (
                    <Option key={type} value={type}>{type}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="身份凭证"
                name="identityCredential"
                rules={[{ required: true, message: '请选择身份凭证' }]}
              >
                <Select placeholder="选择身份凭证">
                  {MOCK_IDENTITY_CREDENTIALS.map(credential => (
                    <Option key={credential.id} value={credential.id}>
                      <div>
                        <div className="font-medium">{credential.name}</div>
                        <div className="text-xs text-gray-500">
                          {credential.type === 'id_card' && '身份证'}
                          {credential.type === 'passport' && '护照'}
                          {credential.type === 'driver_license' && '驾驶证'}
                          {credential.type === 'business_license' && '营业执照'}
                          {credential.type === 'certificate' && '证书'}
                          {credential.verified && (
                            <Tag color="success" className="ml-2">已验证</Tag>
                          )}
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="关联用户"
                name="userId"
                rules={[{ required: true, message: '请选择用户' }]}
              >
                <Select placeholder="选择用户">
                  {MOCK_USERS.map(user => (
                    <Option key={user.id} value={user.id}>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">
                          {user.email}
                          {user.status === 'active' && (
                            <Tag color="success" className="ml-2">活跃</Tag>
                          )}
                          {user.status === 'inactive' && (
                            <Tag color="default" className="ml-2">未激活</Tag>
                          )}
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
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
                  placeholder="描述此身份合约的用途和特点..."
                  maxLength={500}
                  showCount
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
              loading={loading}
              icon={<UserOutlined />}
            >
              注册合约
            </Button>
          </div>
        </Form>
      )}

      {currentStep === 1 && (
        <div className="text-center py-8">
          <Spin size="large" />
          <div className="mt-4">
            <Title level={4}>正在部署身份合约...</Title>
            <Paragraph type="secondary">
              请稍候，系统正在区块链上部署您的身份合约
            </Paragraph>
          </div>
        </div>
      )}

      {currentStep === 2 && registrationResult && (
        <div>
          <Alert
            message="合约注册成功"
            description="您的身份合约已成功部署到区块链上"
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
              <Card size="small" title="网络信息">
                <Space direction="vertical" className="w-full">
                  <div>
                    <Text type="secondary">网络:</Text>
                    <Tag color="blue">Ethereum Testnet</Tag>
                  </div>
                  <div>
                    <Text type="secondary">状态:</Text>
                    <Tag color="success">活跃</Tag>
                  </div>
                  <div>
                    <Text type="secondary">确认数:</Text>
                    <Text> 12/12 确认</Text>
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
async function simulateContractRegistration(
  values: ContractRegistrationForm
): Promise<ContractRegistrationResult> {
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
      error: '合约部署失败：Gas不足或网络拥堵'
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

function generateIdentityHash(): string {
  return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}