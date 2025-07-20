
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/context/TenantContext';
import { useAnalytics } from './useAnalytics';

export interface EventTrackingOptions {
  userId?: string;
  tenantId?: string;
  source?: string;
}

export const useEventTracking = () => {
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const { trackEvent, trackFeatureUsage, trackConversion } = useAnalytics();
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

  return {
    trackEvent: trackEventDual,
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
    trackCalculatorUsed
  };
};
