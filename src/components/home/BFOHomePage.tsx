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
            className="h-20 w-auto mb-6 mx-auto"
          />
          
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-wider text-gold font-serif">
              BOUTIQUE FAMILY OFFICE™
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto"></div>
          </div>
        </div>

        {/* Main Headline */}
        <div className="space-y-6 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            EXPERIENCE THE{' '}
            <span className="bg-gradient-to-r from-gold to-yellow-400 bg-clip-text text-transparent">
              BOUTIQUE FAMILY OFFICE™
            </span>
            {' '}DIFFERENCE
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed">
            All Your Wealth. All Your Advisors. All Under One Roof.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full max-w-md mx-auto">
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="group relative overflow-hidden bg-gradient-to-r from-gold to-yellow-400 hover:from-yellow-400 hover:to-gold text-navy font-bold text-lg px-8 py-4 rounded-lg shadow-gold hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald to-emerald/80 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </Button>

          <Button
            onClick={handleMarketplace}
            size="lg"
            variant="outline"
            className="group relative overflow-hidden bg-emerald hover:bg-emerald/90 text-white border-emerald hover:border-emerald/90 font-bold text-lg px-8 py-4 rounded-lg shadow-emerald hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse"
          >
            <span className="relative z-10 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Family Office Marketplace
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Button>
        </div>

        {/* Value Propositions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TreePine className="w-6 h-6 text-gold" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Premium Service</h3>
            <p className="text-gray-300 text-sm">White-glove family office experience</p>
          </div>

          <div className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-emerald/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-emerald" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Expert Network</h3>
            <p className="text-gray-300 text-sm">Top-tier advisors and professionals</p>
          </div>

          <div className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 bg-blue-400/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Integrated Platform</h3>
            <p className="text-gray-300 text-sm">All your wealth management in one place</p>
          </div>
        </div>
      </div>
    </div>
  );
}