import { GateResult, BudgetPolicy, Consent, ZkPredicate, PolicyCheck } from "./types";
import { checkBudgetCeiling, requireFreshConsent, verifyZkPredicate, verifyPolicyInForce } from "./guards";

export type ExecInput = {
  userId: string;
  opKey: string;
  requestedCents: number;
  consent?: Consent;
  budgetPolicy?: BudgetPolicy;
  zkPredicates?: ZkPredicate[];
  policyChecks?: PolicyCheck[];
};

// Returns allow/deny and first failing reason
export async function evaluateExecution(input: ExecInput): Promise<GateResult> {
  // 1) Budget ceiling
  const b = checkBudgetCeiling(input.budgetPolicy, input.requestedCents);
  if (!b.allow) return b;

  // 2) Consent freshness
  const c = requireFreshConsent(input.consent, 90);
  if (!c.allow) return c;

  // 3) ZK predicates
  if (input.zkPredicates && input.zkPredicates.length) {
    for (const zp of input.zkPredicates) {
      const ok = await verifyZkPredicate(zp);
      if (!ok) return { allow: false, reason: 'ZK predicate failed' };
    }
  }

  // 4) Policy-in-force
  if (input.policyChecks && input.policyChecks.length) {
    for (const pc of input.policyChecks) {
      const { ok } = await verifyPolicyInForce(pc);
      if (!ok) return { allow: false, reason: 'Policy-in-force verification failed' };
    }
  }

  return { allow: true };
}