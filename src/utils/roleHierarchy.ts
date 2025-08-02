// Role hierarchy system for the Family Office Marketplace
export type UserRole = 
  | 'system_administrator'
  | 'admin'
  | 'tenant_admin'
  | 'advisor'
  | 'coach'
  | 'client'
  | 'client_premium'
  | 'consultant'
  | 'accountant'
  | 'attorney'
  | 'developer'
  // New wealth segment professional roles
  | 'private_banker'
  | 'estate_planner'
  | 'business_succession_advisor'
  | 'insurance_specialist'
  | 'property_manager'
  | 'philanthropy_consultant'
  | 'healthcare_advocate'
  | 'luxury_concierge'
  | 'family_law_advisor'
  | 'platform_aggregator'
  | 'retirement_advisor'
  | 'private_lender'
  | 'investment_club_lead'
  | 'vc_pe_professional'
  | 'tax_resolution_specialist'
  | 'hr_benefit_consultant';

// Define role hierarchy levels (higher number = more permissions)
const ROLE_LEVELS: Record<UserRole, number> = {
  system_administrator: 100,
  admin: 90,
  tenant_admin: 80,
  developer: 70,
  advisor: 60,
  coach: 55,
  // Wealth segment professionals (tiered by complexity/access needs)
  private_banker: 55,
  platform_aggregator: 55,
  vc_pe_professional: 52,
  estate_planner: 50,
  consultant: 50,
  business_succession_advisor: 48,
  family_law_advisor: 45,
  insurance_specialist: 42,
  accountant: 40,
  tax_resolution_specialist: 40,
  retirement_advisor: 38,
  private_lender: 35,
  philanthropy_consultant: 35,
  property_manager: 32,
  attorney: 30,
  hr_benefit_consultant: 28,
  healthcare_advocate: 25,
  investment_club_lead: 22,
  luxury_concierge: 20,
  client_premium: 15,
  client: 10,
};

// Define role groups for feature access
export const ROLE_GROUPS = {
  ADVISOR_ACCESS: ['system_administrator', 'admin', 'tenant_admin', 'advisor'] as UserRole[],
  COACH_ACCESS: ['system_administrator', 'admin', 'tenant_admin', 'coach'] as UserRole[],
  ADMIN_ACCESS: ['system_administrator', 'admin', 'tenant_admin'] as UserRole[],
  CLIENT_ACCESS: ['system_administrator', 'admin', 'tenant_admin', 'advisor', 'client', 'client_premium'] as UserRole[],
  PROFESSIONAL_ACCESS: [
    'system_administrator', 'admin', 'tenant_admin', 'advisor', 'coach', 'consultant', 'accountant', 'attorney',
    'private_banker', 'estate_planner', 'business_succession_advisor', 'insurance_specialist', 'property_manager',
    'philanthropy_consultant', 'healthcare_advocate', 'luxury_concierge', 'family_law_advisor', 'platform_aggregator',
    'retirement_advisor', 'private_lender', 'investment_club_lead', 'vc_pe_professional', 'tax_resolution_specialist',
    'hr_benefit_consultant'
  ] as UserRole[],
  // Specialized access groups
  WEALTH_ADVISORS: ['advisor', 'private_banker', 'estate_planner', 'business_succession_advisor'] as UserRole[],
  LEGAL_PROFESSIONALS: ['attorney', 'estate_planner', 'family_law_advisor', 'tax_resolution_specialist'] as UserRole[],
  INVESTMENT_PROFESSIONALS: ['advisor', 'private_banker', 'vc_pe_professional', 'investment_club_lead', 'platform_aggregator'] as UserRole[],
  REFERRAL_NETWORK: [
    'advisor', 'private_banker', 'estate_planner', 'business_succession_advisor', 'insurance_specialist',
    'property_manager', 'philanthropy_consultant', 'family_law_advisor', 'retirement_advisor', 'private_lender'
  ] as UserRole[],
  MARKETPLACE_VENDORS: [
    'luxury_concierge', 'healthcare_advocate', 'hr_benefit_consultant', 'property_manager'
  ] as UserRole[],
};

/**
 * Check if a user role has access to a specific feature group
 */
export function hasRoleAccess(userRole: string | undefined, allowedRoles: (UserRole | string)[]): boolean {
  if (!userRole) return false;
  
  return allowedRoles.includes(userRole);
}

/**
 * Check if a user role has at least the minimum required level
 */
export function hasMinimumRoleLevel(userRole: string | undefined, minimumRole: UserRole): boolean {
  if (!userRole) return false;
  
  const userLevel = ROLE_LEVELS[userRole as UserRole];
  const minimumLevel = ROLE_LEVELS[minimumRole];
  
  return userLevel !== undefined && minimumLevel !== undefined && userLevel >= minimumLevel;
}

/**
 * Get all roles that have access to advisor features
 */
export function getAdvisorAccessRoles(): UserRole[] {
  return ROLE_GROUPS.ADVISOR_ACCESS;
}

/**
 * Get user-friendly role display name
 */
export function getRoleDisplayName(role: string): string {
  const roleMap: Record<string, string> = {
    system_administrator: 'System Administrator',
    admin: 'Administrator',
    tenant_admin: 'Tenant Administrator',
    advisor: 'Financial Advisor',
    coach: 'Practice Coach',
    client: 'Client',
    client_premium: 'Client Premium',
    consultant: 'Consultant',
    accountant: 'Accountant',
    attorney: 'Attorney',
    developer: 'Developer',
    // Wealth segment professionals
    private_banker: 'Private Banker / Trust Officer',
    estate_planner: 'Estate Planning Consultant',
    business_succession_advisor: 'Business Succession Advisor',
    insurance_specialist: 'Insurance & Advanced Planning Specialist',
    property_manager: 'Property Manager / Real Estate Specialist',
    philanthropy_consultant: 'Philanthropy Consultant',
    healthcare_advocate: 'Healthcare Advocate',
    luxury_concierge: 'Luxury Concierge / Travel Specialist',
    family_law_advisor: 'Divorce / Family Law Advisor',
    platform_aggregator: 'Platform Aggregator / MFO',
    retirement_advisor: 'Retirement Plan Advisor',
    private_lender: 'Private Lender / Credit Specialist',
    investment_club_lead: 'Family Investment Club Lead',
    vc_pe_professional: 'VC / Private Equity Professional',
    tax_resolution_specialist: 'Tax Resolution Specialist',
    hr_benefit_consultant: 'HR / Benefit Consultant',
  };
  
  return roleMap[role] || role;
}

export const getRoleHierarchy = (): string[] => [
  'client',
  'advisor', 
  'accountant',
  'consultant',
  'attorney',
  'admin',
  'tenant_admin',
  'system_administrator',
  'superadmin'
];

/**
 * Get current user's role (placeholder for missing function)
 */
export function getCurrentUserRole(): string | null {
  // This would typically be implemented in the context
  return null;
}
