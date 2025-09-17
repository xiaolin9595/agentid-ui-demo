import React from 'react';
import { Card, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface StatisticCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  className?: string;
  valueStyle?: React.CSSProperties;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  icon,
  trend,
  prefix,
  suffix,
  className = '',
  valueStyle,
}) => {
  return (
    <Card className={`statistic-card ${className}`} bordered={false}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Statistic
            title={title}
            value={value}
            prefix={prefix}
            suffix={suffix}
            valueStyle={{
              fontSize: '24px',
              fontWeight: 600,
              color: '#1f2937',
              ...valueStyle
            }}
          />
          {trend && (
            <div className="mt-2 flex items-center">
              {trend.isPositive ? (
                <ArrowUpOutlined className="text-green-600" />
              ) : (
                <ArrowDownOutlined className="text-red-600" />
              )}
              <span
                className={`ml-1 text-sm ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {Math.abs(trend.value)}%
              </span>
              <span className="ml-1 text-sm text-gray-500">vs 上期</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="ml-4 flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatisticCard;