// Agent Discovery 组件导出
import { DebouncedSearchInput } from './DebouncedSearchInput';
import { AgentDiscoverySearch } from './AgentDiscoverySearch';
import { AgentDiscoveryFilters } from './AgentDiscoveryFilters';
import { AgentDiscoverySort } from './AgentDiscoverySort';
import { AgentDiscoverySearchHistory } from './AgentDiscoverySearchHistory';

// 结果展示组件
import { AgentDiscoveryCard } from './AgentDiscoveryCard';
import { AgentDiscoveryList } from './AgentDiscoveryList';
import { AgentDiscoveryItem } from './AgentDiscoveryItem';
import { AgentDiscoveryStats } from './AgentDiscoveryStats';
import { AgentDiscoveryEmpty } from './AgentDiscoveryEmpty';
import { AgentDiscoveryPagination } from './AgentDiscoveryPagination';

// 通信组件
import { AgentDiscoveryCommunicationPanel } from './AgentDiscoveryCommunicationPanel';
import { AgentCommunicationModal } from './AgentCommunicationModal';
import { AgentCommunicationStatus as AgentCommunicationStatusComponent } from './AgentCommunicationStatus';
import { AgentCommunicationHistory } from './AgentCommunicationHistory';
import { AgentCommunicationTypes } from './AgentCommunicationTypes';

// 类型定义
export type {
  AgentDiscoverySearchParams,
  AgentDiscoverySortParams,
  AgentDiscoveryFilterParams,
  AgentDiscoveryItem as AgentDiscoveryItemType,
  AgentDiscoveryResult,
  AgentDiscoveryStats as AgentDiscoveryStatsType,
  AgentCommunicationRequest,
  AgentCommunicationChannel,
  AgentCommunicationStatus as AgentCommunicationStatusType,
  AgentBlockchainInfo,
  AgentContractInfo,
} from '@/types/agent-discovery';

// 组件导出
export {
  DebouncedSearchInput,
  AgentDiscoverySearch,
  AgentDiscoveryFilters,
  AgentDiscoverySort,
  AgentDiscoverySearchHistory,
  // 结果展示组件
  AgentDiscoveryCard,
  AgentDiscoveryList,
  AgentDiscoveryItem,
  AgentDiscoveryStats,
  AgentDiscoveryEmpty,
  AgentDiscoveryPagination,
  // 通信组件
  AgentDiscoveryCommunicationPanel,
  AgentCommunicationModal,
  AgentCommunicationStatusComponent,
  AgentCommunicationHistory,
  AgentCommunicationTypes,
};

// 默认导出
const AgentDiscoveryComponents = {
  DebouncedSearchInput,
  AgentDiscoverySearch,
  AgentDiscoveryFilters,
  AgentDiscoverySort,
  AgentDiscoverySearchHistory,
  // 结果展示组件
  AgentDiscoveryCard,
  AgentDiscoveryList,
  AgentDiscoveryItem,
  AgentDiscoveryStats,
  AgentDiscoveryEmpty,
  AgentDiscoveryPagination,
  // 通信组件
  AgentDiscoveryCommunicationPanel,
  AgentCommunicationModal,
  AgentCommunicationStatusComponent,
  AgentCommunicationHistory,
  AgentCommunicationTypes,
};

export default AgentDiscoveryComponents;