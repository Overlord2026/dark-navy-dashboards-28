import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionPlan, AddOnAccess, UsageCounters, SubscriptionTierType } from '@/types/subscription';

export function useSubscriptionAccess() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    if (user) {
      fetchSubscriptionData();
    }
  }, [user]);

  const fetchSubscriptionData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Fetch user profile with subscription data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // Set subscription plan from profile data
      const plan: SubscriptionPlan = {
        tier: (profile?.subscription_tier || 'basic') as SubscriptionTierType,
        add_ons: {
          lending_access: profile?.lending_access || false,
          tax_access: profile?.tax_access || false,
          ai_features_access: profile?.ai_features_access || false,
          premium_analytics_access: profile?.premium_analytics_access || false,
          residency_optimization: true, // Default to true for now since no DB column
          advisor_marketplace: true, // Default to true for now since no DB column
          audit_risk_analyzer: true, // Default to true for now since no DB column
          relocation_concierge: true, // Default to true for now since no DB column
        },
        usage_counters: {
          lending_applications: profile?.lending_applications_used || 0,
          tax_analyses: profile?.tax_analyses_used || 0,
          ai_queries: profile?.ai_queries_used || 0,
          document_uploads: profile?.document_uploads_used || 0,
        },
        usage_limits: {
          lending_applications_limit: profile?.lending_applications_limit || getTierLimits((profile?.subscription_tier || 'basic') as SubscriptionTierType).lending_applications_limit,
          tax_analyses_limit: profile?.tax_analyses_limit || getTierLimits((profile?.subscription_tier || 'basic') as SubscriptionTierType).tax_analyses_limit,
          ai_queries_limit: profile?.ai_queries_limit || getTierLimits((profile?.subscription_tier || 'basic') as SubscriptionTierType).ai_queries_limit,
          document_uploads_limit: profile?.document_uploads_limit || getTierLimits((profile?.subscription_tier || 'basic') as SubscriptionTierType).document_uploads_limit,
        },
        stripe_subscription_id: profile?.stripe_subscription_id,
        stripe_customer_id: profile?.stripe_customer_id,
        is_active: profile?.subscription_active || false,
      };

      setSubscriptionPlan(plan);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTierLimits = (tier: SubscriptionTierType) => {
    const limits = {
      free: {
        lending_applications_limit: 0,
        tax_analyses_limit: 1,
        ai_queries_limit: 5,
        document_uploads_limit: 3,
      },
      basic: {
        lending_applications_limit: 3,
        tax_analyses_limit: 5,
        ai_queries_limit: 20,
        document_uploads_limit: 10,
      },
      premium: {
        lending_applications_limit: 10,
        tax_analyses_limit: 20,
        ai_queries_limit: 100,
        document_uploads_limit: 50,
      },
      elite: {
        lending_applications_limit: -1, // unlimited
        tax_analyses_limit: -1,
        ai_queries_limit: -1,
        document_uploads_limit: -1,
      },
    };
    
    return limits[tier] || limits.basic;
  };

  const checkFeatureAccess = (feature: keyof AddOnAccess): boolean => {
    if (!subscriptionPlan || !subscriptionPlan.is_active) return false;
    return subscriptionPlan.add_ons[feature];
  };

  const checkUsageLimit = (feature: keyof UsageCounters): { hasAccess: boolean; remaining: number; isAtLimit: boolean } => {
    if (!subscriptionPlan) {
      return { hasAccess: false, remaining: 0, isAtLimit: true };
    }

    const currentUsage = subscriptionPlan.usage_counters[feature];
    const limit = subscriptionPlan.usage_limits[`${feature}_limit` as keyof typeof subscriptionPlan.usage_limits];
    
    // -1 means unlimited
    if (limit === -1) {
      return { hasAccess: true, remaining: -1, isAtLimit: false };
    }

    const remaining = Math.max(0, limit - currentUsage);
    const isAtLimit = currentUsage >= limit;
    
    return { hasAccess: !isAtLimit, remaining, isAtLimit };
  };

  const incrementUsage = async (feature: keyof UsageCounters) => {
    if (!user || !subscriptionPlan) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          [`${feature}_used`]: subscriptionPlan.usage_counters[feature] + 1
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local state
      setSubscriptionPlan(prev => prev ? {
        ...prev,
        usage_counters: {
          ...prev.usage_counters,
          [feature]: prev.usage_counters[feature] + 1
        }
      } : null);

      return true;
    } catch (error) {
      console.error('Error incrementing usage:', error);
      return false;
    }
  };

  const syncWithStripe = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('sync-subscription-stripe', {
        body: { user_id: user.id }
      });

      if (error) throw error;

      // Refresh subscription data
      await fetchSubscriptionData();
      
      toast({
        title: "Success",
        description: "Subscription synced with Stripe",
      });
    } catch (error) {
      console.error('Error syncing with Stripe:', error);
      toast({
        title: "Error",
        description: "Failed to sync subscription",
        variant: "destructive",
      });
    }
  };

  return {
    subscriptionPlan,
    isLoading,
    checkFeatureAccess,
    checkUsageLimit,
    incrementUsage,
    syncWithStripe,
    refetch: fetchSubscriptionData,
  };
}