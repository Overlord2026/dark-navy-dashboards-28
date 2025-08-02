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
  | 'developer';

// Define role hierarchy levels (higher number = more permissions)
const ROLE_LEVELS: Record<UserRole, number> = {
  system_administrator: 100,
  admin: 90,
  tenant_admin: 80,
  developer: 70,
  advisor: 60,
  coach: 55,
  consultant: 50,
  accountant: 40,
  attorney: 30,
  client_premium: 15,
  client: 10,
};

// Define role groups for feature access
export const ROLE_GROUPS = {
  ADVISOR_ACCESS: ['system_administrator', 'admin', 'tenant_admin', 'advisor'] as UserRole[],
  COACH_ACCESS: ['system_administrator', 'admin', 'tenant_admin', 'coach'] as UserRole[],
  ADMIN_ACCESS: ['system_administrator', 'admin', 'tenant_admin'] as UserRole[],
  CLIENT_ACCESS: ['system_administrator', 'admin', 'tenant_admin', 'advisor', 'client', 'client_premium'] as UserRole[],
  PROFESSIONAL_ACCESS: ['system_administrator', 'admin', 'tenant_admin', 'advisor', 'coach', 'consultant', 'accountant', 'attorney'] as UserRole[],
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
