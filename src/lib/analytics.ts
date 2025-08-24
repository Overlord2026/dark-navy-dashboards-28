/**
 * Unified analytics interface for the Family Office Marketplace
 * 
 * Standardizes event tracking across all personas and features
 * Uses only 2 parameters: event name and optional properties
 */

interface AnalyticsProperties {
  [key: string]: any;
}

interface AnalyticsInterface {
  track: (event: string, properties?: AnalyticsProperties) => void;
  identify: (userId: string, traits?: AnalyticsProperties) => void;
  page: (name?: string, properties?: AnalyticsProperties) => void;
  group: (groupId: string, traits?: AnalyticsProperties) => void;
}

class FamilyOfficeAnalytics implements AnalyticsInterface {
  private isEnabled: boolean = true;
  private userId?: string;
  private sessionId: string;
  
  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeSession();
  }

  private generateSessionId(): string {
    return `fom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession(): void {
    // Set session context
    this.track('session.start', {
      session_id: this.sessionId,
      timestamp: new Date().toISOString(),
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown'
    });
  }

  /**
   * Track an event with properties
   * 
   * @param event - Event name (e.g., 'lead.captured', 'meeting.imported')
   * @param properties - Optional event properties
   */
  track(event: string, properties?: AnalyticsProperties): void {
    if (!this.isEnabled) return;

    const eventData = {
      event,
      properties: {
        ...properties,
        session_id: this.sessionId,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        user_id: this.userId
      }
    };

    // Console logging for development
    console.log('[Analytics]', event, properties);

    // Send to analytics backends
    this.sendToBackends(eventData);
  }

  /**
   * Identify a user
   * 
   * @param userId - User identifier
   * @param traits - Optional user traits
   */
  identify(userId: string, traits?: AnalyticsProperties): void {
    if (!this.isEnabled) return;

    this.userId = userId;
    
    const identifyData = {
      user_id: userId,
      traits: {
        ...traits,
        identified_at: new Date().toISOString(),
        session_id: this.sessionId
      }
    };

    console.log('[Analytics] Identify', userId, traits);
    this.sendToBackends({ type: 'identify', ...identifyData });
  }

  /**
   * Track page views
   * 
   * @param name - Page name
   * @param properties - Optional page properties
   */
  page(name?: string, properties?: AnalyticsProperties): void {
    if (!this.isEnabled) return;

    const pageData = {
      name: name || (typeof document !== 'undefined' ? document.title : 'Unknown'),
      properties: {
        ...properties,
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        path: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
        referrer: typeof document !== 'undefined' ? document.referrer : 'unknown',
        timestamp: new Date().toISOString(),
        session_id: this.sessionId,
        user_id: this.userId
      }
    };

    console.log('[Analytics] Page', name, properties);
    this.sendToBackends({ type: 'page', ...pageData });
  }

  /**
   * Track group membership (e.g., firm, family office)
   * 
   * @param groupId - Group identifier
   * @param traits - Optional group traits
   */
  group(groupId: string, traits?: AnalyticsProperties): void {
    if (!this.isEnabled) return;

    const groupData = {
      group_id: groupId,
      traits: {
        ...traits,
        grouped_at: new Date().toISOString(),
        session_id: this.sessionId,
        user_id: this.userId
      }
    };

    console.log('[Analytics] Group', groupId, traits);
    this.sendToBackends({ type: 'group', ...groupData });
  }

  private sendToBackends(data: any): void {
    // Send to PostHog (if configured)
    if (typeof window !== 'undefined' && (window as any).posthog) {
      try {
        const posthog = (window as any).posthog;
        if (data.type === 'identify') {
          posthog.identify(data.user_id, data.traits);
        } else if (data.type === 'page') {
          posthog.capture('$pageview', data.properties);
        } else if (data.type === 'group') {
          posthog.group('company', data.group_id, data.traits);
        } else {
          posthog.capture(data.event, data.properties);
        }
      } catch (error) {
        console.warn('[Analytics] PostHog error:', error);
      }
    }

    // Send to custom analytics API
    this.sendToCustomAPI(data);
  }

  private async sendToCustomAPI(data: any): Promise<void> {
    if (typeof window === 'undefined') return;
    
    try {
      // In a real implementation, this would send to your analytics API
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        console.warn('[Analytics] API error:', response.status);
      }
    } catch (error) {
      // Fail silently for analytics errors
      console.warn('[Analytics] Network error:', error);
    }
  }

  /**
   * Enable or disable analytics tracking
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    console.log('[Analytics] Tracking', enabled ? 'enabled' : 'disabled');
  }

  /**
   * Get current session information
   */
  getSession(): { sessionId: string; userId?: string } {
    return {
      sessionId: this.sessionId,
      userId: this.userId
    };
  }
}

// Create global analytics instance
const analyticsInstance = new FamilyOfficeAnalytics();

// Legacy compatibility methods - maintain existing API
export const analytics = {
  track: (event: string, properties?: AnalyticsProperties) => analyticsInstance.track(event, properties),
  identify: analyticsInstance.identify.bind(analyticsInstance),
  page: analyticsInstance.page.bind(analyticsInstance),
  group: analyticsInstance.group.bind(analyticsInstance),
  
  // Legacy compatibility methods
  trackEvent: (event: string, properties?: AnalyticsProperties) => analyticsInstance.track(event, properties),
  trackPageView: (path: string, properties?: AnalyticsProperties) => analyticsInstance.track('page_view', { path, ...properties }),
  trackFeatureUsage: (feature: string, properties?: AnalyticsProperties) => analyticsInstance.track('feature_usage', { feature, ...properties }),
  trackConversion: (type: string, properties?: AnalyticsProperties) => analyticsInstance.track('conversion', { type, ...properties }),
  trackError: (error: Error | string, properties?: AnalyticsProperties) => analyticsInstance.track('error', { error: error.toString(), ...properties }),
  trackPerformance: (metric: string, value: number | { value: number }, properties?: AnalyticsProperties) => {
    const val = typeof value === 'number' ? value : value.value;
    return analyticsInstance.track('performance', { metric, value: val, ...properties });
  },
  trackSecurityEvent: (event: string, properties?: AnalyticsProperties) => analyticsInstance.track('security_event', { event, ...properties }),
  trackPersonaClaim: (persona: string, properties?: AnalyticsProperties) => analyticsInstance.track('persona_claim', { persona, ...properties }),
  trackOnboardingStep: (step: string, properties?: AnalyticsProperties) => analyticsInstance.track('onboarding_step', { step, ...properties }),
  trackOnboardingStart: (properties?: AnalyticsProperties) => analyticsInstance.track('onboarding_start', properties),
  trackViralShare: (platform: string, properties?: AnalyticsProperties) => analyticsInstance.track('viral_share', { platform, ...properties }),
  trackShareClick: (type: string, properties?: AnalyticsProperties) => analyticsInstance.track('share_click', { type, ...properties }),
  trackShareSuccess: (type: string | AnalyticsProperties, properties?: AnalyticsProperties) => {
    if (typeof type === 'string') {
      return analyticsInstance.track('share_success', { type, ...properties });
    } else {
      return analyticsInstance.track('share_success', type);
    }
  },
  trackFAQUsage: (question: string, properties?: AnalyticsProperties) => analyticsInstance.track('faq_usage', { question, ...properties }),
  trackFamilyTabView: (tab: string, properties?: AnalyticsProperties) => analyticsInstance.track('family_tab_view', { tab, ...properties }),
  trackFamilyQuickAction: (action: string, properties?: AnalyticsProperties) => analyticsInstance.track('family_quick_action', { action, ...properties }),
  trackToolCardOpen: (tool: string, properties?: AnalyticsProperties) => analyticsInstance.track('tool_card_open', { tool, ...properties }),
  trackFamilyOnboardingStart: (properties?: AnalyticsProperties) => analyticsInstance.track('family_onboarding_start', properties),
  trackFamilySegmentSelection: (segment: string, properties?: AnalyticsProperties) => analyticsInstance.track('family_segment_selection', { segment, ...properties }),
  trackFamilyGoalsSelection: (goals: string[], properties?: AnalyticsProperties) => analyticsInstance.track('family_goals_selection', { goals, ...properties }),
  trackFamilyOnboardingComplete: (properties?: AnalyticsProperties) => analyticsInstance.track('family_onboarding_complete', properties),
  trackDemoE2EStart: (name: string, properties?: AnalyticsProperties) => analyticsInstance.track('demo.e2e.start', { name, ...properties }),
  trackDemoE2EStep: (name: string, toolKey: string, properties?: AnalyticsProperties) => analyticsInstance.track('demo.e2e.step', { name, toolKey, ...properties }),
  trackDemoE2EComplete: (name: string, properties?: AnalyticsProperties) => analyticsInstance.track('demo.e2e.complete', { name, ...properties })
};

// Named exports for compatibility
export const track = analytics.track;
export const initializeAnalytics = () => console.log('Analytics initialized');

export const trackFamilyToolDemo = (toolKey: string) => {
  analytics.track('family.tool.demo.loaded', { toolKey });
};

export const trackProofCreated = (type: string) => {
  analytics.track('proof.created', { type });
};

export const trackExportClick = (kind: string) => {
  analytics.track('export.click', { kind });
};

// Common event tracking helpers
export const trackEvent = {
  // Family Office Events
  familyOffice: {
    wealthDashboardViewed: (properties?: AnalyticsProperties) => 
      analyticsInstance.track('family.wealth_dashboard.viewed', properties),
    goalCreated: (properties?: AnalyticsProperties) => 
      analyticsInstance.track('family.goal.created', properties),
    reportGenerated: (properties?: AnalyticsProperties) => 
      analyticsInstance.track('family.report.generated', properties),
  },

  // Professional Events
  professional: {
    leadCaptured: (persona: string, properties?: AnalyticsProperties) => 
      analyticsInstance.track('pro.lead.captured', { persona, ...properties }),
    meetingImported: (persona: string, properties?: AnalyticsProperties) => 
      analyticsInstance.track('pro.meeting.imported', { persona, ...properties }),
    campaignSent: (persona: string, properties?: AnalyticsProperties) => 
      analyticsInstance.track('pro.campaign.sent', { persona, ...properties }),
    consentRecorded: (persona: string, properties?: AnalyticsProperties) => 
      analyticsInstance.track('pro.consent.recorded', { persona, ...properties }),
  },

  // Compliance Events
  compliance: {
    receiptGenerated: (type: string, properties?: AnalyticsProperties) => 
      analyticsInstance.track('compliance.receipt.generated', { type, ...properties }),
    auditCompleted: (persona: string, properties?: AnalyticsProperties) => 
      analyticsInstance.track('compliance.audit.completed', { persona, ...properties }),
    vaultAccessed: (properties?: AnalyticsProperties) => 
      analyticsInstance.track('compliance.vault.accessed', properties),
  },

  // Medicare Specific Events
  medicare: {
    ptcRecorded: (properties?: AnalyticsProperties) => 
      analyticsInstance.track('medicare.ptc.recorded', properties),
    dncChecked: (result: string, properties?: AnalyticsProperties) => 
      analyticsInstance.track('medicare.dnc.checked', { result, ...properties }),
    soaSigned: (properties?: AnalyticsProperties) => 
      analyticsInstance.track('medicare.soa.signed', properties),
    disclaimerRead: (properties?: AnalyticsProperties) => 
      analyticsInstance.track('medicare.disclaimer.read', properties),
    peclCompleted: (properties?: AnalyticsProperties) => 
      analyticsInstance.track('medicare.pecl.completed', properties),
    enrollmentSubmitted: (properties?: AnalyticsProperties) => 
      analyticsInstance.track('medicare.enrollment.submitted', properties),
  },

  // Tool Events
  tools: {
    installed: (toolKey: string, properties?: AnalyticsProperties) => 
      analyticsInstance.track('tool.installed', { tool_key: toolKey, ...properties }),
    accessed: (toolKey: string, properties?: AnalyticsProperties) => 
      analyticsInstance.track('tool.accessed', { tool_key: toolKey, ...properties }),
    configured: (toolKey: string, properties?: AnalyticsProperties) => 
      analyticsInstance.track('tool.configured', { tool_key: toolKey, ...properties }),
  },

  // Demo Events
  demo: {
    started: (persona: string, properties?: AnalyticsProperties) => 
      analyticsInstance.track('demo.started', { persona, ...properties }),
    stepCompleted: (persona: string, step: string, properties?: AnalyticsProperties) => 
      analyticsInstance.track('demo.step.completed', { persona, step, ...properties }),
    completed: (persona: string, properties?: AnalyticsProperties) => 
      analyticsInstance.track('demo.completed', { persona, ...properties }),
  }
};

// Add to window for external access
declare global {
  interface Window {
    analytics: typeof analytics;
  }
}

if (typeof window !== 'undefined') {
  window.analytics = analytics;
}

export default analyticsInstance;