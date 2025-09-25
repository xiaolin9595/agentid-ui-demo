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
    permissions: ['read', 'write'],
    role: '通用助手',
    taskRequirements: ['文本生成', '代码编写', '问答', '翻译'],
    specialties: ['自然语言处理', '代码生成', '多语言支持'],
    rating: 4.8,
    connections: 156,
    tags: ['AI', 'LLM', '助手']
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
    permissions: ['read', 'write', 'execute'],
    role: '数据分析师',
    taskRequirements: ['数据清洗', '统计分析', '机器学习', '预测建模'],
    specialties: ['Python', 'pandas', 'scikit-learn', 'TensorFlow'],
    rating: 4.6,
    connections: 89,
    tags: ['数据科学', '机器学习', 'Python']
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
    permissions: ['read'],
    role: '安全专家',
    taskRequirements: ['威胁检测', '安全监控', '漏洞扫描', '入侵检测'],
    specialties: ['网络安全', '区块链安全', '智能合约审计'],
    rating: 4.7,
    connections: 67,
    tags: ['安全', '区块链', 'Solidity']
  },
  {
    id: 'agent_shared_004',
    agentId: 'agent_004',
    name: 'Finance Advisor Pro',
    description: '专业财务顾问AI，提供投资建议和财务规划服务',
    codeHash: '0x4567890123abcdef4567890123abcdef4567890123abcdef4567890123abcdef',
    profileHash: '0xdefabc1234567890defabc1234567890defabc1234567890defabc1234567890',
    status: 'active',
    boundUser: '1-175826628',
    boundAt: '2024-01-18T09:00:00Z',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-23T14:30:00Z',
    codeSize: 896000,
    language: 'java',
    config: {
      permissions: ['read', 'write'],
      userBinding: {
        boundUserId: '1-175826628',
        bindingType: 'faceBiometrics',
        bindingStrength: 'enhanced',
        verificationFrequency: 'daily',
        fallbackAllowed: true
      }
    },
    permissions: ['read', 'write'],
    role: '财务顾问',
    taskRequirements: ['投资分析', '风险评估', '财务规划', '市场预测'],
    specialties: ['金融市场', '投资组合管理', '风险控制'],
    rating: 4.9,
    connections: 203,
    tags: ['金融', '投资', '顾问']
  },
  {
    id: 'agent_shared_005',
    agentId: 'agent_005',
    name: 'Health Assistant',
    description: '智能健康助手，提供健康咨询和医疗建议',
    codeHash: '0x5678901234abcdef5678901234abcdef5678901234abcdef5678901234abcdef',
    profileHash: '0xefabcd1234567890efabcd1234567890efabcd1234567890efabcd1234567890',
    status: 'active',
    boundUser: 'lin-175879861',
    boundAt: '2024-01-19T08:30:00Z',
    createdAt: '2024-01-19T08:30:00Z',
    updatedAt: '2024-01-24T13:45:00Z',
    codeSize: 1280000,
    language: 'python',
    config: {
      permissions: ['read', 'write'],
      userBinding: {
        boundUserId: 'lin-175879861',
        bindingType: 'faceBiometrics',
        bindingStrength: 'basic',
        verificationFrequency: 'weekly',
        fallbackAllowed: true
      }
    },
    permissions: ['read', 'write'],
    role: '健康医生',
    taskRequirements: ['健康咨询', '症状分析', '用药建议', '康复指导'],
    specialties: ['医学知识', '健康监测', '疾病预防'],
    rating: 4.5,
    connections: 178,
    tags: ['健康', '医疗', '助手']
  },
  {
    id: 'agent_shared_006',
    agentId: 'agent_006',
    name: 'Family Care Assistant',
    description: '家庭生活助手，提供日常管理和家政服务建议',
    codeHash: '0x6789012345abcdef6789012345abcdef6789012345abcdef6789012345abcdef',
    profileHash: '0xfabcde1234567890fabcde1234567890fabcde1234567890fabcde1234567890',
    status: 'active',
    boundUser: 'user_004',
    boundAt: '2024-01-20T07:00:00Z',
    createdAt: '2024-01-20T07:00:00Z',
    updatedAt: '2024-01-25T12:00:00Z',
    codeSize: 768000,
    language: 'javascript',
    config: {
      permissions: ['read', 'write'],
      userBinding: {
        boundUserId: 'user_004',
        bindingType: 'faceBiometrics',
        bindingStrength: 'basic',
        verificationFrequency: 'once',
        fallbackAllowed: true
      }
    },
    permissions: ['read', 'write'],
    role: '家庭助理',
    taskRequirements: ['日程管理', '家政服务', '购物建议', '家庭娱乐'],
    specialties: ['生活管理', '家庭教育', '营养搭配'],
    rating: 4.3,
    connections: 145,
    tags: ['家庭', '生活', '管理']
  },
  {
    id: 'agent_shared_007',
    agentId: 'agent_007',
    name: 'Legal Advisor',
    description: '法律顾问AI，提供法律咨询和合同审查服务',
    codeHash: '0x7890123456abcdef7890123456abcdef7890123456abcdef7890123456abcdef',
    profileHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    status: 'active',
    boundUser: '1-175826628',
    boundAt: '2024-01-21T10:00:00Z',
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-26T15:00:00Z',
    codeSize: 1152000,
    language: 'python',
    config: {
      permissions: ['read', 'write'],
      userBinding: {
        boundUserId: '1-175826628',
        bindingType: 'multiFactor',
        bindingStrength: 'strict',
        verificationFrequency: 'daily',
        fallbackAllowed: false
      }
    },
    permissions: ['read', 'write'],
    role: '法律顾问',
    taskRequirements: ['法律咨询', '合同审查', '合规检查', '纠纷调解'],
    specialties: ['合同法', '公司法', '知识产权法'],
    rating: 4.7,
    connections: 92,
    tags: ['法律', '合规', '咨询']
  },
  {
    id: 'agent_shared_008',
    agentId: 'agent_008',
    name: 'Education Tutor',
    description: '智能教育导师，提供个性化学习计划和知识辅导',
    codeHash: '0x8901234567abcdef8901234567abcdef8901234567abcdef8901234567abcdef',
    profileHash: '0xbcdefa1234567890bcdefa1234567890bcdefa1234567890bcdefa1234567890',
    status: 'active',
    boundUser: 'lin-175879861',
    boundAt: '2024-01-22T11:30:00Z',
    createdAt: '2024-01-22T11:30:00Z',
    updatedAt: '2024-01-27T16:30:00Z',
    codeSize: 1536000,
    language: 'typescript',
    config: {
      permissions: ['read', 'write', 'execute'],
      userBinding: {
        boundUserId: 'lin-175879861',
        bindingType: 'faceBiometrics',
        bindingStrength: 'enhanced',
        verificationFrequency: 'weekly',
        fallbackAllowed: true
      }
    },
    permissions: ['read', 'write', 'execute'],
    role: '教育导师',
    taskRequirements: ['个性化教学', '知识问答', '学习计划', '考试辅导'],
    specialties: ['数学', '物理', '编程教育'],
    rating: 4.6,
    connections: 267,
    tags: ['教育', '学习', '导师']
  },
  {
    id: 'agent_shared_009',
    agentId: 'agent_009',
    name: 'HR Assistant',
    description: '人力资源管理助手，提供招聘和员工管理服务',
    codeHash: '0x9012345678abcdef9012345678abcdef9012345678abcdef9012345678abcdef',
    profileHash: '0xcdefab1234567890cdefab1234567890cdefab1234567890cdefab1234567890',
    status: 'active',
    boundUser: 'user_005',
    boundAt: '2024-01-23T09:30:00Z',
    createdAt: '2024-01-23T09:30:00Z',
    updatedAt: '2024-01-28T14:00:00Z',
    codeSize: 640000,
    language: 'java',
    config: {
      permissions: ['read', 'write'],
      userBinding: {
        boundUserId: 'user_005',
        bindingType: 'faceBiometrics',
        bindingStrength: 'basic',
        verificationFrequency: 'weekly',
        fallbackAllowed: true
      }
    },
    permissions: ['read', 'write'],
    role: '人力资源',
    taskRequirements: ['招聘筛选', '员工培训', '绩效评估', '薪资管理'],
    specialties: ['人才招聘', '员工关系', '培训发展'],
    rating: 4.4,
    connections: 134,
    tags: ['HR', '招聘', '管理']
  },
  {
    id: 'agent_shared_010',
    agentId: 'agent_010',
    name: 'Marketing Specialist',
    description: '市场营销专家，提供营销策略和推广方案',
    codeHash: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    profileHash: '0xdefabc1234567890defabc1234567890defabc1234567890defabc1234567890',
    status: 'active',
    boundUser: 'user_001',
    boundAt: '2024-01-24T08:00:00Z',
    createdAt: '2024-01-24T08:00:00Z',
    updatedAt: '2024-01-29T13:00:00Z',
    codeSize: 896000,
    language: 'javascript',
    config: {
      permissions: ['read', 'write', 'execute'],
      userBinding: {
        boundUserId: 'user_001',
        bindingType: 'faceBiometrics',
        bindingStrength: 'enhanced',
        verificationFrequency: 'weekly',
        fallbackAllowed: true
      }
    },
    permissions: ['read', 'write', 'execute'],
    role: '营销专家',
    taskRequirements: ['市场分析', '品牌推广', '内容营销', '社交媒体'],
    specialties: ['数字营销', '品牌策略', '内容创作'],
    rating: 4.5,
    connections: 189,
    tags: ['营销', '品牌', '推广']
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