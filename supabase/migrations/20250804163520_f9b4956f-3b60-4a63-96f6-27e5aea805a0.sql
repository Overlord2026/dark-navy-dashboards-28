-- Fix RLS policy issues by creating comprehensive policies for all operations

-- Additional RLS policies for compliance_profiles
CREATE POLICY "Compliance officers can view all RIA profiles for review" ON public.ria_profiles
  FOR SELECT USING (auth.uid() IN (SELECT user_id FROM compliance_profiles));

-- Additional RLS policies for compliance_officer_actions  
CREATE POLICY "RIAs can view actions on their filings" ON public.compliance_officer_actions
  FOR SELECT USING (filing_id IN (
    SELECT id FROM ria_filings 
    WHERE ria_id IN (SELECT id FROM ria_profiles WHERE user_id = auth.uid())
  ));

-- Additional RLS policies for compliance_events
CREATE POLICY "System can insert compliance events" ON public.compliance_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Compliance officers can view all events" ON public.compliance_events
  FOR SELECT USING (auth.uid() IN (SELECT user_id FROM compliance_profiles));

-- Update compliance_profiles policy to allow compliance officers to view each other
CREATE POLICY "Compliance officers can view other compliance profiles" ON public.compliance_profiles
  FOR SELECT USING (auth.uid() IN (SELECT user_id FROM compliance_profiles));

-- Storage policy for compliance officers to manage filing documents
CREATE POLICY "Compliance officers can manage all filing documents" ON storage.objects
  FOR ALL USING (
    bucket_id = 'compliance-filings' AND 
    auth.uid() IN (SELECT user_id FROM compliance_profiles)
  );