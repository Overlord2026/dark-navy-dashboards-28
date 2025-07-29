import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useRoleContext } from '@/context/RoleContext';
import { useUser } from '@/context/UserContext';
import { hasRoleAccess } from '@/utils/roleHierarchy';
import { useSecurityMonitoring } from '@/hooks/useSecurityMonitoring';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  requiredTier?: 'basic' | 'premium';
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  requiredTier,
  fallbackPath = '/client-dashboard' 
}: ProtectedRouteProps) {
  const { userProfile } = useUser();
  const { monitorAuthEvent } = useSecurityMonitoring();

  // REFACTORED: Always use actual userProfile - no dev bypass
  const currentRole = userProfile?.role || 'client';
  const currentTier = userProfile?.client_tier || 'basic';

  // Check role access
  const hasRole = hasRoleAccess(currentRole, allowedRoles);
  
  // Check tier access if required
  const hasTier = !requiredTier || currentTier === requiredTier || 
    (requiredTier === 'basic' && currentTier === 'premium'); // Premium includes basic

  // Monitor access attempts
  useEffect(() => {
    if (userProfile) {
      const accessGranted = hasRole && hasTier;
      monitorAuthEvent(
        'route_access_attempt',
        accessGranted ? 'success' : 'blocked',
        {
          route_roles: allowedRoles,
          user_role: currentRole,
          required_tier: requiredTier,
          user_tier: currentTier,
          fallback_path: fallbackPath
        }
      );
    }
  }, [userProfile, hasRole, hasTier, allowedRoles, currentRole, requiredTier, currentTier, fallbackPath, monitorAuthEvent]);

  if (!hasRole || !hasTier) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}

interface ClientTierGuardProps {
  children: React.ReactNode;
  requiredTier: 'premium';
  fallback?: React.ReactNode;
}

export function ClientTierGuard({ children, requiredTier, fallback }: ClientTierGuardProps) {
  const { userProfile } = useUser();

  // REFACTORED: Always use actual userProfile - no dev bypass
  const currentTier = userProfile?.client_tier || 'basic';
  const currentRole = userProfile?.role || 'client';

  // Only apply tier restrictions to client roles
  if (!currentRole.includes('client')) {
    return <>{children}</>;
  }

  if (currentTier !== requiredTier) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { userProfile } = useUser();

  // REFACTORED: Always use actual userProfile - no dev bypass
  const currentRole = userProfile?.role || 'client';

  const hasAccess = hasRoleAccess(currentRole, allowedRoles);

  if (!hasAccess) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}