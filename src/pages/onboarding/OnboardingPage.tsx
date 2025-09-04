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

      // Handle OAuth providers with proper callback URL
      console.log(`Initiating ${provider} OAuth with callback URL: https://my.bfocfo.com/auth/callback`);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: 'https://my.bfocfo.com/auth/callback',
        },
      });
      
      console.log('OAuth request initiated, full URL should be logged by Supabase');

      if (error) {
        console.error(`${provider} OAuth error:`, error);
        toast.error(`${provider} authentication failed: ${error.message}`);
        
        if (error.message.includes('refuse to connect')) {
          toast.error('Google OAuth configuration issue. Please check Supabase settings.');
        }
      } else {
        console.log(`${provider} OAuth initiated successfully`);
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(`Something went wrong with ${provider} authentication. Please try again.`);
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