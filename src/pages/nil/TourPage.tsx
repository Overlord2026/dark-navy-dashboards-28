import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ArrowRight, ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import { loadNilFixtures, getNilSnapshot } from '@/fixtures/fixtures.nil';
import { listReceipts } from '@/features/receipts/record';
import { toast } from 'sonner';
import { GoldButton, GoldOutlineButton } from '@/components/ui/brandButtons';

const TOUR_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to NIL Platform',
    description: 'Name, Image, Likeness marketplace for student athletes',
    action: 'Navigate to marketplace',
    route: '/nil'
  },
  {
    id: 'education',
    title: 'Complete NIL Education',
    description: 'Learn about compliance and opportunities',
    action: 'Complete education module',
    route: '/nil/education'
  },
  {
    id: 'offers',
    title: 'Create Your First Offer',
    description: 'Build a brand partnership proposal',
    action: 'Create offer',
    route: '/nil/offers'
  },
  {
    id: 'receipts',
    title: 'View Receipt Trail',
    description: 'See your activity history and compliance tracking',
    action: 'View receipts',
    route: '/nil/receipts'
  }
];

export default function NILTourPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [snapshot, setSnapshot] = useState(getNilSnapshot());
  const [tourProgress, setTourProgress] = useState(0);

  // Handle auto-loading demo and autoplay from query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const demo = params.get('demo');
    const autoplay = params.get('autoplay');
    
    if (demo === 'nil_coach' || demo === 'nil_mom') {
      const profile = demo === 'nil_coach' ? 'coach' : 'mom';
      
      setLoading(true);
      loadNilFixtures(profile).then((result) => {
        setSnapshot(result);
        toast.success(`NIL Demo loaded for ${profile} persona`);
        
        if (autoplay === '1') {
          setIsPlaying(true);
          toast.success('Auto-tour started!', {
            description: 'Interactive tour will guide you through key features'
          });
        }
        
        // Clean up URL
        window.history.replaceState({}, '', '/nil/tour');
      }).finally(() => {
        setLoading(false);
      });
    }
  }, []);

  // Auto-advance tour when playing
  useEffect(() => {
    if (isPlaying && currentStep < TOUR_STEPS.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setTourProgress((currentStep + 1) / TOUR_STEPS.length * 100);
      }, 3000); // 3 seconds per step
      
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep >= TOUR_STEPS.length - 1) {
      setIsPlaying(false);
      toast.success('Tour completed!', {
        description: 'You can now explore the platform freely'
      });
    }
  }, [isPlaying, currentStep]);

  const handleStepAction = (step: typeof TOUR_STEPS[0]) => {
    navigate(step.route);
    if (isPlaying) {
      setIsPlaying(false);
    }
  };

  const nextStep = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      setTourProgress((currentStep + 1) / TOUR_STEPS.length * 100);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setTourProgress(currentStep / TOUR_STEPS.length * 100);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const restartTour = () => {
    setCurrentStep(0);
    setTourProgress(0);
    setIsPlaying(false);
  };

  const analytics = {
    receiptsTotal: listReceipts().length,
    receiptsAnchored: listReceipts().filter(r => r.anchor_ref?.accepted).length
  };

  const currentTourStep = TOUR_STEPS[currentStep];

  return (
    <div className="min-h-screen bg-bfo-black text-white">
      <div className="max-w-4xl mx-auto space-y-6 py-8 px-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">NIL Platform Tour</h1>
            <p className="text-white/70 mt-2">
              Interactive walkthrough of key NIL marketplace features
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {snapshot && (
              <Badge variant="outline" className="px-3 py-1 border-bfo-gold/40 text-bfo-gold">
                Demo Ready
              </Badge>
            )}
            <Badge variant="outline" className="border-green-500/40 text-green-400">
              Tour Mode
            </Badge>
          </div>
        </div>

        {loading && (
          <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
            <CardContent className="p-6 text-center">
              <div className="text-bfo-gold">Loading demo data...</div>
            </CardContent>
          </Card>
        )}

        {/* Tour Progress */}
        <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
          <CardHeader className="border-b border-bfo-gold/30">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white font-semibold">
                Tour Progress ({currentStep + 1}/{TOUR_STEPS.length})
              </CardTitle>
              <div className="flex items-center space-x-2">
                <GoldOutlineButton
                  onClick={togglePlayPause}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </GoldOutlineButton>
                <GoldOutlineButton
                  onClick={restartTour}
                >
                  <RotateCcw className="h-4 w-4" />
                  Restart
                </GoldOutlineButton>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Progress value={tourProgress} className="mb-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {TOUR_STEPS.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border transition-all ${
                    index === currentStep
                      ? 'border-bfo-gold bg-bfo-gold/10'
                      : index < currentStep
                      ? 'border-green-500/40 bg-green-500/10'
                      : 'border-white/20 bg-bfo-black/30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {index < currentStep ? (
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                    ) : index === currentStep ? (
                      <div className="h-4 w-4 rounded-full border-2 border-bfo-gold" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-white/40" />
                    )}
                    <span className="text-sm font-medium">{step.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Step */}
        <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
          <CardHeader className="border-b border-bfo-gold/30">
            <CardTitle className="text-white font-semibold">
              Step {currentStep + 1}: {currentTourStep.title}
            </CardTitle>
            <CardDescription className="text-white/70">
              {currentTourStep.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  variant="outline"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <GoldButton
                  onClick={() => handleStepAction(currentTourStep)}
                  className="px-6"
                >
                  {currentTourStep.action}
                </GoldButton>
                
                <Button
                  onClick={nextStep}
                  disabled={currentStep === TOUR_STEPS.length - 1}
                  variant="outline"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <Badge variant="secondary" className="bg-bfo-gold/20 text-bfo-gold border-bfo-gold/30">
                {isPlaying ? 'Auto-Playing' : 'Manual Mode'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        {snapshot && (
          <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
            <CardHeader className="border-b border-bfo-gold/30">
              <CardTitle className="text-white font-semibold">Demo Analytics</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-bfo-gold">{snapshot.counts.invites}</div>
                  <div className="text-sm text-white/60">Invites</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bfo-gold">{snapshot.counts.education}</div>
                  <div className="text-sm text-white/60">Modules</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-bfo-gold">{analytics.receiptsTotal}</div>
                  <div className="text-sm text-white/60">Receipts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{analytics.receiptsAnchored}</div>
                  <div className="text-sm text-white/60">Anchored</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Shareable Links */}
        <Card className="bg-[#24313d] border-bfo-gold/40 rounded-xl">
          <CardHeader className="border-b border-bfo-gold/30">
            <CardTitle className="text-white font-semibold">Shareable Demo Links</CardTitle>
            <CardDescription className="text-white/70">
              Copy these links to instantly load demo states
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            <div className="p-3 bg-bfo-black/30 rounded border border-bfo-gold/20">
              <div className="text-sm font-medium text-white mb-1">Coach Demo + Analytics</div>
              <code className="text-xs text-bfo-gold break-all">
                {window.location.origin}/nil/demo?demo=nil_coach
              </code>
            </div>
            
            <div className="p-3 bg-bfo-black/30 rounded border border-bfo-gold/20">
              <div className="text-sm font-medium text-white mb-1">Guardian Demo + Auto-Tour</div>
              <code className="text-xs text-bfo-gold break-all">
                {window.location.origin}/nil/tour?demo=nil_mom&autoplay=1
              </code>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}