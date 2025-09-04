import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FamilyHero } from '@/components/families/FamilyHero';
import { FAMILY_SEGMENTS } from '@/data/familySegments';
import { analytics } from '@/lib/analytics';
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
    <div className="min-h-screen" style={{ backgroundColor: '#000000' }}>
      <main className="pt-[var(--header-stack)] scroll-mt-[var(--header-stack)]">
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
                  const Icon = stage.icon;
                  const isSelected = selectedStage === stage.id;
                  
                  return (
                    <Card
                      key={stage.id}
                      className={`cursor-pointer transition-all duration-300 transform hover:scale-105 bg-brand-black border-brand-gold hover:bg-brand-black/90 ${
                        isSelected ? 'ring-2 ring-brand-gold' : ''
                      }`}
                      style={{
                        border: '1px solid hsl(var(--brand-gold))',
                        boxShadow: '0 4px 8px rgba(212, 175, 55, 0.2)',
                        minHeight: '220px', // Responsive height
                        filter: isSelected ? 'brightness(110%)' : 'none'
                      }}
                      onClick={() => {
                        setSelectedStage(stage.id);
                        handleStageSelect(stage);
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = 'brightness(110%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = isSelected ? 'brightness(110%)' : 'none';
                      }}
                    >
                      <CardContent className="p-6 md:p-8 text-center h-full flex flex-col justify-center">
                        <div className="mb-4 md:mb-6">
                          <div 
                            className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-lg flex items-center justify-center bg-brand-gold/10"
                          >
                            <Icon className="w-6 h-6 md:w-8 md:h-8 text-brand-gold" />
                          </div>
                        </div>
                        
                        <h3 className="text-xl md:text-2xl font-bold text-brand-white mb-2 md:mb-3">{stage.title}</h3>
                        <p className="text-brand-white/80 text-base md:text-lg leading-relaxed">{stage.description}</p>
                        
                        {isSelected && (
                          <Badge 
                            className="mt-3 md:mt-4 mx-auto text-xs md:text-sm bg-brand-gold text-brand-black border-brand-gold"
                          >
                            Selected
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
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
                const Icon = option.icon;
                const isGold = option.id === 'wealth';
                
                return (
                  <Card
                    key={option.id}
                    className="cursor-pointer transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: option.background,
                      border: '1px solid #D4AF37',
                      boxShadow: '0 2px 4px rgba(212, 175, 55, 0.15)'
                    }}
                    onClick={() => handleQuickStart(option)}
                    onMouseEnter={(e) => {
                      if (isGold) {
                        e.currentTarget.style.filter = 'brightness(110%)';
                      } else {
                        e.currentTarget.style.filter = 'brightness(110%)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'none';
                    }}
                  >
                    <CardContent className="p-4 md:p-6 text-center">
                      <div 
                        className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 rounded-lg flex items-center justify-center"
                        style={{ 
                          backgroundColor: isGold ? 'rgba(0, 31, 63, 0.2)' : 'rgba(212, 175, 55, 0.2)', 
                          border: '1px solid #D4AF37' 
                        }}
                      >
                        <Icon 
                          className="w-5 h-5 md:w-6 md:h-6" 
                          style={{ color: isGold ? '#001F3F' : '#D4AF37' }} 
                        />
                      </div>
                      
                      <h4 className="font-semibold mb-2 text-sm md:text-base" style={{ color: isGold ? '#001F3F' : '#FFFFFF' }}>
                        {option.title}
                      </h4>
                      <p className="text-xs md:text-sm" style={{ color: isGold ? 'rgba(0, 31, 63, 0.8)' : 'rgba(255, 255, 255, 0.8)' }}>
                        {option.description}
                      </p>
                    </CardContent>
                  </Card>
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
                  className="cursor-pointer transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    boxShadow: '0 2px 4px rgba(212, 175, 55, 0.1)'
                  }}
                  onClick={() => analytics.track('segment.view', { segment: segment.slug })}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
                    e.currentTarget.style.borderColor = '#D4AF37';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                  }}
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