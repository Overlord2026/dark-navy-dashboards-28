import { useState, useCallback } from 'react';
import { Celebration } from '@/components/ConfettiAnimation';

export type CelebrationType = 'client-won' | 'pipeline-goal' | 'milestone' | 'success';

interface CelebrationState {
  isActive: boolean;
  type: CelebrationType;
  message?: string;
}

export const useCelebration = () => {
  const [celebration, setCelebration] = useState<CelebrationState>({
    isActive: false,
    type: 'success'
  });

  const triggerCelebration = useCallback((type: CelebrationType, message?: string) => {
    setCelebration({
      isActive: true,
      type,
      message
    });

    setTimeout(() => {
      setCelebration(prev => ({ ...prev, isActive: false }));
    }, 3000);
  }, []);

  const stopCelebration = useCallback(() => {
    setCelebration(prev => ({ ...prev, isActive: false }));
  }, []);

  const CelebrationComponent = () => {
    return <Celebration trigger={celebration.isActive} />;
  };

  return {
    celebration,
    triggerCelebration,
    stopCelebration,
    CelebrationComponent
  };
};