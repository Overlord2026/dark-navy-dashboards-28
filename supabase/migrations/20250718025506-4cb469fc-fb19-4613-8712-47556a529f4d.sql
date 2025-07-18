-- Fix webhook status constraints for diagnostic tests

-- Add status constraint for webhook_configs
ALTER TABLE public.webhook_configs 
ADD CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'error'));

-- Add status constraint for webhook_deliveries  
ALTER TABLE public.webhook_deliveries 
ADD CONSTRAINT valid_status CHECK (status IN ('pending', 'delivered', 'failed'));