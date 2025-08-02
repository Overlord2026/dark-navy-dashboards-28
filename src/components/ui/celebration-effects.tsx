import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
}

interface CelebrationEffectsProps {
  trigger: boolean;
  type?: 'confetti' | 'sparkles' | 'both';
  duration?: number;
  onComplete?: () => void;
}

export function CelebrationEffects({ 
  trigger, 
  type = 'both', 
  duration = 3000,
  onComplete 
}: CelebrationEffectsProps) {
  const [particles, setParticles] = useState<ConfettiParticle[]>([]);
  const [isActive, setIsActive] = useState(false);

  const colors = [
    '#FFD700', // Gold
    '#169873', // Emerald
    '#FFFFFF', // White
    '#F3E8FF', // Light purple
    '#FEF3C7', // Light gold
  ];

  const createConfetti = () => {
    const newParticles: ConfettiParticle[] = [];
    const particleCount = type === 'sparkles' ? 20 : 50;

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: -20,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        velocity: {
          x: (Math.random() - 0.5) * 4,
          y: Math.random() * 3 + 2,
        },
      });
    }

    setParticles(newParticles);
  };

  useEffect(() => {
    if (trigger && !isActive) {
      setIsActive(true);
      createConfetti();

      // Animate particles
      const animationFrame = () => {
        setParticles(prevParticles => 
          prevParticles
            .map(particle => ({
              ...particle,
              x: particle.x + particle.velocity.x,
              y: particle.y + particle.velocity.y,
              rotation: particle.rotation + 5,
            }))
            .filter(particle => particle.y < window.innerHeight + 50)
        );
      };

      const interval = setInterval(animationFrame, 16);

      // Complete celebration
      const timeout = setTimeout(() => {
        setIsActive(false);
        setParticles([]);
        clearInterval(interval);
        onComplete?.();
      }, duration);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [trigger, isActive, duration, onComplete]);

  if (!isActive || particles.length === 0) return null;

  return createPortal(
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute transition-all duration-75 ${
            type === 'sparkles' ? 'animate-sparkle' : ''
          }`}
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            transform: `rotate(${particle.rotation}deg)`,
            backgroundColor: particle.color,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: type === 'sparkles' ? '50%' : '2px',
            boxShadow: type === 'sparkles' 
              ? `0 0 ${particle.size * 2}px ${particle.color}` 
              : 'none',
          }}
        />
      ))}
    </div>,
    document.body
  );
}

// Hook for easy celebration triggering
export function useCelebration() {
  const [celebration, setCelebration] = useState({
    trigger: false,
    type: 'both' as 'confetti' | 'sparkles' | 'both',
  });

  const celebrate = (type: 'confetti' | 'sparkles' | 'both' = 'both') => {
    setCelebration({ trigger: true, type });
    // Reset after a brief moment to allow re-triggering
    setTimeout(() => setCelebration({ trigger: false, type }), 100);
  };

  return {
    celebration,
    celebrate,
    CelebrationComponent: () => (
      <CelebrationEffects
        trigger={celebration.trigger}
        type={celebration.type}
        onComplete={() => setCelebration({ trigger: false, type: celebration.type })}
      />
    ),
  };
}