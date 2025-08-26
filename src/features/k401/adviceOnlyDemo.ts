import { recordReceipt } from '@/features/receipts/store';

/**
 * Generate advice-only demo that emits Delivery-RDS and Reconciliation-RDS
 * without requiring live trading credentials
 */
export async function runAdviceOnlyDemo(): Promise<{
  deliveryReceipt: any;
  reconciliationReceipt: any;
}> {
  const timestamp = new Date().toISOString();
  
  // Generate Delivery-RDS (content-free)
  await recordReceipt({
    receipt_id: `rds_delivery_demo_${Date.now()}`,
    type: 'Delivery-RDS',
    ts: timestamp,
    policy_version: 'K-2025',
    inputs_hash: 'sha256:advice_only_demo',
    delivery_details: {
      channel: 'secure_link',
      ttl_min: 120,
      content_type: 'advice_summary',
      status: 'delivered'
    },
    reasons: ['advice_only', 'demo_mode', 'no_live_trades']
  });

  // Generate Reconciliation-RDS (content-free)
  await recordReceipt({
    receipt_id: `rds_reconciliation_demo_${Date.now()}`,
    type: 'Reconciliation-RDS',
    ts: timestamp,
    policy_version: 'K-2025',
    inputs_hash: 'sha256:advice_only_demo',
    reconciliation_details: {
      fills_hash: 'sha256:demo_fills_placeholder',
      status: 'MATCHED',
      trade_count: 0,
      advice_only: true
    },
    reasons: ['demo_reconciliation', 'no_actual_trades', 'advice_validation']
  });

  console.log('✅ Advice-only demo completed');

  return { 
    deliveryReceipt: { receipt_id: `rds_delivery_demo_${Date.now()}` }, 
    reconciliationReceipt: { receipt_id: `rds_reconciliation_demo_${Date.now()}` } 
  };
}

/**
 * Check if advice-only demo has been run recently
 */
export function hasRecentAdviceDemo(): boolean {
  try {
    const receipts = JSON.parse(localStorage.getItem('receipts.store.json') || '[]');
    const recentDemo = receipts.find((r: any) => 
      r.type === 'Delivery-RDS' && 
      r.reasons?.includes('advice_only') &&
      new Date(r.ts).getTime() > Date.now() - (24 * 60 * 60 * 1000) // 24 hours
    );
    return !!recentDemo;
  } catch {
    return false;
  }
}