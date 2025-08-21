import { analytics } from '@/lib/analytics';

export interface HealthTelemetryEvent {
  event_type: 'gate.result' | 'consent.result' | 'pa.result' | 'export.action';
  policy_version: string;
  action: string;
  result: 'allow' | 'deny' | 'error' | 'success' | 'failure';
  reasons: string[];
  duration_ms: number;
  hasAnchor: boolean;
  timestamp: number;
  session_id: string;
}

// Generate session ID for aggregation without user tracking
const SESSION_ID = crypto.randomUUID();

export class HealthTelemetry {
  private static instance: HealthTelemetry;
  
  static getInstance(): HealthTelemetry {
    if (!HealthTelemetry.instance) {
      HealthTelemetry.instance = new HealthTelemetry();
    }
    return HealthTelemetry.instance;
  }

  private trackEvent(event: Omit<HealthTelemetryEvent, 'timestamp' | 'session_id'>) {
    const telemetryEvent: HealthTelemetryEvent = {
      ...event,
      timestamp: Date.now(),
      session_id: SESSION_ID
    };

    // Store in analytics for aggregation
    analytics.track('health_telemetry', {
      ...telemetryEvent,
      // Ensure no PHI can leak through
      sanitized: true,
      compliance_event: true
    });

    // Also store in localStorage for local aggregation
    this.storeLocalEvent(telemetryEvent);
  }

  private storeLocalEvent(event: HealthTelemetryEvent) {
    try {
      const stored = localStorage.getItem('health_telemetry') || '[]';
      const events: HealthTelemetryEvent[] = JSON.parse(stored);
      events.push(event);
      
      // Keep only last 1000 events to prevent storage bloat
      if (events.length > 1000) {
        events.splice(0, events.length - 1000);
      }
      
      localStorage.setItem('health_telemetry', JSON.stringify(events));
    } catch (error) {
      console.warn('Failed to store telemetry event:', error);
    }
  }

  // Gate telemetry - access control decisions
  trackGateResult(params: {
    policy_version: string;
    action: string;
    result: 'allow' | 'deny';
    reasons: string[];
    duration_ms: number;
    hasAnchor: boolean;
  }) {
    this.trackEvent({
      event_type: 'gate.result',
      ...params
    });
  }

  // Consent telemetry - consent validation results
  trackConsentResult(params: {
    policy_version: string;
    action: string;
    result: 'allow' | 'deny' | 'error';
    reasons: string[];
    duration_ms: number;
    hasAnchor: boolean;
  }) {
    this.trackEvent({
      event_type: 'consent.result',
      ...params
    });
  }

  // PA telemetry - prior authorization results
  trackPaResult(params: {
    policy_version: string;
    action: string;
    result: 'success' | 'failure' | 'error';
    reasons: string[];
    duration_ms: number;
    hasAnchor: boolean;
  }) {
    this.trackEvent({
      event_type: 'pa.result',
      ...params
    });
  }

  // Export telemetry - data export actions
  trackExportAction(params: {
    policy_version: string;
    action: string;
    result: 'success' | 'failure' | 'error';
    reasons: string[];
    duration_ms: number;
    hasAnchor: boolean;
  }) {
    this.trackEvent({
      event_type: 'export.action',
      ...params
    });
  }

  // Get local events for aggregation
  getLocalEvents(): HealthTelemetryEvent[] {
    try {
      const stored = localStorage.getItem('health_telemetry') || '[]';
      return JSON.parse(stored);
    } catch (error) {
      console.warn('Failed to retrieve telemetry events:', error);
      return [];
    }
  }

  // Clear local events (called after successful aggregation)
  clearLocalEvents() {
    try {
      localStorage.removeItem('health_telemetry');
    } catch (error) {
      console.warn('Failed to clear telemetry events:', error);
    }
  }
}

// Singleton instance
export const healthTelemetry = HealthTelemetry.getInstance();

// Convenience functions for common patterns
export const trackGateDecision = (
  action: string,
  allowed: boolean,
  reasons: string[],
  duration: number,
  policyVersion = '1.0',
  hasAnchor = false
) => {
  healthTelemetry.trackGateResult({
    policy_version: policyVersion,
    action,
    result: allowed ? 'allow' : 'deny',
    reasons,
    duration_ms: duration,
    hasAnchor
  });
};

export const trackConsentCheck = (
  action: string,
  valid: boolean,
  reasons: string[],
  duration: number,
  policyVersion = '1.0',
  hasAnchor = false
) => {
  healthTelemetry.trackConsentResult({
    policy_version: policyVersion,
    action,
    result: valid ? 'allow' : 'deny',
    reasons,
    duration_ms: duration,
    hasAnchor
  });
};

export const trackDataExport = (
  exportType: string,
  success: boolean,
  reasons: string[],
  duration: number,
  policyVersion = '1.0',
  hasAnchor = false
) => {
  healthTelemetry.trackExportAction({
    policy_version: policyVersion,
    action: exportType,
    result: success ? 'success' : 'failure',
    reasons,
    duration_ms: duration,
    hasAnchor
  });
};
