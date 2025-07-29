export interface MessageThread {
  id: string;
  thread_name: string | null;
  thread_type: 'direct' | 'group' | 'professional';
  created_by: string;
  tenant_id: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  participants?: ThreadParticipant[];
  unread_count?: number;
  last_message?: SecureMessage;
}

export interface ThreadParticipant {
  id: string;
  thread_id: string;
  user_id: string;
  role: 'participant' | 'moderator' | 'observer';
  joined_at: string;
  last_read_at: string;
  user_profile?: {
    display_name: string;
    email: string;
    role: string;
  };
}

export interface SecureMessage {
  id: string;
  thread_id: string;
  sender_id: string;
  message_content: string; // This will be encrypted
  message_hash: string;
  encryption_key_id: string;
  message_type: 'text' | 'file' | 'system';
  reply_to_id: string | null;
  is_edited: boolean;
  edited_at: string | null;
  tenant_id: string | null;
  created_at: string;
  sender_profile?: {
    display_name: string;
    email: string;
    role: string;
  };
  decrypted_content?: string; // Populated after decryption
}

export interface MessageAuditEntry {
  id: string;
  message_id: string | null;
  thread_id: string;
  action_type: 'created' | 'read' | 'edited' | 'deleted' | 'archived';
  performed_by: string;
  participant_context: any;
  compliance_metadata: any;
  ip_address: string | null;
  user_agent: string | null;
  tenant_id: string | null;
  timestamp: string;
}

export interface ComplianceSettings {
  id: string;
  tenant_id: string;
  retention_period_days: number;
  auto_archive_enabled: boolean;
  export_format: 'json' | 'pdf' | 'csv';
  encryption_enabled: boolean;
  external_messaging_allowed: boolean;
  compliance_officer_email: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateThreadRequest {
  thread_name?: string;
  thread_type: 'direct' | 'group' | 'professional';
  participant_ids: string[];
}

export interface SendMessageRequest {
  thread_id: string;
  content: string;
  message_type?: 'text' | 'file';
  reply_to_id?: string;
}