-- Email Automation System Tables
-- Create email sequences table
CREATE TABLE IF NOT EXISTS public.email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona TEXT NOT NULL,
  sequence_type TEXT NOT NULL,
  subject_template TEXT NOT NULL,
  content_template TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email sequence enrollments table
CREATE TABLE IF NOT EXISTS public.email_sequence_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES public.email_sequences(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  persona_group TEXT,
  current_step INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_email_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create email sequence steps table  
CREATE TABLE IF NOT EXISTS public.email_sequence_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES public.email_sequences(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  delay_hours INTEGER NOT NULL DEFAULT 0,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create email sequence deliveries table
CREATE TABLE IF NOT EXISTS public.email_sequence_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES public.email_sequence_enrollments(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES public.email_sequence_steps(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  sent_at TIMESTAMP WITH TIME ZONE,
  failed_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create email automation logs table
CREATE TABLE IF NOT EXISTS public.email_automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  persona TEXT NOT NULL,
  sequence_type TEXT NOT NULL,
  action TEXT NOT NULL,
  status TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  email_sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequence_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequence_steps ENABLE ROW LEVEL SECURITY;  
ALTER TABLE public.email_sequence_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_automation_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_sequences (admin/service role only)
CREATE POLICY "Service role can manage email sequences"
  ON public.email_sequences FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can view email sequences"
  ON public.email_sequences FOR SELECT
  USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies for email_sequence_enrollments  
CREATE POLICY "Users can view their own enrollments"
  ON public.email_sequence_enrollments FOR SELECT
  USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Service role can manage enrollments"
  ON public.email_sequence_enrollments FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for email_sequence_steps
CREATE POLICY "Service role can manage sequence steps"
  ON public.email_sequence_steps FOR ALL
  TO service_role  
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can view active sequence steps"
  ON public.email_sequence_steps FOR SELECT
  USING (is_active = true);

-- RLS Policies for email_sequence_deliveries
CREATE POLICY "Service role can manage deliveries"
  ON public.email_sequence_deliveries FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- RLS Policies for email_automation_logs
CREATE POLICY "Users can view their own email logs"
  ON public.email_automation_logs FOR SELECT
  USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "Service role can manage email logs"
  ON public.email_automation_logs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_sequences_persona ON public.email_sequences(persona);
CREATE INDEX IF NOT EXISTS idx_email_sequences_active ON public.email_sequences(is_active);
CREATE INDEX IF NOT EXISTS idx_email_enrollments_user ON public.email_sequence_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_email_enrollments_email ON public.email_sequence_enrollments(email);
CREATE INDEX IF NOT EXISTS idx_email_enrollments_status ON public.email_sequence_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_email_deliveries_scheduled ON public.email_sequence_deliveries(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_email_deliveries_status ON public.email_sequence_deliveries(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_user ON public.email_automation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email ON public.email_automation_logs(email);

-- Insert default email sequences
INSERT INTO public.email_sequences (persona, sequence_type, subject_template, content_template) VALUES
('advisor', 'welcome', '🚀 Welcome to the Future of Family Office Advisory', 
 '<h2>Welcome {{userName}}!</h2><p>Elite Advisory Network awaits. Your exclusive dashboard is ready: <a href="{{dashboard_url}}">Access Dashboard</a></p><p>Best regards,<br/>The BFO Team</p>'),
('advisor', 'day2', '⚡ Quick Win: Close More Clients Without More Hours', 
 '<h2>Hi {{userName}},</h2><p>Here''s a simple strategy that doubled conversion rates for advisors like you: <a href="{{strategy_url}}">View Strategy</a></p><p>Implement this today for immediate results.</p>'),
('cpa', 'welcome', '🎯 Your CPA Practice Growth Engine is Ready',
 '<h2>Welcome to BFO {{userName}}!</h2><p>Your tax practice automation suite is ready: <a href="{{dashboard_url}}">Access Tools</a></p><p>Start automating client workflows today.</p>'),
('attorney', 'welcome', '⚖️ Estate Planning Automation at Your Fingertips',
 '<h2>Welcome {{userName}}!</h2><p>Transform your estate practice with automated workflows: <a href="{{dashboard_url}}">Get Started</a></p><p>Streamline document generation and client communications.</p>')
ON CONFLICT DO NOTHING;

-- Create trigger to auto-update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_email_sequences_updated_at
  BEFORE UPDATE ON public.email_sequences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_enrollments_updated_at  
  BEFORE UPDATE ON public.email_sequence_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();