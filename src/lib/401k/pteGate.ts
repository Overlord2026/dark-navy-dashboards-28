/** %ADV cap gate with book aggregation + inheritance (content-free, demo-safe) */
export type GateDecision = "ALLOW" | "DENY" | "ALLOW_WITH_CONDITIONS";
export function evalAdvGate() {
  // Demo book exposure: aggregate across accounts; child orders inherit cooling-off
  const book = {
    gross_exposure_usd: 250000, // example
    cooling_off_days: 20,
    cap_pct: 0.10, // 10%
  };
  // Simple rule: exposures under cap => allow_with_conditions (documented cooling-off), else deny
  const allow = (book.gross_exposure_usd / 1000000) <= book.cap_pct; // 250k on 1M AUM => 25% > 10% => deny in real calc
  const decision: GateDecision = allow ? "ALLOW_WITH_CONDITIONS" : "DENY";
  const reasons = allow ? ["HITL required; within winsorized %ADV cap"] : ["exceeds %ADV cap", "apply cooling-off"];
  return {
    decision,
    ADV_Gate: { window_days: book.cooling_off_days, pct_cap: book.cap_pct },
    reasons
  };
}