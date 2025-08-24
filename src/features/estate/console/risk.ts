import type { PortfolioRow } from './data';

const WEIGHTS = {
  trustWithoutDeed: 40,
  healthIncomplete: 25,
  noReviewFinal: 15,
  signedNoFinal: 10,
  deliveredNotLatest: 5,
  consentMissing: 3,
  autofillOff: 2,
};

export function riskScore(r: PortfolioRow): number {
  const f = r.flags || {};
  let score = 0;
  for (const [k, w] of Object.entries(WEIGHTS)) {
    if ((f as any)[k]) score += (w as number);
  }
  return score;
}

export function riskBand(score: number): 'HIGH' | 'MED' | 'LOW' {
  if (score >= 50) return 'HIGH';
  if (score >= 20) return 'MED';
  return 'LOW';
}