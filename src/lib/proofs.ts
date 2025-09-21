import { supabase } from '@/integrations/supabase/client';

export type ProofSlipType = 
  | 'check_passed'
  | 'escrow_funded'
  | 'audit_completed'
  | 'policy_validated'
  | 'approval_received'
  | 'task_completed';

export interface ProofSlip {
  id: string;
  job_id: string;
  proof_type: ProofSlipType;
  summary: string;
  details: Record<string, any>;
  created_at: string;
  user_id?: string;
}

export async function createProof(
  jobId: string, 
  proofType: ProofSlipType, 
  summary: string, 
  details: Record<string, any> = {}
): Promise<ProofSlip | null> {
  try {
    const { data, error } = await supabase
      .from('proof_slips' as any)
      .insert({
        job_id: jobId,
        proof_type: proofType,
        summary,
        details,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create proof slip:', error);
      return null;
    }

    return data as unknown as ProofSlip;
  } catch (error) {
    console.error('Error creating proof slip:', error);
    return null;
  }
}

export async function getProofSlips(jobId: string): Promise<ProofSlip[]> {
  try {
    const { data, error } = await supabase
      .from('proof_slips' as any)
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to get proof slips:', error);
      return [];
    }

    return (data || []) as unknown as ProofSlip[];
  } catch (error) {
    console.error('Error getting proof slips:', error);
    return [];
  }
}