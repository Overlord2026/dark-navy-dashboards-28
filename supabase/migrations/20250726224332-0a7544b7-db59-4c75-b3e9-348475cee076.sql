-- Add custom fields support
ALTER TABLE public.professionals ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::jsonb;

-- Add external verification fields
ALTER TABLE public.professionals 
  ADD COLUMN IF NOT EXISTS external_verification_id TEXT,
  ADD COLUMN IF NOT EXISTS external_review_score NUMERIC;

-- Add monetization flags
ALTER TABLE public.professionals 
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS sponsored BOOLEAN DEFAULT false;

-- Add privacy controls
ALTER TABLE public.professionals 
  ADD COLUMN IF NOT EXISTS show_email BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_phone BOOLEAN DEFAULT false;

-- Add scheduling integration
ALTER TABLE public.professionals 
  ADD COLUMN IF NOT EXISTS scheduling_url TEXT;