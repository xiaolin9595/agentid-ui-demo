import { unifiedAgentDataManager, AgentDataConverter } from './unifiedAgentDataManager';
import {
  AgentDiscoveryItem,
  AgentDiscoveryStats,
  AgentDiscoverySearchParams,
  AgentDiscoveryResult,
  AgentCommunicationStatus,
  AgentBlockchainInfo,
  AgentContractInfo
} from '../types/agent-discovery';
import { AgentDiscoveryService } from '../services/agentDiscovery';

/**
 * 统一数据源适配器
 * 将统一数据管理器适配到现有的AgentDiscovery接口
 */
export class UnifiedDataAdapter {
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
        console.error('Error in data adapter listener:', error);
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
   * 搜索Agent
   */
  async searchAgents(params: AgentDiscoverySearchParams = {}): Promise<AgentDiscoveryResult> {
    try {
      // 从统一数据源获取Agent列表
      let agents = unifiedAgentDataManager.getAllAgents();

      // 应用搜索过滤
      if (params.search) {
        agents = unifiedAgentDataManager.searchAgents(params.search);
      }

      // 应用过滤条件
      if (params.status) {
        agents = agents.filter(agent => agent.status === params.status);
      }

      if (params.type) {
        agents = agents.filter(agent => agent.type === params.type);
      }

      if (params.capabilities && params.capabilities.length > 0) {
        agents = agents.filter(agent =>
          params.capabilities!.some(cap => agent.capabilities.includes(cap as any))
        );
      }

      if (params.isVerified !== undefined) {
        agents = agents.filter(agent => agent.isVerified === params.isVerified);
      }

      // 转换为AgentDiscoveryItem格式
      const items: AgentDiscoveryItem[] = agents.map(agent =>
        AgentDataConverter.toAgentDiscoveryItem(agent)
      );

      // 应用分页
      const page = params.page || 1;
      const pageSize = params.pageSize || 12;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      const paginatedItems = items.slice(startIndex, endIndex);

      return {
        agents: paginatedItems,
        pagination: {
          page,
          pageSize,
          total: items.length,
          totalPages: Math.ceil(items.length / pageSize)
        },
        filters: {
          search: params.search || '',
          status: params.status,
          type: params.type,
          capabilities: params.capabilities || [],
          isVerified: params.isVerified
        }
      };
    } catch (error) {
      console.error('Error searching agents:', error);
      throw error;
    }
  }

  /**
   * 获取统计信息
   */
  async getStatistics(): Promise<AgentDiscoveryStats> {
    try {
      const stats = unifiedAgentDataManager.getStats();
      const agents = unifiedAgentDataManager.getAllAgents();

      // 计算能力分布
      const capabilityCount = new Map<string, number>();
      const typeCount = new Map<string, number>();
      const networkCount = new Map<string, number>();
      const statusCount = new Map<string, number>();

      agents.forEach(agent => {
        // 统计能力
        agent.capabilities.forEach(capability => {
          capabilityCount.set(capability, (capabilityCount.get(capability) || 0) + 1);
        });

        // 统计类型
        typeCount.set(agent.type, (typeCount.get(agent.type) || 0) + 1);

        // 统计网络
        if (agent.blockchainInfo.isOnChain && agent.blockchainInfo.network) {
          networkCount.set(agent.blockchainInfo.network, (networkCount.get(agent.blockchainInfo.network) || 0) + 1);
        }

        // 统计状态
        statusCount.set(agent.status, (statusCount.get(agent.status) || 0) + 1);
      });

      // 转换为排序后的数组
      const topCapabilities = Array.from(capabilityCount.entries())
        .map(([capability, count]) => ({
          capability,
          count,
          percentage: (count / agents.length) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const topTypes = Array.from(typeCount.entries())
        .map(([type, count]) => ({
          type,
          count,
          percentage: (count / agents.length) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      const networkDistribution = Array.from(networkCount.entries())
        .map(([network, count]) => ({
          network,
          count,
          percentage: (count / agents.length) * 100
        }))
        .sort((a, b) => b.count - a.count);

      const statusDistribution = Array.from(statusCount.entries())
        .map(([status, count]) => ({
          status,
          count,
          percentage: (count / agents.length) * 100
        }))
        .sort((a, b) => b.count - a.count);

      // 计算平均评分
      const totalRating = agents.reduce((sum, agent) => sum + (agent.rating || 0), 0);
      const averageRating = agents.length > 0 ? totalRating / agents.length : 0;

      // 计算总连接数
      const totalConnections = agents.reduce((sum, agent) => sum + (agent.stats?.connections || 0), 0);

      // 生成每日统计（模拟数据）
      const dailyStats = this.generateDailyStats();

      return {
        totalAgents: stats.totalAgents,
        activeAgents: stats.activeAgents,
        inactiveAgents: stats.inactiveAgents,
        verifiedAgents: stats.verifiedAgents,
        featuredAgents: agents.filter(agent => agent.isFeatured).length,
        averageRating: Math.round(averageRating * 10) / 10,
        totalConnections,
        topCapabilities,
        topTypes,
        networkDistribution,
        statusDistribution,
        dailyStats
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw error;
    }
  }

  /**
   * 生成每日统计数据
   */
  private generateDailyStats() {
    const days = 7;
    const stats = [];
    const baseDate = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(baseDate);
      date.setDate(date.getDate() - i);

      stats.push({
        date: date.toISOString().split('T')[0],
        newAgents: Math.floor(Math.random() * 5),
        activeAgents: Math.floor(Math.random() * 10) + 5,
        totalCalls: Math.floor(Math.random() * 5000) + 10000
      });
    }

    return stats;
  }

  /**
   * 获取Agent详情
   */
  async getAgentDetails(agentId: string): Promise<AgentDiscoveryItem | null> {
    try {
      const agent = unifiedAgentDataManager.getAgentById(agentId);
      if (!agent) return null;

      return AgentDataConverter.toAgentDiscoveryItem(agent);
    } catch (error) {
      console.error('Error getting agent details:', error);
      throw error;
    }
  }

  /**
   * 获取通信状态
   */
  async getCommunicationStatus(agentId: string): Promise<AgentCommunicationStatus | null> {
    try {
      const agent = unifiedAgentDataManager.getAgentById(agentId);
      if (!agent) return null;

      // 模拟通信状态
      const statusOptions = ['idle', 'busy', 'offline', 'error'];
      const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];

      return {
        status: randomStatus as any,
        currentLoad: Math.floor(Math.random() * 100),
        maxCapacity: 100,
        responseTime: Math.floor(Math.random() * 1000) + 50,
        lastActivity: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
        channels: [
          {
            id: `channel-${agentId}`,
            name: 'API Channel',
            type: 'http',
            endpoint: agent.apiEndpoint || `https://api.agentid.com/agents/${agentId}`,
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
      };
    } catch (error) {
      console.error('Error getting communication status:', error);
      throw error;
    }
  }

  /**
   * 建立通信
   */
  async establishCommunication(agentId: string, request: any): Promise<any> {
    try {
      // 模拟建立通信
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        channelId: `channel-${agentId}-${Date.now()}`,
        establishedAt: new Date(),
        message: '通信建立成功'
      };
    } catch (error) {
      console.error('Error establishing communication:', error);
      throw error;
    }
  }

  /**
   * 获取搜索历史
   */
  getSearchHistory() {
    // 返回模拟的搜索历史
    return [
      {
        id: 'search-1',
        params: { search: 'AI Assistant' },
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        resultCount: 5
      },
      {
        id: 'search-2',
        params: { search: 'Data Processing' },
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        resultCount: 3
      }
    ];
  }

  /**
   * 添加Agent
   */
  async addAgent(agentData: any): Promise<AgentDiscoveryItem> {
    try {
      const newAgent = unifiedAgentDataManager.addAgent(agentData);
      return AgentDataConverter.toAgentDiscoveryItem(newAgent);
    } catch (error) {
      console.error('Error adding agent:', error);
      throw error;
    }
  }

  /**
   * 更新Agent
   */
  async updateAgent(agentId: string, updates: any): Promise<AgentDiscoveryItem> {
    try {
      const success = unifiedAgentDataManager.updateAgent(agentId, updates);
      if (!success) {
        throw new Error('Agent not found');
      }

      const agent = unifiedAgentDataManager.getAgentById(agentId);
      if (!agent) {
        throw new Error('Agent not found after update');
      }

      return AgentDataConverter.toAgentDiscoveryItem(agent);
    } catch (error) {
      console.error('Error updating agent:', error);
      throw error;
    }
  }

  /**
   * 删除Agent
   */
  async deleteAgent(agentId: string): Promise<boolean> {
    try {
      return unifiedAgentDataManager.deleteAgent(agentId);
    } catch (error) {
      console.error('Error deleting agent:', error);
      throw error;
    }
  }
}

// 全局实例
export const unifiedDataAdapter = new UnifiedDataAdapter();