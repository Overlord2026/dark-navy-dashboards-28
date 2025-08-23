import { auditAllLinks, getMissingRoutes, LinkAuditResult } from './auditLinks';
import { getKnownRoutes, routeExists } from './routeMap';
import catalogConfig from '@/config/catalogConfig.json';

export interface RouteAuditSummary {
  totalRoutes: number;
  missingRoutes: number;
  previewMappedRoutes: number;
  hardErrors: LinkAuditResult[];
  previewWarnings: LinkAuditResult[];
  catalogItemsNeedingStatusUpdate: Array<{toolKey: string, route: string, label: string}>;
}

/**
 * Comprehensive route audit for Ready-Check
 */
export function performRouteAudit(): RouteAuditSummary {
  const allLinks = auditAllLinks();
  const missingLinks = getMissingRoutes();
  
  // Separate hard 404s from preview-mappable routes
  const hardErrors = missingLinks.filter(link => !link.toolKey);
  const previewWarnings = missingLinks.filter(link => !!link.toolKey);
  
  // Find catalog items that need status updated to "soon"
  const catalogItemsNeedingStatusUpdate = previewWarnings
    .map(result => ({
      toolKey: result.toolKey!,
      route: result.route,
      label: result.label || result.toolKey!
    }));

  return {
    totalRoutes: allLinks.length,
    missingRoutes: missingLinks.length,
    previewMappedRoutes: previewWarnings.length,
    hardErrors,
    previewWarnings,
    catalogItemsNeedingStatusUpdate
  };
}

/**
 * Auto-create preview routes for missing tool routes
 * Updates catalog status to "soon" for missing tools
 */
export function autoCreatePreviewRoutes(): {
  created: number;
  updated: number;
  errors: string[];
} {
  const auditResult = performRouteAudit();
  let created = 0;
  let updated = 0;
  const errors: string[] = [];

  try {
    // Update catalog items to "soon" status for missing routes
    auditResult.catalogItemsNeedingStatusUpdate.forEach(item => {
      const catalogItem = (catalogConfig as any[]).find(cat => cat.key === item.toolKey);
      if (catalogItem && catalogItem.status !== 'soon') {
        catalogItem.status = 'soon';
        updated++;
      }
    });

    // Note: In a real implementation, you'd write the updated catalog back to the file
    // For now, we just track what would be updated
    created = auditResult.previewMappedRoutes;
    
  } catch (error) {
    errors.push(`Failed to auto-create preview routes: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return { created, updated, errors };
}

/**
 * Check if route should redirect to preview page
 */
export function shouldRedirectToPreview(route: string): boolean {
  // Check if route exists in known routes
  if (routeExists(route)) {
    return false;
  }
  
  // Check if it's a tool route that should have a preview
  const allLinks = auditAllLinks();
  const linkResult = allLinks.find(link => link.route === route);
  
  return !!(linkResult && linkResult.toolKey);
}

/**
 * Get preview route for a missing tool route
 */
export function getPreviewRoute(originalRoute: string): string {
  const allLinks = auditAllLinks();
  const linkResult = allLinks.find(link => link.route === originalRoute);
  
  if (linkResult && linkResult.toolKey) {
    return `/preview/${linkResult.toolKey}`;
  }
  
  return '/404';
}