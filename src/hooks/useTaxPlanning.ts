
import { useInterestNotification } from '@/hooks/useInterestNotification';
import { toast } from 'sonner';

export const useTaxPlanning = () => {
  const { sendInterestEmail } = useInterestNotification();

  const createConsultation = async (consultationData: {
    consultation_type: string;
    notes: string;
  }) => {
    try {
      // Open Calendly instead of sending email
       window.open("https://calendly.com/tonygomes/talk-with-tony", "_blank");
      
      toast.success('Opening scheduling page', {
        description: 'Schedule your tax strategy consultation with your advisor.',
      });
      return true;
    } catch (error) {
      console.error('Error opening consultation scheduling:', error);
      toast.error('Failed to open scheduling page. Please try again.');
      return false;
    }
  };

  const createInterest = async (interestData: {
    interest_type: string;
    asset_name: string;
    notes: string;
  }) => {
    try {
      // Only send interest email, no toast here as it's handled in useInterestNotification
      const success = await sendInterestEmail(
        interestData.asset_name,
        'Investment',
        'Tax Planning'
      );

      return success;
    } catch (error) {
      console.error('Error registering interest:', error);
      toast.error('Failed to register interest. Please try again.');
      return false;
    }
  };

  const scheduleMeeting = async (itemName: string) => {
    try {
      // Open Calendly instead of sending email
      window.open("https://calendly.com/tonygomes/talk-with-tony", "_blank");
      
      toast.success('Opening scheduling page', {
        description: `Schedule a meeting to discuss ${itemName} with your advisor.`,
      });
      return true;
    } catch (error) {
      console.error('Error opening meeting scheduling:', error);
      toast.error('Failed to open scheduling page. Please try again.');
      return false;
    }
  };

  return { createConsultation, createInterest, scheduleMeeting };
};
