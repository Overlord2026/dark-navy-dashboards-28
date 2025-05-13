
import { useUser } from '@/context/UserContext';

// Define permission levels for different roles
const rolePermissions = {
  'client': ['view_dashboard', 'view_profile', 'edit_profile', 'view_investments'],
  'advisor': ['view_dashboard', 'view_profile', 'edit_profile', 'view_investments', 'view_clients', 'manage_clients'],
  'admin': ['view_dashboard', 'view_profile', 'edit_profile', 'view_investments', 'view_clients', 'manage_clients', 'manage_system', 'manage_users'],
  'system_administrator': ['view_dashboard', 'view_profile', 'edit_profile', 'view_investments', 'view_clients', 'manage_clients', 'manage_system', 'manage_users', 'system_config'],
  'developer': ['view_dashboard', 'view_profile', 'edit_profile', 'view_investments', 'view_clients', 'manage_clients', 'manage_system', 'manage_users', 'system_config', 'developer_tools'],
  'consultant': ['view_dashboard', 'view_profile', 'edit_profile', 'view_investments', 'view_clients'],
  'accountant': ['view_dashboard', 'view_profile', 'edit_profile', 'view_investments', 'view_clients', 'view_financial_data'],
  'attorney': ['view_dashboard', 'view_profile', 'edit_profile', 'view_investments', 'view_clients', 'view_legal_docs']
};

export function usePermissions() {
  const { userProfile } = useUser();
  
  const hasPermission = (permission: string): boolean => {
    if (!userProfile) return false;
    
    // Get permissions based on user's role
    const role = userProfile.role || 'client';
    const permissions = rolePermissions[role] || [];
    
    // Add any custom permissions from user profile
    const allPermissions = [...permissions, ...(userProfile.permissions || [])];
    
    return allPermissions.includes(permission);
  };
  
  const hasRole = (role: string): boolean => {
    if (!userProfile) return false;
    return userProfile.role === role;
  };
  
  return {
    hasPermission,
    hasRole,
    userRole: userProfile?.role || 'client'
  };
}
