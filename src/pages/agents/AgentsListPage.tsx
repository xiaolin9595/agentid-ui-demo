import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const AgentsListPage: React.FC = () => {
  return (
    <div>
      <Card>
        <Title level={2}>Agent管理</Title>
        <p>这里将展示Agent列表和管理功能</p>
      </Card>
    </div>
  );
};

export default AgentsListPage;