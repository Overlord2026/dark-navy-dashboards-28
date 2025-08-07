import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WelcomeStep } from './steps/WelcomeStep';
import { SecureAccountStep } from './steps/SecureAccountStep';
import { DashboardTourStep } from './steps/DashboardTourStep';
import { OptionalAccountLinkingStep } from './steps/OptionalAccountLinkingStep';
import { GoalSettingStep } from './steps/GoalSettingStep';
import { FamilySetupStep } from './steps/FamilySetupStep';
import { WelcomeCallStep } from './steps/WelcomeCallStep';
import { CompletionStep } from './steps/CompletionStep';
import { AIAssistant } from './AIAssistant';
import { OnboardingState, OnboardingStepData, WhiteLabelConfig, ReferralInfo, OnboardingStepConfig } from '@/types/onboarding';
import { useTenantBranding } from '@/hooks/useTenantBranding';
import { useOnboardingProgress } from '@/hooks/useOnboardingProgress';
import { OnboardingProgressBar } from './OnboardingProgressBar';

interface ClientOnboardingFlowProps {
  onComplete?: (state: OnboardingState) => void;
  whiteLabelConfig?: WhiteLabelConfig;
  referralInfo?: ReferralInfo;
  customStepsConfig?: OnboardingStepConfig[];
  initialData?: Partial<OnboardingStepData>;
  tenantId?: string;
  partnerId?: string;
}

export const ClientOnboardingFlow: React.FC<ClientOnboardingFlowProps> = ({
  onComplete,
  whiteLabelConfig,
  referralInfo,
  customStepsConfig,
  initialData = {},
  tenantId,
  partnerId
}) => {
  const { brandingConfig } = useTenantBranding();
  const { progress, saveProgress, markCompleted, hasExistingProgress } = useOnboardingProgress();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedCompletion, setEstimatedCompletion] = useState<string>('');
  
  // Merge branding configurations
  const effectiveBrandConfig = whiteLabelConfig || {
    companyName: brandingConfig?.companyName || 'Family Office Platform',
    primaryColor: brandingConfig?.primaryColor || '#FFD700',
    secondaryColor: brandingConfig?.secondaryColor || '#1E40AF',
    accentColor: brandingConfig?.accentColor || '#10B981',
    logoUrl: brandingConfig?.logoUrl,
    pricingTier: 'professional' as const,
    features: {
      aiAssistant: true,
      documentOcr: true,
      digitalSignature: true,
      apiIntegrations: true,
      customBranding: true,
      multiCustodian: true,
    }
  };

  const [data, setData] = useState<OnboardingStepData>(() => {
    // Load from localStorage first, then progress, then initial data
    const savedData = localStorage.getItem('onboarding-data');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch {
        // Fall through to other sources
      }
    }
    return hasExistingProgress && progress?.stepData ? progress.stepData : initialData;
  });

  // Restore progress if exists
  useEffect(() => {
    if (progress && hasExistingProgress) {
      setCurrentStep(progress.currentStep);
      // Only update data if we don't have more recent localStorage data
      const savedData = localStorage.getItem('onboarding-data');
      if (!savedData) {
        setData(progress.stepData);
      }
    }
  }, [progress, hasExistingProgress]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('onboarding-data', JSON.stringify(data));
  }, [data]);

  // Updated step configuration for optimized onboarding flow
  const defaultSteps = [
    { id: 'welcome', name: 'Welcome', title: 'Welcome', description: 'Get started', enabled: true, required: true, order: 0 },
    { id: 'secure-account', name: 'Create Account', title: 'Create Your Portal', description: 'Basic account setup', enabled: true, required: true, order: 1 },
    { id: 'dashboard-tour', name: 'Dashboard Tour', title: 'Your Command Center', description: 'See what you can do', enabled: true, required: false, order: 2 },
    { id: 'optional-linking', name: 'Add Account', title: 'Connect Accounts (Optional)', description: 'Link your financial accounts', enabled: true, required: false, order: 3 },
    { id: 'family-goals', name: 'Family & Goals', title: 'Family & Goals (Optional)', description: 'Set up family and goals', enabled: true, required: false, order: 4 },
    { id: 'welcome-call', name: 'Welcome Call', title: 'Book Welcome Call (Optional)', description: 'Optional consultation', enabled: true, required: false, order: 5 },
    { id: 'completion', name: 'Complete', title: 'You\'re All Set!', description: 'Access your dashboard', enabled: true, required: true, order: 6 }
  ];

  const activeSteps = (customStepsConfig || defaultSteps)
    .filter(step => step.enabled)
    .sort((a, b) => a.order - b.order);

  const stepTitles = activeSteps.map(step => step.title);

  const progressPercentage = ((currentStep + 1) / stepTitles.length) * 100;

  // Calculate estimated completion time
  useEffect(() => {
    const estimateCompletion = () => {
      const averageTimePerStep = 8; // minutes
      const remainingSteps = stepTitles.length - currentStep - 1;
      const estimatedMinutes = remainingSteps * averageTimePerStep;
      
      if (estimatedMinutes <= 0) {
        setEstimatedCompletion('Almost done!');
      } else if (estimatedMinutes < 60) {
        setEstimatedCompletion(`~${estimatedMinutes} minutes remaining`);
      } else {
        const hours = Math.floor(estimatedMinutes / 60);
        const minutes = estimatedMinutes % 60;
        setEstimatedCompletion(`~${hours}h ${minutes}m remaining`);
      }
    };
    estimateCompletion();
  }, [currentStep, stepTitles.length]);

  const handleComplete = async (stepData: Partial<OnboardingStepData>) => {
    const updatedData = { ...data, ...stepData };
    setData(updatedData);
    
    // Save to localStorage immediately
    localStorage.setItem('onboarding-data', JSON.stringify(updatedData));

    const nextStep = currentStep + 1;
    
    // Save progress to database
    await saveProgress(
      nextStep,
      stepTitles.length,
      stepData,
      nextStep >= stepTitles.length ? 'completed' : 'in_progress'
    );

    if (currentStep < stepTitles.length - 1) {
      setCurrentStep(nextStep);
    } else {
      // Mark as completed
      await markCompleted();
      
      // Clear localStorage since we're done
      localStorage.removeItem('onboarding-data');
      
      const finalState: OnboardingState = {
        ...updatedData,
        currentStep: nextStep,
        totalSteps: stepTitles.length,
        progressPercentage: 100,
        status: 'completed',
        priority: 'medium',
        referralInfo,
        whiteLabelConfig: effectiveBrandConfig,
        customStepsConfig: customStepsConfig || defaultSteps,
        estimatedCompletion: 'Completed!',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      onComplete?.(finalState);
    }
  };

  // Handle navigation with data preservation
  const handlePrevious = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  const handleNext = () => {
    setCurrentStep(Math.min(currentStep + 1, stepTitles.length - 1));
  };

  const renderCurrentStep = () => {
    const commonProps = {
      data,
      onComplete: handleComplete,
      onNext: handleNext,
      onPrevious: handlePrevious,
      isLoading,
      whiteLabelConfig: effectiveBrandConfig,
      referralInfo,
    };

    const activeStep = activeSteps[currentStep];
    if (!activeStep) return null;

    const stepProps = {
      ...commonProps,
      currentStep: currentStep + 1,
      totalSteps: stepTitles.length
    };

    switch (activeStep.id) {
      case 'welcome':
        return <WelcomeStep {...commonProps} />;
      case 'secure-account':
        return <SecureAccountStep {...stepProps} />;
      case 'dashboard-tour':
        return <DashboardTourStep {...stepProps} />;
      case 'optional-linking':
        return <OptionalAccountLinkingStep {...stepProps} />;
      case 'goals':
        return <GoalSettingStep {...stepProps} />;
      case 'family':
        return <FamilySetupStep {...stepProps} />;
      case 'welcome-call':
        return <WelcomeCallStep {...stepProps} />;
      case 'completion':
        return <CompletionStep {...stepProps} />;
      default:
        return <WelcomeStep {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/5">
      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Mobile-First Header */}
          <div className="text-center mb-6">
            {effectiveBrandConfig.logoUrl && (
              <img 
                src={effectiveBrandConfig.logoUrl} 
                alt={effectiveBrandConfig.companyName}
                className="h-12 mx-auto mb-4"
              />
            )}
            <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-2">
              {effectiveBrandConfig.companyName} Client Onboarding
            </h1>
            {referralInfo && (
              <div className="flex justify-center mb-2">
                <Badge variant="secondary" className="text-xs">
                  Referred by {referralInfo.referrerName || 'Partner'}
                </Badge>
              </div>
            )}
            <p className="text-muted-foreground text-sm md:text-base">
              {effectiveBrandConfig.welcomeMessage || 'Complete your onboarding to access our platform'}
            </p>
          </div>

          {/* Enhanced Progress with ETA */}
          <div className="mb-6 md:mb-8">
            <OnboardingProgressBar
              currentStep={currentStep + 1}
              totalSteps={stepTitles.length}
              progressPercentage={progressPercentage}
              status={progress?.status || 'in_progress'}
              lastActiveAt={progress?.lastActiveAt}
              estimatedCompletion={estimatedCompletion}
            />
            
            {hasExistingProgress && (
              <div className="mt-2 text-sm text-muted-foreground">
                Welcome back! Continuing from where you left off.
              </div>
            )}
          </div>

          {/* Main Content */}
          <Card className="premium-card mb-6 shadow-lg">
            <CardContent className="p-4 md:p-8">
              {renderCurrentStep()}
            </CardContent>
          </Card>

          {/* Mobile-First Navigation */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              className="w-full md:w-auto flex items-center gap-2 order-2 md:order-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {/* AI Assistant Button - Prominent on Mobile */}
            {effectiveBrandConfig.features.aiAssistant && (
              <div className="flex items-center gap-2 order-1 md:order-2">
                <span className="text-sm text-muted-foreground hidden md:block">
                  Need help?
                </span>
                <Button
                  onClick={() => setShowAIAssistant(true)}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span className="md:hidden">Chat with Linda</span>
                  <span className="hidden md:inline">Ask Linda</span>
                </Button>
              </div>
            )}

            <Button
              onClick={handleNext}
              disabled={currentStep === stepTitles.length - 1}
              className="w-full md:w-auto btn-primary-gold flex items-center gap-2 order-3"
            >
              {currentStep === stepTitles.length - 1 ? 'Complete' : 'Next'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Partner Attribution */}
          {referralInfo && referralInfo.type !== 'direct' && (
            <div className="text-center mt-6 text-xs text-muted-foreground">
              <p>
                Onboarding powered by {effectiveBrandConfig.companyName} 
                {referralInfo.referrerFirm && ` in partnership with ${referralInfo.referrerFirm}`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* AI Assistant */}
      {showAIAssistant && effectiveBrandConfig.features.aiAssistant && (
        <AIAssistant
          isOpen={showAIAssistant}
          onClose={() => setShowAIAssistant(false)}
          currentStep={currentStep}
          stepTitle={stepTitles[currentStep]}
          onboardingData={data}
          whiteLabelConfig={effectiveBrandConfig}
          referralInfo={referralInfo}
        />
      )}
    </div>
  );
};