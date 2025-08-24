import type { PortfolioRow } from './data';

export type FlagKey =
  | 'trustWithoutDeed'
  | 'healthIncomplete'
  | 'noReviewFinal'
  | 'signedNoFinal'
  | 'deliveredNotLatest'
  | 'consentMissing'
  | 'autofillOff';

export function explainFlags(r: PortfolioRow): Array<{ key: FlagKey; why: string; next: string[] }> {
  const out: Array<{ key: FlagKey; why: string; next: string[] }> = [];
  const f = r.flags || {};
  
  if (f.trustWithoutDeed) {
    out.push({
      key: 'trustWithoutDeed',
      why: 'Trust exists but no recorded deed linking property title to the trust.',
      next: ['Request deed preparation', 'Record deed when returned', 'Re-run checklist']
    });
  }
  
  if (f.healthIncomplete) {
    out.push({
      key: 'healthIncomplete',
      why: 'Healthcare packet incomplete — HC POA, Advance Directive (Living Will), or HIPAA missing.',
      next: ['Generate missing health forms', 'Offer notary for health packet', 'Re-run checklist']
    });
  }
  
  if (f.noReviewFinal) {
    out.push({
      key: 'noReviewFinal',
      why: 'No Attorney Review Final has been created.',
      next: ['Prepare Attorney Review Package', 'Attorney e-sign Review Letter', 'Merge & Stamp Final', 'Deliver final']
    });
  }
  
  if (f.signedNoFinal) {
    out.push({
      key: 'signedNoFinal',
      why: 'Attorney signed the Review Letter but Final Packet has not been created.',
      next: ['Merge & Stamp Final now', 'Deliver final to family']
    });
  }
  
  if (f.deliveredNotLatest) {
    out.push({
      key: 'deliveredNotLatest',
      why: 'A newer Final Packet (vCurrent) exists but the delivered version is older.',
      next: ['Deliver current final version', 'Notify advisor']
    });
  }
  
  if (f.consentMissing) {
    out.push({
      key: 'consentMissing',
      why: 'Client has not granted permission for Vault auto-populate of estate docs.',
      next: ['Invite client to grant consent (Vault → Auto-populate)']
    });
  }
  
  if (f.autofillOff) {
    out.push({
      key: 'autofillOff',
      why: 'Auto-populate pipeline is off for this client.',
      next: ['Enable auto-populate', 'Invite consent if not granted']
    });
  }
  
  return out;
}