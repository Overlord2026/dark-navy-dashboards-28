-- Create message threads table
CREATE TABLE IF NOT EXISTS public.message_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_name TEXT,
  thread_type TEXT NOT NULL DEFAULT 'direct', -- 'direct', 'group', 'professional'
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id UUID,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create thread participants table
CREATE TABLE IF NOT EXISTS public.message_thread_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.message_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'participant', -- 'participant', 'moderator', 'observer'
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(thread_id, user_id)
);

-- Create encrypted messages table
CREATE TABLE IF NOT EXISTS public.secure_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.message_threads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_content TEXT NOT NULL, -- Encrypted content
  message_hash TEXT NOT NULL, -- For integrity verification
  encryption_key_id TEXT NOT NULL, -- Reference to encryption key
  message_type TEXT DEFAULT 'text', -- 'text', 'file', 'system'
  reply_to_id UUID REFERENCES public.secure_messages(id),
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP WITH TIME ZONE,
  tenant_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create message audit trail
CREATE TABLE IF NOT EXISTS public.message_audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES public.secure_messages(id) ON DELETE CASCADE,
  thread_id UUID NOT NULL REFERENCES public.message_threads(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'created', 'read', 'edited', 'deleted', 'archived'
  performed_by UUID NOT NULL REFERENCES auth.users(id),
  participant_context JSONB, -- Who else was in thread at time of action
  compliance_metadata JSONB, -- Retention, export flags, etc.
  ip_address INET,
  user_agent TEXT,
  tenant_id UUID,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create compliance settings table
CREATE TABLE IF NOT EXISTS public.message_compliance_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  retention_period_days INTEGER DEFAULT 2555, -- 7 years default
  auto_archive_enabled BOOLEAN DEFAULT TRUE,
  export_format TEXT DEFAULT 'json', -- 'json', 'pdf', 'csv'
  encryption_enabled BOOLEAN DEFAULT TRUE,
  external_messaging_allowed BOOLEAN DEFAULT TRUE,
  compliance_officer_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(tenant_id)
);

-- Enable RLS on all tables
ALTER TABLE public.message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_thread_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secure_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_compliance_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for message_threads
CREATE POLICY "Users can view threads they participate in" ON public.message_threads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.message_thread_participants 
      WHERE thread_id = id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create threads" ON public.message_threads
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- RLS Policies for thread_participants
CREATE POLICY "Users can view participants in their threads" ON public.message_thread_participants
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.message_thread_participants p2 
      WHERE p2.thread_id = thread_id AND p2.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add participants to threads they created" ON public.message_thread_participants
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.message_threads 
      WHERE id = thread_id AND created_by = auth.uid()
    )
  );

-- RLS Policies for secure_messages
CREATE POLICY "Users can view messages in their threads" ON public.secure_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.message_thread_participants 
      WHERE thread_id = secure_messages.thread_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their threads" ON public.secure_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.message_thread_participants 
      WHERE thread_id = secure_messages.thread_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for message_audit_trail  
CREATE POLICY "System admins can view all audit trails" ON public.message_audit_trail
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'system_administrator')
    )
  );

CREATE POLICY "Users can view audit trails for their messages" ON public.message_audit_trail
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.message_thread_participants 
      WHERE thread_id = message_audit_trail.thread_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can insert audit trails" ON public.message_audit_trail
  FOR INSERT WITH CHECK (auth.role() = 'service_role' OR auth.uid() IS NOT NULL);

-- RLS Policies for compliance_settings
CREATE POLICY "Admins can manage compliance settings" ON public.message_compliance_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'system_administrator', 'tenant_admin')
    )
  );

-- Create indexes for performance
CREATE INDEX idx_message_threads_tenant ON public.message_threads(tenant_id);
CREATE INDEX idx_thread_participants_user ON public.message_thread_participants(user_id);
CREATE INDEX idx_thread_participants_thread ON public.message_thread_participants(thread_id);
CREATE INDEX idx_secure_messages_thread ON public.secure_messages(thread_id);
CREATE INDEX idx_secure_messages_sender ON public.secure_messages(sender_id);
CREATE INDEX idx_audit_trail_message ON public.message_audit_trail(message_id);
CREATE INDEX idx_audit_trail_thread ON public.message_audit_trail(thread_id);
CREATE INDEX idx_audit_trail_timestamp ON public.message_audit_trail(timestamp);

-- Create update trigger for message_threads
CREATE OR REPLACE FUNCTION public.update_message_thread_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_message_threads_updated_at
  BEFORE UPDATE ON public.message_threads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_message_thread_timestamp();