import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdvisorOnboardingForm } from './AdvisorOnboardingForm';
import { AdvisorBenefitsOverview } from './AdvisorBenefitsOverview';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  FileText, 
  BookOpen, 
  Search,
  Target,
  BarChart3,
  Shield,
  PieChart,
  Settings,
  Zap,
  Building2,
  Crown
} from 'lucide-react';

const AdvisorPersonaLanding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'benefits' | 'form' | 'dashboard'>('benefits');

  const basicFeatures = [
    { icon: BarChart3, title: 'Advisor Dashboard', description: 'Client summaries and portfolio overview' },
    { icon: MessageSquare, title: 'Secure Messaging & File Sharing', description: 'Encrypted client communications' },
    { icon: Users, title: 'Basic CRM Tools', description: 'Contact management and basic tracking' },
    { icon: BookOpen, title: 'Education Center Access', description: 'Professional development resources' },
    { icon: Search, title: 'Marketplace Visibility', description: 'Basic listing in advisor directory' }
  ];

  const premiumFeatures = [
    { icon: Target, title: 'Lead-to-Sales Marketing Engine', description: 'Campaign automation and lead nurturing' },
    { icon: Users, title: 'Advanced CRM + Segmentation', description: 'AI-powered client insights and targeting' },
    { icon: Shield, title: 'Compliance & CE Tracking', description: 'Automated regulatory and education tracking' },
    { icon: PieChart, title: 'Advanced Reporting & Analytics', description: 'Deep performance insights and metrics' },
    { icon: Settings, title: 'White-Label Client Portal', description: 'Fully branded client experience' },
    { icon: Crown, title: 'Private Market Alpha Access', description: 'Exclusive investment opportunities' }
  ];

  const handleGetStarted = () => {
    setCurrentStep('form');
  };

  const handleFormComplete = () => {
    setCurrentStep('dashboard');
  };

  if (currentStep === 'form') {
    return <AdvisorOnboardingForm onComplete={handleFormComplete} />;
  }

  if (currentStep === 'dashboard') {
    return <AdvisorBenefitsOverview />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-foreground">
              Grow Your Practice.{' '}
              <span className="text-primary">Serve Clients Better.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto">
              The Boutique Family Office™ Advisor Platform — where your expertise meets world-class client tools.
            </p>
            
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              From AI-powered lead generation to client onboarding, compliance, and premium investment access — 
              everything you need to scale your business is here.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Choose Your Platform Level
            </h2>
            <p className="text-lg text-muted-foreground">
              Start with our comprehensive Basic features or unlock Premium capabilities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Basic Features */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="h-full border-2 border-border">
                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Building2 className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">Basic Platform</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Essential tools to manage your practice professionally
                  </CardDescription>
                  <Badge variant="secondary" className="w-fit mx-auto">
                    Free to Start
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {basicFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <feature.icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Premium Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="h-full border-2 border-primary bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Crown className="h-6 w-6 text-primary" />
                    <CardTitle className="text-2xl">Premium Platform</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    Advanced tools to scale and optimize your business
                  </CardDescription>
                  <Badge className="w-fit mx-auto">
                    Most Popular
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <feature.icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-12"
          >
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="text-lg px-8 py-6 rounded-xl"
            >
              <Zap className="mr-2 h-5 w-5" />
              Get Started Today
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Set up your account in under 5 minutes • No contracts • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AdvisorPersonaLanding;