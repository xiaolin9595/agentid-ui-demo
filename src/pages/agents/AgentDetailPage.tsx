import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const AgentDetailPage: React.FC = () => {
  return (
    <div>
      <Card>
        <Title level={2}>Agent详情</Title>
        <p>这里将展示Agent详细信息</p>
      </Card>
    </div>
  );
};

export default AgentDetailPage;