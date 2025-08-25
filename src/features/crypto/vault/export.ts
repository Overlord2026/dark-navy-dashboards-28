// Crypto vault export functionality
import { recordReceipt } from '@/features/receipts/record';

export interface CryptoStatement {
  walletId: string;
  balance: number;
  currency: string;
  lastUpdated: string;
  transactions: Array<{
    hash: string;
    amount: number;
    timestamp: string;
    type: 'send' | 'receive';
  }>;
}

export async function exportStatementsToVault(walletId: string): Promise<void> {
  try {
    // Mock crypto statement generation
    const statement: CryptoStatement = {
      walletId,
      balance: Math.random() * 10,
      currency: walletId.includes('btc') ? 'BTC' : 'ETH',
      lastUpdated: new Date().toISOString(),
      transactions: [
        {
          hash: `0x${Math.random().toString(16).substr(2, 64)}`,
          amount: Math.random() * 0.5,
          timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
          type: Math.random() > 0.5 ? 'receive' : 'send'
        }
      ]
    };

    // Generate statement as JSON (would be PDF in production)
    const statementJson = JSON.stringify(statement, null, 2);
    
    // Save to mock vault storage
    const vaultFiles = JSON.parse(localStorage.getItem('vault_files') || '[]');
    const fileName = `crypto_statement_${walletId}_${Date.now()}.json`;
    
    vaultFiles.push({
      id: `file_${Date.now()}`,
      name: fileName,
      type: 'crypto_statement',
      content: statementJson,
      walletId,
      uploadedAt: new Date().toISOString(),
      size: statementJson.length
    });
    
    localStorage.setItem('vault_files', JSON.stringify(vaultFiles));
    
    // Record export receipt
    await recordReceipt({
      type: 'Vault-RDS',
      action: 'crypto.statement.export',
      reasons: [walletId, 'vault_stored'],
      created_at: new Date().toISOString()
    } as any);
    
    console.log(`✅ Exported crypto statement for wallet ${walletId} to vault`);
    
  } catch (error) {
    console.error(`❌ Failed to export statement for wallet ${walletId}:`, error);
    throw error;
  }
}