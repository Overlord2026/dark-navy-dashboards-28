-- Create pro_inquiries table for advisor marketplace inquiries
CREATE TABLE IF NOT EXISTS public.pro_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona TEXT NOT NULL DEFAULT 'advisor',
  pro_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pro_inquiries ENABLE ROW LEVEL SECURITY;

-- RLS policies for pro_inquiries
CREATE POLICY "Users can create inquiries" 
ON public.pro_inquiries 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can manage all inquiries" 
ON public.pro_inquiries 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add updated_at trigger
CREATE TRIGGER update_pro_inquiries_updated_at
  BEFORE UPDATE ON public.pro_inquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_touch_updated_at();

-- Create families_intake table for families onboarding
CREATE TABLE IF NOT EXISTS public.families_intake (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.families_intake ENABLE ROW LEVEL SECURITY;

-- RLS policies for families_intake
CREATE POLICY "Users can create intake records" 
ON public.families_intake 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Service role can manage all intake records" 
ON public.families_intake 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Add updated_at trigger  
CREATE TRIGGER update_families_intake_updated_at
  BEFORE UPDATE ON public.families_intake
  FOR EACH ROW
  EXECUTE FUNCTION public.fn_touch_updated_at();