export interface EnvironmentConfig {
  isProduction: boolean;
  isSandbox: boolean;
  isStaging: boolean;
  isDevelopment: boolean;
  qaBypassEnabled: boolean;
}

export const getEnvironmentConfig = (): EnvironmentConfig => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  
  // Detect production environment
  const isProduction = hostname.includes('mybfocfo.com') || hostname.includes('production');
  
  // Detect sandbox/staging
  const isSandbox = hostname.includes('sandbox') || hostname.includes('lovableproject.com');
  const isStaging = hostname.includes('staging') || hostname.includes('preview');
  
  // Development is anything else (localhost, etc.)
  const isDevelopment = !isProduction && !isSandbox && !isStaging;
  
  // QA bypass only enabled in non-production environments
  const qaBypassEnabled = !isProduction;
  
  return {
    isProduction,
    isSandbox,
    isStaging,
    isDevelopment,
    qaBypassEnabled
  };
};

// SECURITY: Removed hardcoded bypass email
export const QA_BYPASS_EMAIL = import.meta.env.DEV ? import.meta.env.VITE_QA_BYPASS_EMAIL || '' : '';

export const isQABypassAllowed = (userEmail?: string): boolean => {
  const env = getEnvironmentConfig();
  return env.qaBypassEnabled && env.isDevelopment && userEmail === QA_BYPASS_EMAIL && QA_BYPASS_EMAIL !== '';
};

export const shouldEnforceAuthentication = (userEmail?: string): boolean => {
  const env = getEnvironmentConfig();
  
  // Always enforce in production
  if (env.isProduction) return true;
  
  // Skip enforcement for QA user in sandbox
  if (isQABypassAllowed(userEmail)) return false;
  
  // Enforce for everyone else
  return true;
};