
import React from 'react';

interface HeroSectionProps {
  isMobile: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isMobile }) => {
  return (
    <div className="landing-header text-center mb-8 relative overflow-hidden">
      {/* Dark navy background - changed to pure black */}
      <div className="absolute inset-0 bg-black z-0"></div>
      
      <div className="relative z-10 py-0">
        <div className="flex flex-col items-center py-2">
          <div>
            <img 
              src="/lovable-uploads/dcc6226b-47e8-4e6b-97ff-d902f2ef4f1c.png" 
              alt="Boutique Family Office Logo" 
              className={`${isMobile ? 'h-20 w-auto' : 'h-28 w-auto'} mx-auto`} 
            />
          </div>
          
          {/* Tagline */}
          <div className="mt-2 text-center">
            <h3 className="font-dwite text-[#D4AF37] text-2xl">Organize & Maximize</h3>
            <p className="text-white text-xs uppercase tracking-wide mt-1">Your personalized path to lasting prosperity</p>
          </div>
        </div>
      </div>
    </div>
  );
};
