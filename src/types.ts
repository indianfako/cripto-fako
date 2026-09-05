export interface CodeFile {
  id: string;
  path: string;
  filename: string;
  directory: string;
  language: 'json' | 'solidity' | 'typescript' | 'markdown' | 'bash';
  description: string;
  content: string;
  badge: string;
}

export interface BlockData {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  validator: string;
  txCount: number;
  gasUsed: string;
  gasLimit: string;
  round: number;
}

export interface SystemTransaction {
  id: string;
  hash: string;
  blockNumber: number;
  timestamp: number;
  type: 'MINT' | 'BURN' | 'TRANSFER' | 'STAKE' | 'WITHDRAW';
  from: string;
  to: string;
  amount: number;
  status: 'confirmed' | 'pending';
}

export interface ValidatorInfo {
  address: string;
  name: string;
  status: 'ACTIVE' | 'SYNCED';
  proposals: number;
  uptime: string;
}
