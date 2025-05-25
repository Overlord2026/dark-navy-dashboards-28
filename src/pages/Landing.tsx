
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';
import { useUser } from '@/context/UserContext';

export default function Landing() {
  const { isAuthenticated: supabaseIsAuthenticated, isLoading: supabaseIsLoading } = useSupabaseAuth();
  const { isAuthenticated: userIsAuthenticated, isLoading: userIsLoading } = useUser();
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Track if we've been on this page too long to prevent infinite loops
    const timeoutId = setTimeout(() => {
      if (!redirectAttempted) {
        console.log('Redirect timeout reached, forcing navigation');
        navigate('/auth');
        setRedirectAttempted(true);
      }
    }, 3000); // 3 second safety timeout

    // Only redirect after both auth contexts have completed loading
    if (!supabaseIsLoading && !userIsLoading && !redirectAttempted) {
      if (supabaseIsAuthenticated && userIsAuthenticated) {
        console.log('Auth verified, redirecting to dashboard');
        navigate('/dashboard');
      } else {
        console.log('Not authenticated, redirecting to auth page');
        navigate('/auth');
      }
      setRedirectAttempted(true);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    supabaseIsAuthenticated, 
    userIsAuthenticated, 
    supabaseIsLoading, 
    userIsLoading, 
    navigate,
    redirectAttempted
  ]);

  // Show loading while checking auth status
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
      <h2 className="text-xl font-semibold mb-2">Welcome to Family Office Marketplace</h2>
      <p className="text-muted-foreground">Checking authentication status...</p>
    </div>
  );
}
