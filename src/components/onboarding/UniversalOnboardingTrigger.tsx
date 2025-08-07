import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdvisorOnboardingSlides } from './AdvisorOnboardingSlides';
import { CPAOnboardingSlides } from './CPAOnboardingSlides';
import { AttorneyOnboardingSlides } from './AttorneyOnboardingSlides';
import { RealtorOnboardingSlides } from './RealtorOnboardingSlides';
import { HealthcareOnboardingSlides } from './HealthcareOnboardingSlides';
import { FamilyOfficeOnboardingSlides } from './FamilyOfficeOnboardingSlides';
import { InsuranceOnboardingSlides } from './InsuranceOnboardingSlides';
import { 
  Play, 
  Star, 
  Users, 
  BarChart3, 
  Target,
  Sparkles,
  BookOpen,
  Calculator,
  Scale,
  Home,
  Heart,
  Crown
} from 'lucide-react';

interface UniversalOnboardingTriggerProps {
  persona: 'advisor' | 'cpa' | 'attorney' | 'realtor' | 'consultant' | 'family_office' | 'insurance';
}

const personaConfig = {
  advisor: {
    title: "New to the Lead Engine?",
    description: "Master your Lead-to-Sales Engine with our interactive walkthrough. Learn to track prospects, automate campaigns, and grow your practice.",
    features: ["Prospect Management", "ROI Analytics", "Campaign Automation"],
    icons: [<Users className="h-4 w-4 text-primary" />, <BarChart3 className="h-4 w-4 text-primary" />, <Target className="h-4 w-4 text-primary" />],
    premiumFeature: "SWAG Lead Score™, Tax Scanning, Estate Planning Tools",
    component: AdvisorOnboardingSlides
  },
  cpa: {
    title: "New to CPA Practice Suite?",
    description: "Master your accounting practice management with our comprehensive walkthrough. Learn tax scanning, client organization, and workflow automation.",
    features: ["Tax Automation", "Client Organization", "Compliance Tracking"],
    icons: [<Calculator className="h-4 w-4 text-primary" />, <Users className="h-4 w-4 text-primary" />, <BarChart3 className="h-4 w-4 text-primary" />],
    premiumFeature: "AI Tax Scanning, Campaign Engine, Advanced Compliance",
    component: CPAOnboardingSlides
  },
  attorney: {
    title: "New to Legal Practice Suite?",
    description: "Master your legal practice management with our guided tour. Learn document automation, estate planning, and client workflows.",
    features: ["Document Management", "Estate Planning", "Compliance Calendar"],
    icons: [<Scale className="h-4 w-4 text-primary" />, <Users className="h-4 w-4 text-primary" />, <BarChart3 className="h-4 w-4 text-primary" />],
    premiumFeature: "Advanced Workflows, Campaign Engine, Document Analytics",
    component: AttorneyOnboardingSlides
  },
  realtor: {
    title: "New to Realty Practice Engine?",
    description: "Master your real estate practice with our interactive guide. Learn property management, lead tracking, and campaign automation.",
    features: ["Property Management", "Lead Pipeline", "Campaign Tools"],
    icons: [<Home className="h-4 w-4 text-primary" />, <Target className="h-4 w-4 text-primary" />, <BarChart3 className="h-4 w-4 text-primary" />],
    premiumFeature: "Lead Engine, Campaign Automation, eSign, Analytics",
    component: RealtorOnboardingSlides
  },
  consultant: {
    title: "New to Healthcare & Consultant Suite?",
    description: "Master your healthcare or consulting practice with our comprehensive walkthrough. Learn client management, outcome tracking, and growth tools.",
    features: ["Client Management", "Outcome Analytics", "Growth Tools"],
    icons: [<Heart className="h-4 w-4 text-primary" />, <BarChart3 className="h-4 w-4 text-primary" />, <Target className="h-4 w-4 text-primary" />],
    premiumFeature: "Health Marketplace, Legacy Vault, Advanced Analytics",
    component: HealthcareOnboardingSlides
  },
  family_office: {
    title: "New to Family Office Platform?",
    description: "Master your family's wealth, legacy, and communication with our comprehensive platform. Learn dashboard navigation, vault management, and family coordination.",
    features: ["Wealth Dashboard", "Legacy Vault", "Family Coordination"],
    icons: [<Crown className="h-4 w-4 text-primary" />, <Users className="h-4 w-4 text-primary" />, <BarChart3 className="h-4 w-4 text-primary" />],
    premiumFeature: "Legacy Vault, Marketplace Access, Family Council Tools",
    component: FamilyOfficeOnboardingSlides
  },
  insurance: {
    title: "New to Insurance Hub?",
    description: "Master your insurance practice with our comprehensive platform. Learn client management, quoting systems, and compliance tracking.",
    features: ["Practice Dashboard", "Multi-Product Quoting", "Compliance Tracking"],
    icons: [<BarChart3 className="h-4 w-4 text-primary" />, <Users className="h-4 w-4 text-primary" />, <Target className="h-4 w-4 text-primary" />],
    premiumFeature: "Agency Tools, Marketplace Referrals, Advanced Analytics",
    component: InsuranceOnboardingSlides
  }
};

export const UniversalOnboardingTrigger: React.FC<UniversalOnboardingTriggerProps> = ({ persona }) => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const config = personaConfig[persona];
  const OnboardingComponent = config.component;

  return (
    <>
      <Card className="border-primary bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <CardTitle>{config.title}</CardTitle>
            <Badge variant="default" className="ml-auto">5 min tour</Badge>
          </div>
          <CardDescription>
            {config.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {config.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                {config.icons[index]}
                <span>{feature}</span>
              </div>
            ))}
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={() => setShowOnboarding(true)}
              className="flex-1 gap-2"
            >
              <Play className="h-4 w-4" />
              Start Interactive Tour
            </Button>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setShowOnboarding(true)}
            >
              <BookOpen className="h-4 w-4" />
              Quick Start
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Learn about Premium features: {config.premiumFeature}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <OnboardingComponent 
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </>
  );
};