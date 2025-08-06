-- Create Legacy Vault Tables
CREATE TABLE public.vault_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('document', 'video', 'photo', 'audio', 'avatar', 'letter')),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_size BIGINT,
  mime_type TEXT,
  encrypted BOOLEAN NOT NULL DEFAULT true,
  tags TEXT[],
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.vault_access_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.vault_items(id) ON DELETE CASCADE,
  user_id UUID,
  user_email TEXT,
  access_type TEXT NOT NULL CHECK (access_type IN ('view', 'edit', 'download', 'admin')),
  unlock_event TEXT CHECK (unlock_event IN ('death', 'date', 'milestone', 'manual', 'immediate')),
  unlock_date DATE,
  milestone_description TEXT,
  authorized_by UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.vault_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES public.vault_items(id) ON DELETE SET NULL,
  user_id UUID,
  user_email TEXT,
  action TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.vault_avatar (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  avatar_name TEXT NOT NULL,
  avatar_file_url TEXT,
  training_data_url TEXT,
  personality_prompts TEXT[],
  voice_sample_url TEXT,
  status TEXT NOT NULL DEFAULT 'training' CHECK (status IN ('training', 'active', 'paused', 'archived')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.vault_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.vault_items(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL CHECK (milestone_type IN ('age', 'graduation', 'marriage', 'birth', 'anniversary', 'custom')),
  trigger_date DATE,
  age_trigger INTEGER,
  description TEXT NOT NULL,
  recipient_id UUID,
  recipient_email TEXT,
  triggered BOOLEAN NOT NULL DEFAULT false,
  triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.vault_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_access_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_avatar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vault_items
CREATE POLICY "Users can view their own vault items" ON public.vault_items
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can create their own vault items" ON public.vault_items
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own vault items" ON public.vault_items
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own vault items" ON public.vault_items
  FOR DELETE USING (owner_id = auth.uid());

CREATE POLICY "Users can view vault items with access rules" ON public.vault_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vault_access_rules var
      WHERE var.item_id = vault_items.id 
      AND (var.user_id = auth.uid() OR var.user_email = auth.email())
      AND var.status = 'active'
    )
  );

-- RLS Policies for vault_access_rules
CREATE POLICY "Owners can manage access rules for their items" ON public.vault_access_rules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.vault_items vi
      WHERE vi.id = vault_access_rules.item_id AND vi.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can view access rules for items they have access to" ON public.vault_access_rules
  FOR SELECT USING (
    user_id = auth.uid() OR 
    user_email = auth.email() OR
    EXISTS (
      SELECT 1 FROM public.vault_items vi
      WHERE vi.id = vault_access_rules.item_id AND vi.owner_id = auth.uid()
    )
  );

-- RLS Policies for vault_audit_log
CREATE POLICY "Users can view audit logs for their items" ON public.vault_audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.vault_items vi
      WHERE vi.id = vault_audit_log.item_id AND vi.owner_id = auth.uid()
    ) OR
    user_id = auth.uid()
  );

CREATE POLICY "System can insert audit logs" ON public.vault_audit_log
  FOR INSERT WITH CHECK (true);

-- RLS Policies for vault_avatar
CREATE POLICY "Users can manage their own avatars" ON public.vault_avatar
  FOR ALL USING (owner_id = auth.uid());

-- RLS Policies for vault_milestones
CREATE POLICY "Users can manage milestones for their items" ON public.vault_milestones
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.vault_items vi
      WHERE vi.id = vault_milestones.item_id AND vi.owner_id = auth.uid()
    )
  );

-- Create function to log vault activity
CREATE OR REPLACE FUNCTION public.log_vault_activity(
  p_item_id UUID,
  p_action TEXT,
  p_details JSONB DEFAULT '{}'::jsonb
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.vault_audit_log (
    item_id, user_id, user_email, action, ip_address, details
  ) VALUES (
    p_item_id,
    auth.uid(),
    auth.email(),
    p_action,
    inet_client_addr(),
    p_details
  );
END;
$$;

-- Create trigger to update timestamps
CREATE OR REPLACE FUNCTION public.update_vault_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vault_items_updated_at
  BEFORE UPDATE ON public.vault_items
  FOR EACH ROW EXECUTE FUNCTION public.update_vault_updated_at();

CREATE TRIGGER vault_access_rules_updated_at
  BEFORE UPDATE ON public.vault_access_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_vault_updated_at();

CREATE TRIGGER vault_avatar_updated_at
  BEFORE UPDATE ON public.vault_avatar
  FOR EACH ROW EXECUTE FUNCTION public.update_vault_updated_at();

CREATE TRIGGER vault_milestones_updated_at
  BEFORE UPDATE ON public.vault_milestones
  FOR EACH ROW EXECUTE FUNCTION public.update_vault_updated_at();