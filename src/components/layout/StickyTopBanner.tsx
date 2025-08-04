import React from 'react';
import { getLogoConfig } from '@/assets/logos';

export function StickyTopBanner() {
  const treeLogoConfig = getLogoConfig('tree');
  
  return (
    <div className="sticky top-0 z-50 w-full bg-navy border-b border-border/20 backdrop-blur-sm">
      <div className="flex items-center justify-center h-14 px-4 sm:h-16 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Gold Tree Logo */}
          <img 
            src={treeLogoConfig.src}
            alt={treeLogoConfig.alt}
            className="h-8 w-auto"
          />
          
          {/* Brand Text */}
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold tracking-wider text-gold font-serif">
              BOUTIQUE FAMILY OFFICE™
            </h1>
          </div>
          
          {/* Mobile Brand Text */}
          <div className="block sm:hidden">
            <h1 className="text-sm font-bold tracking-wider text-gold font-serif">
              BFO™
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}