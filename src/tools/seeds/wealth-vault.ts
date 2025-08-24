// /src/tools/seeds/wealth-vault.ts
export async function seedWealthVault() {
  const now = new Date().toISOString();
  const { recordReceipt } = await import('@/features/receipts/record');
  recordReceipt({
    id: `vault_${Date.now()}`,
    type: 'Decision-RDS',
    policy_version: 'E-2025.08',
    inputs_hash: 'sha256:demo',
    result: 'approve',
    reasons: ['WEALTHDOC.ADD'],
    created_at: now
  } as any);
  return true;
}

// Wealth Vault seeder (legacy fallback)
import { supabase } from '@/integrations/supabase/client';

export default async function seedWealthVaultLegacy() {
  try {
    // Create mock proof slips for the wealth vault tool
    const proofSlips = [
      {
        id: `wv-${Date.now()}-1`,
        type: 'Wealth Doc Add',
        tool: 'wealth-vault',
        timestamp: new Date().toISOString(),
        anchored: true,
        data: {
          documentType: 'Will',
          title: 'Last Will and Testament',
          status: 'Keep-Safe encrypted',
          hash: 'demo-hash-123',
          size: '2.4 MB',
          uploaded: new Date().toISOString()
        }
      },
      {
        id: `wv-${Date.now()}-2`,
        type: 'Trust Document',
        tool: 'wealth-vault',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        anchored: true,
        data: {
          documentType: 'Trust',
          title: 'Family Trust Agreement',
          status: 'Secured',
          hash: 'demo-hash-456',
          beneficiaries: 3,
          assets: 'Real estate, investments'
        }
      },
      {
        id: `wv-${Date.now()}-3`,
        type: 'Insurance Policy',
        tool: 'wealth-vault',
        timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        anchored: false,
        data: {
          documentType: 'Insurance',
          title: 'Life Insurance Policy',
          coverage: '$500,000',
          premium: '$2,400/year',
          beneficiary: 'Spouse'
        }
      }
    ];

    // Store in localStorage for demo (in production, this would go to Supabase)
    const existingSlips = JSON.parse(localStorage.getItem('proofSlips') || '[]');
    const updatedSlips = [...existingSlips, ...proofSlips];
    localStorage.setItem('proofSlips', JSON.stringify(updatedSlips));

    console.log('✅ Seeded wealth-vault with 3 proof slips');
    return true;
  } catch (error) {
    console.error('Failed to seed Wealth Vault data:', error);
    return false;
  }
}