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
  resources: ResourceConfig;
}

export interface ResourceConfig {
  memory: string;
  cpu: string;
  storage: string;
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