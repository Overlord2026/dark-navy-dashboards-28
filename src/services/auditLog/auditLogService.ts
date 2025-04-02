
// Simple in-memory audit log implementation
// In a real app, this would persist to a database or external service

export type AuditEventType = 
  | 'login'
  | 'logout'
  | 'password_change'
  | 'profile_update'
  | 'settings_change'
  | 'document_access'
  | 'document_modification'
  | 'diagnostics_access'
  | 'system_change'
  | 'permission_change'
  | 'api_access';

export type AuditLogResult = 'success' | 'failure';

export interface AuditLogEntry {
  timestamp: string;
  userId: string;
  eventType: AuditEventType;
  result: AuditLogResult;
  metadata: any;
  id: string;
}

class AuditLogService {
  private logEntries: AuditLogEntry[] = [];
  private maxEntries = 1000; // Limit to prevent memory issues
  
  log(
    userId: string,
    eventType: AuditEventType,
    result: AuditLogResult,
    metadata: any
  ): AuditLogEntry {
    const entry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      userId,
      eventType,
      result,
      metadata,
      id: crypto.randomUUID()
    };
    
    this.logEntries.unshift(entry); // Add to beginning for chronological order
    
    // Trim if too many entries
    if (this.logEntries.length > this.maxEntries) {
      this.logEntries = this.logEntries.slice(0, this.maxEntries);
    }
    
    console.log(`[Audit Log] ${eventType} by ${userId}: ${result}`);
    
    return entry;
  }
  
  getRecentEntries(limit: number = 100): AuditLogEntry[] {
    return this.logEntries.slice(0, limit);
  }
  
  getEntriesByUser(userId: string, limit: number = 100): AuditLogEntry[] {
    return this.logEntries
      .filter(entry => entry.userId === userId)
      .slice(0, limit);
  }
  
  getEntriesByType(eventType: AuditEventType, limit: number = 100): AuditLogEntry[] {
    return this.logEntries
      .filter(entry => entry.eventType === eventType)
      .slice(0, limit);
  }
  
  getEntriesByTimeRange(startTime: Date, endTime: Date, limit: number = 100): AuditLogEntry[] {
    return this.logEntries
      .filter(entry => {
        const entryTime = new Date(entry.timestamp);
        return entryTime >= startTime && entryTime <= endTime;
      })
      .slice(0, limit);
  }
  
  clearLogs(): void {
    this.logEntries = [];
  }
}

export const auditLog = new AuditLogService();
