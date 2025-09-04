import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { 
  Users, 
  Calculator, 
  Scale, 
  Home, 
  Heart, 
  Crown,
  Play,
  BookOpen,
  Target,
  BarChart3,
  Stethoscope,
  Settings,
  HelpCircle
} from 'lucide-react';

const personaOnboardingData = [
  {
    id: 'advisor',
    title: 'Financial Advisors',
    description: 'Lead-to-Sales Engine, Portfolio Management, Client Onboarding',
    icon: <Users className="h-8 w-8 text-primary" />,
    features: ['SWAG Lead Score™', 'Campaign Automation', 'ROI Analytics', 'Tax Scanning'],
    color: 'from-blue-500 to-cyan-500',
    component: 'AdvisorOnboardingSlides'
  },
  {
    id: 'cpa',
    title: 'CPAs & Accountants',
    description: 'Tax Preparation, Client Organization, Compliance Management',
    icon: <Calculator className="h-8 w-8 text-primary" />,
    features: ['AI Tax Scanning', 'Client Portal', 'CE Automation', 'Bulk Messaging'],
    color: 'from-green-500 to-emerald-500',
    component: 'CPAOnboardingSlides'
  },
  {
    id: 'attorney',
    title: 'Attorneys & Legal',
    description: 'Estate Planning, Document Management, Case Tracking',
    icon: <Scale className="h-8 w-8 text-primary" />,
    features: ['Document Vault', 'Estate Builder', 'Compliance Calendar', 'Referral Engine'],
    color: 'from-purple-500 to-violet-500',
    component: 'AttorneyOnboardingSlides'
  },
  {
    id: 'realtor',
    title: 'Realtors & Property Managers',
    description: 'Property Management, Deal Pipeline, Team Collaboration',
    icon: <Home className="h-8 w-8 text-primary" />,
    features: ['Property Dashboard', 'Deal Pipeline', 'Team Management', 'Commission Tracking'],
    color: 'from-orange-500 to-red-500',
    component: 'RealtorOnboardingSlides'
  },
  {
    id: 'healthcare',
    title: 'Healthcare & Wellness',
    description: 'Patient Management, Health Marketplace, Legacy Vault',
    icon: <Stethoscope className="h-8 w-8 text-primary" />,
    features: ['HIPAA Compliance', 'Health Marketplace', 'Legacy Vault', 'Longevity Tools'],
    color: 'from-pink-500 to-rose-500',
    component: 'HealthcareOnboardingSlides'
  },
  {
    id: 'consultant',
    title: 'Consultants & Coaches',
    description: 'Client Engagement, Session Tracking, Outcome Analytics',
    icon: <Heart className="h-8 w-8 text-primary" />,
    features: ['Session Management', 'Resource Sharing', 'Progress Tracking', 'Bulk Operations'],
    color: 'from-indigo-500 to-blue-500',
    component: 'ConsultantOnboardingSlides'
  }
];

const adminFeatures = [
  {
    title: 'Multi-Tenant Management',
    description: 'Manage family offices and their professional networks',
    icon: <Settings className="h-6 w-6 text-primary" />
  },
  {
    title: 'User Role Administration',
    description: 'Configure permissions and access levels across all personas',
    icon: <Users className="h-6 w-6 text-primary" />
  },
  {
    title: 'Analytics & Reporting',
    description: 'System-wide analytics and custom reporting capabilities',
    icon: <BarChart3 className="h-6 w-6 text-primary" />
  },
  {
    title: 'Integration Management',
    description: 'Configure third-party integrations and API connections',
    icon: <Target className="h-6 w-6 text-primary" />
  }
];

export const OnboardingHub: React.FC = () => {
  const [selectedPersona, setSelectedPersona] = React.useState<string | null>(null);

  return (
    <ThreeColumnLayout title="Onboarding Hub">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome to the BFO Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose your profession below to access your personalized onboarding experience. 
            Each tutorial is designed specifically for your role and includes interactive demos, 
            feature walkthroughs, and premium upgrade paths.
          </p>
          <Badge variant="outline" className="text-sm">
            Interactive Tutorials • Demo Videos • Feature Highlights
          </Badge>
        </div>

        {/* Professional Personas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personaOnboardingData.map((persona) => (
            <Card key={persona.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary">
              <CardHeader>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${persona.color} flex items-center justify-center mb-4 mx-auto`}>
                  <div className="text-white">
                    {persona.icon}
                  </div>
                </div>
                <CardTitle className="text-center">{persona.title}</CardTitle>
                <CardDescription className="text-center">
                  {persona.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    Key Features:
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {persona.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs justify-center">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 gap-2" 
                    onClick={() => setSelectedPersona(persona.id)}
                  >
                    <Play className="h-4 w-4" />
                    Start Tour
                  </Button>
                  <Button variant="outline" size="icon">
                    <BookOpen className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Section */}
        <Card className="border-2 border-dashed border-primary bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Super Admin & System Management
                  <Badge className="bg-amber-500 text-white">Admin Only</Badge>
                </CardTitle>
                <CardDescription>
                  Advanced system administration, user management, and platform configuration
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {adminFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                  {feature.icon}
                  <div>
                    <h4 className="font-semibold text-sm">{feature.title}</h4>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-3">
              <Button className="gap-2">
                <Settings className="h-4 w-4" />
                Admin Training
              </Button>
              <Button variant="outline" className="gap-2">
                <HelpCircle className="h-4 w-4" />
                Support Documentation
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>
              Jump directly to specific platform features or get help
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Target className="h-6 w-6" />
                Lead Management
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <BarChart3 className="h-6 w-6" />
                Analytics
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <Users className="h-6 w-6" />
                Client Portal
              </Button>
              <Button variant="outline" className="h-20 flex flex-col gap-2">
                <HelpCircle className="h-6 w-6" />
                Get Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ThreeColumnLayout>
  );
};