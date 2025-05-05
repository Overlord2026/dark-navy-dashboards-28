
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@/services/logging/loggingService";
import { AuditEventType } from "@/services/auditLog/auditLogService";
import { AuditOptions, AuditMetadata, ClientInfo } from "@/services/security/types";
import { InsertAuditLog } from "@/types/auditLog";

export class SecureAuditService {
  private static getClientInfo(): ClientInfo {
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
   * @param userId User ID (can be string or UUID)
   * @param eventType Type of event (login, logout, permission_change, etc)
   * @param status Status of event (success, failure)
   * @param metadata Additional metadata about the event
   * @param options Options for recording the event
   */
  public async recordEvent(
    userId: string,
    eventType: AuditEventType,
    status: 'success' | 'failure' | 'warning',
    metadata: AuditMetadata = {},
    options: AuditOptions = {}
  ): Promise<void> {
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
      
      // Prepare audit log entry for Supabase
      const auditLogEntry: InsertAuditLog = {
        user_id: userId,
        event_type: eventType,
        status,
        details: enrichedMetadata
      };
      
      // Create the audit log entry in Supabase
      const { error } = await supabase.from('audit_logs').insert(auditLogEntry);
      
      if (error) {
        logger.error('Failed to record audit log in Supabase:', error, 'SecureAudit');
        
        // If we have an RLS error, log additional information for debugging
        if (error.code === '42501') { // PostgreSQL permission denied code
          logger.error('This may be an RLS policy issue. Verify your user has permission to insert audit logs', 
            { userId, eventType }, 'SecureAudit');
        }
      }
    } catch (error) {
      logger.error('Error recording security audit event:', error, 'SecureAudit');
    }
  }
  
  /**
   * Fetches audit logs from Supabase with pagination and filtering
   */
  public async getAuditLogs({
    limit = 50,
    offset = 0,
    eventType,
    status,
    userId,
    fromDate,
    toDate,
  }: {
    limit?: number;
    offset?: number;
    eventType?: AuditEventType;
    status?: 'success' | 'failure' | 'warning';
    userId?: string;
    fromDate?: Date;
    toDate?: Date;
  } = {}) {
    try {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)
        .range(offset, offset + limit - 1);
      
      // Apply filters if provided
      if (eventType) {
        query = query.eq('event_type', eventType);
      }
      
      if (status) {
        query = query.eq('status', status);
      }
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      if (fromDate) {
        query = query.gte('created_at', fromDate.toISOString());
      }
      
      if (toDate) {
        query = query.lte('created_at', toDate.toISOString());
      }
      
      const { data, error } = await query;
      
      if (error) {
        logger.error('Failed to fetch audit logs:', error, 'SecureAudit');
        return { logs: [], error };
      }
      
      return { logs: data, error: null };
    } catch (error) {
      logger.error('Error fetching audit logs:', error, 'SecureAudit');
      return { logs: [], error };
    }
  }
}

export const secureAudit = new SecureAuditService();
