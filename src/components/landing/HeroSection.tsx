
import React from 'react';

interface HeroSectionProps {
  isMobile: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isMobile }) => {
  return (
    <div className="landing-header text-center mb-16">
      <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-normal mb-1.5`}>Organize & Maximize</h1>
      <img 
        src="/lovable-uploads/3346c76f-f91c-4791-b77d-adb2f34a06af.png" 
        alt="Boutique Family Office" 
        className={`${isMobile ? 'h-14 w-auto mx-auto mb-4' : 'h-16 w-auto mx-auto my-5'}`} 
      />
      <p className={`${isMobile ? 'text-sm text-gray-300 mb-4' : 'text-gray-300 text-lg'}`}>
        Your personalized path to lasting prosperity.
      </p>
    </div>
  );
};
