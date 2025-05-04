
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/logging/loggingService";

/**
 * Check if the audit_logs table exists and create it if needed
 * This is a temporary solution until proper migrations are implemented
 */
export async function ensureAuditLogsTable(): Promise<void> {
  try {
    // We'll check if the table exists using our existing RPC function
    const { error } = await supabase.rpc('check_table_exists', {
      table_name: 'audit_logs'
    });
    
    if (error) {
      logger.info('Creating audit_logs table for security compliance', {}, 'SecurityHelpers');
      
      // Create the table using direct SQL since the audit_logs table doesn't exist yet
      // This would normally be done via a migration
      const { error: createError } = await supabase.rpc('create_audit_logs_function');
      
      if (createError) {
        logger.error('Failed to create audit_logs table:', createError, 'SecurityHelpers');
        throw createError;
      }
      
      logger.info('Successfully created audit_logs table', {}, 'SecurityHelpers');
    }
  } catch (error) {
    logger.error('Unexpected error ensuring audit_logs table:', error, 'SecurityHelpers');
    // Don't throw here to prevent application startup failure
  }
}
