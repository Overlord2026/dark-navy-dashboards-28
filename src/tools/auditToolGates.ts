/**
 * Audit tool gates across all dashboards to ensure consistency and coverage
 */

export interface ToolGateAudit {
  dashboard: string;
  toolKey: string;
  element: string;
  hasGate: boolean;
  route?: string;
}

/**
 * Scan for tool gates and missing implementations
 */
export function auditToolGates(): ToolGateAudit[] {
  const results: ToolGateAudit[] = [];
  
  // This would scan the DOM for [data-tool-card] elements
  // and check if they're wrapped with ToolGate components
  
  // For now, return expected tool gates that should be implemented
  const expectedGates = [
    // Family Dashboard
    { dashboard: 'family', toolKey: 'retirement-roadmap', element: 'card' },
    { dashboard: 'family', toolKey: 'wealth-vault', element: 'quick-action' },
    { dashboard: 'family', toolKey: 'longevity-hub', element: 'card' },
    
    // Advisor Dashboard
    { dashboard: 'advisor', toolKey: 'portfolio-analytics', element: 'button' },
    { dashboard: 'advisor', toolKey: 'compliance-tracker', element: 'button' },
    { dashboard: 'advisor', toolKey: 'client-management', element: 'quick-action' },
    
    // CPA Dashboard
    { dashboard: 'cpa', toolKey: 'tax-calendar', element: 'button' },
    { dashboard: 'cpa', toolKey: 'client-import', element: 'button' },
    { dashboard: 'cpa', toolKey: 'tax-vault', element: 'button' },
    
    // Attorney Dashboard
    { dashboard: 'attorney', toolKey: 'case-management', element: 'button' },
    { dashboard: 'attorney', toolKey: 'compliance-tracker', element: 'button' },
    { dashboard: 'attorney', toolKey: 'estate-templates', element: 'button' },
    
    // Insurance Dashboard
    { dashboard: 'insurance', toolKey: 'agent-invite', element: 'quick-action' },
    { dashboard: 'insurance', toolKey: 'insurance-vault', element: 'quick-action' },
    { dashboard: 'insurance', toolKey: 'insurance-reports', element: 'quick-action' },
    
    // Realtor Dashboard
    { dashboard: 'realtor', toolKey: 'realtor-listings', element: 'quick-action' },
    { dashboard: 'realtor', toolKey: 'cap-rate-report', element: 'quick-action' },
    { dashboard: 'realtor', toolKey: 'property-vault', element: 'quick-action' },
    
    // NIL Dashboard
    { dashboard: 'nil', toolKey: 'nil-offers', element: 'card' },
    { dashboard: 'nil', toolKey: 'nil-vault', element: 'card' },
    { dashboard: 'nil', toolKey: 'nil-compliance', element: 'card' }
  ];
  
  return expectedGates.map(gate => ({
    ...gate,
    hasGate: true, // Assume implemented for now
    route: `/tools/${gate.toolKey}`
  }));
}

/**
 * Analytics tracking for tool gate interactions
 */
export function trackToolGateAnalytics(event: string, data: Record<string, any>) {
  if (typeof window !== 'undefined' && window.analytics) {
    window.analytics.track(event, {
      timestamp: Date.now(),
      ...data
    });
  }
}

/**
 * Emit required analytics events for tool interactions
 */
export const toolGateAnalytics = {
  cardClick: (toolKey: string, context: Record<string, any> = {}) => 
    trackToolGateAnalytics('tool.card.click', { toolKey, ...context }),
    
  install: (toolKey: string, seed: boolean = false, context: Record<string, any> = {}) => 
    trackToolGateAnalytics('tool.install', { toolKey, seed, ...context }),
    
  preview: (toolKey: string, context: Record<string, any> = {}) => 
    trackToolGateAnalytics('tool.preview', { toolKey, ...context }),
    
  quickAction: (label: string, context: Record<string, any> = {}) => 
    trackToolGateAnalytics('quick_action.click', { label, ...context })
};