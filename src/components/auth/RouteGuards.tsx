import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRoleContext } from '@/context/RoleContext';
import { useUser } from '@/context/UserContext';
import { hasRoleAccess } from '@/utils/roleHierarchy';

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
  const { getCurrentRole, getCurrentClientTier, isDevMode } = useRoleContext();
  const { userProfile } = useUser();

  // In dev mode, always use the emulated role and tier
  const currentRole = isDevMode ? getCurrentRole() : (userProfile?.role || 'client');
  const currentTier = isDevMode ? getCurrentClientTier() : (userProfile?.client_tier || 'basic');

  // Check role access
  const hasRole = hasRoleAccess(currentRole, allowedRoles);
  
  // Check tier access if required
  const hasTier = !requiredTier || currentTier === requiredTier || 
    (requiredTier === 'basic' && currentTier === 'premium'); // Premium includes basic

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
  const { getCurrentClientTier, getCurrentRole, isDevMode } = useRoleContext();
  const { userProfile } = useUser();

  // In dev mode, always use the emulated tier
  const currentTier = isDevMode ? getCurrentClientTier() : (userProfile?.client_tier || 'basic');
  const currentRole = isDevMode ? getCurrentRole() : (userProfile?.role || 'client');

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
  const { getCurrentRole, isDevMode } = useRoleContext();
  const { userProfile } = useUser();

  // In dev mode, always use the emulated role
  const currentRole = isDevMode ? getCurrentRole() : (userProfile?.role || 'client');

  const hasAccess = hasRoleAccess(currentRole, allowedRoles);

  if (!hasAccess) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}