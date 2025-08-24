export interface Receipt {
  id: string;
  type: 'Decision-RDS' | 'Vault-RDS' | 'Comms-RDS' | 'Engagement-RDS';
  timestamp: string;
  payload: Record<string, any>;
  inputs_hash: string;
  policy_version: string;
  anchor_ref?: string;
}

export type DecisionReasons = 
  | 'meeting_summary' 
  | 'ai_summary' 
  | 'action_items' 
  | 'risk_flag'
  | 'meeting_import'
  | 'stage_change'
  | 'lead_capture'
  | 'calculator_submit';

export type CommsReasons = 
  | 'email_sent'
  | 'template_used'
  | 'campaign_launch'
  | 'drip_sequence';

export type EngagementReasons = 
  | 'email_opened'
  | 'email_clicked'
  | 'link_followed'
  | 'document_viewed';

export type VaultReasons = 
  | 'file_stored'
  | 'grant_issued'
  | 'access_granted'
  | 'meeting_artifacts';

export interface DecisionRDSPayload {
  action: string;
  policy_version: string;
  inputs_hash: string;
  reasons: DecisionReasons[];
  source?: string;
  [key: string]: any;
}

export interface CommsRDSPayload {
  channel: 'email' | 'sms' | 'push';
  template_id?: string;
  recipient_hash: string;
  policy_ok: boolean;
  result: 'sent' | 'failed' | 'queued';
  reasons: CommsReasons[];
  [key: string]: any;
}

export interface EngagementRDSPayload {
  action: 'open' | 'click' | 'view' | 'download';
  asset_id: string;
  user_hash: string;
  timestamp: string;
  reasons: EngagementReasons[];
  [key: string]: any;
}

export interface VaultRDSPayload {
  action: 'vault_grant' | 'file_store' | 'access_log';
  files: string[];
  grant_type?: 'PRE' | 'POST';
  expires_at?: string;
  reasons: VaultReasons[];
  [key: string]: any;
}