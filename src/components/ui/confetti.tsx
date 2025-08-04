import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  useEffect(() => {
    if (trigger) {
      // BFO themed confetti with navy, gold, and emerald colors
      const confettiColors = ['#14213D', '#FFD700', '#169873'];
      
      // First burst
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: confettiColors,
        scalar: 1.2,
        gravity: 0.8,
        drift: 0.1
      });

      // Second burst with different angle
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: confettiColors,
          scalar: 0.8
        });
      }, 200);

      // Third burst from the right
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: confettiColors,
          scalar: 0.8
        });
      }, 400);

      // Star confetti for special occasions
      setTimeout(() => {
        confetti({
          particleCount: 30,
          spread: 100,
          origin: { y: 0.4 },
          colors: ['#FFD700'],
          shapes: ['star'],
          scalar: 1.5
        });
      }, 600);

      // Call onComplete after all animations
      setTimeout(() => {
        onComplete?.();
      }, 2000);
    }
  }, [trigger, onComplete]);

  return null;
}

// Celebration hook for easy usage
export function useCelebration() {
  const [celebrating, setCelebrating] = useState(false);

  const celebrate = () => {
    setCelebrating(true);
  };

  const handleComplete = () => {
    setCelebrating(false);
  };

  return {
    celebrating,
    celebrate,
    ConfettiComponent: () => (
      <Confetti trigger={celebrating} onComplete={handleComplete} />
    )
  };
}