import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { analytics } from '@/lib/analytics';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resourceType?: string;
  resourceId?: string;
  action?: string;
  outcome?: 'success' | 'failure' | 'blocked';
  metadata?: Record<string, any>;
}

export const useSecurityMonitoring = () => {
  const { user } = useAuth();

  const logSecurityEvent = async (event: SecurityEvent) => {
    if (!user) return;

    try {
      // Log to analytics
      analytics.trackSecurityEvent(event.eventType, event.severity, {
        resource_type: event.resourceType,
        resource_id: event.resourceId,
        action: event.action,
        outcome: event.outcome,
        user_id: user.id,
        ...event.metadata
      });

      // Log to database via edge function for server-side audit trail
      await supabase.functions.invoke('log-security-event', {
        body: {
          event_type: event.eventType,
          severity: event.severity,
          resource_type: event.resourceType,
          resource_id: event.resourceId,
          action_performed: event.action,
          outcome: event.outcome || 'success',
          metadata: event.metadata || {}
        }
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  const monitorFileAccess = (filePath: string, bucket: string, action: 'upload' | 'download' | 'view' | 'delete') => {
    logSecurityEvent({
      eventType: 'file_access',
      severity: action === 'delete' ? 'high' : 'medium',
      resourceType: 'file',
      resourceId: filePath,
      action,
      metadata: { bucket, file_path: filePath }
    });
  };

  const monitorDataExport = (exportType: string, recordCount?: number) => {
    logSecurityEvent({
      eventType: 'data_export',
      severity: 'high',
      resourceType: 'data_export',
      action: 'export_requested',
      metadata: { export_type: exportType, record_count: recordCount }
    });
  };

  const monitorAdminAction = (action: string, targetUserId?: string, changes?: Record<string, any>) => {
    logSecurityEvent({
      eventType: 'admin_action',
      severity: 'critical',
      resourceType: 'user_management',
      resourceId: targetUserId,
      action,
      metadata: { changes, target_user_id: targetUserId }
    });
  };

  const monitorAuthEvent = (action: string, outcome: 'success' | 'failure' | 'blocked', metadata?: Record<string, any>) => {
    logSecurityEvent({
      eventType: 'authentication',
      severity: outcome === 'failure' ? 'medium' : 'low',
      resourceType: 'auth',
      action,
      outcome,
      metadata
    });
  };

  // Monitor suspicious activities
  useEffect(() => {
    if (!user) return;

    const detectSuspiciousActivity = () => {
      // Monitor for rapid API calls (potential abuse)
      const apiCallCount = sessionStorage.getItem('api_call_count') || '0';
      const currentCount = parseInt(apiCallCount) + 1;
      const timeWindow = sessionStorage.getItem('api_call_window') || Date.now().toString();
      
      if (Date.now() - parseInt(timeWindow) > 60000) {
        // Reset counter every minute
        sessionStorage.setItem('api_call_count', '1');
        sessionStorage.setItem('api_call_window', Date.now().toString());
      } else {
        sessionStorage.setItem('api_call_count', currentCount.toString());
        
        if (currentCount > 100) {
          logSecurityEvent({
            eventType: 'suspicious_activity',
            severity: 'high',
            action: 'rapid_api_calls',
            metadata: { call_count: currentCount, time_window: '1_minute' }
          });
        }
      }
    };

    // Monitor page visibility changes (potential screen recording detection)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        logSecurityEvent({
          eventType: 'session_activity',
          severity: 'low',
          action: 'tab_hidden',
          metadata: { timestamp: Date.now() }
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Set up periodic suspicious activity detection
    const suspiciousActivityInterval = setInterval(detectSuspiciousActivity, 10000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(suspiciousActivityInterval);
    };
  }, [user]);

  return {
    logSecurityEvent,
    monitorFileAccess,
    monitorDataExport,
    monitorAdminAction,
    monitorAuthEvent
  };
};