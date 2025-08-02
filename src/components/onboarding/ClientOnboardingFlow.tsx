import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, MessageCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WelcomeStep } from './steps/WelcomeStep';
import { ClientInfoStep } from './steps/ClientInfoStep';
import { CustodianSelectionStep } from './steps/CustodianSelectionStep';
import { DocumentUploadStep } from './steps/DocumentUploadStep';
import { DigitalApplicationStep } from './steps/DigitalApplicationStep';
import { TaskListStep } from './steps/TaskListStep';
import { ComplianceStep } from './steps/ComplianceStep';
import { ConfirmationStep } from './steps/ConfirmationStep';
import { AIAssistant } from './AIAssistant';
import { OnboardingState, OnboardingStepData, WhiteLabelConfig, ReferralInfo, OnboardingStepConfig } from '@/types/onboarding';
import { useTenantBranding } from '@/hooks/useTenantBranding';

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

  const [data, setData] = useState<OnboardingStepData>(initialData);

  // Dynamic step configuration based on white-label settings
  const defaultSteps = [
    { id: 'welcome', name: 'Welcome', title: 'Welcome', enabled: true, required: true, order: 0 },
    { id: 'client-info', name: 'Client Information', title: 'Client Information', enabled: true, required: true, order: 1 },
    { id: 'custodian', name: 'Custodian Selection', title: 'Custodian Selection', enabled: effectiveBrandConfig.features.multiCustodian, required: true, order: 2 },
    { id: 'documents', name: 'Document Upload', title: 'Document Upload', enabled: effectiveBrandConfig.features.documentOcr, required: true, order: 3 },
    { id: 'application', name: 'Digital Application', title: 'Digital Application', enabled: effectiveBrandConfig.features.digitalSignature, required: true, order: 4 },
    { id: 'tasks', name: 'Task Management', title: 'Task Management', enabled: true, required: false, order: 5 },
    { id: 'compliance', name: 'Compliance Review', title: 'Compliance Review', enabled: true, required: true, order: 6 },
    { id: 'confirmation', name: 'Confirmation', title: 'Confirmation', enabled: true, required: true, order: 7 }
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

  const handleComplete = (stepData: Partial<OnboardingStepData>) => {
    const updatedData = { ...data, ...stepData };
    setData(updatedData);

    if (currentStep < stepTitles.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const finalState: OnboardingState = {
        ...updatedData,
        currentStep: currentStep + 1,
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

  const renderCurrentStep = () => {
    const commonProps = {
      data,
      onComplete: handleComplete,
      onNext: () => setCurrentStep(Math.min(currentStep + 1, stepTitles.length - 1)),
      onPrevious: () => setCurrentStep(Math.max(currentStep - 1, 0)),
      isLoading,
      whiteLabelConfig: effectiveBrandConfig,
      referralInfo,
    };

    const activeStep = activeSteps[currentStep];
    if (!activeStep) return null;

    switch (activeStep.id) {
      case 'welcome':
        return <WelcomeStep {...commonProps} />;
      case 'client-info':
        return <ClientInfoStep {...commonProps} />;
      case 'custodian':
        return <CustodianSelectionStep {...commonProps} />;
      case 'documents':
        return <DocumentUploadStep {...commonProps} />;
      case 'application':
        return <DigitalApplicationStep {...commonProps} />;
      case 'tasks':
        return <TaskListStep {...commonProps} />;
      case 'compliance':
        return <ComplianceStep {...commonProps} />;
      case 'confirmation':
        return <ConfirmationStep {...commonProps} />;
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  Step {currentStep + 1} of {stepTitles.length}: {stepTitles[currentStep]}
                </span>
                {effectiveBrandConfig.features.aiAssistant && (
                  <Sparkles className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="flex flex-col md:items-end text-xs md:text-sm text-muted-foreground">
                <span>{Math.round(progressPercentage)}% Complete</span>
                <span className="text-xs">{estimatedCompletion}</span>
              </div>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-3"
              indicatorClassName="bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
            />
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
              onClick={() => setCurrentStep(Math.max(currentStep - 1, 0))}
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
              onClick={() => setCurrentStep(Math.min(currentStep + 1, stepTitles.length - 1))}
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