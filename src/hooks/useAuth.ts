// Re-export the main auth hook from AuthContext for backward compatibility
export { useAuth, AuthProvider } from '@/context/AuthContext';

// Export role access functionality
export { useRoleAccess, hasRoleAccess, ROLE_GROUPS, ROLE_HIERARCHY } from './useRoleAccess';