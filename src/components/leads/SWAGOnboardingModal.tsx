import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { Celebration } from '@/components/ConfettiAnimation';
import { analytics } from '@/lib/analytics';

interface SWAGOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: 'advisor' | 'cpa' | 'attorney' | 'coach' | 'consultant';
  userName?: string;
}

export function SWAGOnboardingModal({ 
  isOpen, 
  onClose, 
  persona, 
  userName = 'there' 
}: SWAGOnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [demoScore, setDemoScore] = useState(0);

  const getPersonaContent = (persona: string) => {
    switch (persona) {
      case 'advisor':
        return {
          icon: '👔',
          title: 'Welcome to SWAG Lead Score™!',
          subtitle: 'Instantly qualify and track your prospects—no more guesswork.',
          description: 'Transform your client prospecting with AI-powered lead scoring that identifies high-value prospects instantly.',
          benefits: [
            'Identify high-net-worth prospects automatically',
            'Prioritize follow-ups based on conversion probability',
            'Track engagement and qualification status',
            'Integrate with your existing CRM workflow'
          ]
        };
      case 'cpa':
        return {
          icon: '📊',
          title: 'SWAG Lead Score™ for CPAs',
          subtitle: 'Put every tax client on your radar. See your hottest leads at a glance.',
          description: 'Streamline your client acquisition with intelligent scoring for tax, bookkeeping, and advisory prospects.',
          benefits: [
            'Score prospects by business complexity and value',
            'Track tax season opportunities in real-time',
            'Identify advisory service upsell opportunities',
            'Automate lead qualification and follow-up'
          ]
        };
      case 'attorney':
        return {
          icon: '⚖️',
          title: 'SWAG for Legal Professionals',
          subtitle: 'Find the right fit—AI-driven scoring for estate, business, and family law prospects.',
          description: 'Qualify legal prospects efficiently with scoring based on case complexity, urgency, and value potential.',
          benefits: [
            'Assess case value and complexity automatically',
            'Prioritize estate planning and business law leads',
            'Track referral source performance',
            'Streamline intake and qualification process'
          ]
        };
      case 'coach':
      case 'consultant':
        return {
          icon: '🎯',
          title: 'SWAG Lead Score™ for Coaches',
          subtitle: 'See which practices are ready to take action. SWAG brings focus to your pipeline.',
          description: 'Identify coaching prospects ready for transformation with AI-powered engagement scoring.',
          benefits: [
            'Score prospects by readiness for change',
            'Track engagement across touchpoints',
            'Identify high-value coaching opportunities',
            'Optimize your sales funnel efficiency'
          ]
        };
      default:
        return {
          icon: '💼',
          title: 'Welcome to SWAG Lead Score™!',
          subtitle: 'AI-powered prospect scoring for professional services.',
          description: 'Transform your client prospecting with intelligent lead scoring and qualification.',
          benefits: [
            'Intelligent prospect scoring and qualification',
            'Automated lead prioritization',
            'Real-time engagement tracking',
            'Integrated CRM workflow'
          ]
        };
    }
  };

  const personaContent = getPersonaContent(persona);

  const steps = [
    {
      title: 'Meet SWAG Lead Score™',
      content: (
        <div className="space-y-4 text-center">
          <div className="text-6xl mb-4">{personaContent.icon}</div>
          <h3 className="text-2xl font-bold text-deep-blue">{personaContent.title}</h3>
          <p className="text-lg text-gold font-medium">{personaContent.subtitle}</p>
          <p className="text-muted-foreground">{personaContent.description}</p>
        </div>
      )
    },
    {
      title: 'How SWAG Works',
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Trophy className="h-12 w-12 text-gold mx-auto mb-2" />
            <h3 className="text-xl font-bold text-deep-blue">Strategic Wealth Alpha GPS™</h3>
            <p className="text-muted-foreground">AI-powered scoring from 0-100</p>
          </div>
          
          <div className="space-y-4">
            {[
              { score: 85, band: 'Gold SWAG™', color: 'from-yellow-400 to-yellow-600', icon: '🥇' },
              { score: 70, band: 'Silver SWAG™', color: 'from-gray-300 to-gray-500', icon: '🥈' },
              { score: 55, band: 'Bronze SWAG™', color: 'from-amber-400 to-amber-600', icon: '🥉' }
            ].map((band, index) => (
              <motion.div
                key={band.band}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className={`p-3 rounded-lg bg-gradient-to-r ${band.color} text-white`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{band.icon}</span>
                    <span className="font-medium">{band.band}</span>
                  </div>
                  <span className="font-bold">{band.score}+ Score</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'Key Benefits',
      content: (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-deep-blue text-center mb-6">
            Why {persona === 'advisor' ? 'Advisors' : persona === 'cpa' ? 'CPAs' : persona === 'attorney' ? 'Attorneys' : 'Coaches'} Love SWAG™
          </h3>
          <div className="space-y-3">
            {personaContent.benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-gold/10 to-emerald/10 border border-gold/20"
              >
                <CheckCircle className="h-5 w-5 text-emerald flex-shrink-0" />
                <span className="text-deep-blue">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: 'See It In Action',
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-deep-blue mb-2">Demo: High SWAG Lead</h3>
            <p className="text-muted-foreground mb-4">Watch a prospect's SWAG Score™ in action</p>
          </div>
          
          <div className="bg-gradient-to-br from-gold/10 to-emerald/10 rounded-lg p-4 border border-gold/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-gold" />
                <span className="font-semibold text-deep-blue">SWAG Lead Score™</span>
                <Sparkles className="h-4 w-4 text-gold" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-deep-blue">
                  {demoScore}/100
                </div>
                <div className="text-xs text-muted-foreground">
                  🥇 Gold SWAG™
                </div>
              </div>
            </div>
            
            <Progress 
              value={demoScore} 
              className="h-3 mb-3"
            />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Building</span>
              <span>Bronze</span>
              <span>Silver</span>
              <span>Gold</span>
            </div>

            {demoScore >= 85 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3"
              >
                <Badge className="bg-emerald text-white">
                  <Star className="h-3 w-3 mr-1" />
                  High-Value Prospect!
                </Badge>
              </motion.div>
            )}
          </div>

          <Button
            onClick={() => {
              setDemoScore(88);
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 3000);
              analytics.track('swag_onboarding_demo_viewed', { persona });
            }}
            className="w-full bg-gradient-to-r from-gold to-emerald text-deep-blue font-semibold"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Demo Score
          </Button>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      analytics.track('swag_onboarding_completed', { 
        persona,
        userName 
      });
      onClose();
    }
  };

  const handleSkip = () => {
    analytics.track('swag_onboarding_skipped', { 
      persona,
      step: currentStep 
    });
    onClose();
  };

  React.useEffect(() => {
    if (isOpen) {
      analytics.track('swag_onboarding_started', { persona });
    }
  }, [isOpen, persona]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl bg-gradient-to-r from-gold to-emerald bg-clip-text text-transparent">
              Welcome to SWAG Lead Score™, {userName}!
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              Got SWAG? Discover the future of lead qualification
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex items-center justify-center space-x-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-gold'
                      : index < currentStep
                      ? 'bg-emerald'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[400px] flex flex-col justify-center"
              >
                {steps[currentStep].content}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="ghost" onClick={handleSkip}>
                Skip Tutorial
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {currentStep + 1} of {steps.length}
                </span>
                <Button onClick={handleNext} className="bg-gradient-to-r from-gold to-emerald text-deep-blue">
                  {currentStep === steps.length - 1 ? (
                    <>
                      <Target className="h-4 w-4 mr-2" />
                      See My SWAG Leads
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showConfetti && <Celebration trigger={showConfetti} />}
    </>
  );
}