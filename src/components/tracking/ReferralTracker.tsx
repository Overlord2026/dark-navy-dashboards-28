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
            try {
              // Update the referral as activated
              await supabase
                .from('referrals')
                .update({ 
                  referee_id: user.id,
                  status: 'activated',
                  activated_at: new Date().toISOString()
                })
                .eq('referral_code', referralCode)
                .eq('status', 'pending');
            } catch (error) {
              console.error('Error completing referral:', error);
            }
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
          try {
            // Update the referral as activated
            await supabase
              .from('referrals')
              .update({ 
                referee_id: user.id,
                status: 'activated',
                activated_at: new Date().toISOString()
              })
              .eq('referral_code', pendingReferralCode)
              .eq('status', 'pending');
            
            // Clean up
            localStorage.removeItem('pending_referral_code');
          } catch (error) {
            console.error('Error processing pending referral:', error);
          }
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