// NIL Platform Feature Flags
export const NIL_FEATURE_FLAGS = {
  NIL_PUBLIC_ENABLED: true,
  NIL_AGENT_ENABLED: true,
  NIL_SCHOOL_ENABLED: true,
  NIL_ATHLETE_ENABLED: true,
  ADMIN_TOOLS_ENABLED: true,
  DEMOS_ENABLED: true,
  PUBLIC_CTA_BAR: true,
  TRUST_EXPLAINER_ENABLED: true,
  PROOF_SLIPS_ENABLED: true,
  FTC_COMPLIANCE_ENABLED: true,
  MERKLE_VERIFICATION_ENABLED: true,
  AUDIT_EXPORT_ENABLED: true
} as const;

export type NILFeatureFlag = keyof typeof NIL_FEATURE_FLAGS;

export function isFeatureEnabled(flag: NILFeatureFlag): boolean {
  return NIL_FEATURE_FLAGS[flag] === true;
}

export function requireFeature(flag: NILFeatureFlag): void {
  if (!isFeatureEnabled(flag)) {
    throw new Error(`Feature ${flag} is not enabled`);
  }
}