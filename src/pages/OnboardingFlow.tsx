import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, ArrowLeft, CheckCircle2, Users, Building2 } from 'lucide-react';
import personaConfig from '@/config/personaConfig.json';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
}

// Family Onboarding Steps
const FamilySegmentStep: React.FC<{ onNext: (data: any) => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const [selectedSegment, setSelectedSegment] = useState<string>('');

  const familySegments = personaConfig.filter(p => p.persona === 'families');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Which describes your family best?</h2>
        <p className="text-muted-foreground">
          We'll customize your workspace based on your financial stage.
        </p>
      </div>

      <div className="grid gap-4">
        {familySegments.map((segment) => (
          <Card 
            key={segment.segment}
            className={`cursor-pointer transition-all ${
              selectedSegment === segment.segment 
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => setSelectedSegment(segment.segment || '')}
          >
            <CardHeader>
              <CardTitle className="text-lg">{segment.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{segment.benefit}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={() => onNext({ segment: selectedSegment })}
          disabled={!selectedSegment}
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const FamilyProfileStep: React.FC<{ onNext: (data: any) => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    householdSize: ''
  });

  const handleSubmit = () => {
    onNext(profile);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Let's set up your profile</h2>
        <p className="text-muted-foreground">
          Basic information to personalize your experience.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              value={profile.firstName}
              onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
              placeholder="John"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              value={profile.lastName}
              onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
              placeholder="Smith"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
            placeholder="john@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="householdSize">Household size</Label>
          <Select onValueChange={(value) => setProfile(prev => ({ ...prev, householdSize: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select household size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Just me</SelectItem>
              <SelectItem value="2">2 people</SelectItem>
              <SelectItem value="3">3 people</SelectItem>
              <SelectItem value="4">4 people</SelectItem>
              <SelectItem value="5+">5+ people</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!profile.firstName || !profile.lastName || !profile.email}
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const FamilyGoalsStep: React.FC<{ onNext: (data: any) => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const [goals, setGoals] = useState<string[]>([]);

  const goalOptions = [
    'Organize financial accounts',
    'Plan for retirement',
    'Coordinate with advisors',
    'Estate planning',
    'Tax optimization',
    'Investment management',
    'Healthcare coordination',
    'Education funding',
    'Emergency planning'
  ];

  const toggleGoal = (goal: string) => {
    setGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">What are your main goals?</h2>
        <p className="text-muted-foreground">
          Select all that apply. We'll prioritize these in your workspace.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {goalOptions.map((goal) => (
          <div 
            key={goal}
            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              goals.includes(goal) 
                ? 'bg-primary/5 border-primary' 
                : 'border-border hover:border-primary/50'
            }`}
            onClick={() => toggleGoal(goal)}
          >
            <Checkbox 
              checked={goals.includes(goal)}
              onChange={() => toggleGoal(goal)}
            />
            <span className="text-sm">{goal}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={() => onNext({ goals })}
          disabled={goals.length === 0}
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const FamilyReadyStep: React.FC<{ onNext: (data: any) => void; onBack: () => void; data: any }> = ({ onNext, onBack, data }) => {
  const navigate = useNavigate();

  const handleFinish = () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('onboarding.complete', {
        persona: 'families',
        segment: data.segment,
        goals: data.goals
      });
    }

    // Navigate to family dashboard
    navigate('/families');
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="space-y-4">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-bold">You're all set!</h2>
        <p className="text-muted-foreground">
          Your family workspace is ready. Let's start organizing your financial life.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Your setup:</h3>
          <div className="space-y-2 text-sm text-left">
            <div>• Segment: <Badge variant="secondary">{data.segment}</Badge></div>
            <div>• Goals: {data.goals?.length || 0} selected</div>
            <div>• Workspace: Ready</div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Enter workspace
        </Button>
      </div>
    </div>
  );
};

// Professional Onboarding Steps
const ProfessionalBasicsStep: React.FC<{ onNext: (data: any) => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const [basics, setBasics] = useState({
    firmName: '',
    title: '',
    website: '',
    description: ''
  });

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Tell us about your practice</h2>
        <p className="text-muted-foreground">
          Basic information to set up your professional workspace.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="firmName">Firm name</Label>
          <Input
            id="firmName"
            value={basics.firmName}
            onChange={(e) => setBasics(prev => ({ ...prev, firmName: e.target.value }))}
            placeholder="ABC Financial Services"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Your title</Label>
          <Input
            id="title"
            value={basics.title}
            onChange={(e) => setBasics(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Financial Advisor"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website (optional)</Label>
          <Input
            id="website"
            value={basics.website}
            onChange={(e) => setBasics(prev => ({ ...prev, website: e.target.value }))}
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Brief description</Label>
          <Textarea
            id="description"
            value={basics.description}
            onChange={(e) => setBasics(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Tell clients about your practice..."
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={() => onNext(basics)}
          disabled={!basics.firmName || !basics.title}
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const ProfessionalReadyStep: React.FC<{ onNext: (data: any) => void; onBack: () => void; data: any }> = ({ onNext, onBack, data }) => {
  const navigate = useNavigate();

  const handleFinish = () => {
    // Analytics
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.track('onboarding.complete', {
        persona: data.persona,
        firmName: data.firmName
      });
    }

    // Navigate to professional dashboard
    navigate(`/pros/${data.persona}`);
  };

  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="space-y-4">
        <Building2 className="h-16 w-16 text-blue-500 mx-auto" />
        <h2 className="text-2xl font-bold">Welcome to your practice platform!</h2>
        <p className="text-muted-foreground">
          Your professional workspace is ready. Start managing your practice more efficiently.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">Your practice:</h3>
          <div className="space-y-2 text-sm text-left">
            <div>• Firm: {data.firmName}</div>
            <div>• Role: {data.title}</div>
            <div>• Type: <Badge variant="secondary">{data.persona}</Badge></div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleFinish} className="bg-blue-600 hover:bg-blue-700">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Enter workspace
        </Button>
      </div>
    </div>
  );
};

export const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<any>({});
  
  // Get persona from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const persona = urlParams.get('persona') || 'families';
  const segment = urlParams.get('segment');

  // Set initial data
  React.useEffect(() => {
    setOnboardingData({ persona, segment });
  }, [persona, segment]);

  // Define onboarding steps based on persona
  const getSteps = (): OnboardingStep[] => {
    if (persona === 'families') {
      return [
        { id: 'segment', title: 'Choose Segment', description: 'Family type', component: FamilySegmentStep },
        { id: 'profile', title: 'Profile', description: 'Basic info', component: FamilyProfileStep },
        { id: 'goals', title: 'Goals', description: 'Priorities', component: FamilyGoalsStep },
        { id: 'ready', title: 'Ready', description: 'Complete', component: FamilyReadyStep }
      ];
    } else {
      return [
        { id: 'basics', title: 'Practice Basics', description: 'Firm info', component: ProfessionalBasicsStep },
        { id: 'ready', title: 'Ready', description: 'Complete', component: ProfessionalReadyStep }
      ];
    }
  };

  const steps = getSteps();
  const currentStepData = steps[currentStep];

  const handleNext = (stepData: any) => {
    const newData = { ...onboardingData, ...stepData };
    setOnboardingData(newData);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/discover');
    }
  };

  const StepComponent = currentStepData.component;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/discover')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Discover
              </Button>
              <div>
                <h1 className="text-lg font-semibold">Setup your workspace</h1>
                <p className="text-sm text-muted-foreground">
                  Step {currentStep + 1} of {steps.length}: {currentStepData.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="container mx-auto px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div 
                key={step.id}
                className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold
                  ${index <= currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}>
                  {index + 1}
                </div>
                <div className="ml-2">
                  <div className="text-xs font-medium">{step.title}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-4 ${
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-8">
        <StepComponent 
          onNext={handleNext}
          onBack={handleBack}
          data={onboardingData}
        />
      </main>
    </div>
  );
};