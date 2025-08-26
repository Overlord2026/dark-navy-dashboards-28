import { recordReceipt } from '@/features/receipts/record';
import { anchorNow } from "@/features/anchor/anchorNow";

export type LayoutSpec = {
  marginsIn: { top:number; left:number; right:number; bottom:number };
  stampBoxIn: { x:number; y:number; w:number; h:number };
  fontPt: number;
  hasAPN: boolean;
  hasPreparer: boolean;
  hasReturnAddress: boolean;
};

export type CountyRule = {
  county_token: string;
  pageSize: string;
  marginsIn: { top:number; left:number; right:number; bottom:number };
  stampBoxIn: { x:number; y:number; w:number; h:number };
  minFontPt: number;
  requires: {
    APN: boolean;
    preparer: boolean;
    returnAddress: boolean;
  };
};

export const defaultLayout: LayoutSpec = {
  marginsIn: { top: 3.0, left: 1.0, right: 1.0, bottom: 1.0 },
  stampBoxIn: { x: 6.25, y: 0.5, w: 2.25, h: 3.0 },
  fontPt: 10,
  hasAPN: true,
  hasPreparer: true,
  hasReturnAddress: true
};

export const sampleCounty: CountyRule = {
  county_token: "LA_COUNTY_CA",
  pageSize: "Letter",
  marginsIn: { top: 3.5, left: 1.25, right: 1.0, bottom: 1.5 },
  stampBoxIn: { x: 6.0, y: 0.25, w: 2.0, h: 2.75 },
  minFontPt: 10,
  requires: {
    APN: true,
    preparer: true,
    returnAddress: true
  }
};

/** Validate a candidate layout against a county rule (content-free). */
export function validateLayout(layout: LayoutSpec, rule: CountyRule) {
  const violations: string[] = [];
  const remedies: string[] = [];

  // Margins
  if (layout.marginsIn.top    < rule.marginsIn.top)    { violations.push("margin_top_too_small"); remedies.push(`increase_top_margin_${(rule.marginsIn.top-layout.marginsIn.top).toFixed(1)}in`); }
  if (layout.marginsIn.left   < rule.marginsIn.left)   { violations.push("margin_left_too_small"); remedies.push(`increase_left_margin_${(rule.marginsIn.left-layout.marginsIn.left).toFixed(1)}in`); }
  if (layout.marginsIn.right  < rule.marginsIn.right)  { violations.push("margin_right_too_small"); remedies.push(`increase_right_margin_${(rule.marginsIn.right-layout.marginsIn.right).toFixed(1)}in`); }
  if (layout.marginsIn.bottom < rule.marginsIn.bottom) { violations.push("margin_bottom_too_small"); remedies.push(`increase_bottom_margin_${(rule.marginsIn.bottom-layout.marginsIn.bottom).toFixed(1)}in`); }

  // Stamp box must fit completely within top margin band
  const sb = layout.stampBoxIn;
  const sbBottom = sb.y + sb.h;
  const fitsTopBand = sb.y >= 0.0 && sbBottom <= rule.marginsIn.top && (sb.x >= 0) && ((sb.x + sb.w) <= 8.5); // assume Letter width 8.5"
  if (!fitsTopBand) { violations.push("stamp_box_out_of_top_band"); remedies.push("reposition_stamp_box_within_top_margin"); }

  // Min font
  if (layout.fontPt < rule.minFontPt) { violations.push("font_too_small"); remedies.push(`increase_font_to_${rule.minFontPt}pt`); }

  // Required fields
  if (rule.requires.APN && !layout.hasAPN) { violations.push("apn_missing"); remedies.push("add_apn_token"); }
  if (rule.requires.preparer && !layout.hasPreparer) { violations.push("preparer_block_missing"); remedies.push("add_preparer_block"); }
  if (rule.requires.returnAddress && !layout.hasReturnAddress) { violations.push("return_address_missing"); remedies.push("add_return_address"); }

  // E-recording provider: nothing to validate in the page, but include reason if not supported
  const ok = violations.length === 0;
  return { ok, violations, remedies };
}

function isoNow() {
  return new Date().toISOString();
}

async function inputsHash(data: any) {
  return `sha256:${JSON.stringify(data).slice(0, 16)}`;
}

/** Emit a Delta-RDS with violations (content-free). */
export async function emitDeltaFromValidation(policyVersion: string, missing: string[], remedies: string[]){
  const ih = await inputsHash({ missing, remedies, county: sampleCounty.county_token });
  const r = {
    receipt_id: `rds_delta_${isoNow()}`,
    type: "Delta-RDS",
    ts: isoNow(),
    policy_version: policyVersion,
    inputs_hash: ih,
    prior_ref: "rds_deed_latest",
    missing: missing,
    remedies: remedies,
    reasons: ["validation_fail"]
  };
  await recordReceipt(r);
  return r.receipt_id;
}

async function sha256HexBrowser(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Emit a content-free Reason-RDS for a validation report (PASS/FAIL + reasons).
 * Fields are tokens/bands only; no PII/PHI or raw images.
 */
export async function emitValidationReportRDS(
  policyVersion: string,
  summary: { pass: boolean; violations: string[]; remedies: string[]; layout: any }
){
  // Build a deterministic, content-free object for hashing
  const payload = {
    county: sampleCounty.county_token,
    policy_version: policyVersion,
    pass: summary.pass,
    violations: (summary.violations || []).slice().sort(),
    remedies: (summary.remedies || []).slice().sort(),
    // include layout tokens only (inches, flags) — no PII
    layout: {
      marginsIn: summary.layout?.marginsIn,
      stampBoxIn: summary.layout?.stampBoxIn,
      fontPt: summary.layout?.fontPt,
      flags: {
        APN: !!summary.layout?.hasAPN,
        preparer: !!summary.layout?.hasPreparer,
        returnAddress: !!summary.layout?.hasReturnAddress
      }
    }
  };

  // Compute inputs_hash
  function canon(o:any):any{
    if (Array.isArray(o)) return o.map(canon);
    if (o && typeof o==="object"){
      return Object.keys(o).sort().reduce((acc:any,k)=>{ acc[k]=canon(o[k]); return acc; },{});
    }
    return o;
  }
  const s = JSON.stringify(canon(payload));
  const ih = "sha256:" + await sha256HexBrowser(s);

  // Emit Reason-RDS (content-free)
  const r = {
    receipt_id: `rds_reason_validation_${isoNow()}`,
    type: "Reason-RDS",
    ts: isoNow(),
    policy_version: policyVersion,
    inputs_hash: ih,
    // free-text fields avoided; keep reasons[] compact
    reasons: [
      summary.pass ? "validation:pass" : "validation:fail",
      ...payload.violations.map(v => `v:${v}`),
      ...payload.remedies.map(rm => `r:${rm}`)
    ],
    // optional structured summary (content-free)
    summary: {
      county_token: sampleCounty.county_token,
      pass: summary.pass,
      violations: payload.violations,
      remedies: payload.remedies
    }
  };
  await recordReceipt(r);
  return r.receipt_id;
}

/**
 * Load county rule list (content-free). In production, wire to your real store.
 * Falls back to [sampleCounty] if none exists.
 */
export function getCountyList(): Array<CountyRule> {
  try {
    const raw = localStorage.getItem("county.meta.list");
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length) return list;
    }
  } catch { /* ignore */ }
  return [sampleCounty];
}

/**
 * Build a default layout from a county rule (content-free).
 * This mirrors the policy requirements, no PII/PHI.
 */
export function layoutFromRule(rule: CountyRule): LayoutSpec {
  return {
    marginsIn: { ...rule.marginsIn },
    stampBoxIn: { ...rule.stampBoxIn },
    fontPt: Math.max(10, rule.minFontPt),
    hasAPN: !!rule.requires.APN,
    hasPreparer: !!rule.requires.preparer,
    hasReturnAddress: !!rule.requires.returnAddress
  };
}

/**
 * Emit Reason-RDS validation reports for all (or the first N) counties.
 * Returns list of emitted receipt_ids and the ISO start time for post-filter anchoring.
 */
export async function emitValidationReportsForCounties(
  policyVersion: string,
  opts?: { limit?: number }
){
  const isoStart = new Date().toISOString();
  const counties = getCountyList();
  const take = Math.min(opts?.limit || counties.length, counties.length);
  const ids: string[] = [];

  for (let i=0; i<take; i++) {
    const rule = counties[i];
    const layout = layoutFromRule(rule);
    const v = validateLayout(layout, rule);
    const rid = await emitValidationReportRDS(
      policyVersion,
      { pass: v.ok, violations: v.violations, remedies: v.remedies, layout }
    );
    ids.push(rid);
  }
  return { since_iso: isoStart, count: ids.length, receipt_ids: ids };
}

/**
 * Batch "Report + Anchor" for all counties (or first N).
 * 1) emits Reason-RDS for each county,
 * 2) anchors all newly-emitted Reason-RDS together (single batch),
 * 3) returns audit info (content-free).
 */
export async function batchReportAndAnchorAll(
  policyVersion: string,
  env: "dev"|"stage"|"prod",
  opts?: { limit?: number; threshold?: { n:number; m:number } }
){
  // Emit (content-free) reports first
  const emitted = await emitValidationReportsForCounties(policyVersion, { limit: opts?.limit });

  // Anchor the Reason-RDS receipts
  const res = await anchorNow({
    env,
    include_types: ["Reason-RDS"],
    max_batch: opts?.limit || 500
  });

  return {
    ok: res.ok,
    reports_emitted: emitted.count,
    merkle_root: res.merkle_root || "none",
    audit_receipt_id: res.audit_receipt_id || "none"
  };
}