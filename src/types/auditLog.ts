
export interface InsertAuditLog {
  user_id: string;
  event_type: string;
  status: string;
  details: Record<string, any>;
}
