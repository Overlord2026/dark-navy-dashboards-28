-- Add validation functions and audit logging for referrals

-- Function to validate referral creation (prevent duplicates and self-referral)
CREATE OR REPLACE FUNCTION public.validate_referral_creation(
  p_referrer_id UUID,
  p_referee_email TEXT DEFAULT NULL,
  p_referral_type TEXT DEFAULT NULL,
  p_tenant_id UUID DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  referrer_email TEXT;
  duplicate_count INTEGER;
  rate_limit_count INTEGER;
BEGIN
  -- Get referrer's email for self-referral check
  SELECT email INTO referrer_email
  FROM auth.users
  WHERE id = p_referrer_id;
  
  -- Prevent self-referral by email
  IF p_referee_email IS NOT NULL AND referrer_email = p_referee_email THEN
    RAISE EXCEPTION 'Self-referral not allowed';
  END IF;
  
  -- Check for duplicate referrals by referee email (active referrals only)
  IF p_referee_email IS NOT NULL THEN
    -- Check regular referrals
    SELECT COUNT(*) INTO duplicate_count
    FROM public.referrals r
    JOIN public.referral_rewards rr ON r.id = rr.referral_id
    JOIN auth.users u ON rr.user_id = u.id
    WHERE u.email = p_referee_email
    AND r.status IN ('pending', 'active')
    AND r.tenant_id = p_tenant_id;
    
    IF duplicate_count > 0 THEN
      RAISE EXCEPTION 'Duplicate referral detected for email: %', p_referee_email;
    END IF;
  END IF;
  
  -- Rate limiting: max 10 referrals per user per day
  SELECT COUNT(*) INTO rate_limit_count
  FROM public.referrals
  WHERE referrer_id = p_referrer_id
  AND created_at >= NOW() - INTERVAL '1 day';
  
  IF rate_limit_count >= 10 THEN
    RAISE EXCEPTION 'Daily referral limit exceeded (10 per day)';
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate franchise referral creation
CREATE OR REPLACE FUNCTION public.validate_franchise_referral_creation(
  p_referring_tenant_id UUID,
  p_contact_email TEXT,
  p_firm_name TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  duplicate_count INTEGER;
  rate_limit_count INTEGER;
BEGIN
  -- Check for duplicate franchise referrals by email and firm name
  SELECT COUNT(*) INTO duplicate_count
  FROM public.franchise_referrals
  WHERE (referred_contact_email = p_contact_email OR referred_firm_name = p_firm_name)
  AND status NOT IN ('cancelled', 'expired')
  AND referring_tenant_id != p_referring_tenant_id; -- Allow same tenant to update their own referral
  
  IF duplicate_count > 0 THEN
    RAISE EXCEPTION 'Duplicate franchise referral detected for firm: % or email: %', p_firm_name, p_contact_email;
  END IF;
  
  -- Prevent self-referral (referring tenant referring themselves)
  IF EXISTS (
    SELECT 1 FROM public.tenants
    WHERE id = p_referring_tenant_id
    AND (admin_email = p_contact_email OR company_name = p_firm_name)
  ) THEN
    RAISE EXCEPTION 'Self-referral not allowed';
  END IF;
  
  -- Rate limiting: max 5 franchise referrals per tenant per day
  SELECT COUNT(*) INTO rate_limit_count
  FROM public.franchise_referrals
  WHERE referring_tenant_id = p_referring_tenant_id
  AND created_at >= NOW() - INTERVAL '1 day';
  
  IF rate_limit_count >= 5 THEN
    RAISE EXCEPTION 'Daily franchise referral limit exceeded (5 per day)';
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log referral audit events
CREATE OR REPLACE FUNCTION public.log_referral_audit(
  p_event_type TEXT,
  p_referral_type TEXT, -- 'regular' or 'franchise'
  p_referral_id UUID,
  p_old_status TEXT DEFAULT NULL,
  p_new_status TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}'::JSONB
) RETURNS UUID AS $$
DECLARE
  audit_id UUID;
  event_details JSONB;
BEGIN
  -- Build comprehensive event details
  event_details := p_details || jsonb_build_object(
    'referral_type', p_referral_type,
    'referral_id', p_referral_id,
    'old_status', p_old_status,
    'new_status', p_new_status,
    'timestamp', NOW(),
    'user_agent', current_setting('request.headers', true)::jsonb->>'user-agent',
    'ip_address', current_setting('request.headers', true)::jsonb->>'x-forwarded-for'
  );
  
  -- Insert audit log
  INSERT INTO public.audit_logs (
    event_type,
    status,
    details,
    user_id
  ) VALUES (
    'referral_' || p_event_type,
    'success',
    event_details,
    COALESCE(p_user_id, auth.uid())
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for referral audit logging
CREATE OR REPLACE FUNCTION public.audit_referral_changes()
RETURNS TRIGGER AS $$
DECLARE
  event_type TEXT;
  old_status TEXT;
  new_status TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    event_type := 'created';
    new_status := NEW.status;
    
    PERFORM public.log_referral_audit(
      event_type,
      'regular',
      NEW.id,
      NULL,
      new_status,
      NEW.referrer_id,
      jsonb_build_object(
        'referral_code', NEW.referral_code,
        'referral_type', NEW.referral_type,
        'reward_amount', NEW.reward_amount,
        'reward_type', NEW.reward_type
      )
    );
    
  ELSIF TG_OP = 'UPDATE' THEN
    old_status := OLD.status;
    new_status := NEW.status;
    
    IF old_status != new_status THEN
      event_type := 'status_changed';
      
      PERFORM public.log_referral_audit(
        event_type,
        'regular',
        NEW.id,
        old_status,
        new_status,
        NEW.referrer_id,
        jsonb_build_object(
          'referral_code', NEW.referral_code,
          'activated_at', NEW.activated_at,
          'paid_at', NEW.paid_at
        )
      );
    END IF;
    
  ELSIF TG_OP = 'DELETE' THEN
    event_type := 'deleted';
    
    PERFORM public.log_referral_audit(
      event_type,
      'regular',
      OLD.id,
      OLD.status,
      NULL,
      OLD.referrer_id,
      jsonb_build_object(
        'referral_code', OLD.referral_code,
        'deletion_reason', 'manual_deletion'
      )
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger function for franchise referral audit logging
CREATE OR REPLACE FUNCTION public.audit_franchise_referral_changes()
RETURNS TRIGGER AS $$
DECLARE
  event_type TEXT;
  old_status TEXT;
  new_status TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    event_type := 'created';
    new_status := NEW.status;
    
    PERFORM public.log_referral_audit(
      event_type,
      'franchise',
      NEW.id,
      NULL,
      new_status,
      NULL, -- No specific user for franchise referrals
      jsonb_build_object(
        'referral_code', NEW.referral_code,
        'referred_firm_name', NEW.referred_firm_name,
        'referred_contact_email', NEW.referred_contact_email,
        'referring_tenant_id', NEW.referring_tenant_id,
        'reward_amount', NEW.referral_reward_amount,
        'reward_type', NEW.referral_reward_type
      )
    );
    
  ELSIF TG_OP = 'UPDATE' THEN
    old_status := OLD.status;
    new_status := NEW.status;
    
    IF old_status != new_status THEN
      event_type := 'status_changed';
      
      PERFORM public.log_referral_audit(
        event_type,
        'franchise',
        NEW.id,
        old_status,
        new_status,
        NULL,
        jsonb_build_object(
          'referral_code', NEW.referral_code,
          'contacted_at', NEW.contacted_at,
          'demo_scheduled_at', NEW.demo_scheduled_at,
          'signed_at', NEW.signed_at,
          'reward_status', NEW.reward_status
        )
      );
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger function for payout audit logging
CREATE OR REPLACE FUNCTION public.audit_payout_changes()
RETURNS TRIGGER AS $$
DECLARE
  event_type TEXT;
  old_status TEXT;
  new_status TEXT;
  referral_type TEXT;
BEGIN
  -- Determine if this is a regular or franchise payout
  referral_type := CASE 
    WHEN NEW.referral_id IS NOT NULL THEN 'regular'
    WHEN NEW.advisor_override_id IS NOT NULL THEN 'advisor_override'
    ELSE 'unknown'
  END;
  
  IF TG_OP = 'INSERT' THEN
    event_type := 'payout_created';
    new_status := NEW.status;
    
    PERFORM public.log_referral_audit(
      event_type,
      referral_type,
      COALESCE(NEW.referral_id, NEW.advisor_override_id),
      NULL,
      new_status,
      NULL,
      jsonb_build_object(
        'payout_id', NEW.id,
        'payout_type', NEW.payout_type,
        'amount', NEW.amount,
        'tenant_id', NEW.tenant_id
      )
    );
    
  ELSIF TG_OP = 'UPDATE' THEN
    old_status := OLD.status;
    new_status := NEW.status;
    
    IF old_status != new_status THEN
      event_type := 'payout_status_changed';
      
      PERFORM public.log_referral_audit(
        event_type,
        referral_type,
        COALESCE(NEW.referral_id, NEW.advisor_override_id),
        old_status,
        new_status,
        NULL,
        jsonb_build_object(
          'payout_id', NEW.id,
          'payout_type', NEW.payout_type,
          'amount', NEW.amount,
          'approved_at', NEW.approved_at,
          'paid_at', NEW.paid_at,
          'payment_method', NEW.payment_method,
          'payment_reference', NEW.payment_reference
        )
      );
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger function for franchise payout audit logging
CREATE OR REPLACE FUNCTION public.audit_franchise_payout_changes()
RETURNS TRIGGER AS $$
DECLARE
  event_type TEXT;
  old_status TEXT;
  new_status TEXT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    event_type := 'payout_created';
    new_status := NEW.status;
    
    PERFORM public.log_referral_audit(
      event_type,
      'franchise',
      NEW.franchise_referral_id,
      NULL,
      new_status,
      NULL,
      jsonb_build_object(
        'payout_id', NEW.id,
        'payout_type', NEW.payout_type,
        'amount', NEW.amount,
        'referring_tenant_id', NEW.referring_tenant_id,
        'period_start', NEW.period_start,
        'period_end', NEW.period_end
      )
    );
    
  ELSIF TG_OP = 'UPDATE' THEN
    old_status := OLD.status;
    new_status := NEW.status;
    
    IF old_status != new_status THEN
      event_type := 'payout_status_changed';
      
      PERFORM public.log_referral_audit(
        event_type,
        'franchise',
        NEW.franchise_referral_id,
        old_status,
        new_status,
        NULL,
        jsonb_build_object(
          'payout_id', NEW.id,
          'payout_type', NEW.payout_type,
          'amount', NEW.amount,
          'approved_at', NEW.approved_at,
          'paid_at', NEW.paid_at,
          'payment_method', NEW.payment_method,
          'payment_reference', NEW.payment_reference
        )
      );
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for audit logging
DROP TRIGGER IF EXISTS audit_referrals_trigger ON public.referrals;
CREATE TRIGGER audit_referrals_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.referrals
  FOR EACH ROW EXECUTE FUNCTION public.audit_referral_changes();

DROP TRIGGER IF EXISTS audit_franchise_referrals_trigger ON public.franchise_referrals;
CREATE TRIGGER audit_franchise_referrals_trigger
  AFTER INSERT OR UPDATE ON public.franchise_referrals
  FOR EACH ROW EXECUTE FUNCTION public.audit_franchise_referral_changes();

DROP TRIGGER IF EXISTS audit_payouts_trigger ON public.referral_payouts;
CREATE TRIGGER audit_payouts_trigger
  AFTER INSERT OR UPDATE ON public.referral_payouts
  FOR EACH ROW EXECUTE FUNCTION public.audit_payout_changes();

DROP TRIGGER IF EXISTS audit_franchise_payouts_trigger ON public.franchise_referral_payouts;
CREATE TRIGGER audit_franchise_payouts_trigger
  AFTER INSERT OR UPDATE ON public.franchise_referral_payouts
  FOR EACH ROW EXECUTE FUNCTION public.audit_franchise_payout_changes();