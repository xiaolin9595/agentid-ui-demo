import { create } from 'zustand';
import { Agent, AgentMetrics, PaginationParams, FilterParams, SortParams } from '@types';

interface AgentState {
  // Agent数据
  agents: Agent[];
  selectedAgent: Agent | null;
  agentMetrics: Record<string, AgentMetrics>;

  // 分页和过滤
  pagination: PaginationParams;
  filters: FilterParams;
  sort: SortParams | null;

  // UI状态
  loading: boolean;
  error: string | null;

  // Actions
  setAgents: (agents: Agent[]) => void;
  setSelectedAgent: (agent: Agent | null) => void;
  setAgentMetrics: (agentId: string, metrics: AgentMetrics) => void;
  setPagination: (pagination: PaginationParams) => void;
  setFilters: (filters: FilterParams) => void;
  setSort: (sort: SortParams | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  removeAgent: (id: string) => void;
  clearFilters: () => void;
}

const defaultPagination: PaginationParams = {
  page: 1,
  pageSize: 10
};

export const useAgentStore = create<AgentState>((set, get) => ({
  // 初始状态
  agents: [],
  selectedAgent: null,
  agentMetrics: {},
  pagination: defaultPagination,
  filters: {},
  sort: null,
  loading: false,
  error: null,

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
  })
}));