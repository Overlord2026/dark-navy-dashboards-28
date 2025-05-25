
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useSupabaseAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A1F44]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <span className="text-white">Loading...</span>
        </div>
      </div>
    );
  }

  // Only allow access if authenticated
  if (!isAuthenticated) {
    // Redirect to the login page with a return path
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
