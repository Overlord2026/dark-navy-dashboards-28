import { scanBeneficiaries } from '@/features/estate/beneficiary/sync';
import { createBeneficiaryTask } from '@/features/tasks/create';
import { buildFixLetterPdf } from '@/features/estate/beneficiary/fixPdf';
import { grantPre, storeInVault } from '@/features/vault/api';
import { recordReceipt } from '@/features/receipts/record';
import type { JobResult } from './types';

import { listClients } from '@/features/family/api';

export async function runBeneficiarySync(): Promise<JobResult> {
  try {
    const clients = await listClients();
    let total = 0;
    
    for (const c of clients) {
      const mm = await scanBeneficiaries(c.id);
      total += mm.length;
      
      for (const m of mm) {
        await createBeneficiaryTask(c.id, m.accountId, m.intent, m.current);
        
        // Optional: pre-generate letter PDF and store in Vault (Keep-Safe)
        const pdf = await buildFixLetterPdf({
          clientId: c.id,
          accountId: m.accountId,
          intent: m.intent,
          current: m.current
        });
        
        const { hash } = await storeInVault(pdf, `beneficiary-fix-${m.accountId}.pdf`, true);
        const ref = await grantPre('custodian', [hash], 30);
        
        // Record a Comms-RDS only when actually sent, not here
      }
    }
    
    // Job summary receipt
    await recordReceipt({
      type: 'Decision-RDS',
      action: 'job.beneficiary.sync',
      reasons: [String(total)],
      created_at: new Date().toISOString()
    } as any);
    
    return { ok: true, count: total };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      count: 0
    };
  }
}
