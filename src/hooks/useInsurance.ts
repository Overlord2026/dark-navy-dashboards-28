import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface InsurancePolicy {
  id: string;
  user_id: string;
  name: string;
  type: 'term-life' | 'permanent-life' | 'annuity' | 'health' | 'long-term-care' | 'homeowners' | 'auto' | 'umbrella';
  provider: string;
  premium: number;
  frequency: 'monthly' | 'quarterly' | 'annually';
  coverage_amount: number;
  start_date: string;
  end_date?: string;
  beneficiaries?: string;
  policy_number?: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface InsuranceProvider {
  id: string;
  name: string;
  provider_code: string;
  description?: string;
  workflow?: string;
  other_offerings?: string;
  top_carriers?: string;
  insurance_types: string[];
  contact_info: Record<string, any>;
  is_active: boolean;
  compliance_status: 'pending' | 'approved' | 'suspended';
  created_at: string;
  updated_at: string;
}

export const useInsurance = () => {
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [providers, setProviders] = useState<InsuranceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Mock data for now - replace with actual Supabase calls after migration
  const mockPolicies: InsurancePolicy[] = [
    {
      id: '1',
      user_id: 'user1',
      name: 'Term Life Insurance',
      type: 'term-life',
      provider: 'Guardian Life',
      premium: 150,
      frequency: 'monthly',
      coverage_amount: 500000,
      start_date: '2024-01-01',
      policy_number: 'GL-123456789',
      status: 'active',
      beneficiaries: 'Spouse, Children',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      user_id: 'user1',
      name: 'Auto Insurance',
      type: 'auto',
      provider: 'Progressive',
      premium: 180,
      frequency: 'monthly',
      coverage_amount: 100000,
      start_date: '2024-01-01',
      end_date: '2024-12-31',
      policy_number: 'PRG-987654321',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const mockProviders: InsuranceProvider[] = [
    {
      id: '1',
      name: 'Guardian Life Insurance Company',
      provider_code: 'guardian',
      description: 'Leading provider of life insurance and annuity products.',
      workflow: 'Digital application with medical underwriting',
      other_offerings: 'Disability insurance, dental coverage',
      top_carriers: 'Guardian, Berkshire Hathaway',
      insurance_types: ['term-life', 'permanent-life'],
      contact_info: { phone: '1-800-GUARDIAN', website: 'https://guardian.com' },
      is_active: true,
      compliance_status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Progressive Insurance',
      provider_code: 'progressive',
      description: 'Auto, home, and commercial insurance solutions.',
      workflow: 'Online quotes and instant coverage',
      other_offerings: 'Home insurance, commercial coverage',
      top_carriers: 'Progressive, Citizens',
      insurance_types: ['auto', 'homeowners'],
      contact_info: { phone: '1-800-PROGRESSIVE', website: 'https://progressive.com' },
      is_active: true,
      compliance_status: 'approved',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual Supabase call
      // const { data, error } = await supabase
      //   .from('insurance_policies')
      //   .select('*')
      //   .eq('user_id', user.id);
      
      setPolicies(mockPolicies);
    } catch (error) {
      console.error('Error fetching insurance policies:', error);
      toast({
        title: "Error",
        description: "Failed to load insurance policies",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchProviders = async () => {
    try {
      // TODO: Replace with actual Supabase call
      // const { data, error } = await supabase
      //   .from('insurance_providers')
      //   .select('*')
      //   .eq('is_active', true);
      
      setProviders(mockProviders);
    } catch (error) {
      console.error('Error fetching insurance providers:', error);
    }
  };

  const addPolicy = async (policyData: Omit<InsurancePolicy, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      setSaving(true);
      
      // TODO: Replace with actual Supabase call
      // const { data, error } = await supabase
      //   .from('insurance_policies')
      //   .insert({ ...policyData, user_id: user.id })
      //   .select()
      //   .single();

      const newPolicy: InsurancePolicy = {
        ...policyData,
        id: Math.random().toString(),
        user_id: 'user1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setPolicies(prev => [...prev, newPolicy]);
      
      toast({
        title: "Success",
        description: "Insurance policy added successfully"
      });

      return newPolicy;
    } catch (error) {
      console.error('Error adding insurance policy:', error);
      toast({
        title: "Error",
        description: "Failed to add insurance policy",
        variant: "destructive"
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const updatePolicy = async (id: string, updates: Partial<InsurancePolicy>) => {
    try {
      setSaving(true);
      
      // TODO: Replace with actual Supabase call
      setPolicies(prev => 
        prev.map(policy => 
          policy.id === id 
            ? { ...policy, ...updates, updated_at: new Date().toISOString() }
            : policy
        )
      );

      toast({
        title: "Success",
        description: "Insurance policy updated successfully"
      });
    } catch (error) {
      console.error('Error updating insurance policy:', error);
      toast({
        title: "Error",
        description: "Failed to update insurance policy",
        variant: "destructive"
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const deletePolicy = async (id: string) => {
    try {
      setSaving(true);
      
      // TODO: Replace with actual Supabase call
      setPolicies(prev => prev.filter(policy => policy.id !== id));

      toast({
        title: "Success",
        description: "Insurance policy deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting insurance policy:', error);
      toast({
        title: "Error",
        description: "Failed to delete insurance policy",
        variant: "destructive"
      });
      throw error;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
    fetchProviders();
  }, []);

  return {
    policies,
    providers,
    loading,
    saving,
    addPolicy,
    updatePolicy,
    deletePolicy,
    refreshPolicies: fetchPolicies,
    refreshProviders: fetchProviders
  };
};