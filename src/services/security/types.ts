
import { AuditEventType } from "@/services/auditLog/auditLogService";

export interface AuditOptions {
  sensitiveDataFields?: string[];
  nonRepudiation?: boolean;
  persistImmediately?: boolean;
}

export interface ClientInfo {
  userAgent: string;
  platform: string;
  language: string;
  screenSize: {
    width: number;
    height: number;
  };
  timeZone: string;
  timestamp: string;
}

export interface AuditMetadata {
  userName?: string;
  userRole?: string;
  ipAddress?: string;
  resourceId?: string;
  resourceType?: string;
  details?: Record<string, any>;
  reason?: string;
  clientInfo?: ClientInfo;
  timestamp?: string;
  [key: string]: any;
}

export interface AuditLogRecord {
  id: string;
  user_id: string;
  event_type: string;
  status: string;
  details: Record<string, any>;
  created_at: string;
}
