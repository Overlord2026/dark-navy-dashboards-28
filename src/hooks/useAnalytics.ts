
import { useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { analytics } from '@/lib/analytics';

export const useAnalytics = () => {
  const { userProfile } = useAuth();

  const trackPageView = useCallback((pageName: string, additionalProperties?: Record<string, any>) => {
    analytics.trackPageView(pageName, {
      user_role: userProfile?.role,
      user_id: userProfile?.id,
      ...additionalProperties
    });
  }, [userProfile]);

  const trackFeatureUsage = useCallback((featureName: string, additionalProperties?: Record<string, any>) => {
    analytics.trackFeatureUsage(featureName, {
      user_role: userProfile?.role,
      user_id: userProfile?.id,
      timestamp: new Date().toISOString(),
      ...additionalProperties
    });
  }, [userProfile]);

  const trackConversion = useCallback((conversionType: string, additionalProperties?: Record<string, any>) => {
    analytics.trackConversion(conversionType, {
      user_role: userProfile?.role,
      user_id: userProfile?.id,
      timestamp: new Date().toISOString(),
      ...additionalProperties
    });
  }, [userProfile]);

  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    analytics.track(eventName, {
      user_role: userProfile?.role,
      user_id: userProfile?.id,
      timestamp: new Date().toISOString(),
      ...properties
    });
  }, [userProfile]);

  const trackInviteSent = useCallback((inviteType: string, recipientEmail?: string) => {
    trackFeatureUsage('invite_sent', {
      invite_type: inviteType,
      recipient_email: recipientEmail ? 'provided' : 'not_provided'
    });
  }, [trackFeatureUsage]);

  const trackOnboardingStep = useCallback((step: string, completed: boolean = false) => {
    trackEvent('onboarding_step', {
      step,
      completed,
      event_type: completed ? 'onboarding_step_completed' : 'onboarding_step_started'
    });
  }, [trackEvent]);

  const trackTestDataReset = useCallback((success: boolean, resetType?: string) => {
    trackFeatureUsage('test_data_reset', {
      success,
      reset_type: resetType || 'full_reset'
    });
  }, [trackFeatureUsage]);

  const trackDocumentAction = useCallback((action: string, documentType?: string) => {
    trackFeatureUsage('document_action', {
      action,
      document_type: documentType
    });
  }, [trackFeatureUsage]);

  const trackCalculatorUsage = useCallback((calculatorType: string, completed: boolean = false) => {
    trackFeatureUsage('calculator_used', {
      calculator_type: calculatorType,
      completed
    });
  }, [trackFeatureUsage]);

  return {
    trackPageView,
    trackFeatureUsage,
    trackConversion,
    trackEvent,
    trackInviteSent,
    trackOnboardingStep,
    trackTestDataReset,
    trackDocumentAction,
    trackCalculatorUsage
  };
};
