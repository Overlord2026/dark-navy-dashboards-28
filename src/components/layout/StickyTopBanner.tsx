import React from 'react';
import { getLogoConfig } from '@/assets/logos';

export function StickyTopBanner() {
  // Use the horizontal brand logo for the header
  const brandLogoConfig = getLogoConfig('brand');
  
  return (
    <div className="sticky top-0 z-50 w-full bg-navy border-b border-white/10">
      <div className="flex items-center justify-start h-14 px-4 sm:h-16 sm:px-6">
        <div className="flex items-center">
          <img 
            src={brandLogoConfig.src}
            alt="Boutique Family Office™"
            className="h-10 w-auto sm:h-12 md:h-14 object-contain"
          />
        </div>
      </div>
    </div>
  );
}