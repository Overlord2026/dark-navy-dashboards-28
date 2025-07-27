import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface LendingPartner {
  id: string;
  name: string;
  partner_code: string;
  category: 'home-loans' | 'securities-loans' | 'commercial-loans' | 'specialty-loans' | 'personal-loans';
  offering: string;
  description?: string;
  about?: string;
  how_it_works?: string;
  other_offerings?: string[];
  top_underwriters?: string[];
  contact_info: Record<string, any>;
  is_active: boolean;
  compliance_status: 'pending' | 'approved' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface LoanRequest {
  id: string;
  user_id: string;
  partner_id?: string;
  loan_type: string;
  requested_amount?: number;
  purpose?: string;
  status: 'submitted' | 'under_review' | 'approved' | 'denied' | 'funded';
  advisor_notes?: string;
  partner_notes?: string;
  submitted_at: string;
  updated_at: string;
}

export const useLending = () => {
  const [partners, setPartners] = useState<LendingPartner[]>([]);
  const [requests, setRequests] = useState<LoanRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('lending_partners')
        .select('*')
        .eq('is_active', true)
        .eq('compliance_status', 'approved')
        .order('name');

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching lending partners:', error);
      toast({
        title: "Error",
        description: "Failed to load lending partners",
        variant: "destructive"
      });
    }
  };

  const fetchRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('loan_requests')
        .select(`
          *,
          lending_partners (
            name,
            category
          )
        `)
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching loan requests:', error);
      toast({
        title: "Error",
        description: "Failed to load loan requests",
        variant: "destructive"
      });
    }
  };

  const submitLoanRequest = async (requestData: Omit<LoanRequest, 'id' | 'user_id' | 'submitted_at' | 'updated_at'>) => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('loan_requests')
        .insert({
          ...requestData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      await fetchRequests();
      toast({
        title: "Success",
        description: "Loan request submitted successfully"
      });

      return data;
    } catch (error) {
      console.error('Error submitting loan request:', error);
      toast({
        title: "Error",
        description: "Failed to submit loan request",
        variant: "destructive"
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    Promise.all([fetchPartners(), fetchRequests()]).finally(() => setLoading(false));
  }, []);

  return {
    partners,
    requests,
    loading,
    saving,
    submitLoanRequest,
    refreshData: () => Promise.all([fetchPartners(), fetchRequests()])
  };
};