import { recordReceipt } from '@/features/receipts/record';
import { SettlementRDS } from '@/features/receipts/types';
import { anchorBatch } from '@/features/anchor/simple-providers';
import { hashSplit, SplitParty } from '../splits/preview';

export interface EscrowAccount {
  id: string;
  offerId: string;
  amount: number;
  status: 'held' | 'released' | 'disputed';
  createdAt: string;
  releasedAt?: string;
  txnId?: string;
}

const escrowAccounts: EscrowAccount[] = [];

export function hold(params: { offerId: string; amount: number }): { escrowId: string } {
  const escrowId = `escrow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const escrow: EscrowAccount = {
    id: escrowId,
    offerId: params.offerId,
    amount: params.amount,
    status: 'held',
    createdAt: new Date().toISOString()
  };

  escrowAccounts.push(escrow);
  
  console.info('escrow.held', { escrowId, amount: params.amount });
  
  return { escrowId };
}

export async function release(escrowId: string): Promise<{ txnId: string; receipt: SettlementRDS }> {
  const escrow = escrowAccounts.find(e => e.id === escrowId);
  if (!escrow) {
    throw new Error('Escrow account not found');
  }

  if (escrow.status !== 'held') {
    throw new Error('Escrow not in held status');
  }

  const txnId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  escrow.status = 'released';
  escrow.releasedAt = new Date().toISOString();
  escrow.txnId = txnId;

  // Create settlement receipt
  const offerData = { offerId: escrow.offerId, amount: escrow.amount };
  const attributionHash = await hashInputs(offerData);
  
  // Get split configuration for this offer
  const splitData: SplitParty[] = [
    { party: 'athlete', share: 0.75 },
    { party: 'advisor', share: 0.20 },
    { party: 'brand', share: 0.05 }
  ];
  const splitTreeHash = await hashSplit(splitData);

  const rds: SettlementRDS = {
    id: `settle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'Settlement-RDS',
    offerLock: `lock_${escrow.offerId}`,
    attribution_hash: attributionHash,
    split_tree_hash: splitTreeHash,
    escrow_state: 'released',
    anchor_ref: await anchorBatch(await hashInputs({ escrowId })),
    ts: new Date().toISOString()
  };

  const receipt = recordReceipt(rds);
  
  console.info('escrow.released', { escrowId, txnId, settlementId: receipt.id });
  
  return { txnId, receipt };
}

export function getEscrowAccounts(): EscrowAccount[] {
  return [...escrowAccounts];
}

export function getEscrowAccount(id: string): EscrowAccount | null {
  return escrowAccounts.find(e => e.id === id) || null;
}

import * as Canonical from '@/lib/canonical';

async function hashInputs(obj: any): Promise<string> {
  return await Canonical.hash(obj);
}