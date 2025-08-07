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
  
  // Detect production environment (only my.bfocfo.com without subdomains)
  const isProduction = hostname === 'my.bfocfo.com' && !hostname.includes('preview') && !hostname.includes('sandbox');
  
  // Detect sandbox/staging (includes all preview and development environments)
  const isSandbox = hostname.includes('lovableproject.com') || hostname.includes('my.bfocfo.com');
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

// SECURITY: CAPTCHA is disabled in all non-production environments for QA
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