// src/fixtures/fixtures.health.ts
/* istanbul ignore file */
import { recordReceipt, listReceipts } from '@/features/receipts/record'
import type { AnyRDS } from '@/features/receipts/types'
import { anchorBatch } from '@/features/anchor/providers'
import { hash, canonicalJson } from '@/lib/canonical'

// Health modules (as discussed in H0–H5)
import { issueConsent /* revoke later if needed */ } from '@/features/health/consent/api'
import { getPlan, planContribution } from '@/features/health/hsa/api'
import { getScreenings, gateScreening } from '@/features/health/screening/api'
import { buildPaPack, gatePaRequest } from '@/features/health/pa/api'
import { grantPre /* revokePre */ } from '@/features/health/vault/api'

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
  const inputs_hash = hash(summary)

  // 2) Consent Passport (HIPAA scope + freshness)
  const consent = issueConsent({
    scope: { minimum_necessary: true, roles: ['Advisor', 'CPA'], resources: ['claims_summary','lab_summary'] },
    ttlDays: 30,
    purpose: 'care_coordination'
  })
  const consent_id = consent.id

  // 3) HSA+ Planner → Health-RDS (financial overlay)
  const plan = getPlan() // { planName, hsaEligible, family, deductibleMet, ytdContrib, annualLimit, catchUpEligible }
  // Simulate a $250 contribution planning (or claim). Returns a Health-RDS stub from your api.
  const hsaRds = await planContribution(250)
  const hsa_receipt_id = hsaRds.id

  // 4) Screening Gate (e.g., colorectal approve)
  const recs = getScreenings({ age: 55, sex: 'F', plan: plan })
  const next = recs.find(x => x.key === 'colorectal') || recs[0]
  const screeningRds = gateScreening(next.key, {
    inputs_hash,
    zk: { ageGte: true, inNetwork: true }
  })
  const screening_rds_id = screeningRds.id

  // 5) PA Prep/Gate (deny with missingEvidence) + Vault pack
  const paPack = buildPaPack({ inputs_hash, docs: ['sha256:phys_note','sha256:imaging'] })
  const paRds = gatePaRequest({
    pack_hash: paPack.hash,
    cpt: '45378', // example CPT
    facts: { inputs_hash, zk: { inNetwork: true } }
  }) // expect deny with missingEvidence (demo)
  const pa_rds_id = paRds.id

  const vaultRds = grantPre('provider', ['sha256:phys_note','sha256:imaging'], 7) // PRE grant 7 days
  const vault_rds_id = vaultRds.id

  // 6) Anchor a couple of receipts (so Verify shows Included ✓)
  const anchored_ids: string[] = []
  const toAnchor = [screeningRds, hsaRds]
  for (const r of toAnchor) {
    const ref = await anchorBatch(hash({ id: r.id, inputs_hash }))
    const anchored: AnyRDS = { ...r, anchor_ref: ref } as AnyRDS
    recordReceipt(anchored)
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