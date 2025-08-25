import { recordReceipt } from '@/features/receipts/record';
import { maybeAnchor, generateHash } from '@/features/anchors/hooks';

// Generate Schwab PCRA / Fidelity BrokerageLink LPOA/Trading Authorization forms (stub)
export async function generateLPOA({
  provider, 
  clientId, 
  advisorUserId
}: {
  provider: 'Schwab' | 'Fidelity' | 'Other';
  clientId: string;
  advisorUserId: string;
}) {
  // TODO: merge template & save PDF to Vault
  const lpoaData = {
    provider,
    clientId,
    advisorUserId,
    generatedAt: new Date().toISOString(),
    type: 'trading_authorization'
  };
  
  const lpoaHash = await generateHash(JSON.stringify(lpoaData));
  
  await recordReceipt({ 
    type: 'Decision-RDS', 
    action: 'k401.lpoa.generated', 
    reasons: [provider, clientId, advisorUserId, lpoaHash.slice(0, 16)], 
    created_at: new Date().toISOString() 
  } as any);
  
  // Optional anchoring
  await maybeAnchor('k401.lpoa', lpoaHash);
  
  alert('LPOA generated (stub).');
  
  return {
    lpoaId: crypto.randomUUID(),
    provider,
    clientId,
    advisorUserId,
    hash: lpoaHash,
    status: 'generated'
  };
}