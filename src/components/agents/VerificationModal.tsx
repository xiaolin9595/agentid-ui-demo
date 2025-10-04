import React, { useState, useEffect } from 'react';
import {
  Modal,
  Steps,
  Progress,
  Space,
  Typography,
  Spin,
  Result,
  Card
} from 'antd';
import {
  CameraOutlined,
  SafetyCertificateOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  RobotOutlined
} from '@ant-design/icons';

const { Text, Title } = Typography;
const { Step } = Steps;

/**
 * 验证步骤类型定义
 */
type VerificationStep = 'face' | 'zkvm' | 'credential' | 'completed' | 'error';

/**
 * 验证进度状态
 */
interface VerificationProgress {
  step: VerificationStep;
  progress: number;
  message: string;
  status: 'process' | 'finish' | 'error';
}

/**
 * VerificationModal 组件属性
 */
interface VerificationModalProps {
  /** Modal 显示状态 */
  visible: boolean;
  /** 发起通信的 Agent 名称 */
  fromAgentName: string;
  /** 接收通信的 Agent 名称 */
  toAgentName: string;
  /** 验证成功的回调函数 */
  onSuccess: () => void;
  /** 验证失败的回调函数 */
  onError: (error: string) => void;
}

/**
 * VerificationModal - Agent 通信多步骤验证流程组件
 *
 * 实现三步验证流程：
 * 1. 人脸识别验证
 * 2. Agent 身份互验 (zkVM 证明)
 * 3. 可验证凭证权限验证
 *
 * @component
 * @example
 * ```tsx
 * <VerificationModal
 *   visible={true}
 *   fromAgentName="购物助手"
 *   toAgentName="支付助手"
 *   onSuccess={() => console.log('验证成功')}
 *   onError={(error) => console.error(error)}
 * />
 * ```
 */
const VerificationModal: React.FC<VerificationModalProps> = ({
  visible,
  fromAgentName,
  toAgentName,
  onSuccess,
  onError
}) => {
  // 当前验证步骤状态
  const [currentStep, setCurrentStep] = useState<number>(0);

  // 验证进度状态
  const [verificationProgress, setVerificationProgress] = useState<VerificationProgress>({
    step: 'face',
    progress: 0,
    message: '准备开始验证...',
    status: 'process'
  });

  // 各步骤完成状态
  const [stepsStatus, setStepsStatus] = useState<{
    face: boolean;
    zkvm: boolean;
    credential: boolean;
  }>({
    face: false,
    zkvm: false,
    credential: false
  });

  /**
   * 重置验证状态
   */
  const resetVerification = () => {
    setCurrentStep(0);
    setVerificationProgress({
      step: 'face',
      progress: 0,
      message: '准备开始验证...',
      status: 'process'
    });
    setStepsStatus({
      face: false,
      zkvm: false,
      credential: false
    });
  };

  /**
   * 模拟步骤1：人脸识别验证
   */
  const simulateFaceVerification = () => {
    setVerificationProgress({
      step: 'face',
      progress: 0,
      message: '正在进行人脸识别验证...',
      status: 'process'
    });

    // 模拟进度更新
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setVerificationProgress(prev => ({
        ...prev,
        progress,
        message: progress < 100 ? '正在进行人脸识别验证...' : '✓ 身份验证成功'
      }));

      if (progress >= 100) {
        clearInterval(interval);
        // 标记步骤1完成
        setStepsStatus(prev => ({ ...prev, face: true }));

        // 延迟500ms后进入步骤2
        setTimeout(() => {
          setCurrentStep(1);
          simulateZkvmVerification();
        }, 500);
      }
    }, 40); // 2秒完成 (100 / 5 * 40ms = 2000ms)
  };

  /**
   * 模拟步骤2：Agent 身份互验 (zkVM 证明)
   */
  const simulateZkvmVerification = () => {
    setVerificationProgress({
      step: 'zkvm',
      progress: 0,
      message: '生成我的Agent运行证明...',
      status: 'process'
    });

    let progress = 0;
    const messages = [
      { threshold: 0, text: '生成我的Agent运行证明...' },
      { threshold: 33, text: '验证对方Agent的zkVM proof...' },
      { threshold: 66, text: '交换并验证双方证明...' },
      { threshold: 100, text: '✓ zkVM证明验证成功' }
    ];

    const interval = setInterval(() => {
      progress += 3.33; // 约3秒完成 (100 / 3.33 * 30ms ≈ 3000ms)

      // 根据进度更新消息
      const currentMessage = messages
        .filter(m => progress >= m.threshold)
        .pop()?.text || messages[0].text;

      setVerificationProgress(prev => ({
        ...prev,
        progress: Math.min(progress, 100),
        message: currentMessage
      }));

      if (progress >= 100) {
        clearInterval(interval);
        // 标记步骤2完成
        setStepsStatus(prev => ({ ...prev, zkvm: true }));

        // 延迟500ms后进入步骤3
        setTimeout(() => {
          setCurrentStep(2);
          simulateCredentialVerification();
        }, 500);
      }
    }, 30);
  };

  /**
   * 模拟步骤3：可验证凭证权限验证
   */
  const simulateCredentialVerification = () => {
    setVerificationProgress({
      step: 'credential',
      progress: 0,
      message: '检查我的Agent权限凭证...',
      status: 'process'
    });

    let progress = 0;
    const messages = [
      { threshold: 0, text: '检查我的Agent权限凭证...' },
      { threshold: 40, text: '验证对方Agent权限范围...' },
      { threshold: 80, text: '确认双方权限匹配...' },
      { threshold: 100, text: '✓ 权限验证通过' }
    ];

    const interval = setInterval(() => {
      progress += 4; // 2.5秒完成 (100 / 4 * 25ms = 2500ms)

      // 根据进度更新消息
      const currentMessage = messages
        .filter(m => progress >= m.threshold)
        .pop()?.text || messages[0].text;

      setVerificationProgress(prev => ({
        ...prev,
        progress: Math.min(progress, 100),
        message: currentMessage
      }));

      if (progress >= 100) {
        clearInterval(interval);
        // 标记步骤3完成
        setStepsStatus(prev => ({ ...prev, credential: true }));

        // 延迟500ms后显示完成状态
        setTimeout(() => {
          setVerificationProgress({
            step: 'completed',
            progress: 100,
            message: '所有验证步骤已完成',
            status: 'finish'
          });

          // 延迟1秒后关闭Modal并调用成功回调
          setTimeout(() => {
            onSuccess();
          }, 1000);
        }, 500);
      }
    }, 25);
  };

  /**
   * Modal 打开时启动验证流程
   */
  useEffect(() => {
    if (visible) {
      resetVerification();
      // 延迟500ms后开始第一步验证
      setTimeout(() => {
        simulateFaceVerification();
      }, 500);
    }
  }, [visible]);

  /**
   * 渲染步骤图标
   */
  const renderStepIcon = (step: number) => {
    if (stepsStatus.face && step === 0) {
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    }
    if (stepsStatus.zkvm && step === 1) {
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    }
    if (stepsStatus.credential && step === 2) {
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    }

    // 当前进行中的步骤显示 Spin
    if (currentStep === step) {
      return <Spin size="small" />;
    }

    // 未开始的步骤显示默认图标
    const icons = [
      <CameraOutlined />,
      <RobotOutlined />,
      <SafetyCertificateOutlined />
    ];
    return icons[step];
  };

  /**
   * 渲染当前步骤的详细内容
   */
  const renderStepContent = () => {
    if (verificationProgress.step === 'completed') {
      return (
        <Result
          status="success"
          icon={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: '72px' }} />}
          title="验证成功"
          subTitle={
            <Space direction="vertical" size="small">
              <Text>所有验证步骤已完成，通信即将建立</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {fromAgentName} ⇄ {toAgentName}
              </Text>
            </Space>
          }
        />
      );
    }

    if (verificationProgress.step === 'error') {
      return (
        <Result
          status="error"
          icon={<CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '72px' }} />}
          title="验证失败"
          subTitle={verificationProgress.message}
        />
      );
    }

    // 当前步骤的动画和进度
    const stepIcons: Record<VerificationStep, React.ReactNode> = {
      face: <CameraOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
      zkvm: <RobotOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
      credential: <SafetyCertificateOutlined style={{ fontSize: 48, color: '#1890ff' }} />,
      completed: null,
      error: null
    };

    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        {/* 步骤图标和动画 */}
        <div
          style={{
            marginBottom: 24,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 80
          }}
        >
          <Spin spinning={verificationProgress.status === 'process'} size="large">
            {stepIcons[verificationProgress.step]}
          </Spin>
        </div>

        {/* 步骤消息 */}
        <div style={{ marginBottom: 24 }}>
          <Text style={{ fontSize: 16, color: '#1890ff' }}>
            {verificationProgress.message}
          </Text>
        </div>

        {/* 进度条 */}
        <div style={{ marginBottom: 24 }}>
          <Progress
            percent={Math.round(verificationProgress.progress)}
            status={verificationProgress.status === 'error' ? 'exception' : 'active'}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068'
            }}
          />
        </div>

        {/* Agent 信息卡片 */}
        {verificationProgress.step === 'zkvm' && (
          <Card size="small" style={{ background: '#f0f5ff', border: '1px solid #adc6ff' }}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <RobotOutlined style={{ color: '#1890ff' }} />
                  <Text strong>{fromAgentName}</Text>
                </Space>
                <Text type="secondary">⇄</Text>
                <Space>
                  <Text strong>{toAgentName}</Text>
                  <RobotOutlined style={{ color: '#1890ff' }} />
                </Space>
              </div>
            </Space>
          </Card>
        )}
      </div>
    );
  };

  return (
    <Modal
      title={
        <Space>
          <SafetyCertificateOutlined style={{ color: '#1890ff' }} />
          <span>Agent 通信验证流程</span>
        </Space>
      }
      open={visible}
      onCancel={undefined} // 禁用取消按钮
      footer={null} // 不显示底部按钮
      width={700}
      centered
      maskClosable={false} // 禁止点击遮罩关闭
      closable={false} // 禁用关闭按钮
    >
      {/* 验证步骤指示器 */}
      <div style={{ marginBottom: 32 }}>
        <Steps current={currentStep} size="small">
          <Step
            title="人脸识别验证"
            icon={renderStepIcon(0)}
            status={stepsStatus.face ? 'finish' : currentStep === 0 ? 'process' : 'wait'}
          />
          <Step
            title="Agent 身份互验"
            icon={renderStepIcon(1)}
            status={stepsStatus.zkvm ? 'finish' : currentStep === 1 ? 'process' : 'wait'}
            description="zkVM 证明"
          />
          <Step
            title="凭证权限验证"
            icon={renderStepIcon(2)}
            status={stepsStatus.credential ? 'finish' : currentStep === 2 ? 'process' : 'wait'}
          />
        </Steps>
      </div>

      {/* 步骤内容区域 */}
      {renderStepContent()}

      {/* 提示信息 */}
      {verificationProgress.step !== 'completed' && verificationProgress.step !== 'error' && (
        <div
          style={{
            backgroundColor: '#f0f5ff',
            border: '1px solid #adc6ff',
            borderRadius: 4,
            padding: 12,
            marginTop: 16
          }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            <Space direction="vertical" size={4}>
              <div>🔒 验证过程中使用零知识证明技术保护隐私</div>
              <div>⚡ 所有验证步骤均在安全环境中执行</div>
              <div>✓ 验证完成后将自动建立安全通信通道</div>
            </Space>
          </Text>
        </div>
      )}
    </Modal>
  );
};

export default VerificationModal;
