/**
 * Update route map to include new home pages and ensure all advisor/NIL routes are mapped
 */
import { getFlag } from '@/config/flags';

export function getKnownRoutes(): string[] {
  const routes: string[] = [
    // Root routes
    '/',
    
    // Discovery and solutions
    '/discover', '/solutions', '/solutions/annuities', '/solutions/investments',
    
    // Family routes  
    '/family/home', '/family/longevity', '/receipts',
    
    // Advisor routes
    '/advisor/home', '/advisor/dashboard', '/advisor/clients', '/advisor/leads', 
    '/advisor/proposals', '/advisor/network', '/advisor/practice',
    
    // NIL routes
    '/nil/athlete/home', '/nil/training', '/nil/disclosure', '/nil/offers',
    '/nil/marketplace', '/nil/network', '/nil/compliance',
    
    // Tool routes
    '/tools/retirement-roadmap', '/tools/rmd-check', '/tools/social-security', 
    '/tools/wealth-vault', '/tools/beneficiary-center', '/tools/financial-poa', 
    '/tools/taxhub-diy', '/tools/value-calculator', '/tools/target-analyzer',
    '/tools/tax-optimizer', '/tools/estate-planner', '/tools/risk-assessor',
    '/tools/portfolio-tracker', '/tools/income-planner', '/tools/document-vault',
    '/solutions/annuities/calculators', '/solutions/annuities/review',
    '/solutions/annuities/index',
    
    // Preview routes for missing tools
    '/preview/lead-capture', '/preview/client-onboarding', '/preview/proposal-generator',
    '/preview/professional-network', '/preview/nil-training', '/preview/nil-disclosure',
    '/preview/nil-offers', '/preview/nil-marketplace', '/preview/nil-network',
    '/preview/agent-invite', '/preview/insurance-vault', '/preview/insurance-reports',
    '/preview/realtor-listings', '/preview/cap-rate-report', '/preview/property-vault',
    
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
    ...(getFlag('DEMOS_ENABLED') ? [
      '/demos/families-aspiring', 
      '/demos/families-retirees',
      '/demos/advisor-workflow',
      '/demos/nil-athlete-journey'
    ] : []),
    
    // Dev routes
    ...(process.env.NODE_ENV !== 'production' ? ['/dev/fixtures'] : [])
  ];
  
  return routes.filter(Boolean);
}

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