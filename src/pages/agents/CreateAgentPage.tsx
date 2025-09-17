import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const CreateAgentPage: React.FC = () => {
  return (
    <div>
      <Card>
        <Title level={2}>创建Agent</Title>
        <p>这里将展示Agent创建表单</p>
      </Card>
    </div>
  );
};

export default CreateAgentPage;