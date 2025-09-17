// src/fixtures/fixtures.ts
/* istanbul ignore file */
import { recordReceipt, listReceipts, clearReceipts } from '@/features/receipts/record'
import type { DecisionRDS, ConsentRDS, SettlementRDS, DeltaRDS, AnyRDS } from '@/features/receipts/types'
import { anchorBatch } from '@/features/anchor/providers'
import * as Canonical from '@/lib/canonical'

// Stub implementations for removed NIL functionality
const nilStubs = {
  getModules: () => [],
  completeModule: () => ({}),
  confirmDisclosurePack: () => ({ id: 'stub' }),
  createOffer: () => ({ offerId: 'stub', offerLock: 'stub' }),
  checkConflicts: () => ({ ok: true }),
  previewSplit: () => [],
  invite: () => ({ pendingId: 'stub' }),
  accept: () => ({ accepted: true }),
  listInvites: () => [],
  issueConsent: async () => ({ id: 'stub', type: 'Consent-RDS', ts: new Date().toISOString() }),
  runChecks: () => ({ ok: true, reasons: [] }),
  hold: () => ({ escrowId: 'stub' }),
  release: () => ({ txnId: 'stub', receipt: { id: 'stub' } }),
  fileDispute: () => 'stub',
  adjudicate: () => ({ id: 'stub' })
};

type Profile = 'coach' | 'mom'

// ===== Snapshot Types for De/Serialize =====
type NilSnapshot = {
  profile: Profile
  offerId: string
  offerLock: string
  escrowId?: string
  receiptIds: string[]
  invites: any[]
}

const state: { snapshot: NilSnapshot | null } = { snapshot: null }

// ===== Public API =====
export async function loadFixtures(opts: { profile: Profile } = { profile: 'coach' }) {
  // Clear existing state first
  clearReceipts()
  
  // 1) Onboarding "defaults" (implicit)
  const persona = 'athlete' // demo
  const jurisdiction = 'US'
  const channels = ['IG']

  // 2) Education: mark 2 modules as complete (freshness OK)
  const mods = nilStubs.getModules()
  // Stub implementation - no actual modules to complete

  // 3) Disclosure pack for IG/US
  const discReceipt = confirmDisclosurePack('us-ig-standard', { channel: 'IG', jurisdiction: 'US' })
  
  const eduReceipt: DecisionRDS = {
    id: `rds_edu_${Date.now()}`, type: 'Decision-RDS', action: 'education',
    policy_version: 'E-2025.08', inputs_hash: 'sha256:demo',
    reasons: ['EDU_FRESH'], result: 'approve', anchor_ref: null, ts: new Date().toISOString()
  }
  recordReceipt(eduReceipt)

  // 4) Offer w/ no conflict (Aurora Athletics)
  const { offerId, offerLock } = createOffer({
    brand: 'Aurora Athletics', category: 'Sports Nutrition',
    startDate: '2025-09-01', endDate: '2025-12-31', channels, amount: 10000
  })
  const conflict = checkConflicts(offerId)
  if (!conflict.ok) throw new Error('Fixture expected no conflict')
  const _split = previewSplit(offerId)

  // 5) Marketplace invites & Consent:
  // coach -> advisor, mom -> guardian co-sign flavor (we demo as 'attorney' for signature)
  const inviteRoles = opts.profile === 'coach' ? ['advisor', 'attorney'] : ['attorney', 'cpa']
  const inviteIds: string[] = []
  for (const r of inviteRoles) {
    const { pendingId } = invite(r as any, `${r}@example.com`)
    inviteIds.push(pendingId)
    accept(pendingId)
  }
  // Consent scope to collaborators
  const consent: ConsentRDS = await issueConsent({
    roles: inviteRoles, resources: ['contracts', 'disclosures'], ttlDays: 30, purpose_of_use: 'contract_collab'
  })

  // 6) Contract checks → Publish (anchored Decision-RDS)
  const checks = await runChecks(offerId, offerId)
  if (!checks.ok) throw new Error('Fixture expected checks to pass')

  const publishReceipt: DecisionRDS = {
    id: `rds_pub_${Date.now()}`, type: 'Decision-RDS', action: 'publish',
    policy_version: 'E-2025.08', inputs_hash: 'sha256:demo',
    reasons: checks.reasons, result: 'approve', asset_id: `asset_${offerId}`,
    anchor_ref: await anchorBatch(await Canonical.hash({ offerId, asset: `asset_${offerId}` })),
    ts: new Date().toISOString()
  }
  recordReceipt(publishReceipt)

  // 7) Payments: escrow → release → Settlement-RDS (anchored)
  const { escrowId } = hold({ offerId, amount: 10_000 })
  const releaseResult = await release(escrowId)
  const settlement: SettlementRDS = releaseResult.receipt

  // 8) Dispute → Delta-RDS diff
  const disputeId = fileDispute(offerId, 'WRONG_ALLOCATION', 'Brand share high')
  const delta: DeltaRDS = adjudicate(disputeId, 'adjust', [{ field: 'allocation.brand', from: 7500, to: 7000 }])

  // Build snapshot (ids only; no PII)
  const receiptIds = [eduReceipt.id, discReceipt.id, publishReceipt.id, settlement.id, delta.id]
  const invites = listInvites()
  state.snapshot = { profile: opts.profile, offerId, offerLock, escrowId, receiptIds, invites }

  console.info('[fixtures] Loaded NIL fixtures', state.snapshot)
  return state.snapshot
}

export function dehydrateState() {
  if (!state.snapshot) {
    // Build a snapshot from current receipts if not loaded via loadFixtures
    const receipts = listReceipts().map(r => r.id)
    state.snapshot = { profile: 'coach', offerId: 'offer_unknown', offerLock: 'offer:unknown', receiptIds: receipts, invites: [], escrowId: undefined }
  }
  const json = JSON.stringify(state.snapshot, null, 2)
  console.info('[fixtures] Dehydrated snapshot:', json)
  return json
}

export function hydrateState(snapshot: string | NilSnapshot) {
  // For this demo, we only restore the summary so dashboards/receipts can show the same IDs.
  // If you maintain per-store states, call their setters here with snapshot.offerId, offerLock, invites, etc.
  const parsed = typeof snapshot === 'string' ? JSON.parse(snapshot) : snapshot
  state.snapshot = parsed
  console.info('[fixtures] Hydrated snapshot', parsed)
  return parsed
}

export function clearFixtures() {
  clearReceipts()
  state.snapshot = null
  console.info('[fixtures] Cleared fixtures and receipts')
}