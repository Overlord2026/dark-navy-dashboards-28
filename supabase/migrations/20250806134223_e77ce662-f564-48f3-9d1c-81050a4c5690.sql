-- Create tables for new lending features

-- SMS status alerts for lending applications
CREATE TABLE IF NOT EXISTS public.lending_sms_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  application_id UUID,
  phone_number TEXT NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('status_update', 'approval', 'rejection', 'document_needed', 'offer_ready')),
  message TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lending_sms_alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies for SMS alerts
CREATE POLICY "Users can view their own SMS alerts" ON public.lending_sms_alerts
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Service can create SMS alerts" ON public.lending_sms_alerts
FOR INSERT WITH CHECK (true);

-- Advisor commission/revenue share tracker
CREATE TABLE IF NOT EXISTS public.advisor_lending_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID NOT NULL,
  loan_application_id UUID,
  lender_partner_id UUID,
  commission_type TEXT NOT NULL CHECK (commission_type IN ('flat_fee', 'percentage', 'tiered', 'performance_bonus')),
  commission_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  commission_percentage NUMERIC(5,4),
  loan_amount NUMERIC(12,2),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'paid', 'declined')),
  payment_date DATE,
  commission_tier TEXT,
  performance_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.advisor_lending_commissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for commissions
CREATE POLICY "Advisors can view their own commissions" ON public.advisor_lending_commissions
FOR SELECT USING (advisor_id = auth.uid());

CREATE POLICY "Admins can manage all commissions" ON public.advisor_lending_commissions
FOR ALL USING (has_any_role(ARRAY['admin', 'system_administrator', 'tenant_admin']));

-- Lender rating/review system
CREATE TABLE IF NOT EXISTS public.lender_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  lender_partner_id UUID NOT NULL,
  loan_application_id UUID,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_title TEXT,
  review_text TEXT,
  loan_type TEXT,
  loan_amount NUMERIC(12,2),
  approval_speed_rating INTEGER CHECK (approval_speed_rating >= 1 AND approval_speed_rating <= 5),
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  terms_satisfaction_rating INTEGER CHECK (terms_satisfaction_rating >= 1 AND terms_satisfaction_rating <= 5),
  would_recommend BOOLEAN,
  is_verified BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  helpful_votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lender_reviews ENABLE ROW LEVEL SECURITY;

-- RLS policies for reviews
CREATE POLICY "Users can create their own reviews" ON public.lender_reviews
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reviews" ON public.lender_reviews
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Anyone can view published reviews" ON public.lender_reviews
FOR SELECT USING (is_published = true);

-- Scenario planning for loan payments
CREATE TABLE IF NOT EXISTS public.loan_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  loan_application_id UUID,
  scenario_name TEXT NOT NULL,
  base_loan_amount NUMERIC(12,2) NOT NULL,
  base_interest_rate NUMERIC(5,4) NOT NULL,
  base_term_months INTEGER NOT NULL,
  scenario_type TEXT NOT NULL CHECK (scenario_type IN ('early_payoff', 'extra_payments', 'rate_change', 'refinance', 'comparison')),
  scenario_parameters JSONB NOT NULL DEFAULT '{}',
  calculated_results JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.loan_scenarios ENABLE ROW LEVEL SECURITY;

-- RLS policies for scenarios
CREATE POLICY "Users can manage their own scenarios" ON public.loan_scenarios
FOR ALL USING (user_id = auth.uid());

-- PDF exports for lending offers
CREATE TABLE IF NOT EXISTS public.lending_pdf_exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  export_type TEXT NOT NULL CHECK (export_type IN ('offers_summary', 'application_package', 'comparison_report', 'scenario_analysis')),
  loan_application_ids UUID[] DEFAULT '{}',
  lender_partner_ids UUID[] DEFAULT '{}',
  scenario_ids UUID[] DEFAULT '{}',
  pdf_content JSONB NOT NULL DEFAULT '{}',
  file_url TEXT,
  file_size BIGINT,
  export_status TEXT NOT NULL DEFAULT 'generating' CHECK (export_status IN ('generating', 'ready', 'failed', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '7 days'),
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.lending_pdf_exports ENABLE ROW LEVEL SECURITY;

-- RLS policies for PDF exports
CREATE POLICY "Users can manage their own PDF exports" ON public.lending_pdf_exports
FOR ALL USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_lending_sms_alerts_user_id ON public.lending_sms_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_lending_sms_alerts_created_at ON public.lending_sms_alerts(created_at);

CREATE INDEX IF NOT EXISTS idx_advisor_lending_commissions_advisor_id ON public.advisor_lending_commissions(advisor_id);
CREATE INDEX IF NOT EXISTS idx_advisor_lending_commissions_payment_status ON public.advisor_lending_commissions(payment_status);

CREATE INDEX IF NOT EXISTS idx_lender_reviews_lender_partner_id ON public.lender_reviews(lender_partner_id);
CREATE INDEX IF NOT EXISTS idx_lender_reviews_rating ON public.lender_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_lender_reviews_published ON public.lender_reviews(is_published);

CREATE INDEX IF NOT EXISTS idx_loan_scenarios_user_id ON public.loan_scenarios(user_id);
CREATE INDEX IF NOT EXISTS idx_loan_scenarios_type ON public.loan_scenarios(scenario_type);

CREATE INDEX IF NOT EXISTS idx_lending_pdf_exports_user_id ON public.lending_pdf_exports(user_id);
CREATE INDEX IF NOT EXISTS idx_lending_pdf_exports_status ON public.lending_pdf_exports(export_status);

-- Function to calculate loan payment scenarios
CREATE OR REPLACE FUNCTION public.calculate_loan_scenario(
  p_loan_amount NUMERIC,
  p_interest_rate NUMERIC,
  p_term_months INTEGER,
  p_scenario_type TEXT,
  p_scenario_params JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  monthly_payment NUMERIC;
  total_interest NUMERIC;
  total_payments NUMERIC;
  extra_payment NUMERIC;
  payoff_months INTEGER;
  interest_saved NUMERIC;
  result JSONB;
BEGIN
  -- Calculate base monthly payment
  monthly_payment := (p_loan_amount * (p_interest_rate / 12)) / 
                    (1 - POWER(1 + (p_interest_rate / 12), -p_term_months));
  
  total_payments := monthly_payment * p_term_months;
  total_interest := total_payments - p_loan_amount;
  
  -- Handle different scenario types
  CASE p_scenario_type
    WHEN 'early_payoff' THEN
      extra_payment := COALESCE((p_scenario_params->>'extra_monthly_payment')::NUMERIC, 0);
      
      -- Calculate payoff time with extra payments (simplified calculation)
      IF extra_payment > 0 THEN
        payoff_months := LEAST(p_term_months, 
          CEIL(-LOG(1 - (p_loan_amount * (p_interest_rate / 12)) / (monthly_payment + extra_payment)) / 
               LOG(1 + (p_interest_rate / 12))));
        interest_saved := total_interest - ((monthly_payment + extra_payment) * payoff_months - p_loan_amount);
      ELSE
        payoff_months := p_term_months;
        interest_saved := 0;
      END IF;
      
      result := jsonb_build_object(
        'base_monthly_payment', round(monthly_payment, 2),
        'with_extra_payment', round(monthly_payment + extra_payment, 2),
        'original_payoff_months', p_term_months,
        'new_payoff_months', payoff_months,
        'months_saved', p_term_months - payoff_months,
        'total_interest_saved', round(interest_saved, 2),
        'original_total_interest', round(total_interest, 2)
      );
      
    WHEN 'extra_payments' THEN
      extra_payment := COALESCE((p_scenario_params->>'annual_extra_payment')::NUMERIC, 0) / 12;
      
      result := jsonb_build_object(
        'base_monthly_payment', round(monthly_payment, 2),
        'monthly_extra_payment', round(extra_payment, 2),
        'total_monthly_payment', round(monthly_payment + extra_payment, 2),
        'annual_extra_payment', round(extra_payment * 12, 2)
      );
      
    ELSE
      result := jsonb_build_object(
        'monthly_payment', round(monthly_payment, 2),
        'total_payments', round(total_payments, 2),
        'total_interest', round(total_interest, 2),
        'loan_amount', p_loan_amount,
        'interest_rate', p_interest_rate,
        'term_months', p_term_months
      );
  END CASE;
  
  RETURN result;
END;
$$;