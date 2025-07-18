import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Referral {
  id: string;
  referral_code: string;
  referral_type: string;
  reward_amount: number;
  reward_type: string;
  status: string;
  expires_at?: string;
  activated_at?: string;
  paid_at?: string;
  created_at: string;
}

export interface AdvisorOverride {
  id: string;
  recruited_advisor_id: string;
  override_percent: number;
  production_period_start: string;
  production_period_end?: string;
  production_amount: number;
  override_amount: number;
  status: string;
  payment_frequency: string;
}

export const useReferrals = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [overrides, setOverrides] = useState<AdvisorOverride[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReferrals = async () => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferrals(data || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast({
        title: "Error",
        description: "Failed to load referrals",
        variant: "destructive",
      });
    }
  };

  const fetchOverrides = async () => {
    try {
      const { data, error } = await supabase
        .from('advisor_overrides')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOverrides(data || []);
    } catch (error) {
      console.error('Error fetching overrides:', error);
    }
  };

  const generateReferralCode = async (
    type: 'client' | 'advisor' | 'franchise', 
    rewardAmount: number = 100, 
    rewardType: string = 'credit', 
    refereeEmail?: string,
    utmData?: {
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
      utm_term?: string;
      utm_content?: string;
      campaign_data?: any;
    }
  ) => {
    try {
      // Get current user and tenant ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('tenant_id')
        .eq('id', user.id)
        .single();

      if (!profile?.tenant_id) {
        throw new Error('No tenant found');
      }

      // Validate referral creation (prevent duplicates, self-referral, rate limiting)
      const { error: validationError } = await supabase
        .rpc('validate_referral_creation', {
          p_referrer_id: user.id,
          p_referee_email: refereeEmail,
          p_referral_type: type,
          p_tenant_id: profile.tenant_id
        });

      if (validationError) throw validationError;

      // Generate unique code
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_referral_code');

      if (codeError) throw codeError;

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 90); // 90 days expiry

      const { data, error } = await supabase
        .from('referrals')
        .insert({
          tenant_id: profile.tenant_id,
          referrer_id: user.id,
          referral_code: codeData,
          referral_type: type,
          reward_amount: rewardAmount,
          reward_type: rewardType,
          expires_at: expiresAt.toISOString(),
          utm_source: utmData?.utm_source,
          utm_medium: utmData?.utm_medium,
          utm_campaign: utmData?.utm_campaign,
          utm_term: utmData?.utm_term,
          utm_content: utmData?.utm_content,
          campaign_data: utmData?.campaign_data,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: `Referral code ${codeData} generated successfully`,
      });

      await fetchReferrals();
      return data;
    } catch (error: any) {
      console.error('Error generating referral code:', error);
      
      // Handle specific validation errors
      let errorMessage = "Failed to generate referral code";
      if (error.message?.includes('Self-referral not allowed')) {
        errorMessage = "You cannot refer yourself";
      } else if (error.message?.includes('Duplicate referral detected')) {
        errorMessage = "This email has already been referred";
      } else if (error.message?.includes('Daily referral limit exceeded')) {
        errorMessage = "Daily referral limit reached (10 per day)";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const getReferralLink = (code: string) => {
    return `${window.location.origin}/signup?ref=${code}`;
  };

  const copyReferralLink = (code: string) => {
    const link = getReferralLink(code);
    navigator.clipboard.writeText(link);
    toast({
      title: "Copied",
      description: "Referral link copied to clipboard",
    });
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchReferrals(), fetchOverrides()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    referrals,
    overrides,
    loading,
    generateReferralCode,
    getReferralLink,
    copyReferralLink,
    refreshData: () => Promise.all([fetchReferrals(), fetchOverrides()]),
  };
};