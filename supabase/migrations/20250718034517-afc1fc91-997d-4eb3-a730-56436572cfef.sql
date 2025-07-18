-- Add UTM/campaign tracking to referrals
ALTER TABLE public.referrals 
ADD COLUMN utm_source TEXT,
ADD COLUMN utm_medium TEXT,
ADD COLUMN utm_campaign TEXT,
ADD COLUMN utm_term TEXT,
ADD COLUMN utm_content TEXT,
ADD COLUMN campaign_data JSONB;

ALTER TABLE public.franchise_referrals
ADD COLUMN utm_source TEXT,
ADD COLUMN utm_medium TEXT,
ADD COLUMN utm_campaign TEXT,
ADD COLUMN utm_term TEXT,
ADD COLUMN utm_content TEXT,
ADD COLUMN campaign_data JSONB;

-- Create analytics functions for referral dashboard

-- Function to get top referrers across all types
CREATE OR REPLACE FUNCTION public.get_top_referrers(
  p_tenant_id UUID,
  p_period_days INTEGER DEFAULT 30,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
  referrer_id UUID,
  referrer_email TEXT,
  referrer_name TEXT,
  referrer_type TEXT,
  total_referrals BIGINT,
  active_referrals BIGINT,
  total_rewards NUMERIC,
  conversion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH regular_referrers AS (
    SELECT 
      r.referrer_id,
      u.email as referrer_email,
      COALESCE(p.display_name, p.first_name || ' ' || p.last_name) as referrer_name,
      'client_advisor' as referrer_type,
      COUNT(*) as total_referrals,
      COUNT(CASE WHEN r.status = 'active' THEN 1 END) as active_referrals,
      COALESCE(SUM(rr.amount), 0) as total_rewards
    FROM public.referrals r
    JOIN auth.users u ON r.referrer_id = u.id
    LEFT JOIN public.profiles p ON r.referrer_id = p.id
    LEFT JOIN public.referral_rewards rr ON r.id = rr.referral_id AND rr.status = 'paid'
    WHERE r.tenant_id = p_tenant_id
    AND r.created_at >= NOW() - (p_period_days || ' days')::INTERVAL
    GROUP BY r.referrer_id, u.email, p.display_name, p.first_name, p.last_name
  ),
  franchise_referrers AS (
    SELECT 
      NULL::UUID as referrer_id,
      t.admin_email as referrer_email,
      t.company_name as referrer_name,
      'franchise' as referrer_type,
      COUNT(*) as total_referrals,
      COUNT(CASE WHEN fr.status = 'signed' THEN 1 END) as active_referrals,
      COALESCE(SUM(frp.amount), 0) as total_rewards
    FROM public.franchise_referrals fr
    JOIN public.tenants t ON fr.referring_tenant_id = t.id
    LEFT JOIN public.franchise_referral_payouts frp ON fr.id = frp.franchise_referral_id AND frp.status = 'paid'
    WHERE fr.tenant_id = p_tenant_id
    AND fr.created_at >= NOW() - (p_period_days || ' days')::INTERVAL
    GROUP BY t.admin_email, t.company_name
  ),
  combined_referrers AS (
    SELECT * FROM regular_referrers
    UNION ALL
    SELECT * FROM franchise_referrers
  )
  SELECT 
    cr.referrer_id,
    cr.referrer_email,
    cr.referrer_name,
    cr.referrer_type,
    cr.total_referrals,
    cr.active_referrals,
    cr.total_rewards,
    CASE 
      WHEN cr.total_referrals > 0 THEN 
        ROUND((cr.active_referrals::NUMERIC / cr.total_referrals::NUMERIC) * 100, 2)
      ELSE 0 
    END as conversion_rate
  FROM combined_referrers cr
  ORDER BY cr.total_referrals DESC, cr.total_rewards DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get referral conversion analytics
CREATE OR REPLACE FUNCTION public.get_referral_conversion_analytics(
  p_tenant_id UUID,
  p_period_days INTEGER DEFAULT 30
)
RETURNS TABLE(
  referral_type TEXT,
  total_referrals BIGINT,
  pending_referrals BIGINT,
  active_referrals BIGINT,
  expired_referrals BIGINT,
  conversion_rate NUMERIC,
  avg_time_to_activation_days NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH regular_stats AS (
    SELECT 
      'client_advisor' as referral_type,
      COUNT(*) as total_referrals,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_referrals,
      COUNT(CASE WHEN status = 'active' THEN 1 END) as active_referrals,
      COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_referrals,
      AVG(CASE 
        WHEN activated_at IS NOT NULL THEN 
          EXTRACT(EPOCH FROM (activated_at - created_at)) / 86400 
      END) as avg_time_to_activation_days
    FROM public.referrals
    WHERE tenant_id = p_tenant_id
    AND created_at >= NOW() - (p_period_days || ' days')::INTERVAL
  ),
  franchise_stats AS (
    SELECT 
      'franchise' as referral_type,
      COUNT(*) as total_referrals,
      COUNT(CASE WHEN status IN ('pending', 'contacted', 'demo_scheduled', 'negotiating') THEN 1 END) as pending_referrals,
      COUNT(CASE WHEN status = 'signed' THEN 1 END) as active_referrals,
      COUNT(CASE WHEN status IN ('cancelled', 'expired') THEN 1 END) as expired_referrals,
      AVG(CASE 
        WHEN signed_at IS NOT NULL THEN 
          EXTRACT(EPOCH FROM (signed_at - created_at)) / 86400 
      END) as avg_time_to_activation_days
    FROM public.franchise_referrals
    WHERE tenant_id = p_tenant_id
    AND created_at >= NOW() - (p_period_days || ' days')::INTERVAL
  ),
  combined_stats AS (
    SELECT * FROM regular_stats
    UNION ALL
    SELECT * FROM franchise_stats
  )
  SELECT 
    cs.referral_type,
    cs.total_referrals,
    cs.pending_referrals,
    cs.active_referrals,
    cs.expired_referrals,
    CASE 
      WHEN cs.total_referrals > 0 THEN 
        ROUND((cs.active_referrals::NUMERIC / cs.total_referrals::NUMERIC) * 100, 2)
      ELSE 0 
    END as conversion_rate,
    ROUND(cs.avg_time_to_activation_days, 1) as avg_time_to_activation_days
  FROM combined_stats cs;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get reward/payout analytics
CREATE OR REPLACE FUNCTION public.get_reward_analytics(
  p_tenant_id UUID,
  p_period_days INTEGER DEFAULT 30
)
RETURNS TABLE(
  reward_type TEXT,
  total_amount NUMERIC,
  paid_amount NUMERIC,
  pending_amount NUMERIC,
  count_total BIGINT,
  count_paid BIGINT,
  count_pending BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH regular_rewards AS (
    SELECT 
      'referral_reward' as reward_type,
      COALESCE(SUM(rp.amount), 0) as total_amount,
      COALESCE(SUM(CASE WHEN rp.status = 'paid' THEN rp.amount ELSE 0 END), 0) as paid_amount,
      COALESCE(SUM(CASE WHEN rp.status IN ('pending', 'approved', 'processing') THEN rp.amount ELSE 0 END), 0) as pending_amount,
      COUNT(*) as count_total,
      COUNT(CASE WHEN rp.status = 'paid' THEN 1 END) as count_paid,
      COUNT(CASE WHEN rp.status IN ('pending', 'approved', 'processing') THEN 1 END) as count_pending
    FROM public.referral_payouts rp
    WHERE rp.tenant_id = p_tenant_id
    AND rp.created_at >= NOW() - (p_period_days || ' days')::INTERVAL
    AND rp.referral_id IS NOT NULL
  ),
  advisor_overrides AS (
    SELECT 
      'advisor_override' as reward_type,
      COALESCE(SUM(rp.amount), 0) as total_amount,
      COALESCE(SUM(CASE WHEN rp.status = 'paid' THEN rp.amount ELSE 0 END), 0) as paid_amount,
      COALESCE(SUM(CASE WHEN rp.status IN ('pending', 'approved', 'processing') THEN rp.amount ELSE 0 END), 0) as pending_amount,
      COUNT(*) as count_total,
      COUNT(CASE WHEN rp.status = 'paid' THEN 1 END) as count_paid,
      COUNT(CASE WHEN rp.status IN ('pending', 'approved', 'processing') THEN 1 END) as count_pending
    FROM public.referral_payouts rp
    WHERE rp.tenant_id = p_tenant_id
    AND rp.created_at >= NOW() - (p_period_days || ' days')::INTERVAL
    AND rp.advisor_override_id IS NOT NULL
  ),
  franchise_rewards AS (
    SELECT 
      'franchise_reward' as reward_type,
      COALESCE(SUM(frp.amount), 0) as total_amount,
      COALESCE(SUM(CASE WHEN frp.status = 'paid' THEN frp.amount ELSE 0 END), 0) as paid_amount,
      COALESCE(SUM(CASE WHEN frp.status IN ('pending', 'approved', 'processing') THEN frp.amount ELSE 0 END), 0) as pending_amount,
      COUNT(*) as count_total,
      COUNT(CASE WHEN frp.status = 'paid' THEN 1 END) as count_paid,
      COUNT(CASE WHEN frp.status IN ('pending', 'approved', 'processing') THEN 1 END) as count_pending
    FROM public.franchise_referral_payouts frp
    WHERE frp.tenant_id = p_tenant_id
    AND frp.created_at >= NOW() - (p_period_days || ' days')::INTERVAL
  )
  SELECT * FROM regular_rewards
  UNION ALL
  SELECT * FROM advisor_overrides
  UNION ALL
  SELECT * FROM franchise_rewards;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get UTM/campaign analytics
CREATE OR REPLACE FUNCTION public.get_campaign_analytics(
  p_tenant_id UUID,
  p_period_days INTEGER DEFAULT 30
)
RETURNS TABLE(
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  total_referrals BIGINT,
  active_referrals BIGINT,
  conversion_rate NUMERIC,
  total_rewards NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  WITH campaign_stats AS (
    SELECT 
      COALESCE(r.utm_source, 'direct') as utm_source,
      COALESCE(r.utm_medium, 'unknown') as utm_medium,
      COALESCE(r.utm_campaign, 'none') as utm_campaign,
      COUNT(*) as total_referrals,
      COUNT(CASE WHEN r.status = 'active' THEN 1 END) as active_referrals,
      COALESCE(SUM(rr.amount), 0) as total_rewards
    FROM public.referrals r
    LEFT JOIN public.referral_rewards rr ON r.id = rr.referral_id AND rr.status = 'paid'
    WHERE r.tenant_id = p_tenant_id
    AND r.created_at >= NOW() - (p_period_days || ' days')::INTERVAL
    GROUP BY r.utm_source, r.utm_medium, r.utm_campaign
    
    UNION ALL
    
    SELECT 
      COALESCE(fr.utm_source, 'direct') as utm_source,
      COALESCE(fr.utm_medium, 'unknown') as utm_medium,
      COALESCE(fr.utm_campaign, 'none') as utm_campaign,
      COUNT(*) as total_referrals,
      COUNT(CASE WHEN fr.status = 'signed' THEN 1 END) as active_referrals,
      COALESCE(SUM(frp.amount), 0) as total_rewards
    FROM public.franchise_referrals fr
    LEFT JOIN public.franchise_referral_payouts frp ON fr.id = frp.franchise_referral_id AND frp.status = 'paid'
    WHERE fr.tenant_id = p_tenant_id
    AND fr.created_at >= NOW() - (p_period_days || ' days')::INTERVAL
    GROUP BY fr.utm_source, fr.utm_medium, fr.utm_campaign
  )
  SELECT 
    cs.utm_source,
    cs.utm_medium,
    cs.utm_campaign,
    SUM(cs.total_referrals) as total_referrals,
    SUM(cs.active_referrals) as active_referrals,
    CASE 
      WHEN SUM(cs.total_referrals) > 0 THEN 
        ROUND((SUM(cs.active_referrals)::NUMERIC / SUM(cs.total_referrals)::NUMERIC) * 100, 2)
      ELSE 0 
    END as conversion_rate,
    SUM(cs.total_rewards) as total_rewards
  FROM campaign_stats cs
  GROUP BY cs.utm_source, cs.utm_medium, cs.utm_campaign
  ORDER BY SUM(cs.total_referrals) DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;