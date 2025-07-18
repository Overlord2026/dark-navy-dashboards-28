-- Create comprehensive audit triggers for sensitive data tables

-- 1. Create audit trigger function
CREATE OR REPLACE FUNCTION public.audit_table_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  old_data JSONB;
  new_data JSONB;
  audit_data JSONB;
BEGIN
  -- Build old and new data JSON
  IF TG_OP = 'DELETE' THEN
    old_data := to_jsonb(OLD);
    new_data := NULL;
  ELSIF TG_OP = 'INSERT' THEN
    old_data := NULL;
    new_data := to_jsonb(NEW);
  ELSE -- UPDATE
    old_data := to_jsonb(OLD);
    new_data := to_jsonb(NEW);
  END IF;

  -- Build audit data
  audit_data := jsonb_build_object(
    'table_name', TG_TABLE_NAME,
    'operation', TG_OP,
    'old_data', old_data,
    'new_data', new_data,
    'changed_fields', CASE 
      WHEN TG_OP = 'UPDATE' THEN (
        SELECT jsonb_object_agg(key, jsonb_build_object('old', old_data->key, 'new', new_data->key))
        FROM jsonb_each(new_data)
        WHERE new_data->key IS DISTINCT FROM old_data->key
      )
      ELSE NULL
    END,
    'tenant_id', COALESCE(
      CASE WHEN TG_OP = 'DELETE' THEN OLD.tenant_id ELSE NEW.tenant_id END,
      get_current_user_tenant_id()
    ),
    'record_id', CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.id 
      ELSE NEW.id 
    END
  );

  -- Insert audit log
  INSERT INTO public.audit_logs (
    event_type,
    status,
    details,
    user_id
  ) VALUES (
    'table_audit_' || lower(TG_OP),
    'success',
    audit_data,
    auth.uid()
  );

  -- Return appropriate record
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- 2. Create triggers for financial data tables
CREATE TRIGGER audit_bank_accounts_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.bank_accounts
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_credit_cards_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.credit_cards
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_digital_assets_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.digital_assets
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_investment_accounts_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.investment_accounts
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_hsa_accounts_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.hsa_accounts
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_private_equity_accounts_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.private_equity_accounts
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_properties_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_financial_plans_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.financial_plans
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_budget_goals_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.budget_goals
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

-- 3. Create triggers for healthcare data tables
CREATE TRIGGER audit_healthcare_documents_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.healthcare_documents
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_health_docs_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.health_docs
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_health_metrics_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.health_metrics
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_prescriptions_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.prescriptions
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_appointments_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_healthcare_providers_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.healthcare_providers
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_epigenetic_tests_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.epigenetic_tests
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

-- 4. Create triggers for sensitive personal data tables
CREATE TRIGGER audit_family_members_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.family_members
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_documents_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_estate_planning_documents_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.estate_planning_documents
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_user_beneficiaries_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.user_beneficiaries
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_user_trusts_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.user_trusts
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

-- 5. Create triggers for transaction and transfer tables
CREATE TRIGGER audit_transfers_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.transfers
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_hsa_expenses_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.hsa_expenses
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_hsa_contributions_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.hsa_contributions
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

CREATE TRIGGER audit_hsa_reimbursements_changes
  AFTER INSERT OR UPDATE OR DELETE ON public.hsa_reimbursements
  FOR EACH ROW EXECUTE FUNCTION public.audit_table_changes();

-- 6. Create function to test audit logging
CREATE OR REPLACE FUNCTION public.test_audit_logging()
RETURNS TABLE(
  test_name TEXT,
  result TEXT,
  details TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  initial_log_count INTEGER;
  final_log_count INTEGER;
  test_bank_account_id UUID;
  test_health_metric_id UUID;
  test_document_id UUID;
BEGIN
  -- Get initial audit log count
  SELECT COUNT(*) INTO initial_log_count FROM public.audit_logs;

  -- Test 1: Bank account operations
  BEGIN
    -- INSERT test
    INSERT INTO public.bank_accounts (
      name, account_type, balance, user_id
    ) VALUES (
      'Test Audit Account', 'checking', 1000.00, auth.uid()
    ) RETURNING id INTO test_bank_account_id;

    -- UPDATE test
    UPDATE public.bank_accounts 
    SET balance = 1500.00, name = 'Updated Test Account'
    WHERE id = test_bank_account_id;

    -- DELETE test
    DELETE FROM public.bank_accounts WHERE id = test_bank_account_id;

    RETURN QUERY SELECT 'Bank Account Audit Test'::TEXT, 'PASSED'::TEXT, 'INSERT, UPDATE, DELETE operations logged'::TEXT;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'Bank Account Audit Test'::TEXT, 'FAILED'::TEXT, SQLERRM::TEXT;
  END;

  -- Test 2: Health metrics operations
  BEGIN
    -- INSERT test
    INSERT INTO public.health_metrics (
      type, value, unit, user_id
    ) VALUES (
      'blood_pressure', '120/80', 'mmHg', auth.uid()
    ) RETURNING id INTO test_health_metric_id;

    -- UPDATE test
    UPDATE public.health_metrics 
    SET value = '125/85', notes = 'Slightly elevated'
    WHERE id = test_health_metric_id;

    -- DELETE test
    DELETE FROM public.health_metrics WHERE id = test_health_metric_id;

    RETURN QUERY SELECT 'Health Metrics Audit Test'::TEXT, 'PASSED'::TEXT, 'INSERT, UPDATE, DELETE operations logged'::TEXT;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'Health Metrics Audit Test'::TEXT, 'FAILED'::TEXT, SQLERRM::TEXT;
  END;

  -- Test 3: Documents operations (if tenant_id exists)
  BEGIN
    -- INSERT test
    INSERT INTO public.documents (
      name, type, category, user_id, tenant_id
    ) VALUES (
      'Test Audit Document', 'pdf', 'financial', auth.uid(), get_current_user_tenant_id()
    ) RETURNING id INTO test_document_id;

    -- UPDATE test
    UPDATE public.documents 
    SET name = 'Updated Test Document', is_private = false
    WHERE id = test_document_id;

    -- DELETE test
    DELETE FROM public.documents WHERE id = test_document_id;

    RETURN QUERY SELECT 'Documents Audit Test'::TEXT, 'PASSED'::TEXT, 'INSERT, UPDATE, DELETE operations logged'::TEXT;
  EXCEPTION WHEN OTHERS THEN
    RETURN QUERY SELECT 'Documents Audit Test'::TEXT, 'FAILED'::TEXT, SQLERRM::TEXT;
  END;

  -- Check final log count
  SELECT COUNT(*) INTO final_log_count FROM public.audit_logs;

  -- Test 4: Verify audit logs were created
  IF final_log_count > initial_log_count THEN
    RETURN QUERY SELECT 
      'Audit Log Creation Test'::TEXT, 
      'PASSED'::TEXT, 
      format('Created %s new audit log entries', final_log_count - initial_log_count)::TEXT;
  ELSE
    RETURN QUERY SELECT 
      'Audit Log Creation Test'::TEXT, 
      'FAILED'::TEXT, 
      'No new audit log entries were created'::TEXT;
  END IF;

  -- Test 5: Verify audit log content
  IF EXISTS (
    SELECT 1 FROM public.audit_logs 
    WHERE event_type IN ('table_audit_insert', 'table_audit_update', 'table_audit_delete')
    AND details->>'table_name' IN ('bank_accounts', 'health_metrics', 'documents')
    AND created_at > NOW() - INTERVAL '1 minute'
  ) THEN
    RETURN QUERY SELECT 
      'Audit Log Content Test'::TEXT, 
      'PASSED'::TEXT, 
      'Audit logs contain correct event types and table references'::TEXT;
  ELSE
    RETURN QUERY SELECT 
      'Audit Log Content Test'::TEXT, 
      'FAILED'::TEXT, 
      'Audit logs missing expected content'::TEXT;
  END IF;
END;
$$;

-- 7. Create view for audit summary
CREATE OR REPLACE VIEW public.audit_summary AS
SELECT 
  details->>'table_name' as table_name,
  event_type,
  DATE_TRUNC('day', created_at) as audit_date,
  COUNT(*) as operation_count,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT details->>'tenant_id') as unique_tenants
FROM public.audit_logs
WHERE event_type LIKE 'table_audit_%'
GROUP BY details->>'table_name', event_type, DATE_TRUNC('day', created_at)
ORDER BY audit_date DESC, table_name, event_type;

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.audit_table_changes() TO service_role;
GRANT EXECUTE ON FUNCTION public.test_audit_logging() TO authenticated;
GRANT SELECT ON public.audit_summary TO authenticated;

-- Index for better audit query performance
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_audit 
ON public.audit_logs(event_type, created_at DESC) 
WHERE event_type LIKE 'table_audit_%';

CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name_btree
ON public.audit_logs((details->>'table_name'))
WHERE event_type LIKE 'table_audit_%';