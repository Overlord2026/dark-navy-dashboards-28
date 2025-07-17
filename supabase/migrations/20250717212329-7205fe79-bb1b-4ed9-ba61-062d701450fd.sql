-- Add marketing fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS utm_source text,
ADD COLUMN IF NOT EXISTS utm_medium text,
ADD COLUMN IF NOT EXISTS utm_campaign text,
ADD COLUMN IF NOT EXISTS ghl_contact_id text,
ADD COLUMN IF NOT EXISTS lead_stage text DEFAULT 'prospect',
ADD COLUMN IF NOT EXISTS advisor_id uuid,
ADD COLUMN IF NOT EXISTS email_opt_in boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS sms_opt_in boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS last_login_at timestamptz,
ADD COLUMN IF NOT EXISTS last_active_at timestamptz;

-- Create user events table
CREATE TABLE IF NOT EXISTS public.user_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  event_data jsonb,
  created_at timestamptz DEFAULT now(),
  utm_data jsonb,
  ghl_synced boolean DEFAULT false
);

-- Enable RLS on user_events
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_events
CREATE POLICY "Users can view their own events" 
ON public.user_events FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own events" 
ON public.user_events FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create advisor assignments table
CREATE TABLE IF NOT EXISTS public.advisor_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id uuid NOT NULL,
  client_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  status text DEFAULT 'active',
  notes text
);

-- Enable RLS on advisor_assignments
ALTER TABLE public.advisor_assignments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for advisor_assignments
CREATE POLICY "Users can view their own assignments" 
ON public.advisor_assignments FOR SELECT 
USING (auth.uid() = client_id OR auth.uid() = advisor_id);

CREATE POLICY "Only advisors can create assignments" 
ON public.advisor_assignments FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles
  WHERE id = auth.uid() 
  AND role = 'advisor'
));

CREATE POLICY "Only advisors can update assignments" 
ON public.advisor_assignments FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE id = auth.uid() 
  AND role = 'advisor'
));

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON public.user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_advisor_assignments_client_id ON public.advisor_assignments(client_id);
CREATE INDEX IF NOT EXISTS idx_advisor_assignments_advisor_id ON public.advisor_assignments(advisor_id);