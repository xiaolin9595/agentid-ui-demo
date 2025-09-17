import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const BlockchainPage: React.FC = () => {
  return (
    <div>
      <Card>
        <Title level={2}>区块链浏览器</Title>
        <p>这里将展示区块链交易和合约信息</p>
      </Card>
    </div>
  );
};

export default BlockchainPage;