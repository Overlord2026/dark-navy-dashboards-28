// Simple Analytics Tracking

export function track(event: string, props?: Record<string, unknown>) {
  // swap with your analytics later
  console.log("[analytics]", event, props ?? {});
}

// For backward compatibility, export an analytics object with the track method
export const analytics = {
  track,
  
  // Alias methods that all use the same simple track function
  trackPageView: (pageName: string, properties?: Record<string, any>) => {
    track('pageview', { page_name: pageName, ...properties });
  },

  identify: (userId: string, properties?: Record<string, any>) => {
    track('identify', { user_id: userId, ...properties });
  },

  trackFeatureUsage: (featureName: string, properties?: Record<string, any>) => {
    track('feature_used', { feature_name: featureName, ...properties });
  },

  trackConversion: (conversionType: string, properties?: Record<string, any>) => {
    track('conversion', { conversion_type: conversionType, ...properties });
  },

  trackEvent: (eventName: string, properties?: Record<string, any>) => {
    track(eventName, properties);
  },

  trackError: (error: Error, context?: Record<string, any>) => {
    track('error', {
      error_message: error.message,
      error_stack: error.stack,
      error_name: error.name,
      ...context
    });
  },

  trackPerformance: (metric: string, value: number, context?: Record<string, any>) => {
    track('performance_metric', {
      metric_name: metric,
      metric_value: value,
      ...context
    });
  },

  trackSecurityEvent: (eventType: string, severity: 'low' | 'medium' | 'high' | 'critical', details?: Record<string, any>) => {
    track('security_event', {
      event_type: eventType,
      severity,
      timestamp: new Date().toISOString(),
      ...details
    });
  },

  setUserProperties: (properties: Record<string, any>) => {
    track('user_properties_set', properties);
  },

  reset: () => {
    track('user_reset');
  },

  // Onboarding & Engagement Tracking
  trackPersonaClaim: (persona: string, userId: string) => {
    track('persona_claimed', {
      persona_type: persona,
      user_id: userId,
      timestamp: Date.now()
    });
  },

  trackViralShare: (platform: string, persona: string, userId: string) => {
    track('viral_share_clicked', {
      platform,
      persona_type: persona,
      user_id: userId,
      timestamp: Date.now()
    });
  },

  trackOnboardingStep: (step: string, persona: string, userId: string, completed: boolean = false) => {
    track('onboarding_step', {
      step_name: step,
      persona_type: persona,
      user_id: userId,
      completed,
      timestamp: Date.now()
    });
  },

  trackFAQUsage: (searchTerm?: string, articleId?: string) => {
    track('faq_usage', {
      search_term: searchTerm,
      article_id: articleId,
      timestamp: Date.now()
    });
  },

  trackEmailSequenceEngagement: (day: number, action: string, userId: string) => {
    track('email_sequence_engagement', {
      sequence_day: day,
      action, // 'opened', 'clicked', 'converted'
      user_id: userId,
      timestamp: Date.now()
    });
  },

  // Segment-specific tracking methods
  trackOnboardingStart: (persona: string, segment: string) => {
    track('onboarding_started', {
      persona,
      segment,
      timestamp: Date.now()
    });
  },

  trackOnboardingCompleted: (persona: string, segment: string, referrer?: string) => {
    track('onboarding_completed', {
      persona,
      segment,
      referrer,
      timestamp: Date.now()
    });
  },

  trackFAQOpened: (persona: string, segment: string, page: string) => {
    track('faq_opened', {
      persona,
      segment,
      page,
      timestamp: Date.now()
    });
  },

  trackFAQSearched: (persona: string, segment: string, query: string) => {
    track('faq_searched', {
      persona,
      segment,
      query,
      timestamp: Date.now()
    });
  },

  trackViralShareClicked: (persona: string, segment: string, channel: string) => {
    track('viral_share_clicked', {
      persona,
      segment,
      channel,
      timestamp: Date.now()
    });
  },

  // Lead-to-Sales Closure Events
  trackLeadQuickAction: (action: string, leadId: string) => {
    track('lead_quick_action_clicked', {
      action,
      leadId,
      timestamp: Date.now()
    });
  },

  trackLeadOutcome: (outcome: string, leadId: string) => {
    track('lead_outcome_set', {
      outcome,
      leadId,
      timestamp: Date.now()
    });
  },

  trackAIObjection: (type: string, confidence: number) => {
    track('ai_objection_detected', {
      type,
      confidence,
      timestamp: Date.now()
    });
  },

  trackSmartCadence: (reason: string, templateId: string) => {
    track('smart_cadence_triggered', {
      reason,
      templateId,
      timestamp: Date.now()
    });
  },

  trackComplianceReview: (leadId: string, flags: any[]) => {
    track('compliance_review_requested', {
      leadId,
      flags,
      timestamp: Date.now()
    });
  },

  trackWinLossReason: (reason: string, stage: string) => {
    track('win_loss_reason_selected', {
      reason,
      stage,
      timestamp: Date.now()
    });
  },

  // Portfolio Navigator GPS Analytics
  trackOptimizationRun: (userId: string, phaseName: string, riskBudget: number) => {
    track('optimization_run', {
      user_id: userId,
      phase_name: phaseName,
      risk_budget: riskBudget,
      timestamp: Date.now()
    });
  },

  trackRebalancingTicketCreated: (userId: string, tradesCount: number, totalValue: number) => {
    track('rebalancing_ticket_created', {
      user_id: userId,
      trades_count: tradesCount,
      total_value: totalValue,
      timestamp: Date.now()
    });
  },

  trackMcPacRun: (userId: string, successProbability: number, timeHorizon: number) => {
    track('mc_pac_run', {
      user_id: userId,
      success_probability: successProbability,
      time_horizon: timeHorizon,
      timestamp: Date.now()
    });
  },

  trackPM3Updated: (fundId: string, pm3Score: number, bucketTilt: string) => {
    track('pm3_updated', {
      fund_id: fundId,
      pm3_score: pm3Score,
      bucket_tilt: bucketTilt,
      timestamp: Date.now()
    });
  },

  trackPhasePolicyApplied: (userId: string, phaseName: string, riskAdjustment: number) => {
    track('phase_policy_applied', {
      user_id: userId,
      phase_name: phaseName,
      risk_adjustment: riskAdjustment,
      timestamp: Date.now()
    });
  },

  trackRecommendationViewed: (userId: string, recommendationType: string, confidence: number) => {
    track('recommendation_viewed', {
      user_id: userId,
      recommendation_type: recommendationType,
      confidence,
      timestamp: Date.now()
    });
  }
};

// No initialization needed for simple console logging
export const initializeAnalytics = () => {
  console.log("[analytics] Simple analytics initialized - logging to console");
};