import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ScenarioResult {
  scenario_id: string;
  analysis: any;
  simulation_results: any;
  recommendations: string;
  compliance_notes: string[];
}

interface PlanningScenario {
  id: string;
  scenario_type: string;
  scenario_name: string;
  input_parameters: any;
  ai_analysis: any;
  simulation_results: any;
  recommendations: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function useScenarioPlanning() {
  const [loading, setLoading] = useState(false);
  const [scenarios, setScenarios] = useState<PlanningScenario[]>([]);

  const runScenario = async (
    scenarioType: string,
    scenarioName: string,
    inputParameters: any,
    advisorId?: string
  ): Promise<ScenarioResult> => {
    setLoading(true);
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('User not authenticated');
      }

      const { data: result, error } = await supabase.functions.invoke(
        'scenario-planner',
        {
          body: {
            scenarioType,
            scenarioName,
            inputParameters,
            userId: user.data.user.id,
            advisorId
          }
        }
      );

      if (error) {
        throw new Error(`Scenario analysis failed: ${error.message}`);
      }

      // Refresh scenarios list
      await getUserScenarios();

      toast.success('Scenario analysis completed!');
      return result;
    } catch (error) {
      console.error('Error running scenario:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to run scenario analysis');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUserScenarios = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('planning_scenarios')
        .select('*')
        .eq('user_id', user.data.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch scenarios: ${error.message}`);
      }

      setScenarios(data || []);
      return data;
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch scenarios');
      throw error;
    }
  };

  const getScenario = async (scenarioId: string) => {
    try {
      const { data, error } = await supabase
        .from('planning_scenarios')
        .select('*')
        .eq('id', scenarioId)
        .single();

      if (error) {
        throw new Error(`Failed to fetch scenario: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching scenario:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch scenario');
      throw error;
    }
  };

  const updateScenario = async (scenarioId: string, updates: Partial<PlanningScenario>) => {
    try {
      const { data, error } = await supabase
        .from('planning_scenarios')
        .update(updates)
        .eq('id', scenarioId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update scenario: ${error.message}`);
      }

      // Refresh scenarios list
      await getUserScenarios();

      toast.success('Scenario updated successfully!');
      return data;
    } catch (error) {
      console.error('Error updating scenario:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update scenario');
      throw error;
    }
  };

  const deleteScenario = async (scenarioId: string) => {
    try {
      const { error } = await supabase
        .from('planning_scenarios')
        .delete()
        .eq('id', scenarioId);

      if (error) {
        throw new Error(`Failed to delete scenario: ${error.message}`);
      }

      // Refresh scenarios list
      await getUserScenarios();

      toast.success('Scenario deleted successfully!');
    } catch (error) {
      console.error('Error deleting scenario:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete scenario');
      throw error;
    }
  };

  const generateProposal = async (scenarioIds: string[], advisorId: string) => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('User not authenticated');
      }

      // Create proposal record
      const { data: proposal, error: proposalError } = await supabase
        .from('advisor_proposals')
        .insert({
          user_id: user.data.user.id,
          advisor_id: advisorId,
          scenario_ids: scenarioIds,
          proposal_type: 'comprehensive',
          content: {
            scenarios: scenarioIds,
            generated_at: new Date().toISOString()
          },
          status: 'draft'
        })
        .select()
        .single();

      if (proposalError) {
        throw new Error(`Failed to create proposal: ${proposalError.message}`);
      }

      toast.success('Proposal generated successfully!');
      return proposal;
    } catch (error) {
      console.error('Error generating proposal:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate proposal');
      throw error;
    }
  };

  const getUserProposals = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('advisor_proposals')
        .select(`
          *,
          advisor:advisor_profiles(name, firm_name, email)
        `)
        .eq('user_id', user.data.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch proposals: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch proposals');
      throw error;
    }
  };

  return {
    loading,
    scenarios,
    runScenario,
    getUserScenarios,
    getScenario,
    updateScenario,
    deleteScenario,
    generateProposal,
    getUserProposals
  };
}