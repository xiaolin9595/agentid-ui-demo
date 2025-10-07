import React, { useState } from 'react';
import { Form, Input, Button, Card, Steps, message, Progress, Alert } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store';
import { registerUser } from '../../services/userService';

const { Step } = Steps;

const RegisterPage: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [biometricProgress, setBiometricProgress] = useState(0);
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const steps = [
    {
      title: '基本信息',
      description: '填写账户信息',
      icon: <UserOutlined />,
    },
    {
      title: '生物特征',
      description: '绑定身份验证',
      icon: <SafetyOutlined />,
    },
    {
      title: '密钥生成',
      description: '创建加密密钥',
      icon: <LockOutlined />,
    },
    {
      title: '完成注册',
      description: '账户创建成功',
      icon: <MailOutlined />,
    },
  ];

  const handleBasicInfo = async (values: any) => {
    setFormData({ ...formData, ...values });
    setCurrent(1);
  };

  const handleBiometricBinding = async () => {
    setScanning(true);
    setBiometricProgress(0);

    // 模拟生物特征扫描
    const interval = setInterval(() => {
      setBiometricProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          setCurrent(2);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 300);
  };

  const handleKeyGeneration = async () => {
    try {
      setCurrent(3);

      // 调用注册服务
      const newUser = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      setUser(newUser);
      message.success('注册成功！');
    } catch (error: any) {
      message.error(error.message || '注册失败');
      // 返回到第一步
      setCurrent(0);
    }
  };

  const renderStepContent = () => {
    switch (current) {
      case 0:
        return (
          <Form
            layout="vertical"
            onFinish={handleBasicInfo}
            size="large"
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="输入用户名" />
            </Form.Item>

            <Form.Item
              label="邮箱"
              name="email"
              rules={[
                { required: true, message: '请输入邮箱!' },
                { type: 'email', message: '请输入有效的邮箱地址!' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="输入邮箱地址" />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              rules={[
                { required: true, message: '请输入密码!' },
                { min: 8, message: '密码至少8个字符!' }
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="输入密码" />
            </Form.Item>

            <Form.Item
              label="确认密码"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致!'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="w-full">
                下一步
              </Button>
            </Form.Item>
          </Form>
        );

      case 1:
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                <SafetyOutlined className="text-6xl text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">生物特征绑定</h3>
              <p className="text-gray-600">
                请将您的指纹放在扫描器上，系统将生成唯一的生物特征模板。
              </p>
            </div>

            <div className="mb-6">
              <Progress
                percent={biometricProgress}
                status={scanning ? 'active' : biometricProgress === 100 ? 'success' : 'normal'}
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
            </div>

            <Alert
              message="生物特征验证"
              description="此步骤将验证您的生物特征信息，确保Agent只能由其所有者操作。"
              type="info"
              showIcon
              className="mb-6"
            />

            <Button
              type="primary"
              size="large"
              onClick={handleBiometricBinding}
              loading={scanning}
              disabled={biometricProgress > 0}
              className="w-full"
            >
              {scanning ? '扫描中...' : biometricProgress === 100 ? '已绑定' : '开始扫描'}
            </Button>
          </div>
        );

      case 2:
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-4 bg-green-50 rounded-full flex items-center justify-center">
                <LockOutlined className="text-6xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">密钥生成</h3>
              <p className="text-gray-600">
                系统正在为您生成加密密钥对，用于身份验证和数据加密。
              </p>
            </div>

            <Alert
              message="安全提示"
              description="您的私钥将安全存储，请妥善保管。私钥丢失将无法恢复。"
              type="warning"
              showIcon
              className="mb-6"
            />

            <Button
              type="primary"
              size="large"
              onClick={handleKeyGeneration}
              className="w-full"
            >
              生成密钥并完成注册
            </Button>
          </div>
        );

      case 3:
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <SafetyOutlined className="text-6xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">注册成功！</h3>
              <p className="text-gray-600">
                您的 AgentID 账户已成功创建，现在可以开始使用所有功能。
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">用户名</p>
                <p className="font-medium">{formData.username}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">邮箱</p>
                <p className="font-medium">{formData.email}</p>
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              onClick={() => navigate('/dashboard')}
              className="w-full"
            >
              进入仪表板
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">创建 AgentID 账户</h2>
          <p className="mt-2 text-sm text-gray-600">
            快速注册并开始使用 AgentID 管理平台
          </p>
        </div>

        <Card className="shadow-lg">
          <Steps current={current} className="mb-8">
            {steps.map((step, index) => (
              <Step
                key={step.title}
                title={step.title}
                description={step.description}
                icon={step.icon}
              />
            ))}
          </Steps>

          <div className="min-h-[400px] flex items-center justify-center">
            {renderStepContent()}
          </div>

          {current > 0 && current < 3 && (
            <div className="text-center mt-6">
              <Button onClick={() => setCurrent(current - 1)}>
                上一步
              </Button>
            </div>
          )}

          {current === 0 && (
            <div className="text-center mt-6">
              <span className="text-sm text-gray-600">
                已有账户？{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  立即登录
                </Link>
              </span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;