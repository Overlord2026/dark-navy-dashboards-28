import type { Checklist, ChecklistItemKey, ChecklistStatus, ChecklistItem } from './types';
import type { DocSignal } from './signals';
import * as Canonical from '@/lib/canonical';

const CLASS_TO_KEY: Record<string, ChecklistItemKey | undefined> = {
  Will: 'will',
  RLT: 'rlt',
  PourOver: 'pour_over',
  POA: 'poa_financial',
  HC_POA: 'hc_poa',
  AD: 'advance_directive',
  HIPAA: 'hipaa',
  Deed: 'deed_recorded',                // only COMPLETE on 'deed.recorded' signal
  Beneficiary: 'beneficiary_sync',
  FundingLetter: 'funding_letters',
  AttorneyFinal: 'attorney_review_final',
  NotaryFinal: 'notary_final'
};

function createItem(
  key: ChecklistItemKey, 
  status: ChecklistStatus, 
  reasons: string[] = [], 
  refs: string[] = []
): ChecklistItem {
  return { 
    key, 
    status, 
    updatedAt: new Date().toISOString(), 
    reasons, 
    refs 
  };
}

export async function applySignal(checklist: Checklist, signal: DocSignal): Promise<Checklist> {
  const newChecklist = { ...checklist };
  let hasChanges = false;

  console.log(`[Checklist] Applying signal ${signal.type} for client ${checklist.clientId}`);

  // 1) Project signal to checklist item
  if (signal.type === 'doc.ingested') {
    const key = CLASS_TO_KEY[signal.class];
    if (key && key !== 'deed_recorded') {
      const prevStatus = newChecklist.items[key]?.status;
      if (prevStatus !== 'COMPLETE') {
        newChecklist.items[key] = createItem(key, 'COMPLETE', ['ingest'], [signal.fileId, signal.hash]);
        hasChanges = true;
      }
    }
  }

  if (signal.type === 'deed.recorded') {
    const prevStatus = newChecklist.items.deed_recorded?.status;
    if (prevStatus !== 'COMPLETE') {
      newChecklist.items.deed_recorded = createItem(
        'deed_recorded', 
        'COMPLETE', 
        ['deed.recorded'], 
        [signal.fileId, signal.hash]
      );
      hasChanges = true;
    }
  }

  if (signal.type === 'arp.final.created') {
    const prevStatus = newChecklist.items.attorney_review_final?.status;
    if (prevStatus !== 'COMPLETE') {
      newChecklist.items.attorney_review_final = createItem(
        'attorney_review_final',
        'COMPLETE',
        ['arp.final'],
        [signal.fileId, signal.hash]
      );
      hasChanges = true;
    }
  }

  if (signal.type === 'notary.final.created') {
    const prevStatus = newChecklist.items.notary_final?.status;
    if (prevStatus !== 'COMPLETE') {
      newChecklist.items.notary_final = createItem(
        'notary_final',
        'COMPLETE',
        ['notary.final'],
        [signal.fileId, signal.hash]
      );
      hasChanges = true;
    }
  }

  if (signal.type === 'beneficiary.fixed') {
    const prevStatus = newChecklist.items.beneficiary_sync?.status;
    if (prevStatus !== 'COMPLETE') {
      newChecklist.items.beneficiary_sync = createItem(
        'beneficiary_sync',
        'COMPLETE',
        ['beneficiary.fix'],
        signal.hash ? [signal.hash] : []
      );
      hasChanges = true;
    }
  }

  if (signal.type === 'funding.letter') {
    const currentItem = newChecklist.items.funding_letters;
    const newStatus: ChecklistStatus = currentItem?.status === 'COMPLETE' ? 'COMPLETE' : 'PENDING';
    
    if (!currentItem || currentItem.status !== newStatus) {
      newChecklist.items.funding_letters = createItem(
        'funding_letters', 
        newStatus, 
        ['funding.letter'],
        signal.hash ? [signal.hash] : []
      );
      hasChanges = true;
    }
  }

  if (signal.type === 'esign.completed') {
    const key = CLASS_TO_KEY[signal.docType];
    if (key) {
      const prevStatus = newChecklist.items[key]?.status;
      if (prevStatus !== 'COMPLETE') {
        newChecklist.items[key] = createItem(key, 'COMPLETE', ['esign'], [signal.fileId, signal.hash]);
        hasChanges = true;
      }
    }
  }

  // 2) Apply cross-item validation rules
  const crossRuleChanges = applyCrossItemRules(newChecklist);
  if (crossRuleChanges) {
    hasChanges = true;
  }

  // 3) Update checklist hash if there were changes
  if (hasChanges) {
    newChecklist.lastUpdated = new Date().toISOString();
    newChecklist.hash = await computeChecklistHash(newChecklist);
  }

  return newChecklist;
}

function applyCrossItemRules(checklist: Checklist): boolean {
  let hasChanges = false;

  // Rule: RLT without recorded deed -> NEEDS_ATTENTION on deed
  if (checklist.items.rlt?.status === 'COMPLETE' && checklist.items.deed_recorded?.status !== 'COMPLETE') {
    const current = checklist.items.deed_recorded;
    if (!current || current.status !== 'NEEDS_ATTENTION' || !current.reasons?.includes('trust_without_deed')) {
      checklist.items.deed_recorded = createItem(
        'deed_recorded',
        'NEEDS_ATTENTION',
        ['trust_without_deed'],
        current?.refs || []
      );
      hasChanges = true;
    }
  }

  // Rule: Healthcare packet consistency
  const healthcareKeys: ChecklistItemKey[] = ['hc_poa', 'advance_directive', 'hipaa'];
  const healthcareComplete = healthcareKeys.every(key => 
    checklist.items[key]?.status === 'COMPLETE'
  );

  if (!healthcareComplete) {
    healthcareKeys.forEach(key => {
      const current = checklist.items[key];
      if (current?.status !== 'COMPLETE') {
        const newStatus: ChecklistStatus = current?.status === 'PENDING' ? 'PENDING' : 'NEEDS_ATTENTION';
        const hasHealthIncomplete = current?.reasons?.includes('health_incomplete');
        
        if (!current || current.status !== newStatus || !hasHealthIncomplete) {
          checklist.items[key] = createItem(
            key,
            newStatus,
            ['health_incomplete'],
            current?.refs || []
          );
          hasChanges = true;
        }
      }
    });
  } else {
    // Clear health_incomplete reasons if all healthcare docs are complete
    healthcareKeys.forEach(key => {
      const current = checklist.items[key];
      if (current?.reasons?.includes('health_incomplete')) {
        checklist.items[key] = createItem(
          key,
          'COMPLETE',
          current.reasons.filter(r => r !== 'health_incomplete'),
          current.refs || []
        );
        hasChanges = true;
      }
    });
  }

  return hasChanges;
}

export function bootstrapChecklist(clientId: string, state?: string): Checklist {
  const baseKeys: ChecklistItemKey[] = [
    'will', 'rlt', 'pour_over', 'poa_financial', 'hc_poa', 'advance_directive', 
    'hipaa', 'deed_recorded', 'beneficiary_sync', 'funding_letters', 
    'attorney_review_final', 'notary_final'
  ];
  
  const items = Object.fromEntries(
    baseKeys.map(key => [key, createItem(key, 'PENDING')])
  ) as Record<ChecklistItemKey, ChecklistItem>;

  return {
    clientId,
    state,
    items,
    lastUpdated: new Date().toISOString()
  };
}

async function computeChecklistHash(checklist: Checklist): Promise<string> {
  const hashInput = {
    clientId: checklist.clientId,
    items: Object.entries(checklist.items).map(([key, item]) => ({
      key,
      status: item.status,
      reasons: item.reasons?.slice(0, 3) || [] // Limit for consistency
    }))
  };
  
  return await Canonical.hash(hashInput);
}