import { NILConsentRDS, NILDecisionRDS, NILDeltaRDS } from '../types';

function hash(obj: unknown): string {
  return window.btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).slice(0, 24);
}

export function createConsentRDS(
  athleteId: string,
  scope: string[],
  trainingCompleted: boolean,
  freshnessScore: number,
  coSignerRequired: boolean,
  ttlDays: number
): NILConsentRDS {
  const inputs = {
    athlete_id: athleteId,
    scope,
    training_completed: trainingCompleted,
    freshness_score: freshnessScore,
    co_signer_required: coSignerRequired,
    ttl_days: ttlDays,
    timestamp: new Date().toISOString()
  };

  const rds: NILConsentRDS = {
    id: `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'Consent-RDS',
    athlete_id: athleteId,
    scope,
    training_completed: trainingCompleted,
    freshness_score: freshnessScore,
    co_signer_required: coSignerRequired,
    ttl_days: ttlDays,
    policy_version: 'NIL-2025.08',
    timestamp: new Date().toISOString(),
    inputs_hash: hash(inputs)
  };

  console.log('[NIL Consent-RDS]', rds);
  return rds;
}

export function createDecisionRDS(
  postId: string,
  reasons: string[],
  disclosurePack: string,
  exclusivityCheck: 'pass' | 'fail' | 'warning'
): NILDecisionRDS {
  const inputs = {
    post_id: postId,
    reasons,
    disclosure_pack: disclosurePack,
    exclusivity_check: exclusivityCheck,
    timestamp: new Date().toISOString()
  };

  const rds: NILDecisionRDS = {
    id: `decision_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'Decision-RDS',
    post_id: postId,
    reasons,
    disclosure_pack: disclosurePack,
    exclusivity_check: exclusivityCheck,
    policy_version: 'NIL-2025.08',
    timestamp: new Date().toISOString(),
    inputs_hash: hash(inputs)
  };

  console.log('[NIL Decision-RDS]', rds);
  return rds;
}

export function createDeltaRDS(
  disputeId: string,
  reason: string,
  fixPath: string,
  originalDecisionId: string,
  correctiveActions: string[]
): NILDeltaRDS {
  const inputs = {
    dispute_id: disputeId,
    reason,
    fix_path: fixPath,
    original_decision_id: originalDecisionId,
    corrective_actions: correctiveActions,
    timestamp: new Date().toISOString()
  };

  const rds: NILDeltaRDS = {
    id: `delta_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: 'Delta-RDS',
    dispute_id: disputeId,
    reason,
    fix_path: fixPath,
    original_decision_id: originalDecisionId,
    corrective_actions: correctiveActions,
    policy_version: 'NIL-2025.08',
    timestamp: new Date().toISOString(),
    inputs_hash: hash(inputs)
  };

  console.log('[NIL Delta-RDS]', rds);
  return rds;
}

// Anchor reference simulation (dev stubs)
export function generateAnchorRef(): string {
  const txHash = Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return `chain_1:${txHash}:${Date.now()}`;
}

export function verifyAnchorRef(anchorRef: string): Promise<{ verified: boolean; blockHeight?: number }> {
  // Development stub - always returns verified after 1 second
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        verified: true,
        blockHeight: Math.floor(Math.random() * 1000000) + 100000
      });
    }, 1000);
  });
}