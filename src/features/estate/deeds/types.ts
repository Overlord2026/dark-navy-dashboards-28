export interface RecordingRule {
  state: string;
  allowed: string[];
  recordingRequired: boolean;
  notaryRequired: boolean;
  witnessCount: number;
  transferTaxRequired: boolean;
  disclosureRequired: boolean;
  titleInsuranceRecommended: boolean;
  marginRules?: { top: number; bottom: number; left: number; right: number };
  notary?: boolean;
  witnesses?: number;
  todAvailable?: boolean;
  ladyBirdAvailable?: boolean;
}