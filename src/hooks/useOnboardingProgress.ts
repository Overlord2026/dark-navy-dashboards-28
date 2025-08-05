import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { OnboardingStepData } from '@/types/onboarding';
import { toast } from 'sonner';

interface OnboardingProgress {
  id?: string;
  currentStep: number;
  totalSteps: number;
  progressPercentage: number;
  stepData: OnboardingStepData;
  status: 'in_progress' | 'completed' | 'abandoned' | 'paused';
  lastActiveAt: string;
}

export const useOnboardingProgress = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [loading, setLoading] = useState(true);

  // Load existing progress
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    loadProgress();
  }, [user]);

  const loadProgress = async () => {
    try {
      const { data, error } = await supabase
        .from('onboarding_flow_progress')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'in_progress')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const progressData = data[0];
        setProgress({
          id: progressData.id,
          currentStep: progressData.current_step,
          totalSteps: progressData.total_steps,
          progressPercentage: progressData.progress_percentage,
          stepData: (progressData.step_data as OnboardingStepData) || {},
          status: progressData.status as 'in_progress' | 'completed' | 'abandoned' | 'paused',
          lastActiveAt: progressData.last_active_at,
        });
      }
    } catch (error) {
      console.error('Error loading onboarding progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = async (
    currentStep: number,
    totalSteps: number,
    stepData: Partial<OnboardingStepData>,
    status: 'in_progress' | 'completed' | 'paused' = 'in_progress'
  ) => {
    if (!user) return;

    try {
      const progressPercentage = Math.round((currentStep / totalSteps) * 100);
      
      const progressData = {
        user_id: user.id,
        current_step: currentStep,
        total_steps: totalSteps,
        progress_percentage: progressPercentage,
        step_data: JSON.parse(JSON.stringify({ ...progress?.stepData, ...stepData })), // Convert to Json
        status,
        last_active_at: new Date().toISOString(),
      };

      if (progress?.id) {
        // Update existing progress
        const { error } = await supabase
          .from('onboarding_flow_progress')
          .update(progressData)
          .eq('id', progress.id);

        if (error) throw error;
      } else {
        // Create new progress record
        const { data, error } = await supabase
          .from('onboarding_flow_progress')
          .insert(progressData)
          .select()
          .single();

        if (error) throw error;
        
        setProgress(prev => ({ ...prev, id: data.id } as OnboardingProgress));
      }

      // Update local state
      setProgress(prev => ({
        ...prev,
        currentStep,
        totalSteps,
        progressPercentage,
        stepData: { ...prev?.stepData, ...stepData },
        status,
        lastActiveAt: new Date().toISOString(),
      } as OnboardingProgress));

      // Show progress saved message
      toast.success('Progress saved automatically');

    } catch (error) {
      console.error('Error saving onboarding progress:', error);
      toast.error('Failed to save progress');
    }
  };

  const markCompleted = async () => {
    if (!progress?.id) return;

    try {
      const { error } = await supabase
        .from('onboarding_flow_progress')
        .update({
          status: 'completed',
          progress_percentage: 100,
          completed_at: new Date().toISOString(),
        })
        .eq('id', progress.id);

      if (error) throw error;

      setProgress(prev => prev ? {
        ...prev,
        status: 'completed',
        progressPercentage: 100,
      } : null);

      toast.success('Onboarding completed!');
    } catch (error) {
      console.error('Error marking onboarding as completed:', error);
      toast.error('Failed to mark as completed');
    }
  };

  const markAbandoned = async () => {
    if (!progress?.id) return;

    try {
      const { error } = await supabase
        .from('onboarding_flow_progress')
        .update({ status: 'abandoned' })
        .eq('id', progress.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking onboarding as abandoned:', error);
    }
  };

  return {
    progress,
    loading,
    saveProgress,
    markCompleted,
    markAbandoned,
    hasExistingProgress: !!progress?.id,
  };
};