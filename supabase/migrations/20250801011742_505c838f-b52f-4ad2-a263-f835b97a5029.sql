-- Create market data cache table
CREATE TABLE public.market_data_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol TEXT NOT NULL,
  beta NUMERIC,
  alpha NUMERIC,
  volatility NUMERIC,
  yield NUMERIC,
  ytd_return NUMERIC,
  one_year_return NUMERIC,
  error_message TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(symbol)
);

-- Enable RLS
ALTER TABLE public.market_data_cache ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Service role can manage market data cache" 
ON public.market_data_cache 
FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "Users can read market data cache" 
ON public.market_data_cache 
FOR SELECT 
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_market_data_cache_symbol ON public.market_data_cache(symbol);
CREATE INDEX idx_market_data_cache_updated_at ON public.market_data_cache(updated_at);