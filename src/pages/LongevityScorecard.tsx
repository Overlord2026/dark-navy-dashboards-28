import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useNavigate } from 'react-router-dom';
import { useLongevityScorecard } from '@/hooks/useLongevityScorecard';
import { LongevityInputForm } from '@/components/longevity-scorecard/LongevityInputForm';
import { BucketVisualization } from '@/components/longevity-scorecard/BucketVisualization';
import { ScenarioResults } from '@/components/longevity-scorecard/ScenarioResults';
import { LongevityScoreDisplay } from '@/components/longevity-scorecard/LongevityScoreDisplay';
import { QuickStartPrompt } from '@/components/longevity-scorecard/QuickStartPrompt';
import { useEventTracking } from '@/hooks/useEventTracking';
import { useSubscriptionAccess } from '@/hooks/useSubscriptionAccess';
import { useToast } from '@/hooks/use-toast';

type Step = 'quickstart' | 'inputs' | 'buckets' | 'scenarios' | 'score';

export default function LongevityScorecard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { trackFeatureUsed } = useEventTracking();
  const { subscriptionPlan } = useSubscriptionAccess();
  const [currentStep, setCurrentStep] = useState<Step>('quickstart');
  
  const {
    inputs,
    updateInput,
    updateBucketAllocation,
    bucketPlan,
    scenarioResults,
    longevityScore,
    calculateScore,
    resetToDefaults,
    startQuickStart,
    isCalculating,
    isQuickStart,
    hasReturnedUser
  } = useLongevityScorecard();

  // Skip quickstart if user has returned
  React.useEffect(() => {
    if (hasReturnedUser && currentStep === 'quickstart') {
      setCurrentStep('inputs');
    }
  }, [hasReturnedUser, currentStep]);

  const steps: { key: Step; title: string; description: string }[] = [
    { key: 'inputs', title: 'Your Information', description: 'Basic financial and personal details' },
    { key: 'buckets', title: 'Asset Strategy', description: 'How to allocate your investments' },
    { key: 'scenarios', title: 'Stress Testing', description: 'See how your plan performs' },
    { key: 'score', title: 'Your Score', description: 'Get your longevity assessment' }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 'inputs':
        return inputs.age > 0 && inputs.currentAssets > 0 && inputs.annualSpending > 0;
      case 'buckets':
        const total = Object.values(inputs.bucketAllocations).reduce((sum, val) => sum + val, 0);
        return total === 100;
      case 'scenarios':
        return true;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (currentStep === 'scenarios') {
      await calculateScore();
      setCurrentStep('score');
    } else {
      const nextIndex = Math.min(currentStepIndex + 1, steps.length - 1);
      setCurrentStep(steps[nextIndex].key);
    }
    
    // Track step progression
    trackFeatureUsed('longevity_scorecard_step', { 
      step: currentStep,
      next_step: currentStep === 'scenarios' ? 'score' : steps[Math.min(currentStepIndex + 1, steps.length - 1)].key
    });
  };

  const handlePrevious = () => {
    const prevIndex = Math.max(currentStepIndex - 1, 0);
    setCurrentStep(steps[prevIndex].key);
  };

  const handleScheduleReview = () => {
    trackFeatureUsed('schedule_consultation', { source: 'longevity_scorecard' });
    window.open('https://calendly.com/tonygomes/talk-with-tony', '_blank');
  };

  const handleGetRoadmap = () => {
    trackFeatureUsed('roadmap_request', { source: 'longevity_scorecard' });
    navigate('/roadmap-info');
  };

  const handleDownloadReport = () => {
    const isPremium = subscriptionPlan?.tier === 'premium' || subscriptionPlan?.tier === 'elite';
    
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "PDF reports are available with Premium subscription",
        variant: "destructive"
      });
      return;
    }
    
    trackFeatureUsed('download_longevity_report', { score: longevityScore.score });
    
    // TODO: Implement PDF generation
    toast({
      title: "Report Generated",
      description: "Your longevity scorecard report is being prepared"
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'quickstart':
        return (
          <QuickStartPrompt
            onQuickStart={() => {
              startQuickStart();
              setCurrentStep('inputs');
            }}
            onFullAssessment={() => setCurrentStep('inputs')}
          />
        );
      case 'inputs':
        return (
          <LongevityInputForm
            inputs={inputs}
            onUpdateInput={updateInput}
            onUpdateBucketAllocation={updateBucketAllocation}
            isQuickStart={isQuickStart}
            hasReturnedUser={hasReturnedUser}
          />
        );
      case 'buckets':
        return (
          <BucketVisualization
            bucketPlan={bucketPlan}
            totalAssets={inputs.currentAssets}
          />
        );
      case 'scenarios':
        return (
          <ScenarioResults
            results={scenarioResults}
            inputs={inputs}
          />
        );
      case 'score':
        return (
          <LongevityScoreDisplay
            score={longevityScore}
            onScheduleReview={handleScheduleReview}
            onGetRoadmap={handleGetRoadmap}
            onDownloadReport={handleDownloadReport}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo variant="tree" onClick={() => navigate('/')} />
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetToDefaults}
                className="hidden sm:flex"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Exit
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Health & Wealth Longevity Scorecard
              </h1>
              <p className="text-muted-foreground">
                Discover if your money will last as long as you do
              </p>
            </div>

            {/* Step Progress */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">
                  Step {currentStepIndex + 1} of {steps.length}: {steps[currentStepIndex].title}
                </span>
                <span className="text-muted-foreground">
                  {Math.round(progress)}% complete
                </span>
              </div>
              <Progress value={progress} className="h-2" />
              
              {/* Step Indicators */}
              <div className="hidden md:flex justify-between">
                {steps.map((step, index) => (
                  <div 
                    key={step.key}
                    className={`flex flex-col items-center space-y-1 ${
                      index <= currentStepIndex ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                      index <= currentStepIndex 
                        ? 'border-primary bg-primary text-primary-foreground' 
                        : 'border-muted-foreground'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="text-xs text-center max-w-20">
                      <div className="font-medium">{step.title}</div>
                      <div className="text-muted-foreground">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {isCalculating && currentStep === 'score' ? (
            <Card>
              <CardContent className="p-12 text-center space-y-6">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Calculating Your Longevity Score</h3>
                  <p className="text-muted-foreground">
                    Running stress tests and analyzing your financial longevity...
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            renderStepContent()
          )}
        </div>
      </div>

      {/* Navigation Footer */}
      {currentStep !== 'score' && !isCalculating && (
        <div className="border-t bg-card/50 backdrop-blur-sm sticky bottom-0">
          <div className="container mx-auto px-4 py-4">
            <div className="max-w-4xl mx-auto flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStepIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex items-center gap-4">
                {!canProceed() && (
                  <p className="text-sm text-muted-foreground">
                    {currentStep === 'buckets' 
                      ? 'Please allocate 100% of your assets'
                      : 'Please complete all required fields'
                    }
                  </p>
                )}
                
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-primary hover:bg-primary/90"
                >
                  {currentStep === 'scenarios' ? 'Calculate Score' : 'Continue'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}