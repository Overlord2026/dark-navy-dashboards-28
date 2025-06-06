
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { emailService } from '@/services/emailService';
import { toast } from 'sonner';

export const useInterestNotification = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const sendInterestNotification = async (assetName: string, additionalNotes?: string) => {
    if (!isAuthenticated || !user) {
      toast.error("Please log in to express interest");
      return false;
    }

    setIsSubmitting(true);
    try {
      const emailData = {
        userEmail: user.email || 'Unknown Email',
        userName: user.user_metadata?.display_name || 
                 user.user_metadata?.first_name || 
                 user.email?.split('@')[0] || 
                 'Unknown User',
        assetName: assetName,
        timestamp: new Date().toLocaleString()
      };

      const emailSent = await emailService.sendInterestNotification(emailData);
      
      if (emailSent) {
        toast.success("Your interest has been registered and notification sent!");
        return true;
      } else {
        toast.success("Your interest has been registered!", {
          description: "Notification email could not be sent, but your request was saved."
        });
        return false;
      }
    } catch (error) {
      console.error('Error sending interest notification:', error);
      toast.error("Failed to register interest. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    sendInterestNotification,
    isSubmitting
  };
};
