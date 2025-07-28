-- Entity Management & Compliance Center Database Schema

-- Business Entities Table
CREATE TABLE public.business_entities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tenant_id UUID,
  entity_name TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('LLC', 'Corporation', 'S-Corporation', 'Trust', 'Nonprofit', 'Partnership')),
  jurisdiction TEXT NOT NULL,
  formation_date DATE,
  ein TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'dissolved')),
  description TEXT,
  registered_address JSONB,
  mailing_address JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Entity Ownership Tracking
CREATE TABLE public.entity_ownership (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID NOT NULL REFERENCES public.business_entities(id) ON DELETE CASCADE,
  owner_name TEXT NOT NULL,
  owner_email TEXT,
  ownership_percentage NUMERIC(5,2) CHECK (ownership_percentage >= 0 AND ownership_percentage <= 100),
  ownership_type TEXT DEFAULT 'member' CHECK (ownership_type IN ('member', 'shareholder', 'partner', 'trustee', 'beneficiary')),
  capital_contribution NUMERIC(15,2),
  voting_rights BOOLEAN DEFAULT true,
  management_rights BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Entity Professionals Assignment
CREATE TABLE public.entity_professionals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID NOT NULL REFERENCES public.business_entities(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL,
  professional_type TEXT NOT NULL CHECK (professional_type IN ('CPA', 'Attorney', 'RIA', 'Insurance Agent', 'Consultant')),
  role TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  engagement_date DATE,
  fee_structure TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Filing Schedules
CREATE TABLE public.filing_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID NOT NULL REFERENCES public.business_entities(id) ON DELETE CASCADE,
  filing_type TEXT NOT NULL,
  filing_name TEXT NOT NULL,
  due_date DATE NOT NULL,
  frequency TEXT DEFAULT 'annual' CHECK (frequency IN ('monthly', 'quarterly', 'semi-annual', 'annual', 'biennial', 'one-time')),
  jurisdiction TEXT NOT NULL,
  estimated_hours NUMERIC(4,2),
  estimated_cost NUMERIC(10,2),
  assigned_professional_id UUID,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Professional Credentials
CREATE TABLE public.professional_credentials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL,
  credential_type TEXT NOT NULL CHECK (credential_type IN ('CPA_License', 'Bar_License', 'RIA_Registration', 'Insurance_License', 'CPE_Hours', 'CLE_Hours')),
  credential_name TEXT NOT NULL,
  issuing_authority TEXT,
  license_number TEXT,
  issue_date DATE,
  expiration_date DATE,
  renewal_period TEXT,
  current_hours NUMERIC(6,2) DEFAULT 0,
  required_hours NUMERIC(6,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended', 'pending_renewal')),
  documents JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Compliance Alerts
CREATE TABLE public.compliance_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID REFERENCES public.business_entities(id) ON DELETE CASCADE,
  professional_id UUID,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('filing_deadline', 'credential_expiry', 'document_required', 'compliance_review')),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  due_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
  escalation_level INTEGER DEFAULT 0,
  notification_sent BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Entity Documents (extending existing documents)
CREATE TABLE public.entity_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_id UUID NOT NULL REFERENCES public.business_entities(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  file_path TEXT,
  file_size BIGINT,
  uploaded_by UUID NOT NULL,
  is_required BOOLEAN DEFAULT false,
  compliance_related BOOLEAN DEFAULT false,
  expiration_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'expired')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.business_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entity_ownership ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entity_professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.filing_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entity_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for business_entities
CREATE POLICY "Users can view their own entities" ON public.business_entities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own entities" ON public.business_entities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entities" ON public.business_entities
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entities" ON public.business_entities
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for entity_ownership
CREATE POLICY "Users can view ownership of their entities" ON public.entity_ownership
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.business_entities 
    WHERE id = entity_ownership.entity_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can manage ownership of their entities" ON public.entity_ownership
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.business_entities 
    WHERE id = entity_ownership.entity_id AND user_id = auth.uid()
  ));

-- RLS Policies for entity_professionals  
CREATE POLICY "Users can view professionals for their entities" ON public.entity_professionals
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.business_entities 
    WHERE id = entity_professionals.entity_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can manage professionals for their entities" ON public.entity_professionals
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.business_entities 
    WHERE id = entity_professionals.entity_id AND user_id = auth.uid()
  ));

-- RLS Policies for filing_schedules
CREATE POLICY "Users can view filing schedules for their entities" ON public.filing_schedules
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.business_entities 
    WHERE id = filing_schedules.entity_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can manage filing schedules for their entities" ON public.filing_schedules
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.business_entities 
    WHERE id = filing_schedules.entity_id AND user_id = auth.uid()
  ));

-- RLS Policies for professional_credentials
CREATE POLICY "Professionals can view their own credentials" ON public.professional_credentials
  FOR ALL USING (auth.uid() = professional_id);

-- RLS Policies for compliance_alerts
CREATE POLICY "Users can view alerts for their entities" ON public.compliance_alerts
  FOR SELECT USING (
    (entity_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.business_entities 
      WHERE id = compliance_alerts.entity_id AND user_id = auth.uid()
    )) OR
    (professional_id IS NOT NULL AND auth.uid() = professional_id)
  );

CREATE POLICY "Users can manage alerts for their entities" ON public.compliance_alerts
  FOR ALL USING (
    (entity_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.business_entities 
      WHERE id = compliance_alerts.entity_id AND user_id = auth.uid()
    )) OR
    (professional_id IS NOT NULL AND auth.uid() = professional_id)
  );

-- RLS Policies for entity_documents
CREATE POLICY "Users can view documents for their entities" ON public.entity_documents
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.business_entities 
    WHERE id = entity_documents.entity_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can manage documents for their entities" ON public.entity_documents
  FOR ALL USING (EXISTS (
    SELECT 1 FROM public.business_entities 
    WHERE id = entity_documents.entity_id AND user_id = auth.uid()
  ));

-- Create indexes for performance
CREATE INDEX idx_business_entities_user_id ON public.business_entities(user_id);
CREATE INDEX idx_entity_ownership_entity_id ON public.entity_ownership(entity_id);
CREATE INDEX idx_entity_professionals_entity_id ON public.entity_professionals(entity_id);
CREATE INDEX idx_filing_schedules_entity_id ON public.filing_schedules(entity_id);
CREATE INDEX idx_filing_schedules_due_date ON public.filing_schedules(due_date);
CREATE INDEX idx_professional_credentials_professional_id ON public.professional_credentials(professional_id);
CREATE INDEX idx_compliance_alerts_entity_id ON public.compliance_alerts(entity_id);
CREATE INDEX idx_compliance_alerts_professional_id ON public.compliance_alerts(professional_id);
CREATE INDEX idx_entity_documents_entity_id ON public.entity_documents(entity_id);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_business_entities_updated_at
  BEFORE UPDATE ON public.business_entities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_entity_ownership_updated_at
  BEFORE UPDATE ON public.entity_ownership
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_entity_professionals_updated_at
  BEFORE UPDATE ON public.entity_professionals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_filing_schedules_updated_at
  BEFORE UPDATE ON public.filing_schedules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professional_credentials_updated_at
  BEFORE UPDATE ON public.professional_credentials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_compliance_alerts_updated_at
  BEFORE UPDATE ON public.compliance_alerts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_entity_documents_updated_at
  BEFORE UPDATE ON public.entity_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();