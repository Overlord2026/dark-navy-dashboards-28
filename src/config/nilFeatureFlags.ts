// NIL Platform Feature Flags - DISABLED FOR MAIN PLATFORM
export const NIL_FEATURE_FLAGS = {
  NIL_PUBLIC_ENABLED: false,
  NIL_AGENT_ENABLED: false,
  NIL_SCHOOL_ENABLED: false,
  NIL_ATHLETE_ENABLED: false,
  ADMIN_TOOLS_ENABLED: false,
  DEMOS_ENABLED: false,
  PUBLIC_CTA_BAR: false,
  TRUST_EXPLAINER_ENABLED: false,
  PROOF_SLIPS_ENABLED: false,
  FTC_COMPLIANCE_ENABLED: false,
  MERKLE_VERIFICATION_ENABLED: false,
  AUDIT_EXPORT_ENABLED: false
} as const;

export type NILFeatureFlag = keyof typeof NIL_FEATURE_FLAGS;

export function isFeatureEnabled(flag: NILFeatureFlag): boolean {
  return NIL_FEATURE_FLAGS[flag];
}

export function requireFeature(flag: NILFeatureFlag): void {
  if (!isFeatureEnabled(flag)) {
    throw new Error(`Feature ${flag} is not enabled`);
  }
}