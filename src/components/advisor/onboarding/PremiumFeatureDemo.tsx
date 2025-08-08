import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown, 
  Target, 
  BarChart3, 
  Shield, 
  Brain, 
  Play, 
  Calendar,
  ExternalLink,
  Star,
  Clock
} from 'lucide-react';

interface DemoFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  demoType: 'interactive' | 'video' | 'preview';
  benefits: string[];
  ctaText: string;
}

const premiumFeatures: DemoFeature[] = [
  {
    id: 'swag-lead-score',
    title: 'SWAG Lead Score™',
    description: 'AI-powered lead scoring that identifies your highest-value prospects',
    icon: <Target className="h-6 w-6" />,
    demoType: 'interactive',
    benefits: [
      'Automatically scores leads 1-100 based on conversion likelihood',
      'Integrates with your CRM and marketing campaigns',
      'Increases close rates by 40% on average'
    ],
    ctaText: 'Try Live Demo'
  },
  {
    id: 'portfolio-generator',
    title: 'Portfolio/Proposal Generator',
    description: 'Create professional proposals and portfolio reviews in minutes',
    icon: <BarChart3 className="h-6 w-6" />,
    demoType: 'preview',
    benefits: [
      'Auto-generate comprehensive portfolio analysis',
      'Professional PDF proposals with your branding',
      'Risk assessment and allocation recommendations'
    ],
    ctaText: 'See Sample Proposal'
  },
  {
    id: 'compliance-automation',
    title: 'Automated Compliance',
    description: 'Never miss a deadline with automated compliance tracking',
    icon: <Shield className="h-6 w-6" />,
    demoType: 'preview',
    benefits: [
      'ADV updates tracked automatically',
      'CE credit management and reminders',
      'Audit trail for all compliance activities'
    ],
    ctaText: 'View Compliance Dashboard'
  },
  {
    id: 'ai-copilot',
    title: 'AI Copilot (Linda)',
    description: 'Your personal AI assistant for meetings and client management',
    icon: <Brain className="h-6 w-6" />,
    demoType: 'video',
    benefits: [
      'Automated meeting summaries and follow-ups',
      'Client communication drafts',
      'Real-time insights during client meetings'
    ],
    ctaText: 'Watch AI in Action'
  }
];

export function PremiumFeatureDemo() {
  const [selectedFeature, setSelectedFeature] = useState(premiumFeatures[0].id);
  const currentFeature = premiumFeatures.find(f => f.id === selectedFeature) || premiumFeatures[0];

  const handleStartTrial = () => {
    // Handle premium trial signup
    console.log('Starting premium trial');
  };

  const handleBookDemo = () => {
    // Handle demo booking
    console.log('Booking concierge demo');
  };

  const renderDemo = (feature: DemoFeature) => {
    switch (feature.demoType) {
      case 'interactive':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-6 text-center space-y-4">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                {feature.icon}
              </div>
              <div>
                <h4 className="font-semibold mb-2">Interactive Demo</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Try {feature.title} with sample data to see how it works
                </p>
                <Button className="gap-2">
                  <Play className="h-4 w-4" />
                  Launch Interactive Demo
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'video':
        return (
          <div className="space-y-4">
            <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <Play className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Video Demo</h4>
                  <p className="text-muted-foreground text-sm">
                    Watch {feature.title} in action
                  </p>
                </div>
              </div>
            </div>
            <Button className="w-full gap-2">
              <Play className="h-4 w-4" />
              Watch Demo Video
            </Button>
          </div>
        );
      
      case 'preview':
        return (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {feature.icon}
                  <h4 className="font-semibold">{feature.title} Preview</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-background rounded-lg p-4 border">
                    <div className="h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="bg-background rounded-lg p-4 border">
                    <div className="h-20 bg-gradient-to-br from-accent/20 to-primary/20 rounded mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Button className="w-full gap-2">
              <ExternalLink className="h-4 w-4" />
              {feature.ctaText}
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Crown className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Premium Features Demo</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Experience the advanced tools that set top advisors apart. Try these premium features 
          with sample data to see their power firsthand.
        </p>
      </div>

      {/* Feature Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {premiumFeatures.map((feature) => (
          <Card 
            key={feature.id}
            className={`cursor-pointer transition-all ${
              selectedFeature === feature.id 
                ? 'border-primary bg-primary/5 shadow-md' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => setSelectedFeature(feature.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                {feature.icon}
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm">{feature.description}</CardDescription>
              <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary">
                {feature.demoType.charAt(0).toUpperCase() + feature.demoType.slice(1)}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Feature Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Demo Content */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {currentFeature.icon}
              <h3 className="text-2xl font-semibold">{currentFeature.title}</h3>
            </div>
            <p className="text-muted-foreground">{currentFeature.description}</p>
          </div>
          
          {renderDemo(currentFeature)}
        </div>

        {/* Benefits & CTA */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Key Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {currentFeature.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Limited Time Offer
              </CardTitle>
              <CardDescription>
                Start your 30-day free trial and get full access to all premium features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleStartTrial} className="w-full gap-2">
                <Crown className="h-4 w-4" />
                Start Free 30-Day Trial
              </Button>
              <Button variant="outline" onClick={handleBookDemo} className="w-full gap-2">
                <Calendar className="h-4 w-4" />
                Book Concierge Demo
              </Button>
              <div className="text-center">
                <a href="#" className="text-sm text-primary hover:underline">
                  Learn about Revenue-Share Partner Program →
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Stories */}
      <Card className="bg-muted/20">
        <CardHeader>
          <CardTitle className="text-center">What Advisors Are Saying</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">+40%</div>
              <div className="text-sm text-muted-foreground">Average increase in close rates with SWAG Lead Score™</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">-75%</div>
              <div className="text-sm text-muted-foreground">Time saved on proposal generation</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Compliance deadlines met with automation</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}