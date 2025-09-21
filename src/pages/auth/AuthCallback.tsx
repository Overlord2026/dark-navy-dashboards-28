import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { consumePendingInvite } from '@/lib/invites';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Auth callback triggered with params:', Object.fromEntries(searchParams));
        
        // Handle OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('OAuth callback error:', error);
          toast.error(`Authentication failed: ${error.message}`);
          navigate('/', { replace: true });
          return;
        }

        if (data.session) {
          console.log('OAuth authentication successful:', data.session.user.email);
          toast.success('Successfully signed in!');
          
          // Check if user has completed onboarding by checking user_onboarding table
          const { data: onboardingData } = await supabase
            .from('user_onboarding')
            .select('*')
            .eq('user_id', data.session.user.id)
            .single();

          // Get user profile for display name
          const { data: profile } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('id', data.session.user.id)
            .single();

          // Check for pending invite first
          const pendingInvite = consumePendingInvite();
          if (pendingInvite?.token) {
            const inviteUrl = `/invite/${pendingInvite.token}${pendingInvite.persona ? `?persona=${pendingInvite.persona}` : ''}`;
            navigate(inviteUrl, { replace: true });
          } else if (onboardingData) {
            navigate('/families', { replace: true });
          } else {
            navigate('/onboarding?persona=family', { replace: true });
          }
        } else {
          console.warn('No session found in OAuth callback');
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Auth callback processing error:', error);
        toast.error('Authentication processing failed. Please try again.');
        navigate('/', { replace: true });
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center brand-bg">
        <div className="text-center text-white">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Completing authentication...</p>
          <p className="text-sm text-white/70 mt-2">Please wait while we sign you in</p>
        </div>
      </div>
    );
  }

  return null;
};