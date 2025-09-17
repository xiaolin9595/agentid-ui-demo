import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const ProfilePage: React.FC = () => {
  return (
    <div>
      <Card>
        <Title level={2}>个人中心</Title>
        <p>这里将展示用户个人信息和设置</p>
      </Card>
    </div>
  );
};

export default ProfilePage;