import { setPositions, addTx } from './store';
import { recordReceipt } from '@/features/receipts/record';
import type { Exchange } from './types';

export async function linkExchange(
  walletId: string, 
  ex: Exchange, 
  scopes: 'read' | 'trade'
): Promise<{ ok: boolean }> {
  await recordReceipt({ 
    type: 'Consent-RDS', 
    scope: { 'crypto.exchange': [walletId, ex, scopes] }, 
    result: 'approve', 
    created_at: new Date().toISOString() 
  });
  return { ok: true };
}

export async function ingestExchangeSnapshot(walletId: string): Promise<void> {
  // TODO: call exchange API → balances & trades
  await setPositions(walletId, []);  // positions
  await recordReceipt({ 
    type: 'Decision-RDS', 
    action: 'crypto.ingest.snapshot', 
    reasons: [walletId], 
    created_at: new Date().toISOString() 
  });
}

export async function ingestWatchOnly(
  walletId: string, 
  addrs: Array<{ chain: string; address: string }>
): Promise<void> {
  // TODO: call block explorers to assemble balances; store as positions; leave TX refs
  await setPositions(walletId, []);
  await recordReceipt({ 
    type: 'Decision-RDS', 
    action: 'crypto.ingest.watchonly', 
    reasons: [walletId], 
    created_at: new Date().toISOString() 
  });
}