import { create } from 'zustand';
import { Agent, AgentMetrics, AgentPaginationParams, AgentFilterParams, AgentSortParams } from '../types/agent';
import { AgentCreateInfo, AgentApiSpec, AgentCodePackage } from '../types/agent-upload';
import { sharedAgentData } from '../mocks/sharedAgentData';

interface AgentState {
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

  createAgent: async (agentData) => {
    const { basicInfo, apiSpec, codePackage } = agentData;
    const state = get();

    set({ isCreating: true, error: null });

    try {
      // 模拟创建延迟
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 生成新的Agent
      const newAgent: Agent = {
        id: `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        agentId: `agent_${Date.now()}`,
        name: basicInfo.name,
        description: basicInfo.description,
        codeHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        profileHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        status: 'active',
        boundUser: 'current_user', // 模拟当前用户
        boundAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        codeSize: codePackage.files.reduce((total, file) => total + file.size, 0),
        language: codePackage.language.id,
        config: {
          permissions: basicInfo.config.permissions.map(p => p as any),
          userBinding: basicInfo.config.userBinding
        },
        permissions: basicInfo.config.permissions.map(id => ({
          id: id as any,
          name: id,
          description: `${id} permission`,
          required: basicInfo.config.permissions.includes(id)
        }) as any)
      };

      // 添加到共享数据源
      const addedAgent = sharedAgentData.addAgent(newAgent);

      // 更新状态
      set((state) => ({
        agents: [addedAgent, ...state.agents],
        selectedAgent: addedAgent,
        isCreating: false,
        error: null
      }));

      return addedAgent;
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
      // 模拟获取延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 使用共享数据源
      const agents = sharedAgentData.getAgents();
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
      // 模拟删除延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      // 从共享数据源删除
      sharedAgentData.deleteAgent(id);

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
      // 模拟更新延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      // 更新共享数据源
      sharedAgentData.updateAgent(id, { status, updatedAt: new Date().toISOString() });

      set((state) => ({
        agents: state.agents.map(agent =>
          agent.id === id ? { ...agent, status, updatedAt: new Date().toISOString() } : agent
        ),
        selectedAgent: state.selectedAgent?.id === id
          ? { ...state.selectedAgent, status, updatedAt: new Date().toISOString() }
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

  clearError: () => set({ error: null }),

  clearFilters: () => set({
    filters: {},
    sort: null,
    pagination: defaultPagination
  })
}));