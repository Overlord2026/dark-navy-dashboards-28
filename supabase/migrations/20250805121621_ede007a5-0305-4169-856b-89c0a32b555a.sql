-- Create email sequences table
CREATE TABLE IF NOT EXISTS public.email_sequences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  persona TEXT NOT NULL,
  sequence_type TEXT NOT NULL,
  subject_template TEXT NOT NULL,
  content_template TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(persona, sequence_type)
);

-- Create onboarding email log table
CREATE TABLE IF NOT EXISTS public.onboarding_email_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  persona TEXT NOT NULL,
  sequence_type TEXT NOT NULL,
  email_sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  email_id TEXT,
  status TEXT NOT NULL DEFAULT 'sent',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email schedule table for automated sequences
CREATE TABLE IF NOT EXISTS public.email_schedule (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  persona TEXT NOT NULL,
  sequence_type TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  is_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create FAQ analytics table
CREATE TABLE IF NOT EXISTS public.faq_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_persona TEXT NOT NULL,
  event_type TEXT NOT NULL,
  search_query TEXT,
  faq_id TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_email_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for email_sequences
CREATE POLICY "Admins can manage email sequences"
ON public.email_sequences
FOR ALL
USING (has_any_role(ARRAY['admin'::text, 'system_administrator'::text, 'tenant_admin'::text]));

-- RLS Policies for onboarding_email_log
CREATE POLICY "Users can view their own email logs"
ON public.onboarding_email_log
FOR SELECT
USING (user_id = auth.uid() OR has_any_role(ARRAY['admin'::text, 'system_administrator'::text]));

CREATE POLICY "System can insert email logs"
ON public.onboarding_email_log
FOR INSERT
WITH CHECK (true);

-- RLS Policies for email_schedule
CREATE POLICY "Users can view their own email schedule"
ON public.email_schedule
FOR SELECT
USING (user_id = auth.uid() OR has_any_role(ARRAY['admin'::text, 'system_administrator'::text]));

CREATE POLICY "System can manage email schedule"
ON public.email_schedule
FOR ALL
USING (true);

-- RLS Policies for faq_analytics
CREATE POLICY "System can insert FAQ analytics"
ON public.faq_analytics
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view FAQ analytics"
ON public.faq_analytics
FOR SELECT
USING (has_any_role(ARRAY['admin'::text, 'system_administrator'::text]));

-- Insert default email sequences for each persona
INSERT INTO public.email_sequences (persona, sequence_type, subject_template, content_template) VALUES
('advisor', 'welcome', '🚀 Welcome to the Future of Family Office Advisory', 
'<h2>Welcome to the Elite Advisory Network, {{userName}}!</h2>
<p>You''re now part of an exclusive community of top-tier advisors revolutionizing family office services.</p>
{{#if vipStatus}}
<div style="background: linear-gradient(135deg, #ffd700, #ffed4a); padding: 20px; border-radius: 8px; margin: 20px 0;">
<h3>🌟 VIP Early Adopter Status</h3>
<p>You have exclusive access to premium features and direct founder support.</p>
</div>
{{/if}}
<h3>🎯 What to do next:</h3>
<ul>
<li>Complete your advisor profile to attract high-net-worth clients</li>
<li>Explore our AI-powered client matching system</li>
<li>Access exclusive market research and compliance tools</li>
</ul>'),

('cpa', 'welcome', '🧮 Welcome to Next-Gen CPA Practice Management',
'<h2>Welcome to the CPA Elite Network, {{userName}}!</h2>
<p>Transform your practice with cutting-edge family office integration tools.</p>
{{#if vipStatus}}
<div style="background: linear-gradient(135deg, #ffd700, #ffed4a); padding: 20px; border-radius: 8px; margin: 20px 0;">
<h3>🌟 VIP Early Adopter Status</h3>
<p>Exclusive access to advanced compliance tools and priority support.</p>
</div>
{{/if}}
<h3>🎯 Start Here:</h3>
<ul>
<li>Set up automated client onboarding workflows</li>
<li>Access real-time compliance monitoring</li>
<li>Connect with family office advisory partners</li>
</ul>'),

('attorney', 'welcome', '⚖️ Welcome to Elite Estate Planning Network',
'<h2>Welcome to the Legal Excellence Hub, {{userName}}!</h2>
<p>Join the premier network for estate planning and family office legal services.</p>
{{#if vipStatus}}
<div style="background: linear-gradient(135deg, #ffd700, #ffed4a); padding: 20px; border-radius: 8px; margin: 20px 0;">
<h3>🌟 VIP Early Adopter Status</h3>
<p>Priority access to high-value referrals and exclusive legal resources.</p>
</div>
{{/if}}
<h3>🎯 Next Steps:</h3>
<ul>
<li>Complete your legal specialization profile</li>
<li>Access our document automation library</li>
<li>Connect with family office teams needing legal expertise</li>
</ul>');

-- Add trigger for updated_at
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