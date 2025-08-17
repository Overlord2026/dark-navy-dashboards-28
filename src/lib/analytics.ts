
import posthog from 'posthog-js';

// PostHog configuration
const POSTHOG_KEY = 'phc_Yc8jTGjpIN3vMS0YSvT6ZpOZ7UhEwnyBaUhI2i8ec46'; // Replace with actual key
const POSTHOG_HOST = 'https://us.i.posthog.com'; // US instance

export const initializeAnalytics = () => {
  if (typeof window !== 'undefined') {
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      // Privacy-focused settings
      capture_pageview: false, // We'll manually track page views
      capture_pageleave: true,
      disable_session_recording: false, // Enable if you want session recordings
      respect_dnt: true,
      // Performance optimizations
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') {
          console.log('PostHog loaded successfully');
        }
      }
    });
  }
};

export const analytics = {
  // Page tracking
  trackPageView: (pageName: string, properties?: Record<string, any>) => {
    posthog.capture('$pageview', {
      $current_url: window.location.href,
      page_name: pageName,
      ...properties
    });
  },

  // User identification
  identify: (userId: string, properties?: Record<string, any>) => {
    posthog.identify(userId, properties);
  },

  // Feature usage tracking
  trackFeatureUsage: (featureName: string, properties?: Record<string, any>) => {
    posthog.capture('feature_used', {
      feature_name: featureName,
      ...properties
    });
  },

  // Conversion events
  trackConversion: (conversionType: string, properties?: Record<string, any>) => {
    posthog.capture('conversion', {
      conversion_type: conversionType,
      ...properties
    });
  },

  // Custom events
  track: (eventName: string, properties?: Record<string, any>) => {
    posthog.capture(eventName, properties);
  },

  // Alias for track
  trackEvent: (eventName: string, properties?: Record<string, any>) => {
    posthog.capture(eventName, properties);
  },

  // Error tracking
  trackError: (error: Error, context?: Record<string, any>) => {
    posthog.capture('error', {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name,
      ...context
    });
  },

  // Performance tracking
  trackPerformance: (metric: string, value: number, context?: Record<string, any>) => {
    posthog.capture('performance_metric', {
      metric_name: metric,
      metric_value: value,
      ...context
    });
  },

  // Security event tracking
  trackSecurityEvent: (eventType: string, severity: 'low' | 'medium' | 'high' | 'critical', details?: Record<string, any>) => {
    posthog.capture('security_event', {
      event_type: eventType,
      severity,
      timestamp: new Date().toISOString(),
      ...details
    });
  },

  // User properties
  setUserProperties: (properties: Record<string, any>) => {
    posthog.setPersonProperties(properties);
  },

  // Reset user (for logout)
  reset: () => {
    posthog.reset();
  },

  // Onboarding & Engagement Tracking
  trackPersonaClaim: (persona: string, userId: string) => {
    posthog.capture('persona_claimed', {
      persona_type: persona,
      user_id: userId,
      timestamp: Date.now()
    });
  },

  trackViralShare: (platform: string, persona: string, userId: string) => {
    posthog.capture('viral_share_clicked', {
      platform,
      persona_type: persona,
      user_id: userId,
      timestamp: Date.now()
    });
  },

  trackOnboardingStep: (step: string, persona: string, userId: string, completed: boolean = false) => {
    posthog.capture('onboarding_step', {
      step_name: step,
      persona_type: persona,
      user_id: userId,
      completed,
      timestamp: Date.now()
    });
  },

  trackFAQUsage: (searchTerm?: string, articleId?: string) => {
    posthog.capture('faq_usage', {
      search_term: searchTerm,
      article_id: articleId,
      timestamp: Date.now()
    });
  },

  trackEmailSequenceEngagement: (day: number, action: string, userId: string) => {
    posthog.capture('email_sequence_engagement', {
      sequence_day: day,
      action, // 'opened', 'clicked', 'converted'
      user_id: userId,
      timestamp: Date.now()
    });
  },

  // Segment-specific tracking methods
  trackOnboardingStart: (persona: string, segment: string) => {
    posthog.capture('onboarding_started', {
      persona,
      segment,
      timestamp: Date.now()
    });
  },

  trackOnboardingCompleted: (persona: string, segment: string, referrer?: string) => {
    posthog.capture('onboarding_completed', {
      persona,
      segment,
      referrer,
      timestamp: Date.now()
    });
  },

  trackFAQOpened: (persona: string, segment: string, page: string) => {
    posthog.capture('faq_opened', {
      persona,
      segment,
      page,
      timestamp: Date.now()
    });
  },

  trackFAQSearched: (persona: string, segment: string, query: string) => {
    posthog.capture('faq_searched', {
      persona,
      segment,
      query,
      timestamp: Date.now()
    });
  },

  trackViralShareClicked: (persona: string, segment: string, channel: string) => {
    posthog.capture('viral_share_clicked', {
      persona,
      segment,
      channel,
      timestamp: Date.now()
    });
  },

  // Lead-to-Sales Closure Events
  trackLeadQuickAction: (action: string, leadId: string) => {
    posthog.capture('lead_quick_action_clicked', {
      action,
      leadId,
      timestamp: Date.now()
    });
  },

  trackLeadOutcome: (outcome: string, leadId: string) => {
    posthog.capture('lead_outcome_set', {
      outcome,
      leadId,
      timestamp: Date.now()
    });
  },

  trackAIObjection: (type: string, confidence: number) => {
    posthog.capture('ai_objection_detected', {
      type,
      confidence,
      timestamp: Date.now()
    });
  },

  trackSmartCadence: (reason: string, templateId: string) => {
    posthog.capture('smart_cadence_triggered', {
      reason,
      templateId,
      timestamp: Date.now()
    });
  },

  trackComplianceReview: (leadId: string, flags: any[]) => {
    posthog.capture('compliance_review_requested', {
      leadId,
      flags,
      timestamp: Date.now()
    });
  },

  trackWinLossReason: (reason: string, stage: string) => {
    posthog.capture('win_loss_reason_selected', {
      reason,
      stage,
      timestamp: Date.now()
    });
  },

  // Portfolio Navigator GPS Analytics
  trackOptimizationRun: (userId: string, phaseName: string, riskBudget: number) => {
    posthog.capture('optimization_run', {
      user_id: userId,
      phase_name: phaseName,
      risk_budget: riskBudget,
      timestamp: Date.now()
    });
  },

  trackRebalancingTicketCreated: (userId: string, tradesCount: number, totalValue: number) => {
    posthog.capture('rebalancing_ticket_created', {
      user_id: userId,
      trades_count: tradesCount,
      total_value: totalValue,
      timestamp: Date.now()
    });
  },

  trackMcPacRun: (userId: string, successProbability: number, timeHorizon: number) => {
    posthog.capture('mc_pac_run', {
      user_id: userId,
      success_probability: successProbability,
      time_horizon: timeHorizon,
      timestamp: Date.now()
    });
  },

  trackPM3Updated: (fundId: string, pm3Score: number, bucketTilt: string) => {
    posthog.capture('pm3_updated', {
      fund_id: fundId,
      pm3_score: pm3Score,
      bucket_tilt: bucketTilt,
      timestamp: Date.now()
    });
  },

  trackPhasePolicyApplied: (userId: string, phaseName: string, riskAdjustment: number) => {
    posthog.capture('phase_policy_applied', {
      user_id: userId,
      phase_name: phaseName,
      risk_adjustment: riskAdjustment,
      timestamp: Date.now()
    });
  },

  trackRecommendationViewed: (userId: string, recommendationType: string, confidence: number) => {
    posthog.capture('recommendation_viewed', {
      user_id: userId,
      recommendation_type: recommendationType,
      confidence,
      timestamp: Date.now()
    });
  }
};
