import { supabase } from '@/integrations/supabase/client';
import { analytics } from '@/lib/analytics';

export interface SecurityEvent {
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resourceType?: string;
  resourceId?: string;
  action?: string;
  outcome?: 'success' | 'failure' | 'blocked';
  metadata?: Record<string, any>;
}

export interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  blockedAttempts: number;
  mfaCompliance: number;
  lastIncident?: Date;
}

class SecurityMonitoringService {
  private eventBuffer: SecurityEvent[] = [];
  private bufferFlushInterval = 30000; // 30 seconds
  private maxBufferSize = 100;

  constructor() {
    // Set up periodic buffer flush
    setInterval(() => {
      this.flushEventBuffer();
    }, this.bufferFlushInterval);

    // Monitor page visibility to flush on page hide
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.flushEventBuffer();
      }
    });
  }

  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      // Add to buffer for batch processing
      this.eventBuffer.push({
        ...event,
        metadata: {
          ...event.metadata,
          timestamp: Date.now(),
          user_agent: navigator.userAgent,
          url: window.location.href
        }
      });

      // Flush immediately for critical events
      if (event.severity === 'critical') {
        await this.flushEventBuffer();
      }

      // Flush if buffer is full
      if (this.eventBuffer.length >= this.maxBufferSize) {
        await this.flushEventBuffer();
      }

      // Track in analytics
      analytics.trackSecurityEvent(event.eventType, { severity: event.severity, ...event.metadata });

    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  private async flushEventBuffer(): Promise<void> {
    if (this.eventBuffer.length === 0) {
      return;
    }

    const eventsToFlush = [...this.eventBuffer];
    this.eventBuffer = [];

    try {
      // Send events to edge function for processing
      await supabase.functions.invoke('log-security-event', {
        body: { events: eventsToFlush }
      });
    } catch (error) {
      console.error('Failed to flush security events:', error);
      // Put events back in buffer for retry
      this.eventBuffer.unshift(...eventsToFlush);
    }
  }

  async getSecurityMetrics(timeframe: 'hour' | 'day' | 'week' = 'day'): Promise<SecurityMetrics> {
    try {
      const { data, error } = await supabase.functions.invoke('get-security-metrics', {
        body: { timeframe }
      });

      if (error) {
        throw error;
      }

      return data as SecurityMetrics;
    } catch (error) {
      console.error('Failed to get security metrics:', error);
      return {
        totalEvents: 0,
        criticalEvents: 0,
        blockedAttempts: 0,
        mfaCompliance: 0
      };
    }
  }

  async reportSecurityIncident(
    incidentType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    description: string,
    affectedResources: string[] = [],
    metadata: Record<string, any> = {}
  ): Promise<void> {
    await this.logSecurityEvent({
      eventType: 'security_incident',
      severity,
      metadata: {
        incident_type: incidentType,
        description,
        affected_resources: affectedResources,
        ...metadata
      }
    });

    // For critical incidents, also create an incident record
    if (severity === 'critical') {
      try {
        await supabase.functions.invoke('create-security-incident', {
          body: {
            incident_type: incidentType,
            severity,
            description,
            affected_resources: affectedResources,
            metadata
          }
        });
      } catch (error) {
        console.error('Failed to create security incident record:', error);
      }
    }
  }

  async validateSecurityConfig(): Promise<{
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      // Check if user has proper authentication setup
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        issues.push('User not authenticated');
        return { isValid: false, issues, recommendations };
      }

      // Check MFA status for privileged users
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, two_factor_enabled')
        .eq('id', user.id)
        .single();

      if (profile) {
        const privilegedRoles = ['admin', 'tenant_admin', 'system_administrator'];
        
        if (privilegedRoles.includes(profile.role) && !profile.two_factor_enabled) {
          issues.push('MFA not enabled for privileged account');
          recommendations.push('Enable multi-factor authentication for enhanced security');
        }
      }

      // Check session security
      const sessionAge = Date.now() - new Date(user.created_at).getTime();
      const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (sessionAge > maxSessionAge) {
        recommendations.push('Consider refreshing your session for security');
      }

      // Check for secure connection
      if (!window.location.protocol.startsWith('https')) {
        issues.push('Connection is not secure (HTTP instead of HTTPS)');
        recommendations.push('Use HTTPS for secure communication');
      }

      return {
        isValid: issues.length === 0,
        issues,
        recommendations
      };

    } catch (error) {
      console.error('Failed to validate security config:', error);
      return {
        isValid: false,
        issues: ['Failed to validate security configuration'],
        recommendations: ['Please refresh the page and try again']
      };
    }
  }

  async performSecurityHealthCheck(): Promise<{
    score: number;
    status: 'excellent' | 'good' | 'fair' | 'poor';
    details: Record<string, any>;
  }> {
    let score = 100;
    const details: Record<string, any> = {};

    try {
      const config = await this.validateSecurityConfig();
      
      // Deduct points for issues
      score -= config.issues.length * 20;
      details.security_issues = config.issues;
      details.recommendations = config.recommendations;

      // Check recent security events
      const metrics = await this.getSecurityMetrics('day');
      
      if (metrics.criticalEvents > 0) {
        score -= 30;
        details.critical_events_today = metrics.criticalEvents;
      }

      if (metrics.blockedAttempts > 10) {
        score -= 10;
        details.high_blocked_attempts = true;
      }

      details.mfa_compliance = metrics.mfaCompliance;
      if (metrics.mfaCompliance < 80) {
        score -= 15;
      }

      // Determine status based on score
      let status: 'excellent' | 'good' | 'fair' | 'poor';
      if (score >= 90) status = 'excellent';
      else if (score >= 70) status = 'good';
      else if (score >= 50) status = 'fair';
      else status = 'poor';

      return {
        score: Math.max(0, score),
        status,
        details
      };

    } catch (error) {
      console.error('Failed to perform security health check:', error);
      return {
        score: 0,
        status: 'poor',
        details: {
          error: 'Failed to perform security health check'
        }
      };
    }
  }

  // Clean up resources
  destroy(): void {
    this.flushEventBuffer();
  }
}

export const securityMonitoringService = new SecurityMonitoringService();

// Export for cleanup on app unmount
export const cleanupSecurityMonitoring = () => {
  securityMonitoringService.destroy();
};