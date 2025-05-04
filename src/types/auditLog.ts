
export interface InsertAuditLog {
  user_id: string;
  event_type: string;
  status: string;
  details: Record<string, any>;
}

// Add this declaration to help TypeScript recognize the audit_logs table
declare module '@supabase/supabase-js' {
  interface Database {
    public: {
      Tables: {
        audit_logs: {
          Row: {
            id: string;
            user_id: string;
            event_type: string;
            status: string;
            details: Record<string, any>;
            created_at: string;
          };
          Insert: {
            id?: string;
            user_id: string;
            event_type: string;
            status: string;
            details?: Record<string, any>;
            created_at?: string;
          };
          Update: {
            id?: string;
            user_id?: string;
            event_type?: string;
            status?: string;
            details?: Record<string, any>;
            created_at?: string;
          };
        };
      };
    };
  }
}
