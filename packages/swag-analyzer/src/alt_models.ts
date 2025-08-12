/**
 * SWAG Alternative Asset Models
 * ETAY, SEAY, and LiquidityVaR computations
 */

// @claim-step: ETAY/SEAY and LiquidityVaR computations
export function ETAY(
  comp: { interest?: number; qualified?: number; ltg?: number; stg?: number },
  rates: { ordinary: number; qualified: number; ltg: number; stg: number },
  feeDrag = 0
) {
  const { interest = 0, qualified = 0, ltg = 0, stg = 0 } = comp;
  return (interest * (1 - rates.ordinary) + qualified * (1 - rates.qualified) +
    ltg * (1 - rates.ltg) + stg * (1 - rates.stg)) - feeDrag;
}

export function SEAY(stakingAPR: number, tax: number, slashingProb: number, unbondDays: number, dailyPenaltyBps: number) {
  const afterTax = stakingAPR * (1 - tax);
  const latencyPenalty = (unbondDays * dailyPenaltyBps) / 10000 + slashingProb * stakingAPR;
  return afterTax - latencyPenalty;
}

export function liquidityVaR({ secondaryHaircut = 0, gateProb = 0, delayDays = 0, dailyPenaltyBps = 0 }) {
  return secondaryHaircut + gateProb * (delayDays * (dailyPenaltyBps / 10000));
}