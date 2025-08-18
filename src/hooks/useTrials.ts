import { useState } from 'react';
import { TrialManager, TrialConfig, TRIAL_CONFIGS } from '@/lib/trialManager';
import { useToast } from '@/hooks/use-toast';
import { Plan } from '@/types/pricing';

export function useTrials() {
  const [isStartingTrial, setIsStartingTrial] = useState(false);
  const { toast } = useToast();

  const startTrial = async (
    persona: 'families' | 'professionals', 
    plan: Plan, 
    segment?: string
  ): Promise<boolean> => {
    setIsStartingTrial(true);
    
    try {
      const config: TrialConfig = {
        persona,
        plan,
        durationDays: persona === 'families' ? 14 : 7,
        segment
      };

      const trial = await TrialManager.startTrial(config);
      
      if (trial) {
        toast({
          title: "Trial Started!",
          description: `Your ${config.durationDays}-day ${plan} trial has begun. Enjoy premium features!`,
        });
        return true;
      } else {
        toast({
          title: "Trial Start Failed",
          description: "Unable to start trial. You may already have an active trial.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Failed to start trial:', error);
      toast({
        title: "Trial Start Failed",
        description: "An error occurred while starting your trial. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsStartingTrial(false);
    }
  };

  const convertTrial = async (trialId: string): Promise<boolean> => {
    try {
      const success = await TrialManager.convertTrial(trialId);
      
      if (success) {
        toast({
          title: "Trial Converted!",
          description: "Welcome to your new subscription! All features remain active.",
        });
      }
      
      return success;
    } catch (error) {
      console.error('Failed to convert trial:', error);
      return false;
    }
  };

  return {
    startTrial,
    convertTrial,
    isStartingTrial
  };
}