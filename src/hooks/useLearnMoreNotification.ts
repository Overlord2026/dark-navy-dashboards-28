
import { useAuth } from '@/context/AuthContext';
import { sendLearnMoreNotification } from '@/services/emailService';
import { toast } from 'sonner';

export const useLearnMoreNotification = () => {
  const { user } = useAuth();

  const sendLearnMoreEmail = async (itemName: string, itemType: string, pageContext: string) => {
    if (!user) {
      toast.error('Please log in to request more information');
      return false;
    }

    try {
      const userName = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown User';
      const userEmail = user.email || 'unknown@email.com';

      const success = await sendLearnMoreNotification({
        userName,
        userEmail,
        itemName,
        itemType,
        pageContext,
        actionType: 'learn_more'
      });

      if (success) {
        toast.success(`Request for more information about ${itemName} has been sent!`, {
          description: 'Your advisor will provide detailed information soon.',
        });
        return true;
      } else {
        toast.error('Failed to send request. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error sending learn more notification:', error);
      toast.error('Failed to send request. Please try again.');
      return false;
    }
  };

  return { sendLearnMoreEmail };
};
