import React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  requireApprovalAccess?: boolean;
  fallback?: React.ReactNode;
}

export function RoleGuard({ 
  children, 
  allowedRoles, 
  requireApprovalAccess = false,
  fallback 
}: RoleGuardProps) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // TODO: Replace with actual org_members query
      // For now, mock role checking
      const mockRole = localStorage.getItem('mock_user_role') || 'Finance';
      setUserRole(mockRole);
      
      const hasRoleAccess = allowedRoles.includes(mockRole);
      const hasApprovalAccess = !requireApprovalAccess || ['Controller', 'CFO'].includes(mockRole);
      
      setHasAccess(hasRoleAccess && hasApprovalAccess);
    } catch (error) {
      console.error('Error checking user role:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Alert className="m-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Access denied. Required role: {allowedRoles.join(', ')}
          {requireApprovalAccess && ' with approval privileges'}
          {userRole && ` (Current role: ${userRole})`}
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}

// Hook for checking user permissions
export function useUserRole() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkRole();
  }, []);

  const checkRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // TODO: Replace with actual org_members query
      const mockRole = localStorage.getItem('mock_user_role') || 'Finance';
      setUserRole(mockRole);
    } catch (error) {
      console.error('Error checking user role:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (roles: string[]) => userRole ? roles.includes(userRole) : false;
  const canApprove = () => userRole ? ['Controller', 'CFO'].includes(userRole) : false;

  return {
    userRole,
    loading,
    hasRole,
    canApprove
  };
}