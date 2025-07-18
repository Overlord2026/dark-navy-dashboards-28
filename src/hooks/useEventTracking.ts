import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/context/TenantContext';

export interface EventTrackingOptions {
  userId?: string;
  tenantId?: string;
  source?: string;
}

export const useEventTracking = () => {
  const { user } = useAuth();
  const { currentTenant } = useTenant();
  const [isTracking, setIsTracking] = useState(false);

  const trackEvent = useCallback(async (
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
  }, [user?.id, currentTenant?.id]);

  // Predefined event tracking functions
  const trackUserRegistration = useCallback((userData: Record<string, any>) => {
    return trackEvent('user.registered', 'User Registration', userData);
  }, [trackEvent]);

  const trackUserOnboarding = useCallback((step: string, stepData: Record<string, any> = {}) => {
    return trackEvent('user.onboarded', `Onboarding Step: ${step}`, { step, ...stepData });
  }, [trackEvent]);

  const trackLeadCreated = useCallback((leadData: Record<string, any>) => {
    return trackEvent('lead.created', 'Lead Created', leadData);
  }, [trackEvent]);

  const trackLeadConverted = useCallback((leadData: Record<string, any>) => {
    return trackEvent('lead.converted', 'Lead Converted', leadData);
  }, [trackEvent]);

  const trackAppointmentBooked = useCallback((appointmentData: Record<string, any>) => {
    return trackEvent('appointment.booked', 'Appointment Booked', appointmentData);
  }, [trackEvent]);

  const trackResourceDownload = useCallback((resourceData: Record<string, any>) => {
    return trackEvent('resource.downloaded', 'Resource Downloaded', resourceData);
  }, [trackEvent]);

  const trackPageView = useCallback((page: string, additionalData: Record<string, any> = {}) => {
    return trackEvent('page.viewed', 'Page View', { page, ...additionalData });
  }, [trackEvent]);

  const trackFeatureUsed = useCallback((feature: string, featureData: Record<string, any> = {}) => {
    return trackEvent('feature.used', `Feature Used: ${feature}`, { feature, ...featureData });
  }, [trackEvent]);

  const trackProfileUpdated = useCallback((profileData: Record<string, any>) => {
    return trackEvent('profile.updated', 'Profile Updated', profileData);
  }, [trackEvent]);

  const trackDocumentUploaded = useCallback((documentData: Record<string, any>) => {
    return trackEvent('document.uploaded', 'Document Uploaded', documentData);
  }, [trackEvent]);

  const trackCalculatorUsed = useCallback((calculatorType: string, calculatorData: Record<string, any> = {}) => {
    return trackEvent('calculator.used', `Calculator Used: ${calculatorType}`, { calculatorType, ...calculatorData });
  }, [trackEvent]);

  return {
    trackEvent,
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