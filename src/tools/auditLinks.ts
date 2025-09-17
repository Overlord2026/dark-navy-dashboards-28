import { PERSONA_CONFIG } from '@/config/personaConfig';
import catalogConfig from '@/config/catalogConfig.json';
import familyToolsConfig from '@/config/familyTools.json';
import { routeExists } from './routeMap';

export interface LinkAuditResult {
  source: string;
  route: string;
  exists: boolean;
  toolKey?: string;
  label?: string;
}

/**
 * Audit all public links to find missing routes
 * Scans persona configs, solutions nav, catalog, family tools, and NIL tools
 */
export function auditAllLinks(): LinkAuditResult[] {
  const results: LinkAuditResult[] = [];
  
  // 1. Persona tiles from personaConfig
  PERSONA_CONFIG.forEach(persona => {
    // These link to /start/{persona} routes typically
    const route = `/start/${persona.persona}${persona.segment ? '-' + persona.segment : ''}`;
    results.push({
      source: 'personaConfig',
      route,
      exists: routeExists(route),
      label: persona.label
    });
  });
  
  // 2. Solutions navigation (from utils/configValidator.ts)
  const solutionsNav = [
    { key: 'investments', title: 'Investments', route: '/solutions/investments' },
    { key: 'annuities', title: 'Annuities', route: '/solutions/annuities' },
    { key: 'insurance', title: 'Insurance', route: '/solutions/insurance' },
    { key: 'tax', title: 'Tax Planning', route: '/solutions/tax' },
    { key: 'estate', title: 'Estate', route: '/solutions/estate' },
    { key: 'health', title: 'Health & Longevity', route: '/solutions/health' },
    { key: 'practice', title: 'Practice Management', route: '/solutions/practice' },
    { key: 'compliance', title: 'Compliance', route: '/solutions/compliance' },
    { key: 'nil', title: 'NIL', route: '/solutions/nil' }
  ];
  
  solutionsNav.forEach(solution => {
    results.push({
      source: 'solutionsNav',
      route: solution.route,
      exists: routeExists(solution.route),
      label: solution.title
    });
  });
  
  // 3. Catalog items
  (catalogConfig as any[]).forEach(item => {
    if (item.route) {
      results.push({
        source: 'catalogConfig',
        route: item.route,
        exists: routeExists(item.route),
        toolKey: item.key,
        label: item.label
      });
    }
  });
  
  // 4. Family tools quick actions and tab cards
  Object.entries(familyToolsConfig).forEach(([segment, config]) => {
    // Quick actions
    (config as any).quickActions?.forEach((action: any) => {
      if (action.route) {
        results.push({
          source: `familyTools.${segment}.quickActions`,
          route: action.route,
          exists: routeExists(action.route),
          label: action.label
        });
      }
    });
    
    // Tab cards (these reference toolKey, resolve via catalog)
    (config as any).tabs?.forEach((tab: any) => {
      tab.cards?.forEach((card: any) => {
        if (card.toolKey) {
          const catalogItem = (catalogConfig as any[]).find(item => item.key === card.toolKey);
          if (catalogItem?.route) {
            results.push({
              source: `familyTools.${segment}.tabs.${tab.key}`,
              route: catalogItem.route,
              exists: routeExists(catalogItem.route),
              toolKey: card.toolKey,
              label: catalogItem.label
            });
          }
        }
      });
    });
  });
  
  // 5. NIL tools removed - skip
  
  return results;
}

/**
 * Get missing routes that need preview pages
 */
export function getMissingRoutes(): LinkAuditResult[] {
  return auditAllLinks().filter(result => !result.exists);
}

/**
 * Get catalog items that need status updated to "soon"
 */
export function getToolsNeedingStatusUpdate(): Array<{toolKey: string, route: string, label: string}> {
  const missing = getMissingRoutes();
  return missing
    .filter(result => result.toolKey)
    .map(result => ({
      toolKey: result.toolKey!,
      route: result.route,
      label: result.label || result.toolKey!
    }));
}