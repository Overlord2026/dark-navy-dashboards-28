-- Step 3: Create missing support tables identified in recon

-- Insurance submissions table (referenced in ratingStub.ts)
CREATE TABLE IF NOT EXISTS public.insurance_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  submission_type TEXT NOT NULL CHECK (submission_type IN ('home', 'auto', 'life', 'commercial')),
  risk_hash TEXT NOT NULL,
  applicant_data JSONB NOT NULL,
  property_data JSONB,
  vehicle_data JSONB,
  coverage_selections JSONB NOT NULL,
  submission_status TEXT NOT NULL DEFAULT 'draft' CHECK (submission_status IN ('draft', 'submitted', 'quoted', 'bound', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insurance claims table
CREATE TABLE IF NOT EXISTS public.insurance_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  policy_id TEXT NOT NULL,
  claim_number TEXT UNIQUE NOT NULL,
  claim_type TEXT NOT NULL CHECK (claim_type IN ('auto', 'home', 'liability', 'comprehensive', 'collision')),
  loss_date DATE NOT NULL,
  report_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  claim_status TEXT NOT NULL DEFAULT 'reported' CHECK (claim_status IN ('reported', 'under_review', 'approved', 'denied', 'closed')),
  loss_description TEXT,
  estimated_damage_amount DECIMAL(12,2),
  claim_amount DECIMAL(12,2),
  deductible_amount DECIMAL(12,2),
  adjuster_notes JSONB,
  documents JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Weather alerts table (referenced in weatherAlerts.ts)
CREATE TABLE IF NOT EXISTS public.weather_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('severe_weather', 'hurricane', 'tornado', 'flood', 'fire', 'earthquake')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'moderate', 'high', 'extreme')),
  location_zip TEXT NOT NULL,
  location_state TEXT NOT NULL,
  alert_title TEXT NOT NULL,
  alert_description TEXT,
  weather_data JSONB,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  properties_affected UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Meeting notes table (needed for voice assistant)
CREATE TABLE IF NOT EXISTS public.meeting_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID,
  meeting_title TEXT NOT NULL,
  meeting_date TIMESTAMP WITH TIME ZONE,
  transcript TEXT,
  summary TEXT,
  action_items JSONB DEFAULT '[]'::jsonb,
  attendees JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT '{}',
  is_private BOOLEAN DEFAULT false,
  voice_recording_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.insurance_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for insurance_submissions
CREATE POLICY "Users can view their own insurance submissions"
ON public.insurance_submissions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own insurance submissions"
ON public.insurance_submissions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own insurance submissions"
ON public.insurance_submissions FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for insurance_claims
CREATE POLICY "Users can view their own insurance claims"
ON public.insurance_claims FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own insurance claims"
ON public.insurance_claims FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own insurance claims"
ON public.insurance_claims FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for weather_alerts
CREATE POLICY "Users can view their own weather alerts"
ON public.weather_alerts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weather alerts"
ON public.weather_alerts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weather alerts"
ON public.weather_alerts FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for meeting_notes
CREATE POLICY "Users can view their own meeting notes"
ON public.meeting_notes FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meeting notes"
ON public.meeting_notes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meeting notes"
ON public.meeting_notes FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meeting notes"
ON public.meeting_notes FOR DELETE
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_insurance_submissions_user_id ON public.insurance_submissions(user_id);
CREATE INDEX idx_insurance_submissions_status ON public.insurance_submissions(submission_status);
CREATE INDEX idx_insurance_claims_user_id ON public.insurance_claims(user_id);
CREATE INDEX idx_insurance_claims_status ON public.insurance_claims(claim_status);
CREATE INDEX idx_weather_alerts_user_id ON public.weather_alerts(user_id);
CREATE INDEX idx_weather_alerts_location ON public.weather_alerts(location_zip, location_state);
CREATE INDEX idx_weather_alerts_active ON public.weather_alerts(is_active) WHERE is_active = true;
CREATE INDEX idx_meeting_notes_user_id ON public.meeting_notes(user_id);
CREATE INDEX idx_meeting_notes_date ON public.meeting_notes(meeting_date);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_insurance_submissions_updated_at
  BEFORE UPDATE ON public.insurance_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_insurance_claims_updated_at
  BEFORE UPDATE ON public.insurance_claims
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_weather_alerts_updated_at
  BEFORE UPDATE ON public.weather_alerts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meeting_notes_updated_at
  BEFORE UPDATE ON public.meeting_notes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();