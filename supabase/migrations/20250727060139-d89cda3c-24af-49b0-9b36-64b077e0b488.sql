-- Create tax planning analytics table
CREATE TABLE public.tax_planning_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_context TEXT,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tax_planning_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own analytics" 
ON public.tax_planning_analytics 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert analytics" 
ON public.tax_planning_analytics 
FOR INSERT 
WITH CHECK (auth.role() = 'service_role');

-- Create index for performance
CREATE INDEX idx_tax_planning_analytics_user_id ON public.tax_planning_analytics(user_id);
CREATE INDEX idx_tax_planning_analytics_event_type ON public.tax_planning_analytics(event_type);
CREATE INDEX idx_tax_planning_analytics_created_at ON public.tax_planning_analytics(created_at);

-- Create tax documents table
CREATE TABLE public.tax_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  professional_id UUID REFERENCES auth.users(id),
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  category TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  encrypted_key TEXT,
  upload_status TEXT NOT NULL DEFAULT 'uploading',
  shared_with_professional BOOLEAN DEFAULT false,
  shared_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tax_documents ENABLE ROW LEVEL SECURITY;

-- Create policies for tax documents
CREATE POLICY "Users can manage their own tax documents" 
ON public.tax_documents 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Professionals can view shared documents" 
ON public.tax_documents 
FOR SELECT 
USING (auth.uid() = professional_id AND shared_with_professional = true);

-- Create trigger for updated_at
CREATE TRIGGER update_tax_documents_updated_at
BEFORE UPDATE ON public.tax_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Create indexes
CREATE INDEX idx_tax_documents_user_id ON public.tax_documents(user_id);
CREATE INDEX idx_tax_documents_professional_id ON public.tax_documents(professional_id);
CREATE INDEX idx_tax_documents_category ON public.tax_documents(category);

-- Create tax professionals table
CREATE TABLE public.tax_professionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  professional_name TEXT NOT NULL,
  credentials TEXT[] NOT NULL DEFAULT '{}',
  specialties TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  location TEXT,
  hourly_rate NUMERIC,
  years_experience INTEGER,
  verified BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  available_for_new_clients BOOLEAN DEFAULT true,
  scheduling_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tax_professionals ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view verified professionals" 
ON public.tax_professionals 
FOR SELECT 
USING (verified = true AND available_for_new_clients = true);

CREATE POLICY "Professionals can manage their own profile" 
ON public.tax_professionals 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all professional profiles" 
ON public.tax_professionals 
FOR ALL 
USING (has_any_role(ARRAY['admin', 'system_administrator']));

-- Create indexes
CREATE INDEX idx_tax_professionals_user_id ON public.tax_professionals(user_id);
CREATE INDEX idx_tax_professionals_verified ON public.tax_professionals(verified);
CREATE INDEX idx_tax_professionals_specialties ON public.tax_professionals USING GIN(specialties);

-- Create trigger for updated_at
CREATE TRIGGER update_tax_professionals_updated_at
BEFORE UPDATE ON public.tax_professionals
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();

-- Create professional client connections table
CREATE TABLE public.professional_client_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL REFERENCES public.tax_professionals(id),
  client_id UUID NOT NULL REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  connection_type TEXT NOT NULL DEFAULT 'consultation',
  initial_message TEXT,
  professional_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(professional_id, client_id)
);

-- Enable RLS
ALTER TABLE public.professional_client_connections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own connections" 
ON public.professional_client_connections 
FOR SELECT 
USING (auth.uid() = client_id OR auth.uid() = (SELECT user_id FROM public.tax_professionals WHERE id = professional_id));

CREATE POLICY "Users can create connection requests" 
ON public.professional_client_connections 
FOR INSERT 
WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Professionals can update their connections" 
ON public.professional_client_connections 
FOR UPDATE 
USING (auth.uid() = (SELECT user_id FROM public.tax_professionals WHERE id = professional_id));

-- Create indexes
CREATE INDEX idx_professional_client_connections_professional_id ON public.professional_client_connections(professional_id);
CREATE INDEX idx_professional_client_connections_client_id ON public.professional_client_connections(client_id);

-- Create trigger for updated_at
CREATE TRIGGER update_professional_client_connections_updated_at
BEFORE UPDATE ON public.professional_client_connections
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();