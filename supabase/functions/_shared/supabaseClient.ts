/**
 * Shared Supabase client instances for Edge Functions
 * 
 * Provides pre-configured admin and anon Supabase clients.
 * All secrets are managed via environment variables only.
 * 
 * SECURITY NOTE: No secrets are stored in PostgreSQL tables.
 * All sensitive data is accessed via Edge Function environment variables.
 */

import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { secrets } from './secrets.ts'

export interface SupabaseClients {
  admin: SupabaseClient;
  anon: SupabaseClient;
}

class SupabaseClientManager {
  private adminClient: SupabaseClient | null = null;
  private anonClient: SupabaseClient | null = null;
  private initialized = false;

  /**
   * Initialize Supabase clients with environment variables
   * Validates secrets and creates client instances
   */
  private initialize(): void {
    if (this.initialized) return;

    // Validate secrets first
    secrets.validate();

    const supabaseUrl = secrets.get('SUPABASE_URL');
    const serviceRoleKey = secrets.get('SUPABASE_SERVICE_ROLE_KEY');

    // Create admin client (service role - bypasses RLS)
    this.adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Create anon client (respects RLS policies)
    this.anonClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    this.initialized = true;
    console.log('✅ Supabase clients initialized');
  }

  /**
   * Get admin client (service role - bypasses RLS)
   * Use for: system operations, cross-tenant queries, admin functions
   */
  getAdmin(): SupabaseClient {
    if (!this.initialized) {
      this.initialize();
    }
    return this.adminClient!;
  }

  /**
   * Get anon client (respects RLS policies)
   * Use for: user-facing operations, tenant-isolated queries
   */
  getAnon(): SupabaseClient {
    if (!this.initialized) {
      this.initialize();
    }
    return this.anonClient!;
  }

  /**
   * Get both clients as an object
   */
  getClients(): SupabaseClients {
    return {
      admin: this.getAdmin(),
      anon: this.getAnon()
    };
  }

  /**
   * Create a user-specific client with their JWT token
   * Use for: operations that need user context and auth
   */
  createUserClient(userToken: string): SupabaseClient {
    if (!this.initialized) {
      this.initialize();
    }

    const supabaseUrl = secrets.get('SUPABASE_URL');
    const serviceRoleKey = secrets.get('SUPABASE_SERVICE_ROLE_KEY');

    return createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }
    });
  }

  /**
   * Health check for Supabase connection
   */
  async healthCheck(): Promise<{ status: 'ok' | 'error', message: string }> {
    try {
      const client = this.getAdmin();
      const { error } = await client.from('profiles').select('id').limit(1);
      
      if (error) {
        return { status: 'error', message: `Database error: ${error.message}` };
      }
      
      return { status: 'ok', message: 'Supabase connection healthy' };
    } catch (error) {
      return { status: 'error', message: `Connection failed: ${error.message}` };
    }
  }
}

// Export singleton instance
const clientManager = new SupabaseClientManager();

/**
 * Get admin Supabase client (bypasses RLS)
 * Use for system operations, admin functions
 */
export const getAdminClient = () => clientManager.getAdmin();

/**
 * Get anon Supabase client (respects RLS) 
 * Use for user-facing operations
 */
export const getAnonClient = () => clientManager.getAnon();

/**
 * Get both admin and anon clients
 */
export const getSupabaseClients = () => clientManager.getClients();

/**
 * Create user-specific client with JWT token
 */
export const createUserClient = (userToken: string) => clientManager.createUserClient(userToken);

/**
 * Check Supabase connection health
 */
export const healthCheck = () => clientManager.healthCheck();

// Export types
export type { SupabaseClient, SupabaseClients };