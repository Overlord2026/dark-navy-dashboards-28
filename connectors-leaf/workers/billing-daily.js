#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const { publishEvent } = require('../shared/events');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Vendor cost estimates (per API call)
const VENDOR_COSTS = {
  plaid: 0.15,
  bridgeft: 0.25,
  akoya: 0.20,
  canoe: 0.30,
  icapital: 0.35,
  docusign: 1.50,
  notarycam: 2.00
};

async function processBillingDaily() {
  console.log('Starting daily billing processing...');
  
  try {
    const billingDate = new Date().toISOString().split('T')[0];
    
    // Get all active entities (families)
    const { data: entities, error: entitiesError } = await supabase
      .from('entities')
      .select('id, entity_name')
      .eq('status', 'active');

    if (entitiesError) throw entitiesError;

    console.log(`Processing billing for ${entities.length} entities`);

    const billingResults = [];

    for (const entity of entities) {
      const billingData = await calculateEntityBilling(entity.id, billingDate);
      billingResults.push(billingData);
    }

    await publishEvent({
      kind: 'billing.daily_processed',
      payload: { 
        billing_date: billingDate,
        entities_processed: entities.length,
        total_estimated_cost: billingResults.reduce((sum, b) => sum + b.total_estimated_cost, 0)
      },
      entity_id: null // System-level event
    });

    console.log('Daily billing processing completed successfully');
  } catch (error) {
    console.error('Daily billing processing failed:', error);
    
    await publishEvent({
      kind: 'billing.daily_failed',
      payload: { 
        error: error.message,
        timestamp: new Date().toISOString()
      },
      entity_id: null
    });
  }
}

async function calculateEntityBilling(entityId, billingDate) {
  console.log(`Calculating billing for entity ${entityId}`);
  
  try {
    // Count active synced accounts (with data in last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const { count: activeSyncedAccounts } = await supabase
      .from('accounts')
      .select('id', { count: 'exact', head: true })
      .eq('entity_id', entityId)
      .gte('last_synced_at', thirtyDaysAgo);

    // Count alt positions monitored
    const { count: altPositionsMonitored } = await supabase
      .from('positions')
      .select('id', { count: 'exact', head: true })
      .eq('entity_id', entityId)
      .in('asset_class', ['private_equity', 'hedge_fund', 'real_estate', 'commodity'])
      .gte('updated_at', thirtyDaysAgo);

    // Count notarizations completed
    const { count: notarizationsCompleted } = await supabase
      .from('notarization_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('entity_id', entityId)
      .eq('status', 'completed')
      .gte('created_at', thirtyDaysAgo);

    // Calculate vendor costs from connector usage
    const vendorCosts = await calculateVendorCosts(entityId, billingDate);

    // Calculate total estimated cost
    const baseCost = activeSyncedAccounts * 10; // $10 per active account
    const altsCost = altPositionsMonitored * 5; // $5 per alt position
    const notaryCost = notarizationsCompleted * 50; // $50 per notarization
    const totalEstimatedCost = baseCost + altsCost + notaryCost + vendorCosts.total;

    const billingData = {
      entity_id: entityId,
      billing_date: billingDate,
      active_synced_accounts: activeSyncedAccounts || 0,
      alt_positions_monitored: altPositionsMonitored || 0,
      notarizations_completed: notarizationsCompleted || 0,
      vendor_costs: vendorCosts.breakdown,
      total_vendor_cost: vendorCosts.total,
      base_cost: baseCost,
      alts_cost: altsCost,
      notary_cost: notaryCost,
      total_estimated_cost: totalEstimatedCost,
      calculated_at: new Date().toISOString()
    };

    // Upsert billing_daily row
    const { error: upsertError } = await supabase
      .from('billing_daily')
      .upsert(billingData, {
        onConflict: 'entity_id,billing_date'
      });

    if (upsertError) {
      console.error(`Failed to upsert billing data for entity ${entityId}:`, upsertError);
    }

    return billingData;

  } catch (error) {
    console.error(`Failed to calculate billing for entity ${entityId}:`, error);
    return {
      entity_id: entityId,
      billing_date: billingDate,
      error: error.message,
      total_estimated_cost: 0
    };
  }
}

async function calculateVendorCosts(entityId, billingDate) {
  const costs = {
    breakdown: {},
    total: 0
  };

  try {
    // Get connector usage from sync logs
    const { data: syncLogs } = await supabase
      .from('sync_logs')
      .select('vendor, api_calls_made')
      .eq('entity_id', entityId)
      .gte('created_at', billingDate)
      .lt('created_at', new Date(new Date(billingDate).getTime() + 24 * 60 * 60 * 1000).toISOString());

    if (syncLogs) {
      for (const log of syncLogs) {
        const vendor = log.vendor.toLowerCase();
        const apiCalls = log.api_calls_made || 0;
        const costPerCall = VENDOR_COSTS[vendor] || 0.10; // Default cost
        const cost = apiCalls * costPerCall;

        costs.breakdown[vendor] = (costs.breakdown[vendor] || 0) + cost;
        costs.total += cost;
      }
    }

    // Get notarization costs
    const { data: notaryLogs } = await supabase
      .from('notarization_sessions')
      .select('vendor')
      .eq('entity_id', entityId)
      .eq('status', 'completed')
      .gte('created_at', billingDate)
      .lt('created_at', new Date(new Date(billingDate).getTime() + 24 * 60 * 60 * 1000).toISOString());

    if (notaryLogs) {
      for (const session of notaryLogs) {
        const vendor = session.vendor.toLowerCase();
        const cost = VENDOR_COSTS[vendor] || 1.00;
        
        costs.breakdown[`notary_${vendor}`] = (costs.breakdown[`notary_${vendor}`] || 0) + cost;
        costs.total += cost;
      }
    }

  } catch (error) {
    console.error('Failed to calculate vendor costs:', error);
  }

  return costs;
}

// Run if called directly
if (require.main === module) {
  processBillingDaily()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Billing processing failed:', error);
      process.exit(1);
    });
}

module.exports = { processBillingDaily };