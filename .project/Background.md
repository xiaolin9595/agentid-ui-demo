# 项目背景

## 项目概述
AgentID UI 演示系统是一个基于 React + Vite + TypeScript + Ant Design + Tailwind CSS 的前端项目，专注于展示 AgentID 相关功能。

## 技术栈
- **框架**: React 18
- **构建工具**: Vite
- **语言**: TypeScript
- **UI 库**: Ant Design
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **测试**: Playwright E2E

## 项目结构
```
src/
├── components/
│   ├── ui/           # 通用UI组件
│   ├── forms/        # 表单组件
│   └── blockchain/   # 区块链相关组件
├── pages/            # 页面组件
├── store/            # Zustand状态管理
├── services/         # API服务
├── types/            # TypeScript类型定义
└── mocks/            # Mock数据
```

## 当前状态
- BlockchainPage 已实现用户身份合约注册功能
- IdentityContractRegistration 组件支持用户合约注册
- 区块链状态管理使用 Zustand
- 现有功能包括：合约注册、列表展示、状态管理、统计信息

## 需求背景
用户希望扩展区块链功能，增加 Agent 身份合约的注册能力，同时简化统计显示。具体需求：
1. 移除不必要的 Gas 消耗统计
2. 添加 Agent 专用合约注册功能
3. Agent 合约应包含特定的字段（Agent ID、类型、能力、权限等）

## 设计约束
- 必须与现有设计系统保持一致
- 使用 Ant Design 组件和 Tailwind CSS
- 保持 TypeScript 类型安全
- 遵循现有的代码风格和架构模式
- Mock 数据需要与 Agent 功能对应

## 参考文档
- 现有的 IdentityContractRegistration 组件
- BlockchainPage 的现有实现
- TypeScript 类型定义文件
- Zustand store 结构