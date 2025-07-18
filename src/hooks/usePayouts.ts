import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ReferralPayout {
  id: string;
  tenant_id: string;
  referral_id?: string;
  advisor_override_id?: string;
  payout_type: 'referral_reward' | 'advisor_override';
  amount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  paid_at?: string;
  payment_method?: string;
  payment_reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  referral?: {
    referral_code: string;
    referral_type: string;
    referrer_id: string;
  };
  advisor_override?: {
    referring_advisor_id: string;
    recruited_advisor_id: string;
    override_percent: number;
  };
}

export interface PayoutNotification {
  id: string;
  user_id: string;
  payout_id: string;
  notification_type: 'payout_ready' | 'payout_approved' | 'payout_paid';
  sent_at?: string;
  email_sent: boolean;
  push_sent: boolean;
  created_at: string;
}

export const usePayouts = () => {
  const [payouts, setPayouts] = useState<ReferralPayout[]>([]);
  const [userPayouts, setUserPayouts] = useState<ReferralPayout[]>([]);
  const [notifications, setNotifications] = useState<PayoutNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPayouts = async () => {
    try {
      const { data, error } = await supabase
        .from('referral_payouts')
        .select(`
          *,
          referral:referrals(referral_code, referral_type, referrer_id),
          advisor_override:advisor_overrides(referring_advisor_id, recruited_advisor_id, override_percent)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayouts(data as ReferralPayout[] || []);
    } catch (error) {
      console.error('Error fetching payouts:', error);
      toast({
        title: "Error",
        description: "Failed to load payouts",
        variant: "destructive",
      });
    }
  };

  const fetchUserPayouts = async () => {
    try {
      const { data, error } = await supabase
        .from('referral_payouts')
        .select(`
          *,
          referral:referrals(referral_code, referral_type, referrer_id),
          advisor_override:advisor_overrides(referring_advisor_id, recruited_advisor_id, override_percent)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserPayouts(data as ReferralPayout[] || []);
    } catch (error) {
      console.error('Error fetching user payouts:', error);
    }
  };

  const updatePayoutStatus = async (payoutId: string, status: 'approved' | 'paid' | 'rejected', notes?: string, paymentMethod?: string, paymentReference?: string) => {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === 'approved') {
        updateData.approved_by = (await supabase.auth.getUser()).data.user?.id;
        updateData.approved_at = new Date().toISOString();
      } else if (status === 'paid') {
        updateData.paid_at = new Date().toISOString();
        if (paymentMethod) updateData.payment_method = paymentMethod;
        if (paymentReference) updateData.payment_reference = paymentReference;
      }

      if (notes) updateData.notes = notes;

      const { error } = await supabase
        .from('referral_payouts')
        .update(updateData)
        .eq('id', payoutId);

      if (error) throw error;

      // Create notification for status change
      if (status === 'approved' || status === 'paid') {
        await createNotification(payoutId, status === 'approved' ? 'payout_approved' : 'payout_paid');
      }

      toast({
        title: "Success",
        description: `Payout ${status} successfully`,
      });

      await fetchPayouts();
      await fetchUserPayouts();
    } catch (error) {
      console.error('Error updating payout status:', error);
      toast({
        title: "Error",
        description: "Failed to update payout status",
        variant: "destructive",
      });
    }
  };

  const createNotification = async (payoutId: string, notificationType: 'payout_approved' | 'payout_paid') => {
    try {
      // Get payout details to find the user
      const { data: payout } = await supabase
        .from('referral_payouts')
        .select(`
          *,
          referral:referrals(referrer_id),
          advisor_override:advisor_overrides(referring_advisor_id)
        `)
        .eq('id', payoutId)
        .single();

      if (!payout) return;

      const userId = payout.referral?.referrer_id || payout.advisor_override?.referring_advisor_id;
      if (!userId) return;

      const { error } = await supabase
        .from('payout_notifications')
        .insert({
          user_id: userId,
          payout_id: payoutId,
          notification_type: notificationType,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const createPayoutFromReferral = async (referralId: string) => {
    try {
      const { data, error } = await supabase.rpc('create_referral_payout', {
        p_referral_id: referralId
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payout created from referral",
      });

      await fetchPayouts();
      return data;
    } catch (error) {
      console.error('Error creating payout from referral:', error);
      toast({
        title: "Error",
        description: "Failed to create payout from referral",
        variant: "destructive",
      });
    }
  };

  const createPayoutFromOverride = async (overrideId: string) => {
    try {
      const { data, error } = await supabase.rpc('create_override_payout', {
        p_override_id: overrideId
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Payout created from override",
      });

      await fetchPayouts();
      return data;
    } catch (error) {
      console.error('Error creating payout from override:', error);
      toast({
        title: "Error",
        description: "Failed to create payout from override",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchPayouts(), fetchUserPayouts()]);
      setLoading(false);
    };

    loadData();
  }, []);

  return {
    payouts,
    userPayouts,
    notifications,
    loading,
    updatePayoutStatus,
    createPayoutFromReferral,
    createPayoutFromOverride,
    refreshData: () => Promise.all([fetchPayouts(), fetchUserPayouts()]),
  };
};