
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { useUser } from '@/context/UserContext';

export function ProtectedRoute() {
  const { isAuthenticated: supabaseIsAuthenticated, isLoading: supabaseIsLoading } = useSupabaseAuth();
  const { isAuthenticated: userIsAuthenticated, isLoading: userIsLoading } = useUser();
  const location = useLocation();

  // Show loading state while checking both authentication contexts
  if (supabaseIsLoading || userIsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3">Verifying authentication...</span>
      </div>
    );
  }

  // Only allow access if authenticated in both contexts
  if (!supabaseIsAuthenticated || !userIsAuthenticated) {
    // Redirect to the login page with a return path
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
