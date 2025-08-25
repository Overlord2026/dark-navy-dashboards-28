import { recordReceipt } from '@/features/receipts/record';

// Link wallets/addresses to beneficiaries and execution runbooks (off-chain)
export type BeneficiaryDirective = { 
  walletId: string; 
  asset?: string; 
  shares?: number; 
  toUserId: string; 
  unlock: 'TOD' | 'Executor' | 'TimeLock'; 
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};

let DIRS: Record<string, BeneficiaryDirective[]> = {};

export async function setDirectives(
  userId: string, 
  dirs: BeneficiaryDirective[]
): Promise<BeneficiaryDirective[]> { 
  DIRS[userId] = dirs.map(d => ({
    ...d,
    updatedAt: new Date().toISOString(),
    createdAt: d.createdAt || new Date().toISOString()
  }));
  
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'crypto.estate.directives.updated',
    reasons: [userId, String(dirs.length)],
    created_at: new Date().toISOString()
  });
  
  return DIRS[userId]; 
}

export async function getDirectives(userId: string): Promise<BeneficiaryDirective[]> { 
  return DIRS[userId] || []; 
}

export async function addDirective(
  userId: string,
  directive: Omit<BeneficiaryDirective, 'createdAt' | 'updatedAt'>
): Promise<BeneficiaryDirective> {
  const newDirective: BeneficiaryDirective = {
    ...directive,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const existing = await getDirectives(userId);
  await setDirectives(userId, [...existing, newDirective]);
  
  return newDirective;
}

export async function removeDirective(
  userId: string,
  walletId: string,
  toUserId: string
): Promise<void> {
  const existing = await getDirectives(userId);
  const filtered = existing.filter(d => !(d.walletId === walletId && d.toUserId === toUserId));
  await setDirectives(userId, filtered);
}