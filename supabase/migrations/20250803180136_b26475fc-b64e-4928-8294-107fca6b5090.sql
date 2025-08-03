-- Create accountant document storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('accountant-tax-docs', 'accountant-tax-docs', false),
  ('accountant-audit-files', 'accountant-audit-files', false),
  ('accountant-compliance-reports', 'accountant-compliance-reports', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for accountant documents
CREATE POLICY "Accountants can upload tax documents" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'accountant-tax-docs' 
  AND auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'accountant'
  )
);

CREATE POLICY "Accountants can view tax documents" ON storage.objects
FOR SELECT USING (
  bucket_id = 'accountant-tax-docs' 
  AND auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'accountant'
  )
);

CREATE POLICY "Accountants can upload audit files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'accountant-audit-files' 
  AND auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'accountant'
  )
);

CREATE POLICY "Accountants can view audit files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'accountant-audit-files' 
  AND auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'accountant'
  )
);

CREATE POLICY "Accountants can upload compliance reports" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'accountant-compliance-reports' 
  AND auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'accountant'
  )
);

CREATE POLICY "Accountants can view compliance reports" ON storage.objects
FOR SELECT USING (
  bucket_id = 'accountant-compliance-reports' 
  AND auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'accountant'
  )
);

-- Accountant clients table
CREATE TABLE IF NOT EXISTS public.accountant_clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  accountant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  business_type TEXT,
  tax_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  onboarding_status TEXT DEFAULT 'pending' CHECK (onboarding_status IN ('pending', 'in_progress', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Time tracking for accountants
CREATE TABLE IF NOT EXISTS public.accountant_time_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  accountant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES accountant_clients(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  description TEXT,
  hours_worked DECIMAL(5,2) NOT NULL CHECK (hours_worked >= 0),
  hourly_rate DECIMAL(10,2),
  date_worked DATE NOT NULL DEFAULT CURRENT_DATE,
  is_billable BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'billed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tax planning strategies
CREATE TABLE IF NOT EXISTS public.tax_planning_strategies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  accountant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES accountant_clients(id) ON DELETE CASCADE,
  strategy_name TEXT NOT NULL,
  strategy_type TEXT NOT NULL,
  description TEXT,
  potential_savings DECIMAL(12,2),
  implementation_deadline DATE,
  status TEXT DEFAULT 'recommended' CHECK (status IN ('recommended', 'in_progress', 'completed', 'rejected')),
  tax_year INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit checklists
CREATE TABLE IF NOT EXISTS public.audit_checklists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  accountant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES accountant_clients(id) ON DELETE CASCADE,
  checklist_name TEXT NOT NULL,
  audit_type TEXT NOT NULL,
  audit_year INTEGER NOT NULL,
  total_items INTEGER DEFAULT 0,
  completed_items INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'on_hold')),
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit checklist items
CREATE TABLE IF NOT EXISTS public.audit_checklist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  checklist_id UUID NOT NULL REFERENCES audit_checklists(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  item_description TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_by UUID REFERENCES profiles(id),
  completed_at TIMESTAMPTZ,
  notes TEXT,
  required BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance tasks
CREATE TABLE IF NOT EXISTS public.compliance_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  accountant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES accountant_clients(id) ON DELETE CASCADE,
  task_name TEXT NOT NULL,
  task_type TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  frequency TEXT CHECK (frequency IN ('one_time', 'monthly', 'quarterly', 'yearly')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  reminder_days INTEGER DEFAULT 7,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices for billing
CREATE TABLE IF NOT EXISTS public.accountant_invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  accountant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES accountant_clients(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(12,2) DEFAULT 0,
  total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  notes TEXT,
  payment_terms TEXT DEFAULT '30 days',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoice line items
CREATE TABLE IF NOT EXISTS public.accountant_invoice_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES accountant_invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  rate DECIMAL(10,2) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  time_entry_id UUID REFERENCES accountant_time_entries(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client documents
CREATE TABLE IF NOT EXISTS public.accountant_client_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  accountant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES accountant_clients(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  tax_year INTEGER,
  is_required BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reminders and notifications
CREATE TABLE IF NOT EXISTS public.accountant_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  accountant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES accountant_clients(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  is_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_pattern TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.accountant_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accountant_time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_planning_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accountant_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accountant_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accountant_client_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accountant_reminders ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Accountants can manage their clients" ON public.accountant_clients
FOR ALL USING (accountant_id = auth.uid());

CREATE POLICY "Accountants can manage their time entries" ON public.accountant_time_entries
FOR ALL USING (accountant_id = auth.uid());

CREATE POLICY "Accountants can manage their tax strategies" ON public.tax_planning_strategies
FOR ALL USING (accountant_id = auth.uid());

CREATE POLICY "Accountants can manage their audit checklists" ON public.audit_checklists
FOR ALL USING (accountant_id = auth.uid());

CREATE POLICY "Accountants can view checklist items for their checklists" ON public.audit_checklist_items
FOR ALL USING (EXISTS (
  SELECT 1 FROM audit_checklists 
  WHERE audit_checklists.id = audit_checklist_items.checklist_id 
  AND audit_checklists.accountant_id = auth.uid()
));

CREATE POLICY "Accountants can manage their compliance tasks" ON public.compliance_tasks
FOR ALL USING (accountant_id = auth.uid());

CREATE POLICY "Accountants can manage their invoices" ON public.accountant_invoices
FOR ALL USING (accountant_id = auth.uid());

CREATE POLICY "Accountants can view invoice items for their invoices" ON public.accountant_invoice_items
FOR ALL USING (EXISTS (
  SELECT 1 FROM accountant_invoices 
  WHERE accountant_invoices.id = accountant_invoice_items.invoice_id 
  AND accountant_invoices.accountant_id = auth.uid()
));

CREATE POLICY "Accountants can manage their client documents" ON public.accountant_client_documents
FOR ALL USING (accountant_id = auth.uid());

CREATE POLICY "Accountants can manage their reminders" ON public.accountant_reminders
FOR ALL USING (accountant_id = auth.uid());

-- Add updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_accountant_clients_updated_at BEFORE UPDATE ON public.accountant_clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accountant_time_entries_updated_at BEFORE UPDATE ON public.accountant_time_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tax_planning_strategies_updated_at BEFORE UPDATE ON public.tax_planning_strategies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_audit_checklists_updated_at BEFORE UPDATE ON public.audit_checklists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_tasks_updated_at BEFORE UPDATE ON public.compliance_tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accountant_invoices_updated_at BEFORE UPDATE ON public.accountant_invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accountant_client_documents_updated_at BEFORE UPDATE ON public.accountant_client_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();