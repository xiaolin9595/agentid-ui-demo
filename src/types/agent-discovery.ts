import { Agent, AgentPermission, AgentPaginationParams } from './agent';
import { BlockchainAgent, AgentCapability, AgentContractPermission } from './blockchain';

// 搜索参数类型
export interface AgentDiscoverySearchParams extends AgentPaginationParams {
  search?: string;
  capabilities?: AgentCapability[];
  userId?: string;
  role?: string;
  status?: Agent['status'] | BlockchainAgent['status'];
  blockchainStatus?: string;
  type?: BlockchainAgent['type'];
  language?: string;
  minRating?: number;
  maxRating?: number;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  tags?: string[];
  securityLevel?: 'low' | 'medium' | 'high';
  permissions?: AgentPermission[];
  contractPermissions?: AgentContractPermission[];
}

// 排序参数
export interface AgentDiscoverySortParams {
  field: 'name' | 'createdAt' | 'updatedAt' | 'rating' | 'status' | 'type' | 'capabilities' | 'codeSize' | 'connections';
  order: 'asc' | 'desc';
}

// 过滤参数
export interface AgentDiscoveryFilterParams {
  statuses?: Array<Agent['status'] | BlockchainAgent['status']>;
  types?: BlockchainAgent['type'][];
  languages?: string[];
  capabilities?: AgentCapability[];
  ratingRange?: {
    min: number;
    max: number;
  };
  codeSizeRange?: {
    min: number;
    max: number;
  };
  hasContract?: boolean;
  isVerified?: boolean;
  isActive?: boolean;
  tags?: string[];
  owners?: string[];
  networks?: string[];
}

// 扩展的Agent信息
export interface AgentDiscoveryItem extends Omit<Agent, 'description'> {
  // 基础字段重新定义以避免冲突
  description: string;

  // 区块链相关信息
  blockchainInfo?: AgentBlockchainInfo;
  contractInfo?: AgentContractInfo;

  // 发现功能特有字段
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  isVerified?: boolean;
  isFeatured?: boolean;
  popularity?: number;
  connections?: number;
  responseTime?: number;
  uptime?: number;
  lastActivity?: Date;
  categories?: string[];
  apiEndpoint?: string;
  model?: string;
  version?: string;

  // 统计信息
  stats?: {
    totalCalls: number;
    successRate: number;
    averageResponseTime: number;
    errorRate: number;
    uptimePercentage: number;
  };

  // 元数据
  metadata?: {
    website?: string;
    documentation?: string;
    github?: string;
    socialLinks?: {
      twitter?: string;
      linkedin?: string;
      discord?: string;
    };
    pricing?: {
      type: 'free' | 'paid' | 'freemium';
      price?: number;
      currency?: string;
    };
  };
}

// 区块链上的Agent信息
export interface AgentBlockchainInfo {
  contractAddress?: string;
  network?: string;
  blockNumber?: number;
  transactionHash?: string;
  gasUsed?: number;
  isOnChain: boolean;
  verificationStatus: 'verified' | 'pending' | 'failed' | 'unverified';
  verificationDate?: Date;
  chainId?: number;
  lastSyncedAt?: Date;
  syncStatus: 'synced' | 'syncing' | 'failed';
}

// 合约信息
export interface AgentContractInfo {
  contractAddress: string;
  contractName: string;
  ownerAddress: string;
  permissions: AgentContractPermission;
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'active' | 'suspended' | 'terminated';
  metadata: {
    tags: string[];
    description?: string;
    securityLevel: 'low' | 'medium' | 'high';
    compliance: string[];
  };
  blockchain: {
    network: string;
    blockNumber: number;
    transactionHash: string;
    gasUsed: number;
  };
}

// 搜索结果
export interface AgentDiscoveryResult {
  agents: AgentDiscoveryItem[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  sort: AgentDiscoverySortParams;
  filters: AgentDiscoveryFilterParams;
  searchTime: number;
  queryId?: string;
}

// 统计信息
export interface AgentDiscoveryStats {
  totalAgents: number;
  activeAgents: number;
  inactiveAgents: number;
  verifiedAgents: number;
  featuredAgents: number;
  averageRating: number;
  totalConnections: number;
  topCapabilities: Array<{
    capability: AgentCapability;
    count: number;
    percentage: number;
  }>;
  topTypes: Array<{
    type: BlockchainAgent['type'];
    count: number;
    percentage: number;
  }>;
  networkDistribution: Array<{
    network: string;
    count: number;
    percentage: number;
  }>;
  statusDistribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  dailyStats: Array<{
    date: string;
    newAgents: number;
    activeAgents: number;
    totalCalls: number;
  }>;
}

// 通信相关类型
export interface AgentCommunicationRequest {
  agentId: string;
  type: 'message' | 'call' | 'data_request' | 'command';
  payload: any;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timeout?: number;
  requiresResponse?: boolean;
  metadata?: {
    userId?: string;
    sessionId?: string;
    requestId?: string;
    tags?: string[];
  };
}

export interface AgentCommunicationChannel {
  id: string;
  name: string;
  type: 'websocket' | 'http' | 'grpc' | 'mqtt' | 'custom';
  endpoint: string;
  protocol: string;
  status: 'connected' | 'disconnected' | 'error' | 'connecting';
  lastConnected?: Date;
  supportedMethods: string[];
  security: {
    authentication: 'none' | 'api_key' | 'oauth' | 'jwt' | 'certificate';
    encryption: 'none' | 'tls' | 'ssl' | 'custom';
    authorization: string[];
  };
}

export interface AgentCommunicationStatus {
  status: 'idle' | 'busy' | 'offline' | 'error';
  currentLoad?: number;
  maxCapacity?: number;
  responseTime?: number;
  lastActivity?: Date;
  error?: string;
  channels: AgentCommunicationChannel[];
}

// Store状态类型
export interface AgentDiscoveryState {
  // 搜索状态
  searchParams: AgentDiscoverySearchParams;
  searchResults: AgentDiscoveryResult | null;
  isSearching: boolean;
  searchError: string | null;

  // 选中状态
  selectedAgent: AgentDiscoveryItem | null;
  selectedAgents: AgentDiscoveryItem[];

  // 过滤和排序
  activeFilters: AgentDiscoveryFilterParams;
  currentSort: AgentDiscoverySortParams;

  // 统计信息
  stats: AgentDiscoveryStats | null;
  isLoadingStats: boolean;
  statsError: string | null;

  // 通信状态
  communicationStatus: Record<string, AgentCommunicationStatus>;

  // UI状态
  viewMode: 'grid' | 'list' | 'table';
  showFilters: boolean;
  showAdvancedFilters: boolean;

  // 缓存
  cache: {
    agents: Record<string, AgentDiscoveryItem>;
    stats: AgentDiscoveryStats | null;
    lastUpdated: Date | null;
  };
}

// Action类型
export type AgentDiscoveryAction =
  | { type: 'SET_SEARCH_PARAMS'; payload: AgentDiscoverySearchParams }
  | { type: 'SET_SEARCH_RESULTS'; payload: AgentDiscoveryResult }
  | { type: 'SET_SEARCHING'; payload: boolean }
  | { type: 'SET_SEARCH_ERROR'; payload: string | null }
  | { type: 'SET_SELECTED_AGENT'; payload: AgentDiscoveryItem | null }
  | { type: 'SET_SELECTED_AGENTS'; payload: AgentDiscoveryItem[] }
  | { type: 'ADD_SELECTED_AGENT'; payload: AgentDiscoveryItem }
  | { type: 'REMOVE_SELECTED_AGENT'; payload: string }
  | { type: 'CLEAR_SELECTED_AGENTS' }
  | { type: 'SET_ACTIVE_FILTERS'; payload: AgentDiscoveryFilterParams }
  | { type: 'SET_CURRENT_SORT'; payload: AgentDiscoverySortParams }
  | { type: 'SET_STATS'; payload: AgentDiscoveryStats }
  | { type: 'SET_LOADING_STATS'; payload: boolean }
  | { type: 'SET_STATS_ERROR'; payload: string | null }
  | { type: 'SET_COMMUNICATION_STATUS'; payload: { agentId: string; status: AgentCommunicationStatus } }
  | { type: 'SET_VIEW_MODE'; payload: 'grid' | 'list' | 'table' }
  | { type: 'SET_SHOW_FILTERS'; payload: boolean }
  | { type: 'SET_SHOW_ADVANCED_FILTERS'; payload: boolean }
  | { type: 'UPDATE_CACHE'; payload: { agent: AgentDiscoveryItem } }
  | { type: 'CLEAR_CACHE' }
  | { type: 'RESET_STATE' };

// 导出类型
export type {
  Agent,
  AgentPermission,
  AgentPaginationParams,
  BlockchainAgent,
  AgentCapability,
  AgentContractPermission
};