/**
 * Enhanced analytics tracking for Family Home and tool interactions
 */

interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: number;
}

class FamilyAnalytics {
  private events: AnalyticsEvent[] = [];

  private track(event: string, properties: Record<string, any> = {}) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent
      },
      timestamp: Date.now()
    };

    this.events.push(analyticsEvent);
    
    // Log to console for development
    console.log('📊 Analytics:', analyticsEvent);
    
    // Send to external analytics if available
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track(event, analyticsEvent.properties);
    }
    
    // Send to custom endpoint (if configured)
    this.sendToEndpoint(analyticsEvent);
  }

  private async sendToEndpoint(event: AnalyticsEvent) {
    try {
      // This could be sent to your analytics endpoint
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });
    } catch (error) {
      console.debug('Analytics endpoint not available');
    }
  }

  // Family-specific events
  tabView(tabKey: string, segment: string, hasTools: boolean) {
    this.track('family.tab.view', {
      tabKey,
      segment,
      hasTools,
      toolCount: hasTools ? undefined : 0
    });
  }

  quickActionClick(label: string, route: string, segment: string) {
    this.track('family.quickAction.click', {
      label,
      route,
      segment,
      actionType: 'navigation'
    });
  }

  // Tool interaction events
  toolCardOpen(toolKey: string, segment: string, installed: boolean, tabKey?: string) {
    this.track('tool.card.open', {
      toolKey,
      segment,
      installed,
      tabKey,
      source: 'family-home'
    });
  }

  toolInstall(toolKey: string, withSeed: boolean = false, segment: string) {
    this.track('tool.install', {
      toolKey,
      withSeed,
      segment,
      source: 'family-home'
    });
  }

  toolPreview(toolKey: string, segment: string) {
    this.track('tool.preview', {
      toolKey,
      segment,
      source: 'family-home'
    });
  }

  // Proof slip events
  proofCreated(type: string, toolKey?: string, reasonCodes?: string[]) {
    this.track('proof.created', {
      type,
      toolKey,
      reasonCodes,
      source: 'family-action'
    });
  }

  // Share events
  shareClick(method: 'native' | 'copy', segment: string) {
    this.track('share.click', {
      method,
      segment,
      page: 'family-home'
    });
  }

  shareSuccess(method: 'native' | 'copy', segment: string) {
    this.track('share.success', {
      method,
      segment,
      page: 'family-home'
    });
  }

  // Demo events
  demoOpen(demoType: string, segment: string) {
    this.track('demo.open', {
      demoType,
      segment,
      source: 'family-home'
    });
  }

  demoComplete(demoType: string, segment: string, duration: number) {
    this.track('demo.complete', {
      demoType,
      segment,
      duration,
      source: 'family-home'
    });
  }

  // Success events
  successToast(action: string, toolKey?: string, details?: Record<string, any>) {
    this.track('success.feedback', {
      action,
      toolKey,
      ...details,
      source: 'family-home'
    });
  }

  // Page load events
  pageLoad(segment: string, loadTime: number, hasTools: boolean) {
    this.track('family.home.load', {
      segment,
      loadTime,
      hasTools,
      timestamp: Date.now()
    });
  }

  // Get all events for debugging
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  // Clear events (for testing)
  clearEvents() {
    this.events = [];
  }
}

// Export singleton instance
export const familyAnalytics = new FamilyAnalytics();

// Type-safe event tracking hooks
export const useFamilyAnalytics = () => {
  return {
    trackTabView: familyAnalytics.tabView.bind(familyAnalytics),
    trackQuickAction: familyAnalytics.quickActionClick.bind(familyAnalytics),
    trackToolCard: familyAnalytics.toolCardOpen.bind(familyAnalytics),
    trackToolInstall: familyAnalytics.toolInstall.bind(familyAnalytics),
    trackToolPreview: familyAnalytics.toolPreview.bind(familyAnalytics),
    trackProofCreated: familyAnalytics.proofCreated.bind(familyAnalytics),
    trackShare: familyAnalytics.shareClick.bind(familyAnalytics),
    trackShareSuccess: familyAnalytics.shareSuccess.bind(familyAnalytics),
    trackDemo: familyAnalytics.demoOpen.bind(familyAnalytics),
    trackDemoComplete: familyAnalytics.demoComplete.bind(familyAnalytics),
    trackSuccess: familyAnalytics.successToast.bind(familyAnalytics),
    trackPageLoad: familyAnalytics.pageLoad.bind(familyAnalytics)
  };
};