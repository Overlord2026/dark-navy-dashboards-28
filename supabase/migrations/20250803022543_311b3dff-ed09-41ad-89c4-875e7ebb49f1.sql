-- Enhanced vault permissions and roles
CREATE TYPE vault_permission_level AS ENUM ('owner', 'admin', 'editor', 'member', 'viewer', 'executor');

-- Update vault_members table to use the new permission level
ALTER TABLE vault_members 
DROP COLUMN IF EXISTS role,
ADD COLUMN permission_level vault_permission_level DEFAULT 'member';

-- Add permission details
ALTER TABLE vault_members 
ADD COLUMN IF NOT EXISTS can_view boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS can_upload boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS can_share boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS can_manage_members boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS can_delete boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_executor boolean DEFAULT false;

-- Enhanced file storage for encrypted uploads
CREATE TABLE IF NOT EXISTS vault_files (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id uuid NOT NULL REFERENCES family_vaults(id) ON DELETE CASCADE,
    uploaded_by uuid NOT NULL,
    file_name text NOT NULL,
    file_size bigint NOT NULL,
    content_type text NOT NULL,
    file_path text NOT NULL,
    encryption_key_id text NOT NULL,
    is_encrypted boolean DEFAULT true,
    chunk_count integer DEFAULT 1,
    upload_status text DEFAULT 'pending' CHECK (upload_status IN ('pending', 'uploading', 'completed', 'failed')),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    metadata jsonb DEFAULT '{}'::jsonb
);

-- Enhanced delivery rules for messages
ALTER TABLE legacy_delivery_rules 
ADD COLUMN IF NOT EXISTS delivery_status text DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'scheduled', 'delivered', 'failed')),
ADD COLUMN IF NOT EXISTS scheduled_for timestamp with time zone,
ADD COLUMN IF NOT EXISTS delivered_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS delivery_attempts integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS executor_approval_required boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS executor_approved_by uuid,
ADD COLUMN IF NOT EXISTS executor_approved_at timestamp with time zone;

-- Enhanced audit logging
CREATE TABLE IF NOT EXISTS vault_activity_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id uuid NOT NULL REFERENCES family_vaults(id) ON DELETE CASCADE,
    user_id uuid,
    action_type text NOT NULL,
    resource_type text NOT NULL,
    resource_id uuid,
    details jsonb DEFAULT '{}'::jsonb,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);

-- Notification system
CREATE TABLE IF NOT EXISTS vault_notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vault_id uuid NOT NULL REFERENCES family_vaults(id) ON DELETE CASCADE,
    recipient_id uuid NOT NULL,
    notification_type text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    delivery_method text DEFAULT 'email' CHECK (delivery_method IN ('email', 'sms', 'push')),
    scheduled_for timestamp with time zone DEFAULT now(),
    sent_at timestamp with time zone,
    read_at timestamp with time zone,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now()
);

-- Enhanced vault branding
ALTER TABLE family_vaults 
ADD COLUMN IF NOT EXISTS cover_photo_url text,
ADD COLUMN IF NOT EXISTS theme_color text DEFAULT '#2563eb',
ADD COLUMN IF NOT EXISTS font_family text DEFAULT 'Inter',
ADD COLUMN IF NOT EXISTS custom_css jsonb DEFAULT '{}'::jsonb;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_vault_files_vault_id ON vault_files(vault_id);
CREATE INDEX IF NOT EXISTS idx_vault_files_uploaded_by ON vault_files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_vault_activity_log_vault_id ON vault_activity_log(vault_id);
CREATE INDEX IF NOT EXISTS idx_vault_activity_log_created_at ON vault_activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vault_notifications_recipient ON vault_notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_vault_notifications_scheduled ON vault_notifications(scheduled_for);

-- RLS Policies
ALTER TABLE vault_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE vault_notifications ENABLE ROW LEVEL SECURITY;

-- Vault files policies
CREATE POLICY "Users can view files in their vaults" ON vault_files
FOR SELECT USING (
    vault_id IN (
        SELECT vm.vault_id FROM vault_members vm 
        WHERE vm.user_id = auth.uid() AND vm.status = 'active'
    )
);

CREATE POLICY "Users can upload files to their vaults" ON vault_files
FOR INSERT WITH CHECK (
    vault_id IN (
        SELECT vm.vault_id FROM vault_members vm 
        WHERE vm.user_id = auth.uid() 
        AND vm.status = 'active' 
        AND vm.can_upload = true
    )
);

-- Activity log policies
CREATE POLICY "Users can view activity in their vaults" ON vault_activity_log
FOR SELECT USING (
    vault_id IN (
        SELECT vm.vault_id FROM vault_members vm 
        WHERE vm.user_id = auth.uid() AND vm.status = 'active'
    )
);

CREATE POLICY "System can log all activities" ON vault_activity_log
FOR INSERT WITH CHECK (true);

-- Notification policies
CREATE POLICY "Users can view their notifications" ON vault_notifications
FOR SELECT USING (recipient_id = auth.uid());

-- Functions for permission checking
CREATE OR REPLACE FUNCTION check_vault_permission(
    p_vault_id uuid,
    p_user_id uuid,
    p_permission text
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    member_record RECORD;
BEGIN
    SELECT * INTO member_record
    FROM vault_members 
    WHERE vault_id = p_vault_id 
    AND user_id = p_user_id 
    AND status = 'active';
    
    IF NOT FOUND THEN
        RETURN false;
    END IF;
    
    CASE p_permission
        WHEN 'view' THEN RETURN member_record.can_view;
        WHEN 'upload' THEN RETURN member_record.can_upload;
        WHEN 'share' THEN RETURN member_record.can_share;
        WHEN 'manage_members' THEN RETURN member_record.can_manage_members;
        WHEN 'delete' THEN RETURN member_record.can_delete;
        WHEN 'executor' THEN RETURN member_record.is_executor;
        ELSE RETURN false;
    END CASE;
END;
$$;

-- Function to log vault activities
CREATE OR REPLACE FUNCTION log_vault_activity(
    p_vault_id uuid,
    p_action_type text,
    p_resource_type text,
    p_resource_id uuid DEFAULT NULL,
    p_details jsonb DEFAULT '{}'::jsonb
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    log_id uuid;
BEGIN
    INSERT INTO vault_activity_log (
        vault_id, user_id, action_type, resource_type, 
        resource_id, details, ip_address
    ) VALUES (
        p_vault_id, auth.uid(), p_action_type, p_resource_type,
        p_resource_id, p_details, inet_client_addr()
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$;