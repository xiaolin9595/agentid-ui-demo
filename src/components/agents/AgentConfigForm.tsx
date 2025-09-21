import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Card,
  Typography,
  Space,
  Divider,
  Row,
  Col,
  Tag,
  Alert,
  Button,
  Upload,
  message,
  Progress,
  Avatar
} from 'antd';
import {
  SettingOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  SecurityScanOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CameraOutlined
} from '@ant-design/icons';
import {
  AgentConfig,
  AgentConfigFormProps,
  AgentPermission,
  DEFAULT_AGENT_CONFIG,
  DEFAULT_AGENT_PERMISSIONS,
  USER_BINDING_OPTIONS,
  MOCK_USERS,
  UserBinding,
  FaceBiometricFeatures
} from '../../types/agent-upload';

const { Text, Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const DEMO_WATERMARK = '演示系统 - 用户绑定配置';

// 模拟用户数据
const DEMO_USERS = [
  { id: 'user_001', name: '张三', email: 'zhangsan@example.com', department: '技术部' },
  { id: 'user_002', name: '李四', email: 'lisi@example.com', department: '产品部' },
  { id: 'user_003', name: '王五', email: 'wangwu@example.com', department: '设计部' },
  { id: 'user_004', name: '赵六', email: 'zhaoliu@example.com', department: '运营部' }
];

const PERMISSION_DESCRIPTIONS: Record<string, string> = {
  read: '允许读取数据和文件',
  write: '允许写入数据和文件',
  execute: '允许执行代码和命令',
  network: '允许网络访问和通信',
  filesystem: '允许文件系统操作'
};

const COMMON_DEPENDENCIES = {
  javascript: [
    'axios', 'express', 'lodash', 'moment', 'dotenv',
    'cors', 'helmet', 'morgan', 'jsonwebtoken'
  ],
  typescript: [
    '@types/node', '@types/express', 'typescript', 'ts-node',
    'axios', 'express', 'lodash', 'moment'
  ],
  python: [
    'requests', 'flask', 'numpy', 'pandas', 'python-dotenv',
    'pydantic', 'fastapi', 'uvicorn', 'sqlalchemy'
  ],
  java: [
    'spring-boot-starter-web', 'spring-boot-starter-data-jpa',
    'lombok', 'jackson', 'hibernate', 'mysql-connector-java'
  ],
  go: [
    'github.com/gin-gonic/gin', 'github.com/jinzhu/gorm',
    'github.com/sirupsen/logrus', 'github.com/spf13/viper'
  ],
  rust: [
    'tokio', 'serde', 'reqwest', 'dotenv', 'clap',
    'tracing', 'thiserror', 'anyhow'
  ]
};

export const AgentConfigForm: React.FC<AgentConfigFormProps> = ({
  config,
  onChange,
  language,
  disabled = false
}) => {
  const [form] = Form.useForm();
  const [faceUploadProgress, setFaceUploadProgress] = useState(0);
  const [isUploadingFace, setIsUploadingFace] = useState(false);
  const [faceFeatures, setFaceFeatures] = useState<FaceBiometricFeatures | null>(null);

  React.useEffect(() => {
    form.setFieldsValue(config);
    if (config.userBinding.userFaceFeatures) {
      setFaceFeatures(config.userBinding.userFaceFeatures);
    }
  }, [config, form]);

  const handleValuesChange = (changedValues: any, allValues: any) => {
    const newConfig: AgentConfig = {
      ...config,
      ...changedValues
    };

    // 如果改变了绑定类型，需要相应调整userBinding
    if (changedValues.userBinding?.bindingType) {
      const newBindingType = changedValues.userBinding.bindingType;
      const currentUserBinding = allValues.userBinding || config.userBinding;

      newConfig.userBinding = {
        ...currentUserBinding,
        bindingType: newBindingType,
        // 如果切换到非多重验证，清除人脸特征
        userFaceFeatures: newBindingType === 'multiFactor' || newBindingType === 'faceBiometrics'
          ? currentUserBinding.userFaceFeatures
          : undefined
      };
    } else if (changedValues.userBinding) {
      newConfig.userBinding = {
        ...config.userBinding,
        ...changedValues.userBinding
      };
    }

    onChange(newConfig);
  };

  const handlePermissionChange = (checked: boolean, permissionId: string) => {
    const newPermissions = checked
      ? [...config.permissions, permissionId as any]
      : config.permissions.filter(p => p !== permissionId as any);

    const newConfig: AgentConfig = {
      ...config,
      permissions: newPermissions
    };
    onChange(newConfig);
  };

  const handleAddDependency = (dependency: string) => {
    if (!config.dependencies.includes(dependency)) {
      const newConfig: AgentConfig = {
        ...config,
        dependencies: [...config.dependencies, dependency]
      };
      onChange(newConfig);
    }
  };

  const handleRemoveDependency = (dependency: string) => {
    const newConfig: AgentConfig = {
      ...config,
      dependencies: config.dependencies.filter(d => d !== dependency)
    };
    onChange(newConfig);
  };

  const handleFaceUpload = async (file: File) => {
    setIsUploadingFace(true);
    setFaceUploadProgress(0);

    try {
      // 模拟人脸特征上传和提取过程
      for (let i = 0; i <= 100; i += 10) {
        setFaceUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // 模拟生成的人脸特征数据
      const mockFaceFeatures: FaceBiometricFeatures = {
        featureVector: Array.from({ length: 128 }, () => Math.random()),
        templateId: `face_${Date.now()}`,
        confidence: 0.95 + Math.random() * 0.04, // 0.95-0.99
        livenessCheck: true,
        antiSpoofing: true,
        enrollmentDate: new Date(),
        lastVerified: new Date()
      };

      setFaceFeatures(mockFaceFeatures);

      // 更新配置
      const newConfig: AgentConfig = {
        ...config,
        userBinding: {
          ...config.userBinding,
          userFaceFeatures: mockFaceFeatures,
          bindingType: 'multiFactor'
        }
      };

      onChange(newConfig);
      message.success('人脸特征上传成功！');

    } catch (error) {
      message.error('人脸特征上传失败，请重试');
    } finally {
      setIsUploadingFace(false);
      setFaceUploadProgress(0);
    }

    return false; // 阻止默认上传行为
  };

  const handleRemoveFaceFeatures = () => {
    setFaceFeatures(null);
    const newConfig: AgentConfig = {
      ...config,
      userBinding: {
        ...config.userBinding,
        userFaceFeatures: undefined,
        bindingType: 'faceBiometrics'
      }
    };
    onChange(newConfig);
    message.info('已清除人脸特征数据');
  };

  const languageSuggestions = language ? COMMON_DEPENDENCIES[language.id as keyof typeof COMMON_DEPENDENCIES] || [] : [];

  const selectedUser = DEMO_USERS.find(user => user.id === config.userBinding.boundUserId);

  return (
    <div className="space-y-6">
      {/* Demo Watermark */}
      <div className="mb-4">
        <Tag color="orange">
          <SettingOutlined className="mr-1" />
          {DEMO_WATERMARK}
        </Tag>
      </div>

      {/* Title */}
      <div className="mb-6">
        <Title level={4} className="mb-2">
          <SettingOutlined className="mr-2" />
          Agent配置
        </Title>
        <Text type="secondary" className="text-sm">
          配置Agent的运行参数和用户绑定验证机制
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        disabled={disabled}
      >
        {/* 用户绑定配置 */}
        <Card title="用户绑定配置" className="mb-4">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span>
                    <UserOutlined className="mr-1" />
                    绑定用户
                  </span>
                }
                name={['userBinding', 'boundUserId']}
                rules={[{ required: true, message: '请选择绑定的用户' }]}
              >
                <Select placeholder="选择要绑定的用户">
                  {MOCK_USERS.map((user) => (
                    <Option key={user.id} value={user.id}>
                      <Space>
                        <Avatar size="small" src={user.avatar} icon={<UserOutlined />} />
                        <div>
                          <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {user.email}
                          </div>
                        </div>
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span>
                    <SafetyCertificateOutlined className="mr-1" />
                    绑定方式
                  </span>
                }
                name={['userBinding', 'bindingType']}
                rules={[{ required: true, message: '请选择绑定方式' }]}
              >
                <Select placeholder="选择身份验证方式">
                  {USER_BINDING_OPTIONS.bindingTypes.map((option) => (
                    <Option key={option.value} value={option.value}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{option.label}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {option.description}
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span>
                    <SecurityScanOutlined className="mr-1" />
                    验证强度
                  </span>
                }
                name={['userBinding', 'bindingStrength']}
                rules={[{ required: true, message: '请选择验证强度' }]}
              >
                <Select placeholder="选择验证强度">
                  {USER_BINDING_OPTIONS.bindingStrengths.map((option) => (
                    <Option key={option.value} value={option.value}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{option.label}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {option.description}
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={
                  <span>
                    <ClockCircleOutlined className="mr-1" />
                    验证频率
                  </span>
                }
                name={['userBinding', 'verificationFrequency']}
                rules={[{ required: true, message: '请选择验证频率' }]}
              >
                <Select placeholder="选择验证频率">
                  {USER_BINDING_OPTIONS.verificationFrequencies.map((option) => (
                    <Option key={option.value} value={option.value}>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{option.label}</div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {option.description}
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {(config.userBinding.bindingType === 'faceBiometrics' || config.userBinding.bindingType === 'multiFactor') && (
            <div className="mt-4">
              <div className="mb-4">
                <Text strong className="flex items-center">
                  <CameraOutlined className="mr-2" />
                  人脸生物特征
                </Text>
              </div>

              {faceFeatures ? (
                <Card className="mb-4" size="small">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Text strong>特征模板ID:</Text>
                      <Text code>{faceFeatures.templateId}</Text>
                    </div>
                    <div className="flex items-center justify-between">
                      <Text strong>置信度:</Text>
                      <div className="flex items-center">
                        <Progress
                          percent={Math.round(faceFeatures.confidence * 100)}
                          size="small"
                          style={{ width: 100 }}
                          strokeColor={faceFeatures.confidence > 0.9 ? '#52c41a' : '#faad14'}
                        />
                        <Text className="ml-2">{Math.round(faceFeatures.confidence * 100)}%</Text>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Text strong>活体检测:</Text>
                      <Tag color={faceFeatures.livenessCheck ? 'green' : 'red'}>
                        {faceFeatures.livenessCheck ? '已启用' : '未启用'}
                      </Tag>
                    </div>
                    <div className="flex items-center justify-between">
                      <Text strong>防欺骗检测:</Text>
                      <Tag color={faceFeatures.antiSpoofing ? 'green' : 'red'}>
                        {faceFeatures.antiSpoofing ? '已启用' : '未启用'}
                      </Tag>
                    </div>
                    <div className="flex items-center justify-between">
                      <Text strong>录入时间:</Text>
                      <Text>{faceFeatures.enrollmentDate.toLocaleString()}</Text>
                    </div>
                    <div className="flex justify-end mt-3">
                      <Button
                        danger
                        size="small"
                        onClick={handleRemoveFaceFeatures}
                      >
                        删除特征数据
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={handleFaceUpload}
                    disabled={isUploadingFace || disabled}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      loading={isUploadingFace}
                      disabled={disabled}
                    >
                      上传人脸照片
                    </Button>
                  </Upload>
                  {isUploadingFace && (
                    <div className="mt-4">
                      <Progress percent={faceUploadProgress} size="small" />
                      <Text type="secondary" className="text-sm">
                        正在提取人脸特征...
                      </Text>
                    </div>
                  )}
                  <div className="mt-2">
                    <Text type="secondary" className="text-sm">
                      支持 JPG、PNG 格式，将自动提取生物特征用于身份验证
                    </Text>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-4">
            <Form.Item name={['userBinding', 'fallbackAllowed']} valuePropName="checked">
              <div className="flex items-center">
                <Switch />
                <Text className="ml-2">允许验证失败时的降级处理</Text>
              </div>
            </Form.Item>
          </div>
        </Card>

        {/* 权限配置 */}
        <Card title="权限配置" className="mb-4">
          <Space direction="vertical" className="w-full">
            {DEFAULT_AGENT_PERMISSIONS.map((permission) => (
              <div key={permission.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex-1">
                  <div className="flex items-center">
                    <SafetyCertificateOutlined className="mr-2 text-blue-500" />
                    <Text strong>{permission.name}</Text>
                    {permission.required && (
                      <Tag color="red" className="ml-2">必需</Tag>
                    )}
                  </div>
                  <Text type="secondary" className="text-sm ml-6">
                    {PERMISSION_DESCRIPTIONS[permission.id] || permission.description}
                  </Text>
                </div>
                <Switch
                  checked={config.permissions.includes(permission.id as any)}
                  onChange={(checked) => handlePermissionChange(checked, permission.id)}
                  disabled={disabled || permission.required}
                />
              </div>
            ))}
          </Space>
        </Card>

        {/* 环境变量 */}
        <Card title="环境变量" className="mb-4">
          <Alert
            message="环境变量配置"
            description="添加键值对格式的环境变量，格式为 KEY=VALUE"
            type="info"
            className="mb-4"
          />

          <Form.Item name="environment">
            <TextArea
              rows={4}
              placeholder={`示例:
NODE_ENV=production
API_URL=https://api.example.com
LOG_LEVEL=info`}
            />
          </Form.Item>
        </Card>

        {/* 依赖管理 */}
        <Card title="依赖管理" className="mb-4">
          {languageSuggestions.length > 0 && (
            <div className="mb-4">
              <Text strong>推荐的依赖包:</Text>
              <div className="flex flex-wrap gap-2 mt-2">
                {languageSuggestions
                  .filter(dep => !config.dependencies.includes(dep))
                  .slice(0, 8)
                  .map((dep) => (
                    <Tag
                      key={dep}
                      color="blue"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleAddDependency(dep as any)}
                    >
                      + {dep}
                    </Tag>
                  ))}
              </div>
            </div>
          )}

          <div>
            <Text strong>已选择的依赖:</Text>
            <div className="flex flex-wrap gap-2 mt-2">
              {config.dependencies.length === 0 ? (
                <Text type="secondary">暂无依赖</Text>
              ) : (
                config.dependencies.map((dep) => (
                  <Tag
                    key={dep}
                    color="green"
                    closable
                    onClose={() => handleRemoveDependency(dep)}
                  >
                    {dep}
                  </Tag>
                ))
              )}
            </div>
          </div>
        </Card>
      </Form>

      {/* 配置摘要 */}
      <Card title="配置摘要" className="mb-4">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Space direction="vertical" size="small" className="w-full">
              <Text strong>绑定用户:</Text>
              <Text type="secondary">
                {selectedUser ? `${selectedUser.name} (${selectedUser.department})` : '未选择用户'}
              </Text>
            </Space>
          </Col>
          <Col xs={24} sm={12}>
            <Space direction="vertical" size="small" className="w-full">
              <Text strong>验证方式:</Text>
              <Text type="secondary">
                {config.userBinding.bindingType} · {config.userBinding.bindingStrength} · {config.userBinding.verificationFrequency}
              </Text>
            </Space>
          </Col>
                    <Col xs={24}>
            <Space direction="vertical" size="small" className="w-full">
              <Text strong>权限:</Text>
              <div className="flex flex-wrap gap-2">
                {config.permissions.map((permission, index) => (
                  <Tag key={index} color="blue">
                    {String(permission)}
                  </Tag>
                ))}
              </div>
            </Space>
          </Col>
                  </Row>
      </Card>

      {/* Demo Notice */}
      <Alert
        message="演示系统说明"
        description="此配置界面仅用于演示目的，实际的Agent部署会根据这些配置参数进行用户绑定验证和权限控制。"
        type="warning"
        showIcon
      />
    </div>
  );
};