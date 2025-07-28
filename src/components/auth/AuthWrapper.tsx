
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useUser } from '@/context/UserContext';
import { useMFAEnforcement } from '@/hooks/useMFAEnforcement';
import { MFAEnforcement } from '@/components/security/MFAEnforcement';
import { Card, CardContent } from "@/components/ui/card";
import { hasRoleAccess, getRoleDisplayName } from '@/utils/roleHierarchy';
import { useRoleContext } from '@/context/RoleContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import type { UserRole } from '@/utils/roleHierarchy';

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: (UserRole | string)[];
}

export function AuthWrapper({ 
  children, 
  requireAuth = false,
  allowedRoles = []
}: AuthWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { userProfile } = useUser();
  const { getCurrentRole, getCurrentClientTier, isDevMode, emulatedRole } = useRoleContext();
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
  if (allowedRoles.length > 0) {
    // REFACTORED: Always use actual userProfile - no dev bypass
    const currentRole = userProfile?.role || 'client';
    const currentTier = userProfile?.client_tier || 'basic';
    
    // For client premium, check if the role is client and tier is premium
    let effectiveRole: string = currentRole;
    if (currentRole === 'client' && currentTier === 'premium') {
      effectiveRole = 'client_premium';
    }
    
    // REFACTORED: Removed dev mode bypass - always enforce access control
    const shouldAllowAccess = hasRoleAccess(effectiveRole, allowedRoles);
    
    if (!shouldAllowAccess) {
      console.warn('Access denied for user:', {
        userId: userProfile?.id || 'anonymous',
        actualRole: userProfile?.role || 'none',
        currentRole: currentRole,
        effectiveRole: effectiveRole,
        clientTier: currentTier,
        requiredRoles: allowedRoles,
        page: window.location.pathname,
        isProductionMode: true
      });
    
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-2" />
                <h2 className="text-lg font-semibold">Access Denied</h2>
              </div>
              
              <p className="text-muted-foreground mb-4">
                You don't have permission to access this page.
              </p>
              
              <Alert className="text-left">
                <AlertDescription className="space-y-2">
                  <div>
                    <strong>Session Role:</strong> {effectiveRole === 'client_premium' ? 'Client Premium' : getRoleDisplayName(currentRole as UserRole)}
                    {currentRole === 'client' && currentTier && (
                      <span className="text-muted-foreground ml-1">
                        ({currentTier} tier)
                      </span>
                    )}
                  </div>
                  <div>
                    <strong>Required Roles:</strong> {allowedRoles.map(role => 
                      role === 'client_premium' ? 'Client Premium' : getRoleDisplayName(role as UserRole)
                    ).join(', ')}
                  </div>
                  <div className="text-xs text-muted-foreground pt-2 border-t">
                    <strong>Production Mode:</strong> Access controlled by actual user session role
                  </div>
                </AlertDescription>
              </Alert>
              
              <div className="mt-4">
                <a 
                  href="/"
                  className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Return Home
                </a>
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
