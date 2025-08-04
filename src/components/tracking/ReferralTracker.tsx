import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const ReferralTracker: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleReferralTracking = async () => {
      const referralCode = searchParams.get('ref');
      
      if (referralCode) {
        try {
          // Check if user is already logged in
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            // User is already logged in, complete the referral immediately
            await supabase.rpc('complete_referral_signup', {
              p_referral_code: referralCode,
              p_referred_user_id: user.id
            });
          } else {
            // Store referral code in localStorage for later processing
            localStorage.setItem('pending_referral_code', referralCode);
          }
          
          // Remove the referral parameter from URL
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.delete('ref');
          const newUrl = `${window.location.pathname}${newSearchParams.toString() ? '?' + newSearchParams.toString() : ''}`;
          navigate(newUrl, { replace: true });
          
        } catch (error) {
          console.error('Error processing referral:', error);
        }
      }
    };

    handleReferralTracking();
  }, [searchParams, navigate]);

  // Check for pending referral after login
  useEffect(() => {
    const processPendingReferral = async () => {
      const pendingReferralCode = localStorage.getItem('pending_referral_code');
      
      if (pendingReferralCode) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            await supabase.rpc('complete_referral_signup', {
              p_referral_code: pendingReferralCode,
              p_referred_user_id: user.id
            });
            
            // Clean up
            localStorage.removeItem('pending_referral_code');
          }
        } catch (error) {
          console.error('Error processing pending referral:', error);
        }
      }
    };

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        processPendingReferral();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return null; // This component doesn't render anything
};

export default ReferralTracker;