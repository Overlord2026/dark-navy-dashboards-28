-- Phase 1: Google Centralization & BFO Scheduling Infrastructure

-- Create user integrations table for tracking Google/other platform connections
CREATE TABLE IF NOT EXISTS public.user_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  integration_type TEXT NOT NULL, -- 'google_workspace', 'zoom', 'teams', etc.
  status TEXT NOT NULL DEFAULT 'disconnected', -- 'connected', 'disconnected', 'error'
  connected_at TIMESTAMP WITH TIME ZONE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  access_token_encrypted TEXT, -- Store encrypted tokens
  refresh_token_encrypted TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  scopes TEXT[], -- Array of granted scopes
  auto_sync_enabled BOOLEAN DEFAULT true,
  sync_direction TEXT DEFAULT 'bidirectional', -- 'import', 'export', 'bidirectional'
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create scheduled meetings table for BFO scheduling engine
CREATE TABLE IF NOT EXISTS public.scheduled_meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  advisor_id UUID NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL, -- minutes
  meeting_type TEXT NOT NULL DEFAULT 'google_meet', -- 'google_meet', 'zoom', 'teams'
  meeting_url TEXT,
  google_event_id TEXT, -- Google Calendar event ID
  google_meet_link TEXT, -- Google Meet URL
  zoom_meeting_id TEXT, -- For optional Zoom fallback
  teams_meeting_id TEXT, -- For optional Teams fallback
  drive_recording_id TEXT, -- Google Drive file ID for recordings
  status TEXT NOT NULL DEFAULT 'scheduled', -- 'scheduled', 'confirmed', 'completed', 'cancelled', 'no_show'
  agenda TEXT,
  intake_form_data JSONB DEFAULT '{}',
  reminder_sent_at TIMESTAMP WITH TIME ZONE,
  follow_up_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meeting reminders table for automated notifications
CREATE TABLE IF NOT EXISTS public.meeting_reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID NOT NULL REFERENCES public.scheduled_meetings(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL, -- 'email', 'sms', 'push'
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivery_status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  template_id UUID,
  personalization_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create calendar sync logs table for tracking synchronization
CREATE TABLE IF NOT EXISTS public.calendar_sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  sync_type TEXT NOT NULL, -- 'import', 'export', 'bidirectional'
  sync_direction TEXT NOT NULL, -- 'bfo_to_google', 'google_to_bfo', 'both'
  events_processed INTEGER DEFAULT 0,
  events_created INTEGER DEFAULT 0,
  events_updated INTEGER DEFAULT 0,
  events_deleted INTEGER DEFAULT 0,
  sync_status TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'failed'
  error_message TEXT,
  sync_started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sync_completed_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'
);

-- Create advisor availability table for real-time scheduling
CREATE TABLE IF NOT EXISTS public.advisor_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'America/New_York',
  buffer_time_minutes INTEGER DEFAULT 15, -- Time between meetings
  max_meetings_per_day INTEGER DEFAULT 8,
  booking_advance_days INTEGER DEFAULT 30, -- How far in advance bookings allowed
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create booking workflows table for post-meeting automation
CREATE TABLE IF NOT EXISTS public.booking_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL,
  workflow_name TEXT NOT NULL,
  trigger_event TEXT NOT NULL, -- 'meeting_scheduled', 'meeting_completed', 'no_show'
  workflow_type TEXT NOT NULL, -- 'email', 'sms', 'task_creation', 'crm_update'
  delay_minutes INTEGER DEFAULT 0, -- Delay before executing workflow
  template_id UUID,
  automation_rules JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_workflows ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_integrations
CREATE POLICY "Users can manage their own integrations" 
ON public.user_integrations 
FOR ALL 
USING (user_id = auth.uid());

-- RLS Policies for scheduled_meetings
CREATE POLICY "Advisors can manage their meetings" 
ON public.scheduled_meetings 
FOR ALL 
USING (advisor_id = auth.uid());

CREATE POLICY "Clients can view their scheduled meetings" 
ON public.scheduled_meetings 
FOR SELECT 
USING (client_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- RLS Policies for meeting_reminders
CREATE POLICY "Users can view reminders for their meetings" 
ON public.meeting_reminders 
FOR SELECT 
USING (
  meeting_id IN (
    SELECT id FROM public.scheduled_meetings 
    WHERE advisor_id = auth.uid() 
    OR client_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- RLS Policies for calendar_sync_logs
CREATE POLICY "Users can view their own sync logs" 
ON public.calendar_sync_logs 
FOR SELECT 
USING (user_id = auth.uid());

-- RLS Policies for advisor_availability
CREATE POLICY "Advisors can manage their availability" 
ON public.advisor_availability 
FOR ALL 
USING (advisor_id = auth.uid());

CREATE POLICY "Anyone can view advisor availability for booking" 
ON public.advisor_availability 
FOR SELECT 
USING (is_active = true);

-- RLS Policies for booking_workflows
CREATE POLICY "Advisors can manage their booking workflows" 
ON public.booking_workflows 
FOR ALL 
USING (advisor_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_user_integrations_user_type ON public.user_integrations(user_id, integration_type);
CREATE INDEX idx_scheduled_meetings_advisor_date ON public.scheduled_meetings(advisor_id, scheduled_at);
CREATE INDEX idx_scheduled_meetings_status ON public.scheduled_meetings(status);
CREATE INDEX idx_meeting_reminders_scheduled ON public.meeting_reminders(scheduled_for) WHERE sent_at IS NULL;
CREATE INDEX idx_advisor_availability_advisor_day ON public.advisor_availability(advisor_id, day_of_week, is_active);

-- Create update triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_integrations_updated_at
  BEFORE UPDATE ON public.user_integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_scheduled_meetings_updated_at
  BEFORE UPDATE ON public.scheduled_meetings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_advisor_availability_updated_at
  BEFORE UPDATE ON public.advisor_availability
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_booking_workflows_updated_at
  BEFORE UPDATE ON public.booking_workflows
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();