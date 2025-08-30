import { PersonaConfig } from '@/types/bfo-platform';

export const PERSONA_CONFIGS: PersonaConfig[] = [
  {
    id: 'family',
    name: 'Families',
    route: '/family',
    tools: [
      { id: 'retirement-roadmap', name: 'Retirement Roadmap', description: 'Plan your retirement journey', route: '/family/tools/retirement', category: 'financial', enabled: true },
      { id: 'roth-ladder', name: 'Roth Ladder Calculator', description: 'Optimize Roth conversions', route: '/family/tools/roth-ladder', category: 'financial', enabled: true },
      { id: 'rmd-check', name: 'RMD Calculator', description: 'Calculate required distributions', route: '/family/tools/rmd-check', category: 'financial', enabled: true },
      { id: 'tax-hub', name: 'Tax Planning Hub', description: 'Comprehensive tax planning', route: '/family/tools/tax-hub', category: 'financial', enabled: true },
      { id: 'estate-planner', name: 'Estate Planning Wizard', description: 'Plan your legacy', route: '/family/tools/estate', category: 'legal', enabled: true },
      { id: 'health-tracker', name: 'Health & Wellness Tracker', description: 'Monitor your health metrics', route: '/family/tools/health', category: 'healthcare', enabled: true }
    ],
    features: [
      { id: 'voice-assistant', name: 'Voice Assistant', enabled: true },
      { id: 'automated-receipts', name: 'Automated Compliance Receipts', enabled: true },
      { id: 'family-vault', name: 'Secure Document Vault', enabled: true }
    ]
  },
  {
    id: 'advisors',
    name: 'Financial Advisors',
    route: '/personas/advisors',
    tools: [
      { id: 'client-crm', name: 'Client CRM', description: 'Manage client relationships', route: '/advisors/crm', category: 'automation', enabled: true },
      { id: 'portfolio-analysis', name: 'Portfolio Analysis', description: 'Analyze client portfolios', route: '/advisors/portfolio', category: 'financial', enabled: true },
      { id: 'meeting-prep', name: 'Meeting Preparation', description: 'Automated meeting prep', route: '/advisors/meetings', category: 'automation', enabled: true },
      { id: 'compliance-checker', name: 'Compliance Checker', description: 'Ensure regulatory compliance', route: '/advisors/compliance', category: 'legal', enabled: true },
      { id: 'lead-generation', name: 'Lead Generation', description: 'Find and track prospects', route: '/advisors/leads', category: 'automation', enabled: true }
    ],
    features: [
      { id: 'voice-assistant', name: 'Voice Assistant', enabled: true },
      { id: 'automated-workflows', name: 'Automated Workflows', enabled: true },
      { id: 'compliance-monitoring', name: 'Compliance Monitoring', enabled: true }
    ]
  },
  {
    id: 'insurance',
    name: 'Insurance Professionals',
    route: '/personas/insurance',
    subPersonas: [
      {
        id: 'p-and-c',
        name: 'Property & Casualty',
        route: '/personas/insurance/p-and-c',
        description: 'Property and casualty insurance specialists',
        tools: [
          { id: 'risk-assessment', name: 'Risk Assessment Tool', description: 'Evaluate property risks', route: '/insurance/risk-assessment', category: 'insurance', enabled: true },
          { id: 'claims-tracker', name: 'Claims Tracker', description: 'Track and manage claims', route: '/insurance/claims', category: 'automation', enabled: true }
        ]
      },
      {
        id: 'life-annuity',
        name: 'Life & Annuity',
        route: '/personas/insurance/life-annuity',
        description: 'Life insurance and annuity specialists',
        tools: [
          { id: 'needs-analysis', name: 'Insurance Needs Analysis', description: 'Calculate insurance needs', route: '/insurance/needs-analysis', category: 'financial', enabled: true },
          { id: 'annuity-calculator', name: 'Annuity Calculator', description: 'Compare annuity products', route: '/insurance/annuity-calc', category: 'financial', enabled: true }
        ]
      },
      {
        id: 'medicare',
        name: 'Medicare',
        route: '/personas/insurance/medicare',
        description: 'Medicare insurance specialists',
        tools: [
          { id: 'medicare-planner', name: 'Medicare Planner', description: 'Plan Medicare coverage', route: '/insurance/medicare-planner', category: 'healthcare', enabled: true },
          { id: 'supplement-analyzer', name: 'Supplement Analyzer', description: 'Compare supplement plans', route: '/insurance/supplement', category: 'healthcare', enabled: true }
        ]
      },
      {
        id: 'ltc',
        name: 'Long-Term Care',
        route: '/personas/insurance/ltc',
        description: 'Long-term care insurance specialists',
        tools: [
          { id: 'ltc-calculator', name: 'LTC Cost Calculator', description: 'Estimate long-term care costs', route: '/insurance/ltc-calc', category: 'healthcare', enabled: true },
          { id: 'policy-optimizer', name: 'Policy Optimizer', description: 'Optimize LTC policies', route: '/insurance/ltc-optimizer', category: 'insurance', enabled: true }
        ]
      }
    ],
    tools: [
      { id: 'quote-engine', name: 'Quote Engine', description: 'Generate insurance quotes', route: '/insurance/quotes', category: 'automation', enabled: true },
      { id: 'underwriting-assistant', name: 'Underwriting Assistant', description: 'AI-powered underwriting', route: '/insurance/underwriting', category: 'automation', enabled: true },
      { id: 'commission-tracker', name: 'Commission Tracker', description: 'Track commissions and renewals', route: '/insurance/commissions', category: 'financial', enabled: true }
    ],
    features: [
      { id: 'voice-assistant', name: 'Voice Assistant', enabled: true },
      { id: 'automated-quoting', name: 'Automated Quoting', enabled: true },
      { id: 'compliance-monitoring', name: 'Compliance Monitoring', enabled: true }
    ]
  },
  {
    id: 'attorney',
    name: 'Attorneys',
    route: '/personas/attorney',
    subPersonas: [
      {
        id: 'estate-planning',
        name: 'Estate Planning',
        route: '/personas/attorney/estate-planning',
        description: 'Estate planning and probate attorneys',
        tools: [
          { id: 'will-generator', name: 'Will Generator', description: 'Generate legal wills', route: '/attorney/will-generator', category: 'legal', enabled: true },
          { id: 'trust-designer', name: 'Trust Designer', description: 'Design trust structures', route: '/attorney/trust-designer', category: 'legal', enabled: true },
          { id: 'probate-tracker', name: 'Probate Tracker', description: 'Track probate proceedings', route: '/attorney/probate', category: 'legal', enabled: true }
        ]
      },
      {
        id: 'litigation',
        name: 'Litigation',
        route: '/personas/attorney/litigation',
        description: 'Litigation and trial attorneys',
        tools: [
          { id: 'case-manager', name: 'Case Manager', description: 'Manage litigation cases', route: '/attorney/cases', category: 'legal', enabled: true },
          { id: 'discovery-assistant', name: 'Discovery Assistant', description: 'Manage discovery process', route: '/attorney/discovery', category: 'automation', enabled: true },
          { id: 'billing-tracker', name: 'Billing Tracker', description: 'Track billable hours', route: '/attorney/billing', category: 'financial', enabled: true }
        ]
      }
    ],
    tools: [
      { id: 'document-generator', name: 'Document Generator', description: 'Generate legal documents', route: '/attorney/documents', category: 'automation', enabled: true },
      { id: 'client-portal', name: 'Client Portal', description: 'Secure client communication', route: '/attorney/portal', category: 'automation', enabled: true },
      { id: 'compliance-checker', name: 'Compliance Checker', description: 'Bar compliance monitoring', route: '/attorney/compliance', category: 'legal', enabled: true }
    ],
    features: [
      { id: 'voice-assistant', name: 'Voice Assistant', enabled: true },
      { id: 'document-automation', name: 'Document Automation', enabled: true },
      { id: 'compliance-monitoring', name: 'Compliance Monitoring', enabled: true }
    ]
  },
  {
    id: 'cpa',
    name: 'CPAs',
    route: '/personas/cpa',
    tools: [
      { id: 'tax-preparation', name: 'Tax Preparation Suite', description: 'Comprehensive tax prep tools', route: '/cpa/tax-prep', category: 'financial', enabled: true },
      { id: 'bookkeeping-automation', name: 'Bookkeeping Automation', description: 'Automated bookkeeping', route: '/cpa/bookkeeping', category: 'automation', enabled: true },
      { id: 'audit-assistant', name: 'Audit Assistant', description: 'Audit planning and execution', route: '/cpa/audit', category: 'financial', enabled: true },
      { id: 'financial-reporting', name: 'Financial Reporting', description: 'Generate financial reports', route: '/cpa/reports', category: 'financial', enabled: true },
      { id: 'client-dashboard', name: 'Client Dashboard', description: 'Client portal and communication', route: '/cpa/clients', category: 'automation', enabled: true }
    ],
    features: [
      { id: 'voice-assistant', name: 'Voice Assistant', enabled: true },
      { id: 'automated-workflows', name: 'Automated Workflows', enabled: true },
      { id: 'compliance-monitoring', name: 'Compliance Monitoring', enabled: true }
    ]
  },
  {
    id: 'healthcare',
    name: 'Healthcare Professionals',
    route: '/personas/healthcare',
    subPersonas: [
      {
        id: 'provider',
        name: 'Healthcare Provider',
        route: '/personas/healthcare/provider',
        description: 'Doctors, nurses, and medical professionals',
        tools: [
          { id: 'patient-portal', name: 'Patient Portal', description: 'Secure patient communication', route: '/healthcare/portal', category: 'healthcare', enabled: true },
          { id: 'ehr-integration', name: 'EHR Integration', description: 'Electronic health records', route: '/healthcare/ehr', category: 'healthcare', enabled: true }
        ]
      },
      {
        id: 'clinic',
        name: 'Clinic Administration',
        route: '/personas/healthcare/clinic',
        description: 'Healthcare clinic administrators',
        tools: [
          { id: 'scheduling-system', name: 'Scheduling System', description: 'Appointment scheduling', route: '/healthcare/scheduling', category: 'automation', enabled: true },
          { id: 'billing-management', name: 'Billing Management', description: 'Medical billing and coding', route: '/healthcare/billing', category: 'financial', enabled: true }
        ]
      },
      {
        id: 'wellness',
        name: 'Wellness Coach',
        route: '/personas/healthcare/wellness',
        description: 'Wellness and lifestyle coaches',
        tools: [
          { id: 'wellness-tracker', name: 'Wellness Tracker', description: 'Track client wellness metrics', route: '/healthcare/wellness', category: 'healthcare', enabled: true },
          { id: 'program-builder', name: 'Program Builder', description: 'Build wellness programs', route: '/healthcare/programs', category: 'healthcare', enabled: true }
        ]
      }
    ],
    tools: [
      { id: 'compliance-manager', name: 'HIPAA Compliance Manager', description: 'Ensure HIPAA compliance', route: '/healthcare/compliance', category: 'legal', enabled: true },
      { id: 'telehealth-platform', name: 'Telehealth Platform', description: 'Virtual consultations', route: '/healthcare/telehealth', category: 'healthcare', enabled: true }
    ],
    features: [
      { id: 'voice-assistant', name: 'Voice Assistant', enabled: true },
      { id: 'hipaa-compliance', name: 'HIPAA Compliance', enabled: true },
      { id: 'automated-workflows', name: 'Automated Workflows', enabled: true }
    ]
  },
  {
    id: 'nil',
    name: 'NIL Athletes',
    route: '/personas/nil',
    tools: [
      { id: 'deal-tracker', name: 'NIL Deal Tracker', description: 'Track NIL opportunities', route: '/nil/deals', category: 'financial', enabled: true },
      { id: 'brand-builder', name: 'Brand Builder', description: 'Build personal brand', route: '/nil/brand', category: 'automation', enabled: true },
      { id: 'compliance-monitor', name: 'NCAA Compliance Monitor', description: 'NCAA compliance tracking', route: '/nil/compliance', category: 'legal', enabled: true },
      { id: 'tax-planner', name: 'Tax Planner', description: 'Plan taxes for NIL income', route: '/nil/taxes', category: 'financial', enabled: true }
    ],
    features: [
      { id: 'voice-assistant', name: 'Voice Assistant', enabled: true },
      { id: 'compliance-monitoring', name: 'NCAA Compliance', enabled: true },
      { id: 'brand-management', name: 'Brand Management', enabled: true }
    ]
  }
];

export const getPersonaConfig = (personaId: string): PersonaConfig | undefined => {
  return PERSONA_CONFIGS.find(p => p.id === personaId);
};

export const getSubPersonaConfig = (personaId: string, subPersonaId: string) => {
  const persona = getPersonaConfig(personaId);
  return persona?.subPersonas?.find(sp => sp.id === subPersonaId);
};