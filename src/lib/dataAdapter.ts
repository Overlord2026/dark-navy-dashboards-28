import { MOCK_MODE } from "@/config/featureFlags";

export type RDS = {
  id: string;
  type: string;
  created_at: string;
  value: any;
  family?: string;
};

type Store = {
  receipts: RDS[];
};

let store: Store = { receipts: [] };

export async function initMock() {
  if (!MOCK_MODE) return;
  
  // Try to load from localStorage first
  const saved = localStorage.getItem('mock.receipts');
  if (saved) {
    try {
      store.receipts = JSON.parse(saved);
      console.log('Loaded receipts from localStorage:', store.receipts.length);
      return;
    } catch (e) {
      console.warn('Failed to parse saved receipts, loading fixtures');
    }
  }
  
  // Load fixtures - start with basic fixtures if needed
  const defaultFixtures: RDS[] = [
    { id: 'rds_001', type: 'RuleVersion_RDS', created_at: new Date().toISOString(), value: { version: 'v1.0.0' }, family: 'rulesync' },
    { id: 'voice_001', type: 'Voice_RDS', created_at: new Date().toISOString(), value: { session_id: 'demo' }, family: 'voice' },
    { id: 'k401_001', type: 'Plan_Benchmark_Receipt', created_at: new Date().toISOString(), value: { plan_id: 'demo' }, family: '401k' },
    { id: 'creator_001', type: 'OfferLock_RDS', created_at: new Date().toISOString(), value: { offer_id: 'demo' }, family: 'creator' }
  ];
  
  store.receipts = defaultFixtures;
  localStorage.setItem('mock.receipts', JSON.stringify(store.receipts));
  console.log('Initialized mock receipts:', store.receipts.length);
}

export async function emitReceipt(r: RDS): Promise<RDS> {
  if (MOCK_MODE) {
    store.receipts.unshift(r);
    localStorage.setItem('mock.receipts', JSON.stringify(store.receipts));
    return r;
  }
  
  // In real mode, would delegate to Supabase
  throw new Error('Real mode not implemented yet');
}

export async function listReceipts(family?: string): Promise<RDS[]> {
  if (MOCK_MODE) {
    return family ? store.receipts.filter(r => r.family === family) : store.receipts;
  }
  
  // In real mode, would delegate to Supabase
  throw new Error('Real mode not implemented yet');
}

export async function getReceiptById(id: string): Promise<RDS | undefined> {
  if (MOCK_MODE) {
    return store.receipts.find(r => r.id === id);
  }
  
  // In real mode, would delegate to Supabase
  throw new Error('Real mode not implemented yet');
}

export async function replay(kind: string, id: string): Promise<any> {
  if (MOCK_MODE) {
    const receipt = await getReceiptById(id);
    if (!receipt) {
      return { ok: false, error: 'Receipt not found' };
    }
    
    // Return family-specific arrays based on kind
    const baseResult = {
      ok: true,
      reason_code: 'ANCHOR_VERIFIED',
      receipt_id: id,
      created_at: receipt.created_at,
      anchor_status: 'anchored'
    };
    
    switch (kind) {
      case 'rulesync':
        return { ...baseResult, rule_diffs: [], rule_versions: [] };
      case 'voice':
        return { ...baseResult, voice_rds: [receipt.value] };
      case '401k':
        return { ...baseResult, benchmark: [receipt.value], risk_gate: [] };
      case 'creator':
        return { ...baseResult, offerlock: [], consent: [], splits: [], escrow: [], settle: [] };
      case 'trading':
        return { ...baseResult, routing_rds: [], wash_rds: [], tlh_rds: [] };
      case 'healthcare':
        return { ...baseResult, consent_passport: [], prior_auth: [], oop_overlay: [], pre_grant: [] };
      case 'estate':
        return { ...baseResult, ron_sessions: [], recording_submissions: [], record_accepts: [] };
      case 'compliance':
        return { ...baseResult, compile_rds: [], rule_exports: [] };
      case 'demigration':
        return { ...baseResult, export_rds: [], demig_diffs: [], demig_plans: [], parity_probes: [] };
      case 'air':
        return { ...baseResult, persistence_rds: [], ui_state_rds: [], ui_diffs: [] };
      default:
        return baseResult;
    }
  }
  
  // In real mode, would delegate to Supabase RPC
  throw new Error('Real mode not implemented yet');
}

// Initialize mock data on module load
if (MOCK_MODE) {
  initMock();
}