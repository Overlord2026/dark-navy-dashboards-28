import type { CountyMeta } from '@/features/estate/deeds/countyMeta';

export async function renderCoverSheetPdf(
  meta: CountyMeta, 
  tokens: Record<string, string>
): Promise<Uint8Array> {
  // Build county cover page with return address, preparer, APN, instrument type, 
  // property address, and large blank stamp box at meta.firstPageStamp
  
  const coverSheetContent = `
    COUNTY RECORDING COVER SHEET
    ${meta.county} County, ${meta.state}
    
    RETURN TO:
    ${tokens.returnAddress || 'PREPARER ADDRESS REQUIRED'}
    
    PREPARED BY:
    ${tokens.preparer || 'PREPARER NAME REQUIRED'}
    
    INSTRUMENT TYPE: ${tokens.instrumentType || 'Deed'}
    
    PROPERTY ADDRESS: ${tokens.propertyAddress || 'PROPERTY ADDRESS REQUIRED'}
    
    APN/PARCEL: ${tokens.apn || 'APN REQUIRED'}
    
    GRANTEE ADDRESS:
    ${tokens.granteeAddress || 'GRANTEE ADDRESS REQUIRED'}
    
    CONSIDERATION: ${tokens.consideration || '$0'}
    
    ${meta.transferTaxNote ? `TAX NOTE: ${meta.transferTaxNote}` : ''}
    
    RECORDER STAMP BOX (${meta.firstPageStamp.wIn}" x ${meta.firstPageStamp.hIn}"):
    [Reserved for County Recorder Stamp - Do Not Write In This Area]
    Position: ${meta.firstPageStamp.xIn}" from left, ${meta.firstPageStamp.yIn}" from top
    
    COUNTY REQUIREMENTS:
    - Page Size: ${meta.pageSize}
    - Top Margin: ${meta.topMarginIn}"
    - Left/Right Margins: ${meta.leftMarginIn}"/${meta.rightMarginIn}"
    - Bottom Margin: ${meta.bottomMarginIn}"
    ${meta.minFontPt ? `- Minimum Font: ${meta.minFontPt}pt` : ''}
    ${meta.inkColor ? `- Ink Color: ${meta.inkColor}` : ''}
    
    ${meta.notes ? `NOTES: ${meta.notes}` : ''}
    
    Generated: ${new Date().toISOString()}
  `;
  
  // For now, return a simple text-based PDF placeholder
  // In production, this would use a PDF generation library like jsPDF or PDFKit
  const encoder = new TextEncoder();
  return encoder.encode(coverSheetContent);
}

export type CoverSheetTokens = {
  returnAddress?: string;
  preparer?: string;
  instrumentType?: string;
  propertyAddress?: string;
  apn?: string;
  granteeAddress?: string;
  consideration?: string;
};

export function validateCoverSheetTokens(
  tokens: CoverSheetTokens, 
  meta: CountyMeta
): { valid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  if (meta.requiresReturnAddress && !tokens.returnAddress) {
    missing.push('returnAddress');
  }
  if (meta.requiresPreparer && !tokens.preparer) {
    missing.push('preparer');
  }
  if (meta.requiresGranteeAddress && !tokens.granteeAddress) {
    missing.push('granteeAddress');
  }
  if (meta.requiresAPN && !tokens.apn) {
    missing.push('apn');
  }
  
  return {
    valid: missing.length === 0,
    missing
  };
}