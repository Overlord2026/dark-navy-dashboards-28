import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { analytics } from '@/lib/analytics';
import { getStartedRoute } from '@/utils/getStartedUtils';

interface FamilyHeroProps {
  onNext?: () => void;
}

export const FamilyHero: React.FC<FamilyHeroProps> = ({ onNext }) => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    analytics.track('onboarding.viewed', { 
      persona: 'family', 
      segment: 'retirees',
      source: 'hero_cta'
    });
    const route = getStartedRoute('/onboarding?persona=family&segment=retirees');
    navigate(route);
    onNext?.();
  };

  const handleSeeHow = () => {
    analytics.track('pricing.viewed', { source: 'hero_secondary_cta' });
    navigate('/tools/value-calculator');
    onNext?.();
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Welcome to Your Family's Financial Future
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your family's wealth management with personalized tools, expert guidance, and comprehensive financial planning.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Get Started
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleSeeHow}
            >
              See How It Works
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};