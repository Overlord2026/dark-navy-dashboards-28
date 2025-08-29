-- Drop and recreate advisor_profiles_public view to exclude PII (email, phone, calendly_url)
DROP VIEW IF EXISTS public.advisor_profiles_public;
CREATE VIEW public.advisor_profiles_public AS 
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
  is_active,
  specialties
FROM public.advisor_profiles
WHERE is_active = true AND is_verified = true;

-- Drop and recreate v_advisor_email_templates_public to exclude email content
DROP VIEW IF EXISTS public.v_advisor_email_templates_public;
CREATE VIEW public.v_advisor_email_templates_public AS 
SELECT 
  id,
  template_type,
  template_name,
  is_active,
  compliance_approved,
  created_at,
  updated_at
FROM public.advisor_email_templates
WHERE is_active = true AND compliance_approved = true;

-- Drop and recreate v_cpa_welcome_templates_public to exclude email_content
DROP VIEW IF EXISTS public.v_cpa_welcome_templates_public;
CREATE VIEW public.v_cpa_welcome_templates_public AS 
SELECT 
  id,
  template_name,
  subject_line,
  includes_video,
  video_url,
  is_default,
  client_type,
  created_at,
  updated_at
FROM public.cpa_welcome_templates;