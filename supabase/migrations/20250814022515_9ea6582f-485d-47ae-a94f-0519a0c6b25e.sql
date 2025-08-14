-- Create sanitized public view for advisor profiles (fixing the column names)
CREATE OR REPLACE VIEW public.advisor_profiles_public AS
SELECT 
  id, 
  name, 
  firm_name, 
  license_states,
  specializations,
  expertise_areas,
  years_experience,
  hourly_rate,
  availability_status,
  meeting_types,
  bio,
  certifications,
  average_rating,
  total_reviews,
  is_verified,
  is_active
FROM public.advisor_profiles
WHERE is_active = true AND is_verified = true;

-- Grant select to anonymous users on sanitized view only
GRANT SELECT ON public.advisor_profiles_public TO anon;