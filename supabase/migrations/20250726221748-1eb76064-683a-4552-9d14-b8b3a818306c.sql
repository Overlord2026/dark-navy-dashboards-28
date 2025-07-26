-- Add custom_fields column to professional_profiles table
ALTER TABLE public.professional_profiles 
ADD COLUMN custom_fields JSONB DEFAULT '{}'::jsonb;

-- Add comment for the new column
COMMENT ON COLUMN public.professional_profiles.custom_fields IS 'Flexible JSONB storage for firm-specific or advisor-specific custom fields like languages, designations, video URLs, etc.';