/**
 * SWAG Analyzer Data Access Layer
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
 * Enqueue a run and invoke swag-sim edge function directly
 */
export async function enqueueRunAndInvoke(
  versionId: string,
  nPaths: number = 5000
): Promise<string> {
  // 1) Create the run record
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

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

  // 2) Invoke edge function directly with the run data
  const { error: fnErr } = await supabase.functions.invoke('swag-sim', {
    body: { record: run }
  });

  if (fnErr) {
    // Update run status to failed
    await supabase
      .from('retirement_runs')
      .update({ 
        status: 'failed', 
        error_message: fnErr.message,
        completed_at: new Date().toISOString()
      })
      .eq('id', run.id);
    throw fnErr;
  }

  return run.id;
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
 * Wait for a run to complete with configurable timeout
 */
export async function waitForRun(
  runId: string,
  options: { timeoutMs?: number; intervalMs?: number } = {}
): Promise<RetirementRun> {
  const { timeoutMs = 20000, intervalMs = 600 } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const { data, error } = await supabase
      .from('retirement_runs')
      .select('*')
      .eq('id', runId)
      .single();

    if (error) throw error;
    
    const run = data as RetirementRun;
    if (run.status === 'completed' || run.status === 'failed') {
      return run;
    }

    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  throw new Error('Timed out waiting for run');
}

/**
 * Fetch run summary from results table
 */
export async function fetchRunSummary(runId: string) {
  const { data, error } = await supabase
    .from('retirement_results')
    .select('*')
    .eq('run_id', runId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  
  return data;
}
