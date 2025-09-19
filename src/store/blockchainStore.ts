import { create } from 'zustand';
import {
  IdentityContract,
  ContractRegistrationForm,
  AgentIdentityContract,
  AgentContractRegistrationForm,
  BlockchainAgent,
  MockAgent
} from '../types/blockchain';

interface BlockchainState {
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

export const useBlockchainStore = create<BlockchainState>((set, get) => ({
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
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newContract: IdentityContract = {
        id: `contract_${Date.now()}`,
        contractAddress: generateContractAddress(),
        contractName: formData.contractName,
        ownerAddress: generateWalletAddress(),
        identityHash: generateIdentityHash(),
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        metadata: {
          identityType: formData.identityType,
          identityCredential: {
            id: `credential_${Date.now()}`,
            name: formData.identityCredential,
            type: 'id_card',
            fileUrl: 'https://example.com/credential.pdf',
            uploadDate: new Date(),
            verified: true,
            verificationScore: 95
          },
          userId: formData.userId,
          tags: formData.tags,
          description: formData.description
        },
        blockchain: {
          network: 'Ethereum Testnet',
          blockNumber: Math.floor(Math.random() * 1000000),
          transactionHash: generateTransactionHash(),
          gasUsed: Math.floor(Math.random() * 100000) + 50000
        }
      };

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
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 查找对应的Mock Agent
      const mockAgent = MOCK_AGENTS.find(agent => agent.id === formData.agentId);

      const agentInfo: BlockchainAgent = {
        id: formData.agentId,
        name: mockAgent?.name || 'Unknown Agent',
        type: formData.agentType,
        capabilities: formData.capabilities,
        description: formData.description,
        version: formData.version,
        model: formData.model,
        apiEndpoint: formData.apiEndpoint,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: mockAgent?.owner || 'Unknown'
      };

      const newAgentContract: AgentIdentityContract = {
        id: `agent_contract_${Date.now()}`,
        contractAddress: generateContractAddress(),
        contractName: formData.contractName,
        ownerAddress: generateWalletAddress(),
        agentId: formData.agentId,
        agentInfo,
        permissions: formData.permissions,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        metadata: {
          tags: formData.tags,
          description: formData.description,
          securityLevel: formData.securityLevel,
          compliance: ['GDPR', 'SOC2', 'ISO27001']
        },
        blockchain: {
          network: 'Ethereum Testnet',
          blockNumber: Math.floor(Math.random() * 1000000),
          transactionHash: generateTransactionHash(),
          gasUsed: Math.floor(Math.random() * 100000) + 50000
        }
      };

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
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 生成模拟数据
      const mockContracts: IdentityContract[] = generateMockContracts();

      set({ contracts: mockContracts, isLoading: false });
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
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 生成模拟数据
      const mockAgentContracts: AgentIdentityContract[] = generateMockAgentContracts();

      set({ agentContracts: mockAgentContracts, isLoading: false });
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
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));

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
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500));

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
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800));

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
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 800));

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

// 辅助函数
function generateContractAddress(): string {
  return '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function generateWalletAddress(): string {
  return generateContractAddress();
}

function generateTransactionHash(): string {
  return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function generateIdentityHash(): string {
  return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

function generateMockContracts(): IdentityContract[] {
  const identityTypes = ['个人身份', '企业身份', '开发者身份', '机构身份'];
  const statuses: Array<'active' | 'pending' | 'suspended'> = ['active', 'pending', 'suspended'];

  return Array.from({ length: 8 }, (_, index) => ({
    id: `contract_${Date.now()}_${index}`,
    contractAddress: generateContractAddress(),
    contractName: `身份合约 ${index + 1}`,
    ownerAddress: generateWalletAddress(),
    identityHash: generateIdentityHash(),
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // 过去30天内
    updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // 过去7天内
    status: statuses[Math.floor(Math.random() * statuses.length)],
    metadata: {
      identityType: identityTypes[Math.floor(Math.random() * identityTypes.length)],
      identityCredential: {
        id: `credential_${Date.now()}_${index}`,
        name: '身份证件',
        type: 'id_card',
        fileUrl: 'https://example.com/credential.pdf',
        uploadDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        verified: Math.random() > 0.3,
        verificationScore: Math.floor(Math.random() * 30) + 70
      },
      userId: `user_${index + 1}`,
      tags: [
        'KYC验证',
        '企业认证',
        '开发者',
        '高级用户',
        '实名认证',
        '多因素认证'
      ].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 3) + 1),
      description: `这是第${index + 1}个身份合约，用于演示区块链身份管理功能。`
    },
    blockchain: {
      network: 'Ethereum Testnet',
      blockNumber: Math.floor(Math.random() * 1000000),
      transactionHash: generateTransactionHash(),
      gasUsed: Math.floor(Math.random() * 100000) + 50000
    }
  }));
}

// Mock Agent数据
const MOCK_AGENTS: MockAgent[] = [
  {
    id: 'agent_001',
    name: 'Claude AI Assistant',
    type: 'AI Assistant',
    capabilities: ['NLP', 'Natural Language Understanding', 'Code Generation'],
    description: '基于大语言模型的AI助手，支持自然语言交互和代码生成',
    version: '3.5',
    model: 'Claude-3.5-Sonnet',
    apiEndpoint: 'https://api.claude.ai/v1',
    status: 'active',
    owner: 'Anthropic'
  },
  {
    id: 'agent_002',
    name: 'Data Analyzer Pro',
    type: 'Data Processing',
    capabilities: ['Data Analysis', 'Machine Learning', 'Automation'],
    description: '专业数据分析工具，支持机器学习模型训练和预测',
    version: '2.1',
    model: 'XGBoost-2.1',
    apiEndpoint: 'https://api.analyzer.pro/v2',
    status: 'active',
    owner: 'DataTech Corp'
  },
  {
    id: 'agent_003',
    name: 'Chatbot Service',
    type: 'Chatbot',
    capabilities: ['NLP', 'Translation', 'Voice Recognition'],
    description: '多语言聊天机器人服务，支持语音识别和翻译',
    version: '1.8',
    model: 'GPT-4',
    apiEndpoint: 'https://chatbot.service.ai/v1',
    status: 'active',
    owner: 'ChatBot Inc'
  },
  {
    id: 'agent_004',
    name: 'Security Monitor',
    type: 'Security',
    capabilities: ['Automation', 'Machine Learning', 'Computer Vision'],
    description: 'AI安全监控系统，支持异常检测和威胁识别',
    version: '3.0',
    model: 'SecurityNet-V3',
    apiEndpoint: 'https://security.monitor.ai/v3',
    status: 'development',
    owner: 'SecureAI'
  },
  {
    id: 'agent_005',
    name: 'Content Generator',
    type: 'Content Generation',
    capabilities: ['NLP', 'Code Generation', 'Image Processing'],
    description: '智能内容生成工具，支持文本、代码和图像生成',
    version: '2.5',
    model: 'ContentGen-2.5',
    apiEndpoint: 'https://content.gen.ai/v2',
    status: 'active',
    owner: 'CreativeAI'
  }
];

function generateMockAgentContracts(): AgentIdentityContract[] {
  const statuses: Array<'active' | 'pending' | 'suspended' | 'terminated'> = ['active', 'pending', 'suspended', 'terminated'];
  const permissions: Array<'read-only' | 'read-write' | 'admin'> = ['read-only', 'read-write', 'admin'];
  const securityLevels: Array<'low' | 'medium' | 'high'> = ['low', 'medium', 'high'];

  return Array.from({ length: 6 }, (_, index) => {
    const mockAgent = MOCK_AGENTS[index % MOCK_AGENTS.length];
    const agentInfo: BlockchainAgent = {
      id: mockAgent.id,
      name: mockAgent.name,
      type: mockAgent.type,
      capabilities: mockAgent.capabilities,
      description: mockAgent.description,
      version: mockAgent.version,
      model: mockAgent.model,
      apiEndpoint: mockAgent.apiEndpoint,
      status: mockAgent.status,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      owner: mockAgent.owner
    };

    return {
      id: `agent_contract_${Date.now()}_${index}`,
      contractAddress: generateContractAddress(),
      contractName: `${mockAgent.name}合约`,
      ownerAddress: generateWalletAddress(),
      agentId: mockAgent.id,
      agentInfo,
      permissions: permissions[Math.floor(Math.random() * permissions.length)],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      metadata: {
        tags: [
          'AI服务',
          '机器学习',
          '自然语言处理',
          '数据分析',
          '自动化',
          '安全认证',
          '企业级',
          '高可用'
        ].sort(() => Math.random() - 0.5).slice(0, Math.floor(Math.random() * 4) + 1),
        description: `这是${mockAgent.name}的区块链身份合约，用于验证和管理Agent的身份信息。`,
        securityLevel: securityLevels[Math.floor(Math.random() * securityLevels.length)],
        compliance: ['GDPR', 'SOC2', 'ISO27001']
      },
      blockchain: {
        network: 'Ethereum Testnet',
        blockNumber: Math.floor(Math.random() * 1000000),
        transactionHash: generateTransactionHash(),
        gasUsed: Math.floor(Math.random() * 100000) + 50000
      }
    };
  });
}