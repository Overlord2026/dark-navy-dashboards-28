-- Insert test data for cleanup verification

-- Insert expired OTP codes (some expired, some used)
INSERT INTO public.user_otp_codes (user_id, otp_code, expires_at, is_used, attempts) VALUES
  ('00000000-0000-0000-0000-000000000001', '123456', NOW() - INTERVAL '1 hour', false, 1),
  ('00000000-0000-0000-0000-000000000002', '654321', NOW() - INTERVAL '2 days', false, 2),
  ('00000000-0000-0000-0000-000000000003', '789012', NOW() + INTERVAL '5 minutes', true, 1),
  ('00000000-0000-0000-0000-000000000004', '345678', NOW() + INTERVAL '1 hour', false, 0);

-- Insert old webhook deliveries (some old, some recent)
INSERT INTO public.webhook_deliveries (webhook_config_id, event_type, payload, response_status, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'user.created', '{"test": "old"}', 200, NOW() - INTERVAL '45 days'),
  ('00000000-0000-0000-0000-000000000002', 'user.updated', '{"test": "very_old"}', 200, NOW() - INTERVAL '60 days'),
  ('00000000-0000-0000-0000-000000000003', 'user.deleted', '{"test": "recent"}', 200, NOW() - INTERVAL '5 days');

-- Insert old tracked events (some old, some recent)
INSERT INTO public.tracked_events (user_id, event_type, event_data, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'page_view', '{"page": "/old"}', NOW() - INTERVAL '100 days'),
  ('00000000-0000-0000-0000-000000000002', 'button_click', '{"button": "old_button"}', NOW() - INTERVAL '120 days'),
  ('00000000-0000-0000-0000-000000000003', 'form_submit', '{"form": "recent_form"}', NOW() - INTERVAL '10 days');