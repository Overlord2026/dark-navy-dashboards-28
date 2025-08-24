import type { CountyMeta } from './countyMeta';

export type LayoutIssue =
  | 'MARGIN_TOP'
  | 'MARGIN_LEFT'
  | 'MARGIN_RIGHT'
  | 'MARGIN_BOTTOM'
  | 'STAMP_AREA'
  | 'MISSING_RETURN_ADDRESS'
  | 'MISSING_PREPARER'
  | 'MISSING_GRANTEE_ADDRESS'
  | 'MISSING_APN'
  | 'FONT_TOO_SMALL'
  | 'INK_NOT_BLACK';

export type IntakeCheck = { 
  ok: boolean; 
  issues: LayoutIssue[]; 
  details?: Record<string, any> 
};

export function validateFirstPage(meta: CountyMeta, fields: {
  hasReturnAddress: boolean;
  hasPreparer: boolean;
  hasGranteeAddress?: boolean;
  hasAPN?: boolean;
  fontPt?: number;
  inkColor?: 'black' | 'blue';
  // PDF geometry measurements (inches):
  topMarginIn: number; 
  leftMarginIn: number; 
  rightMarginIn: number; 
  bottomMarginIn: number;
  // optional detection of text box overlap with stamp area
  firstPageStampFree?: boolean;
}): IntakeCheck {
  const issues: LayoutIssue[] = [];
  
  if (fields.topMarginIn < meta.topMarginIn) issues.push('MARGIN_TOP');
  if (fields.leftMarginIn < meta.leftMarginIn) issues.push('MARGIN_LEFT');
  if (fields.rightMarginIn < meta.rightMarginIn) issues.push('MARGIN_RIGHT');
  if (fields.bottomMarginIn < meta.bottomMarginIn) issues.push('MARGIN_BOTTOM');
  if (fields.firstPageStampFree === false) issues.push('STAMP_AREA');
  if (meta.requiresReturnAddress && !fields.hasReturnAddress) issues.push('MISSING_RETURN_ADDRESS');
  if (meta.requiresPreparer && !fields.hasPreparer) issues.push('MISSING_PREPARER');
  if (meta.requiresGranteeAddress && !fields.hasGranteeAddress) issues.push('MISSING_GRANTEE_ADDRESS');
  if (meta.requiresAPN && !fields.hasAPN) issues.push('MISSING_APN');
  if (meta.minFontPt && (fields.fontPt || 0) < meta.minFontPt) issues.push('FONT_TOO_SMALL');
  if (meta.inkColor === 'black' && fields.inkColor && fields.inkColor !== 'black') issues.push('INK_NOT_BLACK');
  
  return { 
    ok: issues.length === 0, 
    issues,
    details: {
      requiredMargins: {
        top: meta.topMarginIn,
        left: meta.leftMarginIn,
        right: meta.rightMarginIn,
        bottom: meta.bottomMarginIn
      },
      actualMargins: {
        top: fields.topMarginIn,
        left: fields.leftMarginIn,
        right: fields.rightMarginIn,
        bottom: fields.bottomMarginIn
      }
    }
  };
}

export function getIssueDescription(issue: LayoutIssue): string {
  switch (issue) {
    case 'MARGIN_TOP': return 'Top margin too small';
    case 'MARGIN_LEFT': return 'Left margin too small';
    case 'MARGIN_RIGHT': return 'Right margin too small';
    case 'MARGIN_BOTTOM': return 'Bottom margin too small';
    case 'STAMP_AREA': return 'Text overlaps recorder stamp area';
    case 'MISSING_RETURN_ADDRESS': return 'Return address required';
    case 'MISSING_PREPARER': return 'Preparer information required';
    case 'MISSING_GRANTEE_ADDRESS': return 'Grantee address required';
    case 'MISSING_APN': return 'APN/Parcel number required';
    case 'FONT_TOO_SMALL': return 'Font size too small';
    case 'INK_NOT_BLACK': return 'Black ink required';
    default: return 'Unknown issue';
  }
}

export function getIssueSeverity(issue: LayoutIssue): 'low' | 'medium' | 'high' {
  switch (issue) {
    case 'MARGIN_TOP':
    case 'MARGIN_LEFT':
    case 'MARGIN_RIGHT':
    case 'MARGIN_BOTTOM':
    case 'STAMP_AREA':
      return 'high';
    case 'MISSING_RETURN_ADDRESS':
    case 'MISSING_PREPARER':
    case 'MISSING_GRANTEE_ADDRESS':
    case 'MISSING_APN':
      return 'high';
    case 'FONT_TOO_SMALL':
    case 'INK_NOT_BLACK':
      return 'medium';
    default:
      return 'low';
  }
}