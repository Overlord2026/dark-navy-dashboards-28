-- Create table for LinkedIn-imported professionals
CREATE TABLE public.linkedin_professionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  company TEXT,
  bio TEXT,
  specialties TEXT[],
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  linkedin_id TEXT UNIQUE,
  profile_image_url TEXT,
  profile_source TEXT DEFAULT 'linkedin_import',
  status TEXT DEFAULT 'active',
  featured BOOLEAN DEFAULT true,
  referral_code TEXT,
  referred_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.linkedin_professionals ENABLE ROW LEVEL SECURITY;

-- Create policies for linkedin_professionals
CREATE POLICY "Anyone can view active professionals" 
ON public.linkedin_professionals 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Professionals can update their own profile" 
ON public.linkedin_professionals 
FOR UPDATE 
USING (auth.uid()::text = id::text OR auth.uid()::text = linkedin_id);

CREATE POLICY "Anyone can insert new professional profiles" 
ON public.linkedin_professionals 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_linkedin_professionals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_linkedin_professionals_updated_at
BEFORE UPDATE ON public.linkedin_professionals
FOR EACH ROW
EXECUTE FUNCTION public.update_linkedin_professionals_updated_at();

-- Add indexes for better performance
CREATE INDEX idx_linkedin_professionals_status ON public.linkedin_professionals(status);
CREATE INDEX idx_linkedin_professionals_featured ON public.linkedin_professionals(featured);
CREATE INDEX idx_linkedin_professionals_referral_code ON public.linkedin_professionals(referral_code);