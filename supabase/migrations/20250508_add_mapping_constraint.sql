
-- Add JSONB validation constraint to partner_api_mappings
DO $$
BEGIN
  -- Check if the constraint already exists
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'non_empty_mapping'
  ) THEN
    -- Add the constraint if it doesn't exist
    ALTER TABLE public.partner_api_mappings
      ADD CONSTRAINT non_empty_mapping
      CHECK (jsonb_typeof(mapping) = 'object' AND mapping::text <> '{}');
  END IF;
END
$$;
