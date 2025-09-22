import { Agent } from '../types/agent';
import { BlockchainAgent, AgentIdentityContract } from '../types/blockchain';
import { AgentDiscoveryItem } from '../types/agent-discovery';

/**
 * 统一的Agent数据源类型定义
 * 整合三个页面的Agent数据结构
 */

// Agent状态类型
export type UnifiedAgentStatus = 'active' | 'inactive' | 'stopped' | 'error' | 'development' | 'deprecated';

// Agent能力类型
export type UnifiedAgentCapability =
  | '私人助理' | '购物助理' | '生活助理' | '健康助理' | '学习助理'
  | '工作助理' | '旅行助理' | '财务助理' | '娱乐助理' | '客服助理'
  | '数据分析' | '内容生成' | '安全监控' | '自动化' | '图像处理'
  | '自然语言处理' | '区块链操作' | '身份验证' | '交易处理';

// Agent类型
export type UnifiedAgentType =
  | 'AI Assistant' | 'Chatbot' | 'Automation' | 'Data Processing'
  | 'Content Generation' | 'Analysis' | 'Security' | 'Blockchain'
  | 'Traditional' | 'Custom';

// 权限类型
export type UnifiedPermission =
  | 'read' | 'write' | 'execute' | 'admin'
  | 'read-only' | 'read-write';

// 用户绑定类型
export type UnifiedUserBindingType =
  | 'faceBiometrics' | 'multiFactor' | 'none';

// 绑定强度
export type UnifiedBindingStrength = 'basic' | 'enhanced' | 'strict';

// 验证频率
export type UnifiedVerificationFrequency = 'once' | 'daily' | 'perRequest';

// 验证状态
export type UnifiedVerificationStatus =
  | 'verified' | 'pending' | 'failed' | 'unverified';

// 区块链信息
export interface UnifiedBlockchainInfo {
  isOnChain: boolean;
  contractAddress?: string;
  network?: string;
  blockNumber?: number;
  transactionHash?: string;
  gasUsed?: number;
  chainId?: number;
  verificationStatus?: UnifiedVerificationStatus;
  verificationDate?: Date;
  lastSyncedAt?: Date;
  syncStatus?: 'synced' | 'syncing' | 'failed';
}

// 面部生物特征
export interface UnifiedFaceBiometricFeatures {
  featureVector: number[];
  templateId: string;
  confidence: number;
  livenessCheck: boolean;
  antiSpoofing: boolean;
  enrollmentDate: Date;
  lastVerified?: Date;
}

// 用户绑定信息
export interface UnifiedUserBinding {
  boundUserId: string;
  bindingType: UnifiedUserBindingType;
  bindingStrength: UnifiedBindingStrength;
  verificationFrequency: UnifiedVerificationFrequency;
  fallbackAllowed: boolean;
  userFaceFeatures?: UnifiedFaceBiometricFeatures;
}

// Agent配置
export interface UnifiedAgentConfig {
  permissions: UnifiedPermission[];
  userBinding: UnifiedUserBinding;
}

// Agent统计信息
export interface UnifiedAgentStats {
  totalCalls: number;
  successRate: number;
  averageResponseTime: number;
  errorRate: number;
  uptimePercentage: number;
  connections: number;
  responseTime: number;
  uptime: number;
  popularity: number;
}

// 元数据
export interface UnifiedAgentMetadata {
  website?: string;
  documentation?: string;
  github?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    discord?: string;
  };
  pricing?: {
    type: 'free' | 'paid' | 'freemium';
    price?: number;
    currency: string;
  };
  tags: string[];
  categories: string[];
  securityLevel: 'low' | 'medium' | 'high';
  compliance: string[];
}

// 统一的Agent接口
export interface UnifiedAgent {
  // 基础信息
  id: string;
  agentId: string;
  name: string;
  description: string;
  type: UnifiedAgentType;
  capabilities: UnifiedAgentCapability[];
  status: UnifiedAgentStatus;

  // 技术信息
  codeHash?: string;
  profileHash?: string;
  version: string;
  model?: string;
  apiEndpoint?: string;
  language?: string;
  codeSize?: number;

  // 绑定信息
  boundUser?: string;
  boundAt?: string;
  config: UnifiedAgentConfig;
  permissions: UnifiedPermission[];

  // 时间信息
  createdAt: string;
  updatedAt: string;

  // 区块链信息
  blockchainInfo: UnifiedBlockchainInfo;

  // 评分和统计
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  isFeatured?: boolean;
  stats?: UnifiedAgentStats;

  // 元数据
  metadata: UnifiedAgentMetadata;

  // 最后活动
  lastActivity?: Date;
}

// Agent合约信息
export interface UnifiedAgentContract {
  id: string;
  contractAddress: string;
  contractName: string;
  ownerAddress: string;
  agentId: string;
  agentInfo: Omit<UnifiedAgent, 'blockchainInfo' | 'metadata'>;
  permissions: UnifiedPermission;
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'active' | 'suspended' | 'terminated';
  metadata: {
    tags: string[];
    description?: string;
    securityLevel: 'low' | 'medium' | 'high';
    compliance: string[];
  };
  blockchain: {
    network: string;
    blockNumber: number;
    transactionHash: string;
    gasUsed: number;
  };
}

// 数据管理器接口
export interface UnifiedAgentDataManager {
  // 获取所有Agent
  getAllAgents(): UnifiedAgent[];

  // 根据ID获取Agent
  getAgentById(id: string): UnifiedAgent | undefined;

  // 添加Agent
  addAgent(agent: Omit<UnifiedAgent, 'id' | 'agentId' | 'createdAt' | 'updatedAt'>): UnifiedAgent;

  // 更新Agent
  updateAgent(id: string, updates: Partial<UnifiedAgent>): boolean;

  // 删除Agent
  deleteAgent(id: string): boolean;

  // 获取Agent合约
  getAgentContracts(): UnifiedAgentContract[];

  // 添加Agent合约
  addAgentContract(contract: Omit<UnifiedAgentContract, 'id' | 'createdAt' | 'updatedAt'>): UnifiedAgentContract;

  // 更新Agent合约
  updateAgentContract(id: string, updates: Partial<UnifiedAgentContract>): boolean;

  // 删除Agent合约
  deleteAgentContract(id: string): boolean;

  // 搜索Agent
  searchAgents(query: string): UnifiedAgent[];

  // 过滤Agent
  filterAgents(filters: {
    status?: UnifiedAgentStatus;
    type?: UnifiedAgentType;
    capabilities?: UnifiedAgentCapability[];
    isVerified?: boolean;
    isOnChain?: boolean;
  }): UnifiedAgent[];

  // 获取统计信息
  getStats(): {
    totalAgents: number;
    activeAgents: number;
    inactiveAgents: number;
    verifiedAgents: number;
    onChainAgents: number;
    averageRating: number;
  };
}

// 事件监听器类型
export type AgentEventListener = (event: AgentEvent) => void;

// 事件类型
export type AgentEventType =
  | 'agent_added' | 'agent_updated' | 'agent_deleted'
  | 'contract_added' | 'contract_updated' | 'contract_deleted';

// 事件接口
export interface AgentEvent {
  type: AgentEventType;
  payload: any;
  timestamp: Date;
}

// 数据管理器配置
export interface UnifiedDataManagerConfig {
  enablePersistence?: boolean;
  enableEventListeners?: boolean;
  enableRealTimeSync?: boolean;
  storageKey?: string;
}