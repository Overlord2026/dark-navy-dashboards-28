import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface RetirementPlan {
  id: string;
  user_id: string;
  plan_type: '401k' | '403b' | '457b';
  provider: string;
  balance: number;
  source: 'pre_tax' | 'roth' | 'match';
  contribution_amount?: number;
  vesting_schedule?: string;
  created_at: string;
  updated_at: string;
}

export interface RetirementPlanData {
  plan_type: '401k' | '403b' | '457b';
  provider: string;
  balance: number;
  source: 'pre_tax' | 'roth' | 'match';
  contribution_amount?: number;
  vesting_schedule?: string;
}

interface RetirementPlansContextType {
  plans: RetirementPlan[];
  loading: boolean;
  saving: boolean;
  addPlan: (planData: RetirementPlanData) => Promise<RetirementPlan | null>;
  deletePlan: (id: string) => Promise<boolean>;
  getTotalBalance: () => number;
  getFormattedTotalBalance: () => string;
  refreshPlans: () => Promise<void>;
}

const RetirementPlansContext = createContext<RetirementPlansContextType | undefined>(undefined);

export function RetirementPlansProvider({ children }: { children: React.ReactNode }) {
  const [plans, setPlans] = useState<RetirementPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch all retirement plans for the current user
  const fetchPlans = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      const { data, error } = await supabase
        .from('retirement_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching retirement plans:', error);
        toast.error('Failed to fetch retirement plans');
        return;
      }

      setPlans((data || []) as any);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Add a new retirement plan
  const addPlan = async (planData: RetirementPlanData): Promise<RetirementPlan | null> => {
    try {
      setSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to add retirement plans');
        return null;
      }

      const { data, error } = await supabase
        .from('retirement_plans')
        .insert({
          ...planData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding retirement plan:', error);
        toast.error('Failed to add retirement plan');
        return null;
      }

      setPlans(prev => [data as any, ...prev]);
      toast.success('Retirement plan added successfully');
      return data as any;
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Delete a retirement plan
  const deletePlan = async (id: string): Promise<boolean> => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('retirement_plans')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting retirement plan:', error);
        toast.error('Failed to delete retirement plan');
        return false;
      }

      setPlans(prev => prev.filter(plan => plan.id !== id));
      toast.success('Retirement plan deleted successfully');
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Get total balance of all plans
  const getTotalBalance = () => {
    return plans.reduce((total, plan) => total + plan.balance, 0);
  };

  // Get formatted total balance
  const getFormattedTotalBalance = () => {
    const total = getTotalBalance();
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(total);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <RetirementPlansContext.Provider
      value={{
        plans,
        loading,
        saving,
        addPlan,
        deletePlan,
        getTotalBalance,
        getFormattedTotalBalance,
        refreshPlans: fetchPlans
      }}
    >
      {children}
    </RetirementPlansContext.Provider>
  );
}

export function useRetirementPlans() {
  const context = useContext(RetirementPlansContext);
  if (context === undefined) {
    throw new Error('useRetirementPlans must be used within a RetirementPlansProvider');
  }
  return context;
}