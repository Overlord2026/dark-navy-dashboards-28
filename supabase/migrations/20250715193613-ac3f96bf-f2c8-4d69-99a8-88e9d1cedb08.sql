-- Create faqs table for admin-managed Q&A system
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_published BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on faqs table
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Public can read published FAQs
CREATE POLICY "Anyone can view published FAQs" ON public.faqs
  FOR SELECT USING (is_published = true);

-- Only admins can manage FAQs
CREATE POLICY "Admins can manage FAQs" ON public.faqs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Add trigger to update updated_at column
CREATE TRIGGER update_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add role column to profiles if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Create index for better performance
CREATE INDEX idx_faqs_published ON public.faqs(is_published, sort_order);
CREATE INDEX idx_profiles_role ON public.profiles(role);