-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule cleanup job to run daily at 2 AM UTC
SELECT cron.schedule(
  'cleanup-expired-records-daily',
  '0 2 * * *', -- Daily at 2:00 AM UTC
  $$
  SELECT
    net.http_post(
        url:='https://xcmqjkvyvuhoslbzmlgi.supabase.co/functions/v1/cleanup-expired-records',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjbXFqa3Z5dnVob3NsYnptbGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjQ5MjUsImV4cCI6MjA2MjA0MDkyNX0.x0UM2ezINls7QytsvURR5zYitUiZ52G8Pl5s78ILDfU"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);

-- Schedule weekly comprehensive cleanup on Sundays at 3 AM UTC
SELECT cron.schedule(
  'cleanup-expired-records-weekly',
  '0 3 * * 0', -- Weekly on Sunday at 3:00 AM UTC  
  $$
  SELECT
    net.http_post(
        url:='https://xcmqjkvyvuhoslbzmlgi.supabase.co/functions/v1/cleanup-expired-records',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjbXFqa3Z5dnVob3NsYnptbGdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjQ5MjUsImV4cCI6MjA2MjA0MDkyNX0.x0UM2ezINls7QytsvURR5zYitUiZ52G8Pl5s78ILDfU"}'::jsonb,
        body:='{"scheduled": true, "comprehensive": true}'::jsonb
    ) as request_id;
  $$
);