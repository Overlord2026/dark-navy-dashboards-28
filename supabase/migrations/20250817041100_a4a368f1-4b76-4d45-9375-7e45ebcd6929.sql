-- Create edge function for accessibility pass automation
CREATE OR REPLACE FUNCTION log_accessibility_event(
  p_event_type text,
  p_page_url text,
  p_violations jsonb DEFAULT '[]'::jsonb,
  p_score numeric DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  event_id uuid;
BEGIN
  INSERT INTO security_audit_logs (
    event_type,
    severity,
    details,
    user_id,
    created_at
  ) VALUES (
    'accessibility_' || p_event_type,
    CASE 
      WHEN array_length(array(SELECT jsonb_array_elements(p_violations)), 1) > 0 THEN 'warning'
      ELSE 'info'
    END,
    jsonb_build_object(
      'page_url', p_page_url,
      'violations', p_violations,
      'score', p_score,
      'user_agent', p_user_agent,
      'timestamp', now()
    ),
    auth.uid(),
    now()
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- Create function for performance monitoring
CREATE OR REPLACE FUNCTION log_performance_metric(
  p_metric_name text,
  p_metric_value numeric,
  p_page_url text,
  p_threshold numeric DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  event_id uuid;
  is_threshold_exceeded boolean;
BEGIN
  is_threshold_exceeded := p_threshold IS NOT NULL AND p_metric_value > p_threshold;
  
  INSERT INTO security_audit_logs (
    event_type,
    severity,
    details,
    user_id,
    created_at
  ) VALUES (
    'performance_' || p_metric_name,
    CASE 
      WHEN is_threshold_exceeded THEN 'warning'
      ELSE 'info'
    END,
    jsonb_build_object(
      'metric_name', p_metric_name,
      'metric_value', p_metric_value,
      'page_url', p_page_url,
      'threshold', p_threshold,
      'threshold_exceeded', is_threshold_exceeded,
      'metadata', p_metadata,
      'timestamp', now()
    ),
    auth.uid(),
    now()
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- Create function for button audit logging
CREATE OR REPLACE FUNCTION log_button_audit(
  p_page_url text,
  p_total_buttons integer,
  p_async_buttons integer,
  p_accessible_buttons integer,
  p_testable_buttons integer,
  p_violations jsonb DEFAULT '[]'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  event_id uuid;
  compliance_rate numeric;
BEGIN
  compliance_rate := CASE 
    WHEN p_total_buttons > 0 THEN (p_accessible_buttons::numeric / p_total_buttons::numeric) * 100
    ELSE 100
  END;
  
  INSERT INTO security_audit_logs (
    event_type,
    severity,
    details,
    user_id,
    created_at
  ) VALUES (
    'button_audit',
    CASE 
      WHEN compliance_rate < 90 THEN 'warning'
      WHEN compliance_rate < 100 THEN 'info'
      ELSE 'info'
    END,
    jsonb_build_object(
      'page_url', p_page_url,
      'total_buttons', p_total_buttons,
      'async_buttons', p_async_buttons,
      'accessible_buttons', p_accessible_buttons,
      'testable_buttons', p_testable_buttons,
      'compliance_rate', compliance_rate,
      'violations', p_violations,
      'timestamp', now()
    ),
    auth.uid(),
    now()
  ) RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;