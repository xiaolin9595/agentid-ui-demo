import { unifiedAgentDataManager } from '../data/unifiedAgentDataManager';
import { unifiedDataAdapter } from '../data/unifiedDataAdapter';
import { unifiedBlockchainAdapter } from '../data/unifiedBlockchainAdapter';
import { unifiedAgentAdapter } from '../data/unifiedAgentAdapter';

/**
 * 统一数据源演示
 * 展示三个页面如何共享统一的数据源
 */

export class UnifiedDataSourceDemo {
  async runDemo() {
    console.log('🚀 开始统一数据源演示...\n');

    // 1. 清空数据
    console.log('1️⃣ 清空现有数据...');
    unifiedAgentDataManager.clearAll();
    console.log('✅ 数据已清空\n');

    // 2. 添加初始Agent
    console.log('2️⃣ 添加初始Agent数据...');
    const agent1 = unifiedAgentDataManager.addAgent({
      name: '数据分析专家',
      description: '专门处理数据分析任务的智能代理，支持大规模数据处理和实时分析',
      type: 'Data Processing',
      capabilities: ['数据分析', '工作助理'],
      status: 'active',
      version: '2.1.0',
      language: 'python',
      codeSize: 1024000,
      boundUser: 'user_001',
      boundAt: new Date().toISOString(),
      config: {
        permissions: ['read', 'write', 'execute'],
        userBinding: {
          boundUserId: 'user_001',
          bindingType: 'faceBiometrics',
          bindingStrength: 'enhanced',
          verificationFrequency: 'daily',
          fallbackAllowed: false
        }
      },
      blockchainInfo: {
        isOnChain: false,
        verificationStatus: 'unverified',
        syncStatus: 'synced'
      },
      metadata: {
        tags: ['数据分析', 'Python', '机器学习'],
        categories: ['Data Processing'],
        securityLevel: 'high',
        compliance: ['GDPR', 'SOC2']
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
        popularity: 85
      }
    });

    const agent2 = unifiedAgentDataManager.addAgent({
      name: '区块链AI助手',
      description: '基于区块链技术的AI助手，提供安全可靠的智能服务',
      type: 'AI Assistant',
      capabilities: ['工作助理', '区块链操作'],
      status: 'active',
      version: '1.0.0',
      model: 'GPT-4',
      apiEndpoint: 'https://api.blockchain-ai.com',
      boundUser: '0x1234567890abcdef1234567890abcdef12345678',
      boundAt: new Date().toISOString(),
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
      blockchainInfo: {
        isOnChain: true,
        contractAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        network: 'Ethereum',
        blockNumber: 18000000,
        transactionHash: '0x1111111111111111111111111111111111111111111111111111111111111111',
        gasUsed: 150000,
        chainId: 1,
        verificationStatus: 'verified',
        verificationDate: new Date(),
        lastSyncedAt: new Date(),
        syncStatus: 'synced'
      },
      metadata: {
        website: 'https://blockchain-ai.com',
        tags: ['AI', '区块链', 'GPT-4'],
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
        popularity: 92
      }
    });

    console.log(`✅ 已添加 ${agent1.name} 和 ${agent2.name}\n`);

    // 3. 演示Agent发现页面
    console.log('3️⃣ 演示Agent发现页面功能...');
    await this.demoAgentDiscovery();
    console.log('✅ Agent发现页面演示完成\n');

    // 4. 演示Agent管理页面
    console.log('4️⃣ 演示Agent管理页面功能...');
    await this.demoAgentManagement();
    console.log('✅ Agent管理页面演示完成\n');

    // 5. 演示区块链页面
    console.log('5️⃣ 演示区块链页面功能...');
    await this.demoBlockchain();
    console.log('✅ 区块链页面演示完成\n');

    // 6. 演示数据同步
    console.log('6️⃣ 演示数据同步功能...');
    await this.demoDataSync();
    console.log('✅ 数据同步演示完成\n');

    // 7. 显示最终统计
    console.log('7️⃣ 最终数据统计...');
    this.showFinalStats();

    console.log('\n🎉 统一数据源演示完成！');
  }

  private async demoAgentDiscovery() {
    console.log('   🔍 Agent发现搜索测试...');

    // 搜索测试
    const searchResult = await unifiedDataAdapter.searchAgents({
      page: 1,
      pageSize: 10,
      search: '数据分析'
    });

    console.log(`   搜索"数据分析"找到 ${searchResult.agents.length} 个结果`);
    console.log(`   第一个结果: ${searchResult.agents[0]?.name}`);

    // 获取统计信息
    const stats = await unifiedDataAdapter.getStatistics();
    console.log(`   总Agent数: ${stats.totalAgents}`);
    console.log(`   活跃Agent: ${stats.activeAgents}`);
    console.log(`   验证Agent: ${stats.verifiedAgents}`);
    console.log(`   区块链Agent: ${stats.onChainAgents}`);
  }

  private async demoAgentManagement() {
    console.log('   ⚙️ Agent管理操作测试...');

    // 获取Agent列表
    const agents = await unifiedAgentAdapter.fetchAgents();
    console.log(`   当前Agent数量: ${agents.length}`);

    // 创建新Agent
    const newAgentData = {
      basicInfo: {
        name: '演示创建的Agent',
        description: '通过统一数据源创建的新Agent',
        config: {
          permissions: ['read', 'write'],
          userBinding: {
            boundUserId: 'demo_user',
            bindingType: 'faceBiometrics',
            bindingStrength: 'basic',
            verificationFrequency: 'once',
            fallbackAllowed: true
          }
        }
      },
      apiSpec: {
        endpoint: 'https://api.demo.com',
        method: 'POST',
        headers: {},
        authentication: {
          type: 'none',
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
            content: 'console.log("Hello from demo agent");',
            size: 1024
          }
        ]
      }
    };

    const createdAgent = await unifiedAgentAdapter.createAgent(newAgentData);
    console.log(`   创建新Agent: ${createdAgent.name}`);

    // 更新Agent状态
    await unifiedAgentAdapter.updateAgentStatus(createdAgent.id, 'inactive');
    console.log(`   更新Agent状态为: inactive`);

    // 再次获取Agent列表验证
    const updatedAgents = await unifiedAgentAdapter.fetchAgents();
    console.log(`   更新后Agent数量: ${updatedAgents.length}`);
  }

  private async demoBlockchain() {
    console.log('   🔗 区块链合约测试...');

    // 获取可用的Agent
    const availableAgents = await unifiedBlockchainAdapter.getAvailableAgents();
    console.log(`   可用于注册的Agent数量: ${availableAgents.length}`);

    if (availableAgents.length > 0) {
      const agent = availableAgents[0];

      // 注册Agent合约
      const contractData = {
        contractName: `${agent.name}的智能合约`,
        agentId: agent.id,
        agentType: agent.type,
        capabilities: agent.capabilities,
        permissions: 'admin',
        apiEndpoint: agent.apiEndpoint,
        version: agent.version,
        model: agent.model,
        description: `这是${agent.name}的区块链智能合约`,
        tags: agent.capabilities,
        securityLevel: 'high'
      };

      const contract = await unifiedBlockchainAdapter.registerAgentContract(contractData);
      console.log(`   注册合约: ${contract.contractName}`);
      console.log(`   合约地址: ${contract.contractAddress}`);

      // 获取Agent合约列表
      const agentContracts = await unifiedBlockchainAdapter.fetchAgentContracts();
      console.log(`   当前Agent合约数量: ${agentContracts.length}`);
    }
  }

  private async demoDataSync() {
    console.log('   🔄 数据同步测试...');

    // 获取所有Agent
    const allAgents = unifiedAgentDataManager.getAllAgents();
    console.log(`   数据管理器中的Agent数量: ${allAgents.length}`);

    // 修改一个Agent
    if (allAgents.length > 0) {
      const agentToUpdate = allAgents[0];
      const originalName = agentToUpdate.name;
      const newName = `${originalName} (已更新)`;

      console.log(`   更新Agent: ${originalName} -> ${newName}`);

      // 通过数据管理器更新
      unifiedAgentDataManager.updateAgent(agentToUpdate.id, {
        name: newName,
        status: 'inactive'
      });

      // 验证其他适配器能看到更新
      const discoveryResult = await unifiedDataAdapter.searchAgents({
        page: 1,
        pageSize: 10,
        search: newName
      });

      console.log(`   Agent发现能找到更新后的Agent: ${discoveryResult.agents.length > 0}`);

      const managementAgents = await unifiedAgentAdapter.fetchAgents();
      const foundInManagement = managementAgents.find(a => a.name === newName);
      console.log(`   Agent管理能找到更新后的Agent: ${!!foundInManagement}`);
    }
  }

  private showFinalStats() {
    const stats = unifiedAgentDataManager.getStats();
    const agents = unifiedAgentDataManager.getAllAgents();
    const contracts = unifiedAgentDataManager.getAgentContracts();

    console.log('📊 最终数据统计:');
    console.log(`   总Agent数: ${stats.totalAgents}`);
    console.log(`   活跃Agent: ${stats.activeAgents}`);
    console.log(`   非活跃Agent: ${stats.inactiveAgents}`);
    console.log(`   验证Agent: ${stats.verifiedAgents}`);
    console.log(`   区块链Agent: ${stats.onChainAgents}`);
    console.log(`   平均评分: ${stats.averageRating.toFixed(1)}`);
    console.log(`   Agent合约数: ${contracts.length}`);

    console.log('\n📋 Agent详情:');
    agents.forEach((agent, index) => {
      console.log(`   ${index + 1}. ${agent.name} (${agent.type}) - ${agent.status}`);
      console.log(`      能力: ${agent.capabilities.join(', ')}`);
      console.log(`      区块链: ${agent.blockchainInfo.isOnChain ? '是' : '否'}`);
    });

    console.log('\n📋 合约详情:');
    contracts.forEach((contract, index) => {
      console.log(`   ${index + 1}. ${contract.contractName}`);
      console.log(`      Agent: ${contract.agentInfo.name}`);
      console.log(`      状态: ${contract.status}`);
    });
  }
}

// 运行演示
export async function runUnifiedDataSourceDemo() {
  const demo = new UnifiedDataSourceDemo();
  await demo.runDemo();
}

// 如果直接运行此文件
if (require.main === module) {
  runUnifiedDataSourceDemo().catch(console.error);
}