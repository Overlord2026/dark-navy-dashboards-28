import { recordReceipt } from '@/features/receipts/record';

export async function exportStatementsToVault(walletId: string): Promise<{ fileId: string }> {
  // TODO: fetch statements from exchange; save to Vault (Keep-Safe)
  const fileId = `vault://crypto/${walletId}/statements-${new Date().getFullYear()}.zip`;
  
  await recordReceipt({ 
    type: 'Vault-RDS', 
    bucket: 'Keep-Safe', 
    file_id: fileId, 
    created_at: new Date().toISOString() 
  });
  
  return { fileId };
}

export async function exportDirectivesToVault(
  userId: string, 
  directives: any[]
): Promise<{ fileId: string }> {
  const fileId = `vault://crypto/estate/${userId}/beneficiary-directives-${Date.now()}.pdf`;
  
  await recordReceipt({
    type: 'Vault-RDS',
    bucket: 'Keep-Safe',
    file_id: fileId,
    created_at: new Date().toISOString()
  });
  
  await recordReceipt({
    type: 'Decision-RDS',
    action: 'crypto.estate.directives.archived',
    reasons: [userId, String(directives.length)],
    created_at: new Date().toISOString()
  });
  
  return { fileId };
}

export async function exportTaxReportToVault(
  walletId: string,
  year: number
): Promise<{ fileId: string }> {
  const fileId = `vault://crypto/tax/${walletId}/tax-report-${year}.pdf`;
  
  await recordReceipt({
    type: 'Vault-RDS',
    bucket: 'Keep-Safe',
    file_id: fileId,
    created_at: new Date().toISOString()
  });
  
  return { fileId };
}
