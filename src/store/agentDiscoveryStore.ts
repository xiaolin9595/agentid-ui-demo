import { create } from 'zustand';
import { AgentDiscoveryService } from '../services/agentDiscovery';
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

interface AgentDiscoveryStore {
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
  sidebarCollapsed: boolean;

  // 缓存
  cache: {
    agents: Record<string, AgentDiscoveryItem>;
    searchResults: Record<string, AgentDiscoveryResult>;
    stats: AgentDiscoveryStats | null;
    lastUpdated: Date | null;
  };

  // Actions - 搜索相关
  searchAgents: () => Promise<void>;
  updateSearchParams: (params: Partial<AgentDiscoverySearchParams>) => void;
  clearSearch: () => void;
  addToHistory: (params: AgentDiscoverySearchParams, resultCount: number) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;

  // Actions - Agent选择和详情
  setSelectedAgent: (agent: AgentDiscoveryItem | null) => void;
  toggleAgentSelection: (agent: AgentDiscoveryItem) => void;
  selectAllAgents: () => void;
  clearSelection: () => void;
  getAgentDetails: (agentId: string) => Promise<void>;
  clearAgentDetails: (agentId: string) => void;

  // Actions - 过滤和排序
  setActiveFilters: (filters: Partial<AgentDiscoveryFilterParams>) => void;
  setCurrentSort: (sort: AgentDiscoverySortParams) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  resetSort: () => void;

  // Actions - 统计信息
  fetchStatistics: () => Promise<void>;
  refreshStatistics: () => Promise<void>;

  // Actions - 通信相关
  establishCommunication: (request: AgentCommunicationRequest) => Promise<void>;
  getCommunicationStatus: (agentId: string) => Promise<void>;
  updateCommunicationStatus: (agentId: string, status: AgentCommunicationStatus) => void;
  closeCommunication: (channelId: string) => void;

  // Actions - UI状态
  setViewMode: (mode: 'grid' | 'list' | 'table') => void;
  toggleFilters: () => void;
  toggleAdvancedFilters: () => void;
  toggleSidebar: () => void;

  // Actions - 缓存管理
  updateCache: (agent: AgentDiscoveryItem) => void;
  clearCache: () => void;
  refreshCache: () => void;

  // Actions - 错误处理
  clearErrors: () => void;
  resetStore: () => void;

  // 计算属性
  getFilteredAgents: () => AgentDiscoveryItem[];
  getSelectedAgentsCount: () => number;
  getAverageRating: () => number;
  getTotalConnections: () => number;
  getActiveAgentsCount: () => number;
  getFeaturedAgents: () => AgentDiscoveryItem[];
  getAgentsByCategory: () => Record<string, AgentDiscoveryItem[]>;
  getAgentsByCapability: () => Record<string, AgentDiscoveryItem[]>;
  getSearchSuggestions: (query: string) => string[];
}

export const useAgentDiscoveryStore = create<AgentDiscoveryStore>((set, get) => {
  const service = AgentDiscoveryService.getInstance();

  return {
    // 初始状态
    searchParams: { ...defaultSearchParams },
    searchResults: null,
    isSearching: false,
    searchError: null,
    searchHistory: [],

    selectedAgent: null,
    selectedAgents: [],
    agentDetails: {},
    isLoadingDetails: false,
    detailsError: null,

    activeFilters: { ...defaultFilterParams },
    currentSort: { ...defaultSortParams },
    availableFilters: {
      languages: ['javascript', 'python', 'solidity', 'typescript', 'go', 'rust'],
      capabilities: ['data_processing', 'ai_ml', 'blockchain', 'automation', 'communication'],
      tags: ['AI', 'Automation', 'Blockchain', 'Data Processing', 'Communication'],
      networks: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Optimism']
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
    sidebarCollapsed: false,

    cache: {
      agents: {},
      searchResults: {},
      stats: null,
      lastUpdated: null
    },

    // Actions - 搜索相关
    searchAgents: async () => {
      const state = get();

      set({
        isSearching: true,
        searchError: null
      });

      try {
        const result = await service.searchAgents(
          state.searchParams,
          state.currentSort,
          state.activeFilters
        );

        set({
          searchResults: result,
          isSearching: false
        });

        // 添加到搜索历史
        get().addToHistory(state.searchParams, result.agents.length);

        // 更新缓存
        result.agents.forEach(agent => {
          get().updateCache(agent);
        });
      } catch (error) {
        set({
          isSearching: false,
          searchError: error instanceof Error ? error.message : '搜索失败'
        });
      }
    },

    updateSearchParams: (params) => {
      set((state) => ({
        searchParams: { ...state.searchParams, ...params }
      }));
    },

    clearSearch: () => {
      set({
        searchParams: { ...defaultSearchParams },
        searchResults: null,
        searchError: null
      });
    },

    addToHistory: (params, resultCount) => {
      const historyItem = {
        id: `history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        params: { ...params },
        timestamp: new Date(),
        resultCount
      };

      set((state) => ({
        searchHistory: [historyItem, ...state.searchHistory.slice(0, 9)] // 保留最近10条
      }));
    },

    removeFromHistory: (id) => {
      set((state) => ({
        searchHistory: state.searchHistory.filter(item => item.id !== id)
      }));
    },

    clearHistory: () => {
      set({ searchHistory: [] });
    },

    // Actions - Agent选择和详情
    setSelectedAgent: (agent) => {
      set({ selectedAgent: agent });
    },

    toggleAgentSelection: (agent) => {
      set((state) => {
        const isSelected = state.selectedAgents.some(a => a.id === agent.id);
        if (isSelected) {
          return {
            selectedAgents: state.selectedAgents.filter(a => a.id !== agent.id)
          };
        } else {
          return {
            selectedAgents: [...state.selectedAgents, agent]
          };
        }
      });
    },

    selectAllAgents: () => {
      const state = get();
      if (state.searchResults) {
        set({ selectedAgents: [...state.searchResults.agents] });
      }
    },

    clearSelection: () => {
      set({ selectedAgents: [] });
    },

    getAgentDetails: async (agentId) => {
      set({
        isLoadingDetails: true,
        detailsError: null
      });

      try {
        const details = await service.getAgentDetails(agentId);
        if (details) {
          set((state) => ({
            agentDetails: { ...state.agentDetails, [agentId]: details },
            isLoadingDetails: false
          }));

          // 更新缓存
          get().updateCache(details);
        } else {
          set({
            isLoadingDetails: false,
            detailsError: '未找到Agent详情'
          });
        }
      } catch (error) {
        set({
          isLoadingDetails: false,
          detailsError: error instanceof Error ? error.message : '获取详情失败'
        });
      }
    },

    clearAgentDetails: (agentId) => {
      set((state) => {
        const newDetails = { ...state.agentDetails };
        delete newDetails[agentId];
        return { agentDetails: newDetails };
      });
    },

    // Actions - 过滤和排序
    setActiveFilters: (filters) => {
      set((state) => ({
        activeFilters: { ...state.activeFilters, ...filters }
      }));
    },

    setCurrentSort: (sort) => {
      set({ currentSort: sort });
    },

    clearFilters: () => {
      set({ activeFilters: { ...defaultFilterParams } });
    },

    applyFilters: () => {
      // 触发搜索以应用过滤
      get().searchAgents();
    },

    resetSort: () => {
      set({ currentSort: { ...defaultSortParams } });
    },

    // Actions - 统计信息
    fetchStatistics: async () => {
      set({
        isLoadingStats: true,
        statsError: null
      });

      try {
        const stats = await service.getStatistics();
        set({
          stats,
          isLoadingStats: false,
          cache: {
            ...get().cache,
            stats,
            lastUpdated: new Date()
          }
        });
      } catch (error) {
        set({
          isLoadingStats: false,
          statsError: error instanceof Error ? error.message : '获取统计失败'
        });
      }
    },

    refreshStatistics: async () => {
      // 清除缓存并重新获取
      service.clearCache();
      await get().fetchStatistics();
    },

    // Actions - 通信相关
    establishCommunication: async (request) => {
      set({
        isEstablishingCommunication: true,
        communicationError: null
      });

      try {
        const channel = await service.establishCommunication(request);
        set((state) => ({
          communicationChannels: { ...state.communicationChannels, [channel.id]: channel },
          isEstablishingCommunication: false
        }));

        // 获取通信状态
        await get().getCommunicationStatus(request.agentId);
      } catch (error) {
        set({
          isEstablishingCommunication: false,
          communicationError: error instanceof Error ? error.message : '建立通信失败'
        });
      }
    },

    getCommunicationStatus: async (agentId) => {
      try {
        const status = await service.getCommunicationStatus(agentId);
        set((state) => ({
          communicationStatus: { ...state.communicationStatus, [agentId]: status }
        }));
      } catch (error) {
        console.error('获取通信状态失败:', error);
      }
    },

    updateCommunicationStatus: (agentId, status) => {
      set((state) => ({
        communicationStatus: { ...state.communicationStatus, [agentId]: status }
      }));
    },

    closeCommunication: (channelId) => {
      set((state) => {
        const newChannels = { ...state.communicationChannels };
        delete newChannels[channelId];
        return { communicationChannels: newChannels };
      });
    },

    // Actions - UI状态
    setViewMode: (mode) => {
      set({ viewMode: mode });
    },

    toggleFilters: () => {
      set((state) => ({ showFilters: !state.showFilters }));
    },

    toggleAdvancedFilters: () => {
      set((state) => ({ showAdvancedFilters: !state.showAdvancedFilters }));
    },

    toggleSidebar: () => {
      set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
    },

    // Actions - 缓存管理
    updateCache: (agent) => {
      set((state) => ({
        cache: {
          ...state.cache,
          agents: { ...state.cache.agents, [agent.id]: agent }
        }
      }));
    },

    clearCache: () => {
      set({
        cache: {
          agents: {},
          searchResults: {},
          stats: null,
          lastUpdated: null
        }
      });
      service.clearCache();
    },

    refreshCache: () => {
      get().clearCache();
      get().searchAgents();
      get().fetchStatistics();
    },

    // Actions - 错误处理
    clearErrors: () => {
      set({
        searchError: null,
        detailsError: null,
        statsError: null,
        communicationError: null
      });
    },

    resetStore: () => {
      set({
        searchParams: { ...defaultSearchParams },
        searchResults: null,
        isSearching: false,
        searchError: null,
        searchHistory: [],
        selectedAgent: null,
        selectedAgents: [],
        agentDetails: {},
        isLoadingDetails: false,
        detailsError: null,
        activeFilters: { ...defaultFilterParams },
        currentSort: { ...defaultSortParams },
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
        sidebarCollapsed: false,
        cache: {
          agents: {},
          searchResults: {},
          stats: null,
          lastUpdated: null
        }
      });
    },

    // 计算属性
    getFilteredAgents: () => {
      const state = get();
      if (!state.searchResults) return [];

      return state.searchResults.agents;
    },

    getSelectedAgentsCount: () => {
      return get().selectedAgents.length;
    },

    getAverageRating: () => {
      const state = get();
      if (!state.searchResults) return 0;

      const ratings = state.searchResults.agents.map(agent => agent.rating || 0);
      const sum = ratings.reduce((acc, rating) => acc + rating, 0);
      return ratings.length > 0 ? sum / ratings.length : 0;
    },

    getTotalConnections: () => {
      const state = get();
      if (!state.searchResults) return 0;

      return state.searchResults.agents.reduce((total, agent) => total + (agent.connections || 0), 0);
    },

    getActiveAgentsCount: () => {
      const state = get();
      if (!state.searchResults) return 0;

      return state.searchResults.agents.filter(agent => agent.status === 'active').length;
    },

    getFeaturedAgents: () => {
      const state = get();
      if (!state.searchResults) return [];

      return state.searchResults.agents.filter(agent => agent.isFeatured);
    },

    getAgentsByCategory: () => {
      const state = get();
      if (!state.searchResults) return {};

      const categories: Record<string, AgentDiscoveryItem[]> = {};

      state.searchResults.agents.forEach(agent => {
        const agentCategories = agent.categories || ['Uncategorized'];
        agentCategories.forEach(category => {
          if (!categories[category]) {
            categories[category] = [];
          }
          categories[category].push(agent);
        });
      });

      return categories;
    },

    getAgentsByCapability: () => {
      const state = get();
      if (!state.searchResults) return {};

      const capabilities: Record<string, AgentDiscoveryItem[]> = {};

      state.searchResults.agents.forEach(agent => {
        const agentTags = agent.tags || [];
        agentTags.forEach(tag => {
          if (!capabilities[tag]) {
            capabilities[tag] = [];
          }
          capabilities[tag].push(agent);
        });
      });

      return capabilities;
    },

    getSearchSuggestions: (query) => {
      const state = get();
      if (!query || query.length < 2) return [];

      const suggestions = new Set<string>();
      const lowercaseQuery = query.toLowerCase();

      // 从缓存中获取建议
      Object.values(state.cache.agents).forEach(agent => {
        if (agent.name.toLowerCase().includes(lowercaseQuery)) {
          suggestions.add(agent.name);
        }
        if (agent.description.toLowerCase().includes(lowercaseQuery)) {
          suggestions.add(agent.description.substring(0, 50));
        }
        agent.tags?.forEach(tag => {
          if (tag.toLowerCase().includes(lowercaseQuery)) {
            suggestions.add(tag);
          }
        });
      });

      return Array.from(suggestions).slice(0, 10);
    }
  };
});