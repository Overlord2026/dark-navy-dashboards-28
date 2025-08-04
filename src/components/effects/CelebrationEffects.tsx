import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

interface CelebrationEffectsProps {
  onWelcome?: (userName: string) => void;
  userName?: string;
}

const CelebrationEffects: React.FC<CelebrationEffectsProps> = ({ onWelcome, userName }) => {
  const { toast } = useToast();

  const triggerConfetti = () => {
    // Multiple confetti bursts for celebration
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Gold confetti from left
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#FFC700', '#FFD700', '#FFED4E', '#F59E0B']
      });

      // Blue confetti from right  
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#00D2FF', '#0EA5E9', '#3B82F6', '#1D4ED8']
      });
    }, 250);
  };

  const showWelcomeToast = (name: string) => {
    toast({
      title: `🎉 Welcome, ${name}!`,
      description: "You're now part of the Elite Family Office Marketplace!",
      duration: 5000,
    });
  };

  const celebrate = (name: string = 'Professional') => {
    triggerConfetti();
    showWelcomeToast(name);
    if (onWelcome) {
      onWelcome(name);
    }
  };

  useEffect(() => {
    if (userName) {
      // Delay celebration slightly for better UX
      const timer = setTimeout(() => {
        celebrate(userName);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [userName]);

  // Expose celebrate function globally for manual triggering
  (window as any).triggerProfessionalWelcome = celebrate;

  return null; // This component doesn't render anything
};

export default CelebrationEffects;