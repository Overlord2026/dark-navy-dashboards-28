-- Create lead magnets table
CREATE TABLE public.lead_magnets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  target_persona professional_persona NOT NULL,
  download_url TEXT,
  form_fields JSONB DEFAULT '[]'::JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lead magnet submissions table
CREATE TABLE public.lead_magnet_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_magnet_id UUID NOT NULL REFERENCES public.lead_magnets(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  company_name TEXT,
  firm_size TEXT,
  form_data JSONB DEFAULT '{}'::JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'account_created')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email sequences table
CREATE TABLE public.email_sequences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  lead_magnet_id UUID REFERENCES public.lead_magnets(id) ON DELETE CASCADE,
  target_persona professional_persona NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create email sequence steps table
CREATE TABLE public.email_sequence_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID NOT NULL REFERENCES public.email_sequences(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  delay_days INTEGER DEFAULT 0,
  delay_hours INTEGER DEFAULT 0,
  template_variables JSONB DEFAULT '{}'::JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(sequence_id, step_number)
);

-- Create email sequence enrollments table  
CREATE TABLE public.email_sequence_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sequence_id UUID NOT NULL REFERENCES public.email_sequences(id) ON DELETE CASCADE,
  submission_id UUID NOT NULL REFERENCES public.lead_magnet_submissions(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  current_step INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'unsubscribed')),
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_email_sent_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(sequence_id, submission_id)
);

-- Create email sequence deliveries table
CREATE TABLE public.email_sequence_deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id UUID NOT NULL REFERENCES public.email_sequence_enrollments(id) ON DELETE CASCADE,
  step_id UUID NOT NULL REFERENCES public.email_sequence_steps(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'bounced', 'opened', 'clicked')),
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  failed_reason TEXT,
  external_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.lead_magnets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_magnet_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequence_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequence_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequence_deliveries ENABLE ROW LEVEL SECURITY;

-- Create policies for lead_magnets (public read for active ones)
CREATE POLICY "Lead magnets are publicly viewable when active" 
ON public.lead_magnets 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can manage lead magnets" 
ON public.lead_magnets 
FOR ALL 
USING (public.has_any_role(ARRAY['admin', 'system_administrator']));

-- Create policies for lead_magnet_submissions (users can create, admins can read all)
CREATE POLICY "Anyone can submit to lead magnets" 
ON public.lead_magnet_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own submissions" 
ON public.lead_magnet_submissions 
FOR SELECT 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can view all submissions" 
ON public.lead_magnet_submissions 
FOR SELECT 
USING (public.has_any_role(ARRAY['admin', 'system_administrator']));

-- Create policies for email sequences (public read for active ones)
CREATE POLICY "Active email sequences are publicly viewable" 
ON public.email_sequences 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Only admins can manage email sequences" 
ON public.email_sequences 
FOR ALL 
USING (public.has_any_role(ARRAY['admin', 'system_administrator']));

-- Create policies for email sequence steps (public read for active sequences)
CREATE POLICY "Email sequence steps are publicly viewable for active sequences" 
ON public.email_sequence_steps 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.email_sequences 
    WHERE id = sequence_id AND is_active = true
  )
);

CREATE POLICY "Only admins can manage email sequence steps" 
ON public.email_sequence_steps 
FOR ALL 
USING (public.has_any_role(ARRAY['admin', 'system_administrator']));

-- Create policies for enrollments (users can view their own)
CREATE POLICY "Users can view their own enrollments" 
ON public.email_sequence_enrollments 
FOR SELECT 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "System can create enrollments" 
ON public.email_sequence_enrollments 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "System can update enrollments" 
ON public.email_sequence_enrollments 
FOR UPDATE 
USING (true);

CREATE POLICY "Admins can view all enrollments" 
ON public.email_sequence_enrollments 
FOR SELECT 
USING (public.has_any_role(ARRAY['admin', 'system_administrator']));

-- Create policies for deliveries (users can view their own)
CREATE POLICY "Users can view their own email deliveries" 
ON public.email_sequence_deliveries 
FOR SELECT 
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "System can manage email deliveries" 
ON public.email_sequence_deliveries 
FOR ALL 
USING (true);

CREATE POLICY "Admins can view all email deliveries" 
ON public.email_sequence_deliveries 
FOR SELECT 
USING (public.has_any_role(ARRAY['admin', 'system_administrator']));

-- Create indexes for performance
CREATE INDEX idx_lead_magnet_submissions_email ON public.lead_magnet_submissions(email);
CREATE INDEX idx_lead_magnet_submissions_status ON public.lead_magnet_submissions(status);
CREATE INDEX idx_email_sequence_enrollments_email ON public.email_sequence_enrollments(email);
CREATE INDEX idx_email_sequence_enrollments_status ON public.email_sequence_enrollments(status);
CREATE INDEX idx_email_sequence_deliveries_scheduled ON public.email_sequence_deliveries(scheduled_for);
CREATE INDEX idx_email_sequence_deliveries_status ON public.email_sequence_deliveries(status);

-- Create triggers for updating timestamps
CREATE TRIGGER update_lead_magnets_updated_at
  BEFORE UPDATE ON public.lead_magnets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_lead_magnet_submissions_updated_at
  BEFORE UPDATE ON public.lead_magnet_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_email_sequences_updated_at
  BEFORE UPDATE ON public.email_sequences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_email_sequence_steps_updated_at
  BEFORE UPDATE ON public.email_sequence_steps
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_email_sequence_enrollments_updated_at
  BEFORE UPDATE ON public.email_sequence_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

CREATE TRIGGER update_email_sequence_deliveries_updated_at
  BEFORE UPDATE ON public.email_sequence_deliveries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_modified_column();

-- Insert the CPA Growth Blueprint lead magnet
INSERT INTO public.lead_magnets (title, slug, description, target_persona, download_url, form_fields) VALUES (
  'The High-Value CPA Growth Blueprint',
  'cpa-growth-blueprint',
  'Get the Proven Framework to Grow Your Tax & Accounting Practice',
  'cpa',
  '/downloads/cpa-growth-blueprint.pdf',
  '[
    {"name": "name", "label": "Full Name", "type": "text", "required": true},
    {"name": "email", "label": "Email Address", "type": "email", "required": true},
    {"name": "phone", "label": "Phone Number", "type": "tel", "required": false},
    {"name": "firm_size", "label": "Firm Size", "type": "select", "required": true, "options": [
      {"value": "solo", "label": "Solo Practitioner"},
      {"value": "2-5", "label": "2-5 Partners"},
      {"value": "6-15", "label": "6-15 Partners"},
      {"value": "16-50", "label": "16-50 Partners"},
      {"value": "50+", "label": "50+ Partners"}
    ]}
  ]'::JSONB
);

-- Insert the CPA email sequence
INSERT INTO public.email_sequences (name, lead_magnet_id, target_persona) 
SELECT 
  'CPA Growth Blueprint Nurture Sequence',
  id,
  'cpa'
FROM public.lead_magnets 
WHERE slug = 'cpa-growth-blueprint';

-- Insert email sequence steps
INSERT INTO public.email_sequence_steps (sequence_id, step_number, subject, content, delay_days, delay_hours)
SELECT 
  es.id,
  1,
  'Your CPA Growth Blueprint is Ready!',
  'Hi {{name}},

Thank you for downloading "The High-Value CPA Growth Blueprint"! 

Your blueprint is attached to this email, and I''ve also created a complimentary BFO CPA account for you so you can start exploring our tools right away.

Inside the blueprint, you''ll discover:
• Proven tax planning strategies that increase client value
• Automation techniques that save 10+ hours per week  
• Client retention systems used by top-performing CPAs
• Scalable processes for growing your practice

Plus, your new CPA account gives you immediate access to:
• Client organizer templates
• Secure document sharing portal
• Basic CRM tools
• Tax planning calculators

Ready to explore? Click here to access your CPA tools: {{dashboard_url}}

Best regards,
The BFO Team

P.S. Keep an eye out for my next email - I''ll be sharing a real case study of how one CPA increased their revenue by 45% using these exact strategies.',
  0,
  0
FROM public.email_sequences es
JOIN public.lead_magnets lm ON es.lead_magnet_id = lm.id
WHERE lm.slug = 'cpa-growth-blueprint';

INSERT INTO public.email_sequence_steps (sequence_id, step_number, subject, content, delay_days, delay_hours)
SELECT 
  es.id,
  2,
  'Case Study: How Sarah Grew Her CPA Practice by 45%',
  'Hi {{name}},

I wanted to share an inspiring success story with you.

Meet Sarah, a solo CPA who was struggling with client retention and working 70+ hour weeks during tax season.

Here''s what she did using the strategies from your Growth Blueprint:

✅ Implemented automated client onboarding (saved 15 hours/week)
✅ Created tiered service packages with tax planning (increased average client value by $2,400)
✅ Set up proactive communication systems (improved retention by 28%)

The results? In just 12 months:
• 45% revenue increase
• Reduced work hours by 25+ hours/week
• 95% client satisfaction rating
• Waitlist of prospects wanting to work with her

The best part? Sarah says the BFO platform made it all possible by automating the tedious work so she could focus on high-value advisory services.

Want to see how these tools work? Your CPA account is ready: {{dashboard_url}}

Tomorrow, I''ll send you a behind-the-scenes video showing exactly how Sarah set up her automated systems.

Best regards,
The BFO Team',
  2,
  0
FROM public.email_sequences es
JOIN public.lead_magnets lm ON es.lead_magnet_id = lm.id
WHERE lm.slug = 'cpa-growth-blueprint';

INSERT INTO public.email_sequence_steps (sequence_id, step_number, subject, content, delay_days, delay_hours)
SELECT 
  es.id,
  3,
  'Video Demo: Advanced Tax Planning Tools in Action',
  'Hi {{name}},

As promised, here''s the behind-the-scenes video showing how successful CPAs are using our advanced tax planning tools.

🎥 Watch the 12-minute demo: {{video_url}}

You''ll see:
• Multi-year tax projection modeling
• Roth conversion optimization calculator  
• Entity structure analysis tools
• State residency planning features
• Automated client reporting

These are the exact tools that helped Sarah (from yesterday''s email) provide higher-value advisory services and command premium fees.

The advanced tools are part of our Premium CPA plan, but you can explore them with a free 14-day trial.

Want to test-drive these features? Start your trial: {{trial_url}}

Or continue exploring your basic tools: {{dashboard_url}}

Questions? Just reply to this email - I personally read and respond to every message.

Best regards,
The BFO Team

P.S. Many CPAs tell us the tax planning tools alone pay for the entire platform by enabling them to charge advisory fees that are 3-5x higher than basic compliance work.',
  5,
  0
FROM public.email_sequences es
JOIN public.lead_magnets lm ON es.lead_magnet_id = lm.id
WHERE lm.slug = 'cpa-growth-blueprint';

INSERT INTO public.email_sequence_steps (sequence_id, step_number, subject, content, delay_days, delay_hours)
SELECT 
  es.id,
  4,
  'Ready to Scale Your Practice? Compare Your Options',
  'Hi {{name}},

Over the past week, you''ve seen:
✅ The Growth Blueprint strategies
✅ Real success stories from CPAs like Sarah  
✅ Advanced tax planning tools in action

Now the question is: Are you ready to take your practice to the next level?

Here''s a quick comparison of what''s available to you:

**Basic (Free Forever)**
• Client dashboard & organizers
• Secure document sharing
• Basic CRM tools
• Education center access

**Premium ($97/month)**
• Everything in Basic, PLUS:
• Advanced tax planning suite
• Marketing automation tools
• Compliance & CE tracking
• Advanced reporting & analytics
• White-label client portal
• Priority support

**Most Popular Choice:** 87% of CPAs who upgrade choose Premium because the advanced tax tools typically pay for themselves with just one new advisory client.

Ready to unlock the full platform? Upgrade to Premium: {{upgrade_url}}

Or continue with your basic account: {{dashboard_url}}

Questions about which plan is right for you? Book a 15-minute strategy call: {{calendar_url}}

Thanks for letting me share these resources with you. I''m excited to see how you''ll use them to grow your practice!

Best regards,
The BFO Team

P.S. This is my final email in this sequence, but you''ll continue getting valuable tips and updates as part of our CPA community. You can unsubscribe anytime if you prefer.',
  7,
  0
FROM public.email_sequences es
JOIN public.lead_magnets lm ON es.lead_magnet_id = lm.id
WHERE lm.slug = 'cpa-growth-blueprint';