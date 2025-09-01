-- Fix critical RLS security issues - Phase 1 (Corrected)
-- Enable RLS on tables that have policies but RLS disabled

-- First, enable RLS on commonly problematic tables (if they exist)
DO $$
DECLARE
    table_record RECORD;
BEGIN
    -- Check if meeting_notes table exists and enable RLS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'meeting_notes') THEN
        ALTER TABLE public.meeting_notes ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled RLS on meeting_notes';
    END IF;
    
    -- Check if insurance_submissions table exists and enable RLS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'insurance_submissions') THEN
        ALTER TABLE public.insurance_submissions ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled RLS on insurance_submissions';
    END IF;
    
    -- Check if ip_filings_stage table exists and enable RLS
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ip_filings_stage') THEN
        ALTER TABLE public.ip_filings_stage ENABLE ROW LEVEL SECURITY;
        RAISE NOTICE 'Enabled RLS on ip_filings_stage';
    END IF;
END $$;

-- Enable RLS on all public tables that don't have it
DO $$
DECLARE
    table_name TEXT;
BEGIN
    FOR table_name IN 
        SELECT t.table_name 
        FROM information_schema.tables t
        LEFT JOIN pg_class c ON c.relname = t.table_name
        LEFT JOIN pg_tables pt ON pt.tablename = t.table_name AND pt.schemaname = t.table_schema
        WHERE 
            t.table_schema = 'public'
            AND t.table_type = 'BASE TABLE'
            AND c.relkind = 'r'
            AND COALESCE(pt.rowsecurity, false) = false
    LOOP
        BEGIN
            EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
            RAISE NOTICE 'Enabled RLS on table: %', table_name;
        EXCEPTION
            WHEN OTHERS THEN
                RAISE NOTICE 'Failed to enable RLS on table %, error: %', table_name, SQLERRM;
        END;
    END LOOP;
END $$;

-- Create security definer functions to avoid recursive RLS issues
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE 
SET search_path = public
AS $$
  SELECT COALESCE(role, 'client'::text) 
  FROM public.profiles 
  WHERE id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_tenant_id()
RETURNS UUID 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE 
SET search_path = public
AS $$
  SELECT tenant_id 
  FROM public.profiles 
  WHERE id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE 
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = required_role
  );
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(required_roles TEXT[])
RETURNS BOOLEAN 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE 
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = ANY(required_roles)
  );
$$;

-- Add audit logging for admin operations
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
DROP POLICY IF EXISTS "Only admins can view audit logs" ON public.admin_audit_logs;
CREATE POLICY "Only admins can view audit logs" 
  ON public.admin_audit_logs 
  FOR SELECT 
  USING (public.has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin']));

-- System can insert audit logs
DROP POLICY IF EXISTS "System can insert audit logs" ON public.admin_audit_logs;
CREATE POLICY "System can insert audit logs" 
  ON public.admin_audit_logs 
  FOR INSERT 
  WITH CHECK (true);

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.admin_audit_logs (
    admin_user_id,
    action,
    resource_type,
    resource_id,
    details
  ) VALUES (
    auth.uid(),
    p_action,
    p_resource_type,
    p_resource_id,
    p_details
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;