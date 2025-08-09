import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { MarketingRole } from '@/marketing/types';

interface RequireMarketingRoleProps {
  children: React.ReactNode;
  allowedRoles: MarketingRole[];
  fallbackRoute?: string;
}

export function RequireMarketingRole({ 
  children, 
  allowedRoles, 
  fallbackRoute = '/client-dashboard' 
}: RequireMarketingRoleProps) {
  const { userProfile } = useUser();

  // Check if user has any of the allowed roles
  const hasPermission = userProfile?.role && (
    allowedRoles.includes(userProfile.role as MarketingRole) ||
    userProfile.role === 'admin' || // Admins can always access
    userProfile.role === 'system_administrator'
  );

  if (!hasPermission) {
    return <Navigate to={fallbackRoute} replace />;
  }

  return <>{children}</>;
}