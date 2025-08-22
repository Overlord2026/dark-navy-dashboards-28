// NIL Analytics Events Tracking
export interface NILAnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: string;
}

export class NILAnalytics {
  public static trackEvent(event: string, properties: Record<string, any> = {}) {
    const analyticsEvent: NILAnalyticsEvent = {
      event,
      properties: {
        ...properties,
        platform: 'nil',
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      },
      timestamp: new Date().toISOString()
    };

    // Send to multiple analytics providers
    if (typeof window !== 'undefined') {
      // PostHog
      if ((window as any).posthog) {
        (window as any).posthog.capture(event, analyticsEvent.properties);
      }
      
      // Google Analytics
      if ((window as any).gtag) {
        (window as any).gtag('event', event, analyticsEvent.properties);
      }
      
      // Console logging for development
      if (process.env.NODE_ENV === 'development') {
        console.log('NIL Analytics:', analyticsEvent);
      }
    }
  }

  // Index and Discovery Events
  static indexView(filters?: Record<string, any>) {
    this.trackEvent('nil.index.view', {
      filters: filters || {},
      athleteCount: filters?.total || 0
    });
  }

  static inviteSend(athleteId: string, inviterType: 'brand' | 'agent' | 'school') {
    this.trackEvent('nil.invite.send', {
      athleteId,
      inviterType,
      source: 'index'
    });
  }

  // Offer and Contract Events
  static offerLockCreate(offerId: string, athleteId: string, amount: number) {
    this.trackEvent('nil.offerlock.create', {
      offerId,
      athleteId,
      amount,
      currency: 'USD'
    });
  }

  static contractEsign(contractId: string, signerId: string, signerType: 'athlete' | 'parent' | 'school') {
    this.trackEvent('nil.contract.esign', {
      contractId,
      signerId,
      signerType,
      method: 'electronic'
    });
  }

  // Payment Events
  static paymentRelease(paymentId: string, athleteId: string, amount: number, method: string) {
    this.trackEvent('nil.payment.release', {
      paymentId,
      athleteId,
      amount,
      method,
      currency: 'USD'
    });
  }

  // Dispute Events
  static disputeOpen(disputeId: string, postId: string, reason: string) {
    this.trackEvent('nil.dispute.open', {
      disputeId,
      postId,
      reason,
      status: 'open'
    });
  }

  static disputeClose(disputeId: string, resolution: string, resolutionTime: number) {
    this.trackEvent('nil.dispute.close', {
      disputeId,
      resolution,
      resolutionTimeMinutes: resolutionTime,
      status: 'resolved'
    });
  }

  // Training and Education Events
  static trainingComplete(athleteId: string, moduleId: string, score?: number) {
    this.trackEvent('nil.training.complete', {
      athleteId,
      moduleId,
      score: score || null,
      duration: 'tracked'
    });
  }

  static disclosureApprove(postId: string, athleteId: string, ftcCompliant: boolean) {
    this.trackEvent('nil.disclosure.approve', {
      postId,
      athleteId,
      ftcCompliant,
      reviewType: 'automated'
    });
  }

  // Sharing and Engagement Events
  static shareClick(contentType: 'profile' | 'post' | 'offer', contentId: string, method: 'native' | 'copy') {
    this.trackEvent('share.click', {
      contentType,
      contentId,
      shareMethod: method,
      platform: 'nil'
    });
  }

  // Demo Events
  static demoOpen(demoId: string, source: 'hub' | 'index' | 'profile') {
    this.trackEvent('demo.open', {
      demoId,
      source,
      platform: 'nil'
    });
  }

  static demoComplete(demoId: string, completionRate: number, timeSpent: number) {
    this.trackEvent('demo.complete', {
      demoId,
      completionRate,
      timeSpentSeconds: timeSpent,
      platform: 'nil'
    });
  }

  // Admin and Compliance Events
  static auditExport(exportType: 'audit_pack' | 'proof_slips' | 'compliance_report', recordCount: number) {
    this.trackEvent('nil.audit.export', {
      exportType,
      recordCount,
      format: 'zip'
    });
  }

  static verificationRun(verificationResult: 'verified' | 'failed', issueCount: number) {
    this.trackEvent('nil.verification.run', {
      result: verificationResult,
      issueCount,
      verificationTime: new Date().toISOString()
    });
  }

  // Quick Action Events
  static quickActionClick(userType: string, action: string) {
    this.trackEvent('nil.quick_action.click', {
      userType,
      action,
      source: 'dashboard'
    });
  }

  // Accessibility Events
  static accessibilityViolation(violationType: string, element: string, severity: 'error' | 'warning') {
    this.trackEvent('a11y.violation', {
      violationType,
      element,
      severity,
      page: window.location.pathname
    });
  }

  // Performance Events
  static performanceMetric(metricName: string, value: number, threshold?: number) {
    this.trackEvent('performance.metric', {
      metricName,
      value,
      threshold: threshold || null,
      exceedsThreshold: threshold ? value > threshold : false,
      page: window.location.pathname
    });
  }
}

// Convenience export for easier imports
export const nilAnalytics = NILAnalytics;