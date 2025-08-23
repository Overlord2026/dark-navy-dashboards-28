// Default tools per persona for first-time login
export const DEFAULT_TOOLS_BY_PERSONA = {
  family: [
    'wealth-vault',
    'receipts-viewer',
    'money-in-7'
  ],
  retiree: [
    'retirement-roadmap',
    'rmd-check', 
    'ss-optimizer',
    'roth-ladder',
    'taxhub-diy',
    'wealth-vault',
    'beneficiary-center',
    'financial-poa',
    'annuities-review',
    'private-markets',
    'longevity-hub'
  ],
  advisor: [
    'retirement-roadmap',
    'wealth-vault',
    'portfolio-analytics',
    'compliance-tracker',
    'client-dashboard'
  ],
  cpa: [
    'taxhub-diy',
    'wealth-vault',
    'receipts-viewer',
    'tax-optimizer'
  ],
  attorney: [
    'wealth-vault',
    'beneficiary-center',
    'financial-poa',
    'estate-planner'
  ],
  insurance: [
    'annuities-review',
    'longevity-hub',
    'insurance-analyzer',
    'wealth-vault'
  ],
  realtor: [
    'wealth-vault',
    'receipts-viewer',
    'property-analyzer'
  ],
  nil: [
    'nil-compliance',
    'nil-earnings',
    'wealth-vault'
  ]
} as const;

export type PersonaType = keyof typeof DEFAULT_TOOLS_BY_PERSONA;