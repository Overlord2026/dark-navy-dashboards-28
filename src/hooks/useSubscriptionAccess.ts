import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionTierType, AddOnAccess, UsageCounters, UsageLimits } from '@/types/subscription';

interface UserProfile {
  subscription_tier: SubscriptionTierType;
  subscription_status: string;
  subscription_end_date: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  tier: SubscriptionTierType; // Alias for backward compatibility
  add_ons?: AddOnAccess;
  usage_counters?: UsageCounters;
  usage_limits?: UsageLimits;
  is_active?: boolean;
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
        const tier = (profile as any).subscription_tier || 'free';
        setSubscriptionPlan({
          subscription_tier: tier,
          subscription_status: (profile as any).subscription_status || 'inactive',
          subscription_end_date: (profile as any).subscription_end_date,
          stripe_customer_id: (profile as any).stripe_customer_id,
          stripe_subscription_id: (profile as any).stripe_subscription_id,
          tier: tier, // Alias for backward compatibility
          add_ons: {
            lending_access: tier === 'premium' || tier === 'elite',
            tax_access: tier === 'premium' || tier === 'elite',
            ai_features_access: tier === 'premium' || tier === 'elite',
            premium_analytics_access: tier === 'premium' || tier === 'elite',
            residency_optimization: tier === 'premium' || tier === 'elite',
            advisor_marketplace: tier === 'elite',
            audit_risk_analyzer: tier === 'elite',
            relocation_concierge: tier === 'elite',
            bill_pay_premium: tier === 'premium' || tier === 'elite',
            premium_property_features: tier === 'premium' || tier === 'elite',
          },
          usage_counters: {
            lending_applications: 0,
            tax_analyses: 0,
            ai_queries: 0,
            document_uploads: 0,
          },
          usage_limits: {
            lending_applications_limit: tier === 'free' ? 1 : tier === 'basic' ? 5 : 999,
            tax_analyses_limit: tier === 'free' ? 1 : tier === 'basic' ? 3 : 999,
            ai_queries_limit: tier === 'free' ? 10 : tier === 'basic' ? 100 : 999,
            document_uploads_limit: tier === 'free' ? 5 : tier === 'basic' ? 25 : 999,
          },
          is_active: (profile as any).subscription_status === 'active',
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

  const checkAddOnAccess = (addOnKey: keyof AddOnAccess): boolean => {
    if (!subscriptionPlan?.add_ons) return false;
    return subscriptionPlan.add_ons[addOnKey] || false;
  };

  const checkUsageLimit = (usageType: keyof UsageCounters): boolean => {
    if (!subscriptionPlan?.usage_counters || !subscriptionPlan?.usage_limits) return true;
    const current = subscriptionPlan.usage_counters[usageType] || 0;
    const limit = subscriptionPlan.usage_limits[usageType] || 0;
    return current < limit;
  };

  const incrementUsage = async (usageType: keyof UsageCounters): Promise<void> => {
    // This would typically update the database
    console.log(`Incrementing usage for ${usageType}`);
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
    checkAddOnAccess,
    checkUsageLimit,
    incrementUsage,
    isSubscriptionActive,
    syncWithStripe,
    fetchSubscriptionData
  };
}