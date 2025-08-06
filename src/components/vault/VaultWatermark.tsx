import React from 'react';
import { getLogoConfig } from '@/assets/logos';

interface VaultWatermarkProps {
  opacity?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}

export function VaultWatermark({ 
  opacity = 0.1, 
  position = 'bottom-right' 
}: VaultWatermarkProps) {
  const logoConfig = getLogoConfig('professional');
  
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4', 
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
  };

  return (
    <div 
      className={`fixed ${positionClasses[position]} pointer-events-none z-10`}
      style={{ opacity }}
    >
      <img 
        src={logoConfig.src}
        alt="Boutique Family Office"
        className="h-16 w-auto md:h-20"
      />
    </div>
  );
}