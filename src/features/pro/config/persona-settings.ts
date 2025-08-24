import { ProPersona } from '../types';

export const PIPELINE_STAGES: Record<ProPersona, string[]> = {
  advisor: ['New', 'Qualified', 'Proposal', 'Agreement', 'Onboarded', 'Active'],
  cpa: ['New', 'Intake', 'Docs', 'File', 'Review', 'Complete'],
  attorney: ['New', 'Conflict Check', 'Intake', 'Draft', 'Execute', 'Filed'],
  insurance: ['New', 'Quote', 'Disclosure', 'App', 'Issue', 'Renew'],
  healthcare: ['New', 'Screen', 'Intake', 'Plan', 'Session', 'Follow-up'],
  realtor: ['New', 'Contacted', 'Showing', 'Offer', 'Escrow', 'Closed']
};

export const PERSONA_DISCLAIMERS: Record<ProPersona, {
  meeting_import: string;
  data_handling: string;
  compliance_banner?: string;
}> = {
  advisor: {
    meeting_import: 'Investment advisory content processed according to fiduciary standards.',
    data_handling: 'Financial data is vault-protected with secure access controls.'
  },
  cpa: {
    meeting_import: 'Tax preparation materials processed with confidentiality protections.',
    data_handling: 'Tax records are encrypted and access-controlled per IRS guidelines.'
  },
  attorney: {
    meeting_import: 'Attorney-client privileged content - never store privileged communications outside secure vault.',
    data_handling: 'Legal materials protected by attorney-client privilege.',
    compliance_banner: '⚖️ PRIVILEGE CAUTION: Privileged content is vault-only protected'
  },
  insurance: {
    meeting_import: 'Insurance discussions include suitability and replacement analysis when applicable.',
    data_handling: 'Insurance records processed with state regulatory compliance.',
    compliance_banner: '📋 SUITABILITY: Replacement/1035 exchange analysis included in compliance reasons'
  },
  healthcare: {
    meeting_import: 'Healthcare content processed under HIPAA "minimum necessary" standard.',
    data_handling: 'Health information protected under HIPAA with access logging.',
    compliance_banner: '🏥 HIPAA: Only hash values stored in receipts - raw content is vault-protected'
  },
  realtor: {
    meeting_import: 'Real estate content processed with MLS and fair housing compliance.',
    data_handling: 'Property and client data handled per real estate regulations.'
  }
};

export const PERSONA_IMPORT_SETTINGS: Record<ProPersona, {
  display_raw_content: boolean;
  vault_only_content: boolean;
  additional_reasons: string[];
  risk_flags: string[];
}> = {
  advisor: {
    display_raw_content: true,
    vault_only_content: false,
    additional_reasons: ['fiduciary_review'],
    risk_flags: ['investment_risk', 'suitability_concern']
  },
  cpa: {
    display_raw_content: true,
    vault_only_content: false,
    additional_reasons: ['tax_compliance'],
    risk_flags: ['tax_liability', 'accuracy_concern']
  },
  attorney: {
    display_raw_content: false, // Privilege protection
    vault_only_content: true,
    additional_reasons: ['privilege_protection', 'conflict_check'],
    risk_flags: ['privilege_risk', 'conflict_concern']
  },
  insurance: {
    display_raw_content: true,
    vault_only_content: false,
    additional_reasons: ['suitability_check', 'replacement_analysis'],
    risk_flags: ['suitability_concern', 'replacement_risk']
  },
  healthcare: {
    display_raw_content: false, // HIPAA minimum necessary
    vault_only_content: true,
    additional_reasons: ['hipaa_compliance', 'minimum_necessary'],
    risk_flags: ['phi_exposure', 'consent_concern']
  },
  realtor: {
    display_raw_content: true,
    vault_only_content: false,
    additional_reasons: ['fair_housing_compliance'],
    risk_flags: ['discrimination_concern', 'disclosure_issue']
  }
};

export function getPipelineStages(persona: ProPersona): string[] {
  return PIPELINE_STAGES[persona] || [];
}

export function getPersonaDisclaimer(persona: ProPersona, type: keyof typeof PERSONA_DISCLAIMERS['advisor']): string {
  return PERSONA_DISCLAIMERS[persona]?.[type] || '';
}

export function getImportSettings(persona: ProPersona) {
  return PERSONA_IMPORT_SETTINGS[persona] || PERSONA_IMPORT_SETTINGS.advisor;
}