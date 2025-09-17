import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, List, Avatar, Progress, Timeline, Button } from 'antd';
import {
  DashboardOutlined,
  RobotOutlined,
  SafetyCertificateOutlined,
  BlockOutlined,
  RiseOutlined,
  UserOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import StatisticCard from '../../components/ui/StatisticCard';
import { useAuthStore, useAgentStore } from '../../store';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { agents, loading } = useAgentStore();
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalAuthentications: 0,
    blockchainTransactions: 0,
  });

  useEffect(() => {
    // 模拟统计数据
    setStats({
      totalAgents: agents.length,
      activeAgents: agents.filter((agent: any) => agent.status === 'active').length,
      totalAuthentications: 156,
      blockchainTransactions: 89,
    });
  }, [agents]);

  const recentActivities = [
    {
      id: 1,
      type: 'agent_created',
      title: '创建了新的Agent',
      description: 'Data Processing Agent',
      time: '2分钟前',
      status: 'success',
    },
    {
      id: 2,
      type: 'authentication',
      title: '完成身份认证',
      description: 'Agent ID: agent_001',
      time: '15分钟前',
      status: 'success',
    },
    {
      id: 3,
      type: 'agent_stopped',
      title: '停止了Agent',
      description: 'Backup Agent',
      time: '1小时前',
      status: 'warning',
    },
    {
      id: 4,
      type: 'blockchain_tx',
      title: '区块链交易',
      description: 'Agent注册',
      time: '2小时前',
      status: 'success',
    },
  ];

  const systemHealth = [
    {
      title: '网络状态',
      value: 98,
      status: 'healthy',
    },
    {
      title: 'API响应时间',
      value: 95,
      status: 'healthy',
    },
    {
      title: '数据库连接',
      value: 100,
      status: 'healthy',
    },
    {
      title: '区块链同步',
      value: 87,
      status: 'warning',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleOutlined className="text-green-500" />;
      case 'warning':
        return <ExclamationCircleOutlined className="text-yellow-500" />;
      default:
        return <ExclamationCircleOutlined className="text-gray-500" />;
    }
  };

  return (
    <div>
      {/* 欢迎横幅 */}
      <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <Row align="middle">
          <Col flex="auto">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                欢迎回来，{user?.username}！
              </h1>
              <p className="text-blue-100">
                今天是 {new Date().toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}，让我们一起管理您的AgentID生态。
              </p>
            </div>
          </Col>
          <Col>
            <Avatar size={64} icon={<UserOutlined />} className="bg-white/20" />
          </Col>
        </Row>
      </Card>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="Agent总数"
            value={stats.totalAgents}
            icon={<RobotOutlined />}
            trend={{ value: 12, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="活跃Agent"
            value={stats.activeAgents}
            icon={<DashboardOutlined />}
            trend={{ value: 8, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="认证次数"
            value={stats.totalAuthentications}
            icon={<SafetyCertificateOutlined />}
            trend={{ value: 15, isPositive: true }}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatisticCard
            title="区块链交易"
            value={stats.blockchainTransactions}
            icon={<BlockOutlined />}
            trend={{ value: 5, isPositive: true }}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* 最近活动 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center">
                <ClockCircleOutlined className="mr-2" />
                最近活动
              </div>
            }
            className="h-full"
          >
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100">
                        {getStatusIcon(item.status)}
                      </div>
                    }
                    title={
                      <div className="flex items-center justify-between">
                        <span>{item.title}</span>
                        <span className="text-xs text-gray-500">{item.time}</span>
                      </div>
                    }
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 系统健康状态 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <div className="flex items-center">
                <RiseOutlined className="mr-2" />
                系统健康状态
              </div>
            }
            className="h-full"
          >
            <div className="space-y-4">
              {systemHealth.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.title}</span>
                    <span className={`text-sm ${
                      item.status === 'healthy' ? 'text-green-600' : 'text-yellow-600'
                    }`}>
                      {item.value}%
                    </span>
                  </div>
                  <Progress
                    percent={item.value}
                    size="small"
                    strokeColor={item.status === 'healthy' ? '#52c41a' : '#faad14'}
                    showInfo={false}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">系统状态</h4>
              <p className="text-sm text-blue-700">
                所有系统运行正常。区块链同步稍慢，但不影响正常使用。
              </p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 快速操作 */}
      <Card title="快速操作" className="mt-6">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={6}>
            <Button
              type="primary"
              size="large"
              className="w-full h-20"
              icon={<RobotOutlined />}
            >
              创建Agent
            </Button>
          </Col>
          <Col xs={24} sm={6}>
            <Button
              size="large"
              className="w-full h-20"
              icon={<SafetyCertificateOutlined />}
            >
              身份认证
            </Button>
          </Col>
          <Col xs={24} sm={6}>
            <Button
              size="large"
              className="w-full h-20"
              icon={<BlockOutlined />}
            >
              区块链浏览
            </Button>
          </Col>
          <Col xs={24} sm={6}>
            <Button
              size="large"
              className="w-full h-20"
              icon={<UserOutlined />}
            >
              个人设置
            </Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default DashboardPage;