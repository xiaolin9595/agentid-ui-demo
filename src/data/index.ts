/**
 * 统一Agent数据源入口文件
 * 提供统一的数据访问接口
 */

export {
  // 类型定义
  type UnifiedAgent,
  type UnifiedAgentContract,
  type UnifiedAgentCapability,
  type UnifiedAgentType,
  type UnifiedPermission,
  type UnifiedUserBindingType,
  type UnifiedBindingStrength,
  type UnifiedVerificationFrequency,
  type UnifiedVerificationStatus,
  type UnifiedAgentStatus,
  type UnifiedBlockchainInfo,
  type UnifiedFaceBiometricFeatures,
  type UnifiedUserBinding,
  type UnifiedAgentConfig,
  type UnifiedAgentStats,
  type UnifiedAgentMetadata,
  type UnifiedDataManagerConfig,
  type AgentEventListener,
  type AgentEvent,
  type AgentEventType,
  type UnifiedAgentDataManager
} from './unifiedAgentTypes';

export {
  // 数据转换器
  AgentDataConverter
} from './agentDataConverter';

export {
  // 数据管理器
  UnifiedAgentDataManagerImpl,
  unifiedAgentDataManager
} from './unifiedAgentDataManager';

// 重新导出为简化使用
export { AgentDataConverter as converter } from './agentDataConverter';
export { unifiedAgentDataManager as dataManager } from './unifiedAgentDataManager';

// 便捷函数
export const getUnifiedAgents = () => unifiedAgentDataManager.getAllAgents();
export const getUnifiedAgentById = (id: string) => unifiedAgentDataManager.getAgentById(id);
export const addUnifiedAgent = (agent: any) => unifiedAgentDataManager.addAgent(agent);
export const updateUnifiedAgent = (id: string, updates: any) => unifiedAgentDataManager.updateAgent(id, updates);
export const deleteUnifiedAgent = (id: string) => unifiedAgentDataManager.deleteAgent(id);
export const searchUnifiedAgents = (query: string) => unifiedAgentDataManager.searchAgents(query);
export const filterUnifiedAgents = (filters: any) => unifiedAgentDataManager.filterAgents(filters);
export const getUnifiedAgentStats = () => unifiedAgentDataManager.getStats();

// 事件监听便捷函数
export const addAgentEventListener = (listener: any) => unifiedAgentDataManager.addEventListener(listener);
export const removeAgentEventListener = (listener: any) => unifiedAgentDataManager.removeEventListener(listener);

// 类型别名便于使用
export type Agent = UnifiedAgent;
export type AgentContract = UnifiedAgentContract;
export type AgentStats = ReturnType<typeof getUnifiedAgentStats>;