import { supabase } from '@/integrations/supabase/client';

export interface LiquidityScoreInput {
  fundId: string;
  horizonDays?: number;
  events?: LiquidityEvent[];
  managerSignals?: any[];
}

export interface LiquidityEvent {
  event_date: string;
  event_type: 'gate' | 'partial-fill' | 'queue' | 'pause' | 'resume';
  details?: any;
}

export interface LiquidityScoreBreakdown {
  gateProb: number;
  navToCash: number;
  fulfillment: number;
  penalties: number;
  vintageAdj: number;
  aumTrendAdj: number;
}

export interface LiquidityScoreResult {
  score: number; // 0-100
  breakdown: LiquidityScoreBreakdown;
}

// Default scoring weights
const DEFAULT_WEIGHTS = {
  gateProb: 0.35,
  navToCash: 0.25,
  fulfillment: 0.20,
  penalties: 0.10,
  vintageAdj: 0.05,
  aumTrendAdj: 0.05
};

export async function scoreLiquidity(input: LiquidityScoreInput): Promise<LiquidityScoreResult> {
  const { fundId, horizonDays = 90, events, managerSignals = [] } = input;

  // Fetch recent liquidity events if not provided
  let liquidityEvents = events;
  if (!liquidityEvents) {
    const { data, error } = await supabase
      .from('liquidity_events')
      .select('*')
      .eq('fund_id', fundId)
      .gte('event_date', new Date(Date.now() - horizonDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('event_date', { ascending: false });

    if (error) {
      console.warn(`Failed to fetch liquidity events: ${error.message}`);
      liquidityEvents = [];
    } else {
      liquidityEvents = (data || []).map(event => ({
        ...event,
        event_type: event.event_type as 'pause' | 'resume' | 'gate' | 'partial-fill' | 'queue'
      }));
    }
  }

  // Calculate component scores
  const breakdown: LiquidityScoreBreakdown = {
    gateProb: calculateGateProbability(liquidityEvents, horizonDays),
    navToCash: calculateNavToCashScore(liquidityEvents, managerSignals),
    fulfillment: calculateFulfillmentScore(liquidityEvents),
    penalties: calculatePenaltyScore(managerSignals),
    vintageAdj: calculateVintageAdjustment(fundId),
    aumTrendAdj: calculateAumTrendAdjustment(managerSignals)
  };

  // Calculate weighted score
  const score = Math.round(
    breakdown.gateProb * DEFAULT_WEIGHTS.gateProb +
    breakdown.navToCash * DEFAULT_WEIGHTS.navToCash +
    breakdown.fulfillment * DEFAULT_WEIGHTS.fulfillment +
    breakdown.penalties * DEFAULT_WEIGHTS.penalties +
    breakdown.vintageAdj * DEFAULT_WEIGHTS.vintageAdj +
    breakdown.aumTrendAdj * DEFAULT_WEIGHTS.aumTrendAdj
  );

  return { score: Math.max(0, Math.min(100, score)), breakdown };
}

function calculateGateProbability(events: LiquidityEvent[], horizonDays: number): number {
  if (events.length === 0) return 80; // Neutral score for no data

  const gateEvents = events.filter(e => e.event_type === 'gate' || e.event_type === 'pause');
  const totalEvents = events.length;
  
  if (totalEvents === 0) return 80;
  
  const gateRatio = gateEvents.length / totalEvents;
  
  // Recent gate events severely impact score
  const recentGates = gateEvents.filter(e => {
    const eventDate = new Date(e.event_date);
    const cutoff = new Date(Date.now() - (horizonDays / 2) * 24 * 60 * 60 * 1000);
    return eventDate >= cutoff;
  });

  let score = 100 - (gateRatio * 60); // Base penalty for historical gates
  
  if (recentGates.length > 0) {
    score -= 30; // Additional penalty for recent gates
  }

  return Math.max(0, Math.min(100, score));
}

function calculateNavToCashScore(events: LiquidityEvent[], managerSignals: any[]): number {
  // Look for queue/partial-fill events which indicate NAV→cash delays
  const delayEvents = events.filter(e => 
    e.event_type === 'queue' || e.event_type === 'partial-fill'
  );

  let score = 85; // Start with good score

  if (delayEvents.length > 0) {
    // More delay events = worse score
    score -= Math.min(40, delayEvents.length * 10);
  }

  // Factor in manager signals about redemption timelines
  const redemptionSignals = managerSignals.filter(s => 
    s.signal_type === 'redemption_timeline' || s.signal_type === 'liquidity_timeline'
  );

  for (const signal of redemptionSignals) {
    if (signal.signal_value > 90) { // Days
      score -= 20;
    } else if (signal.signal_value > 60) {
      score -= 10;
    }
  }

  return Math.max(0, Math.min(100, score));
}

function calculateFulfillmentScore(events: LiquidityEvent[]): number {
  if (events.length === 0) return 75; // Neutral score

  const totalRedemptionRequests = events.filter(e => 
    e.event_type === 'queue' || e.event_type === 'partial-fill' || e.event_type === 'resume'
  ).length;

  const partialFills = events.filter(e => e.event_type === 'partial-fill').length;
  
  if (totalRedemptionRequests === 0) return 90;
  
  const fulfillmentRate = 1 - (partialFills / totalRedemptionRequests);
  return Math.round(fulfillmentRate * 100);
}

function calculatePenaltyScore(managerSignals: any[]): number {
  let score = 90; // Start optimistic

  const penaltySignals = managerSignals.filter(s => 
    s.signal_type === 'early_redemption_penalty' || s.signal_type === 'gate_penalty'
  );

  for (const signal of penaltySignals) {
    if (signal.signal_value > 5) { // High penalty %
      score -= 30;
    } else if (signal.signal_value > 2) {
      score -= 15;
    } else if (signal.signal_value > 0) {
      score -= 5;
    }
  }

  return Math.max(0, Math.min(100, score));
}

function calculateVintageAdjustment(fundId: string): number {
  // Newer funds (post-2020) might have less liquidity track record
  // This is a simplified heuristic - in production would query fund metadata
  const isRecentVintage = fundId.includes('2023') || fundId.includes('2024') || fundId.includes('2025');
  
  return isRecentVintage ? 70 : 85;
}

function calculateAumTrendAdjustment(managerSignals: any[]): number {
  const aumSignals = managerSignals.filter(s => s.signal_type === 'aum_trend');
  
  if (aumSignals.length === 0) return 80;
  
  const latestSignal = aumSignals[aumSignals.length - 1];
  
  if (latestSignal.signal_value > 1.1) { // Growing AUM
    return 90;
  } else if (latestSignal.signal_value < 0.9) { // Shrinking AUM
    return 60;
  }
  
  return 80;
}

// Persist liquidity score to database
export async function persistLiquidityScore(
  userId: string,
  fundId: string,
  inputs: LiquidityScoreInput,
  result: LiquidityScoreResult,
  asOfDate?: string
): Promise<string> {
  const { data, error } = await supabase
    .from('liquidity_scores')
    .upsert({
      user_id: userId,
      fund_id: fundId,
      as_of_date: asOfDate || new Date().toISOString().split('T')[0],
      inputs: JSON.stringify(inputs),
      score: result.score,
      breakdown: JSON.stringify(result.breakdown)
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to persist liquidity score: ${error.message}`);
  }

  return data.id;
}