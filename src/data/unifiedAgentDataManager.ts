import {
  UnifiedAgent,
  UnifiedAgentContract,
  UnifiedAgentDataManager,
  UnifiedDataManagerConfig,
  AgentEventListener,
  AgentEvent,
  UnifiedAgentStatus,
  UnifiedAgentType,
  UnifiedAgentCapability,
  UnifiedVerificationStatus
} from './unifiedAgentTypes';
import { AgentDataConverter } from './agentDataConverter';

/**
 * 统一的Agent数据管理器
 * 提供统一的CRUD操作和实时数据同步
 */
export class UnifiedAgentDataManagerImpl implements UnifiedAgentDataManager {
  private agents: Map<string, UnifiedAgent> = new Map();
  private contracts: Map<string, UnifiedAgentContract> = new Map();
  private eventListeners: AgentEventListener[] = [];
  private config: Required<UnifiedDataManagerConfig>;

  constructor(config: UnifiedDataManagerConfig = {}) {
    this.config = {
      enablePersistence: config.enablePersistence ?? true,
      enableEventListeners: config.enableEventListeners ?? true,
      enableRealTimeSync: config.enableRealTimeSync ?? true,
      storageKey: config.storageKey ?? 'unified_agent_data'
    };

    this.initializeData();
    this.loadFromStorage();
  }

  /**
   * 初始化基础数据
   */
  private initializeData(): void {
    // 从现有Mock数据初始化
    this.initializeFromExistingData();
  }

  /**
   * 从现有数据源初始化
   */
  private initializeFromExistingData(): void {
    try {
      // 这里可以导入现有的Mock数据
      // 暂时创建一些基础数据
      const mockAgents = this.generateMockAgents();
      mockAgents.forEach(agent => {
        this.agents.set(agent.id, agent);
      });

      const mockContracts = this.generateMockContracts();
      mockContracts.forEach(contract => {
        this.contracts.set(contract.id, contract);
      });

      this.saveToStorage();
    } catch (error) {
      console.error('Failed to initialize from existing data:', error);
    }
  }

  /**
   * 生成Mock数据
   */
  private generateMockAgents(): UnifiedAgent[] {
    return [
      {
        id: 'agent_001',
        agentId: 'agent_001',
        name: 'Data Processing Agent',
        description: '专门处理数据分析任务的智能代理，支持大规模数据处理和实时分析',
        type: 'Data Processing',
        capabilities: ['数据分析', '工作助理'],
        status: 'active',
        codeHash: '0xabcdef1234567890abcdef1234567890abcdef12',
        profileHash: '0x1234567890abcdef1234567890abcdef12345678',
        version: '1.0.0',
        language: 'typescript',
        codeSize: 256,
        boundUser: 'user_123',
        boundAt: '2024-01-15T11:00:00Z',
        config: {
          permissions: ['read', 'write', 'execute'],
          userBinding: {
            boundUserId: 'user_001',
            bindingType: 'faceBiometrics',
            bindingStrength: 'basic',
            verificationFrequency: 'once',
            fallbackAllowed: true
          }
        },
        permissions: ['read', 'write', 'execute'],
        createdAt: '2024-01-15T11:00:00Z',
        updatedAt: '2024-01-20T14:30:00Z',
        blockchainInfo: {
          isOnChain: false,
          verificationStatus: 'unverified',
          syncStatus: 'synced'
        },
        metadata: {
          tags: ['数据处理', '分析', '实时'],
          categories: ['Data Processing'],
          securityLevel: 'medium',
          compliance: ['GDPR']
        },
        stats: {
          totalCalls: 15420,
          successRate: 96.5,
          averageResponseTime: 150,
          errorRate: 3.5,
          uptimePercentage: 98.2,
          connections: 25,
          responseTime: 150,
          uptime: 98.2,
          popularity: 75
        },
        lastActivity: new Date()
      },
      {
        id: 'agent_002',
        agentId: 'agent_002',
        name: 'Security Monitor Agent',
        description: '监控系统安全状态的安全代理，提供实时威胁检测和防护',
        type: 'Security',
        capabilities: ['安全监控', '工作助理'],
        status: 'active',
        codeHash: '0x9876543210fedcba9876543210fedcba98765432',
        profileHash: '0x8765432109abcdef8765432109abcdef87654321',
        version: '2.1.0',
        language: 'python',
        codeSize: 384,
        boundUser: 'user_123',
        boundAt: '2024-01-16T09:30:00Z',
        config: {
          permissions: ['read', 'execute'],
          userBinding: {
            boundUserId: 'user_002',
            bindingType: 'faceBiometrics',
            bindingStrength: 'enhanced',
            verificationFrequency: 'daily',
            fallbackAllowed: false
          }
        },
        permissions: ['read', 'execute'],
        createdAt: '2024-01-16T09:30:00Z',
        updatedAt: '2024-01-21T16:45:00Z',
        blockchainInfo: {
          isOnChain: false,
          verificationStatus: 'unverified',
          syncStatus: 'synced'
        },
        metadata: {
          tags: ['安全', '监控', '防护'],
          categories: ['Security'],
          securityLevel: 'high',
          compliance: ['SOC2', 'ISO27001']
        },
        stats: {
          totalCalls: 8900,
          successRate: 99.1,
          averageResponseTime: 200,
          errorRate: 0.9,
          uptimePercentage: 99.8,
          connections: 15,
          responseTime: 200,
          uptime: 99.8,
          popularity: 85
        },
        lastActivity: new Date()
      },
      {
        id: 'bc-agent-001',
        agentId: 'bc-agent-001',
        name: 'Blockchain AI Assistant',
        description: '基于区块链的AI助理，提供智能化的个人和工作助理服务',
        type: 'AI Assistant',
        capabilities: ['私人助理', '工作助理'],
        status: 'active',
        version: '1.0.0',
        model: 'GPT-4',
        apiEndpoint: 'https://api.blockchain-ai.com',
        boundUser: '0x1234567890abcdef1234567890abcdef12345678',
        config: {
          permissions: ['read', 'write', 'execute'],
          userBinding: {
            boundUserId: '0x1234567890abcdef1234567890abcdef12345678',
            bindingType: 'multiFactor',
            bindingStrength: 'strict',
            verificationFrequency: 'daily',
            fallbackAllowed: false
          }
        },
        permissions: ['read', 'write', 'execute'],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T00:00:00Z',
        blockchainInfo: {
          isOnChain: true,
          contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
          network: 'Ethereum',
          blockNumber: 18000000,
          transactionHash: '0x1111111111111111111111111111111111111111111111111111111111111111',
          gasUsed: 150000,
          chainId: 1,
          verificationStatus: 'verified',
          verificationDate: new Date('2024-01-01T00:00:00Z'),
          lastSyncedAt: new Date(),
          syncStatus: 'synced'
        },
        metadata: {
          website: 'https://blockchain-ai.com',
          tags: ['AI', 'Assistant', 'Blockchain'],
          categories: ['AI Assistant'],
          securityLevel: 'high',
          compliance: ['GDPR', 'CCPA', 'SOC2']
        },
        stats: {
          totalCalls: 25600,
          successRate: 97.8,
          averageResponseTime: 250,
          errorRate: 2.2,
          uptimePercentage: 99.5,
          connections: 45,
          responseTime: 250,
          uptime: 99.5,
          popularity: 90
        },
        lastActivity: new Date()
      }
    ];
  }

  /**
   * 生成Mock合约数据
   */
  private generateMockContracts(): UnifiedAgentContract[] {
    return [
      {
        id: 'contract-001',
        contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        contractName: 'Blockchain AI Assistant Contract',
        ownerAddress: '0x1234567890abcdef1234567890abcdef12345678',
        agentId: 'bc-agent-001',
        agentInfo: this.generateMockAgents()[2], // 引用上面生成的agent
        permissions: 'admin',
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-15T00:00:00Z'),
        status: 'active',
        metadata: {
          tags: ['AI', 'Assistant', 'Blockchain'],
          description: '区块链AI助理的智能合约',
          securityLevel: 'high',
          compliance: ['GDPR', 'CCPA', 'SOC2']
        },
        blockchain: {
          network: 'Ethereum',
          blockNumber: 18000000,
          transactionHash: '0x1111111111111111111111111111111111111111111111111111111111111111',
          gasUsed: 150000
        }
      }
    ];
  }

  // 数据管理器接口实现

  getAllAgents(): UnifiedAgent[] {
    return Array.from(this.agents.values());
  }

  getAgentById(id: string): UnifiedAgent | undefined {
    return this.agents.get(id);
  }

  addAgent(agentData: Omit<UnifiedAgent, 'id' | 'agentId' | 'createdAt' | 'updatedAt'>): UnifiedAgent {
    const id = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const agentId = `agent_${Date.now()}`;
    const now = new Date().toISOString();

    const agent: UnifiedAgent = {
      ...agentData,
      id,
      agentId,
      createdAt: now,
      updatedAt: now
    };

    this.agents.set(id, agent);
    this.saveToStorage();
    this.emitEvent({
      type: 'agent_added',
      payload: agent,
      timestamp: new Date()
    });

    return agent;
  }

  updateAgent(id: string, updates: Partial<UnifiedAgent>): boolean {
    const agent = this.agents.get(id);
    if (!agent) return false;

    const updatedAgent = {
      ...agent,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.agents.set(id, updatedAgent);
    this.saveToStorage();
    this.emitEvent({
      type: 'agent_updated',
      payload: { id, updates, updatedAgent },
      timestamp: new Date()
    });

    return true;
  }

  deleteAgent(id: string): boolean {
    const agent = this.agents.get(id);
    if (!agent) return false;

    this.agents.delete(id);
    this.saveToStorage();
    this.emitEvent({
      type: 'agent_deleted',
      payload: { id, agent },
      timestamp: new Date()
    });

    return true;
  }

  getAgentContracts(): UnifiedAgentContract[] {
    return Array.from(this.contracts.values());
  }

  addAgentContract(contractData: Omit<UnifiedAgentContract, 'id' | 'createdAt' | 'updatedAt'>): UnifiedAgentContract {
    const id = `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();

    const contract: UnifiedAgentContract = {
      ...contractData,
      id,
      createdAt: now,
      updatedAt: now
    };

    this.contracts.set(id, contract);
    this.saveToStorage();
    this.emitEvent({
      type: 'contract_added',
      payload: contract,
      timestamp: new Date()
    });

    return contract;
  }

  updateAgentContract(id: string, updates: Partial<UnifiedAgentContract>): boolean {
    const contract = this.contracts.get(id);
    if (!contract) return false;

    const updatedContract = {
      ...contract,
      ...updates,
      updatedAt: new Date()
    };

    this.contracts.set(id, updatedContract);
    this.saveToStorage();
    this.emitEvent({
      type: 'contract_updated',
      payload: { id, updates, updatedContract },
      timestamp: new Date()
    });

    return true;
  }

  deleteAgentContract(id: string): boolean {
    const contract = this.contracts.get(id);
    if (!contract) return false;

    this.contracts.delete(id);
    this.saveToStorage();
    this.emitEvent({
      type: 'contract_deleted',
      payload: { id, contract },
      timestamp: new Date()
    });

    return true;
  }

  searchAgents(query: string): UnifiedAgent[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllAgents().filter(agent =>
      agent.name.toLowerCase().includes(lowerQuery) ||
      agent.description.toLowerCase().includes(lowerQuery) ||
      agent.capabilities.some(cap => cap.toLowerCase().includes(lowerQuery)) ||
      agent.metadata.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  filterAgents(filters: {
    status?: UnifiedAgentStatus;
    type?: UnifiedAgentType;
    capabilities?: UnifiedAgentCapability[];
    isVerified?: boolean;
    isOnChain?: boolean;
  }): UnifiedAgent[] {
    return this.getAllAgents().filter(agent => {
      if (filters.status && agent.status !== filters.status) return false;
      if (filters.type && agent.type !== filters.type) return false;
      if (filters.capabilities && !filters.capabilities.some(cap => agent.capabilities.includes(cap))) return false;
      if (filters.isVerified !== undefined && agent.isVerified !== filters.isVerified) return false;
      if (filters.isOnChain !== undefined && agent.blockchainInfo.isOnChain !== filters.isOnChain) return false;
      return true;
    });
  }

  getStats() {
    const agents = this.getAllAgents();
    return {
      totalAgents: agents.length,
      activeAgents: agents.filter(a => a.status === 'active').length,
      inactiveAgents: agents.filter(a => a.status === 'inactive').length,
      verifiedAgents: agents.filter(a => a.isVerified).length,
      onChainAgents: agents.filter(a => a.blockchainInfo.isOnChain).length,
      averageRating: agents.reduce((sum, a) => sum + (a.rating || 0), 0) / agents.length || 0
    };
  }

  // 事件处理

  addEventListener(listener: AgentEventListener): void {
    if (this.config.enableEventListeners) {
      this.eventListeners.push(listener);
    }
  }

  removeEventListener(listener: AgentEventListener): void {
    const index = this.eventListeners.indexOf(listener);
    if (index > -1) {
      this.eventListeners.splice(index, 1);
    }
  }

  private emitEvent(event: AgentEvent): void {
    if (!this.config.enableEventListeners) return;

    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }

  // 持久化处理

  private saveToStorage(): void {
    if (!this.config.enablePersistence) return;

    try {
      const data = {
        agents: Array.from(this.agents.entries()),
        contracts: Array.from(this.contracts.entries()),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(this.config.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  }

  private loadFromStorage(): void {
    if (!this.config.enablePersistence) return;

    try {
      const stored = localStorage.getItem(this.config.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.agents = new Map(data.agents || []);
        this.contracts = new Map(data.contracts || []);
      }
    } catch (error) {
      console.error('Failed to load from storage:', error);
    }
  }

  // 批量操作

  importAgents(agents: UnifiedAgent[]): void {
    agents.forEach(agent => {
      this.agents.set(agent.id, agent);
    });
    this.saveToStorage();
  }

  exportAgents(): UnifiedAgent[] {
    return this.getAllAgents();
  }

  clearAll(): void {
    this.agents.clear();
    this.contracts.clear();
    this.saveToStorage();
    this.emitEvent({
      type: 'agent_deleted',
      payload: { cleared: true },
      timestamp: new Date()
    });
  }
}

// 全局实例
export const unifiedAgentDataManager = new UnifiedAgentDataManagerImpl();