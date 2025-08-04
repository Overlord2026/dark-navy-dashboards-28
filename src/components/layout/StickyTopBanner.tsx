import React from 'react';
import { getLogoConfig } from '@/assets/logos';

export function StickyTopBanner() {
  const brandLogoConfig = getLogoConfig('brand');
  
  return (
    <div className="sticky top-0 z-50 w-full backdrop-blur-sm" style={{ backgroundColor: '#14213D' }}>
      <div className="flex items-center justify-start h-14 px-4 sm:h-16 sm:px-6">
        <div className="flex items-center">
          <img 
            src={brandLogoConfig.src}
            alt={brandLogoConfig.alt}
            className="h-11 w-auto sm:h-12 md:h-14"
          />
        </div>
      </div>
    </div>
  );
}