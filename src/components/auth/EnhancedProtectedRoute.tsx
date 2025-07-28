import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';
import { hasRoleAccess } from '@/utils/roleHierarchy';

interface EnhancedProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  requireMFA?: boolean;
  sessionTimeoutMinutes?: number;
  enableSecurityMonitoring?: boolean;
}

export const EnhancedProtectedRoute: React.FC<EnhancedProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  requireMFA = false,
  sessionTimeoutMinutes = 15,
  enableSecurityMonitoring = true
}) => {
  const { user, session, isLoading } = useAuth();
  const { userProfile } = useUser();
  const { monitorAuthEvent } = useSecurityMonitoring();

  // Enable session timeout
  useSessionTimeout({
    timeoutMinutes: sessionTimeoutMinutes,
    enabled: !!user
  });

  useEffect(() => {
    if (user && userProfile) {
      // Log successful route access
      monitorAuthEvent('route_access', 'success', {
        route: window.location.pathname,
        user_role: userProfile.role,
        required_role: requiredRole
      });
    }
  }, [user, userProfile, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user || !session) {
    return <Navigate to="/auth" replace />;
  }

  // Check role-based access
  if (requiredRole && userProfile) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!hasRoleAccess(userProfile.role, allowedRoles)) {
      // Log unauthorized access attempt
      monitorAuthEvent('unauthorized_access', 'blocked', {
        route: window.location.pathname,
        user_role: userProfile.role,
        required_roles: allowedRoles
      });
      
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check MFA requirement
  if (requireMFA && userProfile && !userProfile.twoFactorEnabled) {
    // Log MFA requirement not met
    monitorAuthEvent('mfa_required', 'blocked', {
      route: window.location.pathname,
      user_role: userProfile.role
    });
    
    return <Navigate to="/settings/security" replace />;
  }

  return <>{children}</>;
};