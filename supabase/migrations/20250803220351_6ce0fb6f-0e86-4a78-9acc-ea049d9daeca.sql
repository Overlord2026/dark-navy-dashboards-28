-- Create billing and invoices tables for real billing data
CREATE TABLE public.billing_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_revenue NUMERIC NOT NULL DEFAULT 0,
  paid_revenue NUMERIC NOT NULL DEFAULT 0,
  pending_revenue NUMERIC NOT NULL DEFAULT 0,
  invoice_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.client_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID NOT NULL,
  client_name TEXT NOT NULL,
  client_id UUID,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  invoice_number TEXT UNIQUE NOT NULL,
  due_date DATE,
  paid_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create portfolio performance tracking
CREATE TABLE public.portfolio_performance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  account_id UUID,
  sector TEXT NOT NULL,
  allocation_percentage NUMERIC NOT NULL DEFAULT 0,
  performance_percentage NUMERIC NOT NULL DEFAULT 0,
  value_amount NUMERIC NOT NULL DEFAULT 0,
  benchmark_performance NUMERIC,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create professional dashboard metrics
CREATE TABLE public.professional_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tenant_id UUID NOT NULL,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC NOT NULL DEFAULT 0,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.billing_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can manage their own billing metrics"
ON public.billing_metrics
FOR ALL
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own invoices"
ON public.client_invoices
FOR ALL
USING (user_id = auth.uid());

CREATE POLICY "Users can view their own portfolio performance"
ON public.portfolio_performance
FOR ALL
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own professional metrics"
ON public.professional_metrics
FOR ALL
USING (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_billing_metrics_user_date ON public.billing_metrics(user_id, period_start, period_end);
CREATE INDEX idx_client_invoices_user_status ON public.client_invoices(user_id, status);
CREATE INDEX idx_portfolio_performance_user_period ON public.portfolio_performance(user_id, period_start, period_end);
CREATE INDEX idx_professional_metrics_user_type_date ON public.professional_metrics(user_id, metric_type, metric_date);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_billing_metrics_updated_at
  BEFORE UPDATE ON public.billing_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_invoices_updated_at
  BEFORE UPDATE ON public.client_invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_performance_updated_at
  BEFORE UPDATE ON public.portfolio_performance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professional_metrics_updated_at
  BEFORE UPDATE ON public.professional_metrics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.billing_metrics;
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.portfolio_performance;
ALTER PUBLICATION supabase_realtime ADD TABLE public.professional_metrics;