-- Create tables for attorney client portal functionality

-- Client invitations table
CREATE TABLE public.attorney_client_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attorney_id UUID NOT NULL,
  client_email TEXT NOT NULL,
  client_name TEXT,
  invitation_token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Attorney-client relationships table
CREATE TABLE public.attorney_client_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attorney_id UUID NOT NULL,
  client_id UUID NOT NULL,
  relationship_type TEXT NOT NULL DEFAULT 'client' CHECK (relationship_type IN ('client', 'prospect', 'former_client')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated')),
  client_permissions JSONB NOT NULL DEFAULT '{"view_documents": true, "upload_documents": true, "view_messages": true, "send_messages": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(attorney_id, client_id)
);

-- Secure messages between attorneys and clients
CREATE TABLE public.attorney_client_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attorney_id UUID NOT NULL,
  client_id UUID NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('attorney', 'client')),
  sender_id UUID NOT NULL,
  message_content TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'document', 'system')),
  is_encrypted BOOLEAN NOT NULL DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  attachment_url TEXT,
  attachment_name TEXT,
  attachment_size BIGINT,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Shared documents between attorneys and clients
CREATE TABLE public.attorney_client_shared_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attorney_id UUID NOT NULL,
  client_id UUID NOT NULL,
  document_id UUID NOT NULL REFERENCES public.attorney_documents_metadata(id) ON DELETE CASCADE,
  shared_by UUID NOT NULL,
  permission_level TEXT NOT NULL DEFAULT 'view' CHECK (permission_level IN ('view', 'download', 'comment')),
  shared_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  access_count INTEGER NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Client portal notifications
CREATE TABLE public.client_portal_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attorney_id UUID NOT NULL,
  client_id UUID,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('document_shared', 'message_received', 'document_uploaded', 'appointment_scheduled', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  action_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Attorney dashboard metrics
CREATE TABLE public.attorney_dashboard_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  attorney_id UUID NOT NULL,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  active_clients INTEGER NOT NULL DEFAULT 0,
  pending_invitations INTEGER NOT NULL DEFAULT 0,
  unread_messages INTEGER NOT NULL DEFAULT 0,
  documents_shared_today INTEGER NOT NULL DEFAULT 0,
  client_uploads_today INTEGER NOT NULL DEFAULT 0,
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(attorney_id, metric_date)
);

-- Enable RLS on all tables
ALTER TABLE public.attorney_client_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attorney_client_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attorney_client_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attorney_client_shared_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_portal_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attorney_dashboard_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Attorney client invitations
CREATE POLICY "Attorneys can manage their client invitations"
ON public.attorney_client_invitations
FOR ALL
USING (attorney_id = auth.uid());

CREATE POLICY "Anyone can view invitation by token for acceptance"
ON public.attorney_client_invitations
FOR SELECT
USING (true);

-- Attorney client links
CREATE POLICY "Attorneys can manage their client relationships"
ON public.attorney_client_links
FOR ALL
USING (attorney_id = auth.uid());

CREATE POLICY "Clients can view their attorney relationships"
ON public.attorney_client_links
FOR SELECT
USING (client_id = auth.uid());

-- Attorney client messages
CREATE POLICY "Attorneys can manage messages with their clients"
ON public.attorney_client_messages
FOR ALL
USING (attorney_id = auth.uid());

CREATE POLICY "Clients can manage messages with their attorneys"
ON public.attorney_client_messages
FOR ALL
USING (client_id = auth.uid());

-- Attorney client shared documents
CREATE POLICY "Attorneys can manage shared documents with their clients"
ON public.attorney_client_shared_documents
FOR ALL
USING (attorney_id = auth.uid());

CREATE POLICY "Clients can view documents shared with them"
ON public.attorney_client_shared_documents
FOR SELECT
USING (client_id = auth.uid() AND is_active = true);

-- Client portal notifications
CREATE POLICY "Attorneys can manage their client notifications"
ON public.client_portal_notifications
FOR ALL
USING (attorney_id = auth.uid());

CREATE POLICY "Clients can view and update their notifications"
ON public.client_portal_notifications
FOR ALL
USING (client_id = auth.uid());

-- Attorney dashboard metrics
CREATE POLICY "Attorneys can view their dashboard metrics"
ON public.attorney_dashboard_metrics
FOR ALL
USING (attorney_id = auth.uid());

-- Create functions
CREATE OR REPLACE FUNCTION public.generate_attorney_invitation_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  token TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate a secure random token
    token := encode(gen_random_bytes(32), 'base64');
    token := replace(token, '/', '_');
    token := replace(token, '+', '-');
    
    -- Check if token already exists
    SELECT EXISTS(SELECT 1 FROM public.attorney_client_invitations WHERE invitation_token = token) INTO exists_check;
    
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN token;
END;
$$;

-- Trigger to update updated_at columns
CREATE OR REPLACE FUNCTION public.update_attorney_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_attorney_client_links_updated_at
BEFORE UPDATE ON public.attorney_client_links
FOR EACH ROW
EXECUTE FUNCTION public.update_attorney_updated_at_column();

CREATE TRIGGER update_attorney_client_messages_updated_at
BEFORE UPDATE ON public.attorney_client_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_attorney_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_attorney_client_invitations_attorney_id ON public.attorney_client_invitations(attorney_id);
CREATE INDEX idx_attorney_client_invitations_token ON public.attorney_client_invitations(invitation_token);
CREATE INDEX idx_attorney_client_links_attorney_id ON public.attorney_client_links(attorney_id);
CREATE INDEX idx_attorney_client_links_client_id ON public.attorney_client_links(client_id);
CREATE INDEX idx_attorney_client_messages_attorney_id ON public.attorney_client_messages(attorney_id);
CREATE INDEX idx_attorney_client_messages_client_id ON public.attorney_client_messages(client_id);
CREATE INDEX idx_attorney_client_shared_documents_attorney_id ON public.attorney_client_shared_documents(attorney_id);
CREATE INDEX idx_attorney_client_shared_documents_client_id ON public.attorney_client_shared_documents(client_id);
CREATE INDEX idx_client_portal_notifications_attorney_id ON public.client_portal_notifications(attorney_id);
CREATE INDEX idx_client_portal_notifications_client_id ON public.client_portal_notifications(client_id);
CREATE INDEX idx_attorney_dashboard_metrics_attorney_id ON public.attorney_dashboard_metrics(attorney_id);