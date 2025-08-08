
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/context/TenantContext';
import { useAnalyticsTracking } from './useAnalytics';

export interface AppEventContext {
  [key: string]: any;
}

export interface EventTrackingOptions {
  userId?: string;
  tenantId?: string;
  source?: string;
}

export const useEventTracking = () => {
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const { trackEvent, trackFeatureUsage, trackConversion } = useAnalyticsTracking();
  const [isTracking, setIsTracking] = useState(false);

  const trackEventDual = useCallback(async (
    eventType: string,
    eventName: string,
    eventData: Record<string, any> = {},
    options: EventTrackingOptions = {}
  ) => {
    try {
      setIsTracking(true);

      const payload = {
        eventType,
        eventName,
        eventData,
        userId: options.userId || user?.id,
        tenantId: options.tenantId || currentTenant?.id,
        source: options.source || 'app'
      };

      console.log('Tracking event:', payload);

      // Track in PostHog
      trackEvent(eventName, {
        event_type: eventType,
        ...eventData,
        user_id: payload.userId,
        tenant_id: payload.tenantId,
        source: payload.source
      });

      // Also track in Supabase if edge function exists
      const { data, error } = await supabase.functions.invoke('track-event', {
        body: payload
      });

      if (error) {
        console.error('Event tracking error:', error);
        throw error;
      }

      console.log('Event tracked successfully:', data);
      return data;
    } catch (error) {
      console.error('Failed to track event:', error);
      throw error;
    } finally {
      setIsTracking(false);
    }
  }, [user?.id, currentTenant?.id, trackEvent]);

  // Predefined event tracking functions with PostHog integration
  const trackUserRegistration = useCallback((userData: Record<string, any>) => {
    trackConversion('user_registration', userData);
    return trackEventDual('user.registered', 'User Registration', userData);
  }, [trackEventDual, trackConversion]);

  const trackUserOnboarding = useCallback((step: string, stepData: Record<string, any> = {}) => {
    trackFeatureUsage('onboarding_step', { step, ...stepData });
    return trackEventDual('user.onboarded', `Onboarding Step: ${step}`, { step, ...stepData });
  }, [trackEventDual, trackFeatureUsage]);

  const trackLeadCreated = useCallback((leadData: Record<string, any>) => {
    trackFeatureUsage('lead_created', leadData);
    return trackEventDual('lead.created', 'Lead Created', leadData);
  }, [trackEventDual, trackFeatureUsage]);

  const trackLeadConverted = useCallback((leadData: Record<string, any>) => {
    trackConversion('lead_conversion', leadData);
    return trackEventDual('lead.converted', 'Lead Converted', leadData);
  }, [trackEventDual, trackConversion]);

  const trackAppointmentBooked = useCallback((appointmentData: Record<string, any>) => {
    trackFeatureUsage('appointment_booked', appointmentData);
    return trackEventDual('appointment.booked', 'Appointment Booked', appointmentData);
  }, [trackEventDual, trackFeatureUsage]);

  const trackResourceDownload = useCallback((resourceData: Record<string, any>) => {
    trackFeatureUsage('resource_download', resourceData);
    return trackEventDual('resource.downloaded', 'Resource Downloaded', resourceData);
  }, [trackEventDual, trackFeatureUsage]);

  const trackPageView = useCallback((page: string, additionalData: Record<string, any> = {}) => {
    // PostHog handles page views automatically, but we can track additional data
    return trackEventDual('page.viewed', 'Page View', { page, ...additionalData });
  }, [trackEventDual]);

  const trackFeatureUsed = useCallback((feature: string, featureData: Record<string, any> = {}) => {
    trackFeatureUsage(feature, featureData);
    return trackEventDual('feature.used', `Feature Used: ${feature}`, { feature, ...featureData });
  }, [trackEventDual, trackFeatureUsage]);

  const trackProfileUpdated = useCallback((profileData: Record<string, any>) => {
    trackFeatureUsage('profile_updated', profileData);
    return trackEventDual('profile.updated', 'Profile Updated', profileData);
  }, [trackEventDual, trackFeatureUsage]);

  const trackDocumentUploaded = useCallback((documentData: Record<string, any>) => {
    trackFeatureUsage('document_uploaded', documentData);
    return trackEventDual('document.uploaded', 'Document Uploaded', documentData);
  }, [trackEventDual, trackFeatureUsage]);

  const trackCalculatorUsed = useCallback((calculatorType: string, calculatorData: Record<string, any> = {}) => {
    trackFeatureUsage('calculator_used', { calculatorType, ...calculatorData });
    return trackEventDual('calculator.used', `Calculator Used: ${calculatorType}`, { calculatorType, ...calculatorData });
  }, [trackEventDual, trackFeatureUsage]);

  // App-specific event tracking functions
  const trackAppEvent = useCallback(async (
    eventType: string,
    context: AppEventContext = {},
    page?: string
  ) => {
    try {
      // Extract UTM parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const utm = {
        source: urlParams.get('utm_source'),
        medium: urlParams.get('utm_medium'),
        campaign: urlParams.get('utm_campaign'),
        term: urlParams.get('utm_term'),
        content: urlParams.get('utm_content')
      };

      // Filter out null values
      const filteredUtm = Object.fromEntries(
        Object.entries(utm).filter(([_, value]) => value !== null)
      );

      const eventData = {
        user_id: user?.id || null,
        session_id: sessionStorage.getItem('session_id') || crypto.randomUUID(),
        event_type: eventType,
        context: {
          ...context,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          viewport: `${window.innerWidth}x${window.innerHeight}`
        },
        referrer: document.referrer || null,
        utm: Object.keys(filteredUtm).length > 0 ? filteredUtm : null,
        page: page || window.location.pathname
      };

      // Store session ID for consistency
      if (!sessionStorage.getItem('session_id')) {
        sessionStorage.setItem('session_id', eventData.session_id);
      }

      // QA Mode logging
      if (process.env.NODE_ENV === 'development') {
        console.log('🎯 App Event Tracked:', eventData);
      }

      const { error } = await supabase
        .from('app_events')
        .insert(eventData);

      if (error) {
        console.error('App event tracking error:', error);
        // Don't throw - event tracking should never break the app
      }

    } catch (error) {
      console.error('Failed to track app event:', error);
      // Graceful failure - continue app operation
    }
  }, [user?.id]);

  // Predefined app event tracking functions
  const trackLandingView = useCallback(() => {
    trackAppEvent('landing_view');
  }, [trackAppEvent]);

  const trackPersonaCardClick = useCallback((persona: string) => {
    trackAppEvent('persona_card_click', { persona });
  }, [trackAppEvent]);

  const trackCtaClick = useCallback((cta: string, destination?: string) => {
    trackAppEvent('cta_click', { cta, destination });
  }, [trackAppEvent]);

  const trackCalculatorView = useCallback(() => {
    trackAppEvent('calculator_view');
  }, [trackAppEvent]);

  const trackCalculatorRun = useCallback((inputs: any, results: any) => {
    trackAppEvent('calculator_run', { inputs, results });
  }, [trackAppEvent]);

  const trackCalculatorDownloadPdf = useCallback(() => {
    trackAppEvent('calculator_download_pdf');
  }, [trackAppEvent]);

  const trackCalculatorCtaClicked = useCallback((cta: string) => {
    trackAppEvent('calculator_cta_clicked', { cta });
  }, [trackAppEvent]);

  const trackAdminView = useCallback((section: string) => {
    trackAppEvent('admin_view', { section });
  }, [trackAppEvent]);

  const trackMarketingCampaignCreated = useCallback((campaignData: any) => {
    trackAppEvent('marketing_campaign_created', campaignData);
  }, [trackAppEvent]);

  return {
    trackEvent: trackEventDual,
    trackAppEvent,
    isTracking,
    // Predefined tracking functions
    trackUserRegistration,
    trackUserOnboarding,
    trackLeadCreated,
    trackLeadConverted,
    trackAppointmentBooked,
    trackResourceDownload,
    trackPageView,
    trackFeatureUsed,
    trackProfileUpdated,
    trackDocumentUploaded,
    trackCalculatorUsed,
    // App-specific tracking functions
    trackLandingView,
    trackPersonaCardClick,
    trackCtaClick,
    trackCalculatorView,
    trackCalculatorRun,
    trackCalculatorDownloadPdf,
    trackCalculatorCtaClicked,
    trackAdminView,
    trackMarketingCampaignCreated
  };
};
