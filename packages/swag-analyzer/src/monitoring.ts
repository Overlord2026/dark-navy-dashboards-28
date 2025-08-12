/**
 * SWAG Monitoring and Risk Management
 * Circuit breakers, thresholds, and breach evaluation
 */

// @claim-step: monitoring thresholds & breach evaluation
export interface MonitoringPolicy { 
  thresholds: Partial<Record<string, number>>; 
}

export function evaluateThresholds(metrics: Record<string, number>, policy: MonitoringPolicy) {
  const breaches = Object.entries(policy.thresholds || {})
    .filter(([k, v]) => {
      if (v === undefined) return false;
      if (k.endsWith('_floor')) return (metrics[k.replace('_floor', '')] ?? 0) < v;
      return (metrics[k] ?? 0) >= v;
    })
    .map(([k]) => k);
  return breaches;
}

// @claim-step: circuit-breaker and staged re-risk ladder
export function breachState(sig: { ddZ: number; ddDays: number }, z = 2.0, minDays = 10) {
  return sig.ddZ >= z && sig.ddDays >= minDays;
}

export function reRiskStages(state: { vol: number; breadth: number; regime: string }) {
  const stages: any[] = [];
  if (state.vol < 0.6 && state.breadth > 0.6) stages.push({ addPct: 0.4 });
  if (state.regime === 'RECOVERY') stages.push({ addPct: 0.6 });
  return stages;
}