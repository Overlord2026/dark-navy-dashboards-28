-- Create Twilio Voice infrastructure tables

-- Phone numbers provisioned for advisors/firms
CREATE TABLE public.twilio_phone_numbers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL UNIQUE,
  friendly_name TEXT,
  advisor_id UUID,
  tenant_id UUID NOT NULL,
  capabilities JSONB DEFAULT '{"voice": true, "sms": true}',
  status TEXT NOT NULL DEFAULT 'active',
  twilio_sid TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Call logs for all voice activity
CREATE TABLE public.call_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  twilio_call_sid TEXT NOT NULL UNIQUE,
  from_number TEXT NOT NULL,
  to_number TEXT NOT NULL,
  advisor_id UUID,
  client_id UUID,
  tenant_id UUID NOT NULL,
  direction TEXT NOT NULL, -- 'inbound', 'outbound'
  status TEXT NOT NULL, -- 'ringing', 'in-progress', 'completed', 'failed', 'busy', 'no-answer'
  duration_seconds INTEGER,
  recording_url TEXT,
  recording_sid TEXT,
  transcript TEXT,
  call_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Voicemail storage and transcription
CREATE TABLE public.voicemails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  call_log_id UUID REFERENCES public.call_logs(id) ON DELETE CASCADE,
  advisor_id UUID NOT NULL,
  client_phone TEXT NOT NULL,
  recording_url TEXT NOT NULL,
  recording_sid TEXT NOT NULL,
  transcription TEXT,
  transcription_confidence NUMERIC,
  duration_seconds INTEGER,
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'read', 'archived'
  tenant_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Call routing rules per advisor
CREATE TABLE public.call_routing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL,
  twilio_number TEXT NOT NULL,
  forward_to_number TEXT NOT NULL,
  business_hours JSONB DEFAULT '{"start": "09:00", "end": "17:00", "timezone": "America/New_York"}',
  voicemail_enabled BOOLEAN DEFAULT true,
  recording_enabled BOOLEAN DEFAULT false,
  tenant_id UUID NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Phone analytics and billing tracking
CREATE TABLE public.phone_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  advisor_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_calls INTEGER DEFAULT 0,
  inbound_calls INTEGER DEFAULT 0,
  outbound_calls INTEGER DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  missed_calls INTEGER DEFAULT 0,
  voicemails_received INTEGER DEFAULT 0,
  cost_total NUMERIC DEFAULT 0,
  cost_voice NUMERIC DEFAULT 0,
  cost_sms NUMERIC DEFAULT 0,
  cost_recording NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.twilio_phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voicemails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_routing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for twilio_phone_numbers
CREATE POLICY "Advisors can view their phone numbers" 
ON public.twilio_phone_numbers 
FOR SELECT 
USING (advisor_id = auth.uid() OR has_any_role(ARRAY['admin', 'tenant_admin']));

CREATE POLICY "Admins can manage phone numbers" 
ON public.twilio_phone_numbers 
FOR ALL 
USING (has_any_role(ARRAY['admin', 'tenant_admin']) AND tenant_id = get_current_user_tenant_id());

-- RLS Policies for call_logs
CREATE POLICY "Users can view their call logs" 
ON public.call_logs 
FOR SELECT 
USING (advisor_id = auth.uid() OR client_id = auth.uid() OR has_any_role(ARRAY['admin', 'tenant_admin']));

CREATE POLICY "System can insert call logs" 
ON public.call_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Advisors can update their call logs" 
ON public.call_logs 
FOR UPDATE 
USING (advisor_id = auth.uid() OR has_any_role(ARRAY['admin', 'tenant_admin']));

-- RLS Policies for voicemails
CREATE POLICY "Advisors can manage their voicemails" 
ON public.voicemails 
FOR ALL 
USING (advisor_id = auth.uid() OR has_any_role(ARRAY['admin', 'tenant_admin']));

-- RLS Policies for call_routing
CREATE POLICY "Advisors can manage their call routing" 
ON public.call_routing 
FOR ALL 
USING (advisor_id = auth.uid() OR has_any_role(ARRAY['admin', 'tenant_admin']));

-- RLS Policies for phone_analytics
CREATE POLICY "Users can view their phone analytics" 
ON public.phone_analytics 
FOR SELECT 
USING (advisor_id = auth.uid() OR has_any_role(ARRAY['admin', 'tenant_admin']));

CREATE POLICY "System can insert phone analytics" 
ON public.phone_analytics 
FOR INSERT 
WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_call_logs_advisor_id ON public.call_logs(advisor_id);
CREATE INDEX idx_call_logs_client_id ON public.call_logs(client_id);
CREATE INDEX idx_call_logs_created_at ON public.call_logs(created_at);
CREATE INDEX idx_voicemails_advisor_id ON public.voicemails(advisor_id);
CREATE INDEX idx_voicemails_status ON public.voicemails(status);
CREATE INDEX idx_phone_numbers_advisor_id ON public.twilio_phone_numbers(advisor_id);

-- Create triggers for updated_at
CREATE TRIGGER update_twilio_phone_numbers_updated_at
BEFORE UPDATE ON public.twilio_phone_numbers
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_call_logs_updated_at
BEFORE UPDATE ON public.call_logs
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_voicemails_updated_at
BEFORE UPDATE ON public.voicemails
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_call_routing_updated_at
BEFORE UPDATE ON public.call_routing
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();