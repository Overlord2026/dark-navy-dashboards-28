import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  TrendingUp, 
  Shield, 
  Users, 
  Brain, 
  HandHeart,
  Play,
  BookOpen
} from 'lucide-react';

interface AdvisorOnboardingWelcomeProps {
  onGetStarted: () => void;
  onWatchDemo: () => void;
}

const keyBenefits = [
  {
    icon: <Star className="h-6 w-6 text-primary" />,
    title: "All-in-one CRM, Lead Engine, and Practice Management",
    description: "Everything you need to run a modern advisory practice"
  },
  {
    icon: <Brain className="h-6 w-6 text-primary" />,
    title: "AI-Powered Portfolio & Proposal Tools",
    description: "Generate professional proposals and analysis in minutes"
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-primary" />,
    title: "SWAG Lead Score™ for smarter client targeting",
    description: "Advanced analytics to identify your best prospects"
  },
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: "Automated Compliance, ADV & CE Tracking",
    description: "Never miss a deadline or regulatory requirement"
  },
  {
    icon: <HandHeart className="h-6 w-6 text-primary" />,
    title: "Secure Collaboration & Client Portal",
    description: "White-labeled portal for seamless client experience"
  }
];

export function AdvisorOnboardingWelcome({ onGetStarted, onWatchDemo }: AdvisorOnboardingWelcomeProps) {
  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="text-center space-y-6 bg-gradient-to-r from-primary/10 to-accent/10 p-8 rounded-lg">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            Welcome to Your Advanced Wealth Management Advisor Suite
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empower your practice. Deliver premium, fiduciary-driven client experiences. 
            Join a national network of trusted advisors using modern tools to grow their practice.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={onGetStarted} className="gap-2">
            <Users className="h-5 w-5" />
            Start Onboarding
          </Button>
          <Button size="lg" variant="outline" onClick={onWatchDemo} className="gap-2">
            <Play className="h-5 w-5" />
            Watch 2-Minute Demo
          </Button>
        </div>
      </div>

      {/* Key Benefits Grid */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Your Toolkit – All the Power, None of the Clutter</h2>
          <p className="text-muted-foreground">
            Everything you need to build, manage, and scale a modern advisory practice
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {keyBenefits.map((benefit, index) => (
            <Card key={index} className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  {benefit.icon}
                  <CardTitle className="text-lg">{benefit.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{benefit.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Success Stats */}
      <div className="bg-card border rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-primary">10,000+</div>
            <div className="text-muted-foreground">Active Advisors</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">$2.3B+</div>
            <div className="text-muted-foreground">Assets Under Management</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">95%</div>
            <div className="text-muted-foreground">Client Satisfaction</div>
          </div>
        </div>
      </div>

      {/* Premium Teaser */}
      <Card className="bg-gradient-to-r from-accent/20 to-primary/20 border-primary/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            <CardTitle>Ready to Unlock Premium Features?</CardTitle>
            <Badge variant="secondary">30-Day Free Trial</Badge>
          </div>
          <CardDescription>
            Get access to SWAG Lead Scoring, AI Copilot, automated proposals, compliance automation, and advanced analytics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="gap-2">
            <BookOpen className="h-4 w-4" />
            Explore Premium Features
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}