import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTenant } from './useTenant';

export interface TopReferrer {
  referrer_id: string | null;
  referrer_email: string;
  referrer_name: string;
  referrer_type: 'client_advisor' | 'franchise';
  total_referrals: number;
  active_referrals: number;
  total_rewards: number;
  conversion_rate: number;
}

export interface ConversionAnalytics {
  referral_type: 'client_advisor' | 'franchise';
  total_referrals: number;
  pending_referrals: number;
  active_referrals: number;
  expired_referrals: number;
  conversion_rate: number;
  avg_time_to_activation_days: number;
}

export interface RewardAnalytics {
  reward_type: 'referral_reward' | 'advisor_override' | 'franchise_reward';
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  count_total: number;
  count_paid: number;
  count_pending: number;
}

export interface CampaignAnalytics {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  total_referrals: number;
  active_referrals: number;
  conversion_rate: number;
  total_rewards: number;
}

export const useReferralAnalytics = (periodDays: number = 30) => {
  const { currentTenant } = useTenant();
  const [topReferrers, setTopReferrers] = useState<TopReferrer[]>([]);
  const [conversionAnalytics, setConversionAnalytics] = useState<ConversionAnalytics[]>([]);
  const [rewardAnalytics, setRewardAnalytics] = useState<RewardAnalytics[]>([]);
  const [campaignAnalytics, setCampaignAnalytics] = useState<CampaignAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentTenant) {
      loadAnalytics();
    }
  }, [currentTenant, periodDays]);

  const loadAnalytics = async () => {
    if (!currentTenant) return;

    setLoading(true);
    try {
      await Promise.all([
        fetchTopReferrers(),
        fetchConversionAnalytics(),
        fetchRewardAnalytics(),
        fetchCampaignAnalytics()
      ]);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopReferrers = async () => {
    if (!currentTenant) return;

    try {
      const { data, error } = await supabase
        .rpc('get_top_referrers', {
          p_tenant_id: currentTenant.id,
          p_period_days: periodDays,
          p_limit: 10
        });

      if (error) throw error;
      setTopReferrers((data || []).map(item => ({
        ...item,
        referrer_type: item.referrer_type as TopReferrer['referrer_type']
      })));
    } catch (error) {
      console.error('Error fetching top referrers:', error);
      throw error;
    }
  };

  const fetchConversionAnalytics = async () => {
    if (!currentTenant) return;

    try {
      const { data, error } = await supabase
        .rpc('get_referral_conversion_analytics', {
          p_tenant_id: currentTenant.id,
          p_period_days: periodDays
        });

      if (error) throw error;
      setConversionAnalytics((data || []).map(item => ({
        ...item,
        referral_type: item.referral_type as ConversionAnalytics['referral_type']
      })));
    } catch (error) {
      console.error('Error fetching conversion analytics:', error);
      throw error;
    }
  };

  const fetchRewardAnalytics = async () => {
    if (!currentTenant) return;

    try {
      const { data, error } = await supabase
        .rpc('get_reward_analytics', {
          p_tenant_id: currentTenant.id,
          p_period_days: periodDays
        });

      if (error) throw error;
      setRewardAnalytics((data || []).map(item => ({
        ...item,
        reward_type: item.reward_type as RewardAnalytics['reward_type']
      })));
    } catch (error) {
      console.error('Error fetching reward analytics:', error);
      throw error;
    }
  };

  const fetchCampaignAnalytics = async () => {
    if (!currentTenant) return;

    try {
      const { data, error } = await supabase
        .rpc('get_campaign_analytics', {
          p_tenant_id: currentTenant.id,
          p_period_days: periodDays
        });

      if (error) throw error;
      setCampaignAnalytics(data || []);
    } catch (error) {
      console.error('Error fetching campaign analytics:', error);
      throw error;
    }
  };

  // Calculate summary metrics
  const summaryMetrics = {
    totalReferrals: conversionAnalytics.reduce((sum, item) => sum + item.total_referrals, 0),
    totalActiveReferrals: conversionAnalytics.reduce((sum, item) => sum + item.active_referrals, 0),
    totalRewardsPaid: rewardAnalytics.reduce((sum, item) => sum + item.paid_amount, 0),
    totalRewardsPending: rewardAnalytics.reduce((sum, item) => sum + item.pending_amount, 0),
    overallConversionRate: conversionAnalytics.length > 0 
      ? conversionAnalytics.reduce((sum, item, _, array) => 
          sum + (item.conversion_rate / array.length), 0
        )
      : 0,
  };

  return {
    topReferrers,
    conversionAnalytics,
    rewardAnalytics,
    campaignAnalytics,
    summaryMetrics,
    loading,
    refreshAnalytics: loadAnalytics
  };
};