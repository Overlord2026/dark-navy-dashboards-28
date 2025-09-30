import { getFlag } from '@/config/flags';

/**
 * Extract all known routes from our App.tsx route definitions
 * This provides the source of truth for what routes actually exist
 */
export function getKnownRoutes(): string[] {
  const routes: string[] = [
    // Root routes
    '/',
    
    // Discovery and solutions
    '/discover', '/solutions', '/solutions/annuities', '/solutions/investments',
    
    // Family routes  
    '/family/home', '/family/longevity', '/receipts',
    
    // Tool routes
    '/tools/retirement-roadmap', '/tools/rmd-check', '/tools/social-security', 
    '/tools/wealth-vault', '/tools/beneficiary-center', '/tools/financial-poa', 
    '/tools/taxhub-diy', '/solutions/annuities/calculators', '/solutions/annuities/review',
    '/solutions/annuities/index',
    
    // NIL public pages
    ...(getFlag('NIL_PUBLIC_ENABLED') ? ['/nil', '/nil/index'] : []),
    
    // Onboarding routes (flag protected)
    ...(getFlag('ONBOARDING_PUBLIC_ENABLED') ? [
      '/start/families',
      '/start/advisors', 
      '/start/cpas',
      '/start/attorneys',
      '/start/realtor',
      '/start/insurance',
      '/start/healthcare',
      '/start/nil-athlete',
      '/start/nil-school'
    ] : []),
    
    // Private app routes
    '/onboarding',
    '/nil/onboarding',
    '/nil/education',
    '/nil/disclosures',
    '/nil/offers',
    '/nil/marketplace',
    '/nil/contract/:id',
    '/nil/payments',
    '/nil/disputes',
    '/nil/receipts',
    '/nil/admin',
    '/nil/admin/ready-check',
    '/pricing',
    
    // Admin routes (flag protected)
    ...(getFlag('ADMIN_TOOLS_ENABLED') ? [
      '/admin/qa-coverage',
      '/admin/ready-check',
      '/admin/publish',
      '/admin/env'
    ] : []),
    
    // Demo routes
    ...(getFlag('DEMOS_ENABLED') ? ['/demos/:persona'] : []),
    
    // Dev routes
    ...(process.env.NODE_ENV !== 'production' ? ['/dev/fixtures'] : [])
  ];
  
  return routes.filter(Boolean);
}

/**
 * Check if a route exists in our known routes
 * Handles dynamic segments like :id and exact matches
 */
export function routeExists(targetRoute: string): boolean {
  const knownRoutes = getKnownRoutes();
  
  // Exact match
  if (knownRoutes.includes(targetRoute)) {
    return true;
  }
  
  // Check for dynamic route matches (e.g., /nil/contract/:id matches /nil/contract/123)
  return knownRoutes.some(knownRoute => {
    if (!knownRoute.includes(':')) return false;
    
    const knownParts = knownRoute.split('/');
    const targetParts = targetRoute.split('/');
    
    if (knownParts.length !== targetParts.length) return false;
    
    return knownParts.every((part, index) => {
      return part.startsWith(':') || part === targetParts[index];
    });
  });
}