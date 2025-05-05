
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/logging/loggingService";

/**
 * Check if the audit_logs table exists and verify access permissions
 */
export async function ensureAuditLogsTable(): Promise<void> {
  try {
    // Try to query the table to confirm it exists and is accessible
    const { data, error } = await supabase
      .from('audit_logs')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.code === '42501') { // PostgreSQL permission denied code
        logger.error('Permission denied accessing audit_logs table. Check RLS policies.', error, 'SecurityHelpers');
      } else if (error.code === '42P01') { // PostgreSQL "relation does not exist" code
        logger.error('The audit_logs table does not exist or is not accessible', error, 'SecurityHelpers');
      } else {
        logger.error('Error accessing audit_logs table:', error, 'SecurityHelpers');
      }
    } else {
      logger.info('Audit logs table is accessible', { rowsReturned: data?.length || 0 }, 'SecurityHelpers');
    }
  } catch (error) {
    logger.error('Unexpected error checking audit_logs table:', error, 'SecurityHelpers');
    // Don't throw here to prevent application startup failure
  }
}
