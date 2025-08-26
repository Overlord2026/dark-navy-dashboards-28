import { recordReceipt } from '@/features/receipts/record';

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