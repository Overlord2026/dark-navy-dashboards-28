/**
 * Storage hygiene utilities for secure client-side data handling
 * 
 * SECURITY POLICY:
 * - Never store auth tokens in localStorage
 * - Use allowlist approach for localStorage keys
 * - Prefer secure session storage for sensitive data
 */

// Allowlisted localStorage keys for non-sensitive data only
const ALLOWED_LOCALSTORAGE_KEYS = [
  // UI preferences and settings
  'persona_group',
  'preferred-language', 
  'bfo-layout-settings',
  'bfo-persona-config',
  'demoMode',
  
  // Non-sensitive user preferences
  'fom_demo_persona',
  'selectedPersona',
  'personaData',
  
  // Cache keys for non-sensitive data
  'demo_completions',
  'email_sequences',
  'email_logs',
  
  // Temporary UI state
  'fom_welcome_modal_seen',
  'fom_welcome_banner_seen',
  'pending_referral_code',
  
  // Calculator results (non-PII)
  'estate-planning-summary',
  'lending-affordability-results', 
  'retirement-roadmap-results',
  'tax-planning-results',
  
  // Analytics and logs (anonymized)
  'faq_analytics',
  'diagnostics-fix-history',
  'performance-metrics',
  
  // Temporary onboarding state
  'onboarding-data',
  'onboarding-family-goals',
  'onboarding_wizard_session'
];

/**
 * FORBIDDEN items that should NEVER be in localStorage:
 * - access_token, refresh_token
 * - service_role keys
 * - API keys or secrets
 * - PII/PHI data
 * - Payment information
 */
const FORBIDDEN_PATTERNS = [
  /token/i,
  /secret/i,
  /key/i,
  /password/i,
  /credential/i,
  /service_role/i,
  /api_key/i
];

/**
 * Safe wrapper for localStorage.setItem with validation
 * @param key - Storage key
 * @param value - Value to store
 */
export function safeLocalStorageSet(key: string, value: string): void {
  // Check if key is allowlisted
  if (!ALLOWED_LOCALSTORAGE_KEYS.includes(key)) {
    console.warn(`localStorage key "${key}" is not allowlisted. Add to ALLOWED_LOCALSTORAGE_KEYS if this is non-sensitive data.`);
    return;
  }

  // Check for forbidden patterns in key or value
  const isForbiddenKey = FORBIDDEN_PATTERNS.some(pattern => pattern.test(key));
  const isForbiddenValue = FORBIDDEN_PATTERNS.some(pattern => pattern.test(value));
  
  if (isForbiddenKey || isForbiddenValue) {
    console.error(`Blocked attempt to store sensitive data in localStorage. Key: ${key}`);
    return;
  }

  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error('Failed to store in localStorage:', error);
  }
}

/**
 * Safe wrapper for localStorage.getItem
 * @param key - Storage key
 * @returns Stored value or null
 */
export function safeLocalStorageGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return null;
  }
}

/**
 * Audit localStorage for security violations
 * @returns Security audit results
 */
export function auditLocalStorage(): {
  violations: string[];
  allowlisted: string[];
  recommendations: string[];
} {
  const violations: string[] = [];
  const allowlisted: string[] = [];
  const recommendations: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    const value = localStorage.getItem(key) || '';
    
    // Check if key is properly allowlisted
    if (ALLOWED_LOCALSTORAGE_KEYS.includes(key)) {
      allowlisted.push(key);
    } else {
      violations.push(`Unallowlisted key: ${key}`);
    }

    // Check for forbidden patterns
    const hasForbiddenKey = FORBIDDEN_PATTERNS.some(pattern => pattern.test(key));
    const hasForbiddenValue = FORBIDDEN_PATTERNS.some(pattern => pattern.test(value));
    
    if (hasForbiddenKey) {
      violations.push(`Forbidden pattern in key: ${key}`);
    }
    
    if (hasForbiddenValue) {
      violations.push(`Forbidden pattern in value for key: ${key}`);
    }
  }

  // Generate recommendations
  if (violations.length > 0) {
    recommendations.push('Move sensitive data to secure server-side session storage');
    recommendations.push('Use Supabase auth for secure token management');
    recommendations.push('Implement proper session management with HttpOnly cookies');
  }

  return { violations, allowlisted, recommendations };
}

/**
 * Clear all localStorage entries (emergency cleanup)
 */
export function emergencyStorageClear(): void {
  console.warn('Performing emergency localStorage cleanup');
  localStorage.clear();
}