-- Create firms table for multi-tenant seat licensing
CREATE TABLE public.firms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  type TEXT NOT NULL DEFAULT 'RIA', -- RIA, CPA, Law, Health, Property, etc.
  seats_purchased INTEGER NOT NULL DEFAULT 0,
  seats_in_use INTEGER NOT NULL DEFAULT 0,
  subscription_status TEXT NOT NULL DEFAULT 'trial', -- trial, active, suspended, cancelled
  billing_email TEXT NOT NULL,
  marketplace_visibility BOOLEAN NOT NULL DEFAULT true,
  branding_enabled BOOLEAN NOT NULL DEFAULT false,
  custom_domain TEXT,
  primary_color TEXT,
  secondary_color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create professional_users table for seat assignments
CREATE TABLE public.professional_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  firm_id UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'advisor', -- advisor, cpa, attorney, health, concierge, assistant, etc.
  status TEXT NOT NULL DEFAULT 'invited', -- invited, active, suspended
  assigned_clients INTEGER NOT NULL DEFAULT 0,
  profile_url TEXT,
  phone TEXT,
  bio TEXT,
  specialties TEXT[],
  certifications TEXT[],
  onboarded_at TIMESTAMP WITH TIME ZONE,
  last_active_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create seat_assignments table to track seat usage
CREATE TABLE public.seat_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  firm_id UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  professional_user_id UUID NOT NULL REFERENCES public.professional_users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active', -- active, pending, suspended, expired
  assigned_by UUID REFERENCES public.professional_users(id),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(firm_id, professional_user_id)
);

-- Create subscriptions table for billing
CREATE TABLE public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  firm_id UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL DEFAULT 'professional',
  price_per_seat NUMERIC NOT NULL DEFAULT 99.00,
  seats INTEGER NOT NULL DEFAULT 1,
  billing_cycle TEXT NOT NULL DEFAULT 'monthly', -- monthly, annual
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  next_billing_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '1 month'),
  status TEXT NOT NULL DEFAULT 'active', -- active, cancelled, past_due, unpaid
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create client_assignments table to track which clients are assigned to which professionals
CREATE TABLE public.client_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  firm_id UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  professional_user_id UUID NOT NULL REFERENCES public.professional_users(id) ON DELETE CASCADE,
  client_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL DEFAULT 'primary', -- primary, secondary, service_rep, specialist
  assigned_by UUID REFERENCES public.professional_users(id),
  assigned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(professional_user_id, client_user_id)
);

-- Create firm_invitations table for onboarding new firms
CREATE TABLE public.firm_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  firm_name TEXT NOT NULL,
  admin_email TEXT NOT NULL,
  admin_name TEXT NOT NULL,
  firm_type TEXT NOT NULL,
  seats_requested INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'sent', -- sent, accepted, expired
  invite_token TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  invited_by UUID,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seat_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.firm_invitations ENABLE ROW LEVEL SECURITY;

-- Create helper function to get current user's firm
CREATE OR REPLACE FUNCTION public.get_current_user_firm_id()
RETURNS UUID AS $$
  SELECT firm_id FROM public.professional_users WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create helper function to check if user is firm admin
CREATE OR REPLACE FUNCTION public.is_firm_admin()
RETURNS BOOLEAN AS $$
  SELECT role IN ('admin', 'owner') FROM public.professional_users WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for firms
CREATE POLICY "Users can view their firm" 
ON public.firms FOR SELECT 
USING (id = get_current_user_firm_id());

CREATE POLICY "Firm admins can update their firm" 
ON public.firms FOR UPDATE 
USING (id = get_current_user_firm_id() AND is_firm_admin());

-- RLS Policies for professional_users
CREATE POLICY "Users can view professionals in their firm" 
ON public.professional_users FOR SELECT 
USING (firm_id = get_current_user_firm_id());

CREATE POLICY "Firm admins can manage professional users" 
ON public.professional_users FOR ALL 
USING (firm_id = get_current_user_firm_id() AND is_firm_admin());

CREATE POLICY "Users can update their own profile" 
ON public.professional_users FOR UPDATE 
USING (user_id = auth.uid());

-- RLS Policies for seat_assignments
CREATE POLICY "Users can view seat assignments in their firm" 
ON public.seat_assignments FOR SELECT 
USING (firm_id = get_current_user_firm_id());

CREATE POLICY "Firm admins can manage seat assignments" 
ON public.seat_assignments FOR ALL 
USING (firm_id = get_current_user_firm_id() AND is_firm_admin());

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their firm's subscription" 
ON public.subscriptions FOR SELECT 
USING (firm_id = get_current_user_firm_id());

CREATE POLICY "Firm admins can manage subscriptions" 
ON public.subscriptions FOR ALL 
USING (firm_id = get_current_user_firm_id() AND is_firm_admin());

-- RLS Policies for client_assignments
CREATE POLICY "Users can view client assignments in their firm" 
ON public.client_assignments FOR SELECT 
USING (firm_id = get_current_user_firm_id());

CREATE POLICY "Firm admins can manage client assignments" 
ON public.client_assignments FOR ALL 
USING (firm_id = get_current_user_firm_id() AND is_firm_admin());

CREATE POLICY "Professionals can view their assigned clients" 
ON public.client_assignments FOR SELECT 
USING (professional_user_id IN (SELECT id FROM public.professional_users WHERE user_id = auth.uid()));

-- RLS Policies for firm_invitations
CREATE POLICY "System administrators can manage firm invitations" 
ON public.firm_invitations FOR ALL 
USING (has_any_role(ARRAY['system_administrator']));

-- Create triggers for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_firms_updated_at
  BEFORE UPDATE ON public.firms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professional_users_updated_at
  BEFORE UPDATE ON public.professional_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_client_assignments_updated_at
  BEFORE UPDATE ON public.client_assignments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();