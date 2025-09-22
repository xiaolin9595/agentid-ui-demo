import {
  UnifiedAgent,
  UnifiedAgentContract,
  UnifiedAgentCapability,
  UnifiedAgentType,
  UnifiedPermission,
  UnifiedUserBindingType,
  UnifiedBindingStrength,
  UnifiedVerificationFrequency,
  UnifiedVerificationStatus
} from './unifiedAgentTypes';
import { Agent } from '../types/agent';
import { BlockchainAgent, AgentIdentityContract, MockAgent } from '../types/blockchain';
import { AgentDiscoveryItem } from '../types/agent-discovery';

/**
 * Agent数据转换器
 * 用于在不同Agent数据结构之间进行转换
 */

export class AgentDataConverter {
  /**
   * 从Agent类型转换为UnifiedAgent
   */
  static fromAgent(agent: Agent): UnifiedAgent {
    return {
      id: agent.id,
      agentId: agent.agentId,
      name: agent.name,
      description: agent.description,
      type: 'Traditional', // 默认类型
      capabilities: this.extractCapabilitiesFromDescription(agent.description),
      status: agent.status,
      codeHash: agent.codeHash,
      profileHash: agent.profileHash,
      version: '1.0.0',
      language: agent.language,
      codeSize: agent.codeSize,
      boundUser: agent.boundUser,
      boundAt: agent.boundAt,
      config: this.convertConfig(agent.config),
      permissions: agent.permissions as UnifiedPermission[],
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
      blockchainInfo: {
        isOnChain: false,
        verificationStatus: 'unverified',
        syncStatus: 'synced'
      },
      metadata: {
        tags: ['Traditional', 'On-Premise'],
        categories: ['Traditional'],
        securityLevel: 'medium',
        compliance: []
      },
      lastActivity: new Date(agent.updatedAt)
    };
  }

  /**
   * 从BlockchainAgent转换为UnifiedAgent
   */
  static fromBlockchainAgent(agent: BlockchainAgent): UnifiedAgent {
    return {
      id: agent.id,
      agentId: agent.id,
      name: agent.name,
      description: agent.description,
      type: agent.type as UnifiedAgentType,
      capabilities: agent.capabilities as UnifiedAgentCapability[],
      status: agent.status === 'development' ? 'active' : agent.status === 'deprecated' ? 'inactive' : agent.status,
      version: agent.version,
      model: agent.model,
      apiEndpoint: agent.apiEndpoint,
      boundUser: agent.owner,
      config: {
        permissions: ['read', 'write', 'execute'],
        userBinding: {
          boundUserId: agent.owner,
          bindingType: 'multiFactor' as UnifiedUserBindingType,
          bindingStrength: 'strict' as UnifiedBindingStrength,
          verificationFrequency: 'daily' as UnifiedVerificationFrequency,
          fallbackAllowed: false
        }
      },
      permissions: ['read', 'write', 'execute'],
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
      blockchainInfo: {
        isOnChain: true,
        verificationStatus: 'verified' as UnifiedVerificationStatus,
        syncStatus: 'synced'
      },
      metadata: {
        website: `https://${agent.name.toLowerCase().replace(/\s+/g, '-')}.com`,
        tags: agent.capabilities,
        categories: [agent.type],
        securityLevel: 'high',
        compliance: ['GDPR', 'SOC2']
      },
      lastActivity: agent.updatedAt,
      stats: {
        totalCalls: Math.floor(Math.random() * 50000),
        successRate: 95 + Math.random() * 5,
        averageResponseTime: 100 + Math.random() * 400,
        errorRate: Math.random() * 10,
        uptimePercentage: 95 + Math.random() * 5,
        connections: Math.floor(Math.random() * 100),
        responseTime: Math.floor(Math.random() * 1000) + 50,
        uptime: 95 + Math.random() * 5,
        popularity: Math.floor(Math.random() * 100)
      }
    };
  }

  /**
   * 从AgentDiscoveryItem转换为UnifiedAgent
   */
  static fromAgentDiscoveryItem(item: AgentDiscoveryItem): UnifiedAgent {
    return {
      id: item.id,
      agentId: item.agentId,
      name: item.name,
      description: item.description,
      type: item.categories?.[0] as UnifiedAgentType || 'AI Assistant',
      capabilities: item.tags as UnifiedAgentCapability[] || [],
      status: item.status,
      codeHash: item.codeHash,
      profileHash: item.profileHash,
      version: item.version || '1.0.0',
      model: item.model,
      apiEndpoint: item.apiEndpoint,
      language: item.language,
      codeSize: item.codeSize,
      boundUser: item.boundUser,
      boundAt: item.boundAt,
      config: this.convertConfig(item.config),
      permissions: item.permissions as UnifiedPermission[],
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      blockchainInfo: item.blockchainInfo || {
        isOnChain: false,
        verificationStatus: 'unverified' as UnifiedVerificationStatus,
        syncStatus: 'synced'
      },
      rating: item.rating,
      reviewCount: item.reviewCount,
      isVerified: item.isVerified,
      isFeatured: item.isFeatured,
      stats: item.stats,
      metadata: item.metadata || {
        tags: item.tags || [],
        categories: item.categories || [],
        securityLevel: 'medium',
        compliance: []
      },
      lastActivity: item.lastActivity
    };
  }

  /**
   * 从MockAgent转换为UnifiedAgent
   */
  static fromMockAgent(agent: MockAgent): UnifiedAgent {
    return {
      id: agent.id,
      agentId: agent.id,
      name: agent.name,
      description: agent.description,
      type: agent.type as UnifiedAgentType,
      capabilities: agent.capabilities as UnifiedAgentCapability[],
      status: agent.status === 'development' ? 'active' : agent.status === 'deprecated' ? 'inactive' : agent.status,
      version: agent.version,
      model: agent.model,
      apiEndpoint: agent.apiEndpoint,
      boundUser: agent.owner,
      config: {
        permissions: ['read', 'write', 'execute'],
        userBinding: {
          boundUserId: agent.owner,
          bindingType: 'multiFactor' as UnifiedUserBindingType,
          bindingStrength: 'strict' as UnifiedBindingStrength,
          verificationFrequency: 'daily' as UnifiedVerificationFrequency,
          fallbackAllowed: false
        }
      },
      permissions: ['read', 'write', 'execute'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      blockchainInfo: {
        isOnChain: false,
        verificationStatus: 'unverified' as UnifiedVerificationStatus,
        syncStatus: 'synced'
      },
      metadata: {
        website: `https://${agent.name.toLowerCase().replace(/\s+/g, '-')}.com`,
        tags: agent.capabilities,
        categories: [agent.type],
        securityLevel: 'high',
        compliance: ['GDPR', 'SOC2']
      },
      lastActivity: new Date(),
      stats: {
        totalCalls: Math.floor(Math.random() * 50000),
        successRate: 95 + Math.random() * 5,
        averageResponseTime: 100 + Math.random() * 400,
        errorRate: Math.random() * 10,
        uptimePercentage: 95 + Math.random() * 5,
        connections: Math.floor(Math.random() * 100),
        responseTime: Math.floor(Math.random() * 1000) + 50,
        uptime: 95 + Math.random() * 5,
        popularity: Math.floor(Math.random() * 100)
      }
    };
  }

  /**
   * 从AgentIdentityContract转换为UnifiedAgentContract
   */
  static fromAgentIdentityContract(contract: AgentIdentityContract): UnifiedAgentContract {
    return {
      id: contract.id,
      contractAddress: contract.contractAddress,
      contractName: contract.contractName,
      ownerAddress: contract.ownerAddress,
      agentId: contract.agentId,
      agentInfo: this.fromBlockchainAgent(contract.agentInfo),
      permissions: contract.permissions as UnifiedPermission,
      createdAt: contract.createdAt,
      updatedAt: contract.updatedAt,
      status: contract.status,
      metadata: contract.metadata,
      blockchain: contract.blockchain
    };
  }

  /**
   * 转换配置信息
   */
  private static convertConfig(config: any): any {
    if (!config) return {
      permissions: [],
      userBinding: {
        boundUserId: '',
        bindingType: 'faceBiometrics' as UnifiedUserBindingType,
        bindingStrength: 'basic' as UnifiedBindingStrength,
        verificationFrequency: 'once' as UnifiedVerificationFrequency,
        fallbackAllowed: true
      }
    };

    return {
      permissions: config.permissions || [],
      userBinding: {
        boundUserId: config.userBinding?.boundUserId || '',
        bindingType: config.userBinding?.bindingType || 'faceBiometrics' as UnifiedUserBindingType,
        bindingStrength: config.userBinding?.bindingStrength || 'basic' as UnifiedBindingStrength,
        verificationFrequency: config.userBinding?.verificationFrequency || 'once' as UnifiedVerificationFrequency,
        fallbackAllowed: config.userBinding?.fallbackAllowed || true,
        userFaceFeatures: config.userBinding?.userFaceFeatures
      }
    };
  }

  /**
   * 从描述中提取能力
   */
  private static extractCapabilitiesFromDescription(description: string): UnifiedAgentCapability[] {
    const keywords: Record<string, UnifiedAgentCapability> = {
      '数据': '数据分析',
      '分析': '数据分析',
      '处理': '数据分析',
      '图像': '图像处理',
      '视觉': '图像处理',
      '自然语言': '自然语言处理',
      '文本': '自然语言处理',
      '语言': '自然语言处理',
      '安全': '安全监控',
      '监控': '安全监控',
      '防护': '安全监控',
      '自动': '自动化',
      '交易': '交易处理',
      '区块链': '区块链操作',
      '验证': '身份验证',
      '认证': '身份验证',
      '生成': '内容生成',
      '创作': '内容生成'
    };

    const capabilities: UnifiedAgentCapability[] = [];
    const lowerDesc = description.toLowerCase();

    Object.entries(keywords).forEach(([keyword, capability]) => {
      if (lowerDesc.includes(keyword)) {
        capabilities.push(capability);
      }
    });

    return capabilities.length > 0 ? capabilities : ['工作助理'];
  }

  /**
   * 转换为Agent类型
   */
  static toAgent(unifiedAgent: UnifiedAgent): Agent {
    return {
      id: unifiedAgent.id,
      agentId: unifiedAgent.agentId,
      name: unifiedAgent.name,
      description: unifiedAgent.description,
      codeHash: unifiedAgent.codeHash || '',
      profileHash: unifiedAgent.profileHash || '',
      status: unifiedAgent.status as Agent['status'],
      boundUser: unifiedAgent.boundUser || '',
      boundAt: unifiedAgent.boundAt || '',
      createdAt: unifiedAgent.createdAt,
      updatedAt: unifiedAgent.updatedAt,
      codeSize: unifiedAgent.codeSize || 0,
      language: unifiedAgent.language || '',
      config: unifiedAgent.config,
      permissions: unifiedAgent.permissions
    };
  }

  /**
   * 转换为BlockchainAgent类型
   */
  static toBlockchainAgent(unifiedAgent: UnifiedAgent): BlockchainAgent {
    return {
      id: unifiedAgent.id,
      name: unifiedAgent.name,
      type: unifiedAgent.type as any,
      capabilities: unifiedAgent.capabilities as any,
      description: unifiedAgent.description,
      version: unifiedAgent.version,
      model: unifiedAgent.model || '',
      apiEndpoint: unifiedAgent.apiEndpoint || '',
      status: unifiedAgent.status as any,
      createdAt: new Date(unifiedAgent.createdAt),
      updatedAt: new Date(unifiedAgent.updatedAt),
      owner: unifiedAgent.boundUser || ''
    };
  }

  /**
   * 转换为AgentDiscoveryItem类型
   */
  static toAgentDiscoveryItem(unifiedAgent: UnifiedAgent): AgentDiscoveryItem {
    return {
      id: unifiedAgent.id,
      agentId: unifiedAgent.agentId,
      name: unifiedAgent.name,
      description: unifiedAgent.description,
      codeHash: unifiedAgent.codeHash || '',
      profileHash: unifiedAgent.profileHash || '',
      status: unifiedAgent.status,
      boundUser: unifiedAgent.boundUser || '',
      boundAt: unifiedAgent.boundAt || '',
      createdAt: unifiedAgent.createdAt,
      updatedAt: unifiedAgent.updatedAt,
      codeSize: unifiedAgent.codeSize || 0,
      language: unifiedAgent.language || '',
      config: unifiedAgent.config,
      permissions: unifiedAgent.permissions,
      blockchainInfo: unifiedAgent.blockchainInfo,
      rating: unifiedAgent.rating,
      reviewCount: unifiedAgent.reviewCount,
      tags: unifiedAgent.metadata.tags,
      isVerified: unifiedAgent.isVerified,
      isFeatured: unifiedAgent.isFeatured,
      popularity: unifiedAgent.stats?.popularity,
      connections: unifiedAgent.stats?.connections,
      responseTime: unifiedAgent.stats?.responseTime,
      uptime: unifiedAgent.stats?.uptime,
      lastActivity: unifiedAgent.lastActivity,
      categories: unifiedAgent.metadata.categories,
      apiEndpoint: unifiedAgent.apiEndpoint,
      model: unifiedAgent.model,
      version: unifiedAgent.version,
      stats: unifiedAgent.stats,
      metadata: unifiedAgent.metadata
    };
  }
}