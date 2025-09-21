import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { RetirementAnalysisInput, RetirementAnalysisResults } from '@/types/retirement';

export interface RetirementScenario {
  id: string;
  advisor_id: string;
  client_id: string;
  scenario_name: string;
  scenario_description?: string;
  version_number: number;
  parent_scenario_id?: string;
  is_current_version: boolean;
  scenario_status: 'draft' | 'active' | 'archived' | 'presented';
  analysis_inputs: RetirementAnalysisInput;
  analysis_results?: RetirementAnalysisResults;
  created_for_meeting_date?: string;
  presented_date?: string;
  tags?: string[];
  assumptions_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AdvisorClient {
  id: string;
  advisor_id: string;
  client_id: string;
  client_name: string;
  client_email?: string;
  relationship_status: string;
  next_meeting_date?: string;
  last_meeting_date?: string;
  meeting_frequency: 'quarterly' | 'semi_annual' | 'annual';
  created_at: string;
  updated_at: string;
}

export interface ScenarioComparison {
  id: string;
  advisor_id: string;
  client_id: string;
  comparison_name: string;
  scenario_ids: string[];
  comparison_results: any;
  presentation_notes?: string;
  created_at: string;
  updated_at: string;
}

interface UseRetirementScenariosReturn {
  // Data
  scenarios: RetirementScenario[];
  clients: AdvisorClient[];
  currentClient: AdvisorClient | null;
  currentScenario: RetirementScenario | null;
  loading: boolean;
  saving: boolean;
  
  // Client Management
  setCurrentClient: (client: AdvisorClient | null) => void;
  addClient: (clientData: Omit<AdvisorClient, 'id' | 'advisor_id' | 'created_at' | 'updated_at'>) => Promise<AdvisorClient | null>;
  updateClient: (id: string, updates: Partial<AdvisorClient>) => Promise<boolean>;
  
  // Scenario Management
  setCurrentScenario: (scenario: RetirementScenario | null) => void;
  createScenario: (scenarioData: {
    client_id: string;
    scenario_name: string;
    scenario_description?: string;
    analysis_inputs: RetirementAnalysisInput;
    created_for_meeting_date?: string;
    tags?: string[];
    assumptions_notes?: string;
  }) => Promise<RetirementScenario | null>;
  
  copyScenario: (scenarioId: string, newName?: string) => Promise<RetirementScenario | null>;
  updateScenario: (id: string, updates: Partial<RetirementScenario>) => Promise<boolean>;
  archiveScenario: (id: string) => Promise<boolean>;
  deleteScenario: (id: string) => Promise<boolean>;
  
  // Scenario Versioning
  createNewVersion: (scenarioId: string, newName?: string) => Promise<RetirementScenario | null>;
  getScenarioVersions: (scenarioId: string) => RetirementScenario[];
  
  // Comparisons
  createComparison: (clientId: string, scenarioIds: string[], comparisonName: string) => Promise<ScenarioComparison | null>;
  
  // Filtering & Organization
  getScenariosForClient: (clientId: string) => RetirementScenario[];
  getScenariosByStatus: (status: RetirementScenario['scenario_status']) => RetirementScenario[];
  searchScenarios: (query: string) => RetirementScenario[];
  
  // Refresh
  refreshData: () => Promise<void>;
}

export function useRetirementScenarios(): UseRetirementScenariosReturn {
  const [scenarios, setScenarios] = useState<RetirementScenario[]>([]);
  const [clients, setClients] = useState<AdvisorClient[]>([]);
  const [currentClient, setCurrentClient] = useState<AdvisorClient | null>(null);
  const [currentScenario, setCurrentScenario] = useState<RetirementScenario | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch all data for the current advisor
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      // Fetch clients (mock data for now until database is ready)
      const mockClients: AdvisorClient[] = [
        {
          id: 'client-1',
          advisor_id: user.id,
          client_id: 'client-1',
          client_name: 'John & Mary Smith',
          client_email: 'john.smith@email.com',
          relationship_status: 'active',
          next_meeting_date: '2024-01-15',
          last_meeting_date: '2023-10-15',
          meeting_frequency: 'quarterly',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: 'client-2',
          advisor_id: user.id,
          client_id: 'client-2',
          client_name: 'Robert Johnson',
          client_email: 'robert.johnson@email.com',
          relationship_status: 'active',
          next_meeting_date: '2024-02-01',
          last_meeting_date: '2023-11-01',
          meeting_frequency: 'semi_annual',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];

      setClients(mockClients);

      // Fetch scenarios (mock data for now)
      const mockScenarios: RetirementScenario[] = [
        {
          id: 'scenario-1',
          advisor_id: user.id,
          client_id: 'client-1',
          scenario_name: 'Current Plan - Conservative',
          scenario_description: 'Current retirement plan with conservative assumptions',
          version_number: 1,
          is_current_version: true,
          scenario_status: 'active',
          analysis_inputs: {
            goals: {
              retirementAge: 65,
              retirementDate: new Date('2040-01-01'),
              currentAge: 45,
              desiredLifestyle: 'moderate',
              annualRetirementIncome: 100000,
              inflationRate: 2.5,
              lifeExpectancy: 90
            }
          } as RetirementAnalysisInput,
          tags: ['conservative', 'current'],
          assumptions_notes: 'Conservative 6% return assumptions',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];

      setScenarios(mockScenarios);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load retirement scenarios');
    } finally {
      setLoading(false);
    }
  }, []);

  // Client Management
  const addClient = useCallback(async (clientData: Omit<AdvisorClient, 'id' | 'advisor_id' | 'created_at' | 'updated_at'>): Promise<AdvisorClient | null> => {
    try {
      setSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to add clients');
        return null;
      }

      // Mock implementation - replace with actual database call when ready
      const newClient: AdvisorClient = {
        id: `client-${Date.now()}`,
        advisor_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...clientData
      };

      setClients(prev => [newClient, ...prev]);
      toast.success('Client added successfully');
      return newClient;
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Failed to add client');
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  const updateClient = useCallback(async (id: string, updates: Partial<AdvisorClient>): Promise<boolean> => {
    try {
      setSaving(true);
      
      // Mock implementation
      setClients(prev => prev.map(client => 
        client.id === id 
          ? { ...client, ...updates, updated_at: new Date().toISOString() }
          : client
      ));
      
      toast.success('Client updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Failed to update client');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  // Scenario Management
  const createScenario = useCallback(async (scenarioData: {
    client_id: string;
    scenario_name: string;
    scenario_description?: string;
    analysis_inputs: RetirementAnalysisInput;
    created_for_meeting_date?: string;
    tags?: string[];
    assumptions_notes?: string;
  }): Promise<RetirementScenario | null> => {
    try {
      setSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to create scenarios');
        return null;
      }

      // Mock implementation
      const newScenario: RetirementScenario = {
        id: `scenario-${Date.now()}`,
        advisor_id: user.id,
        version_number: 1,
        is_current_version: true,
        scenario_status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...scenarioData
      };

      setScenarios(prev => [newScenario, ...prev]);
      toast.success('Scenario created successfully');
      return newScenario;
    } catch (error) {
      console.error('Error creating scenario:', error);
      toast.error('Failed to create scenario');
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  const copyScenario = useCallback(async (scenarioId: string, newName?: string): Promise<RetirementScenario | null> => {
    try {
      setSaving(true);
      
      const originalScenario = scenarios.find(s => s.id === scenarioId);
      if (!originalScenario) {
        toast.error('Original scenario not found');
        return null;
      }

      const copiedScenario: RetirementScenario = {
        ...originalScenario,
        id: `scenario-${Date.now()}`,
        scenario_name: newName || `${originalScenario.scenario_name} - Copy`,
        version_number: 1,
        parent_scenario_id: undefined,
        is_current_version: true,
        scenario_status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setScenarios(prev => [copiedScenario, ...prev]);
      toast.success('Scenario copied successfully');
      return copiedScenario;
    } catch (error) {
      console.error('Error copying scenario:', error);
      toast.error('Failed to copy scenario');
      return null;
    } finally {
      setSaving(false);
    }
  }, [scenarios]);

  const createNewVersion = useCallback(async (scenarioId: string, newName?: string): Promise<RetirementScenario | null> => {
    try {
      setSaving(true);
      
      const originalScenario = scenarios.find(s => s.id === scenarioId);
      if (!originalScenario) {
        toast.error('Original scenario not found');
        return null;
      }

      // Mark old scenario as not current
      setScenarios(prev => prev.map(s => 
        s.id === scenarioId 
          ? { ...s, is_current_version: false }
          : s
      ));

      const newVersion: RetirementScenario = {
        ...originalScenario,
        id: `scenario-${Date.now()}`,
        scenario_name: newName || originalScenario.scenario_name,
        version_number: originalScenario.version_number + 1,
        parent_scenario_id: scenarioId,
        is_current_version: true,
        scenario_status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setScenarios(prev => [newVersion, ...prev]);
      toast.success('New scenario version created');
      return newVersion;
    } catch (error) {
      console.error('Error creating new version:', error);
      toast.error('Failed to create new version');
      return null;
    } finally {
      setSaving(false);
    }
  }, [scenarios]);

  const updateScenario = useCallback(async (id: string, updates: Partial<RetirementScenario>): Promise<boolean> => {
    try {
      setSaving(true);
      
      setScenarios(prev => prev.map(scenario => 
        scenario.id === id 
          ? { ...scenario, ...updates, updated_at: new Date().toISOString() }
          : scenario
      ));
      
      toast.success('Scenario updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating scenario:', error);
      toast.error('Failed to update scenario');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  const archiveScenario = useCallback(async (id: string): Promise<boolean> => {
    return updateScenario(id, { scenario_status: 'archived' });
  }, [updateScenario]);

  const deleteScenario = useCallback(async (id: string): Promise<boolean> => {
    try {
      setSaving(true);
      
      setScenarios(prev => prev.filter(scenario => scenario.id !== id));
      toast.success('Scenario deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting scenario:', error);
      toast.error('Failed to delete scenario');
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  // Scenario Filtering & Organization
  const getScenariosForClient = useCallback((clientId: string) => {
    return scenarios.filter(scenario => scenario.client_id === clientId);
  }, [scenarios]);

  const getScenariosByStatus = useCallback((status: RetirementScenario['scenario_status']) => {
    return scenarios.filter(scenario => scenario.scenario_status === status);
  }, [scenarios]);

  const getScenarioVersions = useCallback((scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    if (!scenario) return [];
    
    // Find all versions of this scenario (including the scenario itself)
    return scenarios.filter(s => 
      s.id === scenarioId || 
      s.parent_scenario_id === scenarioId ||
      (scenario.parent_scenario_id && (s.id === scenario.parent_scenario_id || s.parent_scenario_id === scenario.parent_scenario_id))
    ).sort((a, b) => b.version_number - a.version_number);
  }, [scenarios]);

  const searchScenarios = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return scenarios.filter(scenario => 
      scenario.scenario_name.toLowerCase().includes(lowercaseQuery) ||
      scenario.scenario_description?.toLowerCase().includes(lowercaseQuery) ||
      scenario.assumptions_notes?.toLowerCase().includes(lowercaseQuery) ||
      scenario.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  }, [scenarios]);

  // Comparison Management
  const createComparison = useCallback(async (clientId: string, scenarioIds: string[], comparisonName: string): Promise<ScenarioComparison | null> => {
    try {
      setSaving(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to create comparisons');
        return null;
      }

      // Mock implementation
      const comparison: ScenarioComparison = {
        id: `comparison-${Date.now()}`,
        advisor_id: user.id,
        client_id: clientId,
        comparison_name: comparisonName,
        scenario_ids: scenarioIds,
        comparison_results: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      toast.success('Comparison created successfully');
      return comparison;
    } catch (error) {
      console.error('Error creating comparison:', error);
      toast.error('Failed to create comparison');
      return null;
    } finally {
      setSaving(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    // Data
    scenarios,
    clients,
    currentClient,
    currentScenario,
    loading,
    saving,
    
    // Client Management
    setCurrentClient,
    addClient,
    updateClient,
    
    // Scenario Management
    setCurrentScenario,
    createScenario,
    copyScenario,
    updateScenario,
    archiveScenario,
    deleteScenario,
    
    // Scenario Versioning
    createNewVersion,
    getScenarioVersions,
    
    // Comparisons
    createComparison,
    
    // Filtering & Organization
    getScenariosForClient,
    getScenariosByStatus,
    searchScenarios,
    
    // Refresh
    refreshData,
  };
}