-- Check if the AIES tables exist and their structure
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('aies_consent_grants', 'aies_policies', 'aies_connector_health')
ORDER BY table_name, ordinal_position;