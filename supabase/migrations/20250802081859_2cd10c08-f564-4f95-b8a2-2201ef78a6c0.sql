-- Fix security warnings by updating function search paths
ALTER FUNCTION public.calculate_lead_score(UUID) SET search_path = '';
ALTER FUNCTION public.schedule_follow_up(UUID, TEXT) SET search_path = '';
ALTER FUNCTION public.trigger_lead_score_calculation() SET search_path = '';
ALTER FUNCTION public.trigger_follow_up_scheduling() SET search_path = '';