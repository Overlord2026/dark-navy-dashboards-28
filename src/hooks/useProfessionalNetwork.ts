import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Professional {
  id: string;
  user_id?: string;
  professional_type: 'cpa' | 'tax_attorney' | 'estate_attorney' | 'enrolled_agent' | 'financial_advisor';
  firm_name?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  license_number?: string;
  license_state?: string;
  specialties?: string[];
  bio?: string;
  years_experience?: number;
  credentials?: string[];
  hourly_rate?: number;
  availability_status: 'available' | 'busy' | 'unavailable';
  rating: number;
  review_count: number;
  is_verified: boolean;
  compliance_status: 'pending' | 'approved' | 'suspended';
  onboarding_completed: boolean;
  white_label_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalReview {
  id: string;
  professional_id: string;
  reviewer_id: string;
  rating: number;
  review_text?: string;
  service_type?: string;
  is_verified: boolean;
  created_at: string;
}

export const useProfessionalNetwork = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [reviews, setReviews] = useState<ProfessionalReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchProfessionals = async (filters?: { type?: string; specialty?: string }) => {
    try {
      let query = supabase
        .from('professional_network')
        .select('*')
        .eq('compliance_status', 'approved')
        .eq('onboarding_completed', true)
        .order('rating', { ascending: false });

      if (filters?.type) {
        query = query.eq('professional_type', filters.type);
      }

      if (filters?.specialty) {
        query = query.contains('specialties', [filters.specialty]);
      }

      const { data, error } = await query;

      if (error) throw error;
      setProfessionals(data || []);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      toast({
        title: "Error",
        description: "Failed to load professional network",
        variant: "destructive"
      });
    }
  };

  const fetchReviews = async (professionalId: string) => {
    try {
      const { data, error } = await supabase
        .from('professional_reviews')
        .select('*')
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const submitReview = async (reviewData: Omit<ProfessionalReview, 'id' | 'reviewer_id' | 'created_at'>) => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('professional_reviews')
        .insert({
          ...reviewData,
          reviewer_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      await fetchReviews(reviewData.professional_id);
      toast({
        title: "Success",
        description: "Review submitted successfully"
      });

      return data;
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive"
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const registerProfessional = async (professionalData: Omit<Professional, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setSaving(true);
      const { data, error } = await supabase
        .from('professional_network')
        .insert(professionalData)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Professional registration submitted for review"
      });

      return data;
    } catch (error) {
      console.error('Error registering professional:', error);
      toast({
        title: "Error",
        description: "Failed to register professional",
        variant: "destructive"
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProfessionals().finally(() => setLoading(false));
  }, []);

  return {
    professionals,
    reviews,
    loading,
    saving,
    fetchProfessionals,
    fetchReviews,
    submitReview,
    registerProfessional
  };
};