-- Analytics tables for project performance tracking
CREATE TABLE public.project_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  
  -- Performance metrics
  completion_percentage NUMERIC NOT NULL DEFAULT 0,
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  tasks_total INTEGER NOT NULL DEFAULT 0,
  milestones_completed INTEGER NOT NULL DEFAULT 0,
  milestones_total INTEGER NOT NULL DEFAULT 0,
  
  -- Time tracking
  estimated_hours NUMERIC DEFAULT 0,
  actual_hours NUMERIC DEFAULT 0,
  hours_variance NUMERIC GENERATED ALWAYS AS (actual_hours - estimated_hours) STORED,
  
  -- Budget tracking
  estimated_budget NUMERIC DEFAULT 0,
  actual_budget NUMERIC DEFAULT 0,
  budget_variance NUMERIC GENERATED ALWAYS AS (actual_budget - estimated_budget) STORED,
  
  -- Team metrics
  team_size INTEGER NOT NULL DEFAULT 0,
  active_team_members INTEGER NOT NULL DEFAULT 0,
  communication_frequency NUMERIC DEFAULT 0, -- messages per day
  
  -- Timeline metrics
  days_elapsed INTEGER NOT NULL DEFAULT 0,
  days_remaining INTEGER DEFAULT 0,
  schedule_variance NUMERIC DEFAULT 0, -- negative = behind, positive = ahead
  
  -- Quality metrics
  task_revision_rate NUMERIC DEFAULT 0,
  client_satisfaction_score NUMERIC DEFAULT 0,
  
  -- Metadata
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Team productivity analytics
CREATE TABLE public.team_productivity_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Task metrics
  tasks_assigned INTEGER NOT NULL DEFAULT 0,
  tasks_completed INTEGER NOT NULL DEFAULT 0,
  tasks_completion_rate NUMERIC GENERATED ALWAYS AS (
    CASE WHEN tasks_assigned > 0 THEN (tasks_completed::NUMERIC / tasks_assigned) * 100 ELSE 0 END
  ) STORED,
  
  -- Time metrics
  hours_logged NUMERIC NOT NULL DEFAULT 0,
  average_task_duration NUMERIC DEFAULT 0,
  productivity_score NUMERIC DEFAULT 0,
  
  -- Communication metrics
  messages_sent INTEGER NOT NULL DEFAULT 0,
  documents_shared INTEGER NOT NULL DEFAULT 0,
  meetings_attended INTEGER NOT NULL DEFAULT 0,
  
  -- Quality metrics
  task_revision_count INTEGER NOT NULL DEFAULT 0,
  client_feedback_score NUMERIC DEFAULT 0,
  
  -- Project involvement
  active_projects INTEGER NOT NULL DEFAULT 0,
  projects_completed INTEGER NOT NULL DEFAULT 0,
  
  -- Metadata
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id, period_start, period_end)
);

-- Resource utilization analytics
CREATE TABLE public.resource_utilization_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Overall metrics
  total_team_members INTEGER NOT NULL DEFAULT 0,
  active_team_members INTEGER NOT NULL DEFAULT 0,
  utilization_rate NUMERIC GENERATED ALWAYS AS (
    CASE WHEN total_team_members > 0 THEN (active_team_members::NUMERIC / total_team_members) * 100 ELSE 0 END
  ) STORED,
  
  -- Project distribution
  active_projects INTEGER NOT NULL DEFAULT 0,
  completed_projects INTEGER NOT NULL DEFAULT 0,
  overdue_projects INTEGER NOT NULL DEFAULT 0,
  
  -- Workload metrics
  total_hours_available NUMERIC NOT NULL DEFAULT 0,
  total_hours_allocated NUMERIC NOT NULL DEFAULT 0,
  total_hours_logged NUMERIC NOT NULL DEFAULT 0,
  capacity_utilization NUMERIC GENERATED ALWAYS AS (
    CASE WHEN total_hours_available > 0 THEN (total_hours_allocated / total_hours_available) * 100 ELSE 0 END
  ) STORED,
  
  -- Budget metrics
  total_budget_allocated NUMERIC NOT NULL DEFAULT 0,
  total_budget_spent NUMERIC NOT NULL DEFAULT 0,
  budget_utilization NUMERIC GENERATED ALWAYS AS (
    CASE WHEN total_budget_allocated > 0 THEN (total_budget_spent / total_budget_allocated) * 100 ELSE 0 END
  ) STORED,
  
  -- Quality metrics
  average_project_satisfaction NUMERIC DEFAULT 0,
  average_completion_rate NUMERIC DEFAULT 0,
  
  -- Metadata
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(tenant_id, period_start, period_end)
);

-- Real-time analytics events
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- 'project', 'task', 'milestone', 'user'
  entity_id UUID NOT NULL,
  user_id UUID,
  
  -- Event data
  event_data JSONB NOT NULL DEFAULT '{}',
  previous_data JSONB DEFAULT '{}',
  
  -- Metrics impact
  metrics_affected TEXT[] DEFAULT '{}',
  
  -- Metadata
  occurred_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Performance dashboards configuration
CREATE TABLE public.analytics_dashboards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  user_id UUID NOT NULL,
  
  -- Dashboard config
  dashboard_name TEXT NOT NULL,
  dashboard_type TEXT NOT NULL DEFAULT 'custom', -- 'default', 'custom', 'template'
  
  -- Layout and widgets
  layout_config JSONB NOT NULL DEFAULT '{}',
  widgets_config JSONB NOT NULL DEFAULT '[]',
  
  -- Sharing and permissions
  is_shared BOOLEAN NOT NULL DEFAULT false,
  shared_with UUID[] DEFAULT '{}',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_project_analytics_project_id ON public.project_analytics(project_id);
CREATE INDEX idx_project_analytics_tenant_id ON public.project_analytics(tenant_id);
CREATE INDEX idx_project_analytics_calculated_at ON public.project_analytics(calculated_at);

CREATE INDEX idx_team_productivity_user_id ON public.team_productivity_analytics(user_id);
CREATE INDEX idx_team_productivity_tenant_id ON public.team_productivity_analytics(tenant_id);
CREATE INDEX idx_team_productivity_period ON public.team_productivity_analytics(period_start, period_end);

CREATE INDEX idx_resource_utilization_tenant_id ON public.resource_utilization_analytics(tenant_id);
CREATE INDEX idx_resource_utilization_period ON public.resource_utilization_analytics(period_start, period_end);

CREATE INDEX idx_analytics_events_tenant_id ON public.analytics_events(tenant_id);
CREATE INDEX idx_analytics_events_entity ON public.analytics_events(entity_type, entity_id);
CREATE INDEX idx_analytics_events_occurred_at ON public.analytics_events(occurred_at);

CREATE INDEX idx_analytics_dashboards_tenant_id ON public.analytics_dashboards(tenant_id);
CREATE INDEX idx_analytics_dashboards_user_id ON public.analytics_dashboards(user_id);

-- RLS Policies
ALTER TABLE public.project_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_productivity_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_utilization_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_dashboards ENABLE ROW LEVEL SECURITY;

-- Project Analytics Policies
CREATE POLICY "Users can view project analytics in their tenant"
  ON public.project_analytics FOR SELECT
  USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "System can manage project analytics"
  ON public.project_analytics FOR ALL
  USING (tenant_id = get_current_user_tenant_id());

-- Team Productivity Policies
CREATE POLICY "Users can view team productivity in their tenant"
  ON public.team_productivity_analytics FOR SELECT
  USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can view their own productivity analytics"
  ON public.team_productivity_analytics FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can manage team productivity analytics"
  ON public.team_productivity_analytics FOR ALL
  USING (tenant_id = get_current_user_tenant_id());

-- Resource Utilization Policies
CREATE POLICY "Users can view resource utilization in their tenant"
  ON public.resource_utilization_analytics FOR SELECT
  USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Admins can manage resource utilization analytics"
  ON public.resource_utilization_analytics FOR ALL
  USING (tenant_id = get_current_user_tenant_id() AND has_any_role(ARRAY['admin', 'tenant_admin']));

-- Analytics Events Policies
CREATE POLICY "Users can view analytics events in their tenant"
  ON public.analytics_events FOR SELECT
  USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "System can insert analytics events"
  ON public.analytics_events FOR INSERT
  WITH CHECK (tenant_id = get_current_user_tenant_id());

-- Analytics Dashboards Policies
CREATE POLICY "Users can manage their own dashboards"
  ON public.analytics_dashboards FOR ALL
  USING (user_id = auth.uid() AND tenant_id = get_current_user_tenant_id());

CREATE POLICY "Users can view shared dashboards in their tenant"
  ON public.analytics_dashboards FOR SELECT
  USING (tenant_id = get_current_user_tenant_id() AND (is_shared = true OR auth.uid() = ANY(shared_with)));

-- Functions for analytics calculation
CREATE OR REPLACE FUNCTION public.calculate_project_analytics(p_project_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  project_record RECORD;
  tasks_completed INTEGER;
  tasks_total INTEGER;
  milestones_completed INTEGER;
  milestones_total INTEGER;
  team_size INTEGER;
  days_elapsed INTEGER;
  days_remaining INTEGER;
BEGIN
  -- Get project details
  SELECT * INTO project_record FROM public.projects WHERE id = p_project_id;
  
  IF project_record IS NULL THEN
    RETURN;
  END IF;
  
  -- Calculate task metrics
  SELECT COUNT(*) INTO tasks_total FROM public.project_tasks WHERE project_id = p_project_id;
  SELECT COUNT(*) INTO tasks_completed FROM public.project_tasks WHERE project_id = p_project_id AND status = 'completed';
  
  -- Calculate milestone metrics
  SELECT COUNT(*) INTO milestones_total FROM public.project_milestones WHERE project_id = p_project_id;
  SELECT COUNT(*) INTO milestones_completed FROM public.project_milestones WHERE project_id = p_project_id AND completed = true;
  
  -- Calculate team size
  SELECT array_length(assigned_team, 1) INTO team_size FROM public.projects WHERE id = p_project_id;
  team_size := COALESCE(team_size, 0);
  
  -- Calculate timeline metrics
  days_elapsed := EXTRACT(DAY FROM now() - project_record.created_at);
  IF project_record.due_date IS NOT NULL THEN
    days_remaining := EXTRACT(DAY FROM project_record.due_date::timestamp - now());
  END IF;
  
  -- Upsert analytics record
  INSERT INTO public.project_analytics (
    project_id, tenant_id, completion_percentage, tasks_completed, tasks_total,
    milestones_completed, milestones_total, team_size, days_elapsed, days_remaining,
    estimated_budget, actual_budget
  ) VALUES (
    p_project_id, project_record.tenant_id,
    CASE WHEN tasks_total > 0 THEN (tasks_completed::NUMERIC / tasks_total) * 100 ELSE 0 END,
    tasks_completed, tasks_total, milestones_completed, milestones_total,
    team_size, days_elapsed, days_remaining,
    COALESCE(project_record.budget, 0), 0
  ) ON CONFLICT (project_id) DO UPDATE SET
    completion_percentage = CASE WHEN EXCLUDED.tasks_total > 0 THEN (EXCLUDED.tasks_completed::NUMERIC / EXCLUDED.tasks_total) * 100 ELSE 0 END,
    tasks_completed = EXCLUDED.tasks_completed,
    tasks_total = EXCLUDED.tasks_total,
    milestones_completed = EXCLUDED.milestones_completed,
    milestones_total = EXCLUDED.milestones_total,
    team_size = EXCLUDED.team_size,
    days_elapsed = EXCLUDED.days_elapsed,
    days_remaining = EXCLUDED.days_remaining,
    calculated_at = now(),
    updated_at = now();
END;
$$;

-- Trigger to automatically update analytics
CREATE OR REPLACE FUNCTION public.trigger_analytics_update()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert analytics event
  INSERT INTO public.analytics_events (tenant_id, event_type, entity_type, entity_id, user_id, event_data)
  VALUES (
    COALESCE(NEW.tenant_id, OLD.tenant_id, get_current_user_tenant_id()),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    auth.uid(),
    CASE 
      WHEN TG_OP = 'INSERT' THEN to_jsonb(NEW)
      WHEN TG_OP = 'UPDATE' THEN to_jsonb(NEW)
      WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
    END
  );
  
  -- Update project analytics if applicable
  IF TG_TABLE_NAME IN ('projects', 'project_tasks', 'project_milestones') THEN
    PERFORM public.calculate_project_analytics(
      CASE 
        WHEN TG_TABLE_NAME = 'projects' THEN COALESCE(NEW.id, OLD.id)
        ELSE COALESCE(NEW.project_id, OLD.project_id)
      END
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create triggers for automatic analytics updates
CREATE TRIGGER projects_analytics_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.trigger_analytics_update();

CREATE TRIGGER tasks_analytics_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.project_tasks
  FOR EACH ROW EXECUTE FUNCTION public.trigger_analytics_update();

CREATE TRIGGER milestones_analytics_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.project_milestones
  FOR EACH ROW EXECUTE FUNCTION public.trigger_analytics_update();

-- Add missing project_id constraint to project_analytics if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'project_analytics_project_id_unique' 
    AND table_name = 'project_analytics'
  ) THEN
    ALTER TABLE public.project_analytics ADD CONSTRAINT project_analytics_project_id_unique UNIQUE (project_id);
  END IF;
END $$;

-- Enable realtime for analytics tables
ALTER TABLE public.project_analytics REPLICA IDENTITY FULL;
ALTER TABLE public.team_productivity_analytics REPLICA IDENTITY FULL;
ALTER TABLE public.resource_utilization_analytics REPLICA IDENTITY FULL;
ALTER TABLE public.analytics_events REPLICA IDENTITY FULL;