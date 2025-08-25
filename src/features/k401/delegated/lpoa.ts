import { recordReceipt } from '@/features/receipts/record';

// Generate Schwab PCRA / Fidelity BrokerageLink LPOA/Trading Authorization forms (stub)
export async function generateLPOA({provider, clientId, advisorUserId}: {
  provider: 'Schwab'|'Fidelity'|'Other', 
  clientId: string, 
  advisorUserId: string
}) {
  // TODO: merge template & save PDF to Vault
  await recordReceipt({ 
    type: 'Decision-RDS', 
    action: 'k401.lpoa.generated', 
    reasons: [provider, clientId, advisorUserId], 
    created_at: new Date().toISOString() 
  } as any);
  
  alert('LPOA generated (stub).');
}