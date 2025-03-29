
import { v4 as uuidv4 } from "uuid";
import { logger } from "../logging/loggingService";

export type AuditAction = 
  | 'login' 
  | 'logout' 
  | 'file_upload' 
  | 'file_download' 
  | 'file_delete' 
  | 'document_access' 
  | 'settings_change' 
  | 'profile_update' 
  | 'permission_change'
  | 'account_creation'
  | 'password_reset'
  | 'mfa_enabled'
  | 'mfa_disabled'
  | 'api_access';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName?: string;
  userRole?: string;
  action: AuditAction;
  resourceId?: string;
  resourceType?: string;
  details?: any;
  ipAddress?: string;
  status: 'success' | 'failure';
  reason?: string;
}

class AuditLogService {
  private logs: AuditLogEntry[] = [];
  private storageKey = "system_audit_logs";
  private maxEntries = 1000; // Default retention limit
  private retentionPeriod = 30; // in days
  
  constructor() {
    this.loadLogsFromStorage();
    this.setupPeriodicCleanup();
  }
  
  /**
   * Log an action in the audit trail
   */
  public log(
    userId: string, 
    action: AuditAction, 
    status: 'success' | 'failure' = 'success',
    options?: {
      userName?: string;
      userRole?: string;
      resourceId?: string;
      resourceType?: string;
      details?: any;
      ipAddress?: string;
      reason?: string;
    }
  ): AuditLogEntry {
    try {
      const entry: AuditLogEntry = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        userId,
        action,
        status,
        ...options
      };
      
      this.logs.unshift(entry); // Add to beginning for chronological order
      
      if (this.logs.length > this.maxEntries) {
        this.logs = this.logs.slice(0, this.maxEntries);
      }
      
      this.saveLogsToStorage();
      
      // Also log to system logs for critical actions or failures
      if (status === 'failure' || this.isCriticalAction(action)) {
        const level = status === 'failure' ? 'warning' : 'info';
        logger.log(
          level,
          `Audit: ${action} by user ${userId} - ${status}`,
          options?.details,
          'AuditLogService'
        );
      }
      
      return entry;
    } catch (error) {
      logger.error("Failed to log audit event", error, "AuditLogService");
      throw error;
    }
  }
  
  /**
   * Get audit logs with optional filtering
   */
  public getLogs(options?: {
    userId?: string;
    action?: AuditAction;
    resourceType?: string;
    status?: 'success' | 'failure';
    startDate?: Date;
    endDate?: Date;
    limit?: number;
  }): AuditLogEntry[] {
    let filtered = [...this.logs];
    
    if (options?.userId) {
      filtered = filtered.filter(log => log.userId === options.userId);
    }
    
    if (options?.action) {
      filtered = filtered.filter(log => log.action === options.action);
    }
    
    if (options?.resourceType) {
      filtered = filtered.filter(log => log.resourceType === options.resourceType);
    }
    
    if (options?.status) {
      filtered = filtered.filter(log => log.status === options.status);
    }
    
    if (options?.startDate) {
      const startTime = options.startDate.getTime();
      filtered = filtered.filter(log => new Date(log.timestamp).getTime() >= startTime);
    }
    
    if (options?.endDate) {
      const endTime = options.endDate.getTime();
      filtered = filtered.filter(log => new Date(log.timestamp).getTime() <= endTime);
    }
    
    if (options?.limit && options.limit > 0) {
      filtered = filtered.slice(0, options.limit);
    }
    
    return filtered;
  }
  
  /**
   * Clear audit logs based on age or completely
   */
  public clearLogs(olderThan?: Date): void {
    if (olderThan) {
      const threshold = olderThan.getTime();
      this.logs = this.logs.filter(log => new Date(log.timestamp).getTime() >= threshold);
    } else {
      this.logs = [];
    }
    this.saveLogsToStorage();
  }
  
  /**
   * Configure the audit log service
   */
  public configure(config: {
    maxEntries?: number;
    retentionPeriod?: number;
  }): void {
    if (config.maxEntries && config.maxEntries > 0) {
      this.maxEntries = config.maxEntries;
      
      // Trim logs if they exceed new maxEntries
      if (this.logs.length > this.maxEntries) {
        this.logs = this.logs.slice(0, this.maxEntries);
        this.saveLogsToStorage();
      }
    }
    
    if (config.retentionPeriod && config.retentionPeriod > 0) {
      this.retentionPeriod = config.retentionPeriod;
    }
  }
  
  /**
   * Export audit logs in JSON format
   */
  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
  
  /**
   * Determine if an action is considered critical for logging purposes
   */
  private isCriticalAction(action: AuditAction): boolean {
    const criticalActions: AuditAction[] = [
      'permission_change',
      'account_creation',
      'password_reset',
      'mfa_enabled',
      'mfa_disabled'
    ];
    
    return criticalActions.includes(action);
  }
  
  /**
   * Save logs to localStorage
   */
  private saveLogsToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.logs));
    } catch (e) {
      logger.error("Failed to save audit logs to storage", e, "AuditLogService");
    }
  }
  
  /**
   * Load logs from localStorage
   */
  private loadLogsFromStorage(): void {
    try {
      const storedLogs = localStorage.getItem(this.storageKey);
      if (storedLogs) {
        this.logs = JSON.parse(storedLogs);
      }
    } catch (e) {
      logger.error("Failed to load audit logs from storage", e, "AuditLogService");
      this.logs = [];
    }
  }
  
  /**
   * Setup periodic cleanup of old logs
   */
  private setupPeriodicCleanup(): void {
    // Check and clean logs once a day
    setInterval(() => {
      const retentionDate = new Date();
      retentionDate.setDate(retentionDate.getDate() - this.retentionPeriod);
      this.clearLogs(retentionDate);
    }, 24 * 60 * 60 * 1000); // 24 hours
  }
}

// Create a singleton instance
export const auditLog = new AuditLogService();
