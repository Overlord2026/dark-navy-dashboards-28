/**
 * Job system feature flags
 */
export interface JobFlags {
  BACKGROUND_JOBS_ENABLED: boolean;
  MONITOR_GUARDRAILS_ENABLED: boolean;
  SYNC_BENEFICIARIES_ENABLED: boolean;
}

// Default flag values
const DEFAULT_FLAGS: JobFlags = {
  BACKGROUND_JOBS_ENABLED: false,
  MONITOR_GUARDRAILS_ENABLED: false,
  SYNC_BENEFICIARIES_ENABLED: false,
};

/**
 * Get flag value from environment or localStorage
 */
export function getFlag(flagName: keyof JobFlags): boolean {
  // Check localStorage first (for dev/testing)
  const stored = localStorage.getItem(`job_flag_${flagName}`);
  if (stored !== null) {
    return stored === 'true';
  }

  // Fallback to default
  return DEFAULT_FLAGS[flagName];
}

/**
 * Set flag value in localStorage (for dev/testing)
 */
export function setFlag(flagName: keyof JobFlags, value: boolean): void {
  localStorage.setItem(`job_flag_${flagName}`, value.toString());
}

/**
 * Check if a job is enabled based on its flag
 */
export function enabled(flagName: string): boolean {
  if (!getFlag('BACKGROUND_JOBS_ENABLED')) {
    return false;
  }
  
  return getFlag(flagName as keyof JobFlags);
}