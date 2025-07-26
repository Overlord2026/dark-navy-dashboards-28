-- Create charity and giving tables for "For the Greater Good" module

-- Charities/causes table
CREATE TABLE public.charities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  website_url TEXT,
  logo_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT true,
  annual_goal NUMERIC DEFAULT 0,
  annual_raised NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User charity preferences and selections
CREATE TABLE public.user_charities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  charity_id UUID REFERENCES public.charities(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT false,
  date_selected TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Charity suggestions from users
CREATE TABLE public.charity_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  charity_name TEXT NOT NULL,
  description TEXT,
  website_url TEXT,
  reason TEXT,
  status TEXT DEFAULT 'pending',
  reviewed_by UUID,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User giving/donation records
CREATE TABLE public.user_donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  charity_id UUID REFERENCES public.charities(id),
  amount NUMERIC NOT NULL,
  donation_date DATE NOT NULL,
  description TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Impact stories and testimonials
CREATE TABLE public.impact_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  charity_id UUID REFERENCES public.charities(id),
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_anonymous BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Community giving metrics
CREATE TABLE public.community_giving_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  year INTEGER NOT NULL,
  total_donations NUMERIC DEFAULT 0,
  families_helped INTEGER DEFAULT 0,
  scholarships_funded INTEGER DEFAULT 0,
  community_projects INTEGER DEFAULT 0,
  unique_donors INTEGER DEFAULT 0,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(year)
);

-- Enable RLS
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charity_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_giving_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for charities (public read)
CREATE POLICY "Anyone can view verified charities" 
ON public.charities 
FOR SELECT 
USING (is_verified = true);

CREATE POLICY "Admins can manage charities" 
ON public.charities 
FOR ALL 
USING (has_any_role(ARRAY['admin', 'system_administrator']));

-- RLS Policies for user_charities
CREATE POLICY "Users can manage their charity selections" 
ON public.user_charities 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for charity_suggestions
CREATE POLICY "Users can manage their charity suggestions" 
ON public.charity_suggestions 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all charity suggestions" 
ON public.charity_suggestions 
FOR SELECT 
USING (has_any_role(ARRAY['admin', 'system_administrator']));

-- RLS Policies for user_donations
CREATE POLICY "Users can manage their donations" 
ON public.user_donations 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for impact_stories
CREATE POLICY "Users can manage their impact stories" 
ON public.impact_stories 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view featured impact stories" 
ON public.impact_stories 
FOR SELECT 
USING (is_featured = true AND status = 'approved');

-- RLS Policies for community_giving_metrics (public read)
CREATE POLICY "Anyone can view community giving metrics" 
ON public.community_giving_metrics 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage community metrics" 
ON public.community_giving_metrics 
FOR ALL 
USING (has_any_role(ARRAY['admin', 'system_administrator']));

-- Insert sample data
INSERT INTO public.charities (name, description, category, website_url, is_featured, annual_goal) VALUES
('Children''s Education Foundation', 'Providing scholarships and educational resources to underserved children', 'Education', 'https://example.com/children-education', true, 500000),
('Community Food Bank', 'Fighting hunger in our local communities', 'Hunger Relief', 'https://example.com/food-bank', true, 300000),
('Housing for Hope', 'Building homes for families in need', 'Housing', 'https://example.com/housing-hope', true, 750000),
('Veterans Support Network', 'Supporting veterans and their families', 'Veterans', 'https://example.com/veterans-support', false, 200000),
('Environmental Action Fund', 'Protecting our planet for future generations', 'Environment', 'https://example.com/environment', false, 400000);

-- Insert sample community metrics
INSERT INTO public.community_giving_metrics (year, total_donations, families_helped, scholarships_funded, community_projects, unique_donors) VALUES
(2024, 1250000, 450, 125, 28, 340),
(2023, 980000, 380, 98, 22, 285);

-- Create function to update charity annual totals
CREATE OR REPLACE FUNCTION public.update_charity_annual_totals()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the charity's annual raised amount
  UPDATE public.charities 
  SET annual_raised = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM public.user_donations 
    WHERE charity_id = COALESCE(NEW.charity_id, OLD.charity_id)
    AND EXTRACT(YEAR FROM donation_date) = EXTRACT(YEAR FROM CURRENT_DATE)
  )
  WHERE id = COALESCE(NEW.charity_id, OLD.charity_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating charity totals
CREATE TRIGGER update_charity_totals_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.user_donations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_charity_annual_totals();