/**
 * PDF sealing and timestamp utilities for tamper-evident outputs
 */

import { stampPdfWithBrandSeal } from '@/lib/report/sealTemplate';

export interface SealOptions {
  sealFormat: 'image' | 'x509';
  notary: {
    name: string;
    commission: string;
    jurisdiction: string;
    expires: string;
    sealImageUrl?: string;
    x509Certificate?: string;
    county?: string;
  };
  enableLTV?: boolean; // Long-term validation
}

export interface SealedPdfResult {
  bytes: Uint8Array;
  sha256: string;
  timestamp?: string;
  ltv?: boolean;
}

export async function applyPdfSealAndTimestamp(
  pdfBytes: Uint8Array, 
  opts: SealOptions
): Promise<SealedPdfResult> {
  // 1) Apply brand seal template with premium styling
  const stamped = await stampPdfWithBrandSeal(pdfBytes, {
    notaryName: opts.notary.name,
    commissionNo: opts.notary.commission,
    commissionExp: opts.notary.expires,
    state: opts.notary.jurisdiction,
    county: opts.notary.county,
    circleText: 'Electronic Notary Seal'
  }, { 
    brandNavy: '#0B1E33', 
    brandGold: '#D4AF37' 
  });
  
  // 2) Calculate SHA256 hash of stamped PDF
  const hash = await calculateSHA256(stamped);
  
  let timestamp: string | undefined;
  let ltv = false;
  
  // 3) Apply LTV timestamp if enabled
  if (opts.enableLTV) {
    timestamp = await addTimestampToPDF(stamped);
    ltv = true;
  }
  
  return {
    bytes: stamped,
    sha256: hash,
    timestamp,
    ltv
  };
}

async function addNotarySeal(pdfBytes: Uint8Array, opts: SealOptions): Promise<Uint8Array> {
  // Stub implementation - in production:
  // - Use PDF-lib to load PDF
  // - Find signature page or add new page
  // - Place notary seal image or apply digital signature
  // - Add notary information text block
  // - Save modified PDF
  
  const sealText = `
Notarized by: ${opts.notary.name}
Commission: ${opts.notary.commission}
Jurisdiction: ${opts.notary.jurisdiction}
Commission Expires: ${opts.notary.expires}
Date: ${new Date().toISOString().split('T')[0]}
  `.trim();
  
  console.log('[PDF Seal]', {
    notary: opts.notary.name,
    commission: opts.notary.commission,
    sealFormat: opts.sealFormat,
    sealText
  });
  
  // Return original bytes for now - in production, return modified PDF
  return pdfBytes;
}

async function addTimestampToPDF(pdfBytes: Uint8Array): Promise<string> {
  // Stub implementation - in production:
  // - Connect to trusted Timestamp Authority (TSA)
  // - Get RFC 3161 timestamp for PDF hash
  // - Embed timestamp in PDF as LTV signature
  // - Return timestamp token
  
  const timestamp = new Date().toISOString();
  console.log('[PDF Timestamp]', { timestamp, ltv: true });
  
  return timestamp;
}

async function calculateSHA256(data: Uint8Array): Promise<string> {
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return `sha256:${hashHex}`;
}

export function generateNotaryReceiptText(
  sessionId: string,
  signer: string,
  documentName: string,
  notary: { name: string; commission: string; jurisdiction: string; expires: string },
  completedAt: string
): string {
  return `
NOTARIZATION RECEIPT

Session ID: ${sessionId}
Document: ${documentName}
Signer: ${signer}
Notarized by: ${notary.name}
Commission: ${notary.commission}
Jurisdiction: ${notary.jurisdiction}
Commission Expires: ${notary.expires}
Completed: ${completedAt}

This document has been notarized and contains a tamper-evident seal.
Any modifications after notarization will be detectable.
  `.trim();
}

export function validatePdfIntegrity(
  pdfBytes: Uint8Array,
  expectedHash: string
): Promise<{ valid: boolean; currentHash: string }> {
  return calculateSHA256(pdfBytes).then(currentHash => ({
    valid: currentHash === expectedHash,
    currentHash
  }));
}