-- Core ADV and Compliance Filings Tables
CREATE TABLE IF NOT EXISTS public.ria_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  firm_name TEXT NOT NULL,
  crd_number TEXT,
  state_registrations TEXT[],
  aum_range TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.compliance_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  officer_name TEXT NOT NULL,
  license_number TEXT,
  jurisdiction TEXT[],
  specializations TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.ria_filings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ria_id UUID NOT NULL REFERENCES ria_profiles(id) ON DELETE CASCADE,
  filing_type TEXT NOT NULL CHECK (filing_type IN ('ADV Part 1', 'ADV Part 2', 'Form U4', 'IAR Renewal', 'CE Reporting')),
  filing_status TEXT NOT NULL DEFAULT 'draft' CHECK (filing_status IN ('draft', 'pending', 'submitted', 'approved', 'rejected', 'reminder_sent')),
  due_date DATE NOT NULL,
  submission_date DATE,
  reviewer_id UUID REFERENCES compliance_profiles(id),
  review_notes TEXT,
  document_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Compliance Officer Table for Audit & Oversight
CREATE TABLE IF NOT EXISTS public.compliance_officer_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  officer_id UUID NOT NULL REFERENCES compliance_profiles(id) ON DELETE CASCADE,
  filing_id UUID NOT NULL REFERENCES ria_filings(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  action_notes TEXT,
  action_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Event/Notification Table for Deadlines & Reminders
CREATE TABLE IF NOT EXISTS public.compliance_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ria_id UUID REFERENCES ria_profiles(id) ON DELETE CASCADE,
  filing_id UUID REFERENCES ria_filings(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_status TEXT NOT NULL,
  trigger_date TIMESTAMP WITH TIME ZONE,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.ria_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ria_filings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_officer_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for RIA Profiles
CREATE POLICY "Users can manage their own RIA profile" ON public.ria_profiles
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for Compliance Profiles  
CREATE POLICY "Users can manage their own compliance profile" ON public.compliance_profiles
  FOR ALL USING (user_id = auth.uid());

-- RLS Policies for RIA Filings
CREATE POLICY "RIAs can manage their own filings" ON public.ria_filings
  FOR ALL USING (ria_id IN (SELECT id FROM ria_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Compliance officers can view assigned filings" ON public.ria_filings
  FOR SELECT USING (reviewer_id IN (SELECT id FROM compliance_profiles WHERE user_id = auth.uid()));

-- RLS Policies for Compliance Officer Actions
CREATE POLICY "Compliance officers can manage their own actions" ON public.compliance_officer_actions
  FOR ALL USING (officer_id IN (SELECT id FROM compliance_profiles WHERE user_id = auth.uid()));

-- RLS Policies for Compliance Events
CREATE POLICY "RIAs can view their own compliance events" ON public.compliance_events
  FOR SELECT USING (ria_id IN (SELECT id FROM ria_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Compliance officers can manage compliance events" ON public.compliance_events
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM compliance_profiles));

-- Create storage bucket for compliance filings
INSERT INTO storage.buckets (id, name, public) 
VALUES ('compliance-filings', 'compliance-filings', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for compliance filings
CREATE POLICY "RIAs can upload their filing documents" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'compliance-filings' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "RIAs can view their filing documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'compliance-filings' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Compliance officers can view all filing documents" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'compliance-filings' AND 
    auth.uid() IN (SELECT user_id FROM compliance_profiles)
  );