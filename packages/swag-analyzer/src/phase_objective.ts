/**
 * SWAG Phase Objective Calculator
 * Computes outcome metrics and composite scores
 */

import { OutcomeMetrics } from './models';

// @claim-step: composite OutcomeScore aligned to defined goal outcomes
export function outcomeScore(
  m: OutcomeMetrics,
  w = { ISP: 0.35, DGBP: 0.25, ATE: 0.15, LCI: 0.25 }
): number {
  return w.ISP * m.ISP - w.DGBP * m.DGBP + w.ATE * m.ATE + w.LCI * m.LCI;
}

export function computeOutcomeMetrics(a: {
  isp: number;
  dgbp: number;
  lcr: number;
  lci: number;
  ate: number;
}): OutcomeMetrics {
  const m: OutcomeMetrics = { 
    ISP: a.isp, 
    DGBP: a.dgbp, 
    LCR: a.lcr, 
    LCI: a.lci, 
    ATE: a.ate, 
    OS: 0 
  };
  m.OS = outcomeScore(m);
  return m;
}