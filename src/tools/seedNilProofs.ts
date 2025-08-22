import { recordReceipt } from '@/features/receipts/record';

export function seedNilProofs() {
  const now = new Date().toISOString();

  recordReceipt({
    id: `nil_training_${Date.now()}`,
    type: 'Decision-RDS',
    policy_version: 'NIL-2025.08',
    inputs_hash: 'sha256:nil.demo',
    result: 'approve',
    reasons: ['TRAINING_COMPLETE'],
    created_at: now
  } as any);

  recordReceipt({
    id: `nil_disclosure_${Date.now()+1}`,
    type: 'Decision-RDS',
    policy_version: 'NIL-2025.08',
    inputs_hash: 'sha256:nil.demo',
    result: 'approve',
    reasons: ['DISCLOSURE_OK:instagram/us'],
    created_at: now
  } as any);

  recordReceipt({
    id: `nil_offer_${Date.now()+2}`,
    type: 'Decision-RDS',
    policy_version: 'NIL-2025.08',
    inputs_hash: 'sha256:nil.demo',
    result: 'approve',
    reasons: ['OFFERLOCK_OK','BRAND_SAFE'],
    created_at: now
  } as any);

  recordReceipt({
    id: `nil_settlement_${Date.now()+3}`,
    type: 'Decision-RDS',
    policy_version: 'NIL-2025.08',
    inputs_hash: 'sha256:nil.demo',
    result: 'approve',
    reasons: ['PAYMENT_RELEASED'],
    created_at: now
  } as any);
}