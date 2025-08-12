/**
 * SWAG Receipt Generation
 * Cryptographic receipts for outcome and monitoring data
 */

// Canonical receipts (hashing placeholder — wire to crypto.createHash in Node env)
export function canonical(o: any) { 
  return JSON.stringify(o, Object.keys(o).sort()); 
}

export function makeOutcomeReceipt(payload: any) {
  const body = {
    policyHash: payload.policyHash ?? 'policy#dev',
    modelHash: payload.modelHash ?? 'model#dev',
    regimeState: payload.regimeState ?? 'UNKNOWN',
    phaseMetrics: payload.phaseMetrics,
    trades: payload.trades ?? [],
    lotDeltas: payload.lotDeltas ?? [],
    seed: payload.seed ?? 'seed#dev',
    ts: new Date().toISOString()
  };
  // Replace with real SHA-256: crypto.createHash('sha256').update(canonical(body)).digest('hex')
  const hash = 'sha256#mock';
  return { body, hash };
}

export function makeMonitoringReceipt(payload: any) {
  const body = {
    phase: payload.phase,
    metrics: payload.metrics,
    proposal: payload.proposal,
    osDelta: payload.osDelta ?? null,
    riskDelta: payload.riskDelta ?? null,
    ts: new Date().toISOString()
  };
  const hash = 'sha256#mock';
  return { body, hash };
}