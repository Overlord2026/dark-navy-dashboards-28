import { supabase } from '@/integrations/supabase/client';
import { hash } from '@/lib/canonical';
import { CONFIG } from '@/config/flags';
import { demoService } from './demoService';

export interface DecisionRDSInput {
  subject: string; // Subject identifier (user_id, entity_id, etc.)
  action: string; // Action type (retirement_planning, fee_benchmark, etc.)
  reasons: string[]; // Decision reasoning codes
  meta?: Record<string, any>; // Additional metadata
  result?: 'approve' | 'deny' | 'pending'; // Decision result
  policy_version?: string; // Policy version used
  model_id?: string; // Model/algorithm identifier
}

export interface DecisionRDS {
  id: string;
  type: 'Decision-RDS';
  subject_id: string;
  action: string;
  reasons: string[];
  result: string;
  inputs_hash: string;
  policy_hash: string;
  model_id?: string;
  receipt_hash: string;
  policy_version: string;
  anchor_ref?: {
    type: string;
    proof_ok: boolean;
    timestamp: string;
    merkle_leaf?: string;
    merkle_root?: string;
  };
  created_at: string;
  metadata?: Record<string, any>;
}

/**
 * Unified function to save Decision-RDS records
 * Used by all demos to create auditable decision receipts
 */
export async function saveDecisionRDS(input: DecisionRDSInput): Promise<DecisionRDS> {
  // In demo mode, return mock receipt
  if (CONFIG.DEMO_MODE) {
    console.log('[DEMO] Saving Decision-RDS:', input);
    return demoService.mockNetworkCall('/decisions/save', createMockDecisionRDS(input));
  }

  try {
    // Generate hashes for RDS fields
    const inputs_hash = await hash({
      subject: input.subject,
      action: input.action,
      meta: input.meta || {},
      timestamp: new Date().toISOString()
    });

    const policy_hash = await hash({
      version: input.policy_version || 'DEFAULT-2024.09',
      action: input.action,
      rules: getDefaultPolicyRules(input.action)
    });

    const model_id = input.model_id || `model_${input.action}_v1`;

    // Create receipt content
    const receiptContent = {
      subject_id: input.subject,
      action: input.action,
      reasons: input.reasons,
      result: input.result || 'approve',
      inputs_hash,
      policy_hash,
      model_id,
      policy_version: input.policy_version || 'DEFAULT-2024.09',
      created_at: new Date().toISOString(),
      metadata: input.meta || {}
    };

    const receipt_hash = await hash(receiptContent);

    // Create anchor reference (mock for now, would integrate with real anchoring service)
    const anchor_ref = {
      type: 'merkle_inclusion',
      proof_ok: true,
      timestamp: new Date().toISOString(),
      merkle_leaf: await hash({ receipt_hash, timestamp: new Date().getTime() }),
      merkle_root: await hash({ leaf: receipt_hash, tree_size: 1 })
    };

    // Save to accounting_receipts table (using existing schema)
    const { data, error } = await supabase
      .from('accounting_receipts')
      .insert({
        subject_id: input.subject,
        subject_type: 'decision',
        event_type: input.action,
        content_hash: receipt_hash,
        reason_code: input.reasons.join(','),
        explanation: `Decision-RDS: ${input.action}`,
        metadata: {
          ...receiptContent,
          anchor_ref
        }
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving Decision-RDS:', error);
      throw error;
    }

    // Return formatted Decision-RDS
    const decisionRDS: DecisionRDS = {
      id: data.id,
      type: 'Decision-RDS',
      subject_id: input.subject,
      action: input.action,
      reasons: input.reasons,
      result: input.result || 'approve',
      inputs_hash,
      policy_hash,
      model_id,
      receipt_hash,
      policy_version: input.policy_version || 'DEFAULT-2024.09',
      anchor_ref,
      created_at: data.created_at,
      metadata: input.meta
    };

    console.log('Decision-RDS saved successfully:', decisionRDS.id);
    return decisionRDS;

  } catch (error) {
    console.error('Failed to save Decision-RDS:', error);
    throw error;
  }
}

/**
 * Create a mock Decision-RDS for demo mode
 */
function createMockDecisionRDS(input: DecisionRDSInput): DecisionRDS {
  const timestamp = new Date().toISOString();
  const receipt_hash = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: `rds_${Date.now()}`,
    type: 'Decision-RDS',
    subject_id: input.subject,
    action: input.action,
    reasons: input.reasons,
    result: input.result || 'approve',
    inputs_hash: `inputs_${receipt_hash}`,
    policy_hash: `policy_${receipt_hash}`,
    model_id: input.model_id || `model_${input.action}_v1`,
    receipt_hash,
    policy_version: input.policy_version || 'DEMO-2024.09',
    anchor_ref: {
      type: 'merkle_inclusion',
      proof_ok: true,
      timestamp,
      merkle_leaf: `leaf_${receipt_hash}`,
      merkle_root: `root_${receipt_hash}`
    },
    created_at: timestamp,
    metadata: input.meta
  };
}

/**
 * Get default policy rules for an action
 */
function getDefaultPolicyRules(action: string): Record<string, any> {
  const commonRules = {
    user_authenticated: true,
    data_validated: true,
    compliance_checked: true
  };

  switch (action) {
    case 'retirement_planning':
      return {
        ...commonRules,
        age_verification: true,
        income_validation: true,
        goal_reasonableness: true
      };
    
    case 'fee_benchmark':
      return {
        ...commonRules,
        peer_group_validation: true,
        market_data_fresh: true,
        disclosure_provided: true
      };
    
    case 'portfolio_rebalance':
      return {
        ...commonRules,
        risk_assessment: true,
        diversification_check: true,
        cost_analysis: true
      };
    
    case 'prior_auth_review':
      return {
        ...commonRules,
        medical_necessity: true,
        coverage_verification: true,
        clinical_guidelines: true
      };
    
    case 'cohort_analysis':
      return {
        ...commonRules,
        privacy_preserved: true,
        sample_size_adequate: true,
        statistical_significance: true
      };
    
    default:
      return commonRules;
  }
}

/**
 * Fetch the latest Decision-RDS for a subject
 */
export async function getLatestDecisionRDS(subjectId: string, action?: string): Promise<DecisionRDS | null> {
  if (CONFIG.DEMO_MODE) {
    return demoService.mockNetworkCall(`/decisions/latest/${subjectId}`, null);
  }

  try {
    let query = supabase
      .from('accounting_receipts')
      .select('*')
      .eq('subject_id', subjectId)
      .eq('subject_type', 'decision');

    if (action) {
      query = query.eq('event_type', action);
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching latest Decision-RDS:', error);
      return null;
    }

    if (!data) return null;

    // Convert back to Decision-RDS format
    const metadata = data.metadata as any;
    return {
      id: data.id,
      type: 'Decision-RDS',
      subject_id: data.subject_id,
      action: data.event_type,
      reasons: data.reason_code?.split(',') || [],
      result: metadata.result || 'approve',
      inputs_hash: metadata.inputs_hash || '',
      policy_hash: metadata.policy_hash || '',
      model_id: metadata.model_id,
      receipt_hash: data.content_hash,
      policy_version: metadata.policy_version || 'DEFAULT-2024.09',
      anchor_ref: metadata.anchor_ref,
      created_at: data.created_at,
      metadata: metadata.metadata
    };

  } catch (error) {
    console.error('Failed to fetch latest Decision-RDS:', error);
    return null;
  }
}

/**
 * Fetch all Decision-RDS records for a subject
 */
export async function getDecisionRDSHistory(subjectId: string, limit: number = 10): Promise<DecisionRDS[]> {
  if (CONFIG.DEMO_MODE) {
    return demoService.mockNetworkCall(`/decisions/history/${subjectId}`, []);
  }

  try {
    const { data, error } = await supabase
      .from('accounting_receipts')
      .select('*')
      .eq('subject_id', subjectId)
      .eq('subject_type', 'decision')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching Decision-RDS history:', error);
      return [];
    }

    return data.map(record => {
      const metadata = record.metadata as any;
      return {
        id: record.id,
        type: 'Decision-RDS' as const,
        subject_id: record.subject_id,
        action: record.event_type,
        reasons: record.reason_code?.split(',') || [],
        result: metadata.result || 'approve',
        inputs_hash: metadata.inputs_hash || '',
        policy_hash: metadata.policy_hash || '',
        model_id: metadata.model_id,
        receipt_hash: record.content_hash,
        policy_version: metadata.policy_version || 'DEFAULT-2024.09',
        anchor_ref: metadata.anchor_ref,
        created_at: record.created_at,
        metadata: metadata.metadata
      };
    });

  } catch (error) {
    console.error('Failed to fetch Decision-RDS history:', error);
    return [];
  }
}