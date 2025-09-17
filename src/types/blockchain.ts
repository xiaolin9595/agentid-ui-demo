export interface Transaction {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  gasUsed: number;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
  type: 'user_registration' | 'agent_registration' | 'agent_update' | 'authentication';
  value?: string;
  nonce: number;
}

export interface Contract {
  address: string;
  type: 'user' | 'agent';
  owner: string;
  createdAt: string;
  status: 'active' | 'inactive';
  balance?: string;
}

export interface Block {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: string;
  transactionCount: number;
  gasUsed: number;
  gasLimit: number;
  difficulty?: string;
  size: number;
}

export interface ZKProof {
  proof: string;
  publicInputs: string[];
  verificationKey: string;
  gasEstimate: number;
  confidence: number;
}

export interface ContractCall {
  contractAddress: string;
  methodName: string;
  parameters: any[];
  gasLimit?: number;
  value?: string;
}

export interface BlockchainStats {
  totalBlocks: number;
  totalTransactions: number;
  totalContracts: number;
  averageGasPrice: number;
  networkStatus: 'healthy' | 'congested' | 'down';
}