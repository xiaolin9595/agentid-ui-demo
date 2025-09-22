import { create } from 'zustand';
import { unifiedAgentAdapter } from '../data/unifiedAgentAdapter';
import { Agent, AgentMetrics, AgentPaginationParams, AgentFilterParams, AgentSortParams } from '../types/agent';
import { AgentCreateInfo, AgentApiSpec, AgentCodePackage } from '../types/agent-upload';

interface UnifiedAgentState {
  // Agent数据
  agents: Agent[];
  selectedAgent: Agent | null;
  agentMetrics: Record<string, AgentMetrics>;

  // 分页和过滤
  pagination: AgentPaginationParams;
  filters: AgentFilterParams;
  sort: AgentSortParams | null;

  // UI状态
  loading: boolean;
  error: string | null;
  isCreating: boolean;

  // Actions
  setAgents: (agents: Agent[]) => void;
  setSelectedAgent: (agent: Agent | null) => void;
  setAgentMetrics: (agentId: string, metrics: AgentMetrics) => void;
  setPagination: (pagination: AgentPaginationParams) => void;
  setFilters: (filters: AgentFilterParams) => void;
  setSort: (sort: AgentSortParams | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setIsCreating: (isCreating: boolean) => void;
  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  removeAgent: (id: string) => void;
  clearFilters: () => void;
  createAgent: (agentData: {
    basicInfo: AgentCreateInfo;
    apiSpec: AgentApiSpec;
    codePackage: AgentCodePackage;
  }) => Promise<Agent>;
  fetchAgents: () => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
  updateAgentStatus: (id: string, status: 'active' | 'inactive' | 'stopped' | 'error') => Promise<void>;
  clearError: () => void;
}

const defaultPagination: AgentPaginationParams = {
  page: 1,
  pageSize: 10
};

export const useUnifiedAgentStore = create<UnifiedAgentState>((set, get) => ({
  // 初始状态
  agents: [],
  selectedAgent: null,
  agentMetrics: {},
  pagination: defaultPagination,
  filters: {},
  sort: null,
  loading: false,
  error: null,
  isCreating: false,

  // Actions
  setAgents: (agents) => set({ agents }),

  setSelectedAgent: (agent) => set({ selectedAgent: agent }),

  setAgentMetrics: (agentId, metrics) => set((state) => ({
    agentMetrics: { ...state.agentMetrics, [agentId]: metrics }
  })),

  setPagination: (pagination) => set({ pagination }),

  setFilters: (filters) => set({ filters }),

  setSort: (sort) => set({ sort }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setIsCreating: (isCreating) => set({ isCreating }),

  addAgent: (agent) => set((state) => ({
    agents: [agent, ...state.agents]
  })),

  updateAgent: (id, updates) => set((state) => ({
    agents: state.agents.map(agent =>
      agent.id === id ? { ...agent, ...updates } : agent
    ),
    selectedAgent: state.selectedAgent?.id === id
      ? { ...state.selectedAgent, ...updates }
      : state.selectedAgent
  })),

  removeAgent: (id) => set((state) => ({
    agents: state.agents.filter(agent => agent.id !== id),
    selectedAgent: state.selectedAgent?.id === id ? null : state.selectedAgent
  })),

  clearFilters: () => set({
    filters: {},
    sort: null,
    pagination: defaultPagination
  }),

  createAgent: async (agentData) => {
    const state = get();
    set({ isCreating: true, error: null });

    try {
      const newAgent = await unifiedAgentAdapter.createAgent(agentData);

      set((state) => ({
        agents: [newAgent, ...state.agents],
        selectedAgent: newAgent,
        isCreating: false,
        error: null
      }));

      return newAgent;
    } catch (error) {
      set({
        isCreating: false,
        error: error instanceof Error ? error.message : '创建Agent失败'
      });
      throw error;
    }
  },

  fetchAgents: async () => {
    set({ loading: true, error: null });

    try {
      const agents = await unifiedAgentAdapter.fetchAgents();
      set({ agents, loading: false, error: null });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : '获取Agent列表失败'
      });
    }
  },

  deleteAgent: async (id: string) => {
    set({ loading: true, error: null });

    try {
      await unifiedAgentAdapter.deleteAgent(id);
      set((state) => ({
        agents: state.agents.filter(agent => agent.id !== id),
        selectedAgent: state.selectedAgent?.id === id ? null : state.selectedAgent,
        loading: false,
        error: null
      }));
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : '删除Agent失败'
      });
      throw error;
    }
  },

  updateAgentStatus: async (id: string, status: 'active' | 'inactive' | 'stopped' | 'error') => {
    set({ loading: true, error: null });

    try {
      await unifiedAgentAdapter.updateAgentStatus(id, status);
      set((state) => ({
        agents: state.agents.map(agent =>
          agent.id === id ? { ...agent, updatedAt: new Date().toISOString() } : agent
        ),
        selectedAgent: state.selectedAgent?.id === id
          ? { ...state.selectedAgent, updatedAt: new Date().toISOString() }
          : state.selectedAgent,
        loading: false,
        error: null
      }));
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : '更新Agent状态失败'
      });
      throw error;
    }
  },

  clearError: () => set({ error: null })
}));