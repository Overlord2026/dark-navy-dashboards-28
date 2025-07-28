import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionTierType } from '@/types/subscription';

interface UserProfile {
  subscription_tier: SubscriptionTierType;
  subscription_status: string;
  subscription_end_date: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

export function useSubscriptionAccess() {
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionPlan, setSubscriptionPlan] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await fetchSubscriptionData();
      } else {
        setIsLoading(false);
      }
    };
    
    fetchUser();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          subscription_tier,
          subscription_status,
          subscription_end_date,
          stripe_customer_id,
          stripe_subscription_id
        `)
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (error) {
        console.error('Error fetching subscription data:', error);
        return;
      }

      if (profile) {
        setSubscriptionPlan({
          subscription_tier: profile.subscription_tier || 'free',
          subscription_status: profile.subscription_status || 'inactive',
          subscription_end_date: profile.subscription_end_date,
          stripe_customer_id: profile.stripe_customer_id,
          stripe_subscription_id: profile.stripe_subscription_id,
        });
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkFeatureAccess = (tier: SubscriptionTierType): boolean => {
    if (!subscriptionPlan) return false;
    
    const tierHierarchy = {
      'free': 0,
      'basic': 1,
      'premium': 2,
      'elite': 3
    };
    
    const currentTierLevel = tierHierarchy[subscriptionPlan.subscription_tier] || 0;
    const requiredTierLevel = tierHierarchy[tier] || 0;
    
    return currentTierLevel >= requiredTierLevel && subscriptionPlan.subscription_status === 'active';
  };

  const isSubscriptionActive = (): boolean => {
    return subscriptionPlan?.subscription_status === 'active';
  };

  const syncWithStripe = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      // Refresh subscription data after sync
      await fetchSubscriptionData();
      
      toast({
        title: "Success",
        description: "Subscription status synchronized with Stripe",
      });
    } catch (error) {
      console.error('Error syncing with Stripe:', error);
      toast({
        title: "Error",
        description: "Failed to sync subscription status",
        variant: "destructive",
      });
    }
  };

  return {
    subscriptionPlan,
    isLoading,
    checkFeatureAccess,
    isSubscriptionActive,
    syncWithStripe,
    fetchSubscriptionData
  };
}