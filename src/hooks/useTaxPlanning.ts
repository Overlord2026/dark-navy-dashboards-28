
import { useLearnMoreNotification } from '@/hooks/useLearnMoreNotification';
import { toast } from 'sonner';

export const useTaxPlanning = () => {
  const { sendLearnMoreEmail } = useLearnMoreNotification();

  const createConsultation = async (consultationData: {
    consultation_type: string;
    notes: string;
  }) => {
    try {
      const success = await sendLearnMoreEmail(
        'Tax Strategy Consultation',
        'Tax Consultation',
        'Tax Planning',
        'consultant_request'
      );

      if (success) {
        toast.success('Tax strategy consultation request sent successfully!', {
          description: 'Your advisor will contact you to schedule the consultation.',
        });
        return true;
      } else {
        toast.error('Failed to send consultation request. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error creating consultation:', error);
      toast.error('Failed to send consultation request. Please try again.');
      return false;
    }
  };

  const createInterest = async (interestData: {
    interest_type: string;
    asset_name: string;
    notes: string;
  }) => {
    try {
      const success = await sendLearnMoreEmail(
        interestData.asset_name,
        'Tax Strategy',
        'Tax Planning',
        'learn_more'
      );

      if (success) {
        toast.success('Interest registered successfully!', {
          description: 'Your advisor will contact you soon.',
        });
        return true;
      } else {
        toast.error('Failed to register interest. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error registering interest:', error);
      toast.error('Failed to register interest. Please try again.');
      return false;
    }
  };

  const scheduleMeeting = async (itemName: string) => {
    try {
      const success = await sendLearnMoreEmail(
        itemName,
        'Tax Strategy',
        'Tax Planning',
        'consultant_request'
      );

      if (success) {
        toast.success('Meeting request sent successfully!', {
          description: 'Your advisor will contact you to schedule the meeting.',
        });
        return true;
      } else {
        toast.error('Failed to send meeting request. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      toast.error('Failed to send meeting request. Please try again.');
      return false;
    }
  };

  return { createConsultation, createInterest, scheduleMeeting };
};
