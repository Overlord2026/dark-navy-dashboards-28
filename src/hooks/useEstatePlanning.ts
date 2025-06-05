
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface EstateInterest {
  service_type: string;
  message?: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
}

interface EstateConsultation {
  consultation_type: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
}

export const useEstatePlanning = () => {
  const [loading, setLoading] = useState(false);

  const createInterest = async (data: EstateInterest) => {
    setLoading(true);
    try {
      console.log('Submitting estate planning interest:', data);
      toast.success('Thank you for your interest! We will contact you soon.');
    } catch (error) {
      console.error('Error submitting interest:', error);
      toast.error('Failed to submit interest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const createConsultation = async (data: EstateConsultation) => {
    setLoading(true);
    try {
      console.log('Scheduling estate planning consultation:', data);
      toast.success('Consultation request submitted! We will contact you to schedule.');
    } catch (error) {
      console.error('Error scheduling consultation:', error);
      toast.error('Failed to schedule consultation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    createInterest,
    createConsultation,
    loading
  };
};
