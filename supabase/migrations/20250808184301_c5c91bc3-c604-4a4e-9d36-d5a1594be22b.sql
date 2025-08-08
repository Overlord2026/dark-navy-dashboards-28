-- Security Hardening Migration: GraphQL Schema Functions
-- Secure GraphQL schema helper functions with SECURITY DEFINER and search_path = ''

DO $$
BEGIN
  -- Only apply changes if we're in the graphql schema (idempotent check)
  IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'graphql') THEN
    
    -- Update graphql.increment_schema_version() to be secure
    IF EXISTS (
      SELECT 1 FROM pg_proc p 
      JOIN pg_namespace n ON n.oid = p.pronamespace 
      WHERE n.nspname = 'graphql' AND p.proname = 'increment_schema_version'
    ) THEN
      DROP FUNCTION IF EXISTS graphql.increment_schema_version();
      
      CREATE OR REPLACE FUNCTION graphql.increment_schema_version()
      RETURNS integer
      LANGUAGE sql
      SECURITY DEFINER
      SET search_path = ''
      AS $$
        UPDATE graphql.config 
        SET schema_version = schema_version + 1
        WHERE schema_name = 'default'
        RETURNING schema_version;
      $$;
    END IF;

    -- Update graphql.get_schema_version() to be secure  
    IF EXISTS (
      SELECT 1 FROM pg_proc p 
      JOIN pg_namespace n ON n.oid = p.pronamespace 
      WHERE n.nspname = 'graphql' AND p.proname = 'get_schema_version'
    ) THEN
      DROP FUNCTION IF EXISTS graphql.get_schema_version();
      
      CREATE OR REPLACE FUNCTION graphql.get_schema_version()
      RETURNS integer
      LANGUAGE sql
      SECURITY DEFINER
      SET search_path = ''
      AS $$
        SELECT COALESCE(schema_version, 1) 
        FROM graphql.config 
        WHERE schema_name = 'default' 
        LIMIT 1;
      $$;
    END IF;

  END IF;
END
$$;