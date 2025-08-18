import { supabase } from '@/lib/supabase';
import { Plan } from '@/types/pricing';
import { analytics } from '@/lib/analytics';

export interface TrialConfig {
  persona: 'families' | 'professionals';
  plan: Plan;
  durationDays: number;
  segment?: string;
}

export interface TrialGrant {
  id: string;
  user_id: string;
  plan: Plan;
  persona: string;
  segment?: string;
  trial_start: string;
  trial_end: string;
  is_active: boolean;
  converted_at?: string;
  created_at: string;
}

// Default trial configurations
export const TRIAL_CONFIGS: Record<string, TrialConfig> = {
  'families_premium': {
    persona: 'families',
    plan: 'premium',
    durationDays: 14
  },
  'advisors_standard': {
    persona: 'professionals',
    plan: 'premium', // Map to our standard plan system
    durationDays: 7,
    segment: 'advisors'
  }
};

export class TrialManager {
  static async startTrial(config: TrialConfig): Promise<TrialGrant | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if user already has an active trial for this plan
      const { data: existingTrial } = await supabase
        .from('trial_grants')
        .select('*')
        .eq('user_id', user.id)
        .eq('plan', config.plan)
        .eq('persona', config.persona)
        .eq('is_active', true)
        .single();

      if (existingTrial) {
        throw new Error('User already has an active trial for this plan');
      }

      const trialStart = new Date();
      const trialEnd = new Date(trialStart.getTime() + (config.durationDays * 24 * 60 * 60 * 1000));

      // Create trial grant
      const { data: trial, error } = await supabase
        .from('trial_grants')
        .insert({
          user_id: user.id,
          plan: config.plan,
          persona: config.persona,
          segment: config.segment || null,
          trial_start: trialStart.toISOString(),
          trial_end: trialEnd.toISOString(),
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      // Track trial start
      analytics.track('trial.start', {
        persona: config.persona,
        segment: config.segment || 'general',
        plan: config.plan,
        trial_duration_days: config.durationDays,
        trial_id: trial.id
      });

      return trial as TrialGrant;
    } catch (error) {
      console.error('Failed to start trial:', error);
      return null;
    }
  }

  static async getActiveTrial(userId: string): Promise<TrialGrant | null> {
    try {
      const { data: trial, error } = await supabase
        .from('trial_grants')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .gte('trial_end', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return trial as TrialGrant || null;
    } catch (error) {
      console.error('Failed to get active trial:', error);
      return null;
    }
  }

  static async convertTrial(trialId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('trial_grants')
        .update({
          converted_at: new Date().toISOString(),
          is_active: false
        })
        .eq('id', trialId);

      if (error) throw error;

      // Get trial details for tracking
      const { data: trial } = await supabase
        .from('trial_grants')
        .select('*')
        .eq('id', trialId)
        .single();

      if (trial) {
        analytics.track('trial.convert', {
          persona: trial.persona,
          segment: trial.segment || 'general',
          plan: trial.plan,
          trial_id: trialId,
          trial_duration_actual: Math.floor(
            (new Date(trial.converted_at!).getTime() - new Date(trial.trial_start).getTime()) / (1000 * 60 * 60 * 24)
          )
        });
      }

      return true;
    } catch (error) {
      console.error('Failed to convert trial:', error);
      return false;
    }
  }

  static async expireTrial(trialId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('trial_grants')
        .update({ is_active: false })
        .eq('id', trialId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to expire trial:', error);
      return false;
    }
  }

  static getDaysRemaining(trial: TrialGrant): number {
    const now = new Date();
    const end = new Date(trial.trial_end);
    const diffTime = end.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  static isTrialExpired(trial: TrialGrant): boolean {
    return new Date() > new Date(trial.trial_end);
  }
}