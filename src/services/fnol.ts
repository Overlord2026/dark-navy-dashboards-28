/**
 * First Notice of Loss (FNOL) Service
 * Handles claim intake with proper receipt generation
 */

import { supabase } from '@/integrations/supabase/client';
import { recordReceipt } from './receipts';
import { inputs_hash } from '@/lib/canonical';

export interface ClaimIntake {
  policy_number: string;
  loss_date: string;
  loss_type: string;
  loss_cause: string;
  estimated_damage_band: string;
  location: {
    zip_first3: string;
    coordinates_hash?: string; // Hashed lat/lng for privacy
  };
  description: string;
  reporter: {
    relationship: 'policyholder' | 'spouse' | 'agent' | 'other';
    contact_hash: string; // Hashed contact info
  };
  injuries_reported: boolean;
  police_report_filed: boolean;
  photos_uploaded: number;
}

export interface ClaimRecord {
  id: string;
  claim_number: string;
  policy_number: string;
  status: 'reported' | 'assigned' | 'investigating' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  intake_data: ClaimIntake;
  created_at: string;
  assigned_adjuster?: string;
}

/**
 * Process FNOL intake
 */
export async function processFNOL(intake: ClaimIntake): Promise<string> {
  const claimNumber = generateClaimNumber();
  const claimId = crypto.randomUUID();
  
  // Determine priority based on intake data
  const priority = determinePriority(intake);
  
  // Store claim record
  const { error } = await supabase
    .from('insurance_claims')
    .insert({
      id: claimId,
      claim_number: claimNumber,
      policy_number: intake.policy_number,
      status: 'reported',
      priority: priority,
      intake_data: intake,
      loss_date: intake.loss_date
    });

  if (error) throw error;

  // Record FNOL-RDS
  const fnolHash = await inputs_hash({
    policy_number: intake.policy_number,
    loss_date: intake.loss_date,
    loss_type: intake.loss_type,
    estimated_damage_band: intake.estimated_damage_band,
    location_hash: await inputs_hash(intake.location),
    reporter_hash: intake.reporter.contact_hash
  });

  await recordReceipt({
    type: 'FNOL-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    claim_id: claimId,
    claim_number: claimNumber,
    policy_number: intake.policy_number,
    fnol_hash: fnolHash,
    loss_type: intake.loss_type,
    damage_band: intake.estimated_damage_band,
    priority: priority,
    injuries_reported: intake.injuries_reported
  });

  return claimId;
}

/**
 * Update claim status
 */
export async function updateClaimStatus(
  claimId: string, 
  status: ClaimRecord['status'],
  adjusterNotes?: string
): Promise<void> {
  const { error } = await supabase
    .from('insurance_claims')
    .update({ 
      status,
      updated_at: new Date().toISOString(),
      ...(adjusterNotes && { adjuster_notes: adjusterNotes })
    })
    .eq('id', claimId);

  if (error) throw error;

  // Record status change
  await recordReceipt({
    type: 'ClaimStatus-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    claim_id: claimId,
    new_status: status,
    has_notes: !!adjusterNotes
  });
}

/**
 * Assign adjuster to claim
 */
export async function assignAdjuster(claimId: string, adjusterUserId: string): Promise<void> {
  const { error } = await supabase
    .from('insurance_claims' as any)
    .update({ 
      assigned_adjuster: adjusterUserId,
      status: 'assigned',
      updated_at: new Date().toISOString()
    })
    .eq('id', claimId);

  if (error) throw error;

  // Record assignment
  await recordReceipt({
    type: 'ClaimAssignment-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    claim_id: claimId,
    adjuster_hash: await inputs_hash({ adjuster_id: adjusterUserId })
  });
}

/**
 * Get claims dashboard data
 */
export async function getClaimsDashboard(): Promise<{
  open_claims: ClaimRecord[];
  summary: {
    total_open: number;
    high_priority: number;
    avg_age_days: number;
    unassigned: number;
  };
}> {
  const { data: claims, error } = await supabase
    .from('insurance_claims' as any)
    .select('*')
    .neq('status', 'closed')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const highPriority = claims?.filter((c: any) => ['high', 'urgent'].includes(c.priority)).length || 0;
  const unassigned = claims?.filter((c: any) => !c.assigned_adjuster).length || 0;
  
  const avgAge = claims?.length ? 
    claims.reduce((sum: number, claim: any) => {
      const ageMs = Date.now() - new Date(claim.created_at).getTime();
      return sum + (ageMs / (1000 * 60 * 60 * 24)); // days
    }, 0) / claims.length : 0;

  return {
    open_claims: (claims || []) as ClaimRecord[],
    summary: {
      total_open: claims?.length || 0,
      high_priority: highPriority,
      avg_age_days: Math.round(avgAge),
      unassigned: unassigned
    }
  };
}

/**
 * Get claim by ID
 */
export async function getClaim(id: string): Promise<ClaimRecord | null> {
  const { data, error } = await supabase
    .from('insurance_claims' as any)
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as ClaimRecord;
}

/**
 * Determine claim priority based on intake data
 */
function determinePriority(intake: ClaimIntake): ClaimRecord['priority'] {
  // High priority conditions
  if (intake.injuries_reported) return 'urgent';
  if (intake.loss_type === 'fire' || intake.loss_type === 'flood') return 'high';
  if (intake.estimated_damage_band === 'over_100k') return 'high';
  if (intake.loss_cause === 'theft' || intake.loss_cause === 'vandalism') return 'high';
  
  // Normal priority for most claims
  if (intake.estimated_damage_band === '25k_100k') return 'normal';
  
  // Low priority for minor claims
  return 'low';
}

/**
 * Generate claim number
 */
function generateClaimNumber(): string {
  const prefix = 'CLM';
  const year = new Date().getFullYear().toString().slice(-2);
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();
  return `${prefix}${year}${timestamp}${random}`;
}

/**
 * Band damage estimates for privacy
 */
export function bandDamageEstimate(amount: number): string {
  if (amount < 1000) return 'under_1k';
  if (amount < 5000) return '1k_5k';
  if (amount < 25000) return '5k_25k';
  if (amount < 100000) return '25k_100k';
  return 'over_100k';
}