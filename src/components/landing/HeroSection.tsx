
import React from 'react';

interface HeroSectionProps {
  isMobile: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isMobile }) => {
  return (
    <div className={`landing-header text-center mb-16 relative overflow-hidden`}>
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1A1F2C_0%,transparent_70%)] z-0"></div>
      
      <div className="relative z-10 pt-8 pb-12">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-2 text-[#FFC829]`}>
          Organize & Maximize
        </h1>
        <p className={`${isMobile ? 'text-sm' : 'text-base'} text-white font-medium mb-6`}>
          Your personalized path to lasting prosperity.
        </p>
        <img 
          src="/lovable-uploads/e35d27cf-24a1-42f7-a83c-588c6cbb0a02.png" 
          alt="Boutique Family Office Logo" 
          className={`${isMobile ? 'h-16 w-auto' : 'h-20 w-auto'} mx-auto`} 
        />
      </div>
    </div>
  );
};
