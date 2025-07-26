// Role hierarchy system for the Family Office Marketplace
export type UserRole = 
  | 'system_administrator'
  | 'admin'
  | 'tenant_admin'
  | 'advisor'
  | 'client'
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
  consultant: 50,
  accountant: 40,
  attorney: 30,
  client: 10,
};

// Define role groups for feature access
export const ROLE_GROUPS = {
  ADVISOR_ACCESS: ['system_administrator', 'admin', 'tenant_admin', 'advisor'] as UserRole[],
  ADMIN_ACCESS: ['system_administrator', 'admin', 'tenant_admin'] as UserRole[],
  CLIENT_ACCESS: ['system_administrator', 'admin', 'tenant_admin', 'advisor', 'client'] as UserRole[],
  PROFESSIONAL_ACCESS: ['system_administrator', 'admin', 'tenant_admin', 'advisor', 'consultant', 'accountant', 'attorney'] as UserRole[],
};

/**
 * Check if a user role has access to a specific feature group
 */
export function hasRoleAccess(userRole: string | undefined, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false;
  
  return allowedRoles.includes(userRole as UserRole);
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
    client: 'Client',
    consultant: 'Consultant',
    accountant: 'Accountant',
    attorney: 'Attorney',
    developer: 'Developer',
  };
  
  return roleMap[role] || role;
}