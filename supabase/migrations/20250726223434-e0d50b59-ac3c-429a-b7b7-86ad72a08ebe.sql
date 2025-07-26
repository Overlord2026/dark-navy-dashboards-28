-- Add custom_fields column to professionals table
ALTER TABLE public.professionals 
ADD COLUMN custom_fields JSONB DEFAULT '{}'::jsonb;

-- Add comment for the new column
COMMENT ON COLUMN public.professionals.custom_fields IS 'Flexible JSONB storage for firm-specific or advisor-specific custom fields like languages, designations, video URLs, etc.';