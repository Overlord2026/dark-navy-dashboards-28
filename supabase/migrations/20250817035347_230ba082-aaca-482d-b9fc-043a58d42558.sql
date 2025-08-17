-- Fix remaining critical security issues properly

-- 1. Remove problematic extensions from public schema if they exist
-- Moving extensions to separate schemas reduces security risks
DROP EXTENSION IF EXISTS plpython3u CASCADE;
DROP EXTENSION IF EXISTS plperlu CASCADE;

-- 2. Add comprehensive RLS policies for tables missing them
-- These policies implement owner-based and tenant-based access patterns

-- Core financial tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'financial_plans' 
    AND policyname = 'Users can manage own financial plans'
  ) THEN
    CREATE POLICY "Users can manage own financial plans" ON public.financial_plans
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'account_balances' 
    AND policyname = 'Users can view own account balances'
  ) THEN
    CREATE POLICY "Users can view own account balances" ON public.account_balances
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- Professional onboarding tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'cpa_onboarding' 
    AND policyname = 'Users can manage own CPA onboarding'
  ) THEN
    CREATE POLICY "Users can manage own CPA onboarding" ON public.cpa_onboarding
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'insurance_agent_onboarding' 
    AND policyname = 'Users can manage own insurance onboarding'
  ) THEN
    CREATE POLICY "Users can manage own insurance onboarding" ON public.insurance_agent_onboarding
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- Communication and messaging tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'messages' 
    AND policyname = 'Users can access own messages'
  ) THEN
    CREATE POLICY "Users can access own messages" ON public.messages
      FOR ALL USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'notifications' 
    AND policyname = 'Users can view own notifications'
  ) THEN
    CREATE POLICY "Users can view own notifications" ON public.notifications
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- Professional service tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'service_requests' 
    AND policyname = 'Users can manage own service requests'
  ) THEN
    CREATE POLICY "Users can manage own service requests" ON public.service_requests
      FOR ALL USING (auth.uid() = client_id OR auth.uid() = professional_id);
  END IF;
END $$;

-- Health and medical data
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'health_metrics' 
    AND policyname = 'Users can manage own health data'
  ) THEN
    CREATE POLICY "Users can manage own health data" ON public.health_metrics
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- Legal and estate planning
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'estate_plans' 
    AND policyname = 'Users can manage own estate plans'
  ) THEN
    CREATE POLICY "Users can manage own estate plans" ON public.estate_plans
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;

-- Security and compliance tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'security_audit_logs' 
    AND policyname = 'Admin access only for security logs'
  ) THEN
    CREATE POLICY "Admin access only for security logs" ON public.security_audit_logs
      FOR SELECT USING (
        EXISTS (
          SELECT 1 FROM public.profiles 
          WHERE profiles.id = auth.uid() 
          AND profiles.role IN ('admin', 'system_administrator')
        )
      );
  END IF;
END $$;

-- Create additional storage policies if buckets exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'health-documents') THEN
    DROP POLICY IF EXISTS "Users can upload health documents" ON storage.objects;
    CREATE POLICY "Users can upload health documents" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'health-documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
      );
      
    DROP POLICY IF EXISTS "Users can view own health documents" ON storage.objects;
    CREATE POLICY "Users can view own health documents" ON storage.objects
      FOR SELECT USING (
        bucket_id = 'health-documents' AND 
        auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;
END $$;