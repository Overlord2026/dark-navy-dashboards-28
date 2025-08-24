import React from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ReadinessStatus {
  ready: boolean;
  score: number;
  total: number;
  missing_steps: string[];
  profile_complete: boolean;
  consent_ok: boolean;
  disclosures_done: boolean;
  vault_onboarded: boolean;
}

export const useReadyCheck = () => {
  const [readiness, setReadiness] = React.useState<ReadinessStatus | null>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchReadiness = React.useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setReadiness(null);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.rpc('get_user_readiness', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error fetching readiness:', error);
        setReadiness(null);
      } else if (data) {
        setReadiness(data as unknown as ReadinessStatus);
      }
    } catch (error) {
      console.error('Error in fetchReadiness:', error);
      setReadiness(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOnboardingStep = React.useCallback(async (step: string, completed: boolean = true) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const updateData: Record<string, boolean> = {};
      updateData[step] = completed;

      const { error } = await supabase
        .from('user_onboarding')
        .update(updateData)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating onboarding step:', error);
        return false;
      }

      // Refresh readiness after update
      await fetchReadiness();
      return true;
    } catch (error) {
      console.error('Error in updateOnboardingStep:', error);
      return false;
    }
  }, [fetchReadiness]);

  React.useEffect(() => {
    fetchReadiness();
  }, [fetchReadiness]);

  return {
    readiness,
    loading,
    refreshReadiness: fetchReadiness,
    updateOnboardingStep
  };
};