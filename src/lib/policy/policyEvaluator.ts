export type Decision = "ALLOW" | "DENY" | "ALLOW_WITH_CONDITIONS";
export interface PolicyBundleRef { id: string; provider_sig?: string; effective_date?: string; }
export interface EvalResult { decision: Decision; rationale: string[]; conditions?: string[]; bundles: PolicyBundleRef[]; }
export interface EvalContext { domain: "401k" | "trading" | "healthcare" | "estate" | "voice" | "general"; jurisdiction?: string; effectiveDate?: string; actorRoles?: string[]; }
export async function evaluateAction(_actionRequest: unknown, _ctx: EvalContext): Promise<EvalResult> {
  const bundles: PolicyBundleRef[] = [{ id: "rs://baseline@current" }];
  const decision: Decision = "ALLOW_WITH_CONDITIONS";
  const rationale = ["Baseline policy requires HITL approval for this action"];
  const conditions = ["HITL_APPROVAL:2-of-3"];
  return { decision, rationale, conditions, bundles };
}