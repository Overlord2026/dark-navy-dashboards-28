// BFO Global IP Execution - Feature Flags
export const IP_FEATURE_FLAGS = {
  // Patent Modules
  PERSONA_GATED_OS: true,           // P1
  SWAG_LEAD_SCORE: true,            // P2  
  PORTFOLIO_INTELLIGENCE: true,     // P3
  VOLATILITY_SHIELD: true,          // P4
  PRIVATE_MARKET_ALPHA: true,       // P5
  DUE_DILIGENCE_AI: true,          // P6
  LIQUIDITY_IQ: true,              // P7
  ANNUITY_INTELLIGENCE: true,       // P8
  LONGEVITY_ADVANTAGE_AI: true,     // P9
  EPOCH_VAULT: true,               // P10
  AI_EXECUTIVE_SUITE: true,        // P11
  IP_NAVIGATOR: true,              // P12
  IP_GUARDIAN: true,               // P13
  COMPLIANCE_IQ: true,             // P14
  ONBOARDING_ENGINE: true,         // P15

  // Export Features
  DIAGRAM_EXPORT: true,
  PATENT_DOCUMENT_GENERATION: true,
  TRADEMARK_FILING_PACK: true,
  PCT_MADRID_EXPORT: true,

  // Analytics & Monitoring
  ANALYTICS_EVENTS: true,
  IP_WATCH_MONITORING: true,
  COMPLIANCE_TRACKING: true,

  // Development
  MOCK_EXTERNAL_APIS: true,
  DEMO_DATA_SEEDING: true,
  TEST_MODE: process.env.NODE_ENV === 'test'
} as const;

// Master switch for all IP modules
export const ENABLE_IP_SYSTEM = true;

// Export validation
export const validateFeatureAccess = (feature: keyof typeof IP_FEATURE_FLAGS): boolean => {
  return ENABLE_IP_SYSTEM && IP_FEATURE_FLAGS[feature];
};

export const getEnabledModules = () => {
  return Object.entries(IP_FEATURE_FLAGS)
    .filter(([_, enabled]) => enabled)
    .map(([feature, _]) => feature);
};