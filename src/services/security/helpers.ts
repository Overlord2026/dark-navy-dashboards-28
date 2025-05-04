
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/services/logging/loggingService";

/**
 * Check if the audit_logs table exists
 * This is now just a validation check rather than creation
 */
export async function ensureAuditLogsTable(): Promise<void> {
  try {
    // Try to query the table to confirm it exists
    const { error } = await supabase
      .from('audit_logs')
      .select('id')
      .limit(1);
    
    if (error) {
      logger.error('Error accessing audit_logs table:', error, 'SecurityHelpers');
    } else {
      logger.info('Audit logs table is accessible', {}, 'SecurityHelpers');
    }
  } catch (error) {
    logger.error('Unexpected error checking audit_logs table:', error, 'SecurityHelpers');
    // Don't throw here to prevent application startup failure
  }
}
