import React, { Suspense, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  TrendingUp, 
  BarChart3, 
  Link, 
  Upload, 
  UserPlus,
  Lock,
  GraduationCap,
  Crown
} from 'lucide-react';
import { useFamilyEntitlements, type FamilySegment } from '@/hooks/useFamilyEntitlements';
import { toast } from '@/lib/toast';
import { analytics } from '@/lib/analytics';
import { canUse, getRequiredPlan, type Plan, type FeatureKey } from '@/lib/featureAccess';
import { useGate } from '@/hooks/useGate';
import familiesConfig from '@/config/familiesEntitlements';
import { AdminEmailBanner } from '@/components/admin/AdminEmailBanner';
import { PlanSuggestionChip } from '@/components/pricing/PlanSuggestionChip';

interface FamiliesEntitledProps {
  userSegment?: FamilySegment;
  isAdmin?: boolean;
}

const iconMap = {
  'account_link': Link,
  'doc_upload_basic': Upload,
  'doc_upload_pro': Upload,
  'goals_basic': Target,
  'goals_pro': Target,
  'swag_lite': TrendingUp,
  'monte_carlo_lite': BarChart3,
  'monte_carlo_pro': BarChart3,
  'invite_pros': UserPlus,
  'education_access': GraduationCap,
  'vault_advanced': Lock,
  'governance': Crown,
  'multi_entity': Crown,
  'concierge': Crown
};

export const FamiliesEntitled: React.FC<FamiliesEntitledProps> = ({ 
  userSegment = 'aspiring',
  isAdmin = false 
}) => {
  const [selectedSegment, setSelectedSegment] = useState(userSegment);
  const { canAccessFeature, currentTier, getUpgradeTarget } = useFamilyEntitlements(selectedSegment);
  const [trainingProgress] = useState(45); // Mock training progress

  const currentSegmentData = familiesConfig.segments.find(s => s.key === selectedSegment);
  const currentPlan = familiesConfig.plans[currentTier];

  const handleQuickAction = (action: any) => {
    analytics.trackEvent(action.event, { feature: action.feature, tier: currentTier });
    
    const gate = useGate(action.feature as FeatureKey);
    
    if (!gate.allowed) {
      const message = gate.blockedBy === 'flag' 
        ? `Feature ${action.feature} is not available`
        : `Upgrade to ${gate.requiredPlan} to access this feature`;
      
      toast.err(message);
      analytics.trackEvent('entitlement.gated', { 
        feature: action.feature, 
        tier: currentTier, 
        blockedBy: gate.blockedBy 
      });
      
      // Only navigate to pricing if blocked by plan, not by feature flag
      if (gate.blockedBy === 'plan' && gate.requiredPlan) {
        window.location.href = `/pricing?plan=${gate.requiredPlan}&feature=${action.feature}`;
      }
      return;
    }

    toast.ok(`${action.label} started successfully`);
    analytics.trackEvent('quickAction.clicked', { action: action.feature });
  };

  const getRequiredTier = (feature: string): string => {
    for (const [tier, plan] of Object.entries(familiesConfig.plans)) {
      if (plan.features.includes(feature)) {
        return plan.name;
      }
    }
    return 'Premium';
  };

  const handleEducationAccess = () => {
    if (familiesConfig.education.gateMarketplaceUntilTraining && trainingProgress < 100) {
      toast.info('Complete NIL Training to unlock the Education Marketplace');
      analytics.trackEvent('education.gated', { progress: trainingProgress });
      // Navigate to NIL training
      window.location.href = '/nil/athlete';
      return;
    }
    
    analytics.trackEvent('education.opened', { segment: selectedSegment });
    toast.ok('Education Library opened');
  };

  const renderFeatureCard = (card: any) => {
    const gate = useGate(card.feature as FeatureKey);
    const IconComponent = iconMap[card.feature as keyof typeof iconMap] || Target;
    
    const handleCardClick = () => {
      // Special routing for solution pages
      if (card.feature === 'tax_advanced') {
        window.location.href = '/solutions/tax-planning';
        return;
      }
      if (card.feature === 'estate_advanced') {
        window.location.href = '/solutions/estate-planning';
        return;
      }
      
      if (!gate.allowed && gate.blockedBy === 'plan' && gate.requiredPlan) {
        window.location.href = `/pricing?plan=${gate.requiredPlan}&feature=${card.feature}`;
      } else if (!gate.allowed && gate.blockedBy === 'flag') {
        toast.info(`Feature ${card.feature} is not available yet`);
      } else if (gate.allowed) {
        // Handle other allowed features
        if (card.feature === 'education_access') {
          handleEducationAccess();
        } else if (card.feature === 'retirement_scorecard') {
          window.location.href = '/tools/retirement-scorecard';
        } else {
          toast.info(`Feature ${card.feature} accessed`);
        }
      }
    };
    
    return (
      <Card key={card.feature} className={`transition-all duration-200 ${
        gate.allowed ? 'hover:shadow-md cursor-pointer' : 'opacity-60 cursor-pointer'
      }`} onClick={handleCardClick}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <IconComponent className={`h-5 w-5 ${gate.allowed ? 'text-primary' : 'text-muted-foreground'}`} />
            {!gate.allowed && gate.blockedBy === 'plan' && (
              <Badge variant="secondary" className="text-xs">
                {gate.requiredPlan}
              </Badge>
            )}
            {!gate.allowed && gate.blockedBy === 'flag' && (
              <Badge variant="outline" className="text-xs">
                Coming Soon
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle className="text-sm mb-1">{card.label}</CardTitle>
          {!gate.allowed && gate.blockedBy === 'plan' && (
            <Button size="sm" variant="outline" className="w-full mt-2">
              Upgrade to Access
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20">
      <div className="container mx-auto px-4 py-8">
        <AdminEmailBanner isAdmin={isAdmin} className="mb-6" />
        
        {/* Plan Suggestion Chip */}
        <PlanSuggestionChip 
          persona="families"
          segment={selectedSegment}
          className="mb-6"
        />
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            Current Plan: {currentPlan.name}
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Family Office Platform</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Comprehensive wealth management for modern families
          </p>
        </div>

        {/* Segment Tabs */}
        <Tabs value={selectedSegment} onValueChange={(value) => setSelectedSegment(value as typeof selectedSegment)} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            {familiesConfig.segments.map((segment) => (
              <TabsTrigger key={segment.key} value={segment.key}>
                {segment.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {familiesConfig.segments.map((segment) => (
            <TabsContent key={segment.key} value={segment.key} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {segment.cards.map(renderFeatureCard)}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {familiesConfig.quick_actions.map((action) => {
                const IconComponent = iconMap[action.feature as keyof typeof iconMap] || Target;
                const isAccessible = canAccessFeature(action.feature);
                
                return (
                  <Button
                    key={action.feature}
                    variant={isAccessible ? "outline" : "secondary"}
                    className="h-auto p-4 flex flex-col gap-2"
                    disabled={!isAccessible}
                    onClick={() => handleQuickAction(action)}
                  >
                    <IconComponent className="h-5 w-5" />
                    <span className="text-xs text-center">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Education Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Education Library
              <Badge variant="outline">{familiesConfig.education.nil_tag}</Badge>
            </CardTitle>
            <CardDescription>
              Specialized training and educational content
            </CardDescription>
          </CardHeader>
          <CardContent>
            {familiesConfig.education.gateMarketplaceUntilTraining && trainingProgress < 100 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>NIL Training Progress</span>
                  <span>{trainingProgress}%</span>
                </div>
                <Progress value={trainingProgress} className="w-full" />
                <Button onClick={handleEducationAccess} className="w-full">
                  Complete NIL Training to Unlock
                </Button>
              </div>
            ) : (
              <Button onClick={handleEducationAccess} className="w-full">
                Access Education Library
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FamiliesEntitled;