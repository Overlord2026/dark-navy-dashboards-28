
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/logging/loggingService";

/**
 * Check if the audit_logs table exists and create it if needed
 * This is a temporary solution until proper migrations are implemented
 */
export async function ensureAuditLogsTable(): Promise<void> {
  try {
    // Try to query the table to see if it exists
    const { error } = await supabase
      .from('audit_logs')
      .select('id')
      .limit(1);
    
    // If we get a specific error about the table not existing, create it
    if (error && error.code === '42P01') { // 42P01 is the PostgreSQL error code for "relation does not exist"
      logger.info('Creating audit_logs table for security compliance', {}, 'SecurityHelpers');
      
      // Create the table using raw SQL
      const { error: createError } = await supabase.rpc('create_audit_logs_table');
      
      if (createError) {
        logger.error('Failed to create audit_logs table:', createError, 'SecurityHelpers');
        throw createError;
      }
      
      logger.info('Successfully created audit_logs table', {}, 'SecurityHelpers');
    } else if (error) {
      logger.error('Error checking for audit_logs table:', error, 'SecurityHelpers');
      // Don't throw here to prevent application startup failure
    }
  } catch (error) {
    logger.error('Unexpected error ensuring audit_logs table:', error, 'SecurityHelpers');
    // Don't throw here to prevent application startup failure
  }
}
