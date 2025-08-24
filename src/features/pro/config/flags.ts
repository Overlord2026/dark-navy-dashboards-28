// Feature flags for Pro system
export const FEATURE_FLAGS = {
  PRO_LEADS_ENABLED: true,
  PRO_MEETINGS_ENABLED: true,
  PRO_CAMPAIGNS_ENABLED: true,
  PRO_IMPORTS_ENABLED: true,
  ANCHOR_ON_IMPORT: false, // Default off for performance
  VAULT_GRANTS_ENABLED: true,
  COMPLIANCE_RECEIPTS_ENABLED: true,
  RISK_DETECTION_ENABLED: true,
  PII_MASKING_ENABLED: true,
} as const;

export const CONFIG = {
  VAULT_GRANT_DAYS: 90, // Default vault access duration
  CONSENT_TTL_DAYS: 90, // Default consent validity
  MAX_EXPORT_RECORDS: 10000, // Export size limit
  COMPLIANCE_POLICY_VERSION: 'v1.0',
  
  // Persona-specific settings
  PERSONA_SETTINGS: {
    advisor: {
      consent_purposes: ['financial_advisory', 'investment_guidance', 'portfolio_review'],
      risk_tolerance: 'medium',
      required_disclosures: ['fiduciary', 'investment_risks']
    },
    cpa: {
      consent_purposes: ['tax_preparation', 'accounting_services', 'financial_records'],
      risk_tolerance: 'high',
      required_disclosures: ['tax_professional', 'confidentiality']
    },
    attorney: {
      consent_purposes: ['legal_advice', 'document_review', 'representation'],
      risk_tolerance: 'high',
      required_disclosures: ['attorney_client_privilege', 'legal_disclaimers']
    },
    insurance: {
      consent_purposes: ['insurance_quotes', 'policy_review', 'claims_assistance'],
      risk_tolerance: 'medium',
      required_disclosures: ['licensed_agent', 'product_risks']
    },
    healthcare: {
      consent_purposes: ['health_consultation', 'medical_records', 'treatment_coordination'],
      risk_tolerance: 'high',
      required_disclosures: ['hipaa', 'medical_disclaimers']
    },
    realtor: {
      consent_purposes: ['property_search', 'market_analysis', 'transaction_support'],
      risk_tolerance: 'low',
      required_disclosures: ['licensed_realtor', 'market_disclaimers']
    }
  }
} as const;

export function getPersonaConfig(persona: keyof typeof CONFIG.PERSONA_SETTINGS) {
  return CONFIG.PERSONA_SETTINGS[persona];
}

export function isFeatureEnabled(flag: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[flag];
}