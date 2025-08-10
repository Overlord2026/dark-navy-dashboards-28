import { supabase } from '@/integrations/supabase/client';

export interface OverlapResult {
  pairwise: Record<string, number>;
  topContributors: Array<{
    holding_id: string;
    name: string;
    total_weight: number;
    fund_count: number;
  }>;
  sectorHeatmap: Record<string, number>;
}

export interface OverlapInput {
  fundIds: string[];
  asOfDate?: string;
}

export async function computeOverlap(input: OverlapInput): Promise<OverlapResult> {
  const { fundIds, asOfDate = new Date().toISOString().split('T')[0] } = input;
  
  if (fundIds.length < 2) {
    throw new Error('At least 2 funds required for overlap analysis');
  }

  // Fetch holdings for all funds
  const { data: holdings, error } = await supabase
    .from('fund_holdings_lookup')
    .select('*')
    .in('fund_id', fundIds)
    .lte('as_of_date', asOfDate)
    .order('as_of_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch holdings: ${error.message}`);
  }

  if (!holdings || holdings.length === 0) {
    return {
      pairwise: {},
      topContributors: [],
      sectorHeatmap: {}
    };
  }

  // Group holdings by fund
  const fundHoldings = holdings.reduce((acc, holding) => {
    if (!acc[holding.fund_id]) {
      acc[holding.fund_id] = new Map();
    }
    
    // Use most recent holding for each fund/holding combination
    const existingHolding = acc[holding.fund_id].get(holding.holding_id);
    if (!existingHolding || holding.as_of_date > existingHolding.as_of_date) {
      acc[holding.fund_id].set(holding.holding_id, holding);
    }
    
    return acc;
  }, {} as Record<string, Map<string, any>>);

  // Calculate pairwise overlaps using weighted Jaccard similarity
  const pairwise: Record<string, number> = {};
  
  for (let i = 0; i < fundIds.length; i++) {
    for (let j = i + 1; j < fundIds.length; j++) {
      const fund1 = fundIds[i];
      const fund2 = fundIds[j];
      const key = `${fund1}_${fund2}`;
      
      const holdings1 = fundHoldings[fund1] || new Map();
      const holdings2 = fundHoldings[fund2] || new Map();
      
      if (holdings1.size === 0 || holdings2.size === 0) {
        pairwise[key] = 0;
        continue;
      }
      
      // Calculate weighted overlap
      let intersection = 0;
      let union = 0;
      
      const allHoldings = new Set([...holdings1.keys(), ...holdings2.keys()]);
      
      for (const holdingId of allHoldings) {
        const weight1 = holdings1.get(holdingId)?.weight_pct || 0;
        const weight2 = holdings2.get(holdingId)?.weight_pct || 0;
        
        intersection += Math.min(weight1, weight2);
        union += Math.max(weight1, weight2);
      }
      
      pairwise[key] = union > 0 ? intersection / union : 0;
    }
  }

  // Find top contributors (holdings appearing in multiple funds)
  const holdingContribution = new Map<string, {
    name: string;
    total_weight: number;
    fund_count: number;
    sector?: string;
  }>();

  for (const [fundId, holdings] of Object.entries(fundHoldings)) {
    for (const holding of holdings.values()) {
      const current = holdingContribution.get(holding.holding_id) || {
        name: holding.holding_name,
        total_weight: 0,
        fund_count: 0,
        sector: holding.sector
      };
      
      current.total_weight += holding.weight_pct || 0;
      current.fund_count += 1;
      holdingContribution.set(holding.holding_id, current);
    }
  }

  const topContributors = Array.from(holdingContribution.entries())
    .map(([holding_id, data]) => ({
      holding_id,
      name: data.name,
      total_weight: data.total_weight,
      fund_count: data.fund_count
    }))
    .filter(item => item.fund_count > 1) // Only holdings in multiple funds
    .sort((a, b) => b.total_weight - a.total_weight)
    .slice(0, 20);

  // Calculate sector heatmap
  const sectorHeatmap: Record<string, number> = {};
  
  for (const [fundId, holdings] of Object.entries(fundHoldings)) {
    for (const holding of holdings.values()) {
      if (holding.sector) {
        sectorHeatmap[holding.sector] = (sectorHeatmap[holding.sector] || 0) + (holding.weight_pct || 0);
      }
    }
  }

  return {
    pairwise,
    topContributors,
    sectorHeatmap
  };
}

// Persist overlap results to database
export async function persistOverlapResults(
  userId: string,
  portfolioId: string | null,
  scope: OverlapInput,
  results: OverlapResult
): Promise<string> {
  const { data, error } = await supabase
    .from('fund_holdings_overlap')
    .insert({
      user_id: userId,
      portfolio_id: portfolioId,
      scope: JSON.stringify(scope),
      overlap_metrics: JSON.stringify(results)
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to persist overlap results: ${error.message}`);
  }

  return data.id;
}