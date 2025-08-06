-- Add new columns to existing vault tables if they don't exist
DO $$ 
BEGIN
  -- Add event trigger columns to vault_triggers if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vault_triggers' AND column_name='notification_settings') THEN
    ALTER TABLE public.vault_triggers ADD COLUMN notification_settings JSONB DEFAULT '{}';
  END IF;
  
  -- Add training columns to vault_ai_training if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vault_ai_training' AND column_name='avatar_voice_id') THEN
    ALTER TABLE public.vault_ai_training ADD COLUMN avatar_voice_id TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='vault_ai_training' AND column_name='conversation_context') THEN
    ALTER TABLE public.vault_ai_training ADD COLUMN conversation_context JSONB DEFAULT '{}';
  END IF;
END $$;

-- Create vault_agreement_workflows table for digital consent
CREATE TABLE IF NOT EXISTS public.vault_agreement_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vault_id UUID NOT NULL,
  workflow_type TEXT NOT NULL CHECK (workflow_type IN ('privacy_consent', 'access_agreement', 'fiduciary_terms', 'data_sharing')),
  recipient_id UUID REFERENCES auth.users(id),
  recipient_email TEXT,
  template_content TEXT NOT NULL,
  signature_status TEXT DEFAULT 'pending' CHECK (signature_status IN ('pending', 'signed', 'declined', 'expired')),
  signed_at TIMESTAMP WITH TIME ZONE,
  signature_data JSONB,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vault_training_materials table for downloadable content
CREATE TABLE IF NOT EXISTS public.vault_training_materials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vault_id UUID NOT NULL,
  material_type TEXT NOT NULL CHECK (material_type IN ('onboarding_slides', 'user_manual', 'training_video', 'quick_guide')),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  download_count INTEGER DEFAULT 0,
  user_group TEXT DEFAULT 'all' CHECK (user_group IN ('all', 'family', 'advisors', 'attorneys', 'owners')),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.vault_agreement_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_training_materials ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vault_agreement_workflows
CREATE POLICY "Users can view agreement workflows for their vaults" ON public.vault_agreement_workflows
FOR SELECT USING (
  recipient_id = auth.uid() OR
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.vault_permissions 
    WHERE vault_id = vault_agreement_workflows.vault_id 
    AND user_id = auth.uid() 
    AND role IN ('owner', 'advisor', 'attorney')
  )
);

CREATE POLICY "Vault owners can create agreement workflows" ON public.vault_agreement_workflows
FOR INSERT WITH CHECK (
  created_by = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.vault_permissions 
    WHERE vault_id = vault_agreement_workflows.vault_id 
    AND user_id = auth.uid() 
    AND role = 'owner'
  )
);

-- RLS Policies for vault_training_materials
CREATE POLICY "Users can view training materials for their vaults" ON public.vault_training_materials
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.vault_permissions 
    WHERE vault_id = vault_training_materials.vault_id 
    AND user_id = auth.uid() 
    AND revoked_at IS NULL
  )
);

CREATE POLICY "Vault owners can manage training materials" ON public.vault_training_materials
FOR ALL USING (
  created_by = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.vault_permissions 
    WHERE vault_id = vault_training_materials.vault_id 
    AND user_id = auth.uid() 
    AND role = 'owner'
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vault_agreement_workflows_vault_id ON public.vault_agreement_workflows(vault_id);
CREATE INDEX IF NOT EXISTS idx_vault_training_materials_vault_id ON public.vault_training_materials(vault_id);