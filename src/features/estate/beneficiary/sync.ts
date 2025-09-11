import { getEstateIntent, listAccountsWithBeneficiaries } from '@/features/estate/api';
import { recordReceipt } from '@/features/receipts/record';
import * as Canonical from '@/lib/canonical';

export interface BeneficiaryMismatch {
  accountId: string;
  intent: string;
  current: string;
  fixSuggestion?: string;
}

export async function scanBeneficiaries(clientId: string): Promise<BeneficiaryMismatch[]> {
  const intent = await getEstateIntent(clientId); // {accountIntent:{accountId:intendedBeneficiary}}
  const accts = await listAccountsWithBeneficiaries(clientId); // [{accountId,currentBeneficiary}]
  const mismatches: BeneficiaryMismatch[] = [];
  
  for (const a of accts) {
    const intended = intent.accountIntent[a.accountId];
    if (intended && intended !== a.currentBeneficiary) {
      mismatches.push({
        accountId: a.accountId,
        intent: intended,
        current: a.currentBeneficiary,
        fixSuggestion: `Update beneficiary from "${a.currentBeneficiary}" to "${intended}"`
      });
    }
  }
  
  if (mismatches.length) {
    const inputs_hash = await Canonical.hash({ clientId, mismatches });
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'beneficiary.sync',
      policy_version: 'E-2025.08',
      inputs_hash,
      reasons: ['BENEFICIARY_WARN'],
      created_at: new Date().toISOString()
    } as any);
  }
  
  return mismatches;
}