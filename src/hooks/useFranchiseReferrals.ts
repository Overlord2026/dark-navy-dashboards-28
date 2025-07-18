import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTenant } from './useTenant';

export interface FranchiseReferral {
  id: string;
  tenant_id: string;
  referring_tenant_id: string;
  referral_code: string;
  referred_firm_name: string;
  referred_contact_name: string;
  referred_contact_email: string;
  referred_contact_phone?: string;
  firm_size?: number;
  expected_aum?: number;
  status: 'pending' | 'contacted' | 'demo_scheduled' | 'negotiating' | 'signed' | 'cancelled' | 'expired';
  contacted_at?: string;
  demo_scheduled_at?: string;
  signed_at?: string;
  expires_at?: string;
  referral_reward_type: 'percentage' | 'fixed' | 'royalty';
  referral_reward_amount: number;
  royalty_period_months?: number;
  reward_status: 'pending' | 'approved' | 'paid' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FranchiseReferralPayout {
  id: string;
  franchise_referral_id: string;
  tenant_id: string;
  referring_tenant_id: string;
  payout_type: 'referral_bonus' | 'monthly_royalty' | 'annual_royalty';
  amount: number;
  currency: string;
  period_start?: string;
  period_end?: string;
  status: 'pending' | 'approved' | 'processing' | 'paid' | 'failed' | 'cancelled';
  approved_at?: string;
  approved_by?: string;
  paid_at?: string;
  payment_method?: string;
  payment_reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useFranchiseReferrals = () => {
  const { currentTenant } = useTenant();
  const [referrals, setReferrals] = useState<FranchiseReferral[]>([]);
  const [payouts, setPayouts] = useState<FranchiseReferralPayout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentTenant) {
      Promise.all([
        fetchReferrals(),
        fetchPayouts()
      ]).finally(() => setLoading(false));
    }
  }, [currentTenant]);

  const fetchReferrals = async () => {
    if (!currentTenant) return;

    try {
      const { data, error } = await supabase
        .from('franchise_referrals')
        .select('*')
        .or(`tenant_id.eq.${currentTenant.id},referring_tenant_id.eq.${currentTenant.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReferrals((data || []).map(referral => ({
        ...referral,
        status: referral.status as FranchiseReferral['status'],
        referral_reward_type: referral.referral_reward_type as FranchiseReferral['referral_reward_type'],
        reward_status: referral.reward_status as FranchiseReferral['reward_status']
      })));
    } catch (err) {
      console.error('Failed to fetch franchise referrals:', err);
      toast.error('Failed to load franchise referrals');
    }
  };

  const fetchPayouts = async () => {
    if (!currentTenant) return;

    try {
      const { data, error } = await supabase
        .from('franchise_referral_payouts')
        .select('*')
        .or(`tenant_id.eq.${currentTenant.id},referring_tenant_id.eq.${currentTenant.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayouts((data || []).map(payout => ({
        ...payout,
        payout_type: payout.payout_type as FranchiseReferralPayout['payout_type'],
        status: payout.status as FranchiseReferralPayout['status']
      })));
    } catch (err) {
      console.error('Failed to fetch franchise payouts:', err);
      toast.error('Failed to load franchise payouts');
    }
  };

  const generateReferralCode = async (
    referralData: Partial<FranchiseReferral> & {
      utm_source?: string;
      utm_medium?: string;
      utm_campaign?: string;
      utm_term?: string;
      utm_content?: string;
      campaign_data?: any;
    }
  ) => {
    if (!currentTenant) return;

    try {
      // Validate franchise referral creation (prevent duplicates, self-referral, rate limiting)
      const { error: validationError } = await supabase
        .rpc('validate_franchise_referral_creation', {
          p_referring_tenant_id: currentTenant.id,
          p_contact_email: referralData.referred_contact_email || '',
          p_firm_name: referralData.referred_firm_name || ''
        });

      if (validationError) throw validationError;

      // Generate referral code
      const { data: codeData, error: codeError } = await supabase
        .rpc('generate_franchise_referral_code');

      if (codeError) throw codeError;

      const { data, error } = await supabase
        .from('franchise_referrals')
        .insert({
          referral_code: codeData,
          referring_tenant_id: currentTenant.id,
          tenant_id: currentTenant.id,
          referred_firm_name: referralData.referred_firm_name || '',
          referred_contact_name: referralData.referred_contact_name || '',
          referred_contact_email: referralData.referred_contact_email || '',
          referred_contact_phone: referralData.referred_contact_phone,
          firm_size: referralData.firm_size,
          expected_aum: referralData.expected_aum,
          referral_reward_type: referralData.referral_reward_type || 'percentage',
          referral_reward_amount: referralData.referral_reward_amount || 0,
          royalty_period_months: referralData.royalty_period_months,
          notes: referralData.notes,
          utm_source: referralData.utm_source,
          utm_medium: referralData.utm_medium,
          utm_campaign: referralData.utm_campaign,
          utm_term: referralData.utm_term,
          utm_content: referralData.utm_content,
          campaign_data: referralData.campaign_data,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchReferrals();
      toast.success('Franchise referral created successfully');
      return data;
    } catch (err: any) {
      console.error('Failed to create franchise referral:', err);
      
      // Handle specific validation errors
      let errorMessage = 'Failed to create franchise referral';
      if (err.message?.includes('Self-referral not allowed')) {
        errorMessage = 'You cannot refer your own firm';
      } else if (err.message?.includes('Duplicate franchise referral detected')) {
        errorMessage = 'This firm or contact has already been referred';
      } else if (err.message?.includes('Daily franchise referral limit exceeded')) {
        errorMessage = 'Daily franchise referral limit reached (5 per day)';
      } else if (err.message) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
      throw err;
    }
  };

  const updateReferralStatus = async (referralId: string, status: FranchiseReferral['status'], notes?: string) => {
    try {
      const updateData: any = { status, notes };
      
      if (status === 'contacted') updateData.contacted_at = new Date().toISOString();
      if (status === 'demo_scheduled') updateData.demo_scheduled_at = new Date().toISOString();
      if (status === 'signed') updateData.signed_at = new Date().toISOString();

      const { error } = await supabase
        .from('franchise_referrals')
        .update(updateData)
        .eq('id', referralId);

      if (error) throw error;

      await fetchReferrals();
      toast.success('Referral status updated');
    } catch (err) {
      console.error('Failed to update referral status:', err);
      toast.error('Failed to update referral status');
    }
  };

  const createPayout = async (
    franchiseReferralId: string,
    payoutType: FranchiseReferralPayout['payout_type'],
    amount: number,
    periodStart?: string,
    periodEnd?: string
  ) => {
    try {
      const { data, error } = await supabase
        .rpc('create_franchise_referral_payout', {
          p_franchise_referral_id: franchiseReferralId,
          p_payout_type: payoutType,
          p_amount: amount,
          p_period_start: periodStart,
          p_period_end: periodEnd
        });

      if (error) throw error;

      await fetchPayouts();
      toast.success('Payout created successfully');
      return data;
    } catch (err) {
      console.error('Failed to create payout:', err);
      toast.error('Failed to create payout');
    }
  };

  const updatePayoutStatus = async (
    payoutId: string, 
    status: FranchiseReferralPayout['status'],
    paymentMethod?: string,
    paymentReference?: string
  ) => {
    try {
      const updateData: any = { status };
      
      if (status === 'approved') updateData.approved_at = new Date().toISOString();
      if (status === 'paid') {
        updateData.paid_at = new Date().toISOString();
        if (paymentMethod) updateData.payment_method = paymentMethod;
        if (paymentReference) updateData.payment_reference = paymentReference;
      }

      const { error } = await supabase
        .from('franchise_referral_payouts')
        .update(updateData)
        .eq('id', payoutId);

      if (error) throw error;

      await fetchPayouts();
      toast.success('Payout status updated');
    } catch (err) {
      console.error('Failed to update payout status:', err);
      toast.error('Failed to update payout status');
    }
  };

  const getReferralLink = (code: string) => {
    return `${window.location.origin}/franchise-referral/${code}`;
  };

  const copyReferralLink = (code: string) => {
    const link = getReferralLink(code);
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied to clipboard');
  };

  return {
    referrals,
    payouts,
    loading,
    generateReferralCode,
    updateReferralStatus,
    createPayout,
    updatePayoutStatus,
    getReferralLink,
    copyReferralLink,
    refreshData: () => Promise.all([fetchReferrals(), fetchPayouts()])
  };
};