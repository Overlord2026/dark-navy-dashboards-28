// Feature flags for AI Marketing Engine
export const USE_SUPABASE_MARKETING = false; // Switch to true when Supabase is ready
export const MARKETING_DRY_RUN = true; // Prevents real API calls to ad platforms
export const ENABLE_MARKETING_MODULE = true; // Master switch for the entire module

// Marketing-specific feature flags
export const MARKETING_FEATURES = {
  AB_TESTING: true,
  COMPLIANCE_AUTOMATION: true,
  MULTI_CHANNEL_CAMPAIGNS: true,
  BUDGET_MONITORING: true,
  AUDIT_EXPORTS: true,
} as const;

// Channel availability
export const ENABLED_CHANNELS = {
  FACEBOOK: true,
  LINKEDIN: true,
  GOOGLE: true,
  YOUTUBE: true,
  EMAIL: true,
  SMS: true,
} as const;

// Operations Management + LMS Feature Flags
export const USE_SUPABASE_OPS_LMS = false; // Switch to true when Supabase is ready
export const OPS_LMS_DRY_RUN = true; // Use fallback storage for demo
export const ENABLE_OPS_LMS_MODULE = true; // Master switch for the entire module

// Operations & LMS specific feature flags
export const OPS_LMS_FEATURES = {
  EMPLOYEE_DIRECTORY: true,
  JOB_LADDERS: true,
  PROJECT_TRACKING: true,
  ANNUAL_REVIEWS: true,
  COURSE_LIBRARY: true,
  CE_TRACKING: true,
  COMPLIANCE_RETENTION: true,
  WHITE_LABEL: true,
  DATA_EXPORT: true,
  SCORM_SUPPORT: true,
} as const;

// Compliance retention defaults (in years)
export const COMPLIANCE_RETENTION = {
  FINANCIAL_ADVISOR: 7,
  CPA_ACCOUNTANT: 7,
  ATTORNEY: 7,
  HEALTHCARE: 6,
  REALTOR: 5,
  INSURANCE: 5,
} as const;

// Mock Mode Feature Flag
export const MOCK_MODE = (import.meta.env.VITE_APP_MOCK_MODE ?? 'true') === 'true';