import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  TrendingUp, 
  Shield, 
  Building2, 
  CreditCard, 
  Heart,
  Play,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { StressTestPreview } from '@/components/retirement/StressTestPreview';
import { analytics } from '@/lib/analytics';

export const ClientFamilyWelcomeStep: React.FC = () => {
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Demo inputs for stress test preview
  const demoInputs = {
    portfolioValue: 1500000,
    annualFee: 20000,
    growthRate: 8,
    monthlySpending: 12000,
    inflation: 2,
    timeHorizon: 30
  };

  const handleCustomizeClick = (scenarioId: string) => {
    analytics.track('onboarding_stress_preview_clicked', {
      scenario: scenarioId,
      step: 'welcome'
    });
    // This would typically advance to the next onboarding step
    console.log('Customize clicked for scenario:', scenarioId);
  };

  useEffect(() => {
    analytics.track('onboarding_step_viewed', {
      stepId: 'welcome',
      persona: 'client-family'
    });
  }, []);

  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Net Worth Dashboard',
      description: 'Real-time tracking of all assets and accounts.',
      color: 'bg-blue-500'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure Family Vault',
      description: 'Bank-level storage for critical documents.',
      color: 'bg-green-500'
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: 'Properties & Entities',
      description: 'Manage homes, LLCs, and business holdings.',
      color: 'bg-purple-500'
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: 'Bill Pay & Retirement Roadmap',
      description: 'Pay bills and plan long-term income.',
      color: 'bg-orange-500'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Proactive Health & Wellness',
      description: 'Organize care records and health plans.',
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Your Complete Family Office in One Secure Portal
          </h1>
          
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Manage wealth, protect your legacy, and access trusted professionals — all in one place.
          </p>
        </motion.div>
      </div>

      {/* Benefits Cards Grid */}
      <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* First row - 3 cards */}
        {benefits.slice(0, 3).map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary/30">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${benefit.color} rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {benefit.icon}
                  </div>
                </div>
                <CardTitle className="text-lg mb-3 group-hover:text-primary transition-colors">
                  {benefit.title}
                </CardTitle>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Second row - 2 cards centered */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {benefits.slice(3, 5).map((benefit, index) => (
          <motion.div
            key={index + 3}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
          >
            <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-primary/30">
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${benefit.color} rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {benefit.icon}
                  </div>
                </div>
                <CardTitle className="text-lg mb-3 group-hover:text-primary transition-colors">
                  {benefit.title}
                </CardTitle>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Video Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-center"
      >
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer"
                   onClick={() => setShowVideoModal(true)}>
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-3">Watch How It Works</h3>
            <p className="text-muted-foreground mb-6">
              See how families like yours are transforming their wealth management 
              with our comprehensive family office platform.
            </p>
            
            <Button 
              size="lg"
              onClick={() => setShowVideoModal(true)}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo Video
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* SWAG Roadmap Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <StressTestPreview
          inputs={demoInputs}
          onScenarioClick={handleCustomizeClick}
          showBookingCTA={false}
          demoMode={true}
        />
      </motion.div>

      {/* Video Modal */}
      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Play className="w-6 h-6 mr-2 text-primary" />
              Family Office Platform Demo
            </DialogTitle>
          </DialogHeader>
          
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Play className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Demo Video Coming Soon</h3>
              <p className="text-muted-foreground">
                Watch how families transform their wealth management with our platform
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold">Complete Wealth View</h4>
              <p className="text-sm text-muted-foreground">See everything in one dashboard</p>
            </div>
            
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold">Secure & Private</h4>
              <p className="text-sm text-muted-foreground">Bank-level security for your family</p>
            </div>
            
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold">Professional Network</h4>
              <p className="text-sm text-muted-foreground">Access vetted advisors and services</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};