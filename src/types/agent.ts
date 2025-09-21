export interface Agent {
  id: string;
  agentId: string;
  name: string;
  description: string;
  codeHash: string;
  profileHash: string;
  status: 'active' | 'inactive' | 'stopped' | 'error';
  boundUser: string;
  boundAt: string;
  createdAt: string;
  updatedAt: string;
  codeSize: number;
  language: string;
  config: AgentConfig;
  permissions: AgentPermission[];
}

export interface AgentConfig {
  maxConcurrency: number;
  timeout: number;
  permissions: string[];
  userBinding: UserBinding;
}

export interface UserBinding {
  userId: string;
  userFaceFeatures?: FaceBiometricFeatures;
  bindingType: 'userId' | 'faceBiometrics' | 'multiFactor';
  bindingStrength: 'basic' | 'enhanced' | 'strict';
  verificationFrequency: 'once' | 'daily' | 'perRequest';
  fallbackAllowed: boolean;
}

export interface FaceBiometricFeatures {
  featureVector: number[];
  templateId: string;
  confidence: number;
  livenessCheck: boolean;
  antiSpoofing: boolean;
  enrollmentDate: Date;
  lastVerified?: Date;
}

export type AgentPermission = 'read' | 'write' | 'execute' | 'admin';

export interface CreateAgentData {
  name: string;
  description: string;
  codeFile: File | null;
  config: AgentConfig;
}

export interface UpdateAgentData {
  name?: string;
  description?: string;
  config?: Partial<AgentConfig>;
  status?: Agent['status'];
}

export interface AgentMetrics {
  cpu: number;
  memory: number;
  connections: number;
  rps: number;
  uptime: number;
}

export interface AgentStatus {
  health: 'healthy' | 'warning' | 'error';
  status: Agent['status'];
  lastUpdate: string;
  events: StatusEvent[];
}

export interface StatusEvent {
  timestamp: string;
  type: 'info' | 'warning' | 'error';
  message: string;
}

export interface AgentPaginationParams {
  page: number;
  pageSize: number;
}

export interface AgentFilterParams {
  status?: string;
  language?: string;
  search?: string;
}

export interface AgentSortParams {
  field: string;
  order: 'asc' | 'desc';
}