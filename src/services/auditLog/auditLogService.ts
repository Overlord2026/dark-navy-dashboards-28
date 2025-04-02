
import { v4 as uuidv4 } from 'uuid';
import { AuditEventType } from '@/services/diagnostics/types';

export interface AuditLogMetadata {
  userName?: string;
  userRole?: string;
  resourceType?: string;
  resourceId?: string;
  ipAddress?: string;
  reason?: string;
  details?: any;
}

export interface AuditLogEntry {
  id: string;
  timestamp: Date | string;
  userId: string;
  eventType: AuditEventType;
  action: string;
  result: 'success' | 'failure';
  metadata?: AuditLogMetadata;
  userName?: string;
  userRole?: string;
  resourceType?: string;
  resourceId?: string;
  ipAddress?: string;
  reason?: string;
  details?: any;
  status?: 'success' | 'failure';
}

interface LogQueryOptions {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  eventType?: AuditEventType;
  resourceType?: string;
  status?: 'success' | 'failure';
}

class AuditLogService {
  private logs: AuditLogEntry[] = [];

  constructor() {
    // Add some sample audit logs for testing
    this.initializeSampleLogs();
  }

  private initializeSampleLogs() {
    // Add sample logs for demonstration
    const sampleLogs: Partial<AuditLogEntry>[] = [
      {
        userId: 'admin-user',
        eventType: 'login',
        action: 'User login',
        result: 'success',
        metadata: {
          userName: 'Admin User',
          userRole: 'admin',
          ipAddress: '192.168.1.1',
          details: {
            browser: 'Chrome',
            device: 'Desktop'
          }
        }
      },
      {
        userId: 'admin-user',
        eventType: 'settings_change',
        action: 'System settings update',
        result: 'success',
        metadata: {
          userName: 'Admin User',
          userRole: 'admin',
          resourceType: 'system_settings',
          details: {
            action: 'Updated security settings',
            changedFields: ['mfa_required', 'session_timeout']
          }
        }
      },
      {
        userId: 'dev-456',
        eventType: 'diagnostics_access',
        action: 'Ran system diagnostics',
        result: 'success',
        metadata: {
          userName: 'Developer User',
          userRole: 'developer',
          resourceType: 'diagnostics',
          details: {
            action: 'Run Full Diagnostics',
            testsConducted: 42,
            result: 'success'
          }
        }
      }
    ];

    // Add sample logs with proper IDs and timestamps
    sampleLogs.forEach(log => {
      this.logs.push({
        id: uuidv4(),
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 10) * 86400000),
        userId: log.userId || 'unknown',
        eventType: log.eventType || 'system_change',
        action: log.action || '',
        result: log.result || 'success',
        metadata: log.metadata || {},
        ...log.metadata // Flatten metadata into top-level properties for compatibility
      } as AuditLogEntry);
    });
  }

  log(
    userId: string,
    eventType: AuditEventType,
    result: 'success' | 'failure',
    metadata?: AuditLogMetadata
  ): AuditLogEntry {
    const logEntry: AuditLogEntry = {
      id: uuidv4(),
      timestamp: new Date(),
      userId,
      eventType,
      action: this.getActionFromEventType(eventType),
      result,
      metadata,
      ...metadata // Flatten metadata into top-level properties for compatibility
    };

    this.logs.push(logEntry);
    return logEntry;
  }

  private getActionFromEventType(eventType: AuditEventType): string {
    const actionMap: Record<AuditEventType, string> = {
      'login': 'User login',
      'logout': 'User logout',
      'document_access': 'Document accessed',
      'document_modification': 'Document modified',
      'password_change': 'Password changed',
      'profile_update': 'Profile updated',
      'settings_change': 'Settings changed',
      'permission_change': 'Permission changed',
      'system_change': 'System changed',
      'diagnostics_access': 'Diagnostics accessed',
      'api_access': 'API accessed',
      'mfa_enabled': 'MFA enabled'
    };

    return actionMap[eventType] || 'Unknown action';
  }

  getRecentEntries(limit: number = 50): AuditLogEntry[] {
    return [...this.logs]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  getEntriesByEventType(eventType: AuditEventType, limit: number = 50): AuditLogEntry[] {
    return [...this.logs]
      .filter(log => log.eventType === eventType)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  getLogs(options: LogQueryOptions = {}): AuditLogEntry[] {
    let filteredLogs = [...this.logs];

    if (options.startDate) {
      filteredLogs = filteredLogs.filter(
        log => new Date(log.timestamp) >= options.startDate!
      );
    }

    if (options.endDate) {
      filteredLogs = filteredLogs.filter(
        log => new Date(log.timestamp) <= options.endDate!
      );
    }

    if (options.userId) {
      filteredLogs = filteredLogs.filter(
        log => log.userId === options.userId
      );
    }

    if (options.eventType) {
      filteredLogs = filteredLogs.filter(
        log => log.eventType === options.eventType
      );
    }

    if (options.resourceType) {
      filteredLogs = filteredLogs.filter(
        log => log.resourceType === options.resourceType || 
        (log.metadata && log.metadata.resourceType === options.resourceType)
      );
    }

    if (options.status) {
      filteredLogs = filteredLogs.filter(
        log => log.result === options.status || log.status === options.status
      );
    }

    return filteredLogs.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  clearLogs(): void {
    this.logs = [];
    this.initializeSampleLogs();
  }
}

export const auditLog = new AuditLogService();
