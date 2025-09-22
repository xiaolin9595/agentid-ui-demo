import { unifiedAgentDataManager, AgentDataConverter } from './unifiedAgentDataManager';
import { Agent, AgentMetrics, AgentPaginationParams, AgentFilterParams, AgentSortParams } from '../types/agent';
import { AgentCreateInfo, AgentApiSpec, AgentCodePackage } from '../types/agent-upload';

/**
 * Agent管理统一数据源适配器
 * 将统一数据管理器适配到现有的Agent Store接口
 */
export class UnifiedAgentAdapter {
  private eventListeners: Set<Function> = new Set();

  constructor() {
    // 监听统一数据管理器的事件
    unifiedAgentDataManager.addEventListener(this.handleDataChange.bind(this));
  }

  /**
   * 处理数据变化事件
   */
  private handleChange(event: any): void {
    // 通知所有监听者数据已变化
    this.eventListeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in agent adapter listener:', error);
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
   * 获取Agent列表
   */
  async fetchAgents(): Promise<Agent[]> {
    try {
      const unifiedAgents = unifiedAgentDataManager.getAllAgents();
      return unifiedAgents.map(agent => AgentDataConverter.toAgent(agent));
    } catch (error) {
      console.error('Error fetching agents:', error);
      throw error;
    }
  }

  /**
   * 创建Agent
   */
  async createAgent(agentData: {
    basicInfo: AgentCreateInfo;
    apiSpec: AgentApiSpec;
    codePackage: AgentCodePackage;
  }): Promise<Agent> {
    try {
      // 模拟创建延迟
      await new Promise(resolve => setTimeout(resolve, 2000));

      const { basicInfo, apiSpec, codePackage } = agentData;

      const unifiedAgent = unifiedAgentDataManager.addAgent({
        name: basicInfo.name,
        description: basicInfo.description,
        type: 'AI Assistant', // 默认类型
        capabilities: this.extractCapabilities(basicInfo.description),
        status: 'active',
        codeHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        profileHash: `0x${Math.random().toString(16).substr(2, 64)}`,
        version: '1.0.0',
        language: codePackage.language.id,
        codeSize: codePackage.files.reduce((total, file) => total + file.size, 0),
        boundUser: 'current_user',
        boundAt: new Date().toISOString(),
        config: {
          permissions: basicInfo.config.permissions as any,
          userBinding: basicInfo.config.userBinding
        },
        permissions: basicInfo.config.permissions as any,
        blockchainInfo: {
          isOnChain: false,
          verificationStatus: 'unverified',
          syncStatus: 'synced'
        },
        metadata: {
          tags: ['New Agent'],
          categories: ['AI Assistant'],
          securityLevel: 'medium',
          compliance: []
        }
      });

      return AgentDataConverter.toAgent(unifiedAgent);
    } catch (error) {
      console.error('Error creating agent:', error);
      throw error;
    }
  }

  /**
   * 删除Agent
   */
  async deleteAgent(id: string): Promise<void> {
    try {
      // 模拟删除延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      const success = unifiedAgentDataManager.deleteAgent(id);
      if (!success) {
        throw new Error('Agent not found');
      }
    } catch (error) {
      console.error('Error deleting agent:', error);
      throw error;
    }
  }

  /**
   * 更新Agent状态
   */
  async updateAgentStatus(id: string, status: 'active' | 'inactive' | 'stopped' | 'error'): Promise<void> {
    try {
      // 模拟更新延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      const success = unifiedAgentDataManager.updateAgent(id, { status });
      if (!success) {
        throw new Error('Agent not found');
      }
    } catch (error) {
      console.error('Error updating agent status:', error);
      throw error;
    }
  }

  /**
   * 获取Agent指标
   */
  async getAgentMetrics(agentId: string): Promise<AgentMetrics | null> {
    try {
      const agent = unifiedAgentDataManager.getAgentById(agentId);
      if (!agent) return null;

      return {
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        connections: agent.stats?.connections || 0,
        rps: Math.random() * 1000,
        uptime: Math.random() * 100
      };
    } catch (error) {
      console.error('Error getting agent metrics:', error);
      throw error;
    }
  }

  /**
   * 从描述中提取能力
   */
  private extractCapabilities(description: string): string[] {
    const keywords = {
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

    const capabilities: string[] = [];
    const lowerDesc = description.toLowerCase();

    Object.entries(keywords).forEach(([keyword, capability]) => {
      if (lowerDesc.includes(keyword)) {
        capabilities.push(capability);
      }
    });

    return capabilities.length > 0 ? capabilities : ['工作助理'];
  }

  /**
   * 搜索Agent
   */
  async searchAgents(query: string): Promise<Agent[]> {
    try {
      const unifiedAgents = unifiedAgentDataManager.searchAgents(query);
      return unifiedAgents.map(agent => AgentDataConverter.toAgent(agent));
    } catch (error) {
      console.error('Error searching agents:', error);
      throw error;
    }
  }

  /**
   * 过滤Agent
   */
  async filterAgents(filters: {
    status?: string;
    language?: string;
    search?: string;
  }): Promise<Agent[]> {
    try {
      let agents = unifiedAgentDataManager.getAllAgents();

      if (filters.search) {
        agents = unifiedAgentDataManager.searchAgents(filters.search);
      }

      if (filters.status) {
        agents = agents.filter(agent => agent.status === filters.status);
      }

      if (filters.language) {
        agents = agents.filter(agent => agent.language === filters.language);
      }

      return agents.map(agent => AgentDataConverter.toAgent(agent));
    } catch (error) {
      console.error('Error filtering agents:', error);
      throw error;
    }
  }

  /**
   * 获取Agent统计信息
   */
  async getAgentStats(): Promise<{
    totalAgents: number;
    activeAgents: number;
    inactiveAgents: number;
    averageCpu: number;
    averageMemory: number;
    totalConnections: number;
  }> {
    try {
      const agents = unifiedAgentDataManager.getAllAgents();
      const stats = unifiedAgentDataManager.getStats();

      return {
        totalAgents: stats.totalAgents,
        activeAgents: stats.activeAgents,
        inactiveAgents: stats.inactiveAgents,
        averageCpu: agents.reduce((sum, agent) => sum + (agent.stats?.totalCalls || 0), 0) / agents.length || 0,
        averageMemory: agents.reduce((sum, agent) => sum + (agent.codeSize || 0), 0) / agents.length || 0,
        totalConnections: agents.reduce((sum, agent) => sum + (agent.stats?.connections || 0), 0)
      };
    } catch (error) {
      console.error('Error getting agent stats:', error);
      throw error;
    }
  }
}

// 全局实例
export const unifiedAgentAdapter = new UnifiedAgentAdapter();