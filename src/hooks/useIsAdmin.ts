import { useUser } from '@/context/UserContext';

/**
 * Hook to check if the current user has admin privileges
 * Uses JWT app_metadata.role from Supabase auth for secure role checking
 */
export function useIsAdmin(): boolean {
  const { supabaseUser } = useUser();
  const role = supabaseUser?.app_metadata?.role;
  return role === 'admin' || role === 'superadmin';
}

/**
 * Hook to get the user's role from JWT app_metadata
 */
export function useUserRole(): string | null {
  const { supabaseUser } = useUser();
  return supabaseUser?.app_metadata?.role || null;
}

/**
 * Hook to get the user's firm ID from JWT app_metadata
 */
export function useUserFirmId(): string | null {
  const { supabaseUser } = useUser();
  return supabaseUser?.app_metadata?.firm_id || null;
}