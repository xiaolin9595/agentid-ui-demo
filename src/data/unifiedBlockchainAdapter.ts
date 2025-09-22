import { unifiedAgentDataManager } from './unifiedAgentDataManager';
import { AgentDataConverter } from './agentDataConverter';
import {
  IdentityContract,
  AgentIdentityContract,
  ContractRegistrationForm,
  AgentContractRegistrationForm,
  BlockchainAgent
} from '../types/blockchain';

/**
 * 区块链统一数据源适配器
 * 将统一数据管理器适配到现有的区块链Store接口
 */
export class UnifiedBlockchainAdapter {
  private eventListeners: Set<Function> = new Set();

  constructor() {
    // 监听统一数据管理器的事件
    unifiedAgentDataManager.addEventListener(this.handleDataChange.bind(this));
  }

  /**
   * 处理数据变化事件
   */
  private handleDataChange(event: any): void {
    // 通知所有监听者数据已变化
    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in blockchain adapter listener:', error);
      }
    });
  }

  /**
   * 添加变化监听器
   */
  addChangeListener(listener: Function): void {
    this.eventListeners.add(listener);
  }

  /**
   * 移除变化监听器
   */
  removeChangeListener(listener: Function): void {
    this.eventListeners.delete(listener);
  }

  /**
   * 获取身份合约列表
   */
  async fetchContracts(): Promise<IdentityContract[]> {
    try {
      // 从统一数据源获取合约列表
      const contracts = unifiedAgentDataManager.getAgentContracts();

      // 转换为IdentityContract格式（这里需要创建一些模拟的身份合约数据）
      const identityContracts: IdentityContract[] = this.generateIdentityContracts(contracts.length);

      return identityContracts;
    } catch (error) {
      console.error('Error fetching contracts:', error);
      throw error;
    }
  }

  /**
   * 获取Agent合约列表
   */
  async fetchAgentContracts(): Promise<AgentIdentityContract[]> {
    try {
      const contracts = unifiedAgentDataManager.getAgentContracts();
      return contracts.map(contract => ({
        id: contract.id,
        contractAddress: contract.contractAddress,
        contractName: contract.contractName,
        ownerAddress: contract.ownerAddress,
        agentId: contract.agentId,
        agentInfo: contract.agentInfo as any,
        permissions: contract.permissions as any,
        createdAt: contract.createdAt,
        updatedAt: contract.updatedAt,
        status: contract.status as any,
        metadata: contract.metadata,
        blockchain: contract.blockchain
      }));
    } catch (error) {
      console.error('Error fetching agent contracts:', error);
      throw error;
    }
  }

  /**
   * 注册身份合约
   */
  async registerContract(formData: ContractRegistrationForm): Promise<IdentityContract> {
    try {
      // 模拟注册过程
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newContract: IdentityContract = {
        id: `contract_${Date.now()}`,
        contractAddress: this.generateContractAddress(),
        contractName: formData.contractName,
        ownerAddress: this.generateWalletAddress(),
        identityHash: this.generateIdentityHash(),
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
          transactionHash: this.generateTransactionHash(),
          gasUsed: Math.floor(Math.random() * 100000) + 50000
        }
      };

      return newContract;
    } catch (error) {
      console.error('Error registering contract:', error);
      throw error;
    }
  }

  /**
   * 注册Agent合约
   */
  async registerAgentContract(formData: AgentContractRegistrationForm): Promise<AgentIdentityContract> {
    try {
      // 模拟注册过程
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 从统一数据源查找对应的Agent
      const agent = unifiedAgentDataManager.getAgentById(formData.agentId);
      if (!agent) {
        throw new Error('Agent not found');
      }

      const agentInfo: BlockchainAgent = {
        id: formData.agentId,
        name: agent.name,
        type: formData.agentType,
        capabilities: formData.capabilities,
        description: formData.description,
        version: formData.version,
        model: formData.model,
        apiEndpoint: formData.apiEndpoint,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: agent.boundUser || ''
      };

      const newContract = unifiedAgentDataManager.addAgentContract({
        contractAddress: this.generateContractAddress(),
        contractName: formData.contractName,
        ownerAddress: this.generateWalletAddress(),
        agentId: formData.agentId,
        agentInfo: agentInfo as any,
        permissions: formData.permissions,
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
          transactionHash: this.generateTransactionHash(),
          gasUsed: Math.floor(Math.random() * 100000) + 50000
        }
      });

      return {
        id: newContract.id,
        contractAddress: newContract.contractAddress,
        contractName: newContract.contractName,
        ownerAddress: newContract.ownerAddress,
        agentId: newContract.agentId,
        agentInfo: newContract.agentInfo as any,
        permissions: newContract.permissions as any,
        createdAt: newContract.createdAt,
        updatedAt: newContract.updatedAt,
        status: newContract.status as any,
        metadata: newContract.metadata,
        blockchain: newContract.blockchain
      };
    } catch (error) {
      console.error('Error registering agent contract:', error);
      throw error;
    }
  }

  /**
   * 删除身份合约
   */
  async deleteContract(contractId: string): Promise<boolean> {
    try {
      // 模拟删除过程
      await new Promise(resolve => setTimeout(resolve, 500));
      return true;
    } catch (error) {
      console.error('Error deleting contract:', error);
      throw error;
    }
  }

  /**
   * 删除Agent合约
   */
  async deleteAgentContract(contractId: string): Promise<boolean> {
    try {
      return unifiedAgentDataManager.deleteAgentContract(contractId);
    } catch (error) {
      console.error('Error deleting agent contract:', error);
      throw error;
    }
  }

  /**
   * 更新合约状态
   */
  async updateContractStatus(contractId: string, status: IdentityContract['status']): Promise<boolean> {
    try {
      // 模拟更新过程
      await new Promise(resolve => setTimeout(resolve, 800));
      return true;
    } catch (error) {
      console.error('Error updating contract status:', error);
      throw error;
    }
  }

  /**
   * 更新Agent合约状态
   */
  async updateAgentContractStatus(contractId: string, status: AgentIdentityContract['status']): Promise<boolean> {
    try {
      return unifiedAgentDataManager.updateAgentContract(contractId, { status });
    } catch (error) {
      console.error('Error updating agent contract status:', error);
      throw error;
    }
  }

  /**
   * 获取可用的Agent列表
   */
  async getAvailableAgents(): Promise<BlockchainAgent[]> {
    try {
      const agents = unifiedAgentDataManager.getAllAgents();
      return agents.map(agent => AgentDataConverter.toBlockchainAgent(agent));
    } catch (error) {
      console.error('Error getting available agents:', error);
      throw error;
    }
  }

  /**
   * 生成身份合约数据
   */
  private generateIdentityContracts(count: number): IdentityContract[] {
    const identityTypes = ['个人身份', '企业身份', '开发者身份', '机构身份'];
    const statuses: Array<'active' | 'pending' | 'suspended'> = ['active', 'pending', 'suspended'];

    return Array.from({ length: Math.max(3, count) }, (_, index) => ({
      id: `contract_${Date.now()}_${index}`,
      contractAddress: this.generateContractAddress(),
      contractName: `身份合约 ${index + 1}`,
      ownerAddress: this.generateWalletAddress(),
      identityHash: this.generateIdentityHash(),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
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
        transactionHash: this.generateTransactionHash(),
        gasUsed: Math.floor(Math.random() * 100000) + 50000
      }
    }));
  }

  // 辅助函数
  private generateContractAddress(): string {
    return '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  private generateWalletAddress(): string {
    return this.generateContractAddress();
  }

  private generateTransactionHash(): string {
    return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }

  private generateIdentityHash(): string {
    return '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  }
}

// 全局实例
export const unifiedBlockchainAdapter = new UnifiedBlockchainAdapter();