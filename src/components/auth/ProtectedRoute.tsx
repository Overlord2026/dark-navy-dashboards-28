
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { shouldEnforceAuthentication } from '@/utils/environment';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, session, isLoading, userProfile, isQABypassActive } = useAuth();
  const isAuthenticated = !!(user && session);

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

  // Check if authentication should be enforced for this user
  const enforceAuth = shouldEnforceAuthentication(userProfile?.email);
  
  if (!isAuthenticated && enforceAuth) {
    return <Navigate to="/auth" replace />;
  }
  
  // Allow QA bypass user to access without authentication in sandbox
  if (isQABypassActive && !enforceAuth) {
    // Continue to render children for QA testing
  }

  // Check role-based access if requiredRole is specified
  if (requiredRole && userProfile?.role !== requiredRole) {
    // You can customize this to redirect to an access denied page
    return <Navigate to="/client-dashboard" replace />;
  }

  return <>{children}</>;
};
