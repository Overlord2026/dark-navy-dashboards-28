
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/context/SupabaseAuthContext';

export default function Landing() {
  const { isAuthenticated, isLoading } = useSupabaseAuth();
  const [redirectAttempted, setRedirectAttempted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!redirectAttempted) {
        console.log('Redirect timeout reached, forcing navigation to auth');
        navigate('/auth');
        setRedirectAttempted(true);
      }
    }, 2000);

    if (!isLoading && !redirectAttempted) {
      if (isAuthenticated) {
        console.log('User authenticated, redirecting to dashboard');
        navigate('/dashboard');
      } else {
        console.log('User not authenticated, redirecting to auth page');
        navigate('/auth');
      }
      setRedirectAttempted(true);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isAuthenticated, isLoading, navigate, redirectAttempted]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A1F44]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
      <h2 className="text-xl font-semibold mb-2 text-white">Welcome to Family Office Marketplace</h2>
      <p className="text-gray-300">Checking authentication status...</p>
    </div>
  );
}
