-- Enhanced professionals and assignments tables
CREATE TABLE IF NOT EXISTS public.professional_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  assigned_by UUID NOT NULL,
  relationship TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  start_date DATE DEFAULT CURRENT_DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on professional_assignments
ALTER TABLE public.professional_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for professional_assignments
CREATE POLICY "Users can manage assignments in their tenant"
ON public.professional_assignments
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.professionals p
    WHERE p.id = professional_assignments.professional_id
    AND p.tenant_id = get_current_user_tenant_id()
  )
);

CREATE TABLE IF NOT EXISTS public.professional_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on professional_reviews
ALTER TABLE public.professional_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for professional_reviews
CREATE POLICY "Users can view reviews in their tenant"
ON public.professional_reviews
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.professionals p
    WHERE p.id = professional_reviews.professional_id
    AND p.tenant_id = get_current_user_tenant_id()
  )
);

CREATE POLICY "Users can create reviews in their tenant"
ON public.professional_reviews
FOR INSERT
WITH CHECK (
  reviewer_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.professionals p
    WHERE p.id = professional_reviews.professional_id
    AND p.tenant_id = get_current_user_tenant_id()
  )
);

CREATE TABLE IF NOT EXISTS public.professional_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  invited_by UUID NOT NULL,
  invited_as TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent',
  invite_token TEXT UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days'),
  tenant_id UUID NOT NULL DEFAULT get_current_user_tenant_id(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on professional_invitations
ALTER TABLE public.professional_invitations ENABLE ROW LEVEL SECURITY;

-- Create policies for professional_invitations
CREATE POLICY "Users can manage invitations in their tenant"
ON public.professional_invitations
FOR ALL
USING (tenant_id = get_current_user_tenant_id());

CREATE TABLE IF NOT EXISTS public.professional_compliance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID REFERENCES public.professionals(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  doc_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  last_reviewed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on professional_compliance
ALTER TABLE public.professional_compliance ENABLE ROW LEVEL SECURITY;

-- Create policies for professional_compliance
CREATE POLICY "Users can view compliance docs in their tenant"
ON public.professional_compliance
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.professionals p
    WHERE p.id = professional_compliance.professional_id
    AND p.tenant_id = get_current_user_tenant_id()
  )
);

-- Add missing columns to professionals table
ALTER TABLE public.professionals
ADD COLUMN IF NOT EXISTS firm TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS photo_url TEXT,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS languages TEXT[],
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS accepting_new_clients BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS fee_model TEXT,
ADD COLUMN IF NOT EXISTS ratings_average NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS availability JSONB,
ADD COLUMN IF NOT EXISTS location TEXT;

-- Update existing professionals to have firm = company if firm is null
UPDATE public.professionals 
SET firm = company 
WHERE firm IS NULL AND company IS NOT NULL;

-- Create trigger to update ratings when reviews are added
CREATE OR REPLACE FUNCTION update_professional_ratings()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.professionals
  SET 
    ratings_average = (
      SELECT AVG(rating)::NUMERIC(3,2)
      FROM public.professional_reviews
      WHERE professional_id = COALESCE(NEW.professional_id, OLD.professional_id)
    ),
    reviews_count = (
      SELECT COUNT(*)
      FROM public.professional_reviews
      WHERE professional_id = COALESCE(NEW.professional_id, OLD.professional_id)
    )
  WHERE id = COALESCE(NEW.professional_id, OLD.professional_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_ratings_trigger ON public.professional_reviews;
CREATE TRIGGER update_ratings_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.professional_reviews
  FOR EACH ROW EXECUTE FUNCTION update_professional_ratings();