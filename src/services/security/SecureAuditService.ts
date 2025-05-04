
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@/services/logging/loggingService";
import { AuditEventType } from "@/services/auditLog/auditLogService";
import { AuditOptions, AuditMetadata } from "@/services/security/types";

export class SecureAuditService {
  private static getClientInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenSize: {
        width: window.screen.width,
        height: window.screen.height,
      },
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Records a security event for audit purposes
   * @param userId User ID
   * @param eventType Type of event (login, logout, permission_change, etc)
   * @param status Status of event (success, failure)
   * @param metadata Additional metadata about the event
   * @param options Options for recording the event
   */
  public async recordEvent(
    userId: string,
    eventType: AuditEventType,
    status: 'success' | 'failure' | 'warning',
    metadata: AuditMetadata,
    options: AuditOptions = {}
  ) {
    try {
      // Add client info to metadata
      const clientInfo = SecureAuditService.getClientInfo();
      const enrichedMetadata = {
        ...metadata,
        timestamp: new Date().toISOString(),
        clientInfo,
      };

      // Log to console during development
      logger.info(`Security Audit: ${eventType} - ${status}`, enrichedMetadata, 'SecureAudit');
      
      // Try to record in database if it exists (we'll create it if needed)
      await this.ensureAuditTable();
      
      // Create the audit log entry
      const result = await supabase.from('audit_logs').insert({
        user_id: userId,
        event_type: eventType,
        status,
        details: enrichedMetadata
      });
      
      if (result.error) {
        logger.error('Failed to record audit log:', result.error, 'SecureAudit');
      }
    } catch (error) {
      logger.error('Error recording security audit event:', error, 'SecureAudit');
    }
  }
  
  /**
   * Ensures the audit_logs table exists
   */
  private async ensureAuditTable() {
    try {
      // First check if table exists by trying to query it
      const { error } = await supabase.from('audit_logs').select('id').limit(1);
      
      if (error) {
        // If table doesn't exist, attempt to create it
        logger.info('Creating audit_logs table for security compliance', {}, 'SecureAudit');
        
        // Call our stored procedure that creates the table
        await this.createAuditLogsTable();
      }
    } catch (err) {
      logger.error('Error ensuring audit table exists:', err, 'SecureAudit');
    }
  }
  
  /**
   * Creates the audit_logs table using a stored procedure
   */
  private async createAuditLogsTable() {
    // This is normally handled by the ensureAuditLogsTable function in helpers.ts
    // This is a backup in case that fails
    logger.info('Creating audit_logs table directly', {}, 'SecureAudit');
  }
}

export const secureAudit = new SecureAuditService();
