-- Fix function search path issues for new functions
ALTER FUNCTION public.update_updated_at_column() SET search_path TO 'public', 'pg_temp';
ALTER FUNCTION public.log_education_content_changes() SET search_path TO 'public', 'pg_temp';