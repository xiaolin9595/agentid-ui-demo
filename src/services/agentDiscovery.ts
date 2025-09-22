import {
  AgentDiscoverySearchParams,
  AgentDiscoverySortParams,
  AgentDiscoveryFilterParams,
  AgentDiscoveryItem,
  AgentDiscoveryResult,
  AgentDiscoveryStats,
  AgentCommunicationRequest,
  AgentCommunicationChannel,
  AgentCommunicationStatus,
  AgentBlockchainInfo,
  AgentContractInfo
} from '../types/agent-discovery';
import { Agent } from '../types/agent';
import { BlockchainAgent, AgentIdentityContract, AgentCapability } from '../types/blockchain';
import {
  mockBaseAgents,
  mockBlockchainAgents,
  mockAgentContracts,
  mockDiscoveryStats,
  mockCommunicationStatuses,
  generateMockAgentDiscoveryList
} from '../mocks/agentDiscoveryMock';

/**
 * Agent发现服务类
 * 提供Agent搜索、详情获取、通信建立和统计信息功能
 */
export class AgentDiscoveryService {
  private static instance: AgentDiscoveryService;
  private cache: Map<string, { data: any; timestamp: number; ttl: number }>;
  private readonly DEFAULT_CACHE_TTL = 5 * 60 * 1000; // 5分钟

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): AgentDiscoveryService {
    if (!AgentDiscoveryService.instance) {
      AgentDiscoveryService.instance = new AgentDiscoveryService();
    }
    return AgentDiscoveryService.instance;
  }

  /**
   * 搜索Agent
   * @param params 搜索参数
   * @param sortParams 排序参数
   * @param filterParams 过滤参数
   * @returns 搜索结果
   */
  public async searchAgents(
    params: AgentDiscoverySearchParams,
    sortParams: AgentDiscoverySortParams,
    filterParams: AgentDiscoveryFilterParams
  ): Promise<AgentDiscoveryResult> {
    const cacheKey = this.generateCacheKey('search', { params, sortParams, filterParams });
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500));

      // 获取基础Agent数据
      const baseAgents = await this.getBaseAgents();

      // 获取区块链Agent数据
      const blockchainAgents = await this.getBlockchainAgents();

      // 合并和转换数据
      let agents = this.mergeAgentData(baseAgents, blockchainAgents);

      // 或者使用预生成的模拟数据列表（更丰富的数据）
      if (process.env.NODE_ENV === 'development') {
        agents = generateMockAgentDiscoveryList();
      }

      // 应用过滤
      agents = this.applyFilters(agents, filterParams);

      // 应用搜索
      agents = this.applySearch(agents, params);

      // 应用排序
      agents = this.applySorting(agents, sortParams);

      // 分页
      const pagination = this.applyPagination(agents, params);
      const paginatedAgents = agents.slice(
        (params.page - 1) * params.pageSize,
        params.page * params.pageSize
      );

      const result: AgentDiscoveryResult = {
        agents: paginatedAgents,
        pagination,
        sort: sortParams,
        filters: filterParams,
        searchTime: Date.now()
      };

      // 缓存结果
      this.setToCache(cacheKey, result);

      return result;
    } catch (error) {
      console.error('搜索Agent失败:', error);
      throw new Error('搜索Agent时发生错误');
    }
  }

  /**
   * 获取Agent详情
   * @param agentId Agent ID
   * @returns Agent详情
   */
  public async getAgentDetails(agentId: string): Promise<AgentDiscoveryItem | null> {
    const cacheKey = `agent-details-${agentId}`;
    const cached = this.getFromCache(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));

      // 获取基础Agent数据
      const baseAgents = await this.getBaseAgents();
      const baseAgent = baseAgents.find(agent => agent.id === agentId || agent.agentId === agentId);

      if (!baseAgent) {
        return null;
      }

      // 获取区块链Agent数据
      const blockchainAgents = await this.getBlockchainAgents();
      const blockchainAgent = blockchainAgents.find(agent => agent.id === agentId);

      // 合并数据
      const agentDetails = this.mergeAgentData([baseAgent], blockchainAgent ? [blockchainAgent] : [])[0];

      // 添加详细信息
      const detailedAgent: AgentDiscoveryItem = {
        ...agentDetails,
        rating: 4.5 + Math.random() * 0.5,
        reviewCount: Math.floor(Math.random() * 1000) + 10,
        tags: ['AI', 'Automation', 'Data Processing'],
        isVerified: Math.random() > 0.3,
        isFeatured: Math.random() > 0.7,
        popularity: Math.floor(Math.random() * 100),
        connections: Math.floor(Math.random() * 50),
        responseTime: Math.floor(Math.random() * 1000) + 100,
        uptime: 95 + Math.random() * 5,
        lastActivity: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        categories: ['Productivity', 'Automation'],
        stats: {
          totalCalls: Math.floor(Math.random() * 10000),
          successRate: 95 + Math.random() * 5,
          averageResponseTime: Math.floor(Math.random() * 500) + 100,
          errorRate: Math.random() * 5,
          uptimePercentage: 95 + Math.random() * 5
        },
        metadata: {
          website: `https://${agentDetails.name.toLowerCase().replace(/\s+/g, '-')}.com`,
          documentation: `https://docs.${agentDetails.name.toLowerCase().replace(/\s+/g, '-')}.com`,
          github: `https://github.com/${agentDetails.name.toLowerCase().replace(/\s+/g, '-')}`,
          socialLinks: {
            twitter: `@${agentDetails.name.toLowerCase().replace(/\s+/g, '')}`,
            linkedin: `https://linkedin.com/company/${agentDetails.name.toLowerCase().replace(/\s+/g, '-')}`,
            discord: `https://discord.gg/${agentDetails.name.toLowerCase().replace(/\s+/g, '-')}`
          },
          pricing: {
            type: Math.random() > 0.5 ? 'free' : 'freemium',
            price: Math.random() > 0.7 ? Math.floor(Math.random() * 100) + 10 : undefined,
            currency: 'USD'
          }
        }
      };

      // 缓存结果
      this.setToCache(cacheKey, detailedAgent);

      return detailedAgent;
    } catch (error) {
      console.error('获取Agent详情失败:', error);
      throw new Error('获取Agent详情时发生错误');
    }
  }

  /**
   * 建立通信通道
   * @param request 通信请求
   * @returns 通信通道
   */
  public async establishCommunication(request: AgentCommunicationRequest): Promise<AgentCommunicationChannel> {
    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

      // 验证Agent是否存在
      const agent = await this.getAgentDetails(request.agentId);
      if (!agent) {
        throw new Error('Agent不存在');
      }

      // 创建通信通道
      const channel: AgentCommunicationChannel = {
        id: `channel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${agent.name} Communication Channel`,
        type: 'websocket',
        endpoint: `wss://api.agentid.com/agents/${request.agentId}/ws`,
        protocol: 'WebSocket',
        status: 'connected',
        lastConnected: new Date(),
        supportedMethods: ['message', 'call', 'data_request', 'command'],
        security: {
          authentication: 'jwt',
          encryption: 'tls',
          authorization: ['read', 'write', 'execute']
        }
      };

      return channel;
    } catch (error) {
      console.error('建立通信通道失败:', error);
      throw new Error('建立通信通道时发生错误');
    }
  }

  /**
   * 获取Agent通信状态
   * @param agentId Agent ID
   * @returns 通信状态
   */
  public async getCommunicationStatus(agentId: string): Promise<AgentCommunicationStatus> {
    const cacheKey = `comm-status-${agentId}`;
    const cached = this.getFromCache(cacheKey, 30 * 1000); // 30秒缓存

    if (cached) {
      return cached;
    }

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

      // 首先尝试从预定义的模拟数据中获取
      let status = mockCommunicationStatuses[agentId];

      // 如果没有找到，生成一个随机的通信状态
      if (!status) {
        status = {
          status: Math.random() > 0.1 ? 'idle' : 'busy',
          currentLoad: Math.floor(Math.random() * 100),
          maxCapacity: 100,
          responseTime: Math.floor(Math.random() * 500) + 50,
          lastActivity: new Date(Date.now() - Math.random() * 5 * 60 * 1000),
          channels: [
            {
              id: `channel-${agentId}-1`,
              name: 'Primary Channel',
              type: 'websocket',
              endpoint: `wss://api.agentid.com/agents/${agentId}/ws`,
              protocol: 'WebSocket',
              status: 'connected',
              lastConnected: new Date(),
              supportedMethods: ['message', 'call'],
              security: {
                authentication: 'jwt',
                encryption: 'tls',
                authorization: ['read', 'write']
              }
            }
          ]
        };
      }

      // 缓存结果
      this.setToCache(cacheKey, status, 30 * 1000);

      return status;
    } catch (error) {
      console.error('获取通信状态失败:', error);
      throw new Error('获取通信状态时发生错误');
    }
  }

  /**
   * 获取统计信息
   * @returns 统计信息
   */
  public async getStatistics(): Promise<AgentDiscoveryStats> {
    const cacheKey = 'discovery-stats';
    const cached = this.getFromCache(cacheKey, 60 * 1000); // 1分钟缓存

    if (cached) {
      return cached;
    }

    try {
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

      // 使用预定义的模拟统计数据
      const stats: AgentDiscoveryStats = { ...mockDiscoveryStats };

      // 在开发环境中添加一些随机性
      if (process.env.NODE_ENV === 'development') {
        stats.averageRating = Math.round((4.2 + Math.random() * 0.6) * 10) / 10;
        stats.totalConnections = Math.floor(Math.random() * 10000) + 1000;
        stats.dailyStats = Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          newAgents: Math.floor(Math.random() * 10) + 1,
          activeAgents: Math.floor(Math.random() * 100) + 50,
          totalCalls: Math.floor(Math.random() * 10000) + 5000
        })).reverse();
      }

      // 缓存结果
      this.setToCache(cacheKey, stats, 60 * 1000);

      return stats;
    } catch (error) {
      console.error('获取统计信息失败:', error);
      throw new Error('获取统计信息时发生错误');
    }
  }

  /**
   * 获取基础Agent数据
   */
  private async getBaseAgents(): Promise<Agent[]> {
    // 使用模拟数据，实际项目中应该从AgentStore获取
    return mockBaseAgents;
  }

  /**
   * 获取区块链Agent数据
   */
  private async getBlockchainAgents(): Promise<BlockchainAgent[]> {
    // 使用模拟数据，实际项目中应该从BlockchainStore获取
    return mockBlockchainAgents;
  }

  /**
   * 获取Agent合约数据
   */
  private async getAgentContracts(): Promise<AgentIdentityContract[]> {
    // 使用模拟数据，实际项目中应该从BlockchainStore获取
    return mockAgentContracts;
  }

  /**
   * 合并Agent数据
   */
  private mergeAgentData(baseAgents: Agent[], blockchainAgents: BlockchainAgent[]): AgentDiscoveryItem[] {
    const agents: AgentDiscoveryItem[] = [];

    // 处理基础Agent
    baseAgents.forEach(agent => {
      agents.push({
        ...agent,
        description: agent.description,
        blockchainInfo: {
          isOnChain: false,
          verificationStatus: 'unverified',
          syncStatus: 'synced'
        },
        rating: 4.0 + Math.random() * 1.0,
        reviewCount: Math.floor(Math.random() * 100),
        tags: ['Traditional', 'On-Premise'],
        isVerified: true,
        popularity: Math.floor(Math.random() * 80),
        connections: Math.floor(Math.random() * 30),
        responseTime: Math.floor(Math.random() * 300) + 100,
        uptime: 98 + Math.random() * 2,
        lastActivity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        categories: ['Productivity'],
        version: '1.0.0',
        model: 'Custom Model'
      });
    });

    // 处理区块链Agent
    blockchainAgents.forEach(agent => {
      agents.push({
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
        permissions: ['read', 'write', 'execute'],
        blockchainInfo: {
          contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
          network: 'Ethereum',
          blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
          gasUsed: Math.floor(Math.random() * 100000) + 50000,
          isOnChain: true,
          verificationStatus: 'verified',
          verificationDate: new Date(),
          chainId: 1,
          lastSyncedAt: new Date(),
          syncStatus: 'synced'
        },
        contractInfo: {
          contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
          contractName: agent.name,
          ownerAddress: agent.owner,
          permissions: 'admin',
          createdAt: agent.createdAt,
          updatedAt: agent.updatedAt,
          status: 'active',
          metadata: {
            tags: agent.capabilities,
            description: agent.description,
            securityLevel: 'high',
            compliance: ['GDPR', 'CCPA']
          },
          blockchain: {
            network: 'Ethereum',
            blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
            transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
            gasUsed: Math.floor(Math.random() * 100000) + 50000
          }
        },
        rating: 4.5 + Math.random() * 0.5,
        reviewCount: Math.floor(Math.random() * 500) + 50,
        tags: agent.capabilities,
        isVerified: true,
        isFeatured: Math.random() > 0.5,
        popularity: Math.floor(Math.random() * 100),
        connections: Math.floor(Math.random() * 100),
        responseTime: Math.floor(Math.random() * 200) + 50,
        uptime: 99 + Math.random() * 1,
        lastActivity: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
        categories: [agent.type],
        apiEndpoint: agent.apiEndpoint,
        model: agent.model,
        version: agent.version
      });
    });

    return agents;
  }

  /**
   * 应用过滤条件
   */
  private applyFilters(agents: AgentDiscoveryItem[], filters: AgentDiscoveryFilterParams): AgentDiscoveryItem[] {
    let filtered = [...agents];

    if (filters.statuses && filters.statuses.length > 0) {
      filtered = filtered.filter(agent => filters.statuses!.includes(agent.status));
    }

    if (filters.types && filters.types.length > 0) {
      filtered = filtered.filter(agent => {
        const agentType = agent.blockchainInfo?.isOnChain ?
          (agent.categories?.[0] as BlockchainAgent['type']) : null;
        return agentType && filters.types!.includes(agentType);
      });
    }

    if (filters.languages && filters.languages.length > 0) {
      filtered = filtered.filter(agent => filters.languages!.includes(agent.language));
    }

    if (filters.capabilities && filters.capabilities.length > 0) {
      filtered = filtered.filter(agent =>
        filters.capabilities!.some(cap => agent.tags?.includes(cap))
      );
    }

    if (filters.ratingRange) {
      filtered = filtered.filter(agent =>
        agent.rating! >= filters.ratingRange!.min &&
        agent.rating! <= filters.ratingRange!.max
      );
    }

    if (filters.codeSizeRange) {
      filtered = filtered.filter(agent =>
        agent.codeSize >= filters.codeSizeRange!.min &&
        agent.codeSize <= filters.codeSizeRange!.max
      );
    }

    if (filters.hasContract !== undefined) {
      filtered = filtered.filter(agent =>
        filters.hasContract ? !!agent.blockchainInfo?.isOnChain : !agent.blockchainInfo?.isOnChain
      );
    }

    if (filters.isVerified !== undefined) {
      filtered = filtered.filter(agent => agent.isVerified === filters.isVerified);
    }

    if (filters.isActive !== undefined) {
      filtered = filtered.filter(agent =>
        filters.isActive ? agent.status === 'active' : agent.status !== 'active'
      );
    }

    return filtered;
  }

  /**
   * 应用搜索条件
   */
  private applySearch(agents: AgentDiscoveryItem[], params: AgentDiscoverySearchParams): AgentDiscoveryItem[] {
    let searched = [...agents];

    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      searched = searched.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm) ||
        agent.description.toLowerCase().includes(searchTerm) ||
        agent.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (params.capabilities && params.capabilities.length > 0) {
      searched = searched.filter(agent =>
        params.capabilities!.some(cap => agent.tags?.includes(cap))
      );
    }

    if (params.userId) {
      searched = searched.filter(agent => agent.boundUser === params.userId);
    }

    if (params.role) {
      searched = searched.filter(agent =>
        agent.categories?.some(cat => cat.toLowerCase().includes(params.role!.toLowerCase()))
      );
    }

    if (params.status) {
      searched = searched.filter(agent => agent.status === params.status);
    }

    if (params.language) {
      searched = searched.filter(agent => agent.language === params.language);
    }

    if (params.minRating !== undefined) {
      searched = searched.filter(agent => agent.rating! >= params.minRating!);
    }

    if (params.maxRating !== undefined) {
      searched = searched.filter(agent => agent.rating! <= params.maxRating!);
    }

    return searched;
  }

  /**
   * 应用排序
   */
  private applySorting(agents: AgentDiscoveryItem[], sortParams: AgentDiscoverySortParams): AgentDiscoveryItem[] {
    const sorted = [...agents];

    sorted.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortParams.field) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'updatedAt':
          aValue = new Date(a.updatedAt).getTime();
          bValue = new Date(b.updatedAt).getTime();
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'type':
          aValue = a.categories?.[0] || 'Traditional';
          bValue = b.categories?.[0] || 'Traditional';
          break;
        case 'capabilities':
          aValue = a.tags?.length || 0;
          bValue = b.tags?.length || 0;
          break;
        case 'codeSize':
          aValue = a.codeSize;
          bValue = b.codeSize;
          break;
        case 'connections':
          aValue = a.connections || 0;
          bValue = b.connections || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortParams.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortParams.order === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }

  /**
   * 应用分页
   */
  private applyPagination(agents: AgentDiscoveryItem[], params: AgentDiscoverySearchParams) {
    const total = agents.length;
    const totalPages = Math.ceil(total / params.pageSize);

    return {
      page: params.page,
      pageSize: params.pageSize,
      total,
      totalPages,
      hasNext: params.page < totalPages,
      hasPrev: params.page > 1
    };
  }

  /**
   * 生成缓存键
   */
  private generateCacheKey(prefix: string, data: any): string {
    return `${prefix}-${JSON.stringify(data)}`;
  }

  /**
   * 从缓存获取数据
   */
  private getFromCache(key: string, customTTL?: number): any {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    const ttl = customTTL || cached.ttl;

    if (now - cached.timestamp > ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  /**
   * 设置缓存
   */
  private setToCache(key: string, data: any, customTTL?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: customTTL || this.DEFAULT_CACHE_TTL
    });
  }

  /**
   * 清除缓存
   */
  public clearCache(): void {
    this.cache.clear();
  }

  /**
   * 获取缓存统计
   */
  public getCacheStats(): { size: number; entries: Array<{ key: string; age: number }> } {
    const now = Date.now();
    const entries = Array.from(this.cache.entries()).map(([key, value]) => ({
      key,
      age: now - value.timestamp
    }));

    return {
      size: this.cache.size,
      entries
    };
  }
}