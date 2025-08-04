import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Sparkles, TreePine } from 'lucide-react';
import { getLogoConfig } from '@/assets/logos';
import { useNavigate } from 'react-router-dom';

export function BFOHomePage() {
  const navigate = useNavigate();
  const treeLogoConfig = getLogoConfig('tree');

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  const handleMarketplace = () => {
    navigate('/marketplace');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy to-slate-900 relative overflow-hidden">
      {/* Background Watermark */}
      <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
        <img 
          src={treeLogoConfig.src}
          alt="Background watermark"
          className="w-96 h-96 object-contain"
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Logo */}
        <div className="mb-8 sm:mb-12">
          <img 
            src={treeLogoConfig.src}
            alt={treeLogoConfig.alt}
            className="h-16 w-auto mb-8 mx-auto md:h-20"
          />
        </div>

        {/* Main Headline */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight font-serif uppercase">
            EXPERIENCE THE BOUTIQUE FAMILY OFFICE™ DIFFERENCE
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed">
            All Your Wealth. All Your Advisors. All Under One Roof.
          </p>
        </div>
      </div>
    </div>
  );
}