import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useEntitlements } from '@/context/EntitlementsContext';
import { usePersonalizationStore } from '@/features/personalization/store';
import { analytics } from '@/lib/analytics';
import { useToast } from '@/hooks/use-toast';
import { 
  OnboardingWizardSession,
  RDSReceipt,
  initializeWizardSession,
  createOnboardRDSReceipt,
  createDecisionRDSReceipt,
  createVaultRDSReceipt,
  createConsentRDSReceipt,
  computeComplexityTier
} from '@/types/onboarding-wizard';

// Step Components
import { WizardPersonaStep } from './wizard-steps/WizardPersonaStep';
import { WizardHouseholdStep } from './wizard-steps/WizardHouseholdStep';
import { WizardGoalStep } from './wizard-steps/WizardGoalStep';
import { WizardConnectStep } from './wizard-steps/WizardConnectStep';
import { WizardCalculatorStep } from './wizard-steps/WizardCalculatorStep';
import { WizardProfessionalStep } from './wizard-steps/WizardProfessionalStep';

import { Clock, CheckCircle, AlertCircle, Crown } from 'lucide-react';

interface OnboardingWizardProps {
  onComplete?: (session: OnboardingWizardSession) => void;
  initialPersona?: 'aspiring' | 'retiree';
}

export function OnboardingWizard({ onComplete, initialPersona }: OnboardingWizardProps) {
  const navigate = useNavigate();
  const { has, plan } = useEntitlements();
  const { setPersona, updateFacts } = usePersonalizationStore();
  const { toast } = useToast();
  
  const [session, setSession] = useState<OnboardingWizardSession>(() => {
    // Try to restore from localStorage
    const stored = localStorage.getItem('onboarding_wizard_session');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.id && !parsed.completed_at) {
          return parsed;
        }
      } catch (e) {
        console.warn('Failed to restore onboarding session:', e);
      }
    }
    return initializeWizardSession(initialPersona || 'aspiring');
  });

  const [currentStepStartTime, setCurrentStepStartTime] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Save session to localStorage
  useEffect(() => {
    localStorage.setItem('onboarding_wizard_session', JSON.stringify(session));
  }, [session]);

  // Track session time
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const sessionStart = new Date(session.started_at);
      const elapsedSeconds = Math.floor((now.getTime() - sessionStart.getTime()) / 1000);
      
      setSession(prev => ({
        ...prev,
        actual_time_seconds: elapsedSeconds,
        met_target: elapsedSeconds <= prev.target_time_seconds
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [session.started_at, session.target_time_seconds]);

  const addReceipt = useCallback((receipt: RDSReceipt) => {
    setSession(prev => ({
      ...prev,
      receipts: [...prev.receipts, receipt]
    }));

    // Log receipt for debugging
    console.log('Receipt generated:', receipt);
    
    analytics.track('onboarding.receipt_generated', {
      receipt_type: receipt.type,
      step: session.current_step,
      persona: session.persona
    });
  }, [session.current_step, session.persona]);

  const nextStep = useCallback(() => {
    setSession(prev => {
      const nextStep = Math.min(prev.current_step + 1, prev.total_steps);
      
      if (nextStep > prev.total_steps) {
        // Complete onboarding
        const completedSession = {
          ...prev,
          completed_at: new Date().toISOString()
        };
        
        localStorage.removeItem('onboarding_wizard_session');
        
        analytics.track('onboarding.completed', {
          persona: prev.persona,
          tier: prev.complexity_tier,
          total_time: prev.actual_time_seconds,
          met_target: prev.met_target,
          receipts_count: prev.receipts.length
        });

        onComplete?.(completedSession);
        navigate('/dashboard');
        
        return completedSession;
      }
      
      setCurrentStepStartTime(new Date());
      return { ...prev, current_step: nextStep };
    });
  }, [onComplete, navigate]);

  // Step 1: Persona Selection
  const handlePersonaSelect = useCallback((persona: 'aspiring' | 'retiree') => {
    setPersona(persona);
    
    const receipt = createOnboardRDSReceipt('persona', session.id, { persona });
    addReceipt(receipt);
    
    setSession(prev => ({ ...prev, persona }));
    nextStep();
  }, [session.id, addReceipt, nextStep, setPersona]);

  // Step 2: Household Facts
  const handleHouseholdComplete = useCallback((facts: any) => {
    const tier = computeComplexityTier(facts);
    const reasons = [];
    
    if (facts.owns_business) reasons.push('business_owner');
    if (facts.owns_multiple_properties) reasons.push('multiple_properties');
    if (facts.receives_k1) reasons.push('partnership_income');
    if (facts.has_private_investments) reasons.push('alternative_investments');

    // Show Family Office mode toast if advanced
    if (tier === 'advanced') {
      toast({
        title: "Family Office mode unlocked",
        description: "Advanced tools and features are now available",
        duration: 4000,
      });
    }

    const receipt = createOnboardRDSReceipt('facts', session.id, { tier, reasons });
    addReceipt(receipt);

    updateFacts({
      entitiesCount: facts.owns_business ? 1 : 0,
      propertiesCount: facts.owns_multiple_properties ? 2 : 1,
      k1Count: facts.receives_k1 ? 1 : 0,
      hasAltsOrPrivate: facts.has_private_investments
    });

    setSession(prev => ({
      ...prev,
      complexity_tier: tier,
      wizard_state: { ...prev.wizard_state, household_facts: facts }
    }));
    
    nextStep();
  }, [session.id, addReceipt, nextStep, updateFacts, toast]);

  // Step 3: Goal Creation
  const handleGoalCreate = useCallback((goalData: any) => {
    const receipt = createDecisionRDSReceipt(
      'create_goal',
      session.id,
      session.persona,
      session.complexity_tier,
      { goal_key: goalData.goal_key, reasons: ['onboarding_flow'] }
    );
    addReceipt(receipt);
    
    toast(
      <div className="flex items-center gap-2">
        <span><strong>Receipt recorded</strong> - Goal creation recorded</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => window.location.href = '/receipts'}
          className="h-auto p-1 text-xs"
        >
          View in Receipts
        </Button>
      </div>
    );

    setSession(prev => ({
      ...prev,
      wizard_state: { ...prev.wizard_state, top_goal: goalData }
    }));

    nextStep();
  }, [session.id, session.persona, session.complexity_tier, addReceipt, nextStep]);

  // Step 4: Data Connection
  const handleDataConnect = useCallback((connectionData: any) => {
    if (connectionData.type === 'plaid' || connectionData.type === 'upload') {
      const hash = `sha256_${Math.random().toString(36).substr(2, 16)}`;
      const receipt = createVaultRDSReceipt(connectionData.type, session.id, hash);
      addReceipt(receipt);
    }

    setSession(prev => ({
      ...prev,
      wizard_state: { ...prev.wizard_state, data_connection: connectionData }
    }));

    nextStep();
  }, [session.id, addReceipt, nextStep]);

  // Step 5: Calculator
  const handleCalculatorComplete = useCallback((calcData: any) => {
    const receipt = createDecisionRDSReceipt(
      'run_calc',
      session.id,
      session.persona,
      session.complexity_tier,
      { 
        calc_key: calcData.calc_key,
        inputs_hash: `sha256_${Math.random().toString(36).substr(2, 16)}`,
        reasons: ['onboarding_calculation']
      }
    );
    addReceipt(receipt);

    setSession(prev => ({
      ...prev,
      wizard_state: { ...prev.wizard_state, calculation_result: calcData }
    }));

    nextStep();
  }, [session.id, session.persona, session.complexity_tier, addReceipt, nextStep]);

  // Step 6: Professional Invite
  const handleProfessionalInvite = useCallback((inviteData: any) => {
    if (inviteData.type !== 'skip') {
      const receipt = createConsentRDSReceipt(
        inviteData.scope,
        'professional_collaboration',
        inviteData.ttl_days,
        session.id,
        'approve'
      );
      addReceipt(receipt);
    }

    setSession(prev => ({
      ...prev,
      wizard_state: { ...prev.wizard_state, professional_invite: inviteData }
    }));

    nextStep();
  }, [session.id, addReceipt, nextStep]);

  const renderCurrentStep = () => {
    switch (session.current_step) {
      case 1:
        return <WizardPersonaStep onSelect={handlePersonaSelect} currentPersona={session.persona} />;
      case 2:
        return <WizardHouseholdStep onComplete={handleHouseholdComplete} />;
      case 3:
        return <WizardGoalStep onComplete={handleGoalCreate} persona={session.persona} />;
      case 4:
        return <WizardConnectStep onComplete={handleDataConnect} hasFeature={has('doc_vault')} />;
      case 5:
        return <WizardCalculatorStep onComplete={handleCalculatorComplete} persona={session.persona} />;
      case 6:
        return <WizardProfessionalStep onComplete={handleProfessionalInvite} hasFeature={has('advanced_analytics')} />;
      default:
        return null;
    }
  };

  const remainingTime = session.target_time_seconds - (session.actual_time_seconds || 0);
  const timeDisplay = remainingTime > 0 
    ? `${Math.floor(remainingTime / 60)}:${String(remainingTime % 60).padStart(2, '0')}`
    : 'Over time';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Who are we planning for today?</h1>
              <p className="text-muted-foreground">Complete setup in under 2 minutes</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className={`text-sm font-medium ${
                session.met_target ? 'text-success' : remainingTime <= 30 ? 'text-destructive' : 'text-muted-foreground'
              }`}>
                {timeDisplay}
              </span>
              {session.met_target && <CheckCircle className="h-4 w-4 text-success" />}
            </div>
          </div>

          {/* Progress Pills */}
          <div className="flex items-center gap-2 mb-4">
            {Array.from({ length: session.total_steps }, (_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  i + 1 < session.current_step ? 'bg-success' :
                  i + 1 === session.current_step ? 'bg-primary' :
                  'bg-muted'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Step {session.current_step} of {session.total_steps}</span>
            <span>{session.receipts.length} receipts generated</span>
          </div>

          {/* Status Badges */}
          <div className="mt-4 flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {plan} Plan
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {session.persona} Persona
            </Badge>
            {session.complexity_tier === 'advanced' && (
              <Badge variant="default" className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                <Crown className="h-3 w-3 mr-1" />
                Family Office
              </Badge>
            )}
          </div>
        </div>

        {/* Current Step */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {renderCurrentStep()}
          </CardContent>
        </Card>

        {/* Debug Info (development only) */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="border-dashed opacity-75">
            <CardHeader>
              <CardTitle className="text-sm">Debug Info</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs text-muted-foreground overflow-auto max-h-32">
                {JSON.stringify({ 
                  session_id: session.id,
                  step: session.current_step,
                  receipts: session.receipts.length,
                  tier: session.complexity_tier,
                  time_status: session.met_target ? 'ON_TARGET' : 'OVER'
                }, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}