
import { useAuth } from '@/context/AuthContext';
import { sendLearnMoreNotification } from '@/services/emailService';
import { toast } from 'sonner';

type ActionType = 'learn_more' | 'request_assistance' | 'consultant_request';

export const useLearnMoreNotification = () => {
  const { user } = useAuth();

  const sendLearnMoreEmail = async (
    itemName: string, 
    itemType: string, 
    pageContext: string,
    actionType: ActionType = 'learn_more'
  ) => {
    if (!user) {
      toast.error('Please log in to send a request');
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
        actionType
      });

      if (success) {
        let successMessage = '';
        switch (actionType) {
          case 'request_assistance':
            successMessage = `Assistance request for ${itemName} has been sent!`;
            break;
          case 'consultant_request':
            successMessage = `Consultant request for ${itemName} has been sent!`;
            break;
          default:
            successMessage = `Request for more information about ${itemName} has been sent!`;
        }
        
        toast.success(successMessage, {
          description: 'Your advisor will respond soon.',
        });
        return true;
      } else {
        toast.error('Failed to send request. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send request. Please try again.');
      return false;
    }
  };

  return { sendLearnMoreEmail };
};
