
// Export the AuditEventType for use in other files
export type AuditEventType = 'login' | 'logout' | 'document_access' | 'document_modification' | 
  'password_change' | 'profile_update' | 'settings_change' | 'permission_change' | 
  'system_change' | 'diagnostics_access' | 'api_access' | 'mfa_enabled';

export interface AuditLogEntry {
  id: string;
  userId: string;
  eventType: AuditEventType;
  timestamp: Date;
  status: 'success' | 'failure';
  userName?: string;
  userRole?: string;
  ipAddress?: string;
  resourceId?: string;
  resourceType?: string;
  details?: Record<string, any>;
  reason?: string;
}

class AuditLogService {
  private logs: AuditLogEntry[] = [];

  log(
    userId: string,
    eventType: AuditEventType,
    status: 'success' | 'failure',
    additionalInfo?: {
      userName?: string;
      userRole?: string;
      ipAddress?: string;
      resourceId?: string;
      resourceType?: string;
      details?: Record<string, any>;
      reason?: string;
    }
  ) {
    const logEntry: AuditLogEntry = {
      id: crypto.randomUUID(),
      userId,
      eventType,
      timestamp: new Date(),
      status,
      ...additionalInfo
    };

    this.logs.push(logEntry);
    console.log(`Audit Log: ${eventType} by user ${userId} - ${status}`);
    
    return logEntry;
  }

  getLogs(filters?: Partial<AuditLogEntry>): AuditLogEntry[] {
    if (!filters) {
      return [...this.logs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    return [...this.logs]
      .filter(log => {
        return Object.entries(filters).every(([key, value]) => {
          if (key === 'timestamp') return true; // Handle date separately if needed
          return log[key as keyof AuditLogEntry] === value;
        });
      })
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

export const auditLog = new AuditLogService();
