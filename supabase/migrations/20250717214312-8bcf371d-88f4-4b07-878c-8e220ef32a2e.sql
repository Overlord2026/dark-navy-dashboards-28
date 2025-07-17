-- Create investment_strategies table with admin-editable fields
CREATE TABLE IF NOT EXISTS public.investment_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  strategy_type TEXT NOT NULL,
  risk_level TEXT,
  benchmark TEXT,
  minimum_investment TEXT,
  performance TEXT,
  allocation TEXT,
  manager TEXT,
  tags TEXT[],
  premium_locked BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  visibility_rules JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.investment_strategies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can view investment strategies" 
ON public.investment_strategies 
FOR SELECT USING (true);

CREATE POLICY "Only admins and advisors can edit investment strategies" 
ON public.investment_strategies 
FOR ALL 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'advisor', 'system_administrator')
);

-- Create strategy_engagement_tracking table
CREATE TABLE IF NOT EXISTS public.strategy_engagement_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  strategy_id UUID REFERENCES public.investment_strategies NOT NULL,
  event_type TEXT NOT NULL,
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB
);

-- Add Row Level Security
ALTER TABLE public.strategy_engagement_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own engagement" 
ON public.strategy_engagement_tracking 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can track their own engagement" 
ON public.strategy_engagement_tracking 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and advisors can view all engagements" 
ON public.strategy_engagement_tracking 
FOR SELECT 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'advisor', 'system_administrator')
);

-- Create educational_content table for linking to strategies
CREATE TABLE IF NOT EXISTS public.educational_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content_type TEXT NOT NULL,
  description TEXT,
  url TEXT,
  file_path TEXT,
  thumbnail_url TEXT,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.educational_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can view educational content" 
ON public.educational_content 
FOR SELECT USING (true);

CREATE POLICY "Only admins can edit educational content" 
ON public.educational_content 
FOR ALL 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'system_administrator')
);

-- Create strategy_educational_content table for many-to-many relationships
CREATE TABLE IF NOT EXISTS public.strategy_educational_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id UUID REFERENCES public.investment_strategies NOT NULL,
  content_id UUID REFERENCES public.educational_content NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(strategy_id, content_id)
);

-- Add Row Level Security
ALTER TABLE public.strategy_educational_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Everyone can view strategy content links" 
ON public.strategy_educational_content 
FOR SELECT USING (true);

CREATE POLICY "Only admins can manage strategy content links" 
ON public.strategy_educational_content 
FOR ALL 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('admin', 'system_administrator')
);

-- Create strategy_comparisons table for tracking comparisons
CREATE TABLE IF NOT EXISTS public.strategy_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  strategies UUID[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.strategy_comparisons ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own comparisons" 
ON public.strategy_comparisons 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own comparisons" 
ON public.strategy_comparisons 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Insert initial data from existing portfolio models
INSERT INTO public.investment_strategies (
  name, 
  description, 
  strategy_type, 
  risk_level, 
  benchmark, 
  performance, 
  allocation, 
  manager, 
  tags
)
VALUES
('Income Focus', 'Prioritizes stable income with lower volatility', 'Model', 'Low', 'Bloomberg Agg', '+5.8%', '20/80', 'Dimensional Fund Advisors', ARRAY['income', 'conservative']),
('Growth & Income', 'Balance between growth and stable income', 'Model', 'Medium', 'Blended Index', '+8.2%', '60/40', 'BlackRock', ARRAY['balanced', 'income']),
('Maximum Growth', 'Focus on long-term capital appreciation', 'Model', 'High', 'S&P 500', '+12.5%', '90/10', 'Vanguard', ARRAY['aggressive', 'growth']),
('Sustainable Future', 'ESG-focused investments with positive impact', 'Model', 'Medium', 'MSCI ESG Leaders', '+9.6%', '70/30', 'Alpha Architect', ARRAY['esg', 'sustainable']),
('Dynamic Allocation', 'Active management with tactical shifts', 'Model', 'Medium-High', 'Custom Blend', '+10.3%', '75/25', 'Boutique Family Office', ARRAY['tactical', 'active']),
('International Focus', 'Diversified exposure to global markets', 'Model', 'Medium', 'MSCI ACWI', '+7.8%', '80/20', 'BlackRock', ARRAY['global', 'international']);