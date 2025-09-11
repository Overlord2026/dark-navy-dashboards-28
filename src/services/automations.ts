/**
 * Asset Management Automations Registry
 * Handles rebalance, TLH, drift, cash sweep with attestation
 */

import { supabase } from '@/integrations/supabase/client';
import { recordReceipt } from './receipts';
import { withAttestation } from './attestation';
import * as Canonical from '@/lib/canonical';

export type AutomationKey = 'rebalance' | 'tlh' | 'drift_check' | 'cash_sweep';

export interface AutomationConfig {
  key: AutomationKey;
  name: string;
  description: string;
  price_plan: 'basic' | 'premium' | 'enterprise';
  min_account_value: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  enabled: boolean;
}

export interface HouseholdEnrollment {
  household_id: string;
  automation_key: AutomationKey;
  enrolled_at: string;
  parameters: Record<string, any>;
  active: boolean;
}

export interface AutomationResult {
  trades_suggested: number;
  trades_executed: number;
  tax_loss_harvested?: number;
  cash_swept?: number;
  drift_percentage?: number;
  explanation: string;
}

const AUTOMATION_REGISTRY: Record<AutomationKey, AutomationConfig> = {
  rebalance: {
    key: 'rebalance',
    name: 'Portfolio Rebalancing',
    description: 'Automatically rebalance portfolios to target allocations',
    price_plan: 'basic',
    min_account_value: 10000,
    frequency: 'monthly',
    enabled: true
  },
  tlh: {
    key: 'tlh',
    name: 'Tax Loss Harvesting',
    description: 'Harvest tax losses while maintaining portfolio exposure',
    price_plan: 'premium',
    min_account_value: 50000,
    frequency: 'daily',
    enabled: true
  },
  drift_check: {
    key: 'drift_check',
    name: 'Drift Monitoring',
    description: 'Monitor and alert on portfolio drift from targets',
    price_plan: 'basic',
    min_account_value: 5000,
    frequency: 'daily',
    enabled: true
  },
  cash_sweep: {
    key: 'cash_sweep',
    name: 'Cash Sweep',
    description: 'Automatically invest excess cash above threshold',
    price_plan: 'basic',
    min_account_value: 1000,
    frequency: 'weekly',
    enabled: true
  }
};

/**
 * Gets automation configuration
 */
export function getAutomationConfig(key: AutomationKey): AutomationConfig {
  return AUTOMATION_REGISTRY[key];
}

/**
 * Lists all available automations
 */
export function listAutomations(): AutomationConfig[] {
  return Object.values(AUTOMATION_REGISTRY);
}

/**
 * Checks entitlements for automation access
 */
export async function checkAutomationEntitlement(
  userId: string, 
  automationKey: AutomationKey
): Promise<boolean> {
  const config = AUTOMATION_REGISTRY[automationKey];
  
  // Check user entitlements
  const qb = (supabase as any).from('user_entitlements');
  const { data: entitlement, error } = await qb
    .select('*')
    .eq('user_id', userId)
    .eq('feature_key', `automation_${automationKey}`)
    .eq('active', true)
    .limit(1);

  if (error) return false;
  
  // Check plan access
  const userPlan = (entitlement as any)?.plan || 'basic';
  const requiredPlans = {
    basic: ['basic', 'premium', 'enterprise'],
    premium: ['premium', 'enterprise'],
    enterprise: ['enterprise']
  };

  return requiredPlans[config.price_plan].includes(userPlan);
}

/**
 * Enrolls household in automation
 */
export async function enrollHousehold(
  householdId: string,
  automationKey: AutomationKey,
  parameters: Record<string, any> = {}
): Promise<void> {
  const { error } = await supabase
    .from('automation_enrollments')
    .insert({
      household_id: householdId,
      feature_key: automationKey,
      granted_at: new Date().toISOString(),
      plan: 'automation',
      user_id: householdId
    } as any);

  if (error) throw error;

  // Record enrollment
  await recordReceipt({
    type: 'AutomationEnroll-RDS',
    ts: new Date().toISOString(),
    household_id: householdId,
    automation_key: automationKey,
    policy_version: 'v1.0'
  });
}

/**
 * Runs automation with full attestation and receipts
 */
export async function runAutomation(
  key: AutomationKey,
  householdId: string,
  parameters: Record<string, any> = {}
): Promise<{ result: AutomationResult; attestation_id: string }> {
  const config = AUTOMATION_REGISTRY[key];
  
  // Run with attestation
  const { result, attestation_id } = await withAttestation(
    `automation_${key}`,
    async () => {
      // Simulate automation logic
      const result = await executeAutomation(key, householdId, parameters);
      return result;
    },
    { household_id: householdId, automation_key: key }
  );

  // Generate content-free hashes
  const explainabilityHash = await Canonical.inputs_hash({
    automation: key,
    household_id: householdId,
    explanation_length: result.explanation.length,
    timestamp: new Date().toISOString()
  });

  const tradeHash = await Canonical.inputs_hash({
    household_id: householdId,
    trades_suggested: result.trades_suggested,
    trades_executed: result.trades_executed,
    timestamp: new Date().toISOString()
  });

  // Record automation receipts
  await Promise.all([
    recordReceipt({
      type: 'AutomationRun-RDS',
      ts: new Date().toISOString(),
      household_id: householdId,
      automation_key: key,
      attestation_id,
      policy_version: 'v1.0'
    }),
    recordReceipt({
      type: 'Explainability-RDS',
      ts: new Date().toISOString(),
      household_id: householdId,
      automation_key: key,
      explanation_hash: explainabilityHash,
      policy_version: 'v1.0'
    }),
    recordReceipt({
      type: 'Trade-RDS',
      ts: new Date().toISOString(),
      household_id: householdId,
      trade_hash: tradeHash,
      trades_count: result.trades_executed,
      policy_version: 'v1.0'
    })
  ]);

  return { result, attestation_id };
}

/**
 * Executes specific automation logic (placeholder implementations)
 */
async function executeAutomation(
  key: AutomationKey,
  householdId: string,
  parameters: Record<string, any>
): Promise<AutomationResult> {
  switch (key) {
    case 'rebalance':
      return {
        trades_suggested: 5,
        trades_executed: 4,
        explanation: 'Rebalanced portfolio to target allocation. 4 trades executed to bring asset classes within 2% of targets.'
      };

    case 'tlh':
      return {
        trades_suggested: 3,
        trades_executed: 3,
        tax_loss_harvested: 1250.50,
        explanation: 'Harvested $1,250.50 in tax losses while maintaining portfolio exposure through similar ETFs.'
      };

    case 'drift_check':
      return {
        trades_suggested: 0,
        trades_executed: 0,
        drift_percentage: 1.2,
        explanation: 'Portfolio drift of 1.2% detected. Within tolerance threshold of 5%. No rebalancing required.'
      };

    case 'cash_sweep':
      return {
        trades_suggested: 1,
        trades_executed: 1,
        cash_swept: 2500.00,
        explanation: 'Swept $2,500 excess cash into target allocation. Invested in low-cost index funds per policy.'
      };

    default:
      throw new Error(`Unknown automation: ${key}`);
  }
}

/**
 * Gets automation status for household
 */
export async function getHouseholdAutomations(householdId: string): Promise<HouseholdEnrollment[]> {
  const { data, error } = await (supabase as any)
    .from('automation_enrollments')
    .select('*')
    .eq('household_id', householdId)
    .eq('active', true);

  if (error) throw error;
  
  const appEnrollments: HouseholdEnrollment[] = (data ?? []).map((e: any) => ({
    household_id: e.household_id ?? '',
    automation_key: e.feature_key,
    enrolled_at: e.granted_at ?? new Date().toISOString(),
    parameters: {},
    active: true
  }));
  
  return appEnrollments;
}

/**
 * Unenroll household from automation
 */
export async function unenrollHousehold(
  householdId: string,
  automationKey: AutomationKey
): Promise<void> {
  const { error } = await supabase
    .from('automation_enrollments')
    .update({ 
      active: false, 
      disenrolled_at: new Date().toISOString() 
    } as any)
    .eq('household_id', householdId)
    .eq('feature_key', automationKey);

  if (error) throw error;
}

/**
 * Gets automation run history
 */
export async function getAutomationHistory(
  householdId: string,
  automationKey?: AutomationKey,
  limit: number = 50
): Promise<any[]> {
  const qb = (supabase as any).from('automation_runs');
  let query = qb
    .select('*')
    .eq('household_id', householdId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (automationKey) {
    query = query.eq('automation_key', automationKey);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}