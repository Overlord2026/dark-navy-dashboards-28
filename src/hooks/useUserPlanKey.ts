import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';

/**
 * Hook to extract the user's current plan key from subscription data
 * Returns the plan key string that can be used for telemetry and analytics
 */
export function useUserPlanKey(): string {
  const { plan } = useSubscriptionAccess();
  
  // Return the plan as the key, defaulting to 'free' if undefined
  return plan || 'free';
}