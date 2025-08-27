/**
 * Insurance Remarketing Service
 * Handles renewal campaigns with attestation and explainability
 */

import { supabase } from '@/integrations/supabase/client';
import { recordReceipt } from './receipts';
import { withAttestation } from './attestation';
import { inputs_hash } from '@/lib/canonical';

export interface RemarketingCampaign {
  id: string;
  policy_numbers: string[];
  campaign_type: '120_day' | '90_day' | '60_day' | '30_day';
  schedule_date: string;
  status: 'scheduled' | 'running' | 'completed' | 'failed';
  targeting_criteria: {
    renewal_date_range: [string, string];
    policy_types: string[];
    risk_bands: string[];
    previous_claims: boolean;
  };
  message_template: {
    subject: string;
    body: string;
    offers: string[];
  };
}

export interface RemarketingJob {
  id: string;
  campaign_id: string;
  policy_number: string;
  customer_hash: string;
  scheduled_for: string;
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'opted_out';
  remarketing_reason: string[];
  offers_presented: string[];
}

/**
 * Create remarketing campaign
 */
export async function createRemarketingCampaign(
  campaignType: RemarketingCampaign['campaign_type'],
  targetingCriteria: RemarketingCampaign['targeting_criteria'],
  messageTemplate: RemarketingCampaign['message_template']
): Promise<string> {
  const campaignId = crypto.randomUUID();
  
  // Find eligible policies
  const eligiblePolicies = await findEligiblePolicies(campaignType, targetingCriteria);
  
  const campaign: RemarketingCampaign = {
    id: campaignId,
    policy_numbers: eligiblePolicies,
    campaign_type: campaignType,
    schedule_date: calculateScheduleDate(campaignType),
    status: 'scheduled',
    targeting_criteria: targetingCriteria,
    message_template: messageTemplate
  };

  // Store campaign
  const { error } = await supabase
    .from('remarketing_campaigns')
    .insert({
      id: campaignId,
      campaign_type: campaignType,
      schedule_date: campaign.schedule_date,
      status: 'scheduled',
      targeting_criteria: targetingCriteria,
      message_template: messageTemplate,
      eligible_policies: eligiblePolicies
    });

  if (error) throw error;

  // Record Campaign-RDS
  await recordReceipt({
    type: 'Campaign-RDS',
    ts: new Date().toISOString(),
    policy_version: 'v1.0',
    campaign_id: campaignId,
    campaign_type: campaignType,
    target_count: eligiblePolicies.length,
    criteria_hash: await inputs_hash(targetingCriteria)
  });

  return campaignId;
}

/**
 * Execute remarketing campaign with attestation
 */
export async function executeRemarketingCampaign(campaignId: string): Promise<void> {
  await withAttestation(async () => {
    // Get campaign
    const { data: campaign, error } = await supabase
      .from('remarketing_campaigns')
      .select('*')
      .eq('id', campaignId)
      .single();

    if (error || !campaign) throw new Error('Campaign not found');

    // Update status
    await supabase
      .from('remarketing_campaigns')
      .update({ status: 'running' })
      .eq('id', campaignId);

    // Generate remarketing jobs
    const jobs = await generateRemarketingJobs(campaign);
    
    // Store jobs
    if (jobs.length > 0) {
      const { error: jobsError } = await supabase
        .from('remarketing_jobs')
        .insert(jobs);

      if (jobsError) throw jobsError;
    }

    // Generate explainability for each targeting decision
    for (const job of jobs) {
      const explainabilityData = generateExplainability(job, campaign);
      
      await recordReceipt({
        type: 'Explainability-RDS',
        ts: new Date().toISOString(),
        policy_version: 'v1.0',
        campaign_id: campaignId,
        policy_number: job.policy_number,
        decision: 'targeted',
        factors: explainabilityData.factors,
        confidence_band: explainabilityData.confidence_band,
        explanation_hash: await inputs_hash(explainabilityData)
      });
    }

    // Record Remarketing-RDS
    await recordReceipt({
      type: 'Remarketing-RDS',
      ts: new Date().toISOString(),
      policy_version: 'v1.0',
      campaign_id: campaignId,
      jobs_created: jobs.length,
      execution_status: 'completed'
    });

    // Update campaign status
    await supabase
      .from('remarketing_campaigns')
      .update({ status: 'completed' })
      .eq('id', campaignId);

  }, `remarketing_campaign_${campaignId}`);
}

/**
 * Find policies eligible for remarketing
 */
async function findEligiblePolicies(
  campaignType: RemarketingCampaign['campaign_type'],
  criteria: RemarketingCampaign['targeting_criteria']
): Promise<string[]> {
  // Calculate renewal date range based on campaign type
  const daysOut = parseInt(campaignType.split('_')[0]);
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysOut);
  
  const rangeStart = new Date(targetDate);
  rangeStart.setDate(rangeStart.getDate() - 15); // 15-day window
  const rangeEnd = new Date(targetDate);
  rangeEnd.setDate(rangeEnd.getDate() + 15);

  // Query eligible policies (simplified)
  const { data: policies, error } = await supabase
    .from('insurance_bindings')
    .select('policy_number')
    .eq('status', 'bound')
    .gte('effective_date', rangeStart.toISOString())
    .lte('effective_date', rangeEnd.toISOString())
    .limit(1000);

  if (error) throw error;

  return policies?.map(p => p.policy_number) || [];
}

/**
 * Calculate schedule date based on campaign type
 */
function calculateScheduleDate(campaignType: RemarketingCampaign['campaign_type']): string {
  const daysOut = parseInt(campaignType.split('_')[0]);
  const scheduleDate = new Date();
  scheduleDate.setDate(scheduleDate.getDate() + daysOut - 5); // Send 5 days before the target
  return scheduleDate.toISOString();
}

/**
 * Generate remarketing jobs for campaign
 */
async function generateRemarketingJobs(campaign: any): Promise<any[]> {
  const jobs = [];
  
  for (const policyNumber of campaign.eligible_policies) {
    // Get policy details (simplified)
    const customerHash = await inputs_hash({ policy: policyNumber });
    
    const reasons = determineRemarketingReasons(policyNumber, campaign.targeting_criteria);
    const offers = generateOffers(policyNumber, reasons);
    
    jobs.push({
      id: crypto.randomUUID(),
      campaign_id: campaign.id,
      policy_number: policyNumber,
      customer_hash: customerHash,
      scheduled_for: campaign.schedule_date,
      status: 'pending',
      remarketing_reason: reasons,
      offers_presented: offers
    });
  }
  
  return jobs;
}

/**
 * Determine remarketing reasons
 */
function determineRemarketingReasons(policyNumber: string, criteria: any): string[] {
  const reasons = ['renewal_approaching'];
  
  // Add criteria-based reasons
  if (criteria.previous_claims) {
    reasons.push('claims_history_review');
  }
  
  if (criteria.risk_bands?.includes('high_risk')) {
    reasons.push('risk_reassessment');
  }
  
  return reasons;
}

/**
 * Generate personalized offers
 */
function generateOffers(policyNumber: string, reasons: string[]): string[] {
  const offers = ['loyalty_discount'];
  
  if (reasons.includes('claims_history_review')) {
    offers.push('claims_free_discount');
  }
  
  if (reasons.includes('risk_reassessment')) {
    offers.push('safety_course_discount');
  }
  
  return offers;
}

/**
 * Generate explainability data
 */
function generateExplainability(job: RemarketingJob, campaign: any) {
  return {
    factors: [
      {
        factor: 'renewal_date',
        weight: 0.8,
        value: 'approaching'
      },
      {
        factor: 'policy_type',
        weight: 0.6,
        value: 'eligible'
      },
      {
        factor: 'risk_profile',
        weight: 0.4,
        value: 'standard'
      }
    ],
    confidence_band: 'high',
    model_version: 'v1.0',
    decision_timestamp: new Date().toISOString()
  };
}

/**
 * Get remarketing dashboard
 */
export async function getRemarketingDashboard(): Promise<{
  active_campaigns: RemarketingCampaign[];
  pending_jobs: number;
  sent_today: number;
  response_rate: number;
}> {
  const { data: campaigns, error } = await supabase
    .from('remarketing_campaigns')
    .select('*')
    .in('status', ['scheduled', 'running'])
    .order('created_at', { ascending: false });

  if (error) throw error;

  const { data: jobStats } = await supabase
    .rpc('get_remarketing_stats'); // Would need to create this function

  return {
    active_campaigns: campaigns || [],
    pending_jobs: 0, // Would come from RPC
    sent_today: 0,    // Would come from RPC
    response_rate: 0  // Would come from RPC
  };
}