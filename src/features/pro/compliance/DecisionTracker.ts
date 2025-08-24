import { ProPersona } from '../types';

export interface DecisionRDS {
  type: 'Decision-RDS';
  inputs_hash: string;
  policy_version: string;
  payload: {
    action: string;
    persona: ProPersona;
    inputs_hash: string;
    source?: string;
    reasons: string[];
    participants?: string[];
    result: 'approve' | 'deny';
    risk_level?: 'low' | 'medium' | 'high';
    metadata?: Record<string, any>;
  };
  timestamp: string;
}

const POLICY_VERSION = 'v1.0';

function hash(obj: unknown): string {
  return btoa(JSON.stringify(obj)).slice(0, 24);
}

export function recordDecisionRDS(payload: Omit<DecisionRDS['payload'], 'result'> & { result?: 'approve' | 'deny' }): DecisionRDS {
  const fullPayload = {
    ...payload,
    result: payload.result || 'approve' as const
  };

  const receipt: DecisionRDS = {
    type: 'Decision-RDS',
    inputs_hash: hash(fullPayload),
    policy_version: POLICY_VERSION,
    payload: fullPayload,
    timestamp: new Date().toISOString()
  };

  console.log('[Decision-RDS]', receipt);
  
  // Store for audit trail
  storeDecisionReceipt(receipt);
  
  return receipt;
}

export function recordMeetingImportDecision(options: {
  persona: ProPersona;
  inputs_hash: string;
  source: string;
  hasRisks: boolean;
  hasActionItems: boolean;
  participants?: string[];
}): DecisionRDS {
  const reasons = ['meeting_import', 'meeting_summary'];
  if (options.hasActionItems) reasons.push('action_items');
  if (options.hasRisks) reasons.push('risk_flag');

  return recordDecisionRDS({
    action: 'meeting_import',
    persona: options.persona,
    inputs_hash: options.inputs_hash,
    source: options.source,
    reasons,
    participants: options.participants,
    risk_level: options.hasRisks ? 'medium' : 'low'
  });
}

export function recordCommunicationDecision(options: {
  persona: ProPersona;
  channel: 'email' | 'sms' | 'phone';
  template_id: string;
  recipient_count: number;
  has_consent: boolean;
}): DecisionRDS {
  const reasons = ['communication_send'];
  if (!options.has_consent) reasons.push('consent_missing');

  return recordDecisionRDS({
    action: 'communication_send',
    persona: options.persona,
    inputs_hash: hash(options),
    reasons,
    result: options.has_consent ? 'approve' : 'deny',
    metadata: {
      channel: options.channel,
      template_id: options.template_id,
      recipient_count: options.recipient_count
    }
  });
}

export function recordExportDecision(options: {
  persona: ProPersona;
  export_type: 'leads' | 'meetings' | 'campaigns';
  record_count: number;
  includes_pii: boolean;
}): DecisionRDS {
  const reasons = ['data_export'];
  if (options.includes_pii) reasons.push('pii_export');

  return recordDecisionRDS({
    action: 'data_export',
    persona: options.persona,
    inputs_hash: hash(options),
    reasons,
    risk_level: options.includes_pii ? 'medium' : 'low',
    metadata: {
      export_type: options.export_type,
      record_count: options.record_count,
      includes_pii: options.includes_pii
    }
  });
}

function storeDecisionReceipt(receipt: DecisionRDS) {
  try {
    const stored = localStorage.getItem('decision_receipts');
    const receipts: DecisionRDS[] = stored ? JSON.parse(stored) : [];
    receipts.unshift(receipt);
    
    // Keep only last 200 receipts
    const trimmed = receipts.slice(0, 200);
    localStorage.setItem('decision_receipts', JSON.stringify(trimmed));
  } catch (error) {
    console.error('Failed to store decision receipt:', error);
  }
}

export function getDecisionHistory(persona?: ProPersona, action?: string): DecisionRDS[] {
  try {
    const stored = localStorage.getItem('decision_receipts');
    if (!stored) return [];

    let receipts: DecisionRDS[] = JSON.parse(stored);
    
    if (persona) {
      receipts = receipts.filter(r => r.payload.persona === persona);
    }
    
    if (action) {
      receipts = receipts.filter(r => r.payload.action === action);
    }

    return receipts.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  } catch {
    return [];
  }
}
