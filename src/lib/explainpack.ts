import { supabase } from '@/integrations/supabase/client';
import { getProofSlips, type ProofSlip } from './proofs';

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

export async function buildExplainPack(jobId: string): Promise<ExplainPack | null> {
  try {
    // Get proof slips for this job
    const proofSlips = await getProofSlips(jobId);

    // Get policy bundles (you may need to adjust this based on your schema)
    const { data: policyBundles, error: policyError } = await supabase
      .from('policy_bundles')
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
      policy_version: policyBundles?.[0]?.version || 'v1.0.0',
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