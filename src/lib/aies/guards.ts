import { GateResult, BudgetPolicy, Consent, ZkPredicate, PolicyCheck } from "./types";

// Budget ceiling check; returns gate result
export function checkBudgetCeiling(policy: BudgetPolicy | undefined, requestedCents: number): GateResult {
  if (!policy) return { allow: true };
  if (requestedCents <= policy.ceilingCents) return { allow: true };
  if (policy.requiresApproval) {
    return { allow: false, reason: 'Budget exceeds ceiling; approval required', action: 'request_approval' };
  }
  return { allow: false, reason: 'Budget exceeds ceiling' };
}

// ZK predicate stub; wire real verifier later
export async function verifyZkPredicate(p: ZkPredicate): Promise<boolean> {
  // TODO: integrate real verifier (snarkjs / noir / halo2) behind an API
  return !!p && typeof p.predicate === 'string' && !!p.proof; // placeholder
}

// Policy-in-force check via Edge Function
export async function verifyPolicyInForce(check: PolicyCheck): Promise<{ ok: boolean; evidence?: unknown }> {
  try {
    const res = await fetch('/functions/v1/policy_in_force', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(check)
    });
    if (!res.ok) return { ok: false };
    const data = await res.json();
    return { ok: !!data.in_force, evidence: data };
  } catch {
    return { ok: false };
  }
}

// Consent freshness gate
export function requireFreshConsent(consent: Consent | undefined, minDays = 90): GateResult {
  if (!consent) return { allow: false, reason: 'Consent missing', action: 'consent' };
  const now = Date.now();
  if (consent.revokedAt) return { allow: false, reason: 'Consent revoked', action: 'consent' };
  if (consent.expiresAt && new Date(consent.expiresAt).getTime() < now) {
    return { allow: false, reason: 'Consent expired', action: 'consent' };
  }
  return { allow: true };
}