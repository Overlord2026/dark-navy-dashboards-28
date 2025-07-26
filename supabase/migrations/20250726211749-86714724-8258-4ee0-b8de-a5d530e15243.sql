-- Professional Directory and Relationships System

-- Professional types/specialties
CREATE TABLE public.professional_types (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'financial', 'legal', 'insurance', 'tax', 'other'
  icon_name TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Professional profiles (extends user profiles)
CREATE TABLE public.professional_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tenant_id UUID,
  professional_type_id TEXT REFERENCES public.professional_types(id),
  business_name TEXT,
  license_number TEXT,
  specializations TEXT[],
  years_experience INTEGER,
  bio TEXT,
  website_url TEXT,
  office_address TEXT,
  phone_number TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_accepting_clients BOOLEAN DEFAULT true,
  hourly_rate NUMERIC,
  rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  availability_status TEXT DEFAULT 'available', -- 'available', 'busy', 'unavailable'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Client-Professional relationships
CREATE TABLE public.client_professional_relationships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_user_id UUID NOT NULL,
  professional_user_id UUID NOT NULL,
  relationship_type TEXT NOT NULL, -- 'primary', 'secondary', 'consultant'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'active', 'inactive', 'terminated'
  invited_by UUID,
  invitation_sent_at TIMESTAMP WITH TIME ZONE,
  accepted_at TIMESTAMP WITH TIME ZONE,
  terminated_at TIMESTAMP WITH TIME ZONE,
  termination_reason TEXT,
  notes TEXT,
  permissions JSONB DEFAULT '{}', -- What client data they can access
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_user_id, professional_user_id)
);

-- Professional invitations for onboarding
CREATE TABLE public.professional_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  invited_by_user_id UUID NOT NULL,
  tenant_id UUID,
  professional_type_id TEXT REFERENCES public.professional_types(id),
  invitation_token TEXT UNIQUE,
  custom_message TEXT,
  branding_config JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'expired', 'cancelled'
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_professional_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Professional availability for scheduling
CREATE TABLE public.professional_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_user_id UUID NOT NULL,
  day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone TEXT DEFAULT 'America/New_York',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Professional reviews and ratings
CREATE TABLE public.professional_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_user_id UUID NOT NULL,
  reviewer_user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  helpful_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(professional_user_id, reviewer_user_id)
);

-- Enable RLS
ALTER TABLE public.professional_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_professional_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for professional_types (public read)
CREATE POLICY "Anyone can view professional types" 
ON public.professional_types 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage professional types" 
ON public.professional_types 
FOR ALL 
USING (has_any_role(ARRAY['admin', 'system_administrator']));

-- RLS Policies for professional_profiles
CREATE POLICY "Users can view active professional profiles" 
ON public.professional_profiles 
FOR SELECT 
USING (true); -- Public directory, but limit sensitive data in app

CREATE POLICY "Users can manage their own professional profile" 
ON public.professional_profiles 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all professional profiles" 
ON public.professional_profiles 
FOR ALL 
USING (has_any_role(ARRAY['admin', 'tenant_admin']));

-- RLS Policies for client_professional_relationships
CREATE POLICY "Users can view their own relationships" 
ON public.client_professional_relationships 
FOR SELECT 
USING (auth.uid() = client_user_id OR auth.uid() = professional_user_id);

CREATE POLICY "Users can manage relationships they're involved in" 
ON public.client_professional_relationships 
FOR ALL 
USING (auth.uid() = client_user_id OR auth.uid() = professional_user_id OR auth.uid() = invited_by);

-- RLS Policies for professional_invitations
CREATE POLICY "Users can view invitations they sent or received" 
ON public.professional_invitations 
FOR SELECT 
USING (auth.uid() = invited_by_user_id OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Users can manage invitations they sent" 
ON public.professional_invitations 
FOR ALL 
USING (auth.uid() = invited_by_user_id);

-- RLS Policies for professional_availability
CREATE POLICY "Users can view professional availability" 
ON public.professional_availability 
FOR SELECT 
USING (true);

CREATE POLICY "Professionals can manage their own availability" 
ON public.professional_availability 
FOR ALL 
USING (auth.uid() = professional_user_id);

-- RLS Policies for professional_reviews
CREATE POLICY "Anyone can view reviews" 
ON public.professional_reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create reviews for professionals they work with" 
ON public.professional_reviews 
FOR INSERT 
WITH CHECK (
  auth.uid() = reviewer_user_id AND 
  EXISTS (
    SELECT 1 FROM public.client_professional_relationships 
    WHERE client_user_id = auth.uid() 
    AND professional_user_id = professional_reviews.professional_user_id 
    AND status = 'active'
  )
);

CREATE POLICY "Users can update their own reviews" 
ON public.professional_reviews 
FOR UPDATE 
USING (auth.uid() = reviewer_user_id);

-- Insert default professional types
INSERT INTO public.professional_types (id, name, description, category, icon_name, sort_order) VALUES
('financial_advisor', 'Financial Advisor', 'Investment and wealth management services', 'financial', 'TrendingUp', 1),
('certified_planner', 'Certified Financial Planner', 'Comprehensive financial planning', 'financial', 'Target', 2),
('investment_advisor', 'Investment Advisor', 'Investment portfolio management', 'financial', 'BarChart3', 3),
('cpa', 'Certified Public Accountant', 'Tax preparation and accounting services', 'tax', 'Calculator', 4),
('tax_advisor', 'Tax Advisor', 'Tax planning and preparation', 'tax', 'FileText', 5),
('estate_attorney', 'Estate Planning Attorney', 'Wills, trusts, and estate planning', 'legal', 'Scale', 6),
('business_attorney', 'Business Attorney', 'Corporate and business legal services', 'legal', 'Briefcase', 7),
('insurance_agent', 'Insurance Agent', 'Life, health, and property insurance', 'insurance', 'Shield', 8),
('mortgage_broker', 'Mortgage Broker', 'Home financing and refinancing', 'financial', 'Home', 9),
('real_estate_agent', 'Real Estate Agent', 'Property buying and selling services', 'other', 'Building', 10);

-- Function to update professional rating
CREATE OR REPLACE FUNCTION public.update_professional_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.professional_profiles 
  SET 
    rating = (
      SELECT AVG(rating)::NUMERIC(3,2) 
      FROM public.professional_reviews 
      WHERE professional_user_id = COALESCE(NEW.professional_user_id, OLD.professional_user_id)
    ),
    total_reviews = (
      SELECT COUNT(*) 
      FROM public.professional_reviews 
      WHERE professional_user_id = COALESCE(NEW.professional_user_id, OLD.professional_user_id)
    ),
    updated_at = now()
  WHERE user_id = COALESCE(NEW.professional_user_id, OLD.professional_user_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Create trigger for updating professional ratings
CREATE TRIGGER update_professional_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.professional_reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_professional_rating();