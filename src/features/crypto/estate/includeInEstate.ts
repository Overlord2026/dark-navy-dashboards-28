import { getDirectives } from '@/features/crypto/estate/directives';
import { exportStatementsToVault } from '@/features/crypto/vault/export';
import { recordReceipt } from '@/features/receipts/record';

export async function includeCryptoInEstatePacket(userId: string, walletIds: string[]) {
  try {
    const dirs = await getDirectives(userId);
    
    // 1) Export directives to a small PDF/JSON (replace with PDF later)
    const json = JSON.stringify({ 
      userId, 
      directives: dirs, 
      walletIds,
      at: new Date().toISOString() 
    }, null, 2);
    
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    a.download = 'crypto_directives.json';
    a.click();

    // 2) Export last statements to Vault
    for (const w of walletIds) {
      await exportStatementsToVault(w);
    }

    // 3) Receipts (content-free) + Checklist tick
    await recordReceipt({ 
      type: 'Decision-RDS', 
      action: 'estate.crypto.include', 
      reasons: [userId, `wallets:${walletIds.length}`], 
      created_at: new Date().toISOString() 
    } as any);
    
    await recordReceipt({ 
      type: 'Decision-RDS', 
      action: 'estate.checklist.mapped', 
      reasons: ['crypto_directives', 'COMPLETE'], 
      created_at: new Date().toISOString() 
    } as any);

    alert('Crypto directives + statements included in your estate packet.');
    
  } catch (error) {
    console.error('Failed to include crypto in estate packet:', error);
    alert('Failed to include crypto in estate packet. Please try again.');
  }
}