# 统一Agent数据源

这个目录包含了AgentID UI应用的统一数据源实现，解决了三个页面（Agent发现、区块链、Agent管理）数据不一致的问题。

## 🏗️ 架构设计

### 核心组件

1. **统一数据管理器** (`unifiedAgentDataManager.ts`)
   - 中心化的数据存储和管理
   - 提供统一的CRUD操作
   - 支持事件监听和数据持久化

2. **数据转换器** (`agentDataConverter.ts`)
   - 在不同Agent数据结构之间进行转换
   - 确保向后兼容性
   - 处理类型映射和字段转换

3. **数据适配器**
   - `unifiedDataAdapter.ts`: Agent发现页面适配器
   - `unifiedBlockchainAdapter.ts`: 区块链页面适配器
   - `unifiedAgentAdapter.ts`: Agent管理页面适配器

4. **统一Store**
   - `unifiedAgentDiscoveryStore.ts`: Agent发现页面Store
   - `unifiedBlockchainStore.ts`: 区块链页面Store
   - `unifiedAgentStore.ts`: Agent管理页面Store

## 📊 数据结构

### UnifiedAgent
统一的Agent数据结构，兼容所有页面的需求：

```typescript
interface UnifiedAgent {
  // 基础信息
  id: string;
  agentId: string;
  name: string;
  description: string;
  type: UnifiedAgentType;
  capabilities: UnifiedAgentCapability[];
  status: UnifiedAgentStatus;

  // 技术信息
  codeHash?: string;
  profileHash?: string;
  version: string;
  model?: string;
  apiEndpoint?: string;
  language?: string;
  codeSize?: number;

  // 绑定信息
  boundUser?: string;
  boundAt?: string;
  config: UnifiedAgentConfig;
  permissions: UnifiedPermission[];

  // 时间信息
  createdAt: string;
  updatedAt: string;

  // 区块链信息
  blockchainInfo: UnifiedBlockchainInfo;

  // 评分和统计
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  isFeatured?: boolean;
  stats?: UnifiedAgentStats;

  // 元数据
  metadata: UnifiedAgentMetadata;

  // 最后活动
  lastActivity?: Date;
}
```

## 🔧 使用方法

### 1. 基本CRUD操作

```typescript
import { unifiedAgentDataManager } from './data';

// 添加Agent
const newAgent = unifiedAgentDataManager.addAgent({
  name: '新Agent',
  description: 'Agent描述',
  type: 'AI Assistant',
  capabilities: ['工作助理'],
  status: 'active',
  // ... 其他必需字段
});

// 获取Agent
const agent = unifiedAgentDataManager.getAgentById(agentId);

// 更新Agent
unifiedAgentDataManager.updateAgent(agentId, {
  name: '更新后的名称',
  status: 'inactive'
});

// 删除Agent
unifiedAgentDataManager.deleteAgent(agentId);

// 搜索Agent
const searchResults = unifiedAgentDataManager.searchAgents('关键词');

// 过滤Agent
const filteredAgents = unifiedAgentDataManager.filterAgents({
  status: 'active',
  type: 'AI Assistant'
});
```

### 2. 使用适配器

#### Agent发现页面
```typescript
import { unifiedDataAdapter } from './data';

// 搜索Agent
const results = await unifiedDataAdapter.searchAgents({
  page: 1,
  pageSize: 10,
  search: 'AI Assistant'
});

// 获取统计信息
const stats = await unifiedDataAdapter.getStatistics();
```

#### Agent管理页面
```typescript
import { unifiedAgentAdapter } from './data';

// 创建Agent
const agent = await unifiedAgentAdapter.createAgent({
  basicInfo: { /* ... */ },
  apiSpec: { /* ... */ },
  codePackage: { /* ... */ }
});

// 获取Agent列表
const agents = await unifiedAgentAdapter.fetchAgents();

// 更新Agent状态
await unifiedAgentAdapter.updateAgentStatus(agentId, 'inactive');
```

#### 区块链页面
```typescript
import { unifiedBlockchainAdapter } from './data';

// 注册Agent合约
const contract = await unifiedBlockchainAdapter.registerAgentContract({
  contractName: 'Agent合约',
  agentId: 'agent_001',
  agentType: 'AI Assistant',
  // ... 其他字段
});

// 获取合约列表
const contracts = await unifiedBlockchainAdapter.fetchAgentContracts();
```

### 3. 事件监听

```typescript
import { unifiedAgentDataManager } from './data';

// 监听数据变化
const listener = (event) => {
  console.log('数据发生变化:', event.type, event.payload);
};

unifiedAgentDataManager.addEventListener(listener);

// 移除监听
unifiedAgentDataManager.removeEventListener(listener);
```

### 4. 便捷函数

```typescript
import {
  getUnifiedAgents,
  getUnifiedAgentById,
  addUnifiedAgent,
  updateUnifiedAgent,
  deleteUnifiedAgent,
  searchUnifiedAgents,
  filterUnifiedAgents,
  getUnifiedAgentStats
} from './data';

// 获取所有Agent
const agents = getUnifiedAgents();

// 获取统计信息
const stats = getUnifiedAgentStats();

// 搜索Agent
const results = searchUnifiedAgents('关键词');
```

## 🔄 数据同步

统一数据源确保了三个页面之间的数据实时同步：

1. **添加Agent**: 在任一页面添加的Agent会立即在其他页面可见
2. **更新Agent**: 修改Agent信息会实时同步到所有页面
3. **删除Agent**: 删除操作会在所有页面生效
4. **状态变更**: Agent状态变化会立即反映到所有相关页面

## 🧪 测试

运行测试验证功能：

```typescript
import { runUnifiedDataSourceTests } from '../test/unifiedDataSource.test';

// 运行所有测试
const success = await runUnifiedDataSourceTests();
console.log(success ? '✅ 所有测试通过' : '❌ 测试失败');
```

## 🎯 演示

运行演示查看功能：

```typescript
import { runUnifiedDataSourceDemo } from '../demo/unifiedDataSourceDemo';

// 运行演示
await runUnifiedDataSourceDemo();
```

## 📈 性能优化

1. **数据缓存**: 统一数据管理器实现了内存缓存，减少重复计算
2. **事件驱动**: 使用事件机制确保数据同步的实时性
3. **按需加载**: 支持分页和懒加载，提高大数据量下的性能
4. **持久化**: 支持localStorage持久化，页面刷新后数据不丢失

## 🔒 安全性

1. **类型安全**: 使用TypeScript确保类型安全
2. **数据验证**: 在数据转换和存储过程中进行验证
3. **权限控制**: 支持细粒度的权限控制
4. **错误处理**: 完善的错误处理机制

## 📋 迁移指南

### 从旧版本迁移

1. **替换数据源**: 将现有的Mock数据替换为统一数据源
2. **更新Store**: 使用新的统一Store替换旧的Store
3. **适配器模式**: 使用适配器包装现有接口，保持向后兼容
4. **渐进式迁移**: 可以逐步迁移各个页面，不需要一次性完成

### 示例迁移代码

```typescript
// 旧代码
// import { useAgentDiscoveryStore } from '../store/agentDiscoveryStore';
// const store = useAgentDiscoveryStore();

// 新代码
import { useUnifiedAgentDiscoveryStore } from '../store/unifiedAgentDiscoveryStore';
const store = useUnifiedAgentDiscoveryStore();
```

## 🤝 贡献

1. 遵循现有的代码风格和架构模式
2. 添加适当的类型定义和文档
3. 确保新功能有对应的测试用例
4. 提交前运行测试确保功能正常

## 📄 许可证

MIT License