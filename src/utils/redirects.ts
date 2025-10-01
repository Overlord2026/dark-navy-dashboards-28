import { getFlag } from '@/config/flags';

export interface RedirectRule {
  from: string;
  to: string;
  permanent: boolean;
}

// Parse redirects from CSV data
export const REDIRECT_RULES: RedirectRule[] = [
  { from: '/families/home', to: '/families/dashboard', permanent: true },
  { from: '/families/index', to: '/families', permanent: true },
  // Redirect old /pros paths to new /professionals paths
  { from: '/pros', to: '/professionals', permanent: true },
  { from: '/pros/advisors', to: '/professionals/financial-advisors', permanent: true },
  { from: '/pros/accountants', to: '/professionals/accountants', permanent: true },
  { from: '/pros/cpas', to: '/professionals/accountants', permanent: true },
  { from: '/pros/attorneys', to: '/professionals/attorneys', permanent: true },
  // Legacy advisor paths
  { from: '/advisors', to: '/professionals/financial-advisors', permanent: true },
  { from: '/advisors/home', to: '/pros/advisors/dashboard', permanent: true },
  { from: '/advisors/leads', to: '/pros/leads', permanent: true },
  { from: '/advisors/meetings', to: '/pros/meetings', permanent: true },
  { from: '/advisors/campaigns', to: '/pros/campaigns', permanent: true },
  { from: '/advisors/pipeline', to: '/pros/pipeline', permanent: true },
  { from: '/advisors/tools', to: '/pros/tools', permanent: true },
  // Legacy persona paths
  { from: '/cpa', to: '/professionals/accountants', permanent: true },
  { from: '/attorney', to: '/professionals/attorneys', permanent: true },
  { from: '/accountants', to: '/professionals/accountants', permanent: true },
  { from: '/insurance', to: '/pros/insurance', permanent: true },
  { from: '/healthcare', to: '/pros/healthcare', permanent: true },
  { from: '/realtor', to: '/pros/realtors', permanent: true },
  { from: '/marketplace/advisors', to: '/pros/marketplace?type=advisors', permanent: true },
  { from: '/marketplace/cpas', to: '/pros/marketplace?type=cpas', permanent: true },
  { from: '/marketplace/attorneys', to: '/pros/marketplace?type=attorneys', permanent: true },
  { from: '/marketplace/insurance', to: '/pros/marketplace?type=insurance', permanent: true },
  { from: '/accountant-dashboard', to: '/pros/cpas/dashboard', permanent: true },
  { from: '/advisor-dashboard', to: '/pros/advisors/dashboard', permanent: true },
  { from: '/attorney-dashboard', to: '/pros/attorneys/dashboard', permanent: true }
];

/**
 * Check if a path should be redirected based on IA_V2 flag
 */
export function getRedirectPath(currentPath: string): string | null {
  // Only apply redirects if IA_V2 is enabled
  if (!getFlag('IA_V2')) {
    return null;
  }

  // Find matching redirect rule
  const rule = REDIRECT_RULES.find(rule => {
    // Exact match first
    if (rule.from === currentPath) return true;
    
    // Wildcard match for routes with /*
    if (rule.from.endsWith('/*')) {
      const basePath = rule.from.slice(0, -2);
      return currentPath.startsWith(basePath + '/');
    }
    
    return false;
  });

  if (rule) {
    // Handle wildcard redirects
    if (rule.from.endsWith('/*')) {
      const basePath = rule.from.slice(0, -2);
      const remainder = currentPath.slice(basePath.length);
      return rule.to.replace('/*', remainder);
    }
    
    return rule.to;
  }

  return null;
}

/**
 * Apply redirect if needed, returns true if redirect occurred
 */
export function applyRedirect(currentPath: string, navigate: (path: string, options?: any) => void): boolean {
  const redirectPath = getRedirectPath(currentPath);
  
  if (redirectPath) {
    navigate(redirectPath, { replace: true });
    return true;
  }
  
  return false;
}