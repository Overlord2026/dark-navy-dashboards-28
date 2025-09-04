import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FamilyOnboardingWelcome } from './FamilyOnboardingWelcome';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthChoice = async (provider: string) => {
    setIsLoading(true);
    
    try {
      if (provider === 'email') {
        // Redirect to auth page for email signup
        navigate('/auth?mode=signup&redirect=/families');
        return;
      }

      // Handle OAuth providers
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${window.location.origin}/families`,
        },
      });

      if (error) {
        toast.error(`Authentication failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FamilyOnboardingWelcome 
      onAuthChoice={handleAuthChoice}
    />
  );
};