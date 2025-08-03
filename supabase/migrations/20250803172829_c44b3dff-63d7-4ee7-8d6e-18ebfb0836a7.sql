-- Fix foreign key relationships for attorney client portal tables
-- Add foreign key constraints to link client_id to profiles table

-- Add foreign key constraint to attorney_client_links
ALTER TABLE public.attorney_client_links 
ADD CONSTRAINT fk_attorney_client_links_client_id 
FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key constraint to attorney_client_links for attorney_id
ALTER TABLE public.attorney_client_links 
ADD CONSTRAINT fk_attorney_client_links_attorney_id 
FOREIGN KEY (attorney_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key constraint to attorney_client_messages
ALTER TABLE public.attorney_client_messages 
ADD CONSTRAINT fk_attorney_client_messages_client_id 
FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.attorney_client_messages 
ADD CONSTRAINT fk_attorney_client_messages_attorney_id 
FOREIGN KEY (attorney_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.attorney_client_messages 
ADD CONSTRAINT fk_attorney_client_messages_sender_id 
FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key constraint to attorney_client_shared_documents
ALTER TABLE public.attorney_client_shared_documents 
ADD CONSTRAINT fk_attorney_client_shared_documents_client_id 
FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.attorney_client_shared_documents 
ADD CONSTRAINT fk_attorney_client_shared_documents_attorney_id 
FOREIGN KEY (attorney_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.attorney_client_shared_documents 
ADD CONSTRAINT fk_attorney_client_shared_documents_shared_by 
FOREIGN KEY (shared_by) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key constraint to client_portal_notifications
ALTER TABLE public.client_portal_notifications 
ADD CONSTRAINT fk_client_portal_notifications_client_id 
FOREIGN KEY (client_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.client_portal_notifications 
ADD CONSTRAINT fk_client_portal_notifications_attorney_id 
FOREIGN KEY (attorney_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Add foreign key constraint to attorney_dashboard_metrics
ALTER TABLE public.attorney_dashboard_metrics 
ADD CONSTRAINT fk_attorney_dashboard_metrics_attorney_id 
FOREIGN KEY (attorney_id) REFERENCES public.profiles(id) ON DELETE CASCADE;