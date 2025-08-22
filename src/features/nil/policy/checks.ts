import { getModules } from '../education/api';
import { checkConflicts } from '../offers/store';
import { getActiveConsents } from '../consent/api';

export interface PolicyCheckResult {
  ok: boolean;
  reasons: string[];
  details?: Record<string, any>;
}

export async function runChecks(contractId: string, offerId?: string): Promise<PolicyCheckResult> {
  const reasons: string[] = [];
  let ok = true;

  // Check education completion
  const modules = await getModules();
  const completedModules = modules.filter(m => m.status === 'done');
  
  if (completedModules.length === modules.length) {
    reasons.push('EDU_FRESH');
  } else {
    reasons.push('EDU_INCOMPLETE');
    ok = false;
  }

  // Check disclosure binding
  const hasDisclosurePack = Math.random() > 0.3; // Simulate 70% chance of having disclosure
  if (hasDisclosurePack) {
    reasons.push('DISCLOSURE_BOUND');
  } else {
    reasons.push('DISCLOSURE_MISSING');
    ok = false;
  }

  // Check offer conflicts if offerId provided
  if (offerId) {
    try {
      const conflictCheck = checkConflicts(offerId);
      if (conflictCheck.ok) {
        reasons.push('NO_CONFLICT');
      } else {
        reasons.push('EXCLUSIVITY_CONFLICT');
        ok = false;
      }
    } catch (error) {
      reasons.push('OFFER_CHECK_FAILED');
      ok = false;
    }
  }

  // Check active consents
  const activeConsents = getActiveConsents();
  if (activeConsents.length > 0) {
    reasons.push('CONSENT_ACTIVE');
  } else {
    reasons.push('CONSENT_REQUIRED');
    ok = false;
  }

  // Check co-signer requirements (simulate)
  const requiresCosign = Math.random() < 0.2; // 20% chance
  if (requiresCosign) {
    reasons.push('COSIGN_REQUIRED');
    ok = false;
  } else {
    reasons.push('COSIGN_WAIVED');
  }

  return {
    ok,
    reasons,
    details: {
      completedModules: completedModules.length,
      totalModules: modules.length,
      activeConsents: activeConsents.length,
      hasDisclosurePack,
      requiresCosign
    }
  };
}

export function validateContract(contractId: string): PolicyCheckResult {
  // Simulate contract validation
  const issues: string[] = [];
  
  // Check required clauses
  const hasRequiredClauses = Math.random() > 0.1; // 90% pass rate
  if (!hasRequiredClauses) {
    issues.push('MISSING_REQUIRED_CLAUSES');
  }

  // Check compliance terms
  const hasComplianceTerms = Math.random() > 0.05; // 95% pass rate
  if (!hasComplianceTerms) {
    issues.push('MISSING_COMPLIANCE_TERMS');
  }

  return {
    ok: issues.length === 0,
    reasons: issues.length === 0 ? ['CONTRACT_VALID'] : issues
  };
}