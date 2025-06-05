
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface TaxPlanningStrategy {
  id: string;
  user_id: string;
  strategy_type: string;
  title: string;
  description?: string;
  implementation_date?: string;
  estimated_savings: number;
  status: 'planned' | 'implemented' | 'reviewed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface TaxPlanningConsultation {
  id: string;
  user_id: string;
  consultation_type: string;
  preferred_date?: string;
  preferred_time?: string;
  notes?: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  advisor_notes?: string;
  scheduled_at?: string;
  created_at: string;
  updated_at: string;
}

interface TaxPlanningInterest {
  id: string;
  user_id: string;
  interest_type: string;
  asset_name: string;
  notes?: string;
  created_at: string;
}

interface CreateConsultationData {
  consultation_type: string;
  preferred_date?: string;
  preferred_time?: string;
  notes?: string;
}

interface CreateInterestData {
  interest_type: string;
  asset_name: string;
  notes?: string;
}

export const useTaxPlanning = () => {
  const [loading, setLoading] = useState(false);
  const [strategies, setStrategies] = useState<TaxPlanningStrategy[]>([]);
  const [consultations, setConsultations] = useState<TaxPlanningConsultation[]>([]);
  const [interests, setInterests] = useState<TaxPlanningInterest[]>([]);

  // Fetch all tax planning data
  const fetchTaxPlanningData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch strategies
      const { data: strategiesData, error: strategiesError } = await supabase
        .from('tax_planning_strategies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (strategiesError) {
        console.error('Error fetching strategies:', strategiesError);
      } else {
        setStrategies(strategiesData || []);
      }

      // Fetch consultations
      const { data: consultationsData, error: consultationsError } = await supabase
        .from('tax_planning_consultations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (consultationsError) {
        console.error('Error fetching consultations:', consultationsError);
      } else {
        setConsultations(consultationsData || []);
      }

      // Fetch interests
      const { data: interestsData, error: interestsError } = await supabase
        .from('tax_planning_interests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (interestsError) {
        console.error('Error fetching interests:', interestsError);
      } else {
        setInterests(interestsData || []);
      }
    } catch (error) {
      console.error('Error fetching tax planning data:', error);
    }
  };

  // Create consultation request
  const createConsultation = async (data: CreateConsultationData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: newConsultation, error } = await supabase
        .from('tax_planning_consultations')
        .insert({
          user_id: user.id,
          ...data
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating consultation:', error);
        throw error;
      }

      setConsultations(prev => [newConsultation, ...prev]);
      toast.success('Consultation request submitted successfully!');
      return newConsultation;
    } catch (error) {
      console.error('Error creating consultation:', error);
      toast.error('Failed to submit consultation request. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create interest record
  const createInterest = async (data: CreateInterestData) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data: newInterest, error } = await supabase
        .from('tax_planning_interests')
        .insert({
          user_id: user.id,
          ...data
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating interest:', error);
        throw error;
      }

      setInterests(prev => [newInterest, ...prev]);
      toast.success('Your interest has been noted! We will contact you soon.');
      return newInterest;
    } catch (error) {
      console.error('Error creating interest:', error);
      toast.error('Failed to record interest. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Schedule meeting (external link to Calendly)
  const scheduleMeeting = (assetName: string) => {
    window.open("https://calendly.com/tonygomes/60min", "_blank");
    toast.success(`Opening scheduling page for ${assetName} consultation.`);
  };

  // Initialize data on mount
  useEffect(() => {
    fetchTaxPlanningData();
  }, []);

  return {
    loading,
    strategies,
    consultations,
    interests,
    createConsultation,
    createInterest,
    scheduleMeeting,
    fetchTaxPlanningData
  };
};
