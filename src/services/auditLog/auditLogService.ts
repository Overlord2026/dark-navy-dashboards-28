
// Export the AuditEventType for use in other files
export type AuditEventType = 'login' | 'logout' | 'document_access' | 'document_modification' | 
  'password_change' | 'profile_update' | 'settings_change' | 'permission_change' | 
  'system_change' | 'diagnostics_access' | 'api_access' | 'mfa_enabled' |
  'document_creation' | 'document_share' | 'document_notification' |
  'appointment_reminder' | 'medication_reminder' | 'insurance_reminder' |
  'prescription_add' | 'prescription_update' | 'prescription_delete' |
  'mfa_enforcement_check' | 'session_rotation' | 'integration_connect_attempt' |
  'integration_connected' | 'integration_connect_failed' | 'integration_disconnect';

export interface AuditLogEntry {
  id: string;
  userId: string;
  eventType: AuditEventType;
  timestamp: Date;
  status: 'success' | 'failure';
  result: 'success' | 'failure'; // Adding this for backward compatibility
  userName?: string;
  userRole?: string;
  ipAddress?: string;
  resourceId?: string;
  resourceType?: string;
  details?: Record<string, any>;
  reason?: string;
  metadata?: {
    userName?: string;
    userRole?: string;
    ipAddress?: string;
    resourceId?: string;
    resourceType?: string;
    details?: {
      action?: string;
      result?: string;
      testsConducted?: string;
      [key: string]: any;
    };
    reason?: string;
    mfaEnabled?: boolean;
    shouldBlock?: boolean;
    gracePeriodExpired?: boolean;
    accountAgeHours?: number;
    requiresMFA?: boolean;
    timestamp?: string;
    error?: string;
    [key: string]: any;
  };
  action?: string;
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
      requiresMFA?: boolean;
      timestamp?: string;
      error?: string;
      mfaEnabled?: boolean;
      shouldBlock?: boolean;
      gracePeriodExpired?: boolean;
      accountAgeHours?: number;
      action?: string;
    }
  ) {
    const { timestamp: additionalTimestamp, ...restAdditionalInfo } = additionalInfo || {};
    
    const logEntry: AuditLogEntry = {
      id: crypto.randomUUID(),
      userId,
      eventType,
      timestamp: new Date(),
      status,
      result: status, // For backward compatibility
      ...restAdditionalInfo,
      metadata: additionalInfo // Also store in metadata for compatibility
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

  // Add getRecentEntries method
  getRecentEntries(limit: number = 100): AuditLogEntry[] {
    return [...this.logs]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

export const auditLog = new AuditLogService();
