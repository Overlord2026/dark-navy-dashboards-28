-- Create onboarding-related tables for Premium Onboarding Workflow

-- Client invitations table
CREATE TABLE IF NOT EXISTS public.client_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  onboarding_template TEXT,
  fee_structure TEXT,
  premium_modules TEXT[],
  custom_message TEXT,
  status TEXT DEFAULT 'pending',
  invite_link TEXT UNIQUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Onboarding sessions table
CREATE TABLE IF NOT EXISTS public.onboarding_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id UUID REFERENCES public.client_invitations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  current_step TEXT DEFAULT 'welcome',
  completed_steps TEXT[] DEFAULT '{}',
  session_data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'in_progress',
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Onboarding step completions table  
CREATE TABLE IF NOT EXISTS public.onboarding_step_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.onboarding_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('client', 'advisor')),
  step_name TEXT NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_completed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Onboarding documents table
CREATE TABLE IF NOT EXISTS public.onboarding_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.onboarding_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  document_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'uploaded',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RIA onboarding configurations table
CREATE TABLE IF NOT EXISTS public.ria_onboarding_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL UNIQUE,
  firm_name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#1a365d',
  secondary_color TEXT DEFAULT '#2d3748',
  welcome_video_url TEXT,
  welcome_message TEXT,
  required_steps TEXT[] DEFAULT ARRAY['personal_info', 'risk_profile', 'documents', 'agreements'],
  optional_steps TEXT[] DEFAULT '{}',
  payment_required BOOLEAN DEFAULT false,
  payment_amount DECIMAL(10,2),
  payment_frequency TEXT DEFAULT 'one_time',
  custom_agreements TEXT[],
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.client_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_step_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ria_onboarding_configs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for client_invitations
CREATE POLICY "Advisors can manage their own invitations" ON public.client_invitations
  FOR ALL USING (advisor_id = auth.uid() OR tenant_id = get_current_user_tenant_id());

CREATE POLICY "Clients can view invitations sent to them" ON public.client_invitations
  FOR SELECT USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- RLS Policies for onboarding_sessions
CREATE POLICY "Users can manage their own onboarding sessions" ON public.onboarding_sessions
  FOR ALL USING (user_id = auth.uid() OR tenant_id = get_current_user_tenant_id());

-- RLS Policies for onboarding_step_completions
CREATE POLICY "Users can manage their step completions" ON public.onboarding_step_completions
  FOR ALL USING (user_id = auth.uid() OR tenant_id = get_current_user_tenant_id());

-- RLS Policies for onboarding_documents
CREATE POLICY "Users can manage their onboarding documents" ON public.onboarding_documents
  FOR ALL USING (user_id = auth.uid() OR tenant_id = get_current_user_tenant_id());

-- RLS Policies for ria_onboarding_configs
CREATE POLICY "Tenant admins can manage their onboarding config" ON public.ria_onboarding_configs
  FOR ALL USING (tenant_id = get_current_user_tenant_id() AND has_any_role(ARRAY['admin', 'tenant_admin']));

CREATE POLICY "Users can view their tenant's onboarding config" ON public.ria_onboarding_configs
  FOR SELECT USING (tenant_id = get_current_user_tenant_id());

-- Create storage bucket for onboarding documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('onboarding-docs', 'onboarding-docs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for onboarding documents
CREATE POLICY "Users can upload their onboarding documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'onboarding-docs' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their onboarding documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'onboarding-docs' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Advisors can view client onboarding documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'onboarding-docs' AND 
    EXISTS (
      SELECT 1 FROM public.onboarding_sessions os
      JOIN public.client_invitations ci ON os.invitation_id = ci.id
      WHERE ci.advisor_id = auth.uid()
      AND (storage.foldername(name))[1] = os.user_id::text
    )
  );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_client_invitations_advisor_id ON public.client_invitations(advisor_id);
CREATE INDEX IF NOT EXISTS idx_client_invitations_email ON public.client_invitations(email);
CREATE INDEX IF NOT EXISTS idx_client_invitations_status ON public.client_invitations(status);
CREATE INDEX IF NOT EXISTS idx_onboarding_sessions_user_id ON public.onboarding_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_sessions_status ON public.onboarding_sessions(status);
CREATE INDEX IF NOT EXISTS idx_onboarding_step_completions_session_id ON public.onboarding_step_completions(session_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_documents_session_id ON public.onboarding_documents(session_id);