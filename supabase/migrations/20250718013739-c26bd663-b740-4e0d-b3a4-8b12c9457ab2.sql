-- Database-level triggers for transfer validation, HSA compliance, and emergency access logging

-- =========== TRANSFER VALIDATION TRIGGERS ===========

-- Function to validate transfers
CREATE OR REPLACE FUNCTION public.validate_transfer() 
RETURNS TRIGGER AS $$
DECLARE
  from_account_balance NUMERIC;
  from_account_active BOOLEAN;
  to_account_active BOOLEAN;
  total_transfer_amount NUMERIC;
BEGIN
  -- Calculate total transfer amount including fees
  total_transfer_amount := NEW.amount + NEW.transfer_fee;
  
  -- Check if from_account exists and get balance and status
  SELECT balance, (account_type != 'closed') INTO from_account_balance, from_account_active
  FROM public.bank_accounts 
  WHERE id = NEW.from_account_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transfer validation failed: Source account % does not exist', NEW.from_account_id;
  END IF;
  
  -- Check if to_account exists and is active
  SELECT (account_type != 'closed') INTO to_account_active
  FROM public.bank_accounts 
  WHERE id = NEW.to_account_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transfer validation failed: Destination account % does not exist', NEW.to_account_id;
  END IF;
  
  -- Validate source account is active
  IF NOT from_account_active THEN
    RAISE EXCEPTION 'Transfer validation failed: Source account % is closed', NEW.from_account_id;
  END IF;
  
  -- Validate destination account is active
  IF NOT to_account_active THEN
    RAISE EXCEPTION 'Transfer validation failed: Destination account % is closed', NEW.to_account_id;
  END IF;
  
  -- Validate sufficient funds (only for pending/processing transfers)
  IF NEW.status IN ('pending', 'processing') AND from_account_balance < total_transfer_amount THEN
    RAISE EXCEPTION 'Transfer validation failed: Insufficient funds. Account balance: %, Transfer amount: %', 
                    from_account_balance, total_transfer_amount;
  END IF;
  
  -- Validate transfer amount is positive
  IF NEW.amount <= 0 THEN
    RAISE EXCEPTION 'Transfer validation failed: Transfer amount must be positive';
  END IF;
  
  -- Log the validation
  INSERT INTO public.audit_logs (event_type, status, details, user_id)
  VALUES (
    'transfer_validation', 
    'success',
    jsonb_build_object(
      'transfer_id', NEW.id,
      'from_account_id', NEW.from_account_id,
      'to_account_id', NEW.to_account_id,
      'amount', NEW.amount,
      'validation_passed', true
    ),
    NEW.user_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for transfer validation
DROP TRIGGER IF EXISTS trigger_validate_transfer ON public.transfers;
CREATE TRIGGER trigger_validate_transfer
  BEFORE INSERT OR UPDATE ON public.transfers
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_transfer();

-- =========== HSA COMPLIANCE TRIGGERS ===========

-- Function to enforce HSA contribution limits and IRS compliance
CREATE OR REPLACE FUNCTION public.enforce_hsa_compliance() 
RETURNS TRIGGER AS $$
DECLARE
  account_record RECORD;
  family_total_ytd NUMERIC := 0;
  individual_limit NUMERIC := 4300; -- 2024 IRS limit for individual
  family_limit NUMERIC := 8550;     -- 2024 IRS limit for family
  catchup_limit NUMERIC := 1000;    -- 2024 catch-up contribution limit
  max_allowed NUMERIC;
  current_year INTEGER := EXTRACT(YEAR FROM NEW.tx_date);
  contribution_year INTEGER := EXTRACT(YEAR FROM NOW());
BEGIN
  -- Get HSA account details
  SELECT * INTO account_record
  FROM public.hsa_accounts 
  WHERE id = NEW.account_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'HSA compliance validation failed: HSA account % does not exist', NEW.account_id;
  END IF;
  
  -- Validate account is active
  IF NOT account_record.is_active THEN
    RAISE EXCEPTION 'HSA compliance validation failed: HSA account % is not active', NEW.account_id;
  END IF;
  
  -- Validate contribution is for current tax year only
  IF current_year != contribution_year THEN
    RAISE EXCEPTION 'HSA compliance validation failed: Contributions only allowed for current tax year %', contribution_year;
  END IF;
  
  -- Calculate family total contributions for the year
  SELECT COALESCE(SUM(amount), 0) INTO family_total_ytd
  FROM public.hsa_contributions hc
  JOIN public.hsa_accounts ha ON hc.account_id = ha.id
  WHERE ha.family_id = account_record.family_id 
    AND EXTRACT(YEAR FROM hc.tx_date) = current_year
    AND hc.id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000');
  
  -- Determine contribution limit based on account type and catch-up eligibility
  IF account_record.family_id IS NOT NULL THEN
    max_allowed := family_limit;
  ELSE
    max_allowed := individual_limit;
  END IF;
  
  -- Add catch-up contribution if eligible
  IF account_record.catch_up_eligible THEN
    max_allowed := max_allowed + catchup_limit;
  END IF;
  
  -- Validate the new contribution doesn't exceed limits
  IF (family_total_ytd + NEW.amount) > max_allowed THEN
    RAISE EXCEPTION 'HSA compliance validation failed: Contribution would exceed annual limit. Current family total: %, New contribution: %, Limit: %', 
                    family_total_ytd, NEW.amount, max_allowed;
  END IF;
  
  -- Validate contribution amount is positive
  IF NEW.amount <= 0 THEN
    RAISE EXCEPTION 'HSA compliance validation failed: Contribution amount must be positive';
  END IF;
  
  -- Log the compliance check
  INSERT INTO public.audit_logs (event_type, status, details, user_id)
  VALUES (
    'hsa_compliance_check', 
    'success',
    jsonb_build_object(
      'account_id', NEW.account_id,
      'contribution_amount', NEW.amount,
      'family_total_ytd', family_total_ytd,
      'limit_applied', max_allowed,
      'compliance_passed', true
    ),
    account_record.user_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for HSA compliance
DROP TRIGGER IF EXISTS trigger_enforce_hsa_compliance ON public.hsa_contributions;
CREATE TRIGGER trigger_enforce_hsa_compliance
  BEFORE INSERT OR UPDATE ON public.hsa_contributions
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_hsa_compliance();

-- =========== HEALTHCARE DOCS EMERGENCY ACCESS LOGGING ===========

-- Enhanced function for emergency access logging and validation
CREATE OR REPLACE FUNCTION public.log_emergency_access() 
RETURNS TRIGGER AS $$
DECLARE
  doc_record RECORD;
  access_context TEXT;
BEGIN
  -- Get document details
  SELECT * INTO doc_record
  FROM public.healthcare_documents 
  WHERE id = NEW.doc_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Emergency access logging failed: Document % does not exist', NEW.doc_id;
  END IF;
  
  -- Determine access context
  IF NEW.emergency_token IS NOT NULL THEN
    access_context := 'emergency_token_access';
  ELSIF NEW.access_method = 'emergency' THEN
    access_context := 'emergency_override_access';
  ELSE
    access_context := 'normal_access';
  END IF;
  
  -- For emergency accesses, create detailed audit log
  IF access_context IN ('emergency_token_access', 'emergency_override_access') THEN
    INSERT INTO public.audit_logs (event_type, status, details, user_id)
    VALUES (
      'emergency_document_access', 
      'success',
      jsonb_build_object(
        'document_id', NEW.doc_id,
        'document_name', doc_record.name,
        'document_type', doc_record.type,
        'document_owner_id', doc_record.user_id,
        'accessed_by_user_id', NEW.accessed_by_user_id,
        'access_method', NEW.access_method,
        'emergency_token', NEW.emergency_token,
        'emergency_context', NEW.emergency_context,
        'ip_address', NEW.ip_address,
        'user_agent', NEW.user_agent,
        'access_timestamp', NEW.accessed_at,
        'requires_review', true
      ),
      COALESCE(NEW.accessed_by_user_id, doc_record.user_id)
    );
    
    -- Log warning for emergency access
    RAISE NOTICE 'EMERGENCY ACCESS ALERT: Document % accessed via % by user % at %', 
                 doc_record.name, access_context, NEW.accessed_by_user_id, NEW.accessed_at;
  END IF;
  
  -- Always log normal access for healthcare documents
  INSERT INTO public.audit_logs (event_type, status, details, user_id)
  VALUES (
    'healthcare_document_access', 
    'success',
    jsonb_build_object(
      'document_id', NEW.doc_id,
      'document_name', doc_record.name,
      'access_type', NEW.access_type,
      'access_context', access_context,
      'accessed_by', NEW.accessed_by_user_id
    ),
    COALESCE(NEW.accessed_by_user_id, doc_record.user_id)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for emergency access logging
DROP TRIGGER IF EXISTS trigger_log_emergency_access ON public.health_doc_access_log;
CREATE TRIGGER trigger_log_emergency_access
  AFTER INSERT ON public.health_doc_access_log
  FOR EACH ROW
  EXECUTE FUNCTION public.log_emergency_access();