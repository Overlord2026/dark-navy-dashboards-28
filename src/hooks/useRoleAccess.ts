import { useAuth } from '@/context/AuthContext';
import { UserProfile } from '@/types/user';

export type RoleLevel = 
  | 'client' 
  | 'advisor' 
  | 'accountant' 
  | 'consultant' 
  | 'attorney' 
  | 'coach'
  | 'tenant_admin' 
  | 'admin' 
  | 'system_administrator';

export const ROLE_HIERARCHY: Record<RoleLevel, number> = {
  client: 1,
  advisor: 2,
  accountant: 2,
  consultant: 2,
  attorney: 2,
  coach: 2,
  tenant_admin: 3,
  admin: 4,
  system_administrator: 5,
};

export const ROLE_GROUPS = {
  PROFESSIONAL_ACCESS: ['advisor', 'accountant', 'consultant', 'attorney', 'coach', 'tenant_admin', 'admin', 'system_administrator'],
  ADMIN_ACCESS: ['tenant_admin', 'admin', 'system_administrator'],
  SUPER_ADMIN_ACCESS: ['system_administrator'],
  TENANT_ADMIN_ACCESS: ['tenant_admin', 'admin', 'system_administrator'],
} as const;

/**
 * Secure role-based access control hook
 */
export const useRoleAccess = () => {
  const { userProfile, session } = useAuth();

  /**
   * Check if user has specific role
   */
  const hasRole = (role: RoleLevel): boolean => {
    if (!userProfile?.role) return false;
    return userProfile.role === role;
  };

  /**
   * Check if user has role with minimum access level
   */
  const hasMinimumRole = (minimumRole: RoleLevel): boolean => {
    if (!userProfile?.role) return false;
    
    const userRoleLevel = ROLE_HIERARCHY[userProfile.role as RoleLevel];
    const requiredLevel = ROLE_HIERARCHY[minimumRole];
    
    return userRoleLevel >= requiredLevel;
  };

  /**
   * Check if user has any role from a group
   */
  const hasAnyRole = (roles: RoleLevel[]): boolean => {
    if (!userProfile?.role) return false;
    return roles.includes(userProfile.role as RoleLevel);
  };

  /**
   * Check if user has role from predefined groups
   */
  const hasRoleAccess = (roleGroup: keyof typeof ROLE_GROUPS): boolean => {
    return hasAnyRole(ROLE_GROUPS[roleGroup] as RoleLevel[]);
  };

  /**
   * Check if user is super admin using secure JWT app_metadata
   */
  const isSuperAdmin = (): boolean => {
    // Primary check: database role
    if (userProfile?.role === 'system_administrator') return true;
    
    // Secondary check: JWT app_metadata (if set by Supabase Auth)
    const appMetadata = session?.user?.app_metadata;
    const appRole = appMetadata?.role as string;
    if (appRole === 'system_administrator' || appRole === 'super_admin') return true;
    
    return false;
  };

  /**
   * Check if user is tenant admin
   */
  const isTenantAdmin = (): boolean => {
    return hasRoleAccess('TENANT_ADMIN_ACCESS');
  };

  /**
   * Check if user has admin privileges (tenant or super)
   */
  const isAdmin = (): boolean => {
    return hasRoleAccess('ADMIN_ACCESS');
  };

  /**
   * Check if user has professional access
   */
  const isProfessional = (): boolean => {
    return hasRoleAccess('PROFESSIONAL_ACCESS');
  };

  /**
   * Get user's role safely
   */
  const getUserRole = (): RoleLevel | null => {
    return (userProfile?.role as RoleLevel) || null;
  };

  /**
   * Get role display name
   */
  const getRoleDisplayName = (role?: RoleLevel): string => {
    if (!role) return 'Unknown';
    
    const displayNames: Record<RoleLevel, string> = {
      client: 'Client',
      advisor: 'Financial Advisor',
      accountant: 'Accountant',
      consultant: 'Consultant',
      attorney: 'Attorney',
      coach: 'Coach',
      tenant_admin: 'Tenant Administrator',
      admin: 'Administrator',
      system_administrator: 'System Administrator',
    };
    
    return displayNames[role] || role;
  };

  return {
    // Role checking functions
    hasRole,
    hasMinimumRole,
    hasAnyRole,
    hasRoleAccess,
    
    // Convenience functions
    isSuperAdmin,
    isTenantAdmin,
    isAdmin,
    isProfessional,
    
    // Utility functions
    getUserRole,
    getRoleDisplayName,
    
    // Data
    userRole: getUserRole(),
    userProfile,
    session,
  };
};

/**
 * Utility function to check role access outside of React components
 */
export const hasRoleAccess = (userRole: string | null | undefined, allowedRoles: string[]): boolean => {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};