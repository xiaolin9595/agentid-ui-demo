import { create } from 'zustand';
import { unifiedDataAdapter } from '../data/unifiedDataAdapter';
import {
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

// 默认搜索参数
const defaultSearchParams: AgentDiscoverySearchParams = {
  page: 1,
  pageSize: 12,
  search: '',
  capabilities: [],
  role: undefined,
  userId: undefined,
  status: undefined,
  type: undefined,
  language: undefined,
  minRating: undefined,
  maxRating: undefined,
  tags: [],
  securityLevel: undefined,
  permissions: [],
  contractPermissions: []
};

// 默认排序参数
const defaultSortParams: AgentDiscoverySortParams = {
  field: 'createdAt',
  order: 'desc'
};

// 默认过滤参数
const defaultFilterParams: AgentDiscoveryFilterParams = {
  statuses: [],
  types: [],
  languages: [],
  capabilities: [],
  roles: [],
  ratingRange: { min: 0, max: 5 },
  codeSizeRange: { min: 0, max: 10000000 },
  hasContract: undefined,
  isVerified: undefined,
  isActive: undefined,
  tags: [],
  owners: [],
  networks: []
};

interface UnifiedAgentDiscoveryStore {
  // 搜索状态
  searchParams: AgentDiscoverySearchParams;
  searchResults: AgentDiscoveryResult | null;
  isSearching: boolean;
  searchError: string | null;
  searchHistory: Array<{
    id: string;
    params: AgentDiscoverySearchParams;
    timestamp: Date;
    resultCount: number;
  }>;

  // 选中状态
  selectedAgent: AgentDiscoveryItem | null;
  selectedAgents: AgentDiscoveryItem[];
  agentDetails: Record<string, AgentDiscoveryItem>;
  isLoadingDetails: boolean;
  detailsError: string | null;

  // 过滤和排序
  activeFilters: AgentDiscoveryFilterParams;
  currentSort: AgentDiscoverySortParams;
  availableFilters: {
    languages: string[];
    capabilities: string[];
    tags: string[];
    networks: string[];
  };

  // 统计信息
  stats: AgentDiscoveryStats | null;
  isLoadingStats: boolean;
  statsError: string | null;

  // 通信状态
  communicationStatus: Record<string, AgentCommunicationStatus>;
  communicationChannels: Record<string, AgentCommunicationChannel>;
  isEstablishingCommunication: boolean;
  communicationError: string | null;

  // UI状态
  viewMode: 'grid' | 'list' | 'table';
  showFilters: boolean;
  showAdvancedFilters: boolean;
  showCommunicationPanel: boolean;
  showSearchHistory: boolean;
  isInitializing: boolean;

  // Actions
  // 搜索相关
  setSearchParams: (params: Partial<AgentDiscoverySearchParams>) => void;
  searchAgents: () => Promise<void>;
  clearSearch: () => void;
  addToSearchHistory: (params: AgentDiscoverySearchParams, resultCount: number) => void;
  clearSearchHistory: () => void;

  // 选中相关
  setSelectedAgent: (agent: AgentDiscoveryItem | null) => void;
  setSelectedAgents: (agents: AgentDiscoveryItem[]) => void;
  toggleAgentSelection: (agent: AgentDiscoveryItem) => void;
  selectAllAgents: () => void;
  clearSelection: () => void;
  fetchAgentDetails: (agentId: string) => Promise<void>;

  // 过滤和排序
  setActiveFilters: (filters: Partial<AgentDiscoveryFilterParams>) => void;
  setCurrentSort: (sort: AgentDiscoverySortParams) => void;
  clearFilters: () => void;
  applyFilters: () => void;

  // 统计相关
  fetchStatistics: () => Promise<void>;

  // 通信相关
  fetchCommunicationStatus: (agentId: string) => Promise<void>;
  establishCommunication: (agentId: string, request: AgentCommunicationRequest) => Promise<void>;
  closeCommunication: (agentId: string) => void;

  // UI相关
  setViewMode: (mode: 'grid' | 'list' | 'table') => void;
  toggleFilters: () => void;
  toggleAdvancedFilters: () => void;
  toggleCommunicationPanel: () => void;
  toggleSearchHistory: () => void;

  // 数据操作
  addAgent: (agentData: any) => Promise<void>;
  updateAgent: (agentId: string, updates: any) => Promise<void>;
  deleteAgent: (agentId: string) => Promise<void>;

  // 计算属性
  getFilteredAgents: () => AgentDiscoveryItem[];
  getSelectedAgentsCount: () => number;
  getAverageRating: () => number;
  getTotalConnections: () => number;
  getActiveAgentsCount: () => number;

  // 错误处理
  clearErrors: () => void;
  reset: () => void;
}

export const useUnifiedAgentDiscoveryStore = create<UnifiedAgentDiscoveryStore>((set, get) => ({
  // 初始状态
  searchParams: defaultSearchParams,
  searchResults: null,
  isSearching: false,
  searchError: null,
  searchHistory: [],

  selectedAgent: null,
  selectedAgents: [],
  agentDetails: {},
  isLoadingDetails: false,
  detailsError: null,

  activeFilters: defaultFilterParams,
  currentSort: defaultSortParams,
  availableFilters: {
    languages: [],
    capabilities: [],
    tags: [],
    networks: []
  },

  stats: null,
  isLoadingStats: false,
  statsError: null,

  communicationStatus: {},
  communicationChannels: {},
  isEstablishingCommunication: false,
  communicationError: null,

  viewMode: 'grid',
  showFilters: false,
  showAdvancedFilters: false,
  showCommunicationPanel: false,
  showSearchHistory: false,
  isInitializing: true,

  // Actions
  setSearchParams: (params) => set((state) => ({
    searchParams: { ...state.searchParams, ...params }
  })),

  searchAgents: async () => {
    const state = get();
    set({ isSearching: true, searchError: null });

    try {
      const result = await unifiedDataAdapter.searchAgents(state.searchParams);
      set({
        searchResults: result,
        isSearching: false,
        searchError: null
      });

      // 添加到搜索历史
      get().addToSearchHistory(state.searchParams, result.agents.length);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '搜索失败';
      set({
        isSearching: false,
        searchError: errorMessage
      });
    }
  },

  clearSearch: () => set({
    searchParams: defaultSearchParams,
    searchResults: null,
    searchError: null
  }),

  addToSearchHistory: (params, resultCount) => set((state) => {
    const newHistory = [
      {
        id: `search_${Date.now()}`,
        params,
        timestamp: new Date(),
        resultCount
      },
      ...state.searchHistory.slice(0, 9) // 保留最近10条
    ];
    return { searchHistory: newHistory };
  }),

  clearSearchHistory: () => set({ searchHistory: [] }),

  setSelectedAgent: (agent) => set({ selectedAgent: agent }),

  setSelectedAgents: (agents) => set({ selectedAgents: agents }),

  toggleAgentSelection: (agent) => set((state) => {
    const isSelected = state.selectedAgents.some(a => a.id === agent.id);
    const selectedAgents = isSelected
      ? state.selectedAgents.filter(a => a.id !== agent.id)
      : [...state.selectedAgents, agent];
    return { selectedAgents };
  }),

  selectAllAgents: () => set((state) => {
    const agents = state.searchResults?.agents || [];
    return { selectedAgents: [...agents] };
  }),

  clearSelection: () => set({ selectedAgents: [] }),

  fetchAgentDetails: async (agentId) => {
    set({ isLoadingDetails: true, detailsError: null });

    try {
      const agent = await unifiedDataAdapter.getAgentDetails(agentId);
      if (agent) {
        set((state) => ({
          agentDetails: { ...state.agentDetails, [agentId]: agent },
          isLoadingDetails: false
        }));
      } else {
        set({
          isLoadingDetails: false,
          detailsError: 'Agent not found'
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取Agent详情失败';
      set({
        isLoadingDetails: false,
        detailsError: errorMessage
      });
    }
  },

  setActiveFilters: (filters) => set((state) => ({
    activeFilters: { ...state.activeFilters, ...filters }
  })),

  setCurrentSort: (sort) => set({ currentSort: sort }),

  clearFilters: () => set({ activeFilters: defaultFilterParams }),

  applyFilters: () => {
    const state = get();
    const newSearchParams: Partial<AgentDiscoverySearchParams> = {};

    // 将过滤条件转换为搜索参数
    if (state.activeFilters.statuses.length > 0) {
      newSearchParams.status = state.activeFilters.statuses[0];
    }
    if (state.activeFilters.types.length > 0) {
      newSearchParams.type = state.activeFilters.types[0];
    }
    if (state.activeFilters.capabilities.length > 0) {
      newSearchParams.capabilities = state.activeFilters.capabilities;
    }
    if (state.activeFilters.isVerified !== undefined) {
      newSearchParams.isVerified = state.activeFilters.isVerified;
    }

    get().setSearchParams(newSearchParams);
    get().searchAgents();
  },

  fetchStatistics: async () => {
    set({ isLoadingStats: true, statsError: null });

    try {
      const stats = await unifiedDataAdapter.getStatistics();
      set({
        stats,
        isLoadingStats: false,
        statsError: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取统计信息失败';
      set({
        isLoadingStats: false,
        statsError: errorMessage
      });
    }
  },

  fetchCommunicationStatus: async (agentId) => {
    try {
      const status = await unifiedDataAdapter.getCommunicationStatus(agentId);
      if (status) {
        set((state) => ({
          communicationStatus: { ...state.communicationStatus, [agentId]: status }
        }));
      }
    } catch (error) {
      console.error('Failed to fetch communication status:', error);
    }
  },

  establishCommunication: async (agentId, request) => {
    set({ isEstablishingCommunication: true, communicationError: null });

    try {
      const result = await unifiedDataAdapter.establishCommunication(agentId, request);
      set({
        isEstablishingCommunication: false,
        communicationError: null
      });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '建立通信失败';
      set({
        isEstablishingCommunication: false,
        communicationError: errorMessage
      });
      throw error;
    }
  },

  closeCommunication: (agentId) => set((state) => {
    const newCommunicationStatus = { ...state.communicationStatus };
    delete newCommunicationStatus[agentId];
    return { communicationStatus: newCommunicationStatus };
  }),

  setViewMode: (mode) => set({ viewMode: mode }),

  toggleFilters: () => set((state) => ({ showFilters: !state.showFilters })),

  toggleAdvancedFilters: () => set((state) => ({
    showAdvancedFilters: !state.showAdvancedFilters
  })),

  toggleCommunicationPanel: () => set((state) => ({
    showCommunicationPanel: !state.showCommunicationPanel
  })),

  toggleSearchHistory: () => set((state) => ({
    showSearchHistory: !state.showSearchHistory
  })),

  addAgent: async (agentData) => {
    try {
      await unifiedDataAdapter.addAgent(agentData);
      get().searchAgents(); // 刷新搜索结果
      get().fetchStatistics(); // 刷新统计信息
    } catch (error) {
      console.error('Failed to add agent:', error);
      throw error;
    }
  },

  updateAgent: async (agentId, updates) => {
    try {
      await unifiedDataAdapter.updateAgent(agentId, updates);
      get().searchAgents(); // 刷新搜索结果
      get().fetchStatistics(); // 刷新统计信息
    } catch (error) {
      console.error('Failed to update agent:', error);
      throw error;
    }
  },

  deleteAgent: async (agentId) => {
    try {
      await unifiedDataAdapter.deleteAgent(agentId);
      get().searchAgents(); // 刷新搜索结果
      get().fetchStatistics(); // 刷新统计信息
    } catch (error) {
      console.error('Failed to delete agent:', error);
      throw error;
    }
  },

  // 计算属性
  getFilteredAgents: () => {
    const state = get();
    return state.searchResults?.agents || [];
  },

  getSelectedAgentsCount: () => {
    const state = get();
    return state.selectedAgents.length;
  },

  getAverageRating: () => {
    const state = get();
    const agents = state.searchResults?.agents || [];
    if (agents.length === 0) return 0;
    const totalRating = agents.reduce((sum, agent) => sum + (agent.rating || 0), 0);
    return Math.round((totalRating / agents.length) * 10) / 10;
  },

  getTotalConnections: () => {
    const state = get();
    const agents = state.searchResults?.agents || [];
    return agents.reduce((sum, agent) => sum + (agent.connections || 0), 0);
  },

  getActiveAgentsCount: () => {
    const state = get();
    const agents = state.searchResults?.agents || [];
    return agents.filter(agent => agent.status === 'active').length;
  },

  clearErrors: () => set({
    searchError: null,
    detailsError: null,
    statsError: null,
    communicationError: null
  }),

  reset: () => set({
    searchParams: defaultSearchParams,
    searchResults: null,
    isSearching: false,
    searchError: null,
    searchHistory: [],
    selectedAgent: null,
    selectedAgents: [],
    agentDetails: {},
    isLoadingDetails: false,
    detailsError: null,
    activeFilters: defaultFilterParams,
    currentSort: defaultSortParams,
    stats: null,
    isLoadingStats: false,
    statsError: null,
    communicationStatus: {},
    communicationChannels: {},
    isEstablishingCommunication: false,
    communicationError: null,
    viewMode: 'grid',
    showFilters: false,
    showAdvancedFilters: false,
    showCommunicationPanel: false,
    showSearchHistory: false,
    isInitializing: false
  })
}));