import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useEntitlements } from '@/context/EntitlementsContext';
import { usePersonalizationStore } from '@/features/personalization/store';
import { analytics } from '@/lib/analytics';
import { 
  OnboardingSession, 
  OnboardingReceipt, 
  initializeOnboardingSession,
  createOnboardingReceipt,
  calculateTTFVMetrics
} from '@/types/onboarding-receipts';
import { PersonaSelection } from './steps/PersonaSelection';
import { QuickGoalSetup } from './steps/QuickGoalSetup';
import { AccountConnection } from './steps/AccountConnection';
import { FirstCalculation } from './steps/FirstCalculation';
import { ProfessionalInvite } from './steps/ProfessionalInvite';
import { Clock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface FamilyOnboardingV2Props {
  onComplete?: (session: OnboardingSession) => void;
  initialPersona?: 'aspiring' | 'retiree';
}

export function FamilyOnboardingV2({ onComplete, initialPersona }: FamilyOnboardingV2Props) {
  const navigate = useNavigate();
  const { has, plan } = useEntitlements();
  const { setPersona, updateFacts } = usePersonalizationStore();
  
  const [session, setSession] = useState<OnboardingSession>(() => 
    initializeOnboardingSession(initialPersona || 'aspiring')
  );
  const [currentStepStartTime, setCurrentStepStartTime] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Track cumulative time and TTFV progress
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const sessionStart = new Date(session.started_at);
      const elapsedSeconds = Math.floor((now.getTime() - sessionStart.getTime()) / 1000);
      
      setSession(prev => ({
        ...prev,
        ttfv_actual_seconds: elapsedSeconds,
        ttfv_achieved: elapsedSeconds <= prev.ttfv_target_seconds
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [session.started_at, session.ttfv_target_seconds]);

  const completeStep = useCallback(async (
    type: OnboardingReceipt['type'],
    data: OnboardingReceipt['data']
  ) => {
    setIsLoading(true);
    
    try {
      // Calculate TTFV metrics for this step
      const ttfvMetrics = calculateTTFVMetrics(currentStepStartTime, 120); // 2 min per step
      
      // Create receipt
      const receipt = createOnboardingReceipt(type, data, session.id, ttfvMetrics);
      
      // Update session
      const updatedSession: OnboardingSession = {
        ...session,
        current_step: Math.min(session.current_step + 1, session.total_steps),
        receipts: [...session.receipts, receipt],
        completion_rate: Math.min(((session.current_step) / session.total_steps) * 100, 100)
      };

      // Track analytics
      analytics.track('onboarding.step_completed', {
        step_type: type,
        persona: session.persona,
        duration_seconds: ttfvMetrics.duration_seconds,
        met_target: ttfvMetrics.met_target,
        cumulative_time: updatedSession.ttfv_actual_seconds,
        completion_rate: updatedSession.completion_rate
      });

      setSession(updatedSession);
      
      // Reset step timer
      setCurrentStepStartTime(new Date());

      // Check if onboarding is complete
      if (updatedSession.current_step >= updatedSession.total_steps) {
        const completedSession = {
          ...updatedSession,
          completed_at: new Date().toISOString(),
          completion_rate: 100
        };
        
        analytics.track('onboarding.completed', {
          persona: session.persona,
          total_time_seconds: completedSession.ttfv_actual_seconds,
          ttfv_achieved: completedSession.ttfv_achieved,
          receipts_generated: completedSession.receipts.length
        });

        onComplete?.(completedSession);
        
        // Navigate to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Step completion error:', error);
      // Show error and provide next best action
      setSession(prev => ({
        ...prev,
        next_best_action: {
          type: 'support',
          description: 'Get help with your onboarding',
          route: '/help?topic=onboarding'
        }
      }));
    } finally {
      setIsLoading(false);
    }
  }, [currentStepStartTime, session, onComplete, navigate]);

  const handlePersonaSelect = useCallback((persona: 'aspiring' | 'retiree') => {
    setPersona(persona);
    setSession(prev => ({ ...prev, persona }));
    
    completeStep('persona_select', {
      persona,
      complexity_tier: 'foundational' // Will be computed based on facts later
    });
  }, [setPersona, completeStep]);

  const handleGoalCreate = useCallback((goalData: any) => {
    completeStep('goal_create', {
      goal_details: goalData
    });
  }, [completeStep]);

  const handleAccountConnect = useCallback((accountData: any) => {
    completeStep('account_connect', {
      account_info: accountData
    });
  }, [completeStep]);

  const handleCalculation = useCallback((calculationData: any) => {
    completeStep('first_calculation', {
      calculation_result: calculationData
    });
  }, [completeStep]);

  const handleProfessionalInvite = useCallback((inviteData: any) => {
    completeStep('invite_consent', {
      invite_details: inviteData
    });
  }, [completeStep]);

  const handleFeatureGating = useCallback(() => {
    navigate('/pricing?source=onboarding');
  }, [navigate]);

  const getNextBestAction = useCallback(() => {
    if (session.next_best_action) return session.next_best_action;
    
    // Default next best actions based on current step
    const actions = {
      1: { type: 'resume' as const, description: 'Choose your financial stage', route: '#persona' },
      2: { type: 'resume' as const, description: 'Set your first goal', route: '#goals' },
      3: { type: 'alternative' as const, description: 'Skip account linking for now', route: '#calculation' },
      4: { type: 'resume' as const, description: 'Try our calculator', route: '#calculation' },
      5: { type: 'alternative' as const, description: 'Explore on your own', route: '/dashboard' }
    };
    
    return actions[session.current_step as keyof typeof actions] || actions[5];
  }, [session]);

  const renderCurrentStep = () => {
    switch (session.current_step) {
      case 1:
        return (
          <PersonaSelection 
            onSelect={handlePersonaSelect}
            currentPersona={session.persona}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <QuickGoalSetup 
            onGoalCreate={handleGoalCreate}
            persona={session.persona}
            isLoading={isLoading}
            onFeatureGating={handleFeatureGating}
          />
        );
      case 3:
        return (
          <AccountConnection 
            onConnect={handleAccountConnect}
            onSkip={() => handleAccountConnect({ skipped: true })}
            isLoading={isLoading}
            hasFeature={has('plaid_integration')}
            onFeatureGating={handleFeatureGating}
          />
        );
      case 4:
        return (
          <FirstCalculation 
            onCalculate={handleCalculation}
            persona={session.persona}
            isLoading={isLoading}
          />
        );
      case 5:
        return (
          <ProfessionalInvite 
            onInvite={handleProfessionalInvite}
            onSkip={() => handleProfessionalInvite({ skipped: true })}
            isLoading={isLoading}
            hasFeature={has('premium_support')}
            onFeatureGating={handleFeatureGating}
          />
        );
      default:
        return null;
    }
  };

  const remainingTime = session.ttfv_target_seconds - (session.ttfv_actual_seconds || 0);
  const timeDisplay = remainingTime > 0 
    ? `${Math.floor(remainingTime / 60)}:${String(remainingTime % 60).padStart(2, '0')} remaining`
    : 'Target time exceeded';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with TTFV Timer */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Family Financial Journey</h1>
              <p className="text-muted-foreground">Get to your personalized dashboard in under {session.ttfv_target_seconds / 60} minutes</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className={`text-sm font-medium ${
                session.ttfv_achieved ? 'text-success' : remainingTime <= 60 ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {timeDisplay}
              </span>
              {session.ttfv_achieved && <CheckCircle className="h-4 w-4 text-success" />}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Step {session.current_step} of {session.total_steps}</span>
              <span>{Math.round(session.completion_rate)}% complete</span>
            </div>
            <Progress value={session.completion_rate} className="h-2" />
          </div>

          {/* Plan Badge */}
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {plan} Plan
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {session.persona} Persona
            </Badge>
          </div>
        </div>

        {/* Current Step */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Next Best Action (shown when user might be stuck) */}
        {(session.ttfv_actual_seconds || 0) > 300 && session.current_step > 1 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertCircle className="h-4 w-4" />
                Need a different path?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-orange-700 text-sm mb-3">
                {getNextBestAction().description}
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (getNextBestAction().route.startsWith('#')) {
                    // Handle internal navigation
                    const targetStep = getNextBestAction().route === '#persona' ? 1 :
                                     getNextBestAction().route === '#goals' ? 2 :
                                     getNextBestAction().route === '#calculation' ? 4 : 5;
                    setSession(prev => ({ ...prev, current_step: targetStep }));
                  } else {
                    navigate(getNextBestAction().route);
                  }
                }}
                className="border-orange-300 text-orange-800 hover:bg-orange-100"
              >
                {getNextBestAction().description}
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Debug Info (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="mt-4 border-dashed">
            <CardHeader>
              <CardTitle className="text-sm">Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs text-muted-foreground overflow-auto">
                {JSON.stringify({ 
                  session_id: session.id,
                  receipts_count: session.receipts.length,
                  current_step: session.current_step,
                  ttfv_status: session.ttfv_achieved ? 'ON_TRACK' : 'BEHIND',
                  entitlements: plan
                }, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}