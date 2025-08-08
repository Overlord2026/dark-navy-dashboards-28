/**
 * Analytics Events Utility
 * 
 * Centralized event tracking for the Family Office CRM platform.
 * All events are typed and validated before sending to analytics providers.
 * 
 * Features:
 * - Type-safe event tracking
 * - Automatic validation
 * - No-op fallback when analytics unavailable
 * - Privacy-compliant data collection
 */

import { analytics } from '@/lib/analytics';

// Event property interfaces for type safety
interface BaseEventProperties {
  user_persona?: string;
  subscription_tier?: 'free' | 'premium' | 'elite';
  session_id?: string;
  platform_version?: string;
  feature_flags?: string[];
}

interface PageViewProperties extends BaseEventProperties {
  page_name: string;
  page_path: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

interface AuthEventProperties extends BaseEventProperties {
  auth_type: 'login' | 'signup' | 'magic_link' | 'social';
  auth_source?: string;
  persona_intent?: string;
  auth_duration?: number;
  error_type?: string;
  error_message?: string;
}

interface OnboardingEventProperties extends BaseEventProperties {
  persona: string;
  step_name?: string;
  step_number?: number;
  completion_time?: number;
  fields_completed?: string[];
  skipped?: boolean;
  total_duration?: number;
  steps_completed?: number;
  steps_skipped?: number;
}

interface RoadmapEventProperties extends BaseEventProperties {
  calculation_type?: 'full_analysis' | 'quick_estimate' | 'scenario';
  data_source?: 'manual_entry' | 'plan_import' | 'existing_data';
  swag_score?: number;
  success_probability?: number;
  retirement_gap?: number;
  calculation_time?: number;
  scenarios_analyzed?: number;
}

interface LeadEventProperties extends BaseEventProperties {
  form_type?: 'contact' | 'demo_request' | 'consultation';
  form_location?: string;
  lead_source?: 'organic' | 'paid' | 'referral' | 'direct';
  persona_interest?: string;
  lead_score?: number;
  form_completion_time?: number;
  fields_completed?: string[];
  contact_preference?: 'email' | 'phone' | 'calendar';
}

interface SubscriptionEventProperties extends BaseEventProperties {
  current_tier?: string;
  target_tier?: string;
  previous_tier?: string;
  new_tier?: string;
  upgrade_trigger?: 'feature_gate' | 'usage_limit' | 'promotion';
  feature_accessed?: string;
  payment_amount?: number;
  payment_method?: string;
  billing_cycle?: 'monthly' | 'annual';
  cancellation_reason?: string;
  tenure_days?: number;
}

interface DocumentEventProperties extends BaseEventProperties {
  document_type?: 'financial_plan' | 'legal_doc' | 'tax_doc' | 'other';
  file_size?: number;
  file_format?: string;
  vault_section?: string;
  upload_source?: 'manual' | 'drag_drop' | 'plan_import';
  document_id?: string;
  share_method?: 'link' | 'email' | 'portal_access';
  recipient_type?: 'client' | 'advisor' | 'family_member' | 'professional';
}

interface ErrorEventProperties extends BaseEventProperties {
  error_type: 'javascript' | 'api' | 'validation' | 'network';
  error_message: string;
  error_location?: string;
  user_action?: string;
  browser_info?: string;
  stack_trace?: string;
}

/**
 * Analytics Events Utility Class
 * 
 * Provides type-safe, validated event tracking with automatic fallbacks
 * when analytics services are unavailable.
 */
class AnalyticsEvents {
  private isEnabled: boolean = true;
  private debugMode: boolean = false;

  constructor() {
    // Check if analytics is available and configured
    this.isEnabled = typeof window !== 'undefined' && !!analytics;
    this.debugMode = process.env.NODE_ENV === 'development';
    
    if (this.debugMode) {
      console.log('🔍 Analytics Events initialized:', { enabled: this.isEnabled });
    }
  }

  /**
   * Enable or disable event tracking
   */
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (this.debugMode) {
      console.log('🔍 Analytics Events', enabled ? 'enabled' : 'disabled');
    }
  }

  /**
   * Private method to safely send events with validation
   */
  private sendEvent(eventName: string, properties: any): void {
    if (!this.isEnabled) {
      if (this.debugMode) {
        console.log('🔍 Analytics Event (disabled):', eventName, properties);
      }
      return;
    }

    try {
      // Validate properties
      const validatedProperties = this.validateProperties(properties);
      
      // Add automatic properties
      const enrichedProperties = {
        ...validatedProperties,
        timestamp: new Date().toISOString(),
        platform_version: '1.0.0', // TODO: Get from package.json or environment
      };

      // Send to analytics provider
      analytics?.track(eventName, enrichedProperties);

      if (this.debugMode) {
        console.log('📊 Analytics Event:', eventName, enrichedProperties);
      }
    } catch (error) {
      console.warn('Analytics event failed:', error);
      // Fail silently in production to not break user experience
    }
  }

  /**
   * Validate and sanitize event properties
   */
  private validateProperties(properties: any): any {
    const validated: any = {};

    for (const [key, value] of Object.entries(properties)) {
      // Skip undefined values
      if (value === undefined) continue;
      
      // Sanitize potentially sensitive data
      if (key.includes('email') || key.includes('phone') || key.includes('ssn')) {
        continue; // Skip PII
      }
      
      // Validate data types
      if (typeof value === 'string' && value.length > 500) {
        validated[key] = value.substring(0, 500) + '...'; // Truncate long strings
      } else if (typeof value === 'number' && !isFinite(value)) {
        continue; // Skip infinite or NaN numbers
      } else {
        validated[key] = value;
      }
    }

    return validated;
  }

  // ====================
  // Page View Events
  // ====================

  trackPageView(properties: PageViewProperties): void {
    this.sendEvent('page_view', properties);
  }

  trackNavigationClick(navItem: string, destination: string, location: string = 'header'): void {
    this.sendEvent('navigation_click', {
      nav_item: navItem,
      nav_location: location,
      destination_page: destination,
    });
  }

  // ====================
  // Authentication Events
  // ====================

  trackAuthStarted(properties: AuthEventProperties): void {
    this.sendEvent('auth_started', properties);
  }

  trackAuthCompleted(properties: AuthEventProperties): void {
    this.sendEvent('auth_completed', properties);
  }

  trackAuthFailed(properties: AuthEventProperties): void {
    this.sendEvent('auth_failed', properties);
  }

  // ====================
  // Onboarding Events
  // ====================

  trackOnboardingStarted(properties: OnboardingEventProperties): void {
    this.sendEvent('onboarding_started', properties);
  }

  trackOnboardingStepCompleted(properties: OnboardingEventProperties): void {
    this.sendEvent('onboarding_step_completed', properties);
  }

  trackOnboardingCompleted(properties: OnboardingEventProperties): void {
    this.sendEvent('onboarding_completed', properties);
  }

  // ====================
  // SWAG™ Roadmap Events
  // ====================

  trackRoadmapCalculationStarted(properties: RoadmapEventProperties): void {
    this.sendEvent('roadmap_calculation_started', properties);
  }

  trackRoadmapCalculationCompleted(properties: RoadmapEventProperties): void {
    this.sendEvent('roadmap_calculation_completed', properties);
  }

  trackScenarioComparison(baseScenario: string, comparisonScenario: string, parameterChanged: string): void {
    this.sendEvent('scenario_comparison', {
      base_scenario: baseScenario,
      comparison_scenario: comparisonScenario,
      parameter_changed: parameterChanged,
    });
  }

  trackPlanImportStarted(importMethod: string, fileType?: string): void {
    this.sendEvent('plan_import_started', {
      import_method: importMethod,
      file_type: fileType,
    });
  }

  trackPlanImportCompleted(accountsImported: number, dataAccuracy: number): void {
    this.sendEvent('plan_import_completed', {
      accounts_imported: accountsImported,
      data_accuracy: dataAccuracy,
    });
  }

  trackPlanExport(exportFormat: string, reportType: string): void {
    this.sendEvent('plan_export', {
      export_format: exportFormat,
      report_type: reportType,
    });
  }

  // ====================
  // Lead Management Events
  // ====================

  trackLeadFormStarted(properties: LeadEventProperties): void {
    this.sendEvent('lead_form_started', properties);
  }

  trackLeadFormSubmitted(properties: LeadEventProperties): void {
    this.sendEvent('lead_form_submitted', properties);
  }

  trackDemoScheduled(demoType: string, leadScore?: number): void {
    this.sendEvent('demo_scheduled', {
      demo_type: demoType,
      lead_score: leadScore,
    });
  }

  trackLeadStatusChanged(leadId: string, previousStatus: string, newStatus: string): void {
    this.sendEvent('lead_status_changed', {
      lead_id: leadId,
      previous_status: previousStatus,
      new_status: newStatus,
    });
  }

  trackLeadConverted(leadId: string, conversionType: string, leadScore?: number): void {
    this.sendEvent('lead_converted', {
      lead_id: leadId,
      conversion_type: conversionType,
      lead_score: leadScore,
    });
  }

  // ====================
  // Subscription Events
  // ====================

  trackSubscriptionUpgradeStarted(properties: SubscriptionEventProperties): void {
    this.sendEvent('subscription_upgrade_started', properties);
  }

  trackSubscriptionUpgradeCompleted(properties: SubscriptionEventProperties): void {
    this.sendEvent('subscription_upgrade_completed', properties);
  }

  trackSubscriptionCancelled(properties: SubscriptionEventProperties): void {
    this.sendEvent('subscription_cancelled', properties);
  }

  trackFeatureGateEncountered(featureName: string, userTier: string, requiredTier: string): void {
    this.sendEvent('feature_gate_encountered', {
      feature_name: featureName,
      user_tier: userTier,
      required_tier: requiredTier,
    });
  }

  // ====================
  // Document Events
  // ====================

  trackDocumentUploaded(properties: DocumentEventProperties): void {
    this.sendEvent('document_uploaded', properties);
  }

  trackDocumentShared(properties: DocumentEventProperties): void {
    this.sendEvent('document_shared', properties);
  }

  trackDocumentAccessed(documentId: string, accessMethod: string, viewDuration?: number): void {
    this.sendEvent('document_accessed', {
      document_id: documentId,
      access_method: accessMethod,
      view_duration: viewDuration,
    });
  }

  // ====================
  // Communication Events
  // ====================

  trackMeetingScheduled(meetingType: string, duration: number, participantCount: number): void {
    this.sendEvent('meeting_scheduled', {
      meeting_type: meetingType,
      meeting_duration: duration,
      participant_count: participantCount,
    });
  }

  trackMeetingCompleted(meetingId: string, actualDuration: number, followUpScheduled: boolean): void {
    this.sendEvent('meeting_completed', {
      meeting_id: meetingId,
      actual_duration: actualDuration,
      follow_up_scheduled: followUpScheduled,
    });
  }

  // ====================
  // Goal Management Events
  // ====================

  trackGoalCreated(goalType: string, goalAmount: number, timeline: number): void {
    this.sendEvent('goal_created', {
      goal_type: goalType,
      goal_amount: goalAmount,
      goal_timeline: timeline,
    });
  }

  trackGoalProgressUpdated(goalId: string, progressPercentage: number, milestoneReached: boolean): void {
    this.sendEvent('goal_progress_updated', {
      goal_id: goalId,
      progress_percentage: progressPercentage,
      milestone_reached: milestoneReached,
    });
  }

  // ====================
  // Error Events
  // ====================

  trackError(properties: ErrorEventProperties): void {
    this.sendEvent('application_error', properties);
  }

  trackPerformanceMetric(metricType: string, metricValue: number, pageName?: string): void {
    this.sendEvent('performance_metric', {
      metric_type: metricType,
      metric_value: metricValue,
      page_name: pageName,
    });
  }

  // ====================
  // Professional Network Events
  // ====================

  trackProfessionalConnection(connectionType: string, connectionSource: string): void {
    this.sendEvent('professional_connection', {
      connection_type: connectionType,
      connection_source: connectionSource,
    });
  }

  // ====================
  // Convenience Methods
  // ====================

  /**
   * Track a generic feature usage event
   */
  trackFeatureUsage(featureName: string, properties: any = {}): void {
    this.sendEvent('feature_used', {
      feature_name: featureName,
      ...properties,
    });
  }

  /**
   * Track a custom business event
   */
  trackCustomEvent(eventName: string, properties: any = {}): void {
    this.sendEvent(eventName, properties);
  }

  /**
   * Track conversion events with standardized properties
   */
  trackConversion(conversionType: string, properties: any = {}): void {
    this.sendEvent('conversion', {
      conversion_type: conversionType,
      ...properties,
    });
  }
}

// Export singleton instance
export const analyticsEvents = new AnalyticsEvents();

// Export as default for convenience
export default analyticsEvents;

// Export types for external use
export type {
  BaseEventProperties,
  PageViewProperties,
  AuthEventProperties,
  OnboardingEventProperties,
  RoadmapEventProperties,
  LeadEventProperties,
  SubscriptionEventProperties,
  DocumentEventProperties,
  ErrorEventProperties,
};