-- Disable CAPTCHA for all auth endpoints
-- This will remove the CAPTCHA requirement from Supabase Auth
-- Update auth configuration to disable captcha
UPDATE auth.config 
SET config = jsonb_set(
  COALESCE(config, '{}'::jsonb), 
  '{SECURITY_CAPTCHA_ENABLED}', 
  'false'::jsonb
) 
WHERE id = 'main' OR config_name = 'captcha';