
import React from 'react';

interface HeroSectionProps {
  isMobile: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isMobile }) => {
  return (
    <div className="landing-header text-center mb-16 relative overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1A1F2C_0%,transparent_70%)] z-0"></div>
      
      <div className="relative z-10 py-12">
        <div className="flex flex-col items-center">
          <div className="font-dwite">
            <img 
              src="/lovable-uploads/dcc6226b-47e8-4e6b-97ff-d902f2ef4f1c.png" 
              alt="Boutique Family Office Logo" 
              className={`${isMobile ? 'h-24 w-auto' : 'h-32 w-auto'} mx-auto`} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
