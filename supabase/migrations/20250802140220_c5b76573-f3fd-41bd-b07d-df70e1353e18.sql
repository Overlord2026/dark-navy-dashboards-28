-- Add coach role to the system
-- First, add coach-specific fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN coaching_firm TEXT,
ADD COLUMN coaching_specialties TEXT[],
ADD COLUMN coaching_certifications TEXT[];

-- Create coach-advisor relationships table
CREATE TABLE public.coach_advisor_relationships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  advisor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL DEFAULT 'coaching', -- coaching, mentoring, consulting
  status TEXT NOT NULL DEFAULT 'active', -- active, inactive, completed
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(coach_id, advisor_id)
);

-- Enable RLS on coach-advisor relationships
ALTER TABLE public.coach_advisor_relationships ENABLE ROW LEVEL SECURITY;

-- Create policies for coach-advisor relationships
CREATE POLICY "Coaches can manage their advisor relationships" 
ON public.coach_advisor_relationships 
FOR ALL 
USING (coach_id = auth.uid());

CREATE POLICY "Advisors can view their coach relationships" 
ON public.coach_advisor_relationships 
FOR SELECT 
USING (advisor_id = auth.uid());

-- Create coach invitations table
CREATE TABLE public.coach_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  advisor_name TEXT,
  invitation_token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, expired
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '7 days'),
  coaching_program TEXT,
  message TEXT,
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Enable RLS on coach invitations
ALTER TABLE public.coach_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for coach invitations
CREATE POLICY "Coaches can manage their invitations" 
ON public.coach_invitations 
FOR ALL 
USING (coach_id = auth.uid());

-- Create coach progress tracking table
CREATE TABLE public.coach_progress_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  advisor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL, -- client_acquisition, revenue_growth, activity_completion, etc.
  metric_value NUMERIC NOT NULL,
  target_value NUMERIC,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on coach progress tracking
ALTER TABLE public.coach_progress_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for coach progress tracking
CREATE POLICY "Coaches can track progress for their advisors" 
ON public.coach_progress_tracking 
FOR ALL 
USING (coach_id = auth.uid());

CREATE POLICY "Advisors can view their progress tracking" 
ON public.coach_progress_tracking 
FOR SELECT 
USING (advisor_id = auth.uid());

-- Create coaching curriculum modules table
CREATE TABLE public.coaching_curriculum (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coach_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_name TEXT NOT NULL,
  module_description TEXT,
  content_type TEXT NOT NULL DEFAULT 'lesson', -- lesson, exercise, assessment, resource
  content_data JSONB NOT NULL DEFAULT '{}',
  prerequisites TEXT[],
  estimated_duration_minutes INTEGER,
  is_published BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on coaching curriculum
ALTER TABLE public.coaching_curriculum ENABLE ROW LEVEL SECURITY;

-- Create policies for coaching curriculum
CREATE POLICY "Coaches can manage their curriculum" 
ON public.coaching_curriculum 
FOR ALL 
USING (coach_id = auth.uid());

CREATE POLICY "Advisors can view published curriculum from their coaches" 
ON public.coaching_curriculum 
FOR SELECT 
USING (
  is_published = true 
  AND coach_id IN (
    SELECT coach_id 
    FROM public.coach_advisor_relationships 
    WHERE advisor_id = auth.uid() 
    AND status = 'active'
  )
);

-- Create function to generate invitation tokens
CREATE OR REPLACE FUNCTION public.generate_coach_invitation_token()
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
    SELECT EXISTS(SELECT 1 FROM public.coach_invitations WHERE invitation_token = token) INTO exists_check;
    
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN token;
END;
$$;

-- Create function to check if user has coach access to advisor
CREATE OR REPLACE FUNCTION public.has_coach_access_to_advisor(p_coach_id UUID, p_advisor_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.coach_advisor_relationships 
    WHERE coach_id = p_coach_id 
    AND advisor_id = p_advisor_id 
    AND status = 'active'
  );
$$;

-- Update triggers for timestamps
CREATE TRIGGER update_coach_advisor_relationships_updated_at
  BEFORE UPDATE ON public.coach_advisor_relationships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_coach_progress_tracking_updated_at
  BEFORE UPDATE ON public.coach_progress_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_coaching_curriculum_updated_at
  BEFORE UPDATE ON public.coaching_curriculum
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();