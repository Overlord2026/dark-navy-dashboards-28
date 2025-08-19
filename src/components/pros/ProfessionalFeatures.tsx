import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { analytics } from '@/lib/analytics';
import { PROFESSIONAL_FEATURES, PROFESSIONAL_PLANS } from '@/config/prosEntitlements';
import { useEntitlements } from '@/context/EntitlementsContext';

interface ProfessionalFeaturesProps {
  selectedSegment?: string;
}

export function ProfessionalFeatures({ selectedSegment }: ProfessionalFeaturesProps) {
  const navigate = useNavigate();
  const { plan: currentPlan } = useEntitlements();

  const getFeatureAvailability = (featureId: string) => {
    // Check which plan tier includes this feature
    for (const [planId, planConfig] of Object.entries(PROFESSIONAL_PLANS)) {
      if (planConfig.features.includes(featureId)) {
        return {
          isAvailable: ['basic', 'premium', 'elite'].indexOf(currentPlan) >= ['basic', 'premium', 'elite'].indexOf(planId),
          requiredPlan: planId as 'basic' | 'premium' | 'elite',
          planName: planConfig.name
        };
      }
    }
    return {
      isAvailable: false,
      requiredPlan: 'premium' as const,
      planName: 'Professional Premium'
    };
  };

  const handleFeatureClick = (featureId: string, isAvailable: boolean, requiredPlan: string) => {
    analytics.track('pros.feature.click', { 
      feature: featureId,
      available: isAvailable,
      required_plan: requiredPlan,
      segment: selectedSegment
    });

    if (!isAvailable) {
      navigate(`/pricing?plan=${requiredPlan}&feature=${featureId}`);
    }
  };

  const handleUpgrade = () => {
    analytics.track('pros.cta.click', { 
      cta: 'upgrade_plan',
      source: 'features',
      current_plan: currentPlan
    });
    navigate('/pricing');
  };

  // Group features by category
  const groupedFeatures = Object.values(PROFESSIONAL_FEATURES).reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, typeof PROFESSIONAL_FEATURES[keyof typeof PROFESSIONAL_FEATURES][]>);

  const categoryLabels = {
    practice_management: 'Practice Management',
    client_portal: 'Client Portal',
    compliance: 'Compliance & Regulatory',
    analytics: 'Analytics & Reporting',
    automation: 'Automation & Workflows',
    integrations: 'Integrations & API'
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Professional Features
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Comprehensive tools and integrations designed specifically for financial professionals.
          {currentPlan !== 'elite' && (
            <span className="block mt-2">
              <Button 
                variant="link" 
                onClick={handleUpgrade}
                className="p-0 h-auto text-primary"
              >
                Upgrade to unlock all features →
              </Button>
            </span>
          )}
        </p>
      </div>

      <div className="space-y-12 max-w-6xl mx-auto">
        {Object.entries(groupedFeatures).map(([category, features]) => (
          <div key={category}>
            <h3 className="text-2xl font-semibold mb-6 text-center">
              {categoryLabels[category as keyof typeof categoryLabels]}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => {
                const availability = getFeatureAvailability(feature.id);
                
                return (
                  <Card 
                    key={feature.id}
                    className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      !availability.isAvailable ? 'opacity-75' : ''
                    }`}
                    onClick={() => handleFeatureClick(feature.id, availability.isAvailable, availability.requiredPlan)}
                  >
                    {!availability.isAvailable && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          <Crown className="h-3 w-3 mr-1" />
                          {availability.planName}
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {feature.name}
                          {!availability.isAvailable && (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          )}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <CardDescription className="text-sm">
                        {feature.description}
                      </CardDescription>
                      
                      <div className="mt-4">
                        <Button 
                          variant={availability.isAvailable ? "default" : "outline"}
                          size="sm"
                          className="w-full"
                        >
                          {availability.isAvailable ? 'Access Feature' : `Upgrade to ${availability.requiredPlan}`}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}