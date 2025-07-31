import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export interface ProposalHolding {
  ticker: string;
  name: string;
  quantity: number;
  market_value: number;
  cost_basis?: number;
  asset_class: string;
}

export interface InvestmentModel {
  id: string;
  name: string;
  description: string;
  risk_level: number;
  target_allocation: Record<string, number>;
  model_securities: Array<{
    ticker: string;
    weight: number;
    asset_class: string;
  }>;
  fee_structure: {
    management_fee: number;
    performance_fee?: number;
  };
}

export interface Proposal {
  id: string;
  tenant_id: string;
  advisor_id: string;
  prospect_name: string;
  prospect_email: string;
  current_holdings: ProposalHolding[];
  recommended_model_id: string;
  model_scores: Array<{
    model_id: string;
    score: number;
    model_name: string;
  }>;
  advisor_overrides: Record<string, any>;
  proposal_data: Record<string, any>;
  status: 'draft' | 'finalized' | 'sent';
  created_at: string;
  updated_at: string;
}

export const useProposals = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProposals = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('draft_proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProposals((data as any) || []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast.error('Failed to load proposals');
    } finally {
      setIsLoading(false);
    }
  };

  const createProposal = async (proposalData: Partial<Proposal>) => {
    try {
      const { data, error } = await supabase
        .from('draft_proposals')
        .insert(proposalData as any)
        .select()
        .single();

      if (error) throw error;
      
      await fetchProposals(); // Refresh the list
      toast.success('Proposal created successfully');
      return data;
    } catch (error) {
      console.error('Error creating proposal:', error);
      toast.error('Failed to create proposal');
      throw error;
    }
  };

  const updateProposal = async (id: string, updates: Partial<Proposal>) => {
    try {
      const { data, error } = await supabase
        .from('draft_proposals')
        .update(updates as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      await fetchProposals(); // Refresh the list
      toast.success('Proposal updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating proposal:', error);
      toast.error('Failed to update proposal');
      throw error;
    }
  };

  const deleteProposal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('draft_proposals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchProposals(); // Refresh the list
      toast.success('Proposal deleted successfully');
    } catch (error) {
      console.error('Error deleting proposal:', error);
      toast.error('Failed to delete proposal');
      throw error;
    }
  };

  const getProposal = async (id: string): Promise<Proposal | null> => {
    try {
      const { data, error } = await supabase
        .from('draft_proposals')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as any;
    } catch (error) {
      console.error('Error fetching proposal:', error);
      toast.error('Failed to load proposal');
      return null;
    }
  };

  useEffect(() => {
    fetchProposals();
  }, []);

  return {
    proposals,
    isLoading,
    fetchProposals,
    createProposal,
    updateProposal,
    deleteProposal,
    getProposal
  };
};

export const useInvestmentModels = () => {
  const [models, setModels] = useState<InvestmentModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchModels = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('investment_models')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setModels((data as any) || []);
    } catch (error) {
      console.error('Error fetching investment models:', error);
      toast.error('Failed to load investment models');
    } finally {
      setIsLoading(false);
    }
  };

  const createModel = async (modelData: Partial<InvestmentModel>) => {
    try {
      const { data, error } = await supabase
        .from('investment_models')
        .insert(modelData as any)
        .select()
        .single();

      if (error) throw error;
      
      await fetchModels(); // Refresh the list
      toast.success('Investment model created successfully');
      return data;
    } catch (error) {
      console.error('Error creating investment model:', error);
      toast.error('Failed to create investment model');
      throw error;
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return {
    models,
    isLoading,
    fetchModels,
    createModel
  };
};