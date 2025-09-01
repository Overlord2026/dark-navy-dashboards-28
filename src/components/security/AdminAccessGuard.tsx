import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';

interface AdminAccessGuardProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'system_administrator' | 'tenant_admin';
  requiredRoles?: string[];
  fallback?: React.ReactNode;
  logAccess?: boolean;
}

interface AccessVerificationResult {
  hasAccess: boolean;
  verifiedRole: string | null;
  sessionValid: boolean;
  mfaVerified: boolean;
}

export const AdminAccessGuard: React.FC<AdminAccessGuardProps> = ({
  children,
  requiredRole,
  requiredRoles = requiredRole ? [requiredRole] : ['admin', 'system_administrator', 'tenant_admin'],
  fallback,
  logAccess = true
}) => {
  const { user, session, userProfile } = useAuth();
  const { hasAnyRole, getUserRole } = useRoleAccess();
  const [verification, setVerification] = useState<AccessVerificationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const verifyAdminAccess = async (): Promise<AccessVerificationResult> => {
    try {
      // Check if user is authenticated
      if (!user || !session || !userProfile) {
        return {
          hasAccess: false,
          verifiedRole: null,
          sessionValid: false,
          mfaVerified: false
        };
      }

      // Verify session is still valid with server
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !currentSession) {
        return {
          hasAccess: false,
          verifiedRole: null,
          sessionValid: false,
          mfaVerified: false
        };
      }

      // Server-side role verification - critical security check
      const { data: serverProfile, error: profileError } = await supabase
        .from('profiles')
        .select('role, two_factor_enabled')
        .eq('id', user.id)
        .single();

      if (profileError || !serverProfile) {
        throw new Error('Failed to verify user role from server');
      }

      // Verify the role from server matches client-side role
      if (serverProfile.role !== userProfile.role) {
        throw new Error('Role mismatch detected - possible session hijacking');
      }

      // Check if user has required role
      const hasRequiredRole = requiredRoles.includes(serverProfile.role);
      
      // For high-privilege operations, verify MFA if enabled
      const mfaVerified = !serverProfile.two_factor_enabled || 
        (session.user.app_metadata?.mfa_verified === true);

      // Log admin access attempt if enabled
      if (logAccess) {
        await logAdminAccessAttempt(
          hasRequiredRole,
          serverProfile.role,
          requiredRoles
        );
      }

      return {
        hasAccess: hasRequiredRole,
        verifiedRole: serverProfile.role,
        sessionValid: true,
        mfaVerified
      };

    } catch (error) {
      console.error('Admin access verification error:', error);
      
      // Log security incident
      if (logAccess) {
        await logSecurityIncident(error instanceof Error ? error.message : 'Unknown error');
      }
      
      return {
        hasAccess: false,
        verifiedRole: null,
        sessionValid: false,
        mfaVerified: false
      };
    }
  };

  const logAdminAccessAttempt = async (
    accessGranted: boolean,
    userRole: string,
    requiredRoles: string[]
  ) => {
    try {
      await supabase.functions.invoke('log-security-event', {
        body: {
          event_type: 'admin_access_attempt',
          severity: accessGranted ? 'info' : 'warning',
          resource_type: 'admin_interface',
          action_performed: 'access_attempt',
          outcome: accessGranted ? 'granted' : 'denied',
          metadata: {
            user_role: userRole,
            required_roles: requiredRoles,
            timestamp: new Date().toISOString(),
            ip_address: 'client_side', // Would be better to get from server
            user_agent: navigator.userAgent
          }
        }
      });
    } catch (error) {
      console.error('Failed to log admin access attempt:', error);
    }
  };

  const logSecurityIncident = async (error: string) => {
    try {
      await supabase.functions.invoke('log-security-event', {
        body: {
          event_type: 'security_incident',
          severity: 'high',
          resource_type: 'admin_interface',
          action_performed: 'access_verification_failed',
          outcome: 'blocked',
          metadata: {
            error_message: error,
            timestamp: new Date().toISOString(),
            potential_threat: 'session_hijacking_or_privilege_escalation'
          }
        }
      });
    } catch (logError) {
      console.error('Failed to log security incident:', logError);
    }
  };

  useEffect(() => {
    const checkAccess = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const result = await verifyAdminAccess();
        setVerification(result);
        
        if (!result.hasAccess && result.verifiedRole) {
          setError(`Access denied. Required: ${requiredRoles.join(' or ')}, Current: ${result.verifiedRole}`);
        } else if (!result.sessionValid) {
          setError('Session invalid. Please log in again.');
        } else if (!result.mfaVerified) {
          setError('Multi-factor authentication required for admin access.');
        }
      } catch (err) {
        setError('Security verification failed. Access denied.');
        setVerification({
          hasAccess: false,
          verifiedRole: null,
          sessionValid: false,
          mfaVerified: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [user, session, userProfile, requiredRoles.join(',')]);

  // Loading state
  if (isLoading) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Verifying admin access...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Access denied
  if (!verification?.hasAccess || error) {
    const deniedContent = (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Shield className="h-5 w-5" />
            Access Denied
          </CardTitle>
          <CardDescription>
            You don't have permission to view this content.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="mt-4 text-sm text-muted-foreground">
            <p>Required role: {requiredRoles.join(' or ')}</p>
            {verification?.verifiedRole && (
              <p>Your role: {verification.verifiedRole}</p>
            )}
          </div>
        </CardContent>
      </Card>
    );

    return fallback || deniedContent;
  }

  // Access granted
  return <>{children}</>;
};

// Hook for programmatic admin access checking
export const useAdminAccess = (requiredRoles: string[] = ['admin', 'system_administrator', 'tenant_admin']) => {
  const { user, session, userProfile } = useAuth();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user || !session || !userProfile) {
        setHasAccess(false);
        setIsChecking(false);
        return;
      }

      try {
        // Server-side verification
        const { data: serverProfile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error || !serverProfile) {
          setHasAccess(false);
        } else {
          setHasAccess(requiredRoles.includes(serverProfile.role));
        }
      } catch (error) {
        console.error('Admin access check error:', error);
        setHasAccess(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAccess();
  }, [user, session, userProfile, requiredRoles.join(',')]);

  return { hasAccess, isChecking };
};