import React from 'react';
import { Crown } from 'lucide-react';

export function StickyTopBanner() {
  return (
    <div className="sticky top-0 z-50 w-full bg-navy border-b border-border/20 backdrop-blur-sm">
      <div className="flex items-center justify-center h-14 px-4 sm:h-16 sm:px-6">
        <div className="flex items-center gap-3">
          {/* Gold Tree Logo */}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-gold to-yellow-400">
            <Crown className="w-5 h-5 text-navy" />
          </div>
          
          {/* Brand Text */}
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold tracking-wider text-gold">
              BOUTIQUE FAMILY OFFICE™
            </h1>
          </div>
          
          {/* Mobile Brand Text */}
          <div className="block sm:hidden">
            <h1 className="text-sm font-bold tracking-wider text-gold">
              BFO™
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}