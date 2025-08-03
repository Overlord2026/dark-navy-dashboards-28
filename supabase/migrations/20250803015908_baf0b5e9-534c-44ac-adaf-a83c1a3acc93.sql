-- Fix security warnings: Set search_path for existing function
ALTER FUNCTION public.update_updated_at_column() SET search_path = 'public';