import { scanBeneficiaries, type BeneficiaryMismatch } from '@/features/estate/beneficiary/sync';
import { recordReceipt } from '@/features/receipts/record';

export default async function seedBeneficiaryDemo() {
  console.log('[Seeds] Starting beneficiary sync demo...');
  
  try {
    // Create mock beneficiary mismatches
    const mockMismatches: (BeneficiaryMismatch & { clientId: string })[] = [
      {
        clientId: 'client-1',
        accountId: 'account-401k-primary',
        intent: 'spouse',
        current: 'estate',
        fixSuggestion: 'Update beneficiary from "estate" to "spouse"'
      },
      {
        clientId: 'client-1', 
        accountId: 'account-ira-rollover',
        intent: 'children-equal',
        current: 'spouse',
        fixSuggestion: 'Update beneficiary from "spouse" to "children-equal"'
      },
      {
        clientId: 'client-2',
        accountId: 'account-brokerage-joint',
        intent: 'trust-revocable',
        current: 'children',
        fixSuggestion: 'Update beneficiary from "children" to "trust-revocable"'
      }
    ];

    // Store mismatches in localStorage
    localStorage.setItem('beneficiary_mismatches', JSON.stringify(mockMismatches));
    localStorage.setItem('last_beneficiary_sync', new Date().toISOString());

    // Create beneficiary.sync Decision-RDS receipt
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'beneficiary.sync',
      policy_version: 'E-2025.08',
      reasons: ['BENEFICIARY_WARN'],
      created_at: new Date().toISOString()
    } as any);

    // Create job summary receipt
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'job.beneficiary.sync',
      reasons: [String(mockMismatches.length)],
      created_at: new Date().toISOString()
    } as any);

    console.log(`[Seeds] Created ${mockMismatches.length} beneficiary mismatches and receipts`);
    
    return {
      mismatches: mockMismatches.length,
      receipts: 2,
      message: 'Beneficiary sync demo loaded successfully'
    };
  } catch (error) {
    console.error('[Seeds] Failed to seed beneficiary demo:', error);
    throw error;
  }
}