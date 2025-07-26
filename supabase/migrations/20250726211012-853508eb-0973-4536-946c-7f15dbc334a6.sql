-- Create impact reporting tables

-- User impact preferences and settings
CREATE TABLE public.user_impact_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  allow_public_recognition BOOLEAN DEFAULT false,
  email_notifications BOOLEAN DEFAULT true,
  quarterly_reports BOOLEAN DEFAULT true,
  annual_reports BOOLEAN DEFAULT true,
  report_format TEXT DEFAULT 'pdf',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Generated impact reports
CREATE TABLE public.impact_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tenant_id UUID,
  report_type TEXT NOT NULL, -- 'quarterly', 'annual'
  report_period_start DATE NOT NULL,
  report_period_end DATE NOT NULL,
  total_donated NUMERIC DEFAULT 0,
  charities_supported INTEGER DEFAULT 0,
  projects_supported INTEGER DEFAULT 0,
  report_data JSONB NOT NULL DEFAULT '{}',
  file_url TEXT,
  status TEXT DEFAULT 'generated',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Impact milestones and achievements
CREATE TABLE public.impact_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  milestone_type TEXT NOT NULL, -- 'donation_amount', 'years_giving', 'charities_supported'
  milestone_value NUMERIC NOT NULL,
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  milestone_data JSONB DEFAULT '{}',
  is_celebrated BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Network-wide impact aggregations for admin dashboard
CREATE TABLE public.network_impact_summary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID,
  period_type TEXT NOT NULL, -- 'quarterly', 'annual'
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_families INTEGER DEFAULT 0,
  total_donated NUMERIC DEFAULT 0,
  total_charities INTEGER DEFAULT 0,
  total_projects INTEGER DEFAULT 0,
  top_charities JSONB DEFAULT '[]',
  impact_stories JSONB DEFAULT '[]',
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, period_type, period_start, period_end)
);

-- Impact report notifications
CREATE TABLE public.impact_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  report_id UUID REFERENCES public.impact_reports(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL, -- 'email', 'in_app'
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_impact_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_impact_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_impact_preferences
CREATE POLICY "Users can manage their impact preferences" 
ON public.user_impact_preferences 
FOR ALL 
USING (auth.uid() = user_id);

-- RLS Policies for impact_reports
CREATE POLICY "Users can view their own impact reports" 
ON public.impact_reports 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage impact reports" 
ON public.impact_reports 
FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Admins can view all reports in their tenant" 
ON public.impact_reports 
FOR SELECT 
USING (has_any_role(ARRAY['admin', 'tenant_admin']) AND (tenant_id = get_current_user_tenant_id() OR get_current_user_role() = 'system_administrator'));

-- RLS Policies for impact_milestones
CREATE POLICY "Users can view their own milestones" 
ON public.impact_milestones 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage milestones" 
ON public.impact_milestones 
FOR ALL 
USING (auth.role() = 'service_role');

-- RLS Policies for network_impact_summary
CREATE POLICY "Admins can view network impact for their tenant" 
ON public.network_impact_summary 
FOR SELECT 
USING (has_any_role(ARRAY['admin', 'tenant_admin']) AND (tenant_id = get_current_user_tenant_id() OR get_current_user_role() = 'system_administrator'));

CREATE POLICY "Service role can manage network impact summary" 
ON public.network_impact_summary 
FOR ALL 
USING (auth.role() = 'service_role');

-- RLS Policies for impact_notifications
CREATE POLICY "Users can view their own notifications" 
ON public.impact_notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage notifications" 
ON public.impact_notifications 
FOR ALL 
USING (auth.role() = 'service_role');

-- Function to generate quarterly impact report
CREATE OR REPLACE FUNCTION public.generate_user_impact_report(
  p_user_id UUID,
  p_report_type TEXT,
  p_period_start DATE,
  p_period_end DATE
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  report_id UUID;
  total_donated NUMERIC := 0;
  charities_count INTEGER := 0;
  projects_count INTEGER := 0;
  report_data JSONB;
  user_tenant_id UUID;
BEGIN
  -- Get user's tenant
  SELECT tenant_id INTO user_tenant_id FROM public.profiles WHERE id = p_user_id;
  
  -- Calculate totals
  SELECT 
    COALESCE(SUM(amount), 0),
    COUNT(DISTINCT charity_id)
  INTO total_donated, charities_count
  FROM public.user_donations 
  WHERE user_id = p_user_id 
    AND donation_date BETWEEN p_period_start AND p_period_end;
  
  -- Estimate projects (simplified - could be enhanced with real project data)
  projects_count := charities_count * 2;
  
  -- Build report data
  SELECT jsonb_build_object(
    'donations_by_charity', charity_breakdown.donations,
    'monthly_breakdown', monthly_breakdown.months,
    'top_causes', top_causes.causes
  ) INTO report_data
  FROM (
    SELECT jsonb_agg(
      jsonb_build_object(
        'charity_name', c.name,
        'amount', COALESCE(SUM(ud.amount), 0),
        'donation_count', COUNT(ud.id)
      )
    ) as donations
    FROM public.charities c
    LEFT JOIN public.user_donations ud ON c.id = ud.charity_id 
      AND ud.user_id = p_user_id 
      AND ud.donation_date BETWEEN p_period_start AND p_period_end
    WHERE ud.id IS NOT NULL
    GROUP BY c.id, c.name
  ) charity_breakdown,
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'month', month_year,
        'amount', COALESCE(SUM(amount), 0)
      ) ORDER BY month_year
    ) as months
    FROM (
      SELECT 
        DATE_TRUNC('month', donation_date) as month_year,
        amount
      FROM public.user_donations
      WHERE user_id = p_user_id 
        AND donation_date BETWEEN p_period_start AND p_period_end
    ) monthly_data
    GROUP BY month_year
  ) monthly_breakdown,
  (
    SELECT jsonb_agg(DISTINCT c.category) as causes
    FROM public.charities c
    JOIN public.user_donations ud ON c.id = ud.charity_id
    WHERE ud.user_id = p_user_id 
      AND ud.donation_date BETWEEN p_period_start AND p_period_end
  ) top_causes;
  
  -- Create report record
  INSERT INTO public.impact_reports (
    user_id, tenant_id, report_type, report_period_start, report_period_end,
    total_donated, charities_supported, projects_supported, report_data
  ) VALUES (
    p_user_id, user_tenant_id, p_report_type, p_period_start, p_period_end,
    total_donated, charities_count, projects_count, report_data
  ) RETURNING id INTO report_id;
  
  -- Check for new milestones
  PERFORM public.check_impact_milestones(p_user_id);
  
  RETURN report_id;
END;
$$;

-- Function to check and create impact milestones
CREATE OR REPLACE FUNCTION public.check_impact_milestones(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  lifetime_donated NUMERIC;
  years_giving INTEGER;
  charities_supported INTEGER;
BEGIN
  -- Calculate lifetime stats
  SELECT 
    COALESCE(SUM(amount), 0),
    COUNT(DISTINCT charity_id),
    EXTRACT(YEAR FROM AGE(MAX(donation_date), MIN(donation_date)))
  INTO lifetime_donated, charities_supported, years_giving
  FROM public.user_donations 
  WHERE user_id = p_user_id;
  
  -- Check donation amount milestones
  IF lifetime_donated >= 1000 AND NOT EXISTS (
    SELECT 1 FROM public.impact_milestones 
    WHERE user_id = p_user_id AND milestone_type = 'donation_amount' AND milestone_value = 1000
  ) THEN
    INSERT INTO public.impact_milestones (user_id, milestone_type, milestone_value, milestone_data)
    VALUES (p_user_id, 'donation_amount', 1000, jsonb_build_object('title', 'First $1,000 Donated!'));
  END IF;
  
  IF lifetime_donated >= 5000 AND NOT EXISTS (
    SELECT 1 FROM public.impact_milestones 
    WHERE user_id = p_user_id AND milestone_type = 'donation_amount' AND milestone_value = 5000
  ) THEN
    INSERT INTO public.impact_milestones (user_id, milestone_type, milestone_value, milestone_data)
    VALUES (p_user_id, 'donation_amount', 5000, jsonb_build_object('title', '$5,000 Impact Milestone!'));
  END IF;
  
  -- Check years giving milestone
  IF years_giving >= 1 AND NOT EXISTS (
    SELECT 1 FROM public.impact_milestones 
    WHERE user_id = p_user_id AND milestone_type = 'years_giving' AND milestone_value = 1
  ) THEN
    INSERT INTO public.impact_milestones (user_id, milestone_type, milestone_value, milestone_data)
    VALUES (p_user_id, 'years_giving', 1, jsonb_build_object('title', 'One Year of Giving!'));
  END IF;
  
  -- Check charities supported milestone
  IF charities_supported >= 3 AND NOT EXISTS (
    SELECT 1 FROM public.impact_milestones 
    WHERE user_id = p_user_id AND milestone_type = 'charities_supported' AND milestone_value = 3
  ) THEN
    INSERT INTO public.impact_milestones (user_id, milestone_type, milestone_value, milestone_data)
    VALUES (p_user_id, 'charities_supported', 3, jsonb_build_object('title', 'Supporting 3+ Causes!'));
  END IF;
END;
$$;

-- Function to calculate network impact summary
CREATE OR REPLACE FUNCTION public.calculate_network_impact_summary(
  p_tenant_id UUID,
  p_period_type TEXT,
  p_period_start DATE,
  p_period_end DATE
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  total_families INTEGER;
  total_donated NUMERIC;
  total_charities INTEGER;
  total_projects INTEGER;
  top_charities JSONB;
BEGIN
  -- Calculate network totals
  SELECT 
    COUNT(DISTINCT ud.user_id),
    COALESCE(SUM(ud.amount), 0),
    COUNT(DISTINCT ud.charity_id)
  INTO total_families, total_donated, total_charities
  FROM public.user_donations ud
  JOIN public.profiles p ON ud.user_id = p.id
  WHERE p.tenant_id = p_tenant_id
    AND ud.donation_date BETWEEN p_period_start AND p_period_end;
  
  -- Estimate total projects
  total_projects := total_charities * 2;
  
  -- Get top charities
  SELECT jsonb_agg(
    jsonb_build_object(
      'charity_name', c.name,
      'total_amount', charity_totals.total_amount,
      'donor_count', charity_totals.donor_count
    )
  ) INTO top_charities
  FROM (
    SELECT 
      ud.charity_id,
      SUM(ud.amount) as total_amount,
      COUNT(DISTINCT ud.user_id) as donor_count
    FROM public.user_donations ud
    JOIN public.profiles p ON ud.user_id = p.id
    WHERE p.tenant_id = p_tenant_id
      AND ud.donation_date BETWEEN p_period_start AND p_period_end
    GROUP BY ud.charity_id
    ORDER BY total_amount DESC
    LIMIT 5
  ) charity_totals
  JOIN public.charities c ON charity_totals.charity_id = c.id;
  
  -- Upsert network impact summary
  INSERT INTO public.network_impact_summary (
    tenant_id, period_type, period_start, period_end,
    total_families, total_donated, total_charities, total_projects, top_charities
  ) VALUES (
    p_tenant_id, p_period_type, p_period_start, p_period_end,
    total_families, total_donated, total_charities, total_projects, COALESCE(top_charities, '[]'::jsonb)
  ) ON CONFLICT (tenant_id, period_type, period_start, period_end) 
  DO UPDATE SET
    total_families = EXCLUDED.total_families,
    total_donated = EXCLUDED.total_donated,
    total_charities = EXCLUDED.total_charities,
    total_projects = EXCLUDED.total_projects,
    top_charities = EXCLUDED.top_charities,
    calculated_at = now();
END;
$$;

-- Insert default preferences for existing users
INSERT INTO public.user_impact_preferences (user_id)
SELECT id FROM public.profiles 
ON CONFLICT DO NOTHING;