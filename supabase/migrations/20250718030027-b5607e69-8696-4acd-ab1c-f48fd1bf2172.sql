-- Add tenant_id to webhook_deliveries for multi-tenant isolation

ALTER TABLE public.webhook_deliveries 
ADD COLUMN tenant_id UUID REFERENCES public.tenants(id);