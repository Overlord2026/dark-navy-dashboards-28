import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * Secure admin role validation using JWT app_metadata
 * This replaces email-based admin checks for better security
 */
export function hasAdminRole(session?: Session | null): boolean {
  if (!session?.user) return false;
  
  const role = (session.user.app_metadata as any)?.role;
  return role === 'admin' || role === 'system_administrator' || role === 'tenant_admin';
}

/**
 * Check if user has super admin role (system_administrator)
 */
export function hasSuperAdminRole(session?: Session | null): boolean {
  if (!session?.user) return false;
  
  const role = (session.user.app_metadata as any)?.role;
  return role === 'system_administrator';
}

/**
 * Check if user has tenant admin role
 */
export function hasTenantAdminRole(session?: Session | null): boolean {
  if (!session?.user) return false;
  
  const role = (session.user.app_metadata as any)?.role;
  return role === 'tenant_admin';
}

/**
 * Optional: Allow-list based admin check (fallback/additional security)
 * Use this if app_metadata.role is not available or needs additional validation
 */
export async function isAllowListedAdmin(userId?: string): Promise<boolean> {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', userId)
      .limit(1);
    
    if (error) {
      console.warn('Failed to check admin allowlist:', error);
      return false;
    }
    
    return !!data?.length;
  } catch (error) {
    console.warn('Admin allowlist check failed:', error);
    return false;
  }
}

/**
 * Comprehensive admin check (JWT + optional allowlist)
 */
export async function isSecureAdmin(session?: Session | null): Promise<boolean> {
  // Primary check: JWT app_metadata role
  if (hasAdminRole(session)) {
    return true;
  }
  
  // Fallback: allowlist check (if admin_users table exists)
  if (session?.user?.id) {
    return await isAllowListedAdmin(session.user.id);
  }
  
  return false;
}