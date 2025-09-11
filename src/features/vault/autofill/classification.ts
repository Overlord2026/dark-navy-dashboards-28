import * as Canonical from '@/lib/canonical';

export type DocumentClass = 
  | 'Will'
  | 'RLT' 
  | 'PourOver'
  | 'POA'
  | 'HC_POA'
  | 'AD'
  | 'HIPAA'
  | 'Deed'
  | 'Beneficiary'
  | 'FundingLetter'
  | 'AttorneyReview'
  | 'AttorneyFinal'
  | 'NotaryFinal'
  | 'Other';

export function normalizeName(hint: string, meta: Record<string, any> = {}): string {
  const now = new Date();
  const year = now.getFullYear();
  const base = meta.state ? `${hint}-${meta.state}` : hint;
  
  // Determine folder based on document class
  let folder = 'Estate';
  if (hint.includes('Health') || meta.domain === 'health') {
    folder = 'Estate/Health';
  } else if (hint.includes('Deed')) {
    folder = 'Estate/Deeds';
  } else if (hint.includes('Attorney')) {
    folder = 'Estate/Attorney';
  } else if (hint.includes('Beneficiary') || hint.includes('Funding')) {
    folder = 'Estate/Funding';
  }
  
  return `${folder}/${year}/${base}.pdf`;
}

export function classify(
  mode: 'rule' | 'stub-ml',
  fileName: string,
  meta: Record<string, any> = {}
): DocumentClass {
  const name = fileName.toLowerCase();
  
  // Rule-based classification
  if (name.includes('pour') && name.includes('will')) return 'PourOver';
  if (name.includes('revocable') || name.includes('trust') || name.includes('rlt')) return 'RLT';
  if (name.includes('will') && !name.includes('pour')) return 'Will';
  if (name.includes('power') && name.includes('attorney') && meta.domain !== 'health') return 'POA';
  if (name.includes('health') && (name.includes('poa') || name.includes('power'))) return 'HC_POA';
  if (name.includes('advance') || name.includes('living will') || name.includes('directive')) return 'AD';
  if (name.includes('hipaa')) return 'HIPAA';
  if (name.includes('deed')) return 'Deed';
  if (name.includes('beneficiary') || name.includes('tod') || name.includes('pod')) return 'Beneficiary';
  if (name.includes('funding')) return 'FundingLetter';
  
  // Source-based classification
  if (meta.source === 'review' && name.includes('final')) return 'AttorneyFinal';
  if (meta.source === 'notary') return 'NotaryFinal';
  if (meta.source === 'review') return 'AttorneyReview';
  
  return 'Other';
}

export async function computeHash(bytes: Uint8Array): Promise<string> {
  return await Canonical.hash(bytes);
}

export function suggestFolderAndTags(cls: DocumentClass, meta: Record<string, any> = {}) {
  let folder = 'Estate';
  
  // Determine specific folder
  if (['HC_POA', 'AD', 'HIPAA'].includes(cls)) {
    folder = 'Estate/Health';
  } else if (cls === 'Deed') {
    folder = 'Estate/Deeds';
  } else if (['AttorneyReview', 'AttorneyFinal'].includes(cls)) {
    folder = 'Estate/Attorney';
  } else if (['Beneficiary', 'FundingLetter'].includes(cls)) {
    folder = 'Estate/Funding';
  }
  
  const tags = [
    cls,
    meta.state || '',
    meta.source || '',
    meta.county || '',
    meta.notarized ? 'notarized' : '',
    meta.signed ? 'signed' : '',
    meta.recorded ? 'recorded' : ''
  ].filter(Boolean);
  
  return { folder, tags };
}

export function bumpVersion(existingName: string, currentVersion: number): string {
  const newVersion = currentVersion + 1;
  
  // If no version in name, add v2
  if (!existingName.match(/-v\d+\.pdf$/i)) {
    return existingName.replace(/\.pdf$/i, `-v${newVersion}.pdf`);
  }
  
  // Replace existing version
  return existingName.replace(/-v\d+\.pdf$/i, `-v${newVersion}.pdf`);
}

export function extractVersionFromName(fileName: string): number {
  const match = fileName.match(/-v(\d+)\.pdf$/i);
  return match ? parseInt(match[1], 10) : 1;
}