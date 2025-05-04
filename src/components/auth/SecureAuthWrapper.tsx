
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { auditLog } from "@/services/auditLog/auditLogService";
import { logger } from "@/services/logging/loggingService";

interface SecureAuthWrapperProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'advisor' | 'admin' | 'system_administrator';
  requireMFA?: boolean;
}

export function SecureAuthWrapper({ 
  children, 
  requiredRole, 
  requireMFA = true 
}: SecureAuthWrapperProps) {
  const { userProfile, isAuthenticated } = useUser();
  const { isAuthenticated: authContextAuthenticated } = useAuth();
  const location = useLocation();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [roleChecked, setRoleChecked] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);

  // Initialize and check auth state
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Get current session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Log access attempt for audit trail
          auditLog.log(
            session.user.id,
            'login',
            'success',
            {
              userName: userProfile?.name || session.user.email,
              userRole: userProfile?.role,
              ipAddress: 'client-ip', // In production, this would be captured server-side
              resourceId: location.pathname,
              resourceType: 'page_access',
              details: {
                action: `Accessing ${location.pathname}`,
                timestamp: new Date().toISOString()
              }
            }
          );
        } else if (location.pathname !== '/secure-login') {
          // Log failed access attempt
          logger.warning('Unauthenticated access attempt', {
            path: location.pathname,
            timestamp: new Date().toISOString()
          }, 'SecureAuthWrapper');
        }

        setSessionChecked(true);
      } catch (error) {
        logger.error('Error checking session:', error, 'SecureAuthWrapper');
        setSessionChecked(true);
      }
    };

    checkSession();

    // Set up listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          // Log the sign out event
          logger.info('User signed out', {
            timestamp: new Date().toISOString()
          }, 'SecureAuthWrapper');
          
          // Force navigation to login page
          window.location.href = '/secure-login';
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [location.pathname, userProfile]);

  // Check role requirements
  useEffect(() => {
    if (requiredRole && userProfile) {
      const hasRole = userProfile.role === requiredRole || 
                     (userProfile.permissions && userProfile.permissions.includes('all'));
      
      setHasRequiredRole(hasRole);
      
      if (!hasRole) {
        // Log unauthorized access attempt
        auditLog.log(
          userProfile.id,
          'permission_change',
          'failure',
          {
            userName: userProfile.name || userProfile.email,
            userRole: userProfile.role,
            resourceId: location.pathname,
            resourceType: 'page_access',
            details: {
              action: `Unauthorized access attempt to ${location.pathname}`,
              requiredRole: requiredRole
            },
            reason: 'Insufficient permissions'
          }
        );
        
        toast.error("Access denied", { 
          description: `You need ${requiredRole} permissions to access this page.`,
          duration: 5000
        });
      }
      
      setRoleChecked(true);
    } else if (!requiredRole) {
      setHasRequiredRole(true);
      setRoleChecked(true);
    } else {
      setRoleChecked(true);
    }
  }, [requiredRole, userProfile, location.pathname]);

  // MFA verification would be implemented here
  // For now, we'll just simulate it as already verified
  useEffect(() => {
    if (requireMFA && isAuthenticated) {
      // In a real implementation, check if user has completed MFA
      // For now, we'll assume MFA is complete
      setMfaRequired(false);
    } else {
      setMfaRequired(false);
    }
  }, [requireMFA, isAuthenticated]);

  // Security verification - session timeout
  useEffect(() => {
    let inactivityTimer: number;
    
    const resetInactivityTimer = () => {
      window.clearTimeout(inactivityTimer);
      
      // 30 minutes session timeout - would be configurable based on security policy
      inactivityTimer = window.setTimeout(() => {
        logger.info('Session timeout due to inactivity', {
          timestamp: new Date().toISOString()
        }, 'SecureAuthWrapper');
        
        toast.warning("Session expired", { 
          description: "Your session has expired due to inactivity.",
          duration: 5000
        });
        
        supabase.auth.signOut().then(() => {
          window.location.href = '/secure-login';
        });
      }, 30 * 60 * 1000);
    };
    
    // Start the timer
    resetInactivityTimer();
    
    // Reset the timer on user activity
    const events = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetInactivityTimer);
    });
    
    return () => {
      window.clearTimeout(inactivityTimer);
      events.forEach(event => {
        document.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, []);

  if (!sessionChecked) {
    return <div>Verifying your secure session...</div>;
  }

  if (!isAuthenticated || !authContextAuthenticated) {
    // Redirect to login and preserve the intended destination
    return <Navigate to={`/secure-login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (mfaRequired) {
    // In a real implementation, this would redirect to MFA verification
    return <Navigate to="/mfa-verification" replace />;
  }

  if (!roleChecked) {
    return <div>Verifying your access permissions...</div>;
  }

  if (requiredRole && !hasRequiredRole) {
    // Insufficient permissions
    return <Navigate to="/unauthorized" replace />;
  }

  // All security checks passed
  return <>{children}</>;
}
