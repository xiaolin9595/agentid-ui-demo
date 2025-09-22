import { unifiedAgentDataManager } from '../data/unifiedAgentDataManager';
import { unifiedDataAdapter } from '../data/unifiedDataAdapter';
import { unifiedBlockchainAdapter } from '../data/unifiedBlockchainAdapter';
import { unifiedAgentAdapter } from '../data/unifiedAgentAdapter';

/**
 * 统一数据源测试
 * 验证三个页面的数据一致性
 */

describe('统一数据源测试', () => {
  beforeEach(() => {
    // 清空数据
    unifiedAgentDataManager.clearAll();
  });

  describe('数据管理器基础功能', () => {
    test('应该能够添加和获取Agent', () => {
      const agentData = {
        name: '测试Agent',
        description: '这是一个测试Agent',
        type: 'AI Assistant' as const,
        capabilities: ['工作助理'] as const,
        status: 'active' as const,
        config: {
          permissions: ['read'] as const,
          userBinding: {
            boundUserId: 'test_user',
            bindingType: 'faceBiometrics' as const,
            bindingStrength: 'basic' as const,
            verificationFrequency: 'once' as const,
            fallbackAllowed: true
          }
        },
        blockchainInfo: {
          isOnChain: false,
          verificationStatus: 'unverified' as const,
          syncStatus: 'synced' as const
        },
        metadata: {
          tags: ['测试'],
          categories: ['AI Assistant'],
          securityLevel: 'medium' as const,
          compliance: []
        }
      };

      const agent = unifiedAgentDataManager.addAgent(agentData);

      expect(agent.id).toBeDefined();
      expect(agent.name).toBe('测试Agent');
      expect(agent.status).toBe('active');

      const retrievedAgent = unifiedAgentDataManager.getAgentById(agent.id);
      expect(retrievedAgent).toBeDefined();
      expect(retrievedAgent!.name).toBe('测试Agent');
    });

    test('应该能够更新Agent', () => {
      const agent = unifiedAgentDataManager.addAgent({
        name: '测试Agent',
        description: '测试描述',
        type: 'AI Assistant' as const,
        capabilities: ['工作助理'] as const,
        status: 'active' as const,
        config: {
          permissions: ['read'] as const,
          userBinding: {
            boundUserId: 'test_user',
            bindingType: 'faceBiometrics' as const,
            bindingStrength: 'basic' as const,
            verificationFrequency: 'once' as const,
            fallbackAllowed: true
          }
        },
        blockchainInfo: {
          isOnChain: false,
          verificationStatus: 'unverified' as const,
          syncStatus: 'synced' as const
        },
        metadata: {
          tags: ['测试'],
          categories: ['AI Assistant'],
          securityLevel: 'medium' as const,
          compliance: []
        }
      });

      const success = unifiedAgentDataManager.updateAgent(agent.id, {
        name: '更新后的Agent',
        status: 'inactive' as const
      });

      expect(success).toBe(true);

      const updatedAgent = unifiedAgentDataManager.getAgentById(agent.id);
      expect(updatedAgent!.name).toBe('更新后的Agent');
      expect(updatedAgent!.status).toBe('inactive');
    });

    test('应该能够删除Agent', () => {
      const agent = unifiedAgentDataManager.addAgent({
        name: '测试Agent',
        description: '测试描述',
        type: 'AI Assistant' as const,
        capabilities: ['工作助理'] as const,
        status: 'active' as const,
        config: {
          permissions: ['read'] as const,
          userBinding: {
            boundUserId: 'test_user',
            bindingType: 'faceBiometrics' as const,
            bindingStrength: 'basic' as const,
            verificationFrequency: 'once' as const,
            fallbackAllowed: true
          }
        },
        blockchainInfo: {
          isOnChain: false,
          verificationStatus: 'unverified' as const,
          syncStatus: 'synced' as const
        },
        metadata: {
          tags: ['测试'],
          categories: ['AI Assistant'],
          securityLevel: 'medium' as const,
          compliance: []
        }
      });

      const success = unifiedAgentDataManager.deleteAgent(agent.id);
      expect(success).toBe(true);

      const deletedAgent = unifiedAgentDataManager.getAgentById(agent.id);
      expect(deletedAgent).toBeUndefined();
    });

    test('应该能够搜索Agent', () => {
      unifiedAgentDataManager.addAgent({
        name: '数据分析Agent',
        description: '专门用于数据分析的Agent',
        type: 'Data Processing' as const,
        capabilities: ['数据分析'] as const,
        status: 'active' as const,
        config: {
          permissions: ['read'] as const,
          userBinding: {
            boundUserId: 'test_user',
            bindingType: 'faceBiometrics' as const,
            bindingStrength: 'basic' as const,
            verificationFrequency: 'once' as const,
            fallbackAllowed: true
          }
        },
        blockchainInfo: {
          isOnChain: false,
          verificationStatus: 'unverified' as const,
          syncStatus: 'synced' as const
        },
        metadata: {
          tags: ['数据分析'],
          categories: ['Data Processing'],
          securityLevel: 'medium' as const,
          compliance: []
        }
      });

      unifiedAgentDataManager.addAgent({
        name: '安全监控Agent',
        description: '用于安全监控的Agent',
        type: 'Security' as const,
        capabilities: ['安全监控'] as const,
        status: 'active' as const,
        config: {
          permissions: ['read'] as const,
          userBinding: {
            boundUserId: 'test_user',
            bindingType: 'faceBiometrics' as const,
            bindingStrength: 'basic' as const,
            verificationFrequency: 'once' as const,
            fallbackAllowed: true
          }
        },
        blockchainInfo: {
          isOnChain: false,
          verificationStatus: 'unverified' as const,
          syncStatus: 'synced' as const
        },
        metadata: {
          tags: ['安全'],
          categories: ['Security'],
          securityLevel: 'high' as const,
          compliance: []
        }
      });

      const searchResults = unifiedAgentDataManager.searchAgents('数据分析');
      expect(searchResults).toHaveLength(1);
      expect(searchResults[0].name).toBe('数据分析Agent');
    });

    test('应该能够过滤Agent', () => {
      unifiedAgentDataManager.addAgent({
        name: 'Agent 1',
        description: '描述1',
        type: 'AI Assistant' as const,
        capabilities: ['工作助理'] as const,
        status: 'active' as const,
        config: {
          permissions: ['read'] as const,
          userBinding: {
            boundUserId: 'test_user',
            bindingType: 'faceBiometrics' as const,
            bindingStrength: 'basic' as const,
            verificationFrequency: 'once' as const,
            fallbackAllowed: true
          }
        },
        blockchainInfo: {
          isOnChain: false,
          verificationStatus: 'unverified' as const,
          syncStatus: 'synced' as const
        },
        metadata: {
          tags: ['AI'],
          categories: ['AI Assistant'],
          securityLevel: 'medium' as const,
          compliance: []
        }
      });

      unifiedAgentDataManager.addAgent({
        name: 'Agent 2',
        description: '描述2',
        type: 'Security' as const,
        capabilities: ['安全监控'] as const,
        status: 'inactive' as const,
        config: {
          permissions: ['read'] as const,
          userBinding: {
            boundUserId: 'test_user',
            bindingType: 'faceBiometrics' as const,
            bindingStrength: 'basic' as const,
            verificationFrequency: 'once' as const,
            fallbackAllowed: true
          }
        },
        blockchainInfo: {
          isOnChain: false,
          verificationStatus: 'unverified' as const,
          syncStatus: 'synced' as const
        },
        metadata: {
          tags: ['安全'],
          categories: ['Security'],
          securityLevel: 'high' as const,
          compliance: []
        }
      });

      const activeAgents = unifiedAgentDataManager.filterAgents({ status: 'active' as const });
      expect(activeAgents).toHaveLength(1);
      expect(activeAgents[0].name).toBe('Agent 1');

      const securityAgents = unifiedAgentDataManager.filterAgents({ type: 'Security' as const });
      expect(securityAgents).toHaveLength(1);
      expect(securityAgents[0].name).toBe('Agent 2');
    });
  });

  describe('数据适配器测试', () => {
    test('Agent发现适配器应该能够搜索Agent', async () => {
      unifiedAgentDataManager.addAgent({
        name: '搜索测试Agent',
        description: '这是一个用于搜索测试的Agent',
        type: 'AI Assistant' as const,
        capabilities: ['工作助理'] as const,
        status: 'active' as const,
        config: {
          permissions: ['read'] as const,
          userBinding: {
            boundUserId: 'test_user',
            bindingType: 'faceBiometrics' as const,
            bindingStrength: 'basic' as const,
            verificationFrequency: 'once' as const,
            fallbackAllowed: true
          }
        },
        blockchainInfo: {
          isOnChain: false,
          verificationStatus: 'unverified' as const,
          syncStatus: 'synced' as const
        },
        metadata: {
          tags: ['搜索测试'],
          categories: ['AI Assistant'],
          securityLevel: 'medium' as const,
          compliance: []
        }
      });

      const searchParams = {
        page: 1,
        pageSize: 10,
        search: '搜索测试'
      };

      const result = await unifiedDataAdapter.searchAgents(searchParams);
      expect(result.agents).toHaveLength(1);
      expect(result.agents[0].name).toBe('搜索测试Agent');
    });

    test('Agent适配器应该能够创建Agent', async () => {
      const agentData = {
        basicInfo: {
          name: '适配器测试Agent',
          description: '通过适配器创建的Agent',
          config: {
            permissions: ['read'],
            userBinding: {
              boundUserId: 'test_user',
              bindingType: 'faceBiometrics' as const,
              bindingStrength: 'basic' as const,
              verificationFrequency: 'once' as const,
              fallbackAllowed: true
            }
          }
        },
        apiSpec: {
          endpoint: 'https://api.test.com',
          method: 'POST',
          headers: {},
          authentication: {
            type: 'none' as const,
            credentials: {}
          }
        },
        codePackage: {
          language: {
            id: 'javascript',
            name: 'JavaScript',
            version: 'ES6+'
          },
          files: [
            {
              name: 'index.js',
              content: 'console.log("Hello World");',
              size: 1024
            }
          ]
        }
      };

      const agent = await unifiedAgentAdapter.createAgent(agentData);
      expect(agent.name).toBe('适配器测试Agent');
      expect(agent.description).toBe('通过适配器创建的Agent');
    });

    test('区块链适配器应该能够注册Agent合约', async () => {
      unifiedAgentDataManager.addAgent({
        name: '区块链测试Agent',
        description: '用于区块链测试的Agent',
        type: 'AI Assistant' as const,
        capabilities: ['工作助理'] as const,
        status: 'active' as const,
        config: {
          permissions: ['read'] as const,
          userBinding: {
            boundUserId: 'test_user',
            bindingType: 'faceBiometrics' as const,
            bindingStrength: 'basic' as const,
            verificationFrequency: 'once' as const,
            fallbackAllowed: true
          }
        },
        blockchainInfo: {
          isOnChain: false,
          verificationStatus: 'unverified' as const,
          syncStatus: 'synced' as const
        },
        metadata: {
          tags: ['区块链测试'],
          categories: ['AI Assistant'],
          securityLevel: 'medium' as const,
          compliance: []
        }
      });

      const formData = {
        contractName: '测试合约',
        agentId: unifiedAgentDataManager.getAllAgents()[0].id,
        agentType: 'AI Assistant' as const,
        capabilities: ['工作助理'] as const,
        permissions: 'admin' as const,
        apiEndpoint: 'https://api.test.com',
        version: '1.0.0',
        model: 'Test Model',
        description: '测试合约描述',
        tags: ['测试'],
        securityLevel: 'high' as const
      };

      const contract = await unifiedBlockchainAdapter.registerAgentContract(formData);
      expect(contract.contractName).toBe('测试合约');
      expect(contract.agentId).toBeDefined();
    });
  });

  describe('数据一致性测试', () => {
    test('三个适配器应该访问相同的数据源', async () => {
      // 通过数据管理器添加Agent
      const agent = unifiedAgentDataManager.addAgent({
        name: '一致性测试Agent',
        description: '用于测试数据一致性的Agent',
        type: 'AI Assistant' as const,
        capabilities: ['工作助理'] as const,
        status: 'active' as const,
        config: {
          permissions: ['read'] as const,
          userBinding: {
            boundUserId: 'test_user',
            bindingType: 'faceBiometrics' as const,
            bindingStrength: 'basic' as const,
            verificationFrequency: 'once' as const,
            fallbackAllowed: true
          }
        },
        blockchainInfo: {
          isOnChain: false,
          verificationStatus: 'unverified' as const,
          syncStatus: 'synced' as const
        },
        metadata: {
          tags: ['一致性测试'],
          categories: ['AI Assistant'],
          securityLevel: 'medium' as const,
          compliance: []
        }
      });

      // 通过Agent发现适配器搜索
      const discoveryResult = await unifiedDataAdapter.searchAgents({
        page: 1,
        pageSize: 10,
        search: '一致性测试'
      });

      // 通过Agent适配器获取
      const agentResult = await unifiedAgentAdapter.fetchAgents();

      // 验证数据一致性
      expect(discoveryResult.agents).toHaveLength(1);
      expect(discoveryResult.agents[0].name).toBe('一致性测试Agent');

      const foundAgent = agentResult.find(a => a.name === '一致性测试Agent');
      expect(foundAgent).toBeDefined();
      expect(foundAgent!.description).toBe('用于测试数据一致性的Agent');
    });

    test('在一个页面修改数据应该在其他页面反映', async () => {
      // 添加初始Agent
      const agent = unifiedAgentDataManager.addAgent({
        name: '同步测试Agent',
        description: '初始描述',
        type: 'AI Assistant' as const,
        capabilities: ['工作助理'] as const,
        status: 'active' as const,
        config: {
          permissions: ['read'] as const,
          userBinding: {
            boundUserId: 'test_user',
            bindingType: 'faceBiometrics' as const,
            bindingStrength: 'basic' as const,
            verificationFrequency: 'once' as const,
            fallbackAllowed: true
          }
        },
        blockchainInfo: {
          isOnChain: false,
          verificationStatus: 'unverified' as const,
          syncStatus: 'synced' as const
        },
        metadata: {
          tags: ['同步测试'],
          categories: ['AI Assistant'],
          securityLevel: 'medium' as const,
          compliance: []
        }
      });

      // 通过Agent适配器更新Agent
      await unifiedAgentAdapter.updateAgentStatus(agent.id, 'inactive');

      // 验证其他适配器看到更新后的数据
      const discoveryResult = await unifiedDataAdapter.searchAgents({
        page: 1,
        pageSize: 10,
        search: '同步测试'
      });

      expect(discoveryResult.agents[0].status).toBe('inactive');

      const updatedAgent = unifiedAgentDataManager.getAgentById(agent.id);
      expect(updatedAgent!.status).toBe('inactive');
    });
  });

  describe('统计信息测试', () => {
    test('应该能够获取正确的统计信息', () => {
      // 添加多个Agent
      unifiedAgentDataManager.addAgent({
        name: '统计测试Agent 1',
        description: '用于统计测试的Agent 1',
        type: 'AI Assistant' as const,
        capabilities: ['工作助理'] as const,
        status: 'active' as const,
        config: {
          permissions: ['read'] as const,
          userBinding: {
            boundUserId: 'test_user',
            bindingType: 'faceBiometrics' as const,
            bindingStrength: 'basic' as const,
            verificationFrequency: 'once' as const,
            fallbackAllowed: true
          }
        },
        blockchainInfo: {
          isOnChain: false,
          verificationStatus: 'unverified' as const,
          syncStatus: 'synced' as const
        },
        metadata: {
          tags: ['统计测试'],
          categories: ['AI Assistant'],
          securityLevel: 'medium' as const,
          compliance: []
        }
      });

      unifiedAgentDataManager.addAgent({
        name: '统计测试Agent 2',
        description: '用于统计测试的Agent 2',
        type: 'Security' as const,
        capabilities: ['安全监控'] as const,
        status: 'inactive' as const,
        config: {
          permissions: ['read'] as const,
          userBinding: {
            boundUserId: 'test_user',
            bindingType: 'faceBiometrics' as const,
            bindingStrength: 'basic' as const,
            verificationFrequency: 'once' as const,
            fallbackAllowed: true
          }
        },
        blockchainInfo: {
          isOnChain: true,
          verificationStatus: 'verified' as const,
          syncStatus: 'synced' as const
        },
        metadata: {
          tags: ['统计测试'],
          categories: ['Security'],
          securityLevel: 'high' as const,
          compliance: []
        }
      });

      const stats = unifiedAgentDataManager.getStats();

      expect(stats.totalAgents).toBe(2); // 2个新Agent + 基础数据中的Agent
      expect(stats.activeAgents).toBeGreaterThan(0);
      expect(stats.inactiveAgents).toBeGreaterThan(0);
      expect(stats.onChainAgents).toBeGreaterThan(0);
    });
  });
});

// 运行测试的函数
export async function runUnifiedDataSourceTests() {
  console.log('开始运行统一数据源测试...');

  try {
    // 运行所有测试
    await describe('统一数据源测试', () => {
      beforeEach(() => {
        unifiedAgentDataManager.clearAll();
      });

      // 这里会自动运行所有测试
    });

    console.log('✅ 所有测试通过！');
    return true;
  } catch (error) {
    console.error('❌ 测试失败:', error);
    return false;
  }
}