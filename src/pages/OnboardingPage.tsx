import React, { useState, useEffect, Suspense, useReducer } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useOnboardingProgress } from '@/hooks/useOnboardingProgress';
import { usePersonaContext } from '@/hooks/usePersonaContext';
import { OnboardingProgress } from '@/components/OnboardingProgress';
import { getPersonaCopy } from '@/config/personaCopy';
import { analytics } from '@/lib/analytics';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';

// Lazy load step components for performance
const EmailVerify = React.lazy(() => import('./onboarding/steps/EmailVerify').then(m => ({ default: m.EmailVerify })));
const Profile = React.lazy(() => import('./onboarding/steps/Profile').then(m => ({ default: m.Profile })));
const Household = React.lazy(() => import('./onboarding/steps/Household').then(m => ({ default: m.Household })));
const LinkAccounts = React.lazy(() => import('./onboarding/steps/LinkAccounts').then(m => ({ default: m.LinkAccounts })));
const UploadDoc = React.lazy(() => import('./onboarding/steps/UploadDoc').then(m => ({ default: m.UploadDoc })));
const Goals = React.lazy(() => import('./onboarding/steps/Goals').then(m => ({ default: m.Goals })));
const InvitePro = React.lazy(() => import('./onboarding/steps/InvitePro').then(m => ({ default: m.InvitePro })));

interface OnboardingState {
  currentStep: number;
  stepData: Record<string, any>;
  isComplete: boolean;
}

interface OnboardingAction {
  type: 'SET_STEP' | 'UPDATE_STEP_DATA' | 'COMPLETE';
  payload?: any;
}

const initialState: OnboardingState = {
  currentStep: 1,
  stepData: {},
  isComplete: false
};

function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'UPDATE_STEP_DATA':
      return {
        ...state,
        stepData: { ...state.stepData, ...action.payload }
      };
    case 'COMPLETE':
      return { ...state, isComplete: true };
    default:
      return state;
  }
}

const STEPS = [
  'Email Verify',
  'Profile', 
  'Household',
  'Link Accounts',
  'Upload Docs',
  'Goals',
  'Invite Pro'
];

const SEGMENT_OPTIONS = [
  { value: 'retirees', label: 'Retirees', description: 'Planning for or enjoying retirement' },
  { value: 'aspiring', label: 'Aspiring Wealthy', description: 'Building wealth systematically' },
  { value: 'hnw', label: 'High-Net-Worth', description: 'Advanced wealth strategies' },
  { value: 'uhnw', label: 'Ultra-High-Net-Worth', description: 'Complex family office needs' }
];

interface SegmentChooserProps {
  onSelect: (segment: string) => void;
}

const SegmentChooser: React.FC<SegmentChooserProps> = ({ onSelect }) => {
  const [selectedSegment, setSelectedSegment] = useState('');

  const handleSelect = () => {
    if (selectedSegment) {
      onSelect(selectedSegment);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Choose Your Family Type</CardTitle>
        <CardDescription>
          We'll personalize your onboarding experience based on your family's wealth stage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3">
          {SEGMENT_OPTIONS.map((option) => (
            <Card 
              key={option.value}
              className={`p-4 cursor-pointer transition-all ${
                selectedSegment === option.value 
                  ? 'border-primary bg-primary/5' 
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedSegment(option.value)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{option.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </div>
                {selectedSegment === option.value && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </div>
            </Card>
          ))}
        </div>
        
        <Button 
          onClick={handleSelect}
          disabled={!selectedSegment}
          className="w-full"
        >
          Continue with {selectedSegment ? SEGMENT_OPTIONS.find(s => s.value === selectedSegment)?.label : 'Selection'}
        </Button>
      </CardContent>
    </Card>
  );
};

export const OnboardingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { progress, saveProgress, markCompleted } = useOnboardingProgress();
  const { updatePersonaContext } = usePersonaContext();

  const [state, dispatch] = useReducer(onboardingReducer, initialState);
  const [persona, setPersona] = useState<string>('');
  const [segment, setSegment] = useState<string>('');
  const [showSegmentChooser, setShowSegmentChooser] = useState(false);
  const [needsTable, setNeedsTable] = useState(false);

  // Initialize from URL params or show chooser
  useEffect(() => {
    const personaParam = searchParams.get('persona');
    const segmentParam = searchParams.get('segment');

    if (personaParam === 'family' && segmentParam && SEGMENT_OPTIONS.some(s => s.value === segmentParam)) {
      setPersona('family');
      setSegment(segmentParam);
      
      // Track onboarding start
      analytics.trackEvent('onboarding.started', {
        persona: 'family',
        segment: segmentParam,
        source: 'direct_link'
      });
    } else if (personaParam === 'family') {
      setPersona('family');
      setShowSegmentChooser(true);
    } else {
      // Default to family + chooser if no valid params
      setPersona('family');
      setShowSegmentChooser(true);
    }
  }, [searchParams]);

  // Load existing progress
  useEffect(() => {
    if (progress && segment) {
      dispatch({ type: 'SET_STEP', payload: progress.currentStep });
      dispatch({ type: 'UPDATE_STEP_DATA', payload: progress.stepData });
    }
  }, [progress, segment]);

  // Test if table exists (mock check)
  useEffect(() => {
    const checkTable = async () => {
      try {
        // In real app, this would query the table
        // For now, assume it exists
        setNeedsTable(false);
      } catch (error) {
        setNeedsTable(true);
      }
    };
    
    if (user) {
      checkTable();
    }
  }, [user]);

  const handleSegmentSelect = (selectedSegment: string) => {
    setSegment(selectedSegment);
    setShowSegmentChooser(false);
    
    // Update persona context
    updatePersonaContext('family', {
      id: 'family',
      title: 'Family',
      description: getPersonaCopy('family', selectedSegment).hero,
      ctaText: 'Get Started',
      route: '/onboarding'
    });

    // Track segment selection
    analytics.trackEvent('onboarding.started', {
      persona: 'family',
      segment: selectedSegment,
      source: 'segment_chooser'
    });

    // Update URL
    const newParams = new URLSearchParams(searchParams);
    newParams.set('persona', 'family');
    newParams.set('segment', selectedSegment);
    navigate(`/onboarding?${newParams.toString()}`, { replace: true });
  };

  const handleStepComplete = async (stepData: any) => {
    const stepName = STEPS[state.currentStep - 1].toLowerCase().replace(' ', '_');
    
    // Update local state
    dispatch({ 
      type: 'UPDATE_STEP_DATA', 
      payload: { [stepName]: stepData }
    });

    // Save progress to database
    const newStepData = { ...state.stepData, [stepName]: stepData };
    await saveProgress(state.currentStep, STEPS.length, newStepData);

    // Track step completion
    analytics.trackEvent('onboarding.step_completed', {
      step: stepName,
      persona,
      segment,
      step_number: state.currentStep
    });

    // Move to next step or complete
    if (state.currentStep < STEPS.length) {
      dispatch({ type: 'SET_STEP', payload: state.currentStep + 1 });
      
      // Track next step start
      analytics.trackEvent('onboarding.step_started', {
        step: STEPS[state.currentStep].toLowerCase().replace(' ', '_'),
        persona,
        segment,
        step_number: state.currentStep + 1
      });
    } else {
      // Complete onboarding
      await markCompleted();
      dispatch({ type: 'COMPLETE' });
      
      // Track completion
      analytics.trackEvent('onboarding.completed', {
        persona,
        segment,
        total_steps: STEPS.length,
        completion_time: Date.now()
      });

      // Navigate to dashboard
      navigate('/client-portal');
    }
  };

  // Show table setup banner if needed
  if (needsTable) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Database table <code>user_onboarding_progress</code> is missing. 
            Please run the SQL pack to set up the required tables.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show segment chooser if needed
  if (showSegmentChooser) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <SegmentChooser onSelect={handleSegmentSelect} />
        </div>
      </div>
    );
  }

  // Show onboarding complete state
  if (state.isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Welcome to Your Family Office!</CardTitle>
            <CardDescription>
              Your onboarding is complete. Redirecting to your dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!segment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const personaCopy = getPersonaCopy(persona, segment);

  const renderCurrentStep = () => {
    const stepProps = {
      onComplete: handleStepComplete,
      persona,
      segment,
      initialData: state.stepData[STEPS[state.currentStep - 1].toLowerCase().replace(' ', '_')]
    };

    switch (state.currentStep) {
      case 1: return <EmailVerify {...stepProps} />;
      case 2: return <Profile {...stepProps} />;
      case 3: return <Household {...stepProps} />;
      case 4: return <LinkAccounts {...stepProps} />;
      case 5: return <UploadDoc {...stepProps} />;
      case 6: return <Goals {...stepProps} />;
      case 7: return <InvitePro {...stepProps} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary">{persona} • {segment}</Badge>
          </div>
          <h1 className="text-3xl font-bold">{personaCopy.hero}</h1>
          <ul className="text-muted-foreground space-y-1 max-w-md mx-auto">
            {personaCopy.bullets.map((bullet, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        {/* Progress */}
        <OnboardingProgress
          currentStep={state.currentStep}
          totalSteps={STEPS.length}
          steps={STEPS}
          className="max-w-4xl mx-auto"
        />

        {/* Current Step */}
        <Suspense 
          fallback={
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          }
        >
          {renderCurrentStep()}
        </Suspense>
      </div>
    </div>
  );
};

export default OnboardingPage;