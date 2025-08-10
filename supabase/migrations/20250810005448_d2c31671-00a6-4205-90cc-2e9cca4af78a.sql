-- Create launch checklist tables for Founding 20 campaign
CREATE TABLE IF NOT EXISTS public.launch_checklist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week TEXT NOT NULL,
  segment TEXT NOT NULL,        -- 'sports', 'longevity', 'ria'
  tier TEXT NOT NULL,           -- 'gold', 'silver', 'bronze'
  target_name TEXT NOT NULL,
  target_type TEXT,             -- 'organization', 'individual', 'company'
  key_actions TEXT[] DEFAULT '{}',
  owner TEXT,
  status TEXT DEFAULT 'not_started',  -- 'not_started', 'in_progress', 'complete'
  notes TEXT,
  assigned_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.launch_checklist_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment TEXT NOT NULL,
  tier TEXT NOT NULL,
  week TEXT NOT NULL,
  total_items INTEGER DEFAULT 0,
  completed_items INTEGER DEFAULT 0,
  completion_percentage DECIMAL(5,2) DEFAULT 0.00,
  last_updated TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.launch_digest_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  digest_type TEXT NOT NULL,    -- 'weekly', 'daily', 'milestone'
  recipients TEXT[] DEFAULT '{}',
  content JSONB DEFAULT '{}',
  sent_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'sent'    -- 'sent', 'failed', 'pending'
);

-- Enable RLS
ALTER TABLE public.launch_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.launch_checklist_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.launch_digest_log ENABLE ROW LEVEL SECURITY;

-- Create policies (admin/ops access)
CREATE POLICY "Admin access to checklist items" ON public.launch_checklist_items
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin access to progress tracking" ON public.launch_checklist_progress
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin access to digest logs" ON public.launch_digest_log
  FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_checklist_segment_status ON public.launch_checklist_items(segment, status);
CREATE INDEX IF NOT EXISTS idx_checklist_week_tier ON public.launch_checklist_items(week, tier);
CREATE INDEX IF NOT EXISTS idx_progress_segment_week ON public.launch_checklist_progress(segment, week);

-- Create function to update progress automatically
CREATE OR REPLACE FUNCTION public.update_checklist_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Update progress for the affected segment/tier/week
  INSERT INTO public.launch_checklist_progress (segment, tier, week, total_items, completed_items, completion_percentage)
  SELECT 
    segment,
    tier,
    week,
    COUNT(*) as total_items,
    COUNT(*) FILTER (WHERE status = 'complete') as completed_items,
    CASE 
      WHEN COUNT(*) > 0 THEN ROUND((COUNT(*) FILTER (WHERE status = 'complete') * 100.0 / COUNT(*)), 2)
      ELSE 0.00
    END as completion_percentage
  FROM public.launch_checklist_items
  WHERE segment = COALESCE(NEW.segment, OLD.segment)
    AND tier = COALESCE(NEW.tier, OLD.tier)
    AND week = COALESCE(NEW.week, OLD.week)
  GROUP BY segment, tier, week
  ON CONFLICT (segment, tier, week) DO UPDATE SET
    total_items = EXCLUDED.total_items,
    completed_items = EXCLUDED.completed_items,
    completion_percentage = EXCLUDED.completion_percentage,
    last_updated = now();
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

-- Create trigger to auto-update progress
CREATE TRIGGER update_checklist_progress_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.launch_checklist_items
  FOR EACH ROW EXECUTE FUNCTION public.update_checklist_progress();

-- Add unique constraint for progress tracking
ALTER TABLE public.launch_checklist_progress 
ADD CONSTRAINT unique_progress_segment_tier_week UNIQUE (segment, tier, week);