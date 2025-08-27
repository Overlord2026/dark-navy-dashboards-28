/**
 * Revenue Share Engine
 * Handles rules, ledger, and payouts with content-free receipts
 */

import { supabase } from '@/integrations/supabase/client';
import { recordReceipt } from './receipts';
import { inputs_hash } from '@/lib/canonical';

export interface RevenueRule {
  id: string;
  rule_type: 'commission_split' | 'override' | 'bonus' | 'royalty';
  conditions: Record<string, any>;
  split_percentage: number;
  effective_from: string;
  effective_to?: string;
  active: boolean;
}

export interface RevenueLedgerEntry {
  id: string;
  period: string;
  iar_id: string;
  gross_revenue: number;
  net_revenue: number;
  split_amount: number;
  rule_ids: string[];
  reasons: string[];
  processed_at: string;
}

export interface PayoutRequest {
  id: string;
  period: string;
  iar_id: string;
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  tax_forms_required: boolean;
  processed_at?: string;
}

/**
 * Imports revenue data and normalizes for processing
 */
export async function importRevenue(
  period: string, 
  iarId: string, 
  rows: Array<{ amount: number; product_type: string; client_hash: string }>
): Promise<void> {
  const normalizedData = rows.map(row => ({
    period,
    iar_id: iarId,
    gross_amount: row.amount,
    product_type: row.product_type,
    client_hash: row.client_hash, // Content-free identifier
    imported_at: new Date().toISOString()
  }));

  const { error } = await supabase
    .from('revenue_import')
    .insert(normalizedData);

  if (error) throw error;

  // Record import receipt
  const importHash = await inputs_hash({
    period,
    iar_id: iarId,
    rows_count: rows.length,
    total_gross: rows.reduce((sum, r) => sum + r.amount, 0)
  });

  await recordReceipt({
    type: 'RevenueImport-RDS',
    ts: new Date().toISOString(),
    period,
    iar_id: iarId,
    import_hash: importHash,
    policy_version: 'v1.0'
  });
}

/**
 * Applies revenue sharing rules and creates ledger entries
 */
export async function applyRules(period: string, iarId: string): Promise<RevenueLedgerEntry[]> {
  // Get imported revenue for period
  const { data: imports, error: importError } = await supabase
    .from('revenue_import')
    .select('*')
    .eq('period', period)
    .eq('iar_id', iarId);

  if (importError) throw importError;

  // Get active rules
  const { data: rules, error: rulesError } = await supabase
    .from('revenue_rules')
    .select('*')
    .eq('iar_id', iarId)
    .eq('active', true)
    .lte('effective_from', new Date().toISOString());

  if (rulesError) throw rulesError;

  const ledgerEntries: RevenueLedgerEntry[] = [];
  const grossRevenue = imports?.reduce((sum, imp) => sum + imp.gross_amount, 0) || 0;

  // Apply rules logic
  for (const rule of rules || []) {
    const splitAmount = grossRevenue * (rule.split_percentage / 100);
    const reasons = [`Applied rule ${rule.rule_type}`, `Split: ${rule.split_percentage}%`];

    const entry: RevenueLedgerEntry = {
      id: crypto.randomUUID(),
      period,
      iar_id: iarId,
      gross_revenue: grossRevenue,
      net_revenue: grossRevenue - splitAmount,
      split_amount: splitAmount,
      rule_ids: [rule.id],
      reasons,
      processed_at: new Date().toISOString()
    };

    ledgerEntries.push(entry);
  }

  // Insert to ledger
  if (ledgerEntries.length > 0) {
    const entriesWithHashes = await Promise.all(
      ledgerEntries.map(async (entry) => ({
        ...entry,
        reasons_hash: await inputs_hash({ reasons: entry.reasons }) // Content-free
      }))
    );

    const { error: ledgerError } = await supabase
      .from('revenue_ledger')
      .insert(entriesWithHashes);

    if (ledgerError) throw ledgerError;
  }

  // Record recalc receipt
  await recordReceipt({
    type: 'Recalc-RDS',
    ts: new Date().toISOString(),
    period,
    iar_id: iarId,
    entries_count: ledgerEntries.length,
    policy_version: 'v1.0'
  });

  return ledgerEntries;
}

/**
 * Processes payouts with tax receipts
 */
export async function processPayout(iarId: string, period: string): Promise<string> {
  // Get ledger entries for period
  const { data: entries, error } = await supabase
    .from('revenue_ledger')
    .select('*')
    .eq('iar_id', iarId)
    .eq('period', period);

  if (error) throw error;

  const totalPayout = entries?.reduce((sum, entry) => sum + entry.split_amount, 0) || 0;

  // Create payout request
  const { data: payout, error: payoutError } = await supabase
    .from('payout_requests')
    .insert({
      period,
      iar_id: iarId,
      amount: totalPayout,
      status: 'pending',
      tax_forms_required: totalPayout >= 600, // 1099 threshold
      created_at: new Date().toISOString()
    })
    .select('id')
    .single();

  if (payoutError) throw payoutError;

  // Record payout and tax receipts
  const payoutHash = await inputs_hash({
    period,
    iar_id: iarId,
    amount: totalPayout,
    tax_required: totalPayout >= 600
  });

  await Promise.all([
    recordReceipt({
      type: 'Payout-RDS',
      ts: new Date().toISOString(),
      period,
      iar_id: iarId,
      payout_hash: payoutHash,
      policy_version: 'v1.0'
    }),
    recordReceipt({
      type: 'Tax-RDS',
      ts: new Date().toISOString(),
      period,
      iar_id: iarId,
      tax_year: new Date().getFullYear(),
      form_1099_required: totalPayout >= 600,
      policy_version: 'v1.0'
    })
  ]);

  return payout.id;
}

/**
 * Explains revenue split calculation
 */
export function explainSplit(entry: RevenueLedgerEntry): {
  explanation: string;
  breakdown: Array<{ rule: string; percentage: number; amount: number }>;
} {
  const breakdown = entry.rule_ids.map(ruleId => ({
    rule: `Rule ${ruleId}`,
    percentage: (entry.split_amount / entry.gross_revenue) * 100,
    amount: entry.split_amount
  }));

  const explanation = `
    Gross Revenue: $${entry.gross_revenue.toFixed(2)}
    Split Amount: $${entry.split_amount.toFixed(2)}
    Net Revenue: $${entry.net_revenue.toFixed(2)}
    
    Applied Rules: ${entry.reasons.join(', ')}
  `;

  return { explanation, breakdown };
}

/**
 * Gets revenue summary for IAR
 */
export async function getRevenueSummary(iarId: string, periods: string[] = []): Promise<{
  total_gross: number;
  total_net: number;
  total_splits: number;
  periods_processed: number;
}> {
  let query = supabase
    .from('revenue_ledger')
    .select('gross_revenue, net_revenue, split_amount')
    .eq('iar_id', iarId);

  if (periods.length > 0) {
    query = query.in('period', periods);
  }

  const { data, error } = await query;
  if (error) throw error;

  return {
    total_gross: data?.reduce((sum, entry) => sum + entry.gross_revenue, 0) || 0,
    total_net: data?.reduce((sum, entry) => sum + entry.net_revenue, 0) || 0,
    total_splits: data?.reduce((sum, entry) => sum + entry.split_amount, 0) || 0,
    periods_processed: data?.length || 0
  };
}