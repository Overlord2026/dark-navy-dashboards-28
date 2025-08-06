import { useState, useCallback } from 'react';
import React from 'react';
import { Celebration } from '@/components/ConfettiAnimation';
import { useAuth } from '@/context/AuthContext';
import { abTesting } from '@/lib/abTesting';

export type CelebrationType = 'client-won' | 'pipeline-goal' | 'milestone' | 'success';

interface CelebrationState {
  isActive: boolean;
  type: CelebrationType;
  message?: string;
}

export const useCelebration = () => {
  const { user } = useAuth();
  const [celebration, setCelebration] = useState<CelebrationState>({
    isActive: false,
    type: 'success'
  });

  const triggerCelebration = useCallback((type: CelebrationType, message?: string) => {
    // A/B Test for confetti animation style
    const confettiVariant = abTesting.getVariant('confetti_animation', user?.id || 'anonymous');
    
    setCelebration({
      isActive: true,
      type,
      message
    });

    // Track confetti trigger
    abTesting.trackConversion('confetti_animation', confettiVariant?.id || 'unknown', user?.id || 'anonymous', 'confetti_triggered');

    setTimeout(() => {
      setCelebration(prev => ({ ...prev, isActive: false }));
    }, 3000);
  }, [user?.id]);

  const stopCelebration = useCallback(() => {
    setCelebration(prev => ({ ...prev, isActive: false }));
  }, []);

  const CelebrationComponent = React.createElement(() => {
    if (!celebration.isActive) return null;
    
    // Get confetti variant for current user
    const confettiVariant = abTesting.getVariant('confetti_animation', user?.id || 'anonymous');
    const isSubtle = confettiVariant?.config.animationType === 'contained';
    const numberOfPieces = confettiVariant?.config.numberOfPieces || 200;
    
    return React.createElement(Celebration, { 
      trigger: celebration.isActive, 
      numberOfPieces,
      recycle: false,
      gravity: isSubtle ? 0.1 : 0.3,
      wind: isSubtle ? 0.01 : 0.02
    });
  });

  return {
    celebration,
    triggerCelebration,
    stopCelebration,
    CelebrationComponent
  };
};