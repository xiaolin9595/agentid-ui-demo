import { create } from 'zustand';
import { unifiedBlockchainAdapter } from '../data/unifiedBlockchainAdapter';
import {
  IdentityContract,
  AgentIdentityContract,
  ContractRegistrationForm,
  AgentContractRegistrationForm
} from '../types/blockchain';

interface UnifiedBlockchainState {
  // 状态
  contracts: IdentityContract[];
  agentContracts: AgentIdentityContract[];
  isLoading: boolean;
  error: string | null;
  selectedContract: IdentityContract | null;
  selectedAgentContract: AgentIdentityContract | null;

  // 操作
  registerContract: (formData: ContractRegistrationForm) => Promise<void>;
  registerAgentContract: (formData: AgentContractRegistrationForm) => Promise<void>;
  fetchContracts: () => Promise<void>;
  fetchAgentContracts: () => Promise<void>;
  deleteContract: (contractId: string) => Promise<void>;
  deleteAgentContract: (contractId: string) => Promise<void>;
  updateContractStatus: (contractId: string, status: IdentityContract['status']) => Promise<void>;
  updateAgentContractStatus: (contractId: string, status: AgentIdentityContract['status']) => Promise<void>;
  setSelectedContract: (contract: IdentityContract | null) => void;
  setSelectedAgentContract: (contract: AgentIdentityContract | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useUnifiedBlockchainStore = create<UnifiedBlockchainState>((set, get) => ({
  // 初始状态
  contracts: [],
  agentContracts: [],
  isLoading: false,
  error: null,
  selectedContract: null,
  selectedAgentContract: null,

  // 注册新合约
  registerContract: async (formData: ContractRegistrationForm) => {
    set({ isLoading: true, error: null });

    try {
      const newContract = await unifiedBlockchainAdapter.registerContract(formData);
      set(state => ({
        contracts: [...state.contracts, newContract],
        isLoading: false,
        selectedContract: newContract
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '合约注册失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // 注册Agent合约
  registerAgentContract: async (formData: AgentContractRegistrationForm) => {
    set({ isLoading: true, error: null });

    try {
      const newAgentContract = await unifiedBlockchainAdapter.registerAgentContract(formData);
      set(state => ({
        agentContracts: [...state.agentContracts, newAgentContract],
        isLoading: false,
        selectedAgentContract: newAgentContract
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Agent合约注册失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // 获取合约列表
  fetchContracts: async () => {
    set({ isLoading: true, error: null });

    try {
      const contracts = await unifiedBlockchainAdapter.fetchContracts();
      set({ contracts, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取合约列表失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // 获取Agent合约列表
  fetchAgentContracts: async () => {
    set({ isLoading: true, error: null });

    try {
      const agentContracts = await unifiedBlockchainAdapter.fetchAgentContracts();
      set({ agentContracts, isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '获取Agent合约列表失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // 删除合约
  deleteContract: async (contractId: string) => {
    set({ isLoading: true, error: null });

    try {
      await unifiedBlockchainAdapter.deleteContract(contractId);
      set(state => ({
        contracts: state.contracts.filter(c => c.id !== contractId),
        isLoading: false,
        selectedContract: state.selectedContract?.id === contractId ? null : state.selectedContract
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除合约失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // 删除Agent合约
  deleteAgentContract: async (contractId: string) => {
    set({ isLoading: true, error: null });

    try {
      await unifiedBlockchainAdapter.deleteAgentContract(contractId);
      set(state => ({
        agentContracts: state.agentContracts.filter(c => c.id !== contractId),
        isLoading: false,
        selectedAgentContract: state.selectedAgentContract?.id === contractId ? null : state.selectedAgentContract
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '删除Agent合约失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // 更新合约状态
  updateContractStatus: async (contractId: string, status: IdentityContract['status']) => {
    set({ isLoading: true, error: null });

    try {
      await unifiedBlockchainAdapter.updateContractStatus(contractId, status);
      set(state => ({
        contracts: state.contracts.map(contract =>
          contract.id === contractId
            ? { ...contract, status, updatedAt: new Date() }
            : contract
        ),
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新合约状态失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // 更新Agent合约状态
  updateAgentContractStatus: async (contractId: string, status: AgentIdentityContract['status']) => {
    set({ isLoading: true, error: null });

    try {
      await unifiedBlockchainAdapter.updateAgentContractStatus(contractId, status);
      set(state => ({
        agentContracts: state.agentContracts.map(contract =>
          contract.id === contractId
            ? { ...contract, status, updatedAt: new Date() }
            : contract
        ),
        isLoading: false
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '更新Agent合约状态失败';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // 设置选中的合约
  setSelectedContract: (contract: IdentityContract | null) => {
    set({ selectedContract: contract });
  },

  // 设置选中的Agent合约
  setSelectedAgentContract: (contract: AgentIdentityContract | null) => {
    set({ selectedAgentContract: contract });
  },

  // 清除错误
  clearError: () => {
    set({ error: null });
  },

  // 重置状态
  reset: () => {
    set({
      contracts: [],
      agentContracts: [],
      isLoading: false,
      error: null,
      selectedContract: null,
      selectedAgentContract: null
    });
  }
}));