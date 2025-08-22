import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';
import { analytics } from '@/lib/analytics';

interface UseSessionTimeoutOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  enabled?: boolean;
}

export const useSessionTimeout = ({
  timeoutMinutes = 15,
  warningMinutes = 2,
  enabled = true
}: UseSessionTimeoutOptions = {}) => {
  const { user } = useAuth();
  const { logout } = useUser();
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimeout = () => {
    if (!enabled || !user) return;

    lastActivityRef.current = Date.now();

    // Clear existing timeouts
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);

    // Set warning timeout
    warningRef.current = setTimeout(() => {
      toast({
        title: "Session Expiring",
        description: `Your session will expire in ${warningMinutes} minutes due to inactivity.`,
        variant: "destructive",
      });
      
      analytics.trackSecurityEvent('session_warning', {
        severity: 'medium',
        warning_minutes: warningMinutes,
        user_id: user.id
      });
    }, (timeoutMinutes - warningMinutes) * 60 * 1000);

    // Set logout timeout
    timeoutRef.current = setTimeout(() => {
      analytics.trackSecurityEvent('session_timeout', {
        severity: 'medium',
        timeout_minutes: timeoutMinutes,
        user_id: user.id,
        last_activity: lastActivityRef.current
      });

      toast({
        title: "Session Expired",
        description: "You have been logged out due to inactivity.",
        variant: "destructive",
      });

      logout();
    }, timeoutMinutes * 60 * 1000);
  };

  useEffect(() => {
    if (!enabled || !user) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      resetTimeout();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initialize timeout
    resetTimeout();

    return () => {
      // Cleanup
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [user, enabled, timeoutMinutes, warningMinutes]);

  return {
    resetTimeout,
    lastActivity: lastActivityRef.current
  };
};