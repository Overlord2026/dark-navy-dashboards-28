/**
 * Retirement Analysis Data Access Layer
 * CRUD operations for scenarios, versions, runs, and results
 */

import { supabase } from '@/integrations/supabase/client';
import type { RetirementAnalysisInput, RetirementPolicy } from '@/types/retirement';

export interface RetirementScenario {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface RetirementVersion {
  id: string;
  scenario_id: string;
  label: string;
  inputs: any;
  policy: any;
  created_at: string;
}

export interface RetirementRun {
  id: string;
  version_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  n_paths: number;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
  created_at: string;
}

export interface RetirementResults {
  id: string;
  run_id: string;
  success_probability?: number;
  terminal_p10?: number;
  terminal_p50?: number;
  terminal_p90?: number;
  breach_rate?: number;
  etay_value?: number;
  seay_value?: number;
  full_results?: any;
  created_at: string;
}

/**
 * List all scenarios for the current user
 */
export async function listScenarios(): Promise<RetirementScenario[]> {
  const { data, error } = await supabase
    .from('retirement_scenarios')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Create a new scenario
 */
export async function createScenario(
  name: string,
  description?: string,
  tags?: string[]
): Promise<RetirementScenario> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('retirement_scenarios')
    .insert({
      user_id: user.id,
      name,
      description,
      tags: tags || []
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Create a new version for a scenario
 */
export async function createVersion(
  scenarioId: string,
  label: string,
  inputs: RetirementAnalysisInput,
  policy: RetirementPolicy
): Promise<RetirementVersion> {
  const { data, error } = await supabase
    .from('retirement_versions')
    .insert([{
      scenario_id: scenarioId,
      label,
      inputs: inputs as any,
      policy: policy as any
    }])
    .select()
    .single();

  if (error) throw error;
  return data as RetirementVersion;
}

/**
 * Get all versions for a scenario
 */
export async function getVersions(scenarioId: string): Promise<RetirementVersion[]> {
  const { data, error } = await supabase
    .from('retirement_versions')
    .select('*')
    .eq('scenario_id', scenarioId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

/**
 * Enqueue a Monte Carlo simulation run
 */
export async function enqueueRun(
  versionId: string,
  nPaths: number = 5000
): Promise<RetirementRun> {
  // Create the run record
  const { data: run, error: runError } = await supabase
    .from('retirement_runs')
    .insert({
      version_id: versionId,
      status: 'queued',
      n_paths: nPaths
    })
    .select()
    .single();

  if (runError) throw runError;

  // Trigger the edge function asynchronously
  supabase.functions.invoke('run-mc-simulation', {
    body: { runId: run.id }
  }).catch(err => {
    console.error('Failed to invoke MC simulation:', err);
  });

  return run as RetirementRun;
}

/**
 * Get a specific run's status
 */
export async function getRun(runId: string): Promise<RetirementRun> {
  const { data, error } = await supabase
    .from('retirement_runs')
    .select('*')
    .eq('id', runId)
    .single();

  if (error) throw error;
  return data as RetirementRun;
}

/**
 * Get results for a specific run
 */
export async function getResults(runId: string): Promise<RetirementResults | null> {
  const { data, error } = await supabase
    .from('retirement_results')
    .select('*')
    .eq('run_id', runId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // No results yet
    throw error;
  }
  return data;
}

/**
 * Poll a run until it completes or fails
 */
export async function pollRunUntilComplete(
  runId: string,
  maxWaitMs: number = 120000, // 2 minutes
  pollIntervalMs: number = 2000
): Promise<RetirementRun> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const run = await getRun(runId);
    
    if (run.status === 'completed' || run.status === 'failed') {
      return run;
    }

    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }

  throw new Error('Simulation timed out');
}
