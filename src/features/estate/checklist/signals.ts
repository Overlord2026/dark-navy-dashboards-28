export type DocSignal =
  | { type: 'doc.ingested'; class: string; state?: string; hash: string; fileId: string }
  | { type: 'deed.recorded'; state: string; county?: string; instrumentNo?: string; hash: string; fileId: string }
  | { type: 'arp.final.created'; hash: string; fileId: string }
  | { type: 'notary.final.created'; hash: string; fileId: string }
  | { type: 'beneficiary.fixed'; hash?: string }
  | { type: 'funding.letter'; hash?: string }
  | { type: 'esign.completed'; docType: string; hash: string; fileId: string };

export type ChecklistSignalOptions = {
  clientId: string;
  signal: DocSignal;
  forceRecompute?: boolean;
};