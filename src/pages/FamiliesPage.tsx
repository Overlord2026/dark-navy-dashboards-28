import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FamilyHero } from '@/components/families/FamilyHero';
import { FAMILY_SEGMENTS } from '@/data/familySegments';
import { analytics } from '@/lib/analytics';
import BrandIcon from '@/components/ui/BrandIcon';
import HeaderSpacer from '@/components/layout/HeaderSpacer';
import { 
  Users, 
  Clock, 
  Heart, 
  TrendingUp, 
  Shield, 
  ArrowRight 
} from 'lucide-react';

const FamiliesPage = () => {
  const navigate = useNavigate();
  const [selectedStage, setSelectedStage] = useState<string>('');

  // Main family stages for premium tiles
  const mainStages = [
    {
      id: 'aspiring',
      title: 'Aspiring Families',
      description: 'Building wealth and growing your financial foundation',
      icon: TrendingUp,
      route: '/build-workspace?persona=aspiring',
      background: '#5E17EB', // Rich purple
      hoverBrightness: '110%'
    },
    {
      id: 'retirees', 
      title: 'Retirees',
      description: 'Preserving wealth and optimizing for retirement',
      icon: Clock,
      route: '/build-workspace?persona=retiree',
      background: '#001F3F', // Navy
      hoverBrightness: '120%'
    }
  ];

  // "Or Jump Right In" section
  const quickStartOptions = [
    {
      id: 'health',
      title: 'Health',
      description: 'Healthcare planning and insurance',
      icon: Heart,
      route: '/health',
      background: '#7B4BFF' // Lighter purple
    },
    {
      id: 'wealth',
      title: 'Wealth',
      description: 'Investment and asset management',
      icon: TrendingUp,
      route: '/wealth',
      background: '#D4AF37' // Gold
    },
    {
      id: 'trusted-team',
      title: 'Trusted Team',
      description: 'Professional advisor network',
      icon: Shield,
      route: '/pros',
      background: '#001F3F' // Navy
    }
  ];

  const handleStageSelect = (stage: any) => {
    setSelectedStage(stage.id);
    analytics.track('family.stage.selected', { 
      stage: stage.id,
      source: 'families_page'
    });
    navigate(stage.route);
  };

  const handleQuickStart = (option: any) => {
    analytics.track('family.quickstart.selected', { 
      option: option.id,
      source: 'families_page'
    });
    navigate(option.route);
  };

  const handleContinue = () => {
    if (selectedStage) {
      const stage = mainStages.find(s => s.id === selectedStage);
      if (stage) {
        navigate(stage.route);
      }
    } else {
      // Default to aspiring if no selection
      navigate('/build-workspace?persona=aspiring');
    }
  };

  return (
    <div className="page-surface">
      <HeaderSpacer />
      <main>
        <FamilyHero />
        
        <div className="container mx-auto px-4 py-12 space-y-12">
          {/* Choose Your Family Stage Section */}
          <section className="text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-white mb-4">
                Choose Your Family's Stage
              </h2>
              <p className="text-xl text-brand-white/80 mb-12 max-w-2xl mx-auto">
                Select the path that best describes your family's wealth journey
              </p>
              
              {/* Premium Main Stage Tiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8">
                {mainStages.map((stage) => {
                  const isSelected = selectedStage === stage.id;
                  
                  return (
                    <div
                      key={stage.id}
                      className="bfo-card-luxury cursor-pointer"
                      onClick={() => {
                        setSelectedStage(stage.id);
                        handleStageSelect(stage);
                      }}
                    >
                      <div className="p-6 md:p-8 text-center h-full flex flex-col justify-center">
                        <div className="mb-4 md:mb-6">
                          <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-bfo-gold/10 flex items-center justify-center">
                            <stage.icon className="w-6 h-6 md:w-8 md:h-8 text-bfo-gold" />
                          </div>
                          
                          <Badge className="bg-bfo-gold text-black text-xs font-medium px-2 py-1 mb-2">
                            {stage.id === 'aspiring' ? 'Growth Focus' : 'Lifestyle Focus'}
                          </Badge>
                        </div>
                        
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">{stage.title}</h3>
                        <p className="text-white/80 text-base md:text-lg leading-relaxed mb-4">{stage.description}</p>
                        
                        {/* Feature dots - now black and gold themed */}
                        <div className="flex justify-between mb-4">
                          <div className="flex flex-col items-center space-y-1">
                            <div className="w-2 h-2 rounded-full bg-bfo-gold"></div>
                            <div className="w-2 h-2 rounded-full bg-bfo-gold"></div>
                          </div>
                          <div className="flex flex-col items-center space-y-1">
                            <div className="w-2 h-2 rounded-full bg-bfo-gold"></div>
                            <div className="w-2 h-2 rounded-full bg-bfo-gold"></div>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <Badge className="mt-2 mx-auto text-xs bg-bfo-gold text-black border-bfo-gold">
                            Selected
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue Button */}
              <Button
                onClick={handleContinue}
                className="px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold transition-all duration-300 hover:scale-105 w-full sm:w-auto bg-brand-gold text-brand-black hover:bg-brand-gold/90 border-brand-gold"
                style={{
                  boxShadow: '0 4px 8px rgba(212, 175, 55, 0.3)'
                }}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>
          </section>

          {/* Or Jump Right In Section */}
          <section>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-brand-white mb-4">Or Jump Right In</h3>
              <p className="text-brand-white/70">Start with a specific area that interests you most</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
              {quickStartOptions.map((option) => {
                const isWealth = option.id === 'wealth';
                
                return (
                  <div
                    key={option.id}
                    className="bfo-card-luxury cursor-pointer"
                    onClick={() => handleQuickStart(option)}
                  >
                    <div className="p-4 md:p-6 text-center">
                      <div className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 rounded-lg flex items-center justify-center border-2 bg-bfo-gold/10 border-bfo-gold">
                        <option.icon className="w-5 h-5 md:w-6 md:h-6 text-bfo-gold" />
                      </div>
                      
                      <h4 className="font-semibold mb-2 text-sm md:text-base text-white hover:text-bfo-gold transition-colors">
                        {option.title}
                      </h4>
                      <p className="text-xs md:text-sm text-white/80">
                        {option.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Additional Segments Section */}
          <section>
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Explore All Paths</h3>
              <p className="text-white/70">Specialized guidance for every family situation</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {FAMILY_SEGMENTS.filter(s => !['aspiring', 'retirees'].includes(s.slug)).map(segment => (
                <Card
                  key={segment.slug}
                  className="cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-bfo-gold/10 hover:border-bfo-gold"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    boxShadow: '0 2px 4px rgba(212, 175, 55, 0.1)'
                  }}
                  onClick={() => analytics.track('segment.view', { segment: segment.slug })}
                >
                  <CardContent className="p-4 text-center">
                    <h4 className="font-medium text-white mb-2">{segment.title}</h4>
                    <p className="text-sm text-white/70">{segment.blurb}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default FamiliesPage;