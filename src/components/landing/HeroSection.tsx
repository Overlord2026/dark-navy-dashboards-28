
import React from 'react';
import { TreePine } from 'lucide-react';

interface HeroSectionProps {
  isMobile: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isMobile }) => {
  return (
    <div className="landing-header text-center mb-16 relative overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1A1F2C_0%,transparent_70%)] z-0"></div>
      
      <div className="relative z-10 py-8">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-2 text-[#FFC829]`}>
          Organize & Maximize
        </h1>
        <p className={`${isMobile ? 'text-sm' : 'text-base'} text-white font-medium mb-6`}>
          Your personalized path to lasting prosperity.
        </p>
        <div className="flex flex-col items-center">
          <TreePine className="h-16 w-16 text-[#FFC829] mb-2" />
          <span className="text-white font-medium">Boutique Family Office</span>
        </div>
      </div>
    </div>
  );
};
