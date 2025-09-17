// src/fixtures/fixtures.health.ts
/* istanbul ignore file */
import { recordReceipt, listReceipts } from '@/features/receipts/record'
import type { AnyRDS, ConsentRDS, DecisionRDS } from '@/features/receipts/types'
import { anchorBatch } from '@/features/anchor/providers'
import * as Canonical from '@/lib/canonical'

// Basic consent implementation (health-specific APIs to be implemented)
const issueConsent = async (params: any) => ({
  id: `consent_${Date.now()}`,
  type: 'Consent-RDS' as const,
  ...params,
  ts: new Date().toISOString()
});

// Health module stubs (to be implemented)
const healthModules = {
  getPlan: () => ({ planName: 'Demo Plan', hsaEligible: true, deductibleMet: false }),
  planContribution: async (amount: number): Promise<DecisionRDS> => ({
    id: `health_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'education',
    policy_version: 'H-2025.08',
    inputs_hash: await Canonical.hash({ amount }),
    reasons: ['HSA_ELIGIBLE'],
    result: 'approve',
    anchor_ref: null,
    ts: new Date().toISOString()
  }),
  getScreenings: () => [{ key: 'colorectal', name: 'Colorectal Screening' }],
  gateScreening: async (key: string): Promise<DecisionRDS> => ({
    id: `screening_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'education',
    policy_version: 'H-2025.08',
    inputs_hash: await Canonical.hash({ screening: key }),
    reasons: ['AGE_ELIGIBLE', 'IN_NETWORK'],
    result: 'approve',
    anchor_ref: null,
    ts: new Date().toISOString()
  }),
  buildPaPack: () => ({ hash: 'pack_hash_demo' }),
  gatePaRequest: async (): Promise<DecisionRDS> => ({
    id: `pa_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'education',
    policy_version: 'H-2025.08',
    inputs_hash: await Canonical.hash({ pa: 'demo' }),
    reasons: ['MISSING_EVIDENCE'],
    result: 'deny',
    anchor_ref: null,
    ts: new Date().toISOString()
  }),
  grantPre: async (): Promise<DecisionRDS> => ({
    id: `vault_${Date.now()}`,
    type: 'Decision-RDS',
    action: 'education',
    policy_version: 'H-2025.08',
    inputs_hash: await Canonical.hash({ vault: 'demo' }),
    reasons: ['PRE_GRANTED'],
    result: 'approve',
    anchor_ref: null,
    ts: new Date().toISOString()
  })
}

// (Optional) SMART on FHIR shell — return a redacted summary
async function fetchFhirSummary() {
  // PHI-free canonical summary; use bands/booleans only
  return {
    persona: 'Retiree',
    ageBand: '50-59',
    sex: 'F',
    plan: { inNetwork: true, deductibleMet: false },
    labs: { a1cBand: '<7.0' },
    lastScreenings: [],
  };
}

// Snapshot for hydrate/dehydrate
type HealthSnapshot = {
  inputs_hash: string
  consent_id?: string
  hsa_receipt_id?: string
  screening_rds_id?: string
  pa_rds_id?: string
  vault_rds_id?: string
  anchored_ids: string[]
}

const state: { snapshot: HealthSnapshot | null } = { snapshot: null }

// ===== Public API =====
export async function loadHealthFixtures() {
  // 1) Inputs → inputs_hash
  const summary = await fetchFhirSummary()
  const inputs_hash = await Canonical.hash(summary)

  // 2) Consent Passport (HIPAA scope + freshness)
  const consent = await issueConsent({
    roles: ['Advisor', 'CPA'],
    resources: ['claims_summary','lab_summary'],
    ttlDays: 30,
    purpose_of_use: 'care_coordination'
  })
  const consent_id = consent.id

  // 3) HSA+ Planner → Health-RDS (financial overlay)
  const plan = healthModules.getPlan()
  const hsaRds = await healthModules.planContribution(250)
  recordReceipt(hsaRds)
  const hsa_receipt_id = hsaRds.id

  // 4) Screening Gate (e.g., colorectal approve)
  const recs = healthModules.getScreenings()
  const next = recs.find(x => x.key === 'colorectal') || recs[0]
  const screeningRds = await healthModules.gateScreening(next.key)
  recordReceipt(screeningRds)
  const screening_rds_id = screeningRds.id

  // 5) PA Prep/Gate (deny with missingEvidence) + Vault pack
  const paPack = healthModules.buildPaPack()
  const paRds = await healthModules.gatePaRequest()
  recordReceipt(paRds)
  const pa_rds_id = paRds.id

  const vaultRds = await healthModules.grantPre()
  recordReceipt(vaultRds)
  const vault_rds_id = vaultRds.id

  // 6) Anchor a couple of receipts (so Verify shows Included ✓)
  const anchored_ids: string[] = []
  const toAnchor = [screeningRds, hsaRds]
  for (const r of toAnchor) {
    const ref = await anchorBatch(await Canonical.hash({ id: r.id, inputs_hash }))
    r.anchor_ref = ref
    recordReceipt(r)
    anchored_ids.push(r.id)
  }

  state.snapshot = {
    inputs_hash,
    consent_id,
    hsa_receipt_id,
    screening_rds_id,
    pa_rds_id,
    vault_rds_id,
    anchored_ids
  }

  console.info('[fixtures.health] Loaded Health fixtures', state.snapshot)
  return state.snapshot
}

export function dehydrateHealthState() {
  if (!state.snapshot) {
    const all = listReceipts().map(r => r.id)
    state.snapshot = { inputs_hash: 'sha256:unknown', anchored_ids: all }
  }
  const json = JSON.stringify(state.snapshot, null, 2)
  console.info('[fixtures.health] Dehydrated snapshot:', json)
  return json
}

export function hydrateHealthState(snapshot: HealthSnapshot) {
  state.snapshot = snapshot
  console.info('[fixtures.health] Hydrated snapshot', snapshot)
  return snapshot
}

export function clearHealthFixtures() {
  state.snapshot = null
  console.info('[fixtures.health] Cleared snapshot')
}