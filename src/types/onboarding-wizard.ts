export interface OnboardRDSReceipt {
  id: string;
  type: 'onboard_rds';
  step: 'persona' | 'facts' | 'goal' | 'connect' | 'calc' | 'invite';
  persona?: 'aspiring' | 'retiree';
  tier?: 'foundational' | 'advanced';
  reasons?: string[];
  ts: string;
  session_id: string;
}

export interface DecisionRDSReceipt {
  id: string;
  type: 'decision_rds';
  action: 'create_goal' | 'run_calc' | 'add_to_plan';
  goal_key?: string;
  calc_key?: string;
  inputs_hash?: string;
  persona: 'aspiring' | 'retiree';
  tier: 'foundational' | 'advanced';
  reasons?: string[];
  ts: string;
  session_id: string;
}

export interface VaultRDSIngestReceipt {
  id: string;
  type: 'vault_rds';
  action: 'ingest';
  source: 'plaid' | 'upload';
  hash: string;
  ts: string;
  session_id: string;
}

export interface ConsentRDSReceipt {
  id: string;
  type: 'consent_rds';
  scope: string[];
  purpose_of_use: string;
  ttl_days: number;
  result: 'approve' | 'deny';
  ts: string;
  session_id: string;
}

export type RDSReceipt = OnboardRDSReceipt | DecisionRDSReceipt | VaultRDSIngestReceipt | ConsentRDSReceipt;

export interface OnboardingWizardSession {
  id: string;
  user_id?: string;
  started_at: string;
  completed_at?: string;
  current_step: number;
  total_steps: number;
  persona: 'aspiring' | 'retiree';
  complexity_tier: 'foundational' | 'advanced';
  receipts: RDSReceipt[];
  wizard_state: {
    household_facts?: {
      birth_year_band: string;
      filing_status: 'single' | 'joint';
      has_spouse: boolean;
      owns_business: boolean;
      owns_multiple_properties: boolean;
      receives_k1: boolean;
      has_private_investments: boolean;
    };
    top_goal?: {
      goal_key: string;
      amount: number;
      target_date: string;
      persona_default: boolean;
    };
    data_connection?: {
      type: 'plaid' | 'upload' | 'skipped';
      connected: boolean;
      source?: string;
    };
    calculation_result?: {
      calc_key: string;
      result: any;
      added_to_plan: boolean;
    };
    professional_invite?: {
      type: 'advisor' | 'cpa' | 'attorney';
      scope: string[];
      ttl_days: number;
      sent: boolean;
    };
  };
  target_time_seconds: number; // 120 seconds
  actual_time_seconds?: number;
  met_target: boolean;
}

// Helper functions
export function createOnboardRDSReceipt(
  step: OnboardRDSReceipt['step'],
  sessionId: string,
  data: Partial<Pick<OnboardRDSReceipt, 'persona' | 'tier' | 'reasons'>>
): OnboardRDSReceipt {
  return {
    id: `onboard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'onboard_rds',
    step,
    ...data,
    ts: new Date().toISOString(),
    session_id: sessionId
  };
}

export function createDecisionRDSReceipt(
  action: DecisionRDSReceipt['action'],
  sessionId: string,
  persona: 'aspiring' | 'retiree',
  tier: 'foundational' | 'advanced',
  data: Partial<Pick<DecisionRDSReceipt, 'goal_key' | 'calc_key' | 'inputs_hash' | 'reasons'>>
): DecisionRDSReceipt {
  return {
    id: `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'decision_rds',
    action,
    persona,
    tier,
    ...data,
    ts: new Date().toISOString(),
    session_id: sessionId
  };
}

export function createVaultRDSReceipt(
  source: 'plaid' | 'upload',
  sessionId: string,
  hash: string
): VaultRDSIngestReceipt {
  return {
    id: `vault_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'vault_rds',
    action: 'ingest',
    source,
    hash,
    ts: new Date().toISOString(),
    session_id: sessionId
  };
}

export function createConsentRDSReceipt(
  scope: string[],
  purposeOfUse: string,
  ttlDays: number,
  sessionId: string,
  result: 'approve' | 'deny' = 'approve'
): ConsentRDSReceipt {
  return {
    id: `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'consent_rds',
    scope,
    purpose_of_use: purposeOfUse,
    ttl_days: ttlDays,
    result,
    ts: new Date().toISOString(),
    session_id: sessionId
  };
}

export function initializeWizardSession(persona: 'aspiring' | 'retiree' = 'aspiring'): OnboardingWizardSession {
  return {
    id: `wizard_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    started_at: new Date().toISOString(),
    current_step: 1,
    total_steps: 6,
    persona,
    complexity_tier: 'foundational',
    receipts: [],
    wizard_state: {},
    target_time_seconds: 120,
    met_target: false
  };
}

export function computeComplexityTier(facts: any): 'foundational' | 'advanced' {
  const advancedConditions = [
    facts.owns_business,
    facts.owns_multiple_properties,
    facts.receives_k1,
    facts.has_private_investments
  ];
  
  return advancedConditions.some(condition => condition) ? 'advanced' : 'foundational';
}