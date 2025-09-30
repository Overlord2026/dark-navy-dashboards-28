// Route component that conditionally renders based on feature flags
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getFlag, type FeatureFlag } from '@/config/flags';

interface FlagProtectedRouteProps {
  flag: FeatureFlag;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function FlagProtectedRoute({ 
  flag, 
  children, 
  fallback = <Navigate to="/404" replace />,
  redirectTo 
}: FlagProtectedRouteProps) {
  const isEnabled = getFlag(flag);

  if (!isEnabled) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// HOC version for wrapping existing components
export function withFlagProtection<T extends object>(
  Component: React.ComponentType<T>,
  flag: FeatureFlag,
  fallback?: React.ReactNode
) {
  return function ProtectedComponent(props: T) {
    return (
      <FlagProtectedRoute flag={flag} fallback={fallback}>
        <Component {...props} />
      </FlagProtectedRoute>
    );
  };
}