import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { sendOnboardingEmail } from '@/services/emailService';
import { toast } from 'sonner';

export const useOnboardingEmail = () => {
  const [sentEmails, setSentEmails] = useState<Set<string>>(new Set());

  const sendOnboardingEmailToUser = async (user: User, isFirstLogin: boolean = false) => {
    // Only send onboarding email on first login or explicit trigger
    if (!isFirstLogin || sentEmails.has(user.id)) {
      return;
    }

    try {
      const role = user.user_metadata?.role || 'client';
      const userName = user.user_metadata?.name || 
                     user.user_metadata?.full_name || 
                     user.user_metadata?.first_name || 
                     user.email?.split('@')[0] || 
                     'User';

      const success = await sendOnboardingEmail({
        userEmail: user.email!,
        userName,
        userRole: role,
        loginLink: window.location.origin
      });

      if (success) {
        setSentEmails(prev => new Set(prev).add(user.id));
        toast.success('Welcome email sent!', {
          description: `Onboarding information has been sent to ${user.email}`,
        });
      } else {
        toast.error('Failed to send welcome email', {
          description: 'Please contact support if this continues',
        });
      }
    } catch (error) {
      console.error('Error sending onboarding email:', error);
      toast.error('Failed to send welcome email');
    }
  };

  // Auto-trigger onboarding email for new users
  const handleNewUserSignup = (user: User, event: string) => {
    // Check if this is a new signup (not just a login)
    const isNewSignup = event === 'SIGNED_UP' || 
                       (event === 'SIGNED_IN' && isFirstTimeUser(user));
    
    if (isNewSignup) {
      // Small delay to ensure user data is fully processed
      setTimeout(() => {
        sendOnboardingEmailToUser(user, true);
      }, 1000);
    }
  };

  // Heuristic to detect first-time users
  const isFirstTimeUser = (user: User): boolean => {
    const now = new Date().getTime();
    const createdAt = new Date(user.created_at).getTime();
    const timeDiff = now - createdAt;
    // Consider it a first-time user if created within the last 5 minutes
    return timeDiff < 5 * 60 * 1000;
  };

  return {
    sendOnboardingEmailToUser,
    handleNewUserSignup,
    sentEmails: Array.from(sentEmails)
  };
};