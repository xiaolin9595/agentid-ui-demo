import { create } from 'zustand';
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
import { sharedAgentData } from '../mocks/sharedAgentData';
import { generateMockAgentDiscoveryList, mockDiscoveryStats, mockCommunicationStatus } from '../mocks/agentDiscoveryMock';

// 默认搜索参数
const defaultSearchParams: AgentDiscoverySearchParams = {
  query: '',
  page: 1,
  limit: 12
};

// 默认排序参数
const defaultSortParams: AgentDiscoverySortParams = {
  sortBy: 'createdAt',
  sortOrder: 'desc'
};

// 默认筛选参数
const defaultFilterParams: AgentDiscoveryFilterParams = {
  status: [],
  types: [],
  capabilities: [],
  blockchain: false,
  verified: false,
  rating: 0,
  priceRange: [0, 1000]
};

// Store状态类型
interface AgentDiscoveryStore {
  // 搜索状态
  searchParams: AgentDiscoverySearchParams;
  searchResults: AgentDiscoveryResult | null;
  isSearching: boolean;
  searchError: string | null;
  searchHistory: Array<{
    params: AgentDiscoverySearchParams;
    resultCount: number;
    timestamp: Date;
  }>;

  // 排序和筛选状态
  currentSort: AgentDiscoverySortParams;
  activeFilters: AgentDiscoveryFilterParams;
  viewMode: 'grid' | 'list' | 'table';
  showFilters: boolean;
  showAdvancedFilters: boolean;

  // 统计状态
  stats: AgentDiscoveryStats | null;
  isLoadingStats: boolean;
  statsError: string | null;

  // 通信状态
  communicationChannels: Record<string, AgentCommunicationChannel>;

  // 动作
  setSearchParams: (params: Partial<AgentDiscoverySearchParams>) => void;
  setSortParams: (params: Partial<AgentDiscoverySortParams>) => void;
  setFilters: (filters: Partial<AgentDiscoveryFilterParams>) => void;
  setViewMode: (mode: 'grid' | 'list' | 'table') => void;
  toggleFilters: () => void;
  toggleAdvancedFilters: () => void;
  searchAgents: () => Promise<void>;
  fetchStatistics: () => Promise<void>;
  clearErrors: () => void;
  addToHistory: (params: AgentDiscoverySearchParams, resultCount: number) => void;
  clearHistory: () => void;
  updateCommunicationStatus: (agentId: string, status: AgentCommunicationStatus) => void;

  // 计算属性
  getFilteredAgents: () => AgentDiscoveryItem[];
  getSelectedAgentsCount: () => number;
  getAverageRating: () => number;
  getTotalConnections: () => number;
  getActiveAgentsCount: () => number;
}

export const useAgentDiscoveryStore = create<AgentDiscoveryStore>((set, get) => {
  return {
    // 初始状态
    searchParams: { ...defaultSearchParams },
    searchResults: null,
    isSearching: false,
    searchError: null,
    searchHistory: [],

    currentSort: { ...defaultSortParams },
    activeFilters: { ...defaultFilterParams },
    viewMode: 'grid',
    showFilters: false,
    showAdvancedFilters: false,

    stats: null,
    isLoadingStats: false,
    statsError: null,

    communicationChannels: {},

    // 动作实现
    setSearchParams: (params) => {
      set((state) => ({
        searchParams: { ...state.searchParams, ...params }
      }));
    },

    setSortParams: (params) => {
      set((state) => ({
        currentSort: { ...state.currentSort, ...params }
      }));
    },

    setFilters: (filters) => {
      set((state) => ({
        activeFilters: { ...state.activeFilters, ...filters }
      }));
    },

    setViewMode: (mode) => {
      set({ viewMode: mode });
    },

    toggleFilters: () => {
      set((state) => ({ showFilters: !state.showFilters }));
    },

    toggleAdvancedFilters: () => {
      set((state) => ({ showAdvancedFilters: !state.showAdvancedFilters }));
    },

    searchAgents: async () => {
      const state = get();
      set({
        isSearching: true,
        searchError: null
      });

      try {
        // 模拟搜索延迟
        await new Promise(resolve => setTimeout(resolve, 500));

        // 生成模拟搜索结果
        const agents = generateMockAgentDiscoveryList();
        const result: AgentDiscoveryResult = {
          agents: agents,
          total: agents.length,
          page: state.searchParams.page,
          limit: state.searchParams.limit,
          totalPages: Math.ceil(agents.length / state.searchParams.limit),
          hasMore: state.searchParams.page * state.searchParams.limit < agents.length
        };

        set({
          searchResults: result,
          isSearching: false
        });

        // 添加到搜索历史
        get().addToHistory(state.searchParams, result.agents.length);
      } catch (error) {
        set({
          isSearching: false,
          searchError: error instanceof Error ? error.message : '搜索失败'
        });
      }
    },

    fetchStatistics: async () => {
      set({
        isLoadingStats: true,
        statsError: null
      });

      try {
        // 模拟加载延迟
        await new Promise(resolve => setTimeout(resolve, 300));

        set({
          stats: mockDiscoveryStats,
          isLoadingStats: false
        });
      } catch (error) {
        set({
          isLoadingStats: false,
          statsError: error instanceof Error ? error.message : '获取统计数据失败'
        });
      }
    },

    clearErrors: () => {
      set({
        searchError: null,
        statsError: null
      });
    },

    addToHistory: (params, resultCount) => {
      set((state) => ({
        searchHistory: [
          {
            params,
            resultCount,
            timestamp: new Date()
          },
          ...state.searchHistory.slice(0, 9) // 保留最近10条
        ]
      }));
    },

    clearHistory: () => {
      set({ searchHistory: [] });
    },

    updateCommunicationStatus: (agentId, status) => {
      set((state) => ({
        communicationChannels: {
          ...state.communicationChannels,
          [agentId]: status
        }
      }));
    },

    // 计算属性
    getFilteredAgents: () => {
      const state = get();
      if (!state.searchResults) {
        return [];
      }
      return state.searchResults.agents;
    },

    getSelectedAgentsCount: () => {
      return 0; // 简化实现
    },

    getAverageRating: () => {
      const state = get();
      if (!state.searchResults) {
        return 0;
      }
      const agents = state.searchResults.agents;
      if (agents.length === 0) {
        return 0;
      }
      const totalRating = agents.reduce((sum, agent) => sum + (agent.rating || 0), 0);
      return totalRating / agents.length;
    },

    getTotalConnections: () => {
      const state = get();
      if (!state.searchResults) {
        return 0;
      }
      return state.searchResults.agents.reduce((sum, agent) => sum + (agent.connections || 0), 0);
    },

    getActiveAgentsCount: () => {
      const state = get();
      if (!state.searchResults) {
        return 0;
      }
      return state.searchResults.agents.filter(agent => agent.status === 'active').length;
    }
  };
});