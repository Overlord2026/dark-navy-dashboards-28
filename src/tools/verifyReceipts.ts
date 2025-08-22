// src/tools/verifyReceipts.ts
/* Dev/CI auditor for NIL + Health receipts (no PHI). */
import { listReceipts } from '@/features/receipts/record'
import { acceptNofM } from '@/features/anchor/providers'
import type {
  AnyRDS, DecisionRDS, ConsentRDS, SettlementRDS, DeltaRDS
} from '@/features/receipts/types'

type Check = { id: string; type: string; ok: boolean; notes: string[] }

function isDecision(r: AnyRDS): r is DecisionRDS { return r.type === 'Decision-RDS' }
function isConsent (r: AnyRDS): r is ConsentRDS  { return r.type === 'Consent-RDS' }
function isSettlement(r: AnyRDS): r is SettlementRDS { return r.type === 'Settlement-RDS' }
function isDelta(r: AnyRDS): r is DeltaRDS { return r.type === 'Delta-RDS' }

// Basic per-type checks (no domain PHI required)
function checkDecision(r: DecisionRDS, notes: string[]) {
  if (!r.policy_version) { notes.push('missing policy_version') }
  if (!r.inputs_hash)    { notes.push('missing inputs_hash') }
  if (!r.reasons?.length){ notes.push('no reasons recorded') }
  // Optional: presence sanity for actions
  if (r.action === 'publish' && !r.asset_id) notes.push('publish missing asset_id')
}

function checkConsent(r: ConsentRDS, notes: string[]) {
  if (!r.scope?.minimum_necessary) notes.push('consent scope not minimum-necessary')
  if (!r.purpose_of_use)           notes.push('missing purpose_of_use')
  const now = Date.now()
  const exp = Date.parse(r.expiry)
  if (r.result === 'approve' && isFinite(exp) && exp < now) notes.push('approve but consent expired')
  if (r.result === 'deny' && r.reason === 'OK') notes.push('deny with reason=OK')
}

function checkSettlement(r: SettlementRDS, notes: string[]) {
  if (!r.offerLock)                 notes.push('missing offerLock')
  if (!['held','released'].includes(r.escrow_state)) notes.push(`invalid escrow_state ${r.escrow_state}`)
  if (!r.attribution_hash || !r.split_tree_hash) notes.push('missing attribution/split hashes')
}

function checkDelta(r: DeltaRDS, notes: string[]) {
  if (!r.prior_ref)                 notes.push('missing prior_ref')
  if (!r.diffs?.length)             notes.push('delta has no diffs')
}

function checkAnchor(r: AnyRDS, notes: string[]) {
  const ref = (r as any).anchor_ref ?? null
  if (!ref) return
  const ok = acceptNofM(ref, 1)
  if (!ok) notes.push('anchor not accepted (N-of-M failed)')
}

export async function main() {
  const receipts = listReceipts()
  const checks: Check[] = []

  for (const r of receipts) {
    const notes: string[] = []
    if (isDecision(r))  checkDecision(r, notes)
    if (isConsent(r))   checkConsent(r, notes)
    if (isSettlement(r))checkSettlement(r, notes)
    if (isDelta(r))     checkDelta(r, notes)
    checkAnchor(r, notes)
    checks.push({ id: (r as any).id, type: r.type, ok: notes.length === 0, notes })
  }

  // Summary
  const total = checks.length
  const pass  = checks.filter(c => c.ok).length
  const fail  = total - pass

  // Pretty print
  const byType = checks.reduce<Record<string,{pass:number;fail:number}>>((acc,c)=>{
    acc[c.type] ??= {pass:0, fail:0}
    c.ok ? acc[c.type].pass++ : acc[c.type].fail++
    return acc
  }, {})

  console.log('\n=== RECEIPT AUDIT ===')
  Object.entries(byType).forEach(([t,s])=>{
    console.log(`${t}: ${s.pass} pass / ${s.fail} fail`)
  })
  console.log(`TOTAL: ${pass} pass / ${fail} fail\n`)

  // Detail failures
  checks.filter(c=>!c.ok).forEach(c=>{
    console.log(`❌ ${c.type} ${c.id}:`)
    c.notes.forEach(n => console.log(`   - ${n}`))
  })

  if (fail === 0) {
    console.log('✅ All receipts passed basic integrity & anchor checks.')
    process.exit(0)
  } else {
    console.log('⚠️  Some receipts failed checks (see above).')
    process.exit(1)
  }
}

if (require.main === module) { void main() }