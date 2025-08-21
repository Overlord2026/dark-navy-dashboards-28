/**
 * Receipt verification and replay system
 */

import { healthcareGate } from '@/features/healthcare/gates';
import { coverageRules, safetyRules } from '@/features/health/pa/rules';
import { validateConsent } from '@/features/health/consent/api';

export interface VerificationResult {
  ok: boolean;
  reasonsMatch: boolean;
  policy_supported: boolean;
  replay_result?: any;
  original_reasons: string[];
  replayed_reasons: string[];
  discrepancies?: string[];
  verification_time: number;
  inputs_hash_valid: boolean;
}

export interface ReplayContext {
  policy_version: string;
  receipt_type: string;
  inputs_available: boolean;
  rules_available: boolean;
}

/**
 * Verify a receipt by replaying it against current rules
 */
export async function replay(rds: any): Promise<VerificationResult> {
  const startTime = Date.now();
  
  console.info('receipt.verify.start', {
    type: rds.type,
    policy_version: rds.policy_version,
    inputs_hash: rds.inputs_hash?.substring(0, 16) + '...'
  });

  const result: VerificationResult = {
    ok: false,
    reasonsMatch: false,
    policy_supported: false,
    original_reasons: rds.reasons || [],
    replayed_reasons: [],
    verification_time: 0,
    inputs_hash_valid: false
  };

  try {
    // Check if we support this policy version
    const context = await getPolicyContext(rds.policy_version, rds.type);
    result.policy_supported = context.rules_available;

    if (!context.rules_available) {
      result.discrepancies = [`Unsupported policy version: ${rds.policy_version}`];
      return result;
    }

    // Verify inputs hash if available
    result.inputs_hash_valid = verifyInputsHash(rds);

    // Replay based on receipt type
    switch (rds.type) {
      case 'Health-RDS':
        await replayHealthRDS(rds, result);
        break;
      case 'PA-RDS':
        await replayPARDS(rds, result);
        break;
      case 'Consent-RDS':
        await replayConsentRDS(rds, result);
        break;
      case 'Vault-RDS':
        await replayVaultRDS(rds, result);
        break;
      default:
        result.discrepancies = [`Unknown receipt type: ${rds.type}`];
        return result;
    }

    // Compare reasons
    result.reasonsMatch = compareReasons(result.original_reasons, result.replayed_reasons);
    result.ok = result.reasonsMatch && result.inputs_hash_valid;

  } catch (error) {
    console.error('receipt.verify.error', { 
      error: String(error),
      type: rds.type,
      policy: rds.policy_version
    });
    
    result.discrepancies = [`Verification error: ${String(error)}`];
  } finally {
    result.verification_time = Date.now() - startTime;
    
    console.info('receipt.verify.complete', {
      type: rds.type,
      ok: result.ok,
      reasonsMatch: result.reasonsMatch,
      verificationTime: result.verification_time
    });
  }

  return result;
}

/**
 * Replay Health-RDS receipt
 */
async function replayHealthRDS(rds: any, result: VerificationResult): Promise<void> {
  // Simulate healthcare gate evaluation with mock context
  const mockContext = {
    persona: 'aspiring' as const,
    tier: 'foundational' as const,
    hipaaConsentValid: true,
    lastConsentDate: new Date(),
    hasDataAccess: true
  };

  const gateResult = healthcareGate(rds.action, mockContext);
  
  result.replay_result = {
    action: rds.action,
    allow: gateResult.allow,
    reasons: gateResult.reasons,
    result: gateResult.allow ? 'allow' : 'deny'
  };

  // Build replayed reasons
  result.replayed_reasons = gateResult.reasons || [];
  
  // Add expected reasons based on action
  if (rds.action === 'hsa.export') {
    result.replayed_reasons.push('HSA records exported with consent');
  } else if (rds.action === 'hsa.share.cpa') {
    result.replayed_reasons.push('HSA data shared with CPA');
  }

  // Verify result matches
  const expectedResult = gateResult.allow ? 'allow' : 'deny';
  if (rds.result !== expectedResult) {
    result.discrepancies = result.discrepancies || [];
    result.discrepancies.push(`Result mismatch: expected ${expectedResult}, got ${rds.result}`);
  }
}

/**
 * Replay PA-RDS receipt
 */
async function replayPARDS(rds: any, result: VerificationResult): Promise<void> {
  // Mock PA context for replay
  const mockPlan = {
    id: 'mock-plan',
    name: 'Mock Insurance Plan',
    type: 'ppo' as const
  };

  const mockMedications: any[] = [];
  const mockAllergies: any[] = [];

  // Replay coverage rules
  const coverageResult = coverageRules(mockPlan, rds.procedure_cpt, rds.diagnosis_icd);
  
  // Replay safety rules  
  const safetyResult = safetyRules(mockMedications, mockAllergies, {
    cpt: rds.procedure_cpt,
    medications: [],
    contrast: false
  });

  result.replay_result = {
    procedure_cpt: rds.procedure_cpt,
    diagnosis_icd: rds.diagnosis_icd,
    coverage: coverageResult,
    safety: safetyResult,
    approved: coverageResult.covered && safetyResult.ok
  };

  // Build replayed reasons
  result.replayed_reasons = [];
  
  if (!coverageResult.covered) {
    result.replayed_reasons.push(coverageResult.reason || 'Not covered');
  } else if (!safetyResult.ok) {
    result.replayed_reasons.push('Safety conflicts identified');
  } else {
    result.replayed_reasons.push('All criteria met - approved');
  }

  // Add missing evidence if present in original
  if (rds.missingEvidence) {
    result.replayed_reasons.push('Insufficient documentation');
  }

  // Verify approval status
  const expectedApproval = result.replay_result.approved;
  if (rds.approved !== expectedApproval) {
    result.discrepancies = result.discrepancies || [];
    result.discrepancies.push(`Approval mismatch: expected ${expectedApproval}, got ${rds.approved}`);
  }
}

/**
 * Replay Consent-RDS receipt
 */
async function replayConsentRDS(rds: any, result: VerificationResult): Promise<void> {
  // Validate consent structure and freshness
  const freshness = calculateConsentFreshness(rds.consent_time, rds.expiry);
  
  result.replay_result = {
    purpose_of_use: rds.purpose_of_use,
    hipaa_scope: rds.hipaa_scope,
    freshness_calculated: freshness,
    freshness_original: rds.freshness_score,
    valid_structure: validateConsentStructure(rds)
  };

  // Build replayed reasons
  result.replayed_reasons = [];
  
  if (freshness < 0.5) {
    result.replayed_reasons.push('Consent is stale');
  } else if (rds.expiry && new Date(rds.expiry) < new Date()) {
    result.replayed_reasons.push('Consent has expired');
  } else {
    result.replayed_reasons.push('Valid consent issued');
  }

  // Verify freshness score
  const freshnessThreshold = 0.1; // Allow small differences
  if (Math.abs(freshness - rds.freshness_score) > freshnessThreshold) {
    result.discrepancies = result.discrepancies || [];
    result.discrepancies.push(`Freshness score mismatch: expected ~${freshness.toFixed(2)}, got ${rds.freshness_score}`);
  }
}

/**
 * Replay Vault-RDS receipt
 */
async function replayVaultRDS(rds: any, result: VerificationResult): Promise<void> {
  // Validate vault operation
  const validActions = ['grant', 'revoke', 'legal_hold', 'delete'];
  const isValidAction = validActions.includes(rds.action);

  result.replay_result = {
    action: rds.action,
    doc_id: rds.doc_id,
    valid_action: isValidAction,
    has_doc_id: !!rds.doc_id
  };

  // Build replayed reasons
  result.replayed_reasons = [];
  
  if (!isValidAction) {
    result.replayed_reasons.push(`Invalid vault action: ${rds.action}`);
  } else if (rds.action === 'grant') {
    result.replayed_reasons.push('Access granted to evidence pack');
  } else if (rds.action === 'revoke') {
    result.replayed_reasons.push('Access revoked from evidence pack');
  } else {
    result.replayed_reasons.push(`Vault action ${rds.action} completed`);
  }

  // Verify action is valid
  if (!isValidAction) {
    result.discrepancies = result.discrepancies || [];
    result.discrepancies.push(`Invalid action: ${rds.action}`);
  }
}

/**
 * Get policy context for verification
 */
async function getPolicyContext(policyVersion: string, receiptType: string): Promise<ReplayContext> {
  // Check if we support this policy version
  const supportedPolicies = ['H-2025.08', 'PA-2025.08', 'v1.0'];
  const supportedTypes = ['Health-RDS', 'PA-RDS', 'Consent-RDS', 'Vault-RDS'];

  return {
    policy_version: policyVersion,
    receipt_type: receiptType,
    inputs_available: true, // We can't replay exact inputs due to PHI
    rules_available: supportedPolicies.includes(policyVersion) && supportedTypes.includes(receiptType)
  };
}

/**
 * Verify inputs hash (simplified for demo)
 */
function verifyInputsHash(rds: any): boolean {
  // In a real system, this would regenerate the hash from sanitized inputs
  // For demo, we just check if hash exists and has expected format
  if (!rds.inputs_hash) return false;
  
  // Basic format validation
  const hashPattern = /^[a-zA-Z0-9+/=]{8,}$/;
  return hashPattern.test(rds.inputs_hash);
}

/**
 * Compare original vs replayed reasons
 */
function compareReasons(original: string[], replayed: string[]): boolean {
  if (original.length !== replayed.length) {
    return false;
  }

  // Sort both arrays for comparison (order shouldn't matter)
  const sortedOriginal = [...original].sort();
  const sortedReplayed = [...replayed].sort();

  // Check for similar reasons (fuzzy matching)
  for (let i = 0; i < sortedOriginal.length; i++) {
    const orig = sortedOriginal[i].toLowerCase();
    const repl = sortedReplayed[i].toLowerCase();
    
    // Allow partial matches for similar concepts
    if (!reasonsMatch(orig, repl)) {
      return false;
    }
  }

  return true;
}

/**
 * Check if two reasons match (fuzzy matching)
 */
function reasonsMatch(reason1: string, reason2: string): boolean {
  // Exact match
  if (reason1 === reason2) return true;
  
  // Common variations
  const variations: Record<string, string[]> = {
    'approved': ['allow', 'granted', 'authorized', 'permitted'],
    'denied': ['deny', 'blocked', 'rejected', 'forbidden'],
    'consent': ['authorization', 'permission', 'agreement'],
    'stale': ['expired', 'old', 'outdated'],
    'criteria': ['requirements', 'conditions', 'rules']
  };

  // Check if words are variations of each other
  for (const [base, vars] of Object.entries(variations)) {
    if (reason1.includes(base) && vars.some(v => reason2.includes(v))) {
      return true;
    }
    if (reason2.includes(base) && vars.some(v => reason1.includes(v))) {
      return true;
    }
  }

  // Partial match threshold
  const similarity = calculateSimilarity(reason1, reason2);
  return similarity > 0.7;
}

/**
 * Calculate string similarity (simplified Levenshtein distance)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Calculate consent freshness
 */
function calculateConsentFreshness(consentTime: string, expiry?: string): number {
  const now = new Date();
  const consent = new Date(consentTime);
  const daysSince = (now.getTime() - consent.getTime()) / (1000 * 60 * 60 * 24);
  
  if (expiry && new Date(expiry) < now) return 0;
  if (daysSince > 365) return 0; // Very old
  if (daysSince > 90) return 0.3; // Stale
  if (daysSince > 30) return 0.7; // Getting old
  return 1.0; // Fresh
}

/**
 * Validate consent structure
 */
function validateConsentStructure(rds: any): boolean {
  const required = ['hipaa_scope', 'purpose_of_use', 'consent_time', 'proof_hash'];
  return required.every(field => rds[field] !== undefined);
}