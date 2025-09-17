// src/fixtures/fixtures.ts
/* istanbul ignore file */
import { recordReceipt, listReceipts, clearReceipts } from '@/features/receipts/record'
import type { DecisionRDS, ConsentRDS, SettlementRDS, DeltaRDS, AnyRDS } from '@/features/receipts/types'
import { anchorBatch } from '@/features/anchor/providers'
import * as Canonical from '@/lib/canonical'

// Stub implementations for removed NIL functionality
const nilStubs = {
  getModules: () => [],
  completeModule: (id: string) => ({ id, completed: true }),
  confirmDisclosurePack: (packId: string, params: any) => ({ 
    id: `disc_${Date.now()}`, 
    type: 'Decision-RDS' as const,
    disclosure_pack: packId,
    ts: new Date().toISOString()
  }),
  createOffer: (params: any) => ({ offerId: `offer_${Date.now()}`, offerLock: `lock_${Date.now()}` }),
  checkConflicts: (offerId: string) => ({ ok: true, conflicts: [] }),
  previewSplit: (offerId: string) => [],
  invite: (role: string, email: string) => ({ pendingId: `pend_${Date.now()}` }),
  accept: (pendingId: string) => ({ accepted: true }),
  listInvites: () => [],
  issueConsent: async (params: any) => ({ 
    id: `consent_${Date.now()}`, 
    type: 'Consent-RDS' as const,
    ...params,
    ts: new Date().toISOString() 
  }),
  runChecks: (contractId: string, offerId: string) => ({ ok: true, reasons: ['STUB_APPROVED'] }),
  hold: (params: any) => ({ escrowId: `escrow_${Date.now()}` }),
  release: (escrowId: string) => ({ 
    txnId: `txn_${Date.now()}`, 
    receipt: { 
      id: `settle_${Date.now()}`, 
      type: 'Settlement-RDS' as const,
      offerLock: 'stub',
      attribution_hash: 'stub_hash',
      split_tree_hash: 'stub_split',
      escrow_state: 'released',
      anchor_ref: null,
      ts: new Date().toISOString()
    } as SettlementRDS
  }),
  fileDispute: (offerId: string, code: string, notes: string) => `dispute_${Date.now()}`,
  adjudicate: (disputeId: string, outcome: string, reallocation: any[]) => ({ 
    id: `delta_${Date.now()}`,
    type: 'Delta-RDS' as const,
    prior_ref: 'stub',
    diffs: reallocation,
    reasons: ['STUB_ADJUDICATION'],
    ts: new Date().toISOString()
  } as DeltaRDS)
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
  const discReceipt = nilStubs.confirmDisclosurePack('us-ig-standard', { channel: 'IG', jurisdiction: 'US' })
  
  const eduReceipt: DecisionRDS = {
    id: `rds_edu_${Date.now()}`, type: 'Decision-RDS', action: 'education',
    policy_version: 'E-2025.08', inputs_hash: 'sha256:demo',
    reasons: ['EDU_FRESH'], result: 'approve', anchor_ref: null, ts: new Date().toISOString()
  }
  recordReceipt(eduReceipt)

  // 4) Offer w/ no conflict (Aurora Athletics)
  const { offerId, offerLock } = nilStubs.createOffer({
    brand: 'Aurora Athletics', category: 'Sports Nutrition',
    startDate: '2025-09-01', endDate: '2025-12-31', channels, amount: 10000
  })
  const conflict = nilStubs.checkConflicts(offerId)
  if (!conflict.ok) throw new Error('Fixture expected no conflict')
  const _split = nilStubs.previewSplit(offerId)

  // 5) Marketplace invites & Consent:
  // coach -> advisor, mom -> guardian co-sign flavor (we demo as 'attorney' for signature)
  const inviteRoles = opts.profile === 'coach' ? ['advisor', 'attorney'] : ['attorney', 'cpa']
  const inviteIds: string[] = []
  for (const r of inviteRoles) {
    const { pendingId } = nilStubs.invite(r as any, `${r}@example.com`)
    inviteIds.push(pendingId)
    nilStubs.accept(pendingId)
  }
  // Consent scope to collaborators
  const consent: ConsentRDS = await nilStubs.issueConsent({
    roles: inviteRoles, resources: ['contracts', 'disclosures'], ttlDays: 30, purpose_of_use: 'contract_collab'
  })

  // 6) Contract checks → Publish (anchored Decision-RDS)
  const checks = await nilStubs.runChecks(offerId, offerId)
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
  const { escrowId } = nilStubs.hold({ offerId, amount: 10_000 })
  const releaseResult = await nilStubs.release(escrowId)
  const settlement: SettlementRDS = releaseResult.receipt

  // 8) Dispute → Delta-RDS diff
  const disputeId = nilStubs.fileDispute(offerId, 'WRONG_ALLOCATION', 'Brand share high')
  const delta: DeltaRDS = nilStubs.adjudicate(disputeId, 'adjust', [{ field: 'allocation.brand', from: 7500, to: 7000 }])

  // Build snapshot (ids only; no PII)
  const receiptIds = [eduReceipt.id, discReceipt.id, publishReceipt.id, settlement.id, delta.id]
  const invites = nilStubs.listInvites()
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