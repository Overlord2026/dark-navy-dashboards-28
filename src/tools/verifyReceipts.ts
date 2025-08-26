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

// Trading-specific receipt interfaces
export interface Receipt {
  receipt_id: string;
  type: string;
  ts: string;
  policy_version: string;
  inputs_hash: string;
  reasons: string[];
  [key: string]: any;
}

export interface ReceiptValidationResult {
  valid: boolean;
  receiptType: string;
  errors: string[];
  warnings: string[];
}

// Trading-specific validation functions
function validateTLHReceipt(receipt: Receipt): ReceiptValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!receipt.proxy_pair?.from) {
    errors.push('TLH-RDS missing proxy_pair.from');
  }
  
  if (!receipt.proxy_pair?.to) {
    errors.push('TLH-RDS missing proxy_pair.to');
  }
  
  if (!receipt.trigger_bps && receipt.trigger_bps !== 0) {
    errors.push('TLH-RDS missing trigger_bps');
  }
  
  if (receipt.trigger_bps && (receipt.trigger_bps < 0 || receipt.trigger_bps > 10000)) {
    warnings.push('TLH-RDS trigger_bps outside typical range (0-10000 bps)');
  }
  
  return { valid: errors.length === 0, receiptType: 'TLH-RDS', errors, warnings };
}

function validateLotReceipt(receipt: Receipt): ReceiptValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!receipt.lot_policy) {
    errors.push('Lot-RDS missing lot_policy');
  }
  
  if (!receipt.wash_sale_check && receipt.wash_sale_check !== false) {
    errors.push('Lot-RDS missing wash_sale_check');
  }
  
  const validPolicies = ['FIFO', 'LIFO', 'SpecificID', 'TaxOptimized'];
  if (receipt.lot_policy && !validPolicies.includes(receipt.lot_policy)) {
    warnings.push(`Lot-RDS lot_policy "${receipt.lot_policy}" not in standard list`);
  }
  
  return { valid: errors.length === 0, receiptType: 'Lot-RDS', errors, warnings };
}

function validateLocationReceipt(receipt: Receipt): ReceiptValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!receipt.alloc?.ira && receipt.alloc?.ira !== 0) {
    errors.push('Location-RDS missing alloc.ira');
  }
  
  if (!receipt.alloc?.roth && receipt.alloc?.roth !== 0) {
    errors.push('Location-RDS missing alloc.roth');
  }
  
  if (!receipt.alloc?.tax && receipt.alloc?.tax !== 0) {
    errors.push('Location-RDS missing alloc.tax');
  }
  
  if (receipt.alloc) {
    const sum = (receipt.alloc.ira || 0) + (receipt.alloc.roth || 0) + (receipt.alloc.tax || 0);
    const tolerance = 0.001;
    
    if (Math.abs(sum - 1.0) > tolerance) {
      errors.push(`Location-RDS allocation sum ${sum} ≠ 1.0 (tolerance: ${tolerance})`);
    }
  }
  
  return { valid: errors.length === 0, receiptType: 'Location-RDS', errors, warnings };
}

function validateTradeReceipt(receipt: Receipt): ReceiptValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!receipt.inherited_controls && !receipt.trade_details?.inherited_controls) {
    errors.push('Trade-RDS missing inherited_controls');
  }
  
  const hasAdvReason = receipt.reasons?.some((r: string) => 
    r === 'adv_within_cap' || r === 'risk.blocked'
  );
  
  if (!hasAdvReason) {
    errors.push('Trade-RDS missing ADV status reason (adv_within_cap or risk.blocked)');
  }
  
  const controls = receipt.inherited_controls || receipt.trade_details?.inherited_controls;
  if (controls) {
    if (typeof controls.adv_symbol_bps !== 'number') {
      errors.push('Trade-RDS inherited_controls missing adv_symbol_bps');
    }
    
    if (typeof controls.adv_book_bps !== 'number') {
      errors.push('Trade-RDS inherited_controls missing adv_book_bps');
    }
    
    if (typeof controls.cooling_off_sec !== 'number') {
      errors.push('Trade-RDS inherited_controls missing cooling_off_sec');
    }
    
    if (typeof controls.drawdown_limit_bps !== 'number') {
      errors.push('Trade-RDS inherited_controls missing drawdown_limit_bps');
    }
  }
  
  return { valid: errors.length === 0, receiptType: 'Trade-RDS', errors, warnings };
}

function validateAdviceReceipt(receipt: Receipt): ReceiptValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!receipt.strategy) {
    errors.push('Advice-RDS missing strategy');
  }
  
  return { valid: errors.length === 0, receiptType: 'Advice-RDS', errors, warnings };
}

function validateAuditReceipt(receipt: Receipt): ReceiptValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!receipt.accept_n_of_m && receipt.accept_n_of_m !== 0) {
    errors.push('Audit-RDS missing accept_n_of_m');
  }
  
  return { valid: errors.length === 0, receiptType: 'Audit-RDS', errors, warnings };
}

export function verifyReceipt(receipt: Receipt): ReceiptValidationResult {
  const baseErrors: string[] = [];
  
  if (!receipt.receipt_id) baseErrors.push('Missing receipt_id');
  if (!receipt.type) baseErrors.push('Missing type');
  if (!receipt.ts) baseErrors.push('Missing timestamp');
  if (!receipt.policy_version) baseErrors.push('Missing policy_version');
  if (!receipt.inputs_hash) baseErrors.push('Missing inputs_hash');
  if (!receipt.reasons || !Array.isArray(receipt.reasons)) {
    baseErrors.push('Missing or invalid reasons array');
  }
  
  if (baseErrors.length > 0) {
    return {
      valid: false,
      receiptType: receipt.type || 'Unknown',
      errors: baseErrors,
      warnings: []
    };
  }
  
  switch (receipt.type) {
    case 'TLH-RDS': return validateTLHReceipt(receipt);
    case 'Lot-RDS': return validateLotReceipt(receipt);
    case 'Location-RDS': return validateLocationReceipt(receipt);
    case 'Trade-RDS': return validateTradeReceipt(receipt);
    case 'Advice-RDS': return validateAdviceReceipt(receipt);
    case 'Audit-RDS': return validateAuditReceipt(receipt);
    default:
      return {
        valid: true,
        receiptType: receipt.type,
        errors: [],
        warnings: [`Unknown receipt type: ${receipt.type}`]
      };
  }
}

export function verifyReceipts(receipts: Receipt[]): {
  totalReceipts: number;
  validReceipts: number;
  invalidReceipts: number;
  results: ReceiptValidationResult[];
} {
  const results = receipts.map(verifyReceipt);
  
  return {
    totalReceipts: receipts.length,
    validReceipts: results.filter(r => r.valid).length,
    invalidReceipts: results.filter(r => !r.valid).length,
    results
  };
}

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