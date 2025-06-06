
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

  return { createConsultation };
};
