-- Add RLS policies for the new tables created

-- RLS Policies for lead_routing_rules
CREATE POLICY "Tenant users can manage routing rules" ON public.lead_routing_rules
FOR ALL USING (tenant_id = get_current_user_tenant_id());

-- RLS Policies for lead_enrichment_log  
CREATE POLICY "Users can view enrichment logs for their leads" ON public.lead_enrichment_log
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.leads 
    WHERE leads.id = lead_enrichment_log.lead_id 
    AND leads.advisor_id = auth.uid()
  )
);

-- RLS Policies for lead_scoring_analytics
CREATE POLICY "Tenant users can view scoring analytics" ON public.lead_scoring_analytics
FOR SELECT USING (tenant_id = get_current_user_tenant_id());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_enrichment_status ON public.leads(enrichment_status);
CREATE INDEX IF NOT EXISTS idx_leads_catchlight_score ON public.leads(catchlight_score);
CREATE INDEX IF NOT EXISTS idx_leads_plaid_consent ON public.leads(plaid_consent_given);
CREATE INDEX IF NOT EXISTS idx_lead_enrichment_log_lead_id ON public.lead_enrichment_log(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_routing_rules_priority ON public.lead_routing_rules(rule_priority, is_active);
CREATE INDEX IF NOT EXISTS idx_lead_scoring_analytics_date ON public.lead_scoring_analytics(analytics_date, tenant_id);