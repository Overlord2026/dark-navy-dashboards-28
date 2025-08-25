// Link wallets/addresses to beneficiaries and execution runbooks (off-chain)
export type BeneficiaryDirective = { 
  walletId:string; 
  asset?:string; 
  shares?:number; 
  toUserId:string; 
  unlock:'TOD'|'Executor'|'TimeLock'; 
  notes?:string 
};

// Legacy interface for compatibility
export interface CryptoDirective {
  id: string;
  userId: string;
  walletId: string;
  type: 'transfer' | 'hold' | 'liquidate';
  beneficiary: string;
  instructions: string;
  accessMethod: 'seed' | 'hardware' | 'exchange' | 'vault';
  createdAt: string;
  updatedAt: string;
}

let DIRS: Record<string,BeneficiaryDirective[]> = {};

export async function setDirectives(userId:string, dirs:BeneficiaryDirective[]){ 
  DIRS[userId]=dirs; 
  return dirs; 
}

export async function getDirectives(userId:string){ 
  return DIRS[userId]||[]; 
}

export async function addDirective(userId:string, directive:BeneficiaryDirective){ 
  if (!DIRS[userId]) DIRS[userId] = [];
  DIRS[userId].push(directive);
  return directive;
}

export async function removeDirective(userId:string, walletId:string, toUserId:string){ 
  if (!DIRS[userId]) return false;
  const index = DIRS[userId].findIndex(d => d.walletId === walletId && d.toUserId === toUserId);
  if (index > -1) {
    DIRS[userId].splice(index, 1);
    return true;
  }
  return false;
}