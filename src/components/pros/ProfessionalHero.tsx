import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Briefcase, Users, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analytics } from '@/lib/analytics';

export function ProfessionalHero() {
  const navigate = useNavigate();

  const handleCTAClick = () => {
    analytics.track('pros.cta.click', { 
      cta: 'start_advisor_onboarding',
      source: 'hero'
    });
    navigate('/onboarding?persona=professional&segment=advisor');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="relative container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 bg-primary/10 text-primary border-primary/20">
            <Crown className="h-3 w-3 mr-1" />
            Professional Suite
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Your Private Family Office —{' '}
            <span className="text-primary">On Your Terms</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Deliver institutional-grade wealth management to your clients with our comprehensive 
            professional platform. From compliance to client portals, we handle the complexity 
            so you can focus on what matters most.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              onClick={handleCTAClick}
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
            >
              <Briefcase className="mr-2 h-5 w-5" />
              Start Advisor Onboarding
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                analytics.track('pros.cta.click', { 
                  cta: 'learn_more',
                  source: 'hero'
                });
                document.getElementById('professional-tabs')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-lg px-8 py-6"
            >
              <Users className="mr-2 h-5 w-5" />
              Learn More
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Professional Partners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">$2.1B+</div>
              <div className="text-sm text-muted-foreground">Assets Under Management</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}