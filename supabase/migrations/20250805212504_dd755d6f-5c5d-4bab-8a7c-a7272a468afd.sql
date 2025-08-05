-- Create onboarding flow progress tracking table
CREATE TABLE public.onboarding_flow_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_step INTEGER NOT NULL DEFAULT 0,
  total_steps INTEGER NOT NULL DEFAULT 10,
  progress_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  step_data JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned', 'paused')),
  last_active_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  abandonment_reminder_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.onboarding_flow_progress ENABLE ROW LEVEL SECURITY;

-- Create policies for onboarding flow progress
CREATE POLICY "Users can view their own onboarding flow progress" 
ON public.onboarding_flow_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own onboarding flow progress" 
ON public.onboarding_flow_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding flow progress" 
ON public.onboarding_flow_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_onboarding_flow_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.last_active_at = now();
  
  -- Mark as completed if progress is 100%
  IF NEW.progress_percentage >= 100 AND OLD.completed_at IS NULL THEN
    NEW.completed_at = now();
    NEW.status = 'completed';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER SET search_path = '';

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_onboarding_flow_progress_timestamp
BEFORE UPDATE ON public.onboarding_flow_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_onboarding_flow_progress_timestamp();

-- Create index for better query performance
CREATE INDEX idx_onboarding_flow_progress_user_id ON public.onboarding_flow_progress(user_id);
CREATE INDEX idx_onboarding_flow_progress_status ON public.onboarding_flow_progress(status);
CREATE INDEX idx_onboarding_flow_progress_last_active ON public.onboarding_flow_progress(last_active_at);