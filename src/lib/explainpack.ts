import { supabase } from '@/integrations/supabase/client';
import { getProofSlips, type ProofSlip } from './proofs';
import { BUILD_ID } from './flags';
import { useRetirementIntake } from '@/store/retirementIntake';
import type { RetirementAnalysisInput, RetirementAnalysisResults, RetirementPolicy } from '@/types/retirement';

export interface ExplainPack {
  job_id: string;
  policy_version: string;
  proof_slips: ProofSlip[];
  policy_bundles: any[];
  generated_at: string;
  metadata: {
    user_id?: string;
    export_reason?: string;
  };
}

export interface SwagExplainPack {
  analysis_id: string;
  policy_version: string;
  build_id: string;
  generated_at: string;
  scenario: string;
  inputs: Partial<RetirementAnalysisInput>;
  policy: RetirementPolicy;
  summary: {
    readiness_score?: number;
    success_probability?: number;
    swag_score?: number;
    years_sustained?: number;
    monthly_income_gap?: number;
    recommendations_count?: number;
  };
  metadata: {
    export_reason: string;
    export_timestamp: string;
  };
}

export async function buildExplainPack(jobId: string): Promise<ExplainPack | null> {
  try {
    // Get proof slips for this job
    const proofSlips = await getProofSlips(jobId);

    // Get policy bundles (you may need to adjust this based on your schema)
    const { data: policyBundles, error: policyError } = await supabase
      .from('policy_bundles' as any)
      .select('*')
      .eq('domain', 'general') // Adjust this filter as needed
      .order('effective_at', { ascending: false })
      .limit(5);

    if (policyError) {
      console.warn('Failed to get policy bundles:', policyError);
    }

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    const explainPack: ExplainPack = {
      job_id: jobId,
      policy_version: (policyBundles as any)?.[0]?.version || 'v1.0.0',
      proof_slips: proofSlips,
      policy_bundles: policyBundles || [],
      generated_at: new Date().toISOString(),
      metadata: {
        user_id: user?.id,
        export_reason: 'manual_export'
      }
    };

    return explainPack;
  } catch (error) {
    console.error('Error building explain pack:', error);
    return null;
  }
}

export function downloadExplainPack(explainPack: ExplainPack) {
  const blob = new Blob([JSON.stringify(explainPack, null, 2)], {
    type: 'application/json'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `explainpack-${explainPack.job_id}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper to sanitize inputs - remove any sensitive data
function sanitizeInputs(inputs: any): any {
  // Create a deep copy
  const sanitized = JSON.parse(JSON.stringify(inputs));
  
  // Remove any fields that might contain secrets
  delete sanitized.user_id;
  delete sanitized.auth_token;
  
  return sanitized;
}

export async function buildExplainPackFromState(
  activeScenario: string,
  policy: RetirementPolicy,
  currentResult?: RetirementAnalysisResults
): Promise<SwagExplainPack> {
  // Get inputs from Zustand store
  const store = useRetirementIntake.getState();
  const inputs = store.inputs || {};

  // Sanitize inputs - remove any potential secrets or sensitive data
  const sanitizedInputs = sanitizeInputs(inputs);

  const explainPack: SwagExplainPack = {
    analysis_id: crypto.randomUUID(),
    policy_version: 'swag/v1',
    build_id: BUILD_ID,
    generated_at: new Date().toISOString(),
    scenario: activeScenario,
    inputs: sanitizedInputs,
    policy: policy,
    summary: currentResult ? {
      readiness_score: currentResult.readinessScore,
      success_probability: currentResult.monteCarlo.successProbability,
      swag_score: currentResult.monteCarlo.swagScore,
      years_sustained: currentResult.monteCarlo.yearsOfPortfolioSustainability,
      monthly_income_gap: currentResult.monthlyIncomeGap,
      recommendations_count: currentResult.recommendations.length
    } : {},
    metadata: {
      export_reason: 'manual_export',
      export_timestamp: new Date().toISOString()
    }
  };

  return explainPack;
}

export function downloadSwagExplainPack(explainPack: SwagExplainPack) {
  const blob = new Blob([JSON.stringify(explainPack, null, 2)], {
    type: 'application/json'
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  const dateStr = new Date().toISOString().slice(0, 10);
  const scenarioStr = explainPack.scenario.replace(/\s+/g, '-').toLowerCase();
  link.download = `swag-explainpack-${scenarioStr}-${dateStr}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}