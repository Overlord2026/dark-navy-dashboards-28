import { ProfessionalDashboardConfig, ProfessionalSegment } from '@/types/professional';

// Professional segment configurations with dashboard layouts, permissions, and onboarding flows
export const PROFESSIONAL_SEGMENT_CONFIGS: Record<ProfessionalSegment, ProfessionalDashboardConfig> = {
  wealth_management: {
    segment: 'wealth_management',
    widgets: [
      'client_overview',
      'aum_tracking',
      'referral_pipeline',
      'compliance_dashboard',
      'performance_metrics',
      'document_vault',
      'meeting_scheduler'
    ],
    permissions: [
      'view_client_data',
      'manage_portfolios',
      'access_reporting_tools',
      'send_secure_messages',
      'upload_documents',
      'schedule_meetings',
      'manage_referrals'
    ],
    referral_settings: {
      accepts_inbound: true,
      accepts_outbound: true,
      fee_structure: 'percentage_based'
    },
    onboarding_steps: [
      'profile_setup',
      'license_verification',
      'compliance_review',
      'aum_documentation',
      'client_capacity_setup',
      'fee_structure_config',
      'referral_preferences'
    ],
    required_documents: [
      'ADV_form',
      'state_licenses',
      'E&O_insurance',
      'compliance_manual',
      'client_agreement_template'
    ],
    compliance_requirements: [
      'fiduciary_standard',
      'state_registration',
      'continuing_education',
      'annual_compliance_review'
    ]
  },

  legal_advisory: {
    segment: 'legal_advisory',
    widgets: [
      'case_management',
      'document_review',
      'billing_tracker',
      'referral_network',
      'compliance_alerts',
      'client_communications',
      'trust_administration'
    ],
    permissions: [
      'manage_cases',
      'access_legal_vault',
      'review_documents',
      'manage_trust_accounts',
      'send_privileged_communications',
      'generate_legal_reports'
    ],
    referral_settings: {
      accepts_inbound: true,
      accepts_outbound: true,
      fee_structure: 'hourly_referral_fee'
    },
    onboarding_steps: [
      'bar_verification',
      'malpractice_insurance',
      'specialization_documentation',
      'retainer_structure_setup',
      'conflict_checking_system',
      'client_intake_process'
    ],
    required_documents: [
      'bar_certificate',
      'malpractice_insurance',
      'specialization_certifications',
      'engagement_letter_template',
      'conflict_waiver_forms'
    ],
    compliance_requirements: [
      'bar_membership',
      'cle_requirements',
      'ethics_training',
      'trust_account_compliance'
    ]
  },

  tax_compliance: {
    segment: 'tax_compliance',
    widgets: [
      'tax_calendar',
      'client_organizers',
      'projection_tools',
      'compliance_tracker',
      'document_portal',
      'tax_planning_scenarios',
      'multi_state_tracking'
    ],
    permissions: [
      'access_tax_documents',
      'prepare_returns',
      'manage_extensions',
      'conduct_tax_planning',
      'represent_before_irs',
      'access_tax_research_tools'
    ],
    referral_settings: {
      accepts_inbound: true,
      accepts_outbound: true,
      fee_structure: 'fixed_fee_percentage'
    },
    onboarding_steps: [
      'cpa_license_verification',
      'tax_software_setup',
      'client_capacity_assessment',
      'specialization_areas',
      'fee_structure_configuration',
      'irs_representation_status'
    ],
    required_documents: [
      'cpa_license',
      'continuing_education_certificates',
      'irs_preparer_tax_id',
      'engagement_letter_template',
      'privacy_policy'
    ],
    compliance_requirements: [
      'annual_license_renewal',
      'continuing_education',
      'irs_registration',
      'privacy_compliance'
    ]
  },

  insurance_planning: {
    segment: 'insurance_planning',
    widgets: [
      'policy_tracker',
      'premium_calculator',
      'needs_analysis',
      'carrier_comparisons',
      'claims_management',
      'commission_tracker',
      'underwriting_pipeline'
    ],
    permissions: [
      'access_policy_data',
      'run_illustrations',
      'submit_applications',
      'manage_claims',
      'access_carrier_systems',
      'generate_proposals'
    ],
    referral_settings: {
      accepts_inbound: true,
      accepts_outbound: true,
      fee_structure: 'commission_split'
    },
    onboarding_steps: [
      'license_verification',
      'carrier_appointments',
      'specialization_training',
      'compliance_review',
      'client_suitability_process'
    ],
    required_documents: [
      'insurance_licenses',
      'carrier_appointments',
      'e&o_insurance',
      'suitability_documentation',
      'disclosure_forms'
    ],
    compliance_requirements: [
      'state_licensing',
      'continuing_education',
      'suitability_standards',
      'disclosure_requirements'
    ]
  },

  real_estate: {
    segment: 'real_estate',
    widgets: [
      'property_portfolio',
      'market_analytics',
      'transaction_pipeline',
      'maintenance_tracker',
      'tenant_management',
      'financial_reporting',
      'investment_analysis'
    ],
    permissions: [
      'manage_properties',
      'access_market_data',
      'coordinate_transactions',
      'manage_leases',
      'track_maintenance',
      'generate_reports'
    ],
    referral_settings: {
      accepts_inbound: true,
      accepts_outbound: true,
      fee_structure: 'transaction_based'
    },
    onboarding_steps: [
      'license_verification',
      'property_management_setup',
      'insurance_verification',
      'vendor_network_setup',
      'reporting_preferences'
    ],
    required_documents: [
      'real_estate_license',
      'property_management_license',
      'e&o_insurance',
      'vendor_agreements',
      'lease_templates'
    ],
    compliance_requirements: [
      'state_licensing',
      'fair_housing_training',
      'property_management_compliance',
      'trust_account_management'
    ]
  },

  philanthropy: {
    segment: 'philanthropy',
    widgets: [
      'giving_dashboard',
      'impact_metrics',
      'foundation_management',
      'tax_benefit_calculator',
      'grant_tracking',
      'donor_engagement',
      'charity_research'
    ],
    permissions: [
      'manage_giving_strategies',
      'access_charity_database',
      'calculate_tax_benefits',
      'track_impact_metrics',
      'manage_daf_accounts',
      'coordinate_family_giving'
    ],
    referral_settings: {
      accepts_inbound: true,
      accepts_outbound: false,
      fee_structure: 'advisory_fee'
    },
    onboarding_steps: [
      'certification_verification',
      'specialization_setup',
      'charity_network_integration',
      'impact_measurement_setup',
      'family_governance_training'
    ],
    required_documents: [
      'cfp_certification',
      'philanthropy_training_certificates',
      'charity_partnerships',
      'impact_measurement_framework'
    ],
    compliance_requirements: [
      'fiduciary_training',
      'charity_due_diligence',
      'impact_reporting',
      'tax_compliance'
    ]
  },

  healthcare: {
    segment: 'healthcare',
    widgets: [
      'health_plan_analysis',
      'claims_tracking',
      'provider_network',
      'wellness_programs',
      'ltc_planning',
      'medicare_guidance',
      'health_savings_optimization'
    ],
    permissions: [
      'analyze_health_plans',
      'track_claims',
      'coordinate_care',
      'manage_health_savings',
      'provide_medicare_guidance',
      'plan_long_term_care'
    ],
    referral_settings: {
      accepts_inbound: true,
      accepts_outbound: true,
      fee_structure: 'consultation_fee'
    },
    onboarding_steps: [
      'healthcare_background_verification',
      'insurance_expertise_assessment',
      'medicare_certification',
      'privacy_training',
      'care_coordination_setup'
    ],
    required_documents: [
      'healthcare_credentials',
      'insurance_certifications',
      'medicare_training_certificates',
      'hipaa_compliance_documentation'
    ],
    compliance_requirements: [
      'hipaa_compliance',
      'medicare_certification',
      'continuing_education',
      'privacy_standards'
    ]
  },

  luxury_services: {
    segment: 'luxury_services',
    widgets: [
      'concierge_requests',
      'travel_itineraries',
      'vendor_network',
      'event_planning',
      'lifestyle_management',
      'preference_tracking',
      'service_coordination'
    ],
    permissions: [
      'manage_concierge_services',
      'coordinate_travel',
      'plan_events',
      'manage_vendor_relationships',
      'track_preferences',
      'coordinate_lifestyle_services'
    ],
    referral_settings: {
      accepts_inbound: true,
      accepts_outbound: false,
      fee_structure: 'service_fee'
    },
    onboarding_steps: [
      'service_portfolio_setup',
      'vendor_network_verification',
      'insurance_coverage_review',
      'client_preference_system',
      'emergency_protocols'
    ],
    required_documents: [
      'business_license',
      'insurance_coverage',
      'vendor_agreements',
      'service_contracts',
      'privacy_agreements'
    ],
    compliance_requirements: [
      'business_licensing',
      'insurance_coverage',
      'vendor_compliance',
      'privacy_protection'
    ]
  },

  investment_management: {
    segment: 'investment_management',
    widgets: [
      'portfolio_analytics',
      'performance_tracking',
      'risk_management',
      'deal_pipeline',
      'due_diligence',
      'investor_relations',
      'regulatory_compliance'
    ],
    permissions: [
      'manage_investments',
      'conduct_due_diligence',
      'track_performance',
      'manage_investor_relations',
      'access_deal_flow',
      'generate_reports'
    ],
    referral_settings: {
      accepts_inbound: true,
      accepts_outbound: true,
      fee_structure: 'management_fee_carry'
    },
    onboarding_steps: [
      'registration_verification',
      'investment_strategy_setup',
      'compliance_review',
      'investor_qualification',
      'reporting_framework'
    ],
    required_documents: [
      'investment_advisor_registration',
      'form_adv',
      'compliance_manual',
      'investment_management_agreement',
      'accredited_investor_verification'
    ],
    compliance_requirements: [
      'sec_registration',
      'fiduciary_duty',
      'custody_rules',
      'marketing_restrictions'
    ]
  },

  business_advisory: {
    segment: 'business_advisory',
    widgets: [
      'business_valuation',
      'succession_planning',
      'transaction_pipeline',
      'due_diligence_tracker',
      'exit_strategy_planner',
      'tax_structuring',
      'deal_analytics'
    ],
    permissions: [
      'conduct_valuations',
      'plan_successions',
      'manage_transactions',
      'coordinate_due_diligence',
      'structure_deals',
      'provide_tax_guidance'
    ],
    referral_settings: {
      accepts_inbound: true,
      accepts_outbound: true,
      fee_structure: 'success_fee_retainer'
    },
    onboarding_steps: [
      'credential_verification',
      'specialization_assessment',
      'transaction_experience_review',
      'fee_structure_setup',
      'conflict_procedures'
    ],
    required_documents: [
      'professional_credentials',
      'transaction_experience',
      'valuation_certifications',
      'engagement_letter_template',
      'confidentiality_agreements'
    ],
    compliance_requirements: [
      'professional_licensing',
      'continuing_education',
      'ethics_training',
      'confidentiality_standards'
    ]
  },

  family_office: {
    segment: 'family_office',
    widgets: [
      'family_governance',
      'consolidated_reporting',
      'multi_entity_management',
      'next_gen_education',
      'family_meetings',
      'investment_committee',
      'philanthropy_coordination'
    ],
    permissions: [
      'manage_family_governance',
      'consolidate_reporting',
      'coordinate_investments',
      'plan_education',
      'manage_meetings',
      'oversee_philanthropy'
    ],
    referral_settings: {
      accepts_inbound: true,
      accepts_outbound: true,
      fee_structure: 'asset_based_fee'
    },
    onboarding_steps: [
      'family_office_setup',
      'governance_framework',
      'investment_policy',
      'reporting_structure',
      'next_gen_planning',
      'philanthropy_strategy'
    ],
    required_documents: [
      'family_office_charter',
      'investment_policy_statement',
      'governance_documents',
      'service_agreements',
      'compliance_framework'
    ],
    compliance_requirements: [
      'family_office_exemption',
      'fiduciary_standards',
      'record_keeping',
      'regulatory_compliance'
    ]
  }
};

// Helper functions for professional segment management
export function getProfessionalSegmentConfig(segment: ProfessionalSegment): ProfessionalDashboardConfig {
  return PROFESSIONAL_SEGMENT_CONFIGS[segment];
}

export function getSegmentsByRole(userRole: string): ProfessionalSegment[] {
  const segmentMap: Record<string, ProfessionalSegment[]> = {
    'private_banker': ['wealth_management', 'investment_management'],
    'estate_planner': ['legal_advisory', 'wealth_management'],
    'business_succession_advisor': ['business_advisory', 'legal_advisory'],
    'insurance_specialist': ['insurance_planning', 'wealth_management'],
    'property_manager': ['real_estate'],
    'philanthropy_consultant': ['philanthropy'],
    'healthcare_advocate': ['healthcare'],
    'luxury_concierge': ['luxury_services'],
    'family_law_advisor': ['legal_advisory'],
    'platform_aggregator': ['family_office', 'investment_management'],
    'retirement_advisor': ['wealth_management', 'insurance_planning'],
    'private_lender': ['investment_management', 'business_advisory'],
    'investment_club_lead': ['investment_management'],
    'vc_pe_professional': ['investment_management', 'business_advisory'],
    'tax_resolution_specialist': ['tax_compliance', 'legal_advisory'],
    'hr_benefit_consultant': ['insurance_planning', 'business_advisory']
  };

  return segmentMap[userRole] || [];
}

export function getDefaultSegmentForRole(userRole: string): ProfessionalSegment | null {
  const segments = getSegmentsByRole(userRole);
  return segments.length > 0 ? segments[0] : null;
}