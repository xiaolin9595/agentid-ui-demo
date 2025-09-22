import {
  Agent,
  BlockchainAgent,
  AgentIdentityContract,
  AgentCapability,
  AgentDiscoveryItem,
  AgentDiscoveryStats,
  AgentCommunicationStatus
} from '../types';

/**
 * Agent发现功能的模拟数据
 */

// 扩展的基础Agent模拟数据
export const mockBaseAgents: Agent[] = [
  {
    id: '1',
    agentId: 'agent_001',
    name: 'Data Processing Agent',
    description: '专门处理数据分析任务的智能代理，支持大规模数据处理和实时分析',
    codeHash: '0xabcdef1234567890abcdef1234567890abcdef12',
    profileHash: '0x1234567890abcdef1234567890abcdef12345678',
    status: 'active',
    boundUser: 'user_123',
    boundAt: '2024-01-15T11:00:00Z',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    codeSize: 256,
    language: 'typescript',
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
    permissions: ['read', 'write', 'execute']
  },
  {
    id: '2',
    agentId: 'agent_002',
    name: 'Security Monitor Agent',
    description: '监控系统安全状态的安全代理，提供实时威胁检测和防护',
    codeHash: '0x9876543210fedcba9876543210fedcba98765432',
    profileHash: '0x8765432109abcdef8765432109abcdef87654321',
    status: 'active',
    boundUser: 'user_123',
    boundAt: '2024-01-16T09:30:00Z',
    createdAt: '2024-01-16T09:30:00Z',
    updatedAt: '2024-01-21T16:45:00Z',
    codeSize: 384,
    language: 'python',
    config: {
      permissions: ['read', 'execute'],
      userBinding: {
        boundUserId: 'user_002',
        bindingType: 'faceBiometrics',
        bindingStrength: 'enhanced',
        verificationFrequency: 'daily',
        fallbackAllowed: false,
        userFaceFeatures: {
          featureVector: Array.from({ length: 128 }, () => Math.random()),
          templateId: 'face_mock_001',
          confidence: 0.96,
          livenessCheck: true,
          antiSpoofing: true,
          enrollmentDate: new Date('2024-01-16T09:30:00Z')
        }
      }
    },
    permissions: ['read', 'execute']
  },
  {
    id: '3',
    agentId: 'agent_003',
    name: 'Backup Agent',
    description: '执行数据备份和恢复任务，确保数据安全和业务连续性',
    codeHash: '0x5555555555555555555555555555555555555555',
    profileHash: '0x6666666666666666666666666666666666666666',
    status: 'stopped',
    boundUser: 'user_456',
    boundAt: '2024-01-18T13:20:00Z',
    createdAt: '2024-01-18T13:20:00Z',
    updatedAt: '2024-01-22T10:15:00Z',
    codeSize: 512,
    language: 'go',
    config: {
      permissions: ['read', 'write'],
      userBinding: {
        boundUserId: 'user_003',
        bindingType: 'multiFactor',
        bindingStrength: 'strict',
        verificationFrequency: 'daily',
        fallbackAllowed: false
      }
    },
    permissions: ['read', 'write']
  },
  {
    id: '4',
    agentId: 'agent_004',
    name: 'Content Generator',
    description: '智能内容生成代理，支持多种内容类型的自动生成',
    codeHash: '0x1111111111111111111111111111111111111111',
    profileHash: '0x2222222222222222222222222222222222222222',
    status: 'active',
    boundUser: 'user_789',
    boundAt: '2024-01-20T15:45:00Z',
    createdAt: '2024-01-20T15:45:00Z',
    updatedAt: '2024-01-23T09:20:00Z',
    codeSize: 768,
    language: 'javascript',
    config: {
      permissions: ['read', 'write', 'execute'],
      userBinding: {
        boundUserId: 'user_004',
        bindingType: 'multiFactor',
        bindingStrength: 'strict',
        verificationFrequency: 'daily',
        fallbackAllowed: true
      }
    },
    permissions: ['read', 'write', 'execute']
  },
  {
    id: '5',
    agentId: 'agent_005',
    name: 'Transaction Processor',
    description: '处理区块链交易的专业代理，确保交易的安全性和效率',
    codeHash: '0x3333333333333333333333333333333333333333',
    profileHash: '0x4444444444444444444444444444444444444444',
    status: 'active',
    boundUser: 'user_101',
    boundAt: '2024-01-25T08:30:00Z',
    createdAt: '2024-01-25T08:30:00Z',
    updatedAt: '2024-01-28T16:10:00Z',
    codeSize: 1024,
    language: 'solidity',
    config: {
      permissions: ['read', 'write', 'execute'],
      userBinding: {
        boundUserId: 'user_005',
        bindingType: 'multiFactor',
        bindingStrength: 'strict',
        verificationFrequency: 'daily',
        fallbackAllowed: false
      }
    },
    permissions: ['read', 'write', 'execute']
  }
];

// 区块链Agent模拟数据
export const mockBlockchainAgents: BlockchainAgent[] = [
  {
    id: 'bc-agent-001',
    name: 'Blockchain AI Assistant',
    type: 'AI Assistant',
    capabilities: ['私人助理', '工作助理'],
    description: '基于区块链的AI助理，提供智能化的个人和工作助理服务',
    version: '1.0.0',
    model: 'GPT-4',
    apiEndpoint: 'https://api.blockchain-ai.com',
    status: 'active',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-15T00:00:00Z'),
    owner: '0x1234567890abcdef1234567890abcdef12345678'
  },
  {
    id: 'bc-agent-002',
    name: 'DeFi Trading Bot',
    type: 'Automation',
    capabilities: ['财务助理', '工作助理'],
    description: '去中心化交易机器人，提供自动化的交易策略和风险管理',
    version: '2.1.0',
    model: 'Custom Neural Network',
    apiEndpoint: 'https://api.defi-bot.com',
    status: 'active',
    createdAt: new Date('2024-01-05T00:00:00Z'),
    updatedAt: new Date('2024-01-20T00:00:00Z'),
    owner: '0x2345678901abcdef2345678901abcdef23456789'
  },
  {
    id: 'bc-agent-003',
    name: 'NFT Art Generator',
    type: 'Content Generation',
    capabilities: ['娱乐助理', '工作助理'],
    description: 'NFT艺术生成器，利用AI技术创建独特的数字艺术作品',
    version: '1.5.0',
    model: 'Stable Diffusion',
    apiEndpoint: 'https://api.nft-art-generator.com',
    status: 'active',
    createdAt: new Date('2024-01-10T00:00:00Z'),
    updatedAt: new Date('2024-01-25T00:00:00Z'),
    owner: '0x3456789012abcdef3456789012abcdef34567890'
  },
  {
    id: 'bc-agent-004',
    name: 'Health Monitor',
    type: 'AI Assistant',
    capabilities: ['健康助理', '生活助理'],
    description: '健康监控助手，提供健康数据分析和个性化建议',
    version: '1.2.0',
    model: 'BERT',
    apiEndpoint: 'https://api.health-monitor.com',
    status: 'active',
    createdAt: new Date('2024-01-12T00:00:00Z'),
    updatedAt: new Date('2024-01-22T00:00:00Z'),
    owner: '0x4567890123abcdef4567890123abcdef45678901'
  },
  {
    id: 'bc-agent-005',
    name: 'Smart Contract Auditor',
    type: 'Security',
    capabilities: ['工作助理', '客服助理'],
    description: '智能合约审计工具，自动化检测合约漏洞和安全风险',
    version: '3.0.0',
    model: 'Custom Security Model',
    apiEndpoint: 'https://api.contract-auditor.com',
    status: 'active',
    createdAt: new Date('2024-01-15T00:00:00Z'),
    updatedAt: new Date('2024-01-28T00:00:00Z'),
    owner: '0x5678901234abcdef5678901234abcdef56789012'
  },
  {
    id: 'bc-agent-006',
    name: 'Travel Planner',
    type: 'AI Assistant',
    capabilities: ['旅行助理', '生活助理'],
    description: '智能旅行规划助手，提供个性化的旅行建议和预订服务',
    version: '1.8.0',
    model: 'GPT-3.5',
    apiEndpoint: 'https://api.travel-planner.com',
    status: 'inactive',
    createdAt: new Date('2024-01-08T00:00:00Z'),
    updatedAt: new Date('2024-01-18T00:00:00Z'),
    owner: '0x6789012345abcdef6789012345abcdef67890123'
  },
  {
    id: 'bc-agent-007',
    name: 'Language Translator',
    type: 'AI Assistant',
    capabilities: ['工作助理', '学习助理'],
    description: '多语言翻译助手，支持100+语言的实时翻译',
    version: '2.5.0',
    model: 'Transformer',
    apiEndpoint: 'https://api.translator.com',
    status: 'active',
    createdAt: new Date('2024-01-20T00:00:00Z'),
    updatedAt: new Date('2024-01-30T00:00:00Z'),
    owner: '0x7890123456abcdef7890123456abcdef78901234'
  },
  {
    id: 'bc-agent-008',
    name: 'Data Analyst Pro',
    type: 'Data Processing',
    capabilities: ['工作助理', '财务助理'],
    description: '专业数据分析工具，提供深度数据洞察和可视化',
    version: '4.0.0',
    model: 'Random Forest + Neural Network',
    apiEndpoint: 'https://api.data-analyst.com',
    status: 'active',
    createdAt: new Date('2024-01-25T00:00:00Z'),
    updatedAt: new Date('2024-02-01T00:00:00Z'),
    owner: '0x8901234567abcdef8901234567abcdef89012345'
  }
];

// Agent身份合约模拟数据
export const mockAgentContracts: AgentIdentityContract[] = [
  {
    id: 'contract-001',
    contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
    contractName: 'Blockchain AI Assistant Contract',
    ownerAddress: '0x1234567890abcdef1234567890abcdef12345678',
    agentId: 'bc-agent-001',
    agentInfo: mockBlockchainAgents[0],
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
  },
  {
    id: 'contract-002',
    contractAddress: '0x9876543210fedcba9876543210fedcba98765432',
    contractName: 'DeFi Trading Bot Contract',
    ownerAddress: '0x2345678901abcdef2345678901abcdef23456789',
    agentId: 'bc-agent-002',
    agentInfo: mockBlockchainAgents[1],
    permissions: 'read-write',
    createdAt: new Date('2024-01-05T00:00:00Z'),
    updatedAt: new Date('2024-01-20T00:00:00Z'),
    status: 'active',
    metadata: {
      tags: ['DeFi', 'Trading', 'Automation'],
      description: '去中心化交易机器人的智能合约',
      securityLevel: 'high',
      compliance: ['KYC', 'AML']
    },
    blockchain: {
      network: 'Polygon',
      blockNumber: 25000000,
      transactionHash: '0x2222222222222222222222222222222222222222222222222222222222222222',
      gasUsed: 200000
    }
  },
  {
    id: 'contract-003',
    contractAddress: '0x5555555555555555555555555555555555555555',
    contractName: 'NFT Art Generator Contract',
    ownerAddress: '0x3456789012abcdef3456789012abcdef34567890',
    agentId: 'bc-agent-003',
    agentInfo: mockBlockchainAgents[2],
    permissions: 'read-write',
    createdAt: new Date('2024-01-10T00:00:00Z'),
    updatedAt: new Date('2024-01-25T00:00:00Z'),
    status: 'active',
    metadata: {
      tags: ['NFT', 'Art', 'Generation'],
      description: 'NFT艺术生成器的智能合约',
      securityLevel: 'medium',
      compliance: ['NFT-Standard']
    },
    blockchain: {
      network: 'BSC',
      blockNumber: 12000000,
      transactionHash: '0x3333333333333333333333333333333333333333333333333333333333333333',
      gasUsed: 180000
    }
  }
];

// Agent发现统计模拟数据
export const mockDiscoveryStats: AgentDiscoveryStats = {
  totalAgents: 13,
  activeAgents: 10,
  inactiveAgents: 2,
  verifiedAgents: 9,
  featuredAgents: 3,
  averageRating: 4.3,
  totalConnections: 8765,
  topCapabilities: [
    { capability: '工作助理', count: 6, percentage: 46.2 },
    { capability: '私人助理', count: 2, percentage: 15.4 },
    { capability: '生活助理', count: 2, percentage: 15.4 },
    { capability: '财务助理', count: 2, percentage: 15.4 },
    { capability: '健康助理', count: 1, percentage: 7.6 }
  ],
  topTypes: [
    { type: 'AI Assistant', count: 5, percentage: 38.5 },
    { type: 'Automation', count: 1, percentage: 7.7 },
    { type: 'Content Generation', count: 1, percentage: 7.7 },
    { type: 'Security', count: 1, percentage: 7.7 },
    { type: 'Data Processing', count: 1, percentage: 7.7 }
  ],
  networkDistribution: [
    { network: 'Ethereum', count: 8, percentage: 61.5 },
    { network: 'Polygon', count: 3, percentage: 23.1 },
    { network: 'BSC', count: 2, percentage: 15.4 }
  ],
  statusDistribution: [
    { status: 'active', count: 10, percentage: 76.9 },
    { status: 'inactive', count: 2, percentage: 15.4 },
    { status: 'stopped', count: 1, percentage: 7.7 }
  ],
  dailyStats: [
    { date: '2024-01-22', newAgents: 2, activeAgents: 8, totalCalls: 15420 },
    { date: '2024-01-23', newAgents: 1, activeAgents: 9, totalCalls: 16230 },
    { date: '2024-01-24', newAgents: 3, activeAgents: 10, totalCalls: 18950 },
    { date: '2024-01-25', newAgents: 2, activeAgents: 10, totalCalls: 17890 },
    { date: '2024-01-26', newAgents: 1, activeAgents: 9, totalCalls: 16450 },
    { date: '2024-01-27', newAgents: 4, activeAgents: 10, totalCalls: 21200 },
    { date: '2024-01-28', newAgents: 0, activeAgents: 10, totalCalls: 15800 }
  ]
};

// 通信状态模拟数据
export const mockCommunicationStatuses: Record<string, AgentCommunicationStatus> = {
  '1': {
    status: 'idle',
    currentLoad: 25,
    maxCapacity: 100,
    responseTime: 150,
    lastActivity: new Date(Date.now() - 5 * 60 * 1000),
    channels: [
      {
        id: 'channel-1-1',
        name: 'HTTP API',
        type: 'http',
        endpoint: 'https://api.agentid.com/agents/1',
        protocol: 'HTTP/1.1',
        status: 'connected',
        lastConnected: new Date(),
        supportedMethods: ['message', 'call', 'data_request'],
        security: {
          authentication: 'api_key',
          encryption: 'tls',
          authorization: ['read', 'write']
        }
      }
    ]
  },
  '2': {
    status: 'busy',
    currentLoad: 85,
    maxCapacity: 100,
    responseTime: 450,
    lastActivity: new Date(Date.now() - 1 * 60 * 1000),
    channels: [
      {
        id: 'channel-2-1',
        name: 'WebSocket',
        type: 'websocket',
        endpoint: 'wss://api.agentid.com/agents/2/ws',
        protocol: 'WebSocket',
        status: 'connected',
        lastConnected: new Date(),
        supportedMethods: ['message', 'call'],
        security: {
          authentication: 'jwt',
          encryption: 'tls',
          authorization: ['read', 'write', 'execute']
        }
      }
    ]
  },
  'bc-agent-001': {
    status: 'idle',
    currentLoad: 15,
    maxCapacity: 100,
    responseTime: 200,
    lastActivity: new Date(Date.now() - 10 * 60 * 1000),
    channels: [
      {
        id: 'channel-bc-1-1',
        name: 'Blockchain Channel',
        type: 'grpc',
        endpoint: 'grpc://api.blockchain-ai.com:443',
        protocol: 'gRPC',
        status: 'connected',
        lastConnected: new Date(),
        supportedMethods: ['message', 'call', 'data_request', 'command'],
        security: {
          authentication: 'certificate',
          encryption: 'tls',
          authorization: ['read', 'write', 'execute', 'admin']
        }
      }
    ]
  }
};

// 搜索历史模拟数据
export const mockSearchHistory = [
  {
    id: 'search-1',
    query: 'AI Assistant',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    resultsCount: 5,
    filters: {
      type: ['AI Assistant'],
      status: ['active']
    }
  },
  {
    id: 'search-2',
    query: 'Data Processing',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    resultsCount: 3,
    filters: {
      capabilities: ['工作助理'],
      minRating: 4.0
    }
  },
  {
    id: 'search-3',
    query: 'Security',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    resultsCount: 2,
    filters: {
      type: ['Security'],
      isVerified: true
    }
  }
];

// 生成随机Agent发现项的辅助函数
export function generateRandomAgentDiscoveryItem(baseAgent: Agent, blockchainAgent?: BlockchainAgent): AgentDiscoveryItem {
  const isBlockchain = !!blockchainAgent;

  return {
    ...baseAgent,
    description: baseAgent.description,
    blockchainInfo: isBlockchain ? {
      contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      network: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum'][Math.floor(Math.random() * 4)],
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      gasUsed: Math.floor(Math.random() * 200000) + 50000,
      isOnChain: true,
      verificationStatus: ['verified', 'pending', 'failed', 'unverified'][Math.floor(Math.random() * 4)] as any,
      verificationDate: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
      chainId: [1, 137, 56, 42161][Math.floor(Math.random() * 4)],
      lastSyncedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
      syncStatus: ['synced', 'syncing', 'failed'][Math.floor(Math.random() * 3)] as any
    } : {
      isOnChain: false,
      verificationStatus: 'unverified',
      syncStatus: 'synced'
    },
    contractInfo: isBlockchain ? {
      contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      contractName: blockchainAgent!.name,
      ownerAddress: blockchainAgent!.owner,
      permissions: ['read-only', 'read-write', 'admin'][Math.floor(Math.random() * 3)] as any,
      createdAt: blockchainAgent!.createdAt,
      updatedAt: blockchainAgent!.updatedAt,
      status: ['active', 'pending', 'suspended', 'terminated'][Math.floor(Math.random() * 4)] as any,
      metadata: {
        tags: blockchainAgent!.capabilities,
        description: blockchainAgent!.description,
        securityLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
        compliance: ['GDPR', 'CCPA', 'SOC2', 'KYC', 'AML'].slice(0, Math.floor(Math.random() * 3) + 1)
      },
      blockchain: {
        network: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum'][Math.floor(Math.random() * 4)],
        blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
        transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        gasUsed: Math.floor(Math.random() * 200000) + 50000
      }
    } : undefined,
    rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
    reviewCount: Math.floor(Math.random() * 1000) + 10,
    tags: isBlockchain ? blockchainAgent!.capabilities : ['Traditional', 'On-Premise'],
    isVerified: Math.random() > 0.3,
    isFeatured: Math.random() > 0.8,
    popularity: Math.floor(Math.random() * 100),
    connections: Math.floor(Math.random() * 100),
    responseTime: Math.floor(Math.random() * 1000) + 50,
    uptime: Math.round((95 + Math.random() * 5) * 10) / 10,
    lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    categories: isBlockchain ? [blockchainAgent!.type] : ['Traditional'],
    apiEndpoint: isBlockchain ? blockchainAgent!.apiEndpoint : `https://api.agentid.com/agents/${baseAgent.id}`,
    model: isBlockchain ? blockchainAgent!.model : 'Custom Model',
    version: isBlockchain ? blockchainAgent!.version : '1.0.0',
    stats: {
      totalCalls: Math.floor(Math.random() * 50000),
      successRate: Math.round((90 + Math.random() * 10) * 10) / 10,
      averageResponseTime: Math.floor(Math.random() * 500) + 100,
      errorRate: Math.round(Math.random() * 10 * 10) / 10,
      uptimePercentage: Math.round((95 + Math.random() * 5) * 10) / 10
    },
    metadata: {
      website: `https://${baseAgent.name.toLowerCase().replace(/\s+/g, '-')}.com`,
      documentation: `https://docs.${baseAgent.name.toLowerCase().replace(/\s+/g, '-')}.com`,
      github: `https://github.com/${baseAgent.name.toLowerCase().replace(/\s+/g, '-')}`,
      socialLinks: {
        twitter: `@${baseAgent.name.toLowerCase().replace(/\s+/g, '')}`,
        linkedin: `https://linkedin.com/company/${baseAgent.name.toLowerCase().replace(/\s+/g, '-')}`,
        discord: `https://discord.gg/${baseAgent.name.toLowerCase().replace(/\s+/g, '-')}`
      },
      pricing: {
        type: ['free', 'paid', 'freemium'][Math.floor(Math.random() * 3)] as any,
        price: Math.random() > 0.5 ? Math.floor(Math.random() * 200) + 10 : undefined,
        currency: 'USD'
      }
    }
  };
}

// 生成模拟的Agent发现列表
export function generateMockAgentDiscoveryList(): AgentDiscoveryItem[] {
  const items: AgentDiscoveryItem[] = [];

  // 添加基础Agent
  mockBaseAgents.forEach(agent => {
    items.push(generateRandomAgentDiscoveryItem(agent));
  });

  // 添加区块链Agent
  mockBlockchainAgents.forEach(agent => {
    items.push(generateRandomAgentDiscoveryItem({
      id: agent.id,
      agentId: agent.id,
      name: agent.name,
      description: agent.description,
      codeHash: '',
      profileHash: '',
      status: agent.status === 'development' ? 'active' : agent.status === 'deprecated' ? 'inactive' : agent.status,
      boundUser: '',
      boundAt: '',
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString(),
      codeSize: Math.floor(Math.random() * 1000) + 100,
      language: 'solidity',
      config: {
        permissions: ['read', 'write', 'execute'],
        userBinding: {
          boundUserId: '',
          bindingType: 'multiFactor',
          bindingStrength: 'strict',
          verificationFrequency: 'daily',
          fallbackAllowed: false
        }
      },
      permissions: ['read', 'write', 'execute']
    }, agent));
  });

  return items;
}