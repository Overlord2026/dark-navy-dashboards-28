
import { useAuth } from '@/context/AuthContext';
import { sendInterestNotification } from '@/services/emailService';
import { toast } from 'sonner';

export const useInterestNotification = () => {
  const { user } = useAuth();

  const sendInterestEmail = async (itemName: string, itemType: string, pageContext: string) => {
    if (!user) {
      toast.error('Please log in to express interest');
      return false;
    }

    try {
      const userName = user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown User';
      const userEmail = user.email || 'unknown@email.com';

      const success = await sendInterestNotification({
        userName,
        userEmail,
        itemName,
        itemType,
        pageContext
      });

      if (success) {
        toast.success(`Interest in ${itemName} has been registered!`, {
          description: 'Your advisor has been notified and will contact you soon.',
        });
        return true;
      } else {
        toast.error('Failed to register interest. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error sending interest notification:', error);
      toast.error('Failed to register interest. Please try again.');
      return false;
    }
  };

  return { sendInterestEmail };
};
