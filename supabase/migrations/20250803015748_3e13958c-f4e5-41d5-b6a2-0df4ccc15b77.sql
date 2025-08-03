-- Family Legacy Vault Core Tables
CREATE TABLE public.family_vaults (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vault_name TEXT NOT NULL,
  description TEXT,
  vault_photo_url TEXT,
  family_motto TEXT,
  family_values TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  tenant_id UUID,
  encryption_key_id TEXT NOT NULL DEFAULT gen_random_uuid()::text
);

-- Vault Members (Family Circle)
CREATE TABLE public.vault_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vault_id UUID NOT NULL REFERENCES public.family_vaults(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  role TEXT NOT NULL DEFAULT 'viewer', -- viewer, contributor, executor, admin
  permissions JSONB NOT NULL DEFAULT '{"view": true, "add": false, "share": false, "admin": false}',
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, active, inactive
  created_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Legacy Items (messages, documents, photos)
CREATE TABLE public.legacy_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vault_id UUID NOT NULL REFERENCES public.family_vaults(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  item_type TEXT NOT NULL, -- message, document, photo, video, audio
  title TEXT NOT NULL,
  description TEXT,
  content_url TEXT, -- encrypted file path
  content_type TEXT, -- MIME type
  file_size BIGINT,
  duration_seconds INTEGER, -- for audio/video
  thumbnail_url TEXT,
  is_encrypted BOOLEAN NOT NULL DEFAULT true,
  encryption_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' -- active, archived, deleted
);

-- Delivery Rules & Triggers
CREATE TABLE public.legacy_delivery_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_item_id UUID NOT NULL REFERENCES public.legacy_items(id) ON DELETE CASCADE,
  trigger_type TEXT NOT NULL, -- date, event, manual
  trigger_date TIMESTAMP WITH TIME ZONE,
  trigger_event TEXT, -- death, incapacity, birthday, graduation, etc.
  trigger_condition JSONB,
  delivery_method TEXT NOT NULL DEFAULT 'platform', -- platform, email, sms
  require_executor_approval BOOLEAN NOT NULL DEFAULT false,
  executor_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'pending' -- pending, active, triggered, delivered, cancelled
);

-- Recipients for each legacy item
CREATE TABLE public.legacy_recipients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_item_id UUID NOT NULL REFERENCES public.legacy_items(id) ON DELETE CASCADE,
  vault_member_id UUID REFERENCES public.vault_members(id) ON DELETE CASCADE,
  recipient_email TEXT,
  recipient_name TEXT,
  personal_message TEXT,
  delivery_status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, viewed, downloaded
  delivered_at TIMESTAMP WITH TIME ZONE,
  viewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Audit Trail
CREATE TABLE public.vault_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vault_id UUID NOT NULL REFERENCES public.family_vaults(id) ON DELETE CASCADE,
  legacy_item_id UUID REFERENCES public.legacy_items(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  action_type TEXT NOT NULL, -- view, download, upload, share, delete, access
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Demo/Sample Content
CREATE TABLE public.vault_demo_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_type TEXT NOT NULL, -- story, message, photo, video
  title TEXT NOT NULL,
  description TEXT,
  sample_url TEXT,
  thumbnail_url TEXT,
  category TEXT, -- childhood, wisdom, family_history, milestones
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.family_vaults ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_delivery_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_demo_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Family Vaults
CREATE POLICY "Users can manage their own vaults" ON public.family_vaults
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Vault members can view vaults they belong to" ON public.family_vaults
  FOR SELECT USING (
    id IN (
      SELECT vault_id FROM public.vault_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- RLS Policies for Vault Members
CREATE POLICY "Vault owners can manage members" ON public.vault_members
  FOR ALL USING (
    vault_id IN (
      SELECT id FROM public.family_vaults WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can view other members in their vaults" ON public.vault_members
  FOR SELECT USING (
    vault_id IN (
      SELECT vault_id FROM public.vault_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- RLS Policies for Legacy Items
CREATE POLICY "Vault members can view legacy items" ON public.legacy_items
  FOR SELECT USING (
    vault_id IN (
      SELECT vault_id FROM public.vault_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Contributors can add legacy items" ON public.legacy_items
  FOR INSERT WITH CHECK (
    vault_id IN (
      SELECT vault_id FROM public.vault_members 
      WHERE user_id = auth.uid() 
      AND status = 'active' 
      AND (permissions->>'add')::boolean = true
    )
  );

CREATE POLICY "Creators can update their own items" ON public.legacy_items
  FOR UPDATE USING (created_by = auth.uid());

-- RLS Policies for other tables
CREATE POLICY "Legacy item access for delivery rules" ON public.legacy_delivery_rules
  FOR ALL USING (
    legacy_item_id IN (
      SELECT id FROM public.legacy_items
      WHERE vault_id IN (
        SELECT vault_id FROM public.vault_members 
        WHERE user_id = auth.uid() AND status = 'active'
      )
    )
  );

CREATE POLICY "Legacy item access for recipients" ON public.legacy_recipients
  FOR ALL USING (
    legacy_item_id IN (
      SELECT id FROM public.legacy_items
      WHERE vault_id IN (
        SELECT vault_id FROM public.vault_members 
        WHERE user_id = auth.uid() AND status = 'active'
      )
    )
  );

CREATE POLICY "Vault access logs viewable by members" ON public.vault_access_logs
  FOR SELECT USING (
    vault_id IN (
      SELECT vault_id FROM public.vault_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Demo content is public" ON public.vault_demo_content
  FOR SELECT USING (is_active = true);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_family_vaults_updated_at
  BEFORE UPDATE ON public.family_vaults
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_legacy_items_updated_at
  BEFORE UPDATE ON public.legacy_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for vault files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'legacy-vault', 
  'legacy-vault', 
  false, 
  104857600, -- 100MB limit
  ARRAY['image/*', 'video/*', 'audio/*', 'application/pdf', 'text/*']
);

-- Storage policies for vault files
CREATE POLICY "Vault members can upload files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'legacy-vault' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Vault members can view files" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'legacy-vault' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Vault members can update their files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'legacy-vault' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Insert sample demo content
INSERT INTO public.vault_demo_content (content_type, title, description, category) VALUES
('story', 'My First Day of School', 'A heartwarming story about courage and new beginnings', 'childhood'),
('message', 'Graduation Wisdom', 'Words of encouragement for life after school', 'milestones'),
('story', 'How I Met Your Mother/Father', 'The love story that started our family', 'family_history'),
('message', 'Business Advice', 'Lessons learned from 40 years in business', 'wisdom'),
('story', 'Family Traditions', 'The meaning behind our holiday celebrations', 'family_history'),
('message', 'Birthday Wishes', 'A special message for your 18th birthday', 'milestones');