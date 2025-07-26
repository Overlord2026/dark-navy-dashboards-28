-- Create investment categories table
CREATE TABLE public.investment_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  parent_category_id UUID REFERENCES public.investment_categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create investment products table
CREATE TABLE public.investment_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL,
  ria_id UUID NOT NULL,
  category_id UUID REFERENCES public.investment_categories(id) ON DELETE SET NULL,
  
  -- Basic product information
  name TEXT NOT NULL,
  description TEXT,
  product_type TEXT NOT NULL, -- 'model_portfolio', 'sma', 'alternative', 'mutual_fund', 'etf', 'structured_product'
  
  -- Investment details
  minimum_investment NUMERIC DEFAULT 0,
  maximum_investment NUMERIC,
  risk_level TEXT, -- 'conservative', 'moderate', 'aggressive'
  
  -- Compliance and status
  status TEXT DEFAULT 'draft', -- 'draft', 'pending_approval', 'approved', 'rejected', 'inactive'
  compliance_approved BOOLEAN DEFAULT false,
  compliance_approved_at TIMESTAMP WITH TIME ZONE,
  compliance_approved_by UUID,
  
  -- External integrations
  external_product_id TEXT,
  external_provider TEXT, -- 'cais', 'icapital', etc.
  deep_link TEXT,
  
  -- Custom and flexible fields
  custom_fields JSONB DEFAULT '{}',
  marketing_info JSONB DEFAULT '{}',
  fee_structure JSONB DEFAULT '{}',
  asset_allocation JSONB DEFAULT '{}',
  eligibility_requirements JSONB DEFAULT '{}',
  
  -- Metadata
  is_featured BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_compliance_check TIMESTAMP WITH TIME ZONE
);

-- Create product documents table
CREATE TABLE public.product_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.investment_products(id) ON DELETE CASCADE,
  
  -- Document details
  document_type TEXT NOT NULL, -- 'prospectus', 'fact_sheet', 'disclosure', 'offering_memo', 'other'
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_size BIGINT,
  mime_type TEXT,
  
  -- Versioning and compliance
  version_number INTEGER DEFAULT 1,
  is_current_version BOOLEAN DEFAULT true,
  requires_compliance_review BOOLEAN DEFAULT true,
  compliance_approved BOOLEAN DEFAULT false,
  compliance_notes TEXT,
  
  -- Access control
  access_level TEXT DEFAULT 'client', -- 'client', 'advisor', 'admin', 'public'
  
  -- Metadata
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user product interests table
CREATE TABLE public.user_product_interests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID NOT NULL REFERENCES public.investment_products(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  
  -- Interest details
  interest_type TEXT NOT NULL, -- 'bookmarked', 'requested_info', 'add_to_portfolio', 'viewed'
  status TEXT DEFAULT 'active', -- 'active', 'fulfilled', 'expired'
  notes TEXT,
  
  -- Request details for info requests
  request_details JSONB DEFAULT '{}',
  advisor_response TEXT,
  advisor_response_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(user_id, product_id, interest_type)
);

-- Create product compliance tracking table
CREATE TABLE public.product_compliance_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.investment_products(id) ON DELETE CASCADE,
  
  -- Compliance details
  review_type TEXT NOT NULL, -- 'initial', 'periodic', 'change_triggered', 'document_update'
  status TEXT DEFAULT 'pending', -- 'pending', 'in_review', 'approved', 'rejected', 'escalated'
  priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  
  -- Review process
  assigned_to UUID,
  reviewer_notes TEXT,
  compliance_checklist JSONB DEFAULT '{}',
  required_documents JSONB DEFAULT '[]',
  
  -- Decisions and outcomes
  decision TEXT, -- 'approved', 'rejected', 'requires_changes'
  decision_reason TEXT,
  conditions_or_requirements TEXT,
  
  -- Timeline tracking
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  review_started_at TIMESTAMP WITH TIME ZONE,
  review_completed_at TIMESTAMP WITH TIME ZONE,
  escalated_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create product audit log table
CREATE TABLE public.product_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES public.investment_products(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  
  -- Audit details
  action_type TEXT NOT NULL, -- 'created', 'updated', 'status_changed', 'compliance_reset', 'document_added'
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  
  -- Change tracking
  field_name TEXT,
  old_value TEXT,
  new_value TEXT,
  change_summary TEXT,
  
  -- Context
  user_id UUID,
  user_role TEXT,
  ip_address INET,
  user_agent TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.investment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investment_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_product_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_compliance_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for investment_categories
CREATE POLICY "Users can view categories in their tenant" ON public.investment_categories
  FOR SELECT USING (tenant_id = get_current_user_tenant_id());

CREATE POLICY "Admins can manage categories in their tenant" ON public.investment_categories
  FOR ALL USING (
    tenant_id = get_current_user_tenant_id() AND 
    has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator'])
  );

-- RLS Policies for investment_products
CREATE POLICY "Users can view approved products in their tenant" ON public.investment_products
  FOR SELECT USING (
    tenant_id = get_current_user_tenant_id() AND 
    (status = 'approved' OR ria_id = auth.uid() OR has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator']))
  );

CREATE POLICY "RIAs can manage their own products" ON public.investment_products
  FOR ALL USING (
    tenant_id = get_current_user_tenant_id() AND 
    (ria_id = auth.uid() OR has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator']))
  );

CREATE POLICY "RIAs can create products in their tenant" ON public.investment_products
  FOR INSERT WITH CHECK (
    tenant_id = get_current_user_tenant_id() AND 
    ria_id = auth.uid()
  );

-- RLS Policies for product_documents
CREATE POLICY "Users can view documents based on access level" ON public.product_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.investment_products ip 
      WHERE ip.id = product_documents.product_id 
      AND ip.tenant_id = get_current_user_tenant_id()
      AND (
        access_level = 'public' OR
        (access_level = 'client' AND auth.uid() IS NOT NULL) OR
        (access_level = 'advisor' AND has_any_role(ARRAY['advisor', 'admin', 'tenant_admin', 'system_administrator'])) OR
        (access_level = 'admin' AND has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator'])) OR
        uploaded_by = auth.uid()
      )
    )
  );

CREATE POLICY "RIAs and admins can manage product documents" ON public.product_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.investment_products ip 
      WHERE ip.id = product_documents.product_id 
      AND ip.tenant_id = get_current_user_tenant_id()
      AND (ip.ria_id = auth.uid() OR has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator']))
    )
  );

-- RLS Policies for user_product_interests
CREATE POLICY "Users can manage their own interests" ON public.user_product_interests
  FOR ALL USING (
    tenant_id = get_current_user_tenant_id() AND 
    user_id = auth.uid()
  );

CREATE POLICY "RIAs can view interests for their products" ON public.user_product_interests
  FOR SELECT USING (
    tenant_id = get_current_user_tenant_id() AND 
    EXISTS (
      SELECT 1 FROM public.investment_products ip 
      WHERE ip.id = user_product_interests.product_id 
      AND (ip.ria_id = auth.uid() OR has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator']))
    )
  );

-- RLS Policies for product_compliance_tracking
CREATE POLICY "Compliance staff can view all compliance records" ON public.product_compliance_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.investment_products ip 
      WHERE ip.id = product_compliance_tracking.product_id 
      AND ip.tenant_id = get_current_user_tenant_id()
    ) AND 
    has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator', 'compliance'])
  );

CREATE POLICY "RIAs can view compliance for their products" ON public.product_compliance_tracking
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.investment_products ip 
      WHERE ip.id = product_compliance_tracking.product_id 
      AND ip.tenant_id = get_current_user_tenant_id()
      AND ip.ria_id = auth.uid()
    )
  );

CREATE POLICY "Compliance staff can manage compliance records" ON public.product_compliance_tracking
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.investment_products ip 
      WHERE ip.id = product_compliance_tracking.product_id 
      AND ip.tenant_id = get_current_user_tenant_id()
    ) AND 
    has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator', 'compliance'])
  );

-- RLS Policies for product_audit_log
CREATE POLICY "Admins can view audit logs in their tenant" ON public.product_audit_log
  FOR SELECT USING (
    tenant_id = get_current_user_tenant_id() AND 
    has_any_role(ARRAY['admin', 'tenant_admin', 'system_administrator'])
  );

CREATE POLICY "RIAs can view audit logs for their products" ON public.product_audit_log
  FOR SELECT USING (
    tenant_id = get_current_user_tenant_id() AND 
    EXISTS (
      SELECT 1 FROM public.investment_products ip 
      WHERE ip.id = product_audit_log.product_id 
      AND ip.ria_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX idx_investment_products_tenant_status ON public.investment_products(tenant_id, status);
CREATE INDEX idx_investment_products_ria_id ON public.investment_products(ria_id);
CREATE INDEX idx_investment_products_category ON public.investment_products(category_id);
CREATE INDEX idx_investment_products_external ON public.investment_products(external_product_id, external_provider);

CREATE INDEX idx_product_documents_product_id ON public.product_documents(product_id);
CREATE INDEX idx_product_documents_type ON public.product_documents(document_type, is_current_version);

CREATE INDEX idx_user_interests_user_product ON public.user_product_interests(user_id, product_id);
CREATE INDEX idx_user_interests_tenant ON public.user_product_interests(tenant_id, interest_type);

CREATE INDEX idx_compliance_tracking_product ON public.product_compliance_tracking(product_id, status);
CREATE INDEX idx_compliance_tracking_assigned ON public.product_compliance_tracking(assigned_to, status);

CREATE INDEX idx_audit_log_product_created ON public.product_audit_log(product_id, created_at DESC);
CREATE INDEX idx_audit_log_tenant_action ON public.product_audit_log(tenant_id, action_type, created_at DESC);

-- Function to reset compliance when major fields are updated
CREATE OR REPLACE FUNCTION public.reset_product_compliance()
RETURNS TRIGGER AS $$
DECLARE
  major_fields TEXT[] := ARRAY['name', 'description', 'minimum_investment', 'maximum_investment', 'risk_level', 'fee_structure', 'asset_allocation', 'eligibility_requirements'];
  field_name TEXT;
  old_val TEXT;
  new_val TEXT;
  changes_found BOOLEAN := FALSE;
BEGIN
  -- Only check for updates, not inserts
  IF TG_OP = 'UPDATE' THEN
    -- Check if any major fields changed
    FOREACH field_name IN ARRAY major_fields LOOP
      EXECUTE format('SELECT ($1).%I::TEXT, ($2).%I::TEXT', field_name, field_name) 
      INTO old_val, new_val 
      USING OLD, NEW;
      
      IF old_val IS DISTINCT FROM new_val THEN
        changes_found := TRUE;
        EXIT;
      END IF;
    END LOOP;
    
    -- If major fields changed and product was previously approved, reset compliance
    IF changes_found AND OLD.compliance_approved = TRUE THEN
      NEW.compliance_approved := FALSE;
      NEW.status := 'pending_approval';
      NEW.last_compliance_check := now();
      
      -- Create compliance tracking record
      INSERT INTO public.product_compliance_tracking (
        product_id,
        review_type,
        status,
        created_by
      ) VALUES (
        NEW.id,
        'change_triggered',
        'pending',
        auth.uid()
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log product changes
CREATE OR REPLACE FUNCTION public.log_product_changes()
RETURNS TRIGGER AS $$
DECLARE
  action_type TEXT;
  user_tenant_id UUID;
BEGIN
  -- Get user's tenant ID
  SELECT tenant_id INTO user_tenant_id FROM public.profiles WHERE id = auth.uid();
  
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type := 'created';
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'updated';
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'deleted';
  END IF;
  
  -- Log the change
  INSERT INTO public.product_audit_log (
    product_id,
    tenant_id,
    action_type,
    table_name,
    record_id,
    change_summary,
    user_id,
    user_role
  ) VALUES (
    COALESCE(NEW.id, OLD.id),
    COALESCE(user_tenant_id, NEW.tenant_id, OLD.tenant_id),
    action_type,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'Product created'
      WHEN TG_OP = 'UPDATE' THEN 'Product updated'
      WHEN TG_OP = 'DELETE' THEN 'Product deleted'
    END,
    auth.uid(),
    get_current_user_role()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
CREATE TRIGGER trigger_reset_product_compliance
  BEFORE UPDATE ON public.investment_products
  FOR EACH ROW EXECUTE FUNCTION public.reset_product_compliance();

CREATE TRIGGER trigger_log_product_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.investment_products
  FOR EACH ROW EXECUTE FUNCTION public.log_product_changes();

CREATE TRIGGER trigger_log_document_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.product_documents
  FOR EACH ROW EXECUTE FUNCTION public.log_product_changes();

-- Insert default investment categories
INSERT INTO public.investment_categories (tenant_id, name, description, display_order) VALUES
  ('00000000-0000-0000-0000-000000000000', 'Model Portfolios', 'Professionally managed diversified portfolios', 1),
  ('00000000-0000-0000-0000-000000000000', 'Separately Managed Accounts', 'Individual account management with customization', 2),
  ('00000000-0000-0000-0000-000000000000', 'Alternative Investments', 'Non-traditional investment opportunities', 3),
  ('00000000-0000-0000-0000-000000000000', 'Mutual Funds', 'Pooled investment vehicles', 4),
  ('00000000-0000-0000-0000-000000000000', 'Exchange-Traded Funds', 'Tradeable index funds', 5),
  ('00000000-0000-0000-0000-000000000000', 'Structured Products', 'Customized investment instruments', 6),
  ('00000000-0000-0000-0000-000000000000', 'Real Estate', 'Property and REIT investments', 7),
  ('00000000-0000-0000-0000-000000000000', 'Private Equity', 'Private company investments', 8),
  ('00000000-0000-0000-0000-000000000000', 'Hedge Funds', 'Alternative investment strategies', 9),
  ('00000000-0000-0000-0000-000000000000', 'Commodities', 'Physical and derivative commodity investments', 10);

-- Update existing tables to include updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_investment_categories_updated_at
  BEFORE UPDATE ON public.investment_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_investment_products_updated_at
  BEFORE UPDATE ON public.investment_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_product_documents_updated_at
  BEFORE UPDATE ON public.product_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_user_product_interests_updated_at
  BEFORE UPDATE ON public.user_product_interests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trigger_product_compliance_tracking_updated_at
  BEFORE UPDATE ON public.product_compliance_tracking
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();