
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { useUser } from '@/context/UserContext';

export default function Landing() {
  const { isAuthenticated: supabaseIsAuthenticated, isLoading: supabaseIsLoading } = useSupabaseAuth();
  const { isAuthenticated: userIsAuthenticated, isLoading: userIsLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect after both auth contexts have been checked
    if (!supabaseIsLoading && !userIsLoading) {
      if (supabaseIsAuthenticated && userIsAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/auth');
      }
    }
  }, [supabaseIsAuthenticated, userIsAuthenticated, supabaseIsLoading, userIsLoading, navigate]);

  // Show loading while checking auth status
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      <h2 className="text-xl font-semibold mb-2">Welcome to Family Office Marketplace</h2>
      <p className="text-muted-foreground">Checking authentication status...</p>
    </div>
  );
}
