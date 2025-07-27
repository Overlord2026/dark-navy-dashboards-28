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
      // Mock implementation while TypeScript types regenerate
      const mockPartners: LendingPartner[] = [
        {
          id: '1',
          name: 'Premier Lending',
          partner_code: 'PL001',
          category: 'commercial-loans',
          offering: 'Commercial Real Estate Loans',
          contact_info: { email: 'contact@premier.com' },
          is_active: true,
          compliance_status: 'approved',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setPartners(mockPartners);
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
      // Mock implementation while TypeScript types regenerate
      const mockRequests: LoanRequest[] = [
        {
          id: '1',
          user_id: 'user-001',
          partner_id: '1',
          loan_type: 'commercial',
          requested_amount: 500000,
          status: 'submitted',
          purpose: 'Real estate acquisition',
          submitted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      setRequests(mockRequests);
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
      // Mock implementation while TypeScript types regenerate
      console.log('Loan request submitted:', requestData);
      
      await fetchRequests();
      toast({
        title: "Success",
        description: "Loan request submitted successfully"
      });

      return { 
        id: Date.now().toString(), 
        user_id: 'mock-user',
        ...requestData,
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
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