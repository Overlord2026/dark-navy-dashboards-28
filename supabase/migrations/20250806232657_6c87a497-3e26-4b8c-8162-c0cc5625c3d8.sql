-- Secure Legacy Vault™ Database Schema
-- Tables for document storage, permissions, event triggers, and audit logging

-- Create vault_documents table for file storage
CREATE TABLE public.vault_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vault_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  tags TEXT[],
  description TEXT,
  is_encrypted BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vault_permissions table for access control
CREATE TABLE public.vault_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vault_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT, -- For non-registered users
  role TEXT NOT NULL CHECK (role IN ('owner', 'family', 'advisor', 'attorney', 'read_only')),
  permissions JSONB DEFAULT '{}',
  granted_by UUID NOT NULL REFERENCES auth.users(id),
  consent_given_at TIMESTAMP WITH TIME ZONE,
  revoked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vault_triggers table for event-based delivery
CREATE TABLE public.vault_triggers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vault_id UUID NOT NULL,
  document_id UUID REFERENCES public.vault_documents(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('age', 'date', 'death', 'incapacity', 'marriage', 'custom')),
  trigger_condition JSONB NOT NULL,
  recipient_id UUID REFERENCES auth.users(id),
  recipient_email TEXT,
  message TEXT,
  is_active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vault_audit_log table for security tracking
CREATE TABLE public.vault_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vault_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vault_legacy_messages table for multimedia messages
CREATE TABLE public.vault_legacy_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vault_id UUID NOT NULL,
  creator_id UUID NOT NULL REFERENCES auth.users(id),
  title TEXT NOT NULL,
  message_type TEXT NOT NULL CHECK (message_type IN ('video', 'audio', 'text', 'photo')),
  content TEXT,
  media_url TEXT,
  recipient_type TEXT DEFAULT 'general',
  recipient_id UUID REFERENCES auth.users(id),
  delivery_trigger_id UUID REFERENCES public.vault_triggers(id),
  is_delivered BOOLEAN DEFAULT false,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vault_ai_training table for Legacy Copilot
CREATE TABLE public.vault_ai_training (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vault_id UUID NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  is_approved BOOLEAN DEFAULT false,
  training_session_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vault_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_legacy_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_ai_training ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vault_documents
CREATE POLICY "Users can view documents they have access to" ON public.vault_documents
FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.vault_permissions 
    WHERE vault_id = vault_documents.vault_id 
    AND user_id = auth.uid() 
    AND revoked_at IS NULL
  )
);

CREATE POLICY "Users can insert their own documents" ON public.vault_documents
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own documents" ON public.vault_documents
FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for vault_permissions
CREATE POLICY "Users can view permissions for their vaults" ON public.vault_permissions
FOR SELECT USING (
  user_id = auth.uid() OR
  granted_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.vault_permissions p2 
    WHERE p2.vault_id = vault_permissions.vault_id 
    AND p2.user_id = auth.uid() 
    AND p2.role = 'owner'
  )
);

CREATE POLICY "Vault owners can manage permissions" ON public.vault_permissions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.vault_permissions 
    WHERE vault_id = vault_permissions.vault_id 
    AND user_id = auth.uid() 
    AND role = 'owner'
  )
);

-- RLS Policies for audit log
CREATE POLICY "Users can view audit logs for their vaults" ON public.vault_audit_log
FOR SELECT USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.vault_permissions 
    WHERE vault_id = vault_audit_log.vault_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'advisor', 'attorney')
  )
);

-- Create indexes for performance
CREATE INDEX idx_vault_documents_vault_id ON public.vault_documents(vault_id);
CREATE INDEX idx_vault_documents_user_id ON public.vault_documents(user_id);
CREATE INDEX idx_vault_permissions_vault_id ON public.vault_permissions(vault_id);
CREATE INDEX idx_vault_permissions_user_id ON public.vault_permissions(user_id);
CREATE INDEX idx_vault_audit_log_vault_id ON public.vault_audit_log(vault_id);
CREATE INDEX idx_vault_triggers_vault_id ON public.vault_triggers(vault_id);

-- Create storage bucket for vault files
INSERT INTO storage.buckets (id, name, public) VALUES ('vault-documents', 'vault-documents', false);

-- Storage policies for vault documents
CREATE POLICY "Users can upload vault documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'vault-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view vault documents they have access to" ON storage.objects
FOR SELECT USING (
  bucket_id = 'vault-documents' AND
  (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM public.vault_permissions p
      JOIN public.vault_documents d ON p.vault_id = d.vault_id
      WHERE d.storage_path = name 
      AND p.user_id = auth.uid() 
      AND p.revoked_at IS NULL
    )
  )
);

-- Function to log vault activities
CREATE OR REPLACE FUNCTION public.log_vault_activity()
RETURNS TRIGGER 
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.vault_audit_log (vault_id, user_id, action, resource_type, resource_id, details)
  VALUES (
    COALESCE(NEW.vault_id, OLD.vault_id),
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'INSERT' THEN to_jsonb(NEW)
      WHEN TG_OP = 'UPDATE' THEN jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
      WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
    END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for audit logging
CREATE TRIGGER vault_documents_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.vault_documents
  FOR EACH ROW EXECUTE FUNCTION public.log_vault_activity();

CREATE TRIGGER vault_permissions_audit_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.vault_permissions
  FOR EACH ROW EXECUTE FUNCTION public.log_vault_activity();