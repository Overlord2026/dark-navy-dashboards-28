import { getDirectives } from '@/features/crypto/estate/directives';
import { exportStatementsToVault } from '@/features/crypto/vault/export';
import { recordReceipt } from '@/features/receipts/record';
import { maybeAnchor, generateHash } from '@/features/anchors/hooks';

export async function includeCryptoInEstatePacket(userId: string, walletIds: string[]) {
  try {
    const dirs = await getDirectives(userId);
    
    // 1) Export directives to a small PDF/JSON (replace with PDF later)
    const directivesData = { 
      userId, 
      directives: dirs, 
      walletIds,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const json = JSON.stringify(directivesData, null, 2);
    const directivesHash = await generateHash(json);
    
    // Create download for directives
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crypto_directives_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    // 2) Export last statements to Vault
    const exportedStatements = [];
    for (const walletId of walletIds) {
      try {
        const statementResult = await exportStatementsToVault(walletId);
        exportedStatements.push({ walletId, success: true, fileId: statementResult?.fileId });
      } catch (error) {
        console.error(`Failed to export statements for wallet ${walletId}:`, error);
        exportedStatements.push({ walletId, success: false, error: error.message });
      }
    }

    // 3) Content-free receipts with optional anchoring
    await recordReceipt({ 
      type: 'Decision-RDS', 
      action: 'estate.crypto.include', 
      reasons: [userId, `wallets:${walletIds.length}`, directivesHash.slice(0, 16)], 
      created_at: new Date().toISOString() 
    } as any);
    
    await recordReceipt({ 
      type: 'Decision-RDS', 
      action: 'estate.checklist.mapped', 
      reasons: ['crypto_directives', 'COMPLETE', directivesHash.slice(0, 16)], 
      created_at: new Date().toISOString() 
    } as any);

    // Optional anchoring
    await maybeAnchor('estate.crypto', directivesHash);

    const successCount = exportedStatements.filter(s => s.success).length;
    const failureCount = exportedStatements.filter(s => !s.success).length;

    if (failureCount > 0) {
      alert(`Crypto directives exported. ${successCount} wallet statements exported successfully, ${failureCount} failed. Check console for details.`);
    } else {
      alert(`Crypto directives + ${successCount} wallet statements included in your estate packet.`);
    }

    return {
      directivesExported: true,
      directivesHash,
      statementsExported: exportedStatements,
      successCount,
      failureCount
    };
    
  } catch (error) {
    console.error('Failed to include crypto in estate packet:', error);
    alert('Failed to include crypto in estate packet. Please try again.');
    throw error;
  }
}