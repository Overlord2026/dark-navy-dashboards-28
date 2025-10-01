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
  scenarioVersionId: string,
  paths: number = 5000
): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: runRow, error: insErr } = await supabase
    .from('scenario_runs')
    .insert({
      scenario_version_id: scenarioVersionId,
      paths,
      requested_by: user.id
    })
    .select('*')
    .single();

  if (insErr) throw insErr;

  const { error: fnErr } = await supabase.functions.invoke('swag-sim', {
    body: { record: runRow }
  });

  if (fnErr) {
    await supabase
      .from('scenario_runs')
      .update({ 
        status: 'failed', 
        error: String(fnErr)
      })
      .eq('id', runRow.id);
    throw fnErr;
  }

  return runRow.id;
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
): Promise<{ id: string; status: string; error?: string }> {
  const { timeoutMs = 30000, intervalMs = 800 } = options;
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const { data, error } = await supabase
      .from('scenario_runs')
      .select('id,status,error')
      .eq('id', runId)
      .limit(1);

    if (error) throw error;
    const r = data?.[0];
    if (!r) throw new Error('Run not found');
    if (r.status === 'succeeded' || r.status === 'failed') return r;
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }

  throw new Error('Timed out');
}

/**
 * Fetch run summary from scenario_run_results table
 */
export async function fetchRunSummary(runId: string) {
  const { data, error } = await supabase
    .from('scenario_run_results')
    .select('summary,distributions,breach_events,path_sample')
    .eq('run_id', runId)
    .single();

  if (error) throw error;
  return data;
}
