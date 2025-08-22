import { recordReceipt } from '@/features/receipts/record';

export function seedFamilyProofs() {
  const now = new Date().toISOString();
  recordReceipt({
    id: `calc_${Date.now()}`,
    type: 'Decision-RDS',
    policy_version: 'E-2025.08',
    inputs_hash: 'sha256:demo',
    result: 'approve',
    reasons: ['CALC_STARTED:retirement-roadmap'],
    created_at: now
  } as any);

  recordReceipt({
    id: `review_${Date.now()+1}`,
    type: 'Decision-RDS',
    policy_version: 'E-2025.08',
    inputs_hash: 'sha256:demo',
    result: 'approve',
    reasons: ['PROPOSAL_REVIEW:annuities'],
    created_at: now
  } as any);
}