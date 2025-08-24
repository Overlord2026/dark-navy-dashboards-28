export interface RecordingRule {
  state: string;
  allowed: string[];
  recordingRequired: boolean;
  notaryRequired: boolean;
  witnessCount: number;
  transferTaxRequired: boolean;
  disclosureRequired: boolean;
  titleInsuranceRecommended: boolean;
}