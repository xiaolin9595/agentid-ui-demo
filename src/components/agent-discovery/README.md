# Agent Discovery Components

这个目录包含了Agent发现功能的完整搜索组件系统。

## 组件概述

### 核心组件

1. **AgentDiscoverySearch** - 主要搜索组件
   - 搜索输入框（支持防抖）
   - 高级搜索下拉菜单
   - 搜索历史访问
   - 搜索建议显示
   - 当前搜索条件显示

2. **AgentDiscoveryFilters** - 过滤器组件
   - 状态过滤器（活跃、非活跃、待定等）
   - 类型过滤器（AI Agent、Data Agent等）
   - 语言过滤器（JavaScript、Python等）
   - 能力过滤器（AI/ML、数据处理等）
   - 评分范围滑块
   - 代码大小范围滑块
   - 区块链状态过滤器
   - 网络过滤器
   - 标签过滤器

3. **AgentDiscoverySort** - 排序组件
   - 多种排序字段（名称、评分、时间等）
   - 排序方向切换
   - 快速排序选项
   - 当前排序状态显示

4. **AgentDiscoverySearchHistory** - 搜索历史组件
   - 搜索历史记录显示
   - 快速重搜索功能
   - 历史记录管理（删除、清除）
   - 热门搜索统计

5. **DebouncedSearchInput** - 防抖搜索输入组件
   - 可配置防抖时间
   - 支持搜索建议
   - 清除按钮
   - 按回车搜索

6. **AgentDiscoverySearchExample** - 完整示例组件
   - 展示所有组件的组合使用
   - 响应式布局
   - 搜索结果展示

## 使用方法

### 基本使用

```tsx
import React from 'react';
import { AgentDiscoverySearch } from '@/components/agent-discovery';

const MyComponent: React.FC = () => {
  return (
    <div>
      <AgentDiscoverySearch />
    </div>
  );
};
```

### 完整使用示例

```tsx
import React from 'react';
import { Row, Col } from 'antd';
import {
  AgentDiscoverySearch,
  AgentDiscoveryFilters,
  AgentDiscoverySort,
  AgentDiscoverySearchHistory,
} from '@/components/agent-discovery';

const AgentDiscoveryPage: React.FC = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} lg={8}>
        <AgentDiscoverySearch />
        <AgentDiscoveryFilters />
        <AgentDiscoverySort />
        <AgentDiscoverySearchHistory />
      </Col>
      <Col xs={24} lg={16}>
        {/* 搜索结果展示区域 */}
      </Col>
    </Row>
  );
};
```

### 使用示例组件

```tsx
import React from 'react';
import { AgentDiscoverySearchExample } from '@/components/agent-discovery';

const App: React.FC = () => {
  return <AgentDiscoverySearchExample />;
};
```

## 状态管理

所有组件都与 `useAgentDiscoveryStore` 完全集成，包括：

- **搜索状态**：搜索参数、结果、加载状态、错误处理
- **过滤状态**：活动过滤器、可用过滤器选项
- **排序状态**：当前排序、排序选项
- **历史状态**：搜索历史记录
- **UI状态**：视图模式、过滤器显示状态

## 类型定义

组件使用完整的TypeScript类型定义：

```tsx
import type {
  AgentDiscoverySearchParams,
  AgentDiscoverySortParams,
  AgentDiscoveryFilterParams,
  AgentDiscoveryItem,
} from '@/types/agent-discovery';
```

## 样式定制

组件使用Tailwind CSS和Ant Design样式系统，可以通过以下方式定制：

1. **CSS类覆盖**：使用自定义CSS类
2. **Ant Design主题**：配置Ant Design主题变量
3. **Tailwind配置**：修改Tailwind配置文件

## 响应式设计

所有组件都支持响应式设计：

- **移动端**：单列布局，触摸友好的交互
- **平板端**：双列布局，优化的触摸交互
- **桌面端**：多列布局，完整功能展示

## 性能优化

- **防抖搜索**：避免频繁搜索请求
- **缓存机制**：搜索结果和Agent详情缓存
- **虚拟滚动**：大量结果时的性能优化
- **懒加载**：按需加载组件和数据

## 可访问性

- **键盘导航**：完整的键盘支持
- **屏幕阅读器**：ARIA标签支持
- **高对比度**：支持高对比度模式
- **焦点管理**：合理的焦点管理

## 国际化

组件支持国际化配置：

```tsx
// 可以通过props或上下文配置
<AgentDiscoverySearch
  placeholder="搜索Agent..."
  searchButtonText="搜索"
  clearButtonText="清除"
/>
```

## 常见问题

### Q: 如何自定义搜索建议？
A: 通过 `getSearchSuggestions` 方法在store中自定义搜索建议逻辑。

### Q: 如何添加新的过滤器？
A: 在 `AgentDiscoveryFilterParams` 类型中添加新字段，并在过滤器组件中添加相应的UI。

### Q: 如何处理大量搜索结果？
A: 使用分页组件和虚拟滚动来优化性能。

### Q: 如何自定义排序逻辑？
A: 在 `AgentDiscoverySortParams` 中添加新的排序字段，并在排序组件中添加选项。

## 贡献指南

1. 遵循项目代码风格
2. 添加必要的类型定义
3. 编写组件测试
4. 更新文档
5. 确保响应式设计

## 许可证

MIT License