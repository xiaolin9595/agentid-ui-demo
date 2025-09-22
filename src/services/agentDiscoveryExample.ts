import { agentDiscoveryService } from './index';
import type {
  AgentDiscoverySearchParams,
  AgentDiscoverySortParams,
  AgentDiscoveryFilterParams,
  AgentCommunicationRequest
} from '../types/agent-discovery';

/**
 * Agent发现服务使用示例
 * 演示如何使用AgentDiscoveryService的各种功能
 */

export class AgentDiscoveryExample {
  /**
   * 演示搜索功能
   */
  public static async demonstrateSearch() {
    console.log('=== 演示Agent搜索功能 ===');

    // 基本搜索参数
    const searchParams: AgentDiscoverySearchParams = {
      search: 'AI Assistant',
      page: 1,
      pageSize: 10
    };

    // 排序参数
    const sortParams: AgentDiscoverySortParams = {
      field: 'rating',
      order: 'desc'
    };

    // 过滤参数
    const filterParams: AgentDiscoveryFilterParams = {
      statuses: ['active'],
      ratingRange: { min: 4.0, max: 5.0 },
      isVerified: true
    };

    try {
      const result = await agentDiscoveryService.searchAgents(searchParams, sortParams, filterParams);

      console.log(`搜索结果: 找到 ${result.agents.length} 个Agent`);
      console.log(`总页数: ${result.pagination.totalPages}`);
      console.log(`当前页: ${result.pagination.page}`);
      console.log(`搜索耗时: ${result.searchTime}ms`);

      // 显示前几个Agent
      result.agents.slice(0, 3).forEach((agent: any, index: number) => {
        console.log(`\nAgent ${index + 1}:`);
        console.log(`  名称: ${agent.name}`);
        console.log(`  描述: ${agent.description}`);
        console.log(`  评分: ${agent.rating} (${agent.reviewCount} 条评价)`);
        console.log(`  状态: ${agent.status}`);
        console.log(`  区块链: ${agent.blockchainInfo?.isOnChain ? '是' : '否'}`);
        console.log(`  能力: ${agent.tags?.join(', ')}`);
      });
    } catch (error) {
      console.error('搜索失败:', error);
    }
  }

  /**
   * 演示高级搜索功能
   */
  public static async demonstrateAdvancedSearch() {
    console.log('\n=== 演示高级搜索功能 ===');

    // 高级搜索参数
    const searchParams: AgentDiscoverySearchParams = {
      capabilities: ['私人助理', '工作助理'],
      language: 'typescript',
      minRating: 4.5,
      dateRange: {
        start: new Date('2024-01-01'),
        end: new Date()
      },
      page: 1,
      pageSize: 5
    };

    // 高级过滤
    const filterParams: AgentDiscoveryFilterParams = {
      types: ['AI Assistant', 'Automation'],
      capabilities: ['私人助理', '工作助理'],
      ratingRange: { min: 4.0, max: 5.0 },
      hasContract: true
    };

    // 高级排序
    const sortParams: AgentDiscoverySortParams = {
      field: 'connections',
      order: 'desc'
    };

    try {
      const result = await agentDiscoveryService.searchAgents(searchParams, sortParams, filterParams);

      console.log(`高级搜索结果: 找到 ${result.agents.length} 个Agent`);
      console.log(`过滤条件:`, filterParams);
      console.log(`排序条件:`, sortParams);

      result.agents.forEach((agent: any, index: number) => {
        console.log(`\n${index + 1}. ${agent.name}`);
        console.log(`   连接数: ${agent.connections}`);
        console.log(`   响应时间: ${agent.responseTime}ms`);
        console.log(`   安全级别: ${agent.contractInfo?.metadata.securityLevel}`);
      });
    } catch (error) {
      console.error('高级搜索失败:', error);
    }
  }

  /**
   * 演示获取Agent详情
   */
  public static async demonstrateAgentDetails() {
    console.log('\n=== 演示获取Agent详情 ===');

    const agentId = 'bc-agent-001';

    try {
      const agent = await agentDiscoveryService.getAgentDetails(agentId);

      if (agent) {
        console.log(`Agent详情: ${agent.name}`);
        console.log(`ID: ${agent.id}`);
        console.log(`类型: ${agent.categories?.join(', ')}`);
        console.log(`API端点: ${agent.apiEndpoint}`);
        console.log(`模型: ${agent.model}`);
        console.log(`版本: ${agent.version}`);

        if (agent.stats) {
          console.log(`统计信息:`);
          console.log(`  总调用数: ${agent.stats.totalCalls}`);
          console.log(`  成功率: ${agent.stats.successRate}%`);
          console.log(`  平均响应时间: ${agent.stats.averageResponseTime}ms`);
          console.log(`  错误率: ${agent.stats.errorRate}%`);
          console.log(`  运行时间: ${agent.stats.uptimePercentage}%`);
        }

        if (agent.blockchainInfo?.isOnChain) {
          console.log(`区块链信息:`);
          console.log(`  合约地址: ${agent.blockchainInfo.contractAddress}`);
          console.log(`  网络: ${agent.blockchainInfo.network}`);
          console.log(`  验证状态: ${agent.blockchainInfo.verificationStatus}`);
          console.log(`  区块号: ${agent.blockchainInfo.blockNumber}`);
        }

        if (agent.metadata) {
          console.log(`元数据:`);
          console.log(`  网站: ${agent.metadata.website}`);
          console.log(`  文档: ${agent.metadata.documentation}`);
          if (agent.metadata.pricing) console.log(`  定价: ${agent.metadata.pricing.type}`);
          if (agent.metadata.pricing?.price) {
            console.log(`  价格: $${agent.metadata.pricing!.price}`);
          }
        }
      } else {
        console.log(`未找到ID为 ${agentId} 的Agent`);
      }
    } catch (error) {
      console.error('获取Agent详情失败:', error);
    }
  }

  /**
   * 演示通信功能
   */
  public static async demonstrateCommunication() {
    console.log('\n=== 演示通信功能 ===');

    const agentId = 'bc-agent-001';

    try {
      // 获取通信状态
      const status = await agentDiscoveryService.getCommunicationStatus(agentId);
      console.log(`Agent ${agentId} 通信状态:`);
      console.log(`  状态: ${status.status}`);
      console.log(`  当前负载: ${status.currentLoad}/${status.maxCapacity}`);
      console.log(`  响应时间: ${status.responseTime}ms`);
      console.log(`  通信通道数: ${status.channels.length}`);

      // 建立通信
      const communicationRequest: AgentCommunicationRequest = {
        agentId,
        type: 'message',
        payload: { message: 'Hello, Agent!' },
        priority: 'medium',
        timeout: 5000,
        requiresResponse: true,
        metadata: {
          userId: 'user_123',
          sessionId: 'session_456',
          tags: ['greeting']
        }
      };

      const channel = await agentDiscoveryService.establishCommunication(communicationRequest);
      console.log(`\n通信通道建立成功:`);
      console.log(`  通道ID: ${channel.id}`);
      console.log(`  通道名称: ${channel.name}`);
      console.log(`  类型: ${channel.type}`);
      console.log(`  端点: ${channel.endpoint}`);
      console.log(`  状态: ${channel.status}`);
      console.log(`  支持的方法: ${channel.supportedMethods.join(', ')}`);

    } catch (error) {
      console.error('通信操作失败:', error);
    }
  }

  /**
   * 演示统计信息
   */
  public static async demonstrateStatistics() {
    console.log('\n=== 演示统计信息 ===');

    try {
      const stats = await agentDiscoveryService.getStatistics();

      console.log('Agent发现统计信息:');
      console.log(`  总Agent数: ${stats.totalAgents}`);
      console.log(`  活跃Agent数: ${stats.activeAgents}`);
      console.log(`  非活跃Agent数: ${stats.inactiveAgents}`);
      console.log(`  已验证Agent数: ${stats.verifiedAgents}`);
      console.log(`  精选Agent数: ${stats.featuredAgents}`);
      console.log(`  平均评分: ${stats.averageRating}`);
      console.log(`  总连接数: ${stats.totalConnections}`);

      console.log('\n热门能力:');
      stats.topCapabilities.forEach((cap: any) => {
        console.log(`  ${cap.capability}: ${cap.count} (${cap.percentage}%)`);
      });

      console.log('\nAgent类型分布:');
      stats.topTypes.forEach((type: any) => {
        console.log(`  ${type.type}: ${type.count} (${type.percentage}%)`);
      });

      console.log('\n网络分布:');
      stats.networkDistribution.forEach((network: any) => {
        console.log(`  ${network.network}: ${network.count} (${network.percentage}%)`);
      });

      console.log('\n状态分布:');
      stats.statusDistribution.forEach((status: any) => {
        console.log(`  ${status.status}: ${status.count} (${status.percentage}%)`);
      });

      console.log('\n最近7天统计:');
      stats.dailyStats.forEach((day: any) => {
        console.log(`  ${day.date}: 新增 ${day.newAgents} Agent, 活跃 ${day.activeAgents} Agent, 调用 ${day.totalCalls} 次`);
      });
    } catch (error) {
      console.error('获取统计信息失败:', error);
    }
  }

  /**
   * 演示缓存功能
   */
  public static async demonstrateCache() {
    console.log('\n=== 演示缓存功能 ===');

    try {
      // 第一次调用（无缓存）
      console.log('第一次调用搜索API...');
      const start1 = Date.now();
      await agentDiscoveryService.searchAgents(
        { search: 'AI', page: 1, pageSize: 5 },
        { field: 'name', order: 'asc' },
        { statuses: ['active'] }
      );
      const end1 = Date.now();
      console.log(`第一次调用耗时: ${end1 - start1}ms`);

      // 第二次调用（有缓存）
      console.log('\n第二次调用搜索API（应该使用缓存）...');
      const start2 = Date.now();
      await agentDiscoveryService.searchAgents(
        { search: 'AI', page: 1, pageSize: 5 },
        { field: 'name', order: 'asc' },
        { statuses: ['active'] }
      );
      const end2 = Date.now();
      console.log(`第二次调用耗时: ${end2 - start2}ms`);

      // 显示缓存统计
      const cacheStats = agentDiscoveryService.getCacheStats();
      console.log(`\n缓存统计:`);
      console.log(`  缓存条目数: ${cacheStats.size}`);
      console.log(`  缓存条目:`);
      cacheStats.entries.slice(0, 5).forEach((entry: any) => {
        console.log(`    ${entry.key}: ${entry.age}ms`);
      });

      // 清除缓存
      console.log('\n清除缓存...');
      agentDiscoveryService.clearCache();
      const newStats = agentDiscoveryService.getCacheStats();
      console.log(`清除后缓存条目数: ${newStats.size}`);

    } catch (error) {
      console.error('缓存演示失败:', error);
    }
  }

  /**
   * 运行所有演示
   */
  public static async runAllDemonstrations() {
    console.log('开始Agent发现服务演示...\n');

    await this.demonstrateSearch();
    await this.demonstrateAdvancedSearch();
    await this.demonstrateAgentDetails();
    await this.demonstrateCommunication();
    await this.demonstrateStatistics();
    await this.demonstrateCache();

    console.log('\n所有演示完成！');
  }
}

// 如果直接运行此文件，执行演示
if (require.main === module) {
  AgentDiscoveryExample.runAllDemonstrations().catch(console.error);
}