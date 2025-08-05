-- Create tables for professional seat management and family linking

-- Seat purchases table for professionals buying seats for clients/firms
CREATE TABLE public.seat_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchaser_id UUID NOT NULL,
  professional_id UUID REFERENCES public.professionals(id),
  seats_purchased INTEGER NOT NULL DEFAULT 1,
  purchase_type TEXT NOT NULL DEFAULT 'client_seats', -- 'client_seats', 'firm_seats', 'family_benefit'
  total_amount NUMERIC NOT NULL DEFAULT 0,
  billing_frequency TEXT NOT NULL DEFAULT 'monthly', -- 'monthly', 'annual'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  stripe_subscription_id TEXT,
  purchased_for JSONB DEFAULT '{}', -- Details about who the seats are for
  auto_link_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- Family group members for linking households to professionals
CREATE TABLE public.family_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_group_id UUID NOT NULL,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member', -- 'head', 'spouse', 'dependent', 'member'
  relationship TEXT,
  linked_professional_id UUID REFERENCES public.professionals(id),
  seat_purchase_id UUID REFERENCES public.seat_purchases(id),
  invitation_status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'declined'
  invited_by UUID,
  invited_at TIMESTAMPTZ,
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(family_group_id, user_id)
);

-- Professional client links for managing relationships
CREATE TABLE public.professional_client_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES public.professionals(id),
  client_user_id UUID NOT NULL,
  family_group_id UUID,
  relationship_type TEXT NOT NULL DEFAULT 'primary', -- 'primary', 'secondary', 'consultant'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'pending', 'inactive'
  seat_purchase_id UUID REFERENCES public.seat_purchases(id),
  services_authorized JSONB DEFAULT '[]',
  billing_arrangement TEXT DEFAULT 'professional_pays',
  linked_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(professional_id, client_user_id)
);

-- Firm subscriptions for enterprise features
CREATE TABLE public.firm_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL,
  subscription_type TEXT NOT NULL DEFAULT 'professional', -- 'professional', 'enterprise', 'broker_dealer'
  seats_included INTEGER NOT NULL DEFAULT 1,
  seats_used INTEGER NOT NULL DEFAULT 0,
  features_enabled JSONB DEFAULT '[]',
  compliance_settings JSONB DEFAULT '{}',
  white_label_settings JSONB DEFAULT '{}',
  billing_contact_id UUID,
  payment_method_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '1 month'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.seat_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_client_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.firm_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for seat_purchases
CREATE POLICY "Users can view their own seat purchases" ON public.seat_purchases
  FOR SELECT USING (purchaser_id = auth.uid());

CREATE POLICY "Users can create their own seat purchases" ON public.seat_purchases
  FOR INSERT WITH CHECK (purchaser_id = auth.uid());

CREATE POLICY "Users can update their own seat purchases" ON public.seat_purchases
  FOR UPDATE USING (purchaser_id = auth.uid());

CREATE POLICY "Professionals can view seats purchased for them" ON public.seat_purchases
  FOR SELECT USING (professional_id IN (
    SELECT id FROM public.professionals WHERE user_id = auth.uid()
  ));

-- RLS Policies for family_group_members
CREATE POLICY "Users can view their family group members" ON public.family_group_members
  FOR SELECT USING (
    user_id = auth.uid() OR 
    invited_by = auth.uid() OR
    family_group_id IN (
      SELECT family_group_id FROM public.family_group_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage family group invitations" ON public.family_group_members
  FOR ALL USING (invited_by = auth.uid() OR user_id = auth.uid());

-- RLS Policies for professional_client_links
CREATE POLICY "Professionals can manage their client links" ON public.professional_client_links
  FOR ALL USING (professional_id IN (
    SELECT id FROM public.professionals WHERE user_id = auth.uid()
  ));

CREATE POLICY "Clients can view their professional links" ON public.professional_client_links
  FOR SELECT USING (client_user_id = auth.uid());

-- RLS Policies for firm_subscriptions
CREATE POLICY "Firm members can view their subscription" ON public.firm_subscriptions
  FOR SELECT USING (
    billing_contact_id = auth.uid() OR
    firm_id IN (
      SELECT firm_id FROM public.professional_users WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Firm admins can manage subscriptions" ON public.firm_subscriptions
  FOR ALL USING (
    billing_contact_id = auth.uid() OR
    firm_id IN (
      SELECT firm_id FROM public.professional_users 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_seat_purchases_purchaser ON public.seat_purchases(purchaser_id);
CREATE INDEX idx_seat_purchases_professional ON public.seat_purchases(professional_id);
CREATE INDEX idx_family_group_members_user ON public.family_group_members(user_id);
CREATE INDEX idx_family_group_members_group ON public.family_group_members(family_group_id);
CREATE INDEX idx_professional_client_links_professional ON public.professional_client_links(professional_id);
CREATE INDEX idx_professional_client_links_client ON public.professional_client_links(client_user_id);
CREATE INDEX idx_firm_subscriptions_firm ON public.firm_subscriptions(firm_id);