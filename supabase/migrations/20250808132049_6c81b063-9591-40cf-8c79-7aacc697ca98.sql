-- Create missing tables that weren't created due to the error

-- First check if lead_magnets exists, if not create it
CREATE TABLE IF NOT EXISTS public.lead_magnets (
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
CREATE TABLE IF NOT EXISTS public.lead_magnet_submissions (
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

-- Create email sequence steps table
CREATE TABLE IF NOT EXISTS public.email_sequence_steps (
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
CREATE TABLE IF NOT EXISTS public.email_sequence_enrollments (
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
CREATE TABLE IF NOT EXISTS public.email_sequence_deliveries (
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

-- Insert the CPA Growth Blueprint lead magnet if not exists
INSERT INTO public.lead_magnets (title, slug, description, target_persona, download_url, form_fields) 
SELECT 
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
WHERE NOT EXISTS (
  SELECT 1 FROM public.lead_magnets WHERE slug = 'cpa-growth-blueprint'
);

-- Insert the CPA email sequence if not exists
INSERT INTO public.email_sequences (name, lead_magnet_id, target_persona) 
SELECT 
  'CPA Growth Blueprint Nurture Sequence',
  lm.id,
  'cpa'
FROM public.lead_magnets lm
WHERE lm.slug = 'cpa-growth-blueprint'
AND NOT EXISTS (
  SELECT 1 FROM public.email_sequences es 
  WHERE es.lead_magnet_id = lm.id AND es.name = 'CPA Growth Blueprint Nurture Sequence'
);