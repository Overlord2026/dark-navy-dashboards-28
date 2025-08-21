import { recordReceipt } from '@/features/receipts/record';
import { DeltaRDS } from '@/features/receipts/types';

export interface Dispute {
  id: string;
  offerId: string;
  code: string;
  notes: string;
  status: 'filed' | 'reviewing' | 'resolved' | 'closed';
  filedAt: string;
  resolvedAt?: string;
  outcome?: string;
}

export interface Reallocation {
  field: string;
  from: any;
  to: any;
}

const disputes: Dispute[] = [];

export function fileDispute(offerId: string, code: string, notes: string): string {
  const disputeId = `dispute_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const dispute: Dispute = {
    id: disputeId,
    offerId,
    code,
    notes,
    status: 'filed',
    filedAt: new Date().toISOString()
  };

  disputes.push(dispute);
  
  console.info('dispute.filed', { disputeId, offerId, code });
  
  return disputeId;
}

export function adjudicate(
  disputeId: string, 
  outcome: string, 
  reallocation: Reallocation[]
): DeltaRDS {
  const dispute = disputes.find(d => d.id === disputeId);
  if (!dispute) {
    throw new Error('Dispute not found');
  }

  if (dispute.status === 'resolved') {
    throw new Error('Dispute already resolved');
  }

  dispute.status = 'resolved';
  dispute.resolvedAt = new Date().toISOString();
  dispute.outcome = outcome;

  // Find prior settlement or contract for this offer
  const priorRef = `settlement_${dispute.offerId}` || `contract_${dispute.offerId}`;

  const rds: DeltaRDS = {
    id: `delta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'Delta-RDS',
    prior_ref: priorRef,
    diffs: reallocation,
    reasons: ['ADJUDICATION_RULE_APPLIED', `DISPUTE_${dispute.code}`],
    ts: new Date().toISOString()
  };

  const receipt = recordReceipt(rds);
  
  console.info('dispute.adjudicated', { 
    disputeId, 
    outcome, 
    deltaId: receipt.id,
    reallocations: reallocation.length 
  });
  
  return receipt;
}

export function getDisputes(): Dispute[] {
  return [...disputes];
}

export function getDispute(id: string): Dispute | null {
  return disputes.find(d => d.id === id) || null;
}

export function getDisputesByOffer(offerId: string): Dispute[] {
  return disputes.filter(d => d.offerId === offerId);
}