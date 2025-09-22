import { Agent } from '../types';

// 统一的Agent数据源，被三个页面共享
export let sharedAgents: Agent[] = [
  {
    id: 'agent_shared_001',
    agentId: 'agent_001',
    name: 'Claude AI Assistant',
    description: '基于大语言模型的AI助手，支持自然语言交互和代码生成',
    codeHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    profileHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    status: 'active',
    boundUser: 'user_001',
    boundAt: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T15:45:00Z',
    codeSize: 1024000,
    language: 'typescript',
    config: {
      permissions: ['read', 'write'],
      userBinding: {
        boundUserId: 'user_001',
        bindingType: 'faceBiometrics',
        bindingStrength: 'basic',
        verificationFrequency: 'once',
        fallbackAllowed: true
      }
    },
    permissions: ['read', 'write']
  },
  {
    id: 'agent_shared_002',
    agentId: 'agent_002',
    name: 'Data Analyzer Pro',
    description: '专业数据分析工具，支持机器学习模型训练和预测',
    codeHash: '0x2345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef',
    profileHash: '0xbcdefa1234567890bcdefa1234567890bcdefa1234567890bcdefa1234567890',
    status: 'active',
    boundUser: 'user_002',
    boundAt: '2024-01-16T11:00:00Z',
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-21T16:30:00Z',
    codeSize: 2048000,
    language: 'python',
    config: {
      permissions: ['read', 'write', 'execute'],
      userBinding: {
        boundUserId: 'user_002',
        bindingType: 'faceBiometrics',
        bindingStrength: 'enhanced',
        verificationFrequency: 'daily',
        fallbackAllowed: false
      }
    },
    permissions: ['read', 'write', 'execute']
  },
  {
    id: 'agent_shared_003',
    agentId: 'agent_003',
    name: 'Security Monitor',
    description: 'AI安全监控系统，支持异常检测和威胁识别',
    codeHash: '0x3456789012abcdef3456789012abcdef3456789012abcdef3456789012abcdef',
    profileHash: '0xcdefab1234567890cdefab1234567890cdefab1234567890cdefab1234567890',
    status: 'inactive',
    boundUser: 'user_003',
    boundAt: '2024-01-17T12:00:00Z',
    createdAt: '2024-01-17T12:00:00Z',
    updatedAt: '2024-01-22T17:00:00Z',
    codeSize: 1536000,
    language: 'solidity',
    config: {
      permissions: ['read'],
      userBinding: {
        boundUserId: 'user_003',
        bindingType: 'multiFactor',
        bindingStrength: 'strict',
        verificationFrequency: 'perRequest',
        fallbackAllowed: false
      }
    },
    permissions: ['read']
  }
];

// 数据操作函数
export const sharedAgentData = {
  // 获取所有Agent
  getAgents: () => sharedAgents,

  // 添加新Agent
  addAgent: (agent: Agent) => {
    const newAgent = {
      ...agent,
      id: `agent_shared_${Date.now()}`,
      agentId: `agent_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    sharedAgents = [newAgent, ...sharedAgents];
    return newAgent;
  },

  // 更新Agent
  updateAgent: (id: string, updates: Partial<Agent>) => {
    sharedAgents = sharedAgents.map(agent =>
      agent.id === id ? { ...agent, ...updates, updatedAt: new Date().toISOString() } : agent
    );
    return sharedAgents.find(agent => agent.id === id);
  },

  // 删除Agent
  deleteAgent: (id: string) => {
    sharedAgents = sharedAgents.filter(agent => agent.id !== id);
  },

  // 根据ID查找Agent
  findAgent: (id: string) => {
    return sharedAgents.find(agent => agent.id === id);
  },

  // 搜索Agent
  searchAgents: (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return sharedAgents.filter(agent =>
      agent.name.toLowerCase().includes(lowercaseQuery) ||
      agent.description.toLowerCase().includes(lowercaseQuery)
    );
  },

  // 重置数据
  resetData: () => {
    sharedAgents = [
      // 重置为初始数据
      {
        id: 'agent_shared_001',
        agentId: 'agent_001',
        name: 'Claude AI Assistant',
        description: '基于大语言模型的AI助手，支持自然语言交互和代码生成',
        codeHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        profileHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        status: 'active',
        boundUser: 'user_001',
        boundAt: '2024-01-15T10:30:00Z',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T15:45:00Z',
        codeSize: 1024000,
        language: 'typescript',
        config: {
          permissions: ['read', 'write'],
          userBinding: {
            boundUserId: 'user_001',
            bindingType: 'faceBiometrics',
            bindingStrength: 'basic',
            verificationFrequency: 'once',
            fallbackAllowed: true
          }
        },
        permissions: ['read', 'write']
      },
      {
        id: 'agent_shared_002',
        agentId: 'agent_002',
        name: 'Data Analyzer Pro',
        description: '专业数据分析工具，支持机器学习模型训练和预测',
        codeHash: '0x2345678901abcdef2345678901abcdef2345678901abcdef2345678901abcdef',
        profileHash: '0xbcdefa1234567890bcdefa1234567890bcdefa1234567890bcdefa1234567890',
        status: 'active',
        boundUser: 'user_002',
        boundAt: '2024-01-16T11:00:00Z',
        createdAt: '2024-01-16T11:00:00Z',
        updatedAt: '2024-01-21T16:30:00Z',
        codeSize: 2048000,
        language: 'python',
        config: {
          permissions: ['read', 'write', 'execute'],
          userBinding: {
            boundUserId: 'user_002',
            bindingType: 'faceBiometrics',
            bindingStrength: 'enhanced',
            verificationFrequency: 'daily',
            fallbackAllowed: false
          }
        },
        permissions: ['read', 'write', 'execute']
      },
      {
        id: 'agent_shared_003',
        agentId: 'agent_003',
        name: 'Security Monitor',
        description: 'AI安全监控系统，支持异常检测和威胁识别',
        codeHash: '0x3456789012abcdef3456789012abcdef3456789012abcdef3456789012abcdef',
        profileHash: '0xcdefab1234567890cdefab1234567890cdefab1234567890cdefab1234567890',
        status: 'inactive',
        boundUser: 'user_003',
        boundAt: '2024-01-17T12:00:00Z',
        createdAt: '2024-01-17T12:00:00Z',
        updatedAt: '2024-01-22T17:00:00Z',
        codeSize: 1536000,
        language: 'solidity',
        config: {
          permissions: ['read'],
          userBinding: {
            boundUserId: 'user_003',
            bindingType: 'multiFactor',
            bindingStrength: 'strict',
            verificationFrequency: 'perRequest',
            fallbackAllowed: false
          }
        },
        permissions: ['read']
      }
    ];
  }
};