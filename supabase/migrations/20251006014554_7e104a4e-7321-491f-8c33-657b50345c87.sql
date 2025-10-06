-- Add rich visual and tracking fields to user_goals table
ALTER TABLE public.user_goals 
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS aspirational_description text,
ADD COLUMN IF NOT EXISTS priority text DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS monthly_contribution numeric(10,2),
ADD COLUMN IF NOT EXISTS smartr_data jsonb DEFAULT '{}'::jsonb;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_goals_priority ON public.user_goals(priority);
CREATE INDEX IF NOT EXISTS idx_user_goals_target_date ON public.user_goals(target_date);

-- Add helpful comments
COMMENT ON COLUMN public.user_goals.image_url IS 'URL to goal image (Greece, house, etc.)';
COMMENT ON COLUMN public.user_goals.aspirational_description IS 'Rich, emotional description of the goal';
COMMENT ON COLUMN public.user_goals.priority IS 'low, medium, high, or top_aspiration';
COMMENT ON COLUMN public.user_goals.smartr_data IS 'SMARTR framework: specific, measurable, achievable, relevant, time-bound, rewards';