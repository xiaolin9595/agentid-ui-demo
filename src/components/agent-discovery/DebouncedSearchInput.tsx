import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Input, InputRef } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface DebouncedSearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  debounceMs?: number;
  allowClear?: boolean;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  className?: string;
  style?: React.CSSProperties;
}

export const DebouncedSearchInput: React.FC<DebouncedSearchInputProps> = ({
  placeholder = '搜索...',
  value,
  onChange,
  onSearch,
  debounceMs = 300,
  allowClear = true,
  disabled = false,
  size = 'middle',
  className,
  style,
}: DebouncedSearchInputProps) => {
  const inputRef = useRef<InputRef>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 自定义防抖函数
  const debouncedOnChange = useCallback((newValue: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange?.(newValue);
    }, debounceMs);
  }, [onChange, debounceMs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    debouncedOnChange(newValue);
  };

  const handlePressEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 按回车时立即触发搜索，清除防抖
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onChange?.(e.currentTarget.value);
    onSearch?.(e.currentTarget.value);
  };

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <Input
      ref={inputRef}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onPressEnter={handlePressEnter}
      prefix={<SearchOutlined />}
      allowClear={allowClear}
      disabled={disabled}
      size={size}
      className={className}
      style={style}
    />
  );
};