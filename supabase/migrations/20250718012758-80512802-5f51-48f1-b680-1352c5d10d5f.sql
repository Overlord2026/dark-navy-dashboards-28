-- Add status columns and constraints for webhook tables

-- Add status column to webhook_configs (replacing is_active with enum-based status)
ALTER TABLE public.webhook_configs 
ADD COLUMN status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error'));

-- Add status column to webhook_deliveries (in addition to response_status for delivery status)
ALTER TABLE public.webhook_deliveries 
ADD COLUMN status text DEFAULT 'pending' CHECK (status IN ('pending', 'delivered', 'failed'));

-- Update existing records to have proper status values
UPDATE public.webhook_configs 
SET status = CASE 
  WHEN is_active = true THEN 'active'
  ELSE 'inactive'
END;

-- Update existing webhook_deliveries based on response_status
UPDATE public.webhook_deliveries 
SET status = CASE 
  WHEN response_status >= 200 AND response_status < 300 THEN 'delivered'
  WHEN response_status IS NULL THEN 'pending'
  ELSE 'failed'
END;