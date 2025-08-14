const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// GET /billing/summary - Get billing summary for entity
router.get('/summary', async (req, res) => {
  try {
    const { 
      entity_id, 
      from, 
      to = new Date().toISOString().split('T')[0],
      granularity = 'daily' // daily, weekly, monthly
    } = req.query;

    if (!entity_id) {
      return res.status(400).json({ error: 'entity_id is required' });
    }

    if (!from) {
      return res.status(400).json({ error: 'from date is required' });
    }

    // Validate date format
    const fromDate = new Date(from);
    const toDate = new Date(to);
    
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }

    let query = supabase
      .from('billing_daily')
      .select('*')
      .eq('entity_id', entity_id)
      .gte('billing_date', from)
      .lte('billing_date', to)
      .order('billing_date', { ascending: true });

    const { data: billingData, error } = await query;

    if (error) {
      console.error('Error fetching billing data:', error);
      return res.status(500).json({ error: 'Failed to fetch billing data' });
    }

    // Aggregate data based on granularity
    const aggregatedData = aggregateByGranularity(billingData, granularity);

    // Calculate summary totals
    const summary = {
      entity_id: entity_id,
      period: { from, to },
      granularity: granularity,
      total_cost: billingData.reduce((sum, b) => sum + (b.total_estimated_cost || 0), 0),
      total_accounts: Math.max(...billingData.map(b => b.active_synced_accounts || 0), 0),
      total_alt_positions: Math.max(...billingData.map(b => b.alt_positions_monitored || 0), 0),
      total_notarizations: billingData.reduce((sum, b) => sum + (b.notarizations_completed || 0), 0),
      total_vendor_cost: billingData.reduce((sum, b) => sum + (b.total_vendor_cost || 0), 0),
      data: aggregatedData,
      cost_breakdown: calculateCostBreakdown(billingData),
      vendor_usage: calculateVendorUsage(billingData)
    };

    res.json(summary);

  } catch (error) {
    console.error('Billing summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /billing/entities - Get billing summary for all entities (admin only)
router.get('/entities', async (req, res) => {
  try {
    const { 
      date = new Date().toISOString().split('T')[0],
      sort_by = 'total_estimated_cost',
      sort_order = 'desc',
      limit = 100,
      offset = 0
    } = req.query;

    let query = supabase
      .from('billing_daily')
      .select(`
        entity_id,
        billing_date,
        active_synced_accounts,
        alt_positions_monitored,
        notarizations_completed,
        total_estimated_cost,
        total_vendor_cost,
        entities(entity_name, status)
      `)
      .eq('billing_date', date)
      .order(sort_by, { ascending: sort_order === 'asc' })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    const { data: billingData, error } = await query;

    if (error) {
      console.error('Error fetching entities billing data:', error);
      return res.status(500).json({ error: 'Failed to fetch billing data' });
    }

    // Calculate totals
    const totals = {
      total_entities: billingData.length,
      total_cost: billingData.reduce((sum, b) => sum + (b.total_estimated_cost || 0), 0),
      total_accounts: billingData.reduce((sum, b) => sum + (b.active_synced_accounts || 0), 0),
      total_alt_positions: billingData.reduce((sum, b) => sum + (b.alt_positions_monitored || 0), 0),
      total_notarizations: billingData.reduce((sum, b) => sum + (b.notarizations_completed || 0), 0),
      total_vendor_cost: billingData.reduce((sum, b) => sum + (b.total_vendor_cost || 0), 0)
    };

    res.json({
      date: date,
      totals: totals,
      entities: billingData
    });

  } catch (error) {
    console.error('Entities billing error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /billing/usage/:entity_id - Get detailed usage metrics
router.get('/usage/:entity_id', async (req, res) => {
  try {
    const { entity_id } = req.params;
    const { 
      from, 
      to = new Date().toISOString().split('T')[0],
      metric_type // accounts, positions, notarizations, vendor_calls
    } = req.query;

    if (!from) {
      return res.status(400).json({ error: 'from date is required' });
    }

    let response = {};

    // Get billing data for the period
    const { data: billingData, error: billingError } = await supabase
      .from('billing_daily')
      .select('*')
      .eq('entity_id', entity_id)
      .gte('billing_date', from)
      .lte('billing_date', to)
      .order('billing_date', { ascending: true });

    if (billingError) {
      console.error('Error fetching billing data:', billingError);
      return res.status(500).json({ error: 'Failed to fetch billing data' });
    }

    response.billing_summary = billingData;

    // Get account usage details if requested
    if (!metric_type || metric_type === 'accounts') {
      const { data: accountUsage } = await supabase
        .from('accounts')
        .select(`
          id,
          account_number,
          institution_id,
          last_synced_at,
          sync_frequency,
          institutions(name)
        `)
        .eq('entity_id', entity_id)
        .gte('last_synced_at', from);

      response.account_usage = accountUsage;
    }

    // Get position details if requested
    if (!metric_type || metric_type === 'positions') {
      const { data: positionUsage } = await supabase
        .rpc('get_position_usage_summary', {
          p_entity_id: entity_id,
          p_from_date: from,
          p_to_date: to
        });

      response.position_usage = positionUsage;
    }

    // Get notarization details if requested
    if (!metric_type || metric_type === 'notarizations') {
      const { data: notaryUsage } = await supabase
        .from('notarization_sessions')
        .select(`
          id,
          vendor,
          status,
          created_at,
          completed_at,
          estimated_cost
        `)
        .eq('entity_id', entity_id)
        .gte('created_at', from)
        .lte('created_at', to + 'T23:59:59.999Z');

      response.notary_usage = notaryUsage;
    }

    // Get vendor call details if requested
    if (!metric_type || metric_type === 'vendor_calls') {
      const { data: vendorUsage } = await supabase
        .from('sync_logs')
        .select(`
          id,
          vendor,
          api_calls_made,
          data_volume_kb,
          duration_ms,
          created_at,
          status
        `)
        .eq('entity_id', entity_id)
        .gte('created_at', from)
        .lte('created_at', to + 'T23:59:59.999Z');

      response.vendor_usage = vendorUsage;
    }

    res.json(response);

  } catch (error) {
    console.error('Usage details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions
function aggregateByGranularity(data, granularity) {
  if (granularity === 'daily') {
    return data;
  }

  const grouped = {};
  
  data.forEach(item => {
    let key;
    const date = new Date(item.billing_date);
    
    if (granularity === 'weekly') {
      // Get Monday of the week
      const monday = new Date(date);
      monday.setDate(date.getDate() - (date.getDay() + 6) % 7);
      key = monday.toISOString().split('T')[0];
    } else if (granularity === 'monthly') {
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    
    if (!grouped[key]) {
      grouped[key] = {
        period: key,
        total_estimated_cost: 0,
        total_vendor_cost: 0,
        active_synced_accounts: 0,
        alt_positions_monitored: 0,
        notarizations_completed: 0,
        days_included: 0
      };
    }
    
    grouped[key].total_estimated_cost += item.total_estimated_cost || 0;
    grouped[key].total_vendor_cost += item.total_vendor_cost || 0;
    grouped[key].active_synced_accounts = Math.max(grouped[key].active_synced_accounts, item.active_synced_accounts || 0);
    grouped[key].alt_positions_monitored = Math.max(grouped[key].alt_positions_monitored, item.alt_positions_monitored || 0);
    grouped[key].notarizations_completed += item.notarizations_completed || 0;
    grouped[key].days_included += 1;
  });
  
  return Object.values(grouped);
}

function calculateCostBreakdown(data) {
  const breakdown = {
    base_cost: 0,
    alts_cost: 0,
    notary_cost: 0,
    vendor_cost: 0
  };
  
  data.forEach(item => {
    breakdown.base_cost += item.base_cost || 0;
    breakdown.alts_cost += item.alts_cost || 0;
    breakdown.notary_cost += item.notary_cost || 0;
    breakdown.vendor_cost += item.total_vendor_cost || 0;
  });
  
  return breakdown;
}

function calculateVendorUsage(data) {
  const vendorTotals = {};
  
  data.forEach(item => {
    if (item.vendor_costs) {
      Object.entries(item.vendor_costs).forEach(([vendor, cost]) => {
        vendorTotals[vendor] = (vendorTotals[vendor] || 0) + cost;
      });
    }
  });
  
  return vendorTotals;
}

module.exports = router;