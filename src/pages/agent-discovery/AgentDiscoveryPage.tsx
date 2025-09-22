import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const AgentDiscoveryPage: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Title level={2}>Agent 发现</Title>
        <p>此页面正在维护中，即将推出...</p>
      </Card>
    </div>
  );
};

export default AgentDiscoveryPage;