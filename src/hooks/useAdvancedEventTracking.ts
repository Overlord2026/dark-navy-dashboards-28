import React, { useState, useCallback, useEffect } from 'react';
import { PersonaType } from '@/types/personas';
import { analytics } from '@/lib/analytics';

export interface TrackingEvent {
  eventType: string;
  persona: PersonaType;
  userId?: string;
  properties?: Record<string, any>;
  timestamp: number;
  sessionId: string;
  channel?: string;
  source?: string;
}

export interface OnboardingEventData {
  step: string;
  persona: PersonaType;
  completionRate?: number;
  timeSpent?: number;
  channel?: 'linkedin' | 'email' | 'sms' | 'direct' | 'referral';
  source?: string;
  inviteId?: string;
}

export interface ViralShareEventData {
  platform: 'linkedin' | 'email' | 'sms' | 'whatsapp' | 'copy';
  persona: PersonaType;
  shareType: 'profile' | 'invite' | 'content';
  recipientCount?: number;
  messageTemplate?: string;
}

export interface EngagementEventData {
  feature: 'demo' | 'training' | 'faq' | 'tutorial' | 'help';
  persona: PersonaType;
  contentId?: string;
  duration?: number;
  completionRate?: number;
  rating?: number;
}

export interface ConversionEventData {
  conversionType: 'signup' | 'upgrade' | 'trial_start' | 'payment';
  persona: PersonaType;
  plan?: string;
  amount?: number;
  channel: string;
  source: string;
  daysFromSignup?: number;
}

export const useAdvancedEventTracking = () => {
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [trackingQueue, setTrackingQueue] = useState<TrackingEvent[]>([]);

  // Generate unique event ID
  const generateEventId = useCallback(() => {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Base tracking function
  const trackEvent = useCallback(async (
    eventType: string,
    persona: PersonaType,
    properties: Record<string, any> = {},
    userId?: string
  ) => {
    const event: TrackingEvent = {
      eventType,
      persona,
      userId,
      properties: {
        ...properties,
        eventId: generateEventId(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer
      },
      timestamp: Date.now(),
      sessionId,
      channel: properties.channel,
      source: properties.source
    };

    // Add to queue for batch processing
    setTrackingQueue(prev => [...prev, event]);

    // Also send to analytics immediately for critical events
    if (['onboarding_complete', 'upgrade', 'viral_share'].includes(eventType)) {
      try {
        await analytics.track(eventType, event.properties);
      } catch (error) {
        console.error('Failed to track event:', error);
      }
    }

    return event;
  }, [sessionId, generateEventId]);

  // Onboarding tracking
  const trackOnboardingEvent = useCallback(async (data: OnboardingEventData, userId?: string) => {
    return trackEvent('onboarding_step', data.persona, {
      step: data.step,
      completion_rate: data.completionRate,
      time_spent: data.timeSpent,
      channel: data.channel,
      source: data.source,
      invite_id: data.inviteId
    }, userId);
  }, [trackEvent]);

  const trackOnboardingStart = useCallback(async (
    persona: PersonaType, 
    channel: string, 
    source?: string,
    inviteId?: string,
    userId?: string
  ) => {
    return trackEvent('onboarding_start', persona, {
      channel,
      source,
      invite_id: inviteId,
      onboarding_version: 'v2.1'
    }, userId);
  }, [trackEvent]);

  const trackOnboardingComplete = useCallback(async (
    persona: PersonaType,
    timeSpent: number,
    stepsCompleted: string[],
    channel: string,
    userId?: string
  ) => {
    return trackEvent('onboarding_complete', persona, {
      time_spent: timeSpent,
      steps_completed: stepsCompleted,
      completion_rate: 100,
      channel
    }, userId);
  }, [trackEvent]);

  // Viral sharing tracking
  const trackViralShare = useCallback(async (data: ViralShareEventData, userId?: string) => {
    return trackEvent('viral_share', data.persona, {
      platform: data.platform,
      share_type: data.shareType,
      recipient_count: data.recipientCount,
      message_template: data.messageTemplate
    }, userId);
  }, [trackEvent]);

  const trackViralShareClick = useCallback(async (
    shareId: string,
    persona: PersonaType,
    platform: string,
    userId?: string
  ) => {
    return trackEvent('viral_share_click', persona, {
      share_id: shareId,
      platform,
      click_source: 'shared_link'
    }, userId);
  }, [trackEvent]);

  const trackViralConversion = useCallback(async (
    shareId: string,
    originalPersona: PersonaType,
    newPersona: PersonaType,
    platform: string,
    userId?: string
  ) => {
    return trackEvent('viral_conversion', newPersona, {
      share_id: shareId,
      original_persona: originalPersona,
      platform,
      conversion_type: 'referral_signup'
    }, userId);
  }, [trackEvent]);

  // Engagement tracking
  const trackEngagement = useCallback(async (data: EngagementEventData, userId?: string) => {
    return trackEvent('engagement', data.persona, {
      feature: data.feature,
      content_id: data.contentId,
      duration: data.duration,
      completion_rate: data.completionRate,
      rating: data.rating
    }, userId);
  }, [trackEvent]);

  const trackDemoView = useCallback(async (
    persona: PersonaType,
    demoType: string,
    duration?: number,
    completed?: boolean,
    userId?: string
  ) => {
    return trackEvent('demo_view', persona, {
      demo_type: demoType,
      duration,
      completed,
      demo_version: 'v1.2'
    }, userId);
  }, [trackEvent]);

  const trackTrainingAccess = useCallback(async (
    persona: PersonaType,
    trainingId: string,
    trainingType: string,
    source: string,
    userId?: string
  ) => {
    return trackEvent('training_access', persona, {
      training_id: trainingId,
      training_type: trainingType,
      access_source: source
    }, userId);
  }, [trackEvent]);

  const trackFAQView = useCallback(async (
    persona: PersonaType,
    question: string,
    category: string,
    wasHelpful?: boolean,
    userId?: string
  ) => {
    return trackEvent('faq_view', persona, {
      question,
      category,
      was_helpful: wasHelpful
    }, userId);
  }, [trackEvent]);

  // Conversion tracking
  const trackConversion = useCallback(async (data: ConversionEventData, userId?: string) => {
    return trackEvent('conversion', data.persona, {
      conversion_type: data.conversionType,
      plan: data.plan,
      amount: data.amount,
      channel: data.channel,
      source: data.source,
      days_from_signup: data.daysFromSignup
    }, userId);
  }, [trackEvent]);

  const trackUpgrade = useCallback(async (
    persona: PersonaType,
    fromPlan: string,
    toPlan: string,
    amount: number,
    channel: string,
    daysFromSignup: number,
    userId?: string
  ) => {
    return trackEvent('upgrade', persona, {
      from_plan: fromPlan,
      to_plan: toPlan,
      amount,
      channel,
      days_from_signup: daysFromSignup,
      upgrade_trigger: 'user_action'
    }, userId);
  }, [trackEvent]);

  // Feature adoption tracking
  const trackFeatureAdoption = useCallback(async (
    persona: PersonaType,
    feature: string,
    action: 'first_use' | 'regular_use' | 'advanced_use',
    userId?: string
  ) => {
    return trackEvent('feature_adoption', persona, {
      feature,
      adoption_level: action,
      feature_version: '1.0'
    }, userId);
  }, [trackEvent]);

  // Batch processing for analytics
  const flushTrackingQueue = useCallback(async () => {
    if (trackingQueue.length === 0) return;

    try {
      // Send batched events to analytics service
      const events = [...trackingQueue];
      setTrackingQueue([]);
      
      // Group events by type for efficient processing
      const groupedEvents = events.reduce((groups, event) => {
        const key = event.eventType;
        if (!groups[key]) groups[key] = [];
        groups[key].push(event);
        return groups;
      }, {} as Record<string, TrackingEvent[]>);

      // Send to analytics service
      for (const [eventType, eventList] of Object.entries(groupedEvents)) {
        await analytics.track(`batch_${eventType}`, {
          events: eventList,
          batch_size: eventList.length,
          session_id: sessionId
        });
      }
    } catch (error) {
      console.error('Failed to flush tracking queue:', error);
    }
  }, [trackingQueue, sessionId]);

  // Auto-flush every 30 seconds
  useEffect(() => {
    const interval = setInterval(flushTrackingQueue, 30000);
    return () => clearInterval(interval);
  }, [flushTrackingQueue]);

  return {
    // Base tracking
    trackEvent,
    
    // Onboarding
    trackOnboardingEvent,
    trackOnboardingStart,
    trackOnboardingComplete,
    
    // Viral sharing
    trackViralShare,
    trackViralShareClick,
    trackViralConversion,
    
    // Engagement
    trackEngagement,
    trackDemoView,
    trackTrainingAccess,
    trackFAQView,
    
    // Conversion
    trackConversion,
    trackUpgrade,
    
    // Feature adoption
    trackFeatureAdoption,
    
    // Queue management
    flushTrackingQueue,
    trackingQueue: trackingQueue.length,
    sessionId
  };
};