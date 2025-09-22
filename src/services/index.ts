/**
 * 服务层统一导出文件
 */

// 导出Agent发现服务
import { AgentDiscoveryService } from './agentDiscovery';
export { AgentDiscoveryService };
export type {
  AgentDiscoverySearchParams,
  AgentDiscoverySortParams,
  AgentDiscoveryFilterParams,
  AgentDiscoveryItem,
  AgentDiscoveryResult,
  AgentDiscoveryStats,
  AgentCommunicationRequest,
  AgentCommunicationChannel,
  AgentCommunicationStatus,
  AgentBlockchainInfo,
  AgentContractInfo
} from '../types/agent-discovery';

// 导出服务实例
export const agentDiscoveryService = AgentDiscoveryService.getInstance();

// 导出模拟数据（仅用于开发环境）
// 注意：在TypeScript中，条件导出需要在顶层，所以我们直接导出，使用时注意环境
export {
  mockBaseAgents,
  mockBlockchainAgents,
  mockAgentContracts,
  mockDiscoveryStats,
  mockCommunicationStatuses,
  generateMockAgentDiscoveryList
} from '../mocks/agentDiscoveryMock';