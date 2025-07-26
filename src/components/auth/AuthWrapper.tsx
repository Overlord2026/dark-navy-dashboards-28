
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { useMFAEnforcement } from '@/hooks/useMFAEnforcement';
import { MFAEnforcement } from '@/components/security/MFAEnforcement';
import { Card, CardContent } from "@/components/ui/card";
import { hasRoleAccess, getRoleDisplayName } from '@/utils/roleHierarchy';
import { useRoleContext } from '@/context/RoleContext';
import type { UserRole } from '@/utils/roleHierarchy';

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
}

export function AuthWrapper({ 
  children, 
  requireAuth = false,
  allowedRoles = []
}: AuthWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { userProfile } = useUser();
  const { getCurrentRole } = useRoleContext();
  const mfaEnforcement = useMFAEnforcement(false); // Don't auto-redirect, we'll handle it here

  // Show loading state
  if (isLoading || mfaEnforcement.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Authentication Required</h2>
            <p className="text-muted-foreground mb-4">Please sign in to access this page.</p>
            <a 
              href="/auth" 
              className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Sign In
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role-based access using hierarchy system
  if (allowedRoles.length > 0 && userProfile) {
    const currentRole = getCurrentRole();
    if (!hasRoleAccess(currentRole, allowedRoles)) {
      console.warn('Access denied for user:', {
        userId: userProfile.id,
        actualRole: userProfile.role,
        currentRole: currentRole,
        requiredRoles: allowedRoles,
        page: window.location.pathname
      });
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don't have permission to access this page.
            </p>
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
              <p><strong>Your Role:</strong> {getRoleDisplayName(currentRole)}</p>
              <p><strong>Required Roles:</strong> {allowedRoles.map(getRoleDisplayName).join(', ')}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
    }
  }

  // Check MFA enforcement for authenticated users
  if (isAuthenticated && (mfaEnforcement.requiresMFA && !mfaEnforcement.mfaEnabled)) {
    // If access should be blocked, show only MFA enforcement
    if (mfaEnforcement.shouldBlock) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <MFAEnforcement />
          </div>
        </div>
      );
    }
    
    // If in grace period, show warning above content
    return (
      <div className="min-h-screen">
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 p-4">
          <div className="max-w-7xl mx-auto">
            <MFAEnforcement />
          </div>
        </div>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    );
  }

  // Render children normally
  return <>{children}</>;
}
