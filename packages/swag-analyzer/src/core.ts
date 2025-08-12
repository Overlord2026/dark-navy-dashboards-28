/**
 * SWAG Analyzer Core Functions
 * Minimal implementations for outcome-first stress testing
 */

import crypto from 'crypto';
import { OutcomeMetrics, PhaseId } from './models';

export function canonical(obj: any): string {
  return JSON.stringify(obj, Object.keys(obj).sort());
}

export function outcomeScore(
  m: OutcomeMetrics, 
  w = { ISP: 0.35, DGBP: 0.25, ATE: 0.15, LCI: 0.25 }
): number {
  return w.ISP * m.ISP - w.DGBP * m.DGBP + w.ATE * m.ATE + w.LCI * m.LCI;
}

export async function processSwagResults(data: any, inputs: any) {
  // Expect data.phaseMetrics[phaseId] with ISP, DGBP, LCR, LCI, ATE populated by analyzer
  const phaseMetrics = data.phaseMetrics as Record<PhaseId, OutcomeMetrics>;
  for (const p of Object.keys(phaseMetrics) as PhaseId[]) {
    phaseMetrics[p].OS = outcomeScore(phaseMetrics[p]);
  }
  return { ...data, phaseMetrics };
}

export function enforceChanceConstraint(samples: number[], epsilon: number): boolean {
  // samples = shortfall values (negative=good, positive=shortfall)
  const sorted = [...samples].sort((a, b) => a - b);
  const q = sorted[Math.floor((1 - epsilon) * sorted.length)];
  return q <= 0; // true if required quantile has no shortfall
}

export function makeOutcomeReceipt(payload: any) {
  const body = {
    policyHash: payload.policyHash,
    modelHash: payload.modelHash,
    regimeState: payload.regimeState,
    phaseMetrics: payload.phaseMetrics,   // include pre/post
    trades: payload.trades,
    lotDeltas: payload.lotDeltas,
    seed: payload.seed,
    ts: new Date().toISOString()
  };
  const hash = crypto.createHash('sha256').update(canonical(body)).digest('hex');
  return { body, hash };
}

export function ETAY(
  comp: { 
    interest?: number; 
    qualified?: number; 
    ltg?: number; 
    stg?: number 
  },
  rates: { 
    ordinary: number; 
    qualified: number; 
    ltg: number; 
    stg: number 
  }, 
  feeDrag = 0
): number {
  const { interest = 0, qualified = 0, ltg = 0, stg = 0 } = comp;
  return (
    interest * (1 - rates.ordinary) + 
    qualified * (1 - rates.qualified) + 
    ltg * (1 - rates.ltg) + 
    stg * (1 - rates.stg)
  ) - feeDrag;
}

export function SEAY(
  stakingAPR: number, 
  tax: number, 
  slashingProb: number, 
  unbondDays: number, 
  dailyPenaltyBps: number
): number {
  const afterTax = stakingAPR * (1 - tax);
  const latencyPenalty = (unbondDays * dailyPenaltyBps) / 10000 + slashingProb * stakingAPR;
  return afterTax - latencyPenalty;
}

export function liquidityVaR(config: {
  secondaryHaircut?: number;
  gateProb?: number;
  delayDays?: number;
  dailyPenaltyBps?: number;
}): number {
  const { secondaryHaircut = 0, gateProb = 0, delayDays = 0, dailyPenaltyBps = 0 } = config;
  return secondaryHaircut + gateProb * (delayDays * dailyPenaltyBps / 10000);
}