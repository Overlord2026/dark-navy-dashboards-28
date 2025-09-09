
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { shouldEnforceAuthentication, getEnvironmentConfig } from '@/utils/environment';
import { MOCK_MODE } from '@/config/featureFlags';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, session, isLoading, userProfile, isQABypassActive } = useAuth();
  const isAuthenticated = !!(user && session);

  // In mock mode, always allow access
  if (MOCK_MODE) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7E8]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1B1B32] mx-auto"></div>
          <p className="mt-4 text-[#222222]">Loading...</p>
        </div>
      </div>
    );
  }

  const enforceAuth = shouldEnforceAuthentication(userProfile?.email);
  const env = getEnvironmentConfig();
  
  if (!env.isProduction && !enforceAuth) {
    return <>{children}</>;
  }
  
  if (!isAuthenticated && enforceAuth) {
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && userProfile?.role !== requiredRole) {
    return <Navigate to="/client-dashboard" replace />;
  }

  return <>{children}</>;
};
