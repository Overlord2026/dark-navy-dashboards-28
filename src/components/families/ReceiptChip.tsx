// Legacy ReceiptChip - redirects to new unified component
export { ReceiptChip } from '@/components/receipts/ReceiptChip';

// For backward compatibility, create a wrapper component
import { ReceiptChip as NewReceiptChip } from '@/components/receipts/ReceiptChip';
import type { DecisionRDS } from '@/services/decisions';

interface LegacyReceiptChipProps {
  hash: string;
  anchored: boolean;
  policyVersion?: string;
  className?: string;
}

export function LegacyReceiptChip({ hash, anchored, policyVersion, className }: LegacyReceiptChipProps) {
  // Convert legacy props to new format
  const mockReceipt: DecisionRDS = {
    id: 'legacy-' + Date.now(),
    type: 'Decision-RDS',
    subject_id: 'legacy-subject',
    action: 'legacy_action',
    reasons: ['LEGACY_COMPATIBILITY'],
    result: 'approve',
    inputs_hash: '',
    policy_hash: '',
    receipt_hash: hash,
    policy_version: policyVersion || 'LEGACY-2024.09',
    anchor_ref: {
      type: 'merkle_inclusion',
      proof_ok: anchored,
      timestamp: new Date().toISOString()
    },
    created_at: new Date().toISOString()
  };

  return <NewReceiptChip receipt={mockReceipt} className={className} variant="compact" />;
}