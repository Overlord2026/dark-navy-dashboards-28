#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const { publishEvent } = require('../shared/events');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Reconciliation thresholds
const THRESHOLDS = {
  POSITION_UNITS_PCT: 0.01, // 1% variance threshold
  COST_BASIS_PCT: 0.05,     // 5% cost basis variance
  CASH_AMOUNT: 100,         // $100 cash variance
  PRICE_STALENESS_HOURS: 48 // 48 hours for stale prices
};

async function reconcileDaily() {
  console.log('Starting daily reconciliation...');
  
  try {
    // Get accounts with fresh positions (updated in last 24 hours)
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select(`
        id, account_number, entity_id, 
        positions!inner(id, updated_at)
      `)
      .gte('positions.updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (accountsError) throw accountsError;

    console.log(`Found ${accounts.length} accounts with fresh positions`);

    for (const account of accounts) {
      await reconcileAccount(account);
    }

    await publishEvent({
      kind: 'reconciliation.completed',
      payload: { 
        accounts_processed: accounts.length,
        timestamp: new Date().toISOString()
      },
      entity_id: null // System-level event
    });

    console.log('Daily reconciliation completed successfully');
  } catch (error) {
    console.error('Daily reconciliation failed:', error);
    
    await publishEvent({
      kind: 'reconciliation.failed',
      payload: { 
        error: error.message,
        timestamp: new Date().toISOString()
      },
      entity_id: null
    });
  }
}

async function reconcileAccount(account) {
  console.log(`Reconciling account ${account.account_number}`);
  
  try {
    // Get current positions
    const { data: currentPositions } = await supabase
      .from('positions')
      .select('*')
      .eq('account_id', account.id)
      .order('as_of_date', { ascending: false });

    // Get previous day positions for comparison
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data: previousPositions } = await supabase
      .from('positions')
      .select('*')
      .eq('account_id', account.id)
      .lte('as_of_date', yesterday)
      .order('as_of_date', { ascending: false })
      .limit(50);

    // Check position mismatches
    await checkPositionMismatches(account, currentPositions, previousPositions);
    
    // Check for missing symbols
    await checkMissingSymbols(account, currentPositions);
    
    // Check for stale prices
    await checkStalePrices(account, currentPositions);
    
    // Check cash balances
    await checkCashBalances(account);

  } catch (error) {
    console.error(`Failed to reconcile account ${account.account_number}:`, error);
    
    await createException({
      entity_id: account.entity_id,
      account_id: account.id,
      exception_type: 'reconciliation_error',
      severity: 'high',
      description: `Failed to reconcile account: ${error.message}`,
      metadata: { error: error.message }
    });
  }
}

async function checkPositionMismatches(account, current, previous) {
  if (!previous || previous.length === 0) return;

  const previousMap = new Map(previous.map(p => [p.instrument_id, p]));
  
  for (const position of current) {
    const prevPosition = previousMap.get(position.instrument_id);
    if (!prevPosition) continue;

    // Check units variance
    const unitsVariance = Math.abs(position.units - prevPosition.units) / prevPosition.units;
    if (unitsVariance > THRESHOLDS.POSITION_UNITS_PCT) {
      await createException({
        entity_id: account.entity_id,
        account_id: account.id,
        exception_type: 'position_units_mismatch',
        severity: unitsVariance > 0.1 ? 'high' : 'medium',
        description: `Position units variance of ${(unitsVariance * 100).toFixed(2)}% for ${position.symbol}`,
        metadata: {
          symbol: position.symbol,
          current_units: position.units,
          previous_units: prevPosition.units,
          variance_pct: unitsVariance
        }
      });
    }

    // Check cost basis variance
    if (position.cost_basis && prevPosition.cost_basis) {
      const costBasisVariance = Math.abs(position.cost_basis - prevPosition.cost_basis) / prevPosition.cost_basis;
      if (costBasisVariance > THRESHOLDS.COST_BASIS_PCT) {
        await createException({
          entity_id: account.entity_id,
          account_id: account.id,
          exception_type: 'cost_basis_mismatch',
          severity: 'medium',
          description: `Cost basis variance of ${(costBasisVariance * 100).toFixed(2)}% for ${position.symbol}`,
          metadata: {
            symbol: position.symbol,
            current_cost_basis: position.cost_basis,
            previous_cost_basis: prevPosition.cost_basis,
            variance_pct: costBasisVariance
          }
        });
      }
    }
  }
}

async function checkMissingSymbols(account, positions) {
  const missingSymbols = positions.filter(p => !p.symbol || p.symbol.trim() === '');
  
  for (const position of missingSymbols) {
    await createException({
      entity_id: account.entity_id,
      account_id: account.id,
      exception_type: 'missing_symbol',
      severity: 'medium',
      description: `Position missing symbol identifier`,
      metadata: {
        instrument_id: position.instrument_id,
        position_id: position.id
      }
    });
  }
}

async function checkStalePrices(account, positions) {
  const staleThreshold = new Date(Date.now() - THRESHOLDS.PRICE_STALENESS_HOURS * 60 * 60 * 1000);
  
  const stalePositions = positions.filter(p => 
    p.market_value_updated_at && new Date(p.market_value_updated_at) < staleThreshold
  );
  
  for (const position of stalePositions) {
    await createException({
      entity_id: account.entity_id,
      account_id: account.id,
      exception_type: 'stale_price',
      severity: 'low',
      description: `Stale price data for ${position.symbol}`,
      metadata: {
        symbol: position.symbol,
        last_updated: position.market_value_updated_at,
        hours_stale: Math.floor((Date.now() - new Date(position.market_value_updated_at)) / (1000 * 60 * 60))
      }
    });
  }
}

async function checkCashBalances(account) {
  // Get current cash balance
  const { data: currentCash } = await supabase
    .from('accounts')
    .select('cash_balance, updated_at')
    .eq('id', account.id)
    .single();

  // Get previous day cash balance
  const { data: previousCash } = await supabase
    .from('account_snapshots')
    .select('cash_balance')
    .eq('account_id', account.id)
    .lte('snapshot_date', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    .order('snapshot_date', { ascending: false })
    .limit(1)
    .single();

  if (currentCash && previousCash) {
    const cashVariance = Math.abs(currentCash.cash_balance - previousCash.cash_balance);
    
    if (cashVariance > THRESHOLDS.CASH_AMOUNT) {
      await createException({
        entity_id: account.entity_id,
        account_id: account.id,
        exception_type: 'cash_balance_variance',
        severity: cashVariance > 10000 ? 'high' : 'medium',
        description: `Cash balance variance of $${cashVariance.toFixed(2)}`,
        metadata: {
          current_balance: currentCash.cash_balance,
          previous_balance: previousCash.cash_balance,
          variance: cashVariance
        }
      });
    }
  }
}

async function createException(exceptionData) {
  const { error } = await supabase
    .from('exceptions')
    .insert({
      ...exceptionData,
      status: 'open',
      created_at: new Date().toISOString()
    });

  if (error) {
    console.error('Failed to create exception:', error);
    return;
  }

  // Publish event for high severity exceptions
  if (exceptionData.severity === 'high') {
    await publishEvent({
      kind: 'exception.created',
      payload: exceptionData,
      entity_id: exceptionData.entity_id
    });

    // Send webhook notification for high severity
    await sendWebhookNotification(exceptionData);
  }
}

async function sendWebhookNotification(exception) {
  try {
    // Get webhook URL from entity configuration
    const { data: entity } = await supabase
      .from('entities')
      .select('webhook_url, notification_email')
      .eq('id', exception.entity_id)
      .single();

    if (entity?.webhook_url) {
      await fetch(entity.webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'exception.high_severity',
          data: exception,
          timestamp: new Date().toISOString()
        })
      });
    }
  } catch (error) {
    console.error('Failed to send webhook notification:', error);
  }
}

// Run if called directly
if (require.main === module) {
  reconcileDaily()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Reconciliation failed:', error);
      process.exit(1);
    });
}

module.exports = { reconcileDaily };