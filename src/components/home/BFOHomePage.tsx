import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, Shield } from 'lucide-react';
import { getLogoConfig } from '@/assets/logos';
import { useNavigate } from 'react-router-dom';
import { QuickAPITestRunner } from '@/components/admin/QuickAPITestRunner';

export function BFOHomePage() {
  const navigate = useNavigate();
  const heroLogoConfig = getLogoConfig('hero'); // Use large hero logo
  const brandLogoConfig = getLogoConfig('brand'); // For watermark

  const handleGetStarted = () => {
    navigate('/onboarding');
  };

  const handleMarketplace = () => {
    navigate('/marketplace');
  };

  return (
    <div className="min-h-screen bg-navy relative overflow-hidden">
      {/* Background Watermark - Faint gold tree */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <img 
          src={brandLogoConfig.src}
          alt=""
          className="w-[800px] h-[800px] object-contain opacity-5"
          style={{ filter: 'sepia(1) saturate(3) hue-rotate(30deg)' }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Large BFO Tree Logo */}
        <div className="mb-8 sm:mb-12">
          <img 
            src={heroLogoConfig.src}
            alt="Boutique Family Office™"
            className="h-24 w-auto mb-8 mx-auto sm:h-28 md:h-32 lg:h-36"
          />
        </div>

        {/* Main Headline */}
        <div className="space-y-6 max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight font-serif uppercase tracking-wide">
            EXPERIENCE THE BOUTIQUE FAMILY OFFICE™ DIFFERENCE
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-white font-sans font-light max-w-3xl mx-auto leading-relaxed">
            All Your Wealth. All Your Advisors. All Under One Roof.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 mt-12 w-full max-w-sm mx-auto sm:flex-row sm:max-w-2xl sm:gap-6">
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="group relative overflow-hidden text-navy font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 touch-target font-display uppercase tracking-wide w-full sm:flex-1"
            style={{ 
              backgroundColor: '#FFD700',
              minHeight: '48px',
              minWidth: '44px'
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              GET STARTED
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>

          <Button
            onClick={handleMarketplace}
            size="lg"
            className="group relative overflow-hidden text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 touch-target font-display uppercase tracking-wide w-full sm:flex-1"
            style={{ 
              backgroundColor: '#169873',
              minHeight: '48px',
              minWidth: '44px'
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Users className="w-5 h-5" />
              FAMILY OFFICE MARKETPLACE
            </span>
          </Button>
        </div>

        {/* API Testing Section - Only show for development/testing */}
        <div className="mt-16 w-full max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-gold" />
              <h2 className="text-xl font-semibold text-white">API Integration Status</h2>
            </div>
            <QuickAPITestRunner />
          </div>
        </div>
      </div>
    </div>
  );
}