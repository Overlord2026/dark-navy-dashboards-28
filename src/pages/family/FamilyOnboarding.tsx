import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Users, 
  TrendingUp, 
  Shield, 
  Target, 
  Heart,
  Briefcase,
  GraduationCap,
  Home,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { analytics } from '@/lib/analytics';

interface FamilySegment {
  id: 'aspiring' | 'retirees';
  title: string;
  description: string;
  icon: React.ReactNode;
  goals: string[];
}

interface FamilyGoal {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  segment?: 'aspiring' | 'retirees' | 'both';
}

const familySegments: FamilySegment[] = [
  {
    id: 'aspiring',
    title: 'Aspiring Families',
    description: 'Building wealth and planning for the future',
    icon: <TrendingUp className="h-6 w-6" />,
    goals: ['wealth-building', 'education-planning', 'insurance-optimization', 'tax-efficiency']
  },
  {
    id: 'retirees',
    title: 'Retiree Families',
    description: 'Preserving wealth and optimizing retirement',
    icon: <Shield className="h-6 w-6" />,
    goals: ['income-optimization', 'healthcare-planning', 'estate-planning', 'legacy-preservation']
  }
];

const familyGoals: FamilyGoal[] = [
  {
    id: 'wealth-building',
    title: 'Wealth Building',
    description: 'Grow assets through strategic investing',
    icon: <TrendingUp className="h-5 w-5" />,
    segment: 'aspiring'
  },
  {
    id: 'education-planning',
    title: 'Education Planning',
    description: 'Fund children\'s education expenses',
    icon: <GraduationCap className="h-5 w-5" />,
    segment: 'aspiring'
  },
  {
    id: 'insurance-optimization',
    title: 'Insurance Optimization',
    description: 'Protect family with appropriate coverage',
    icon: <Shield className="h-5 w-5" />,
    segment: 'both'
  },
  {
    id: 'tax-efficiency',
    title: 'Tax Efficiency',
    description: 'Minimize tax burden through planning',
    icon: <Briefcase className="h-5 w-5" />,
    segment: 'both'
  },
  {
    id: 'income-optimization',
    title: 'Income Optimization',
    description: 'Maximize retirement income streams',
    icon: <Target className="h-5 w-5" />,
    segment: 'retirees'
  },
  {
    id: 'healthcare-planning',
    title: 'Healthcare Planning',
    description: 'Plan for medical expenses and care',
    icon: <Heart className="h-5 w-5" />,
    segment: 'retirees'
  },
  {
    id: 'estate-planning',
    title: 'Estate Planning',
    description: 'Structure wealth transfer efficiently',
    icon: <Home className="h-5 w-5" />,
    segment: 'retirees'
  },
  {
    id: 'legacy-preservation',
    title: 'Legacy Preservation',
    description: 'Preserve wealth for future generations',
    icon: <Users className="h-5 w-5" />,
    segment: 'retirees'
  }
];

export const FamilyOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSegment, setSelectedSegment] = useState<'aspiring' | 'retirees' | null>(null);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleSegmentSelect = (segment: 'aspiring' | 'retirees') => {
    setSelectedSegment(segment);
    // Pre-select recommended goals for segment
    const segmentGoals = familySegments.find(s => s.id === segment)?.goals || [];
    setSelectedGoals(segmentGoals);
    
    analytics.trackFamilySegmentSelection(segment);
    setCurrentStep(2);
  };

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleGoalsNext = () => {
    if (selectedGoals.length === 0) {
      toast.error('Please select at least one goal');
      return;
    }
    
    analytics.trackFamilyGoalsSelection('family_goals_selection', { goals: selectedGoals });
    setCurrentStep(3);
  };

  const handleComplete = async () => {
    if (!email || !consent) {
      toast.error('Please provide email and consent');
      return;
    }

    analytics.trackFamilyOnboardingComplete({
      segment: selectedSegment,
      goals: selectedGoals,
      email_provided: !!email
    });

    // Store onboarding data
    localStorage.setItem('family_onboarding', JSON.stringify({
      segment: selectedSegment,
      goals: selectedGoals,
      email,
      completedAt: new Date().toISOString()
    }));

    toast.success('Welcome to your Family Office Dashboard!');
    navigate('/family/home');
  };

  const getAvailableGoals = () => {
    return familyGoals.filter(goal => 
      goal.segment === 'both' || 
      goal.segment === selectedSegment
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Progress Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Welcome to Your Family Office</h1>
          <p className="text-muted-foreground">
            Let's personalize your experience in 3 quick steps
          </p>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>

        {/* Step 1: Segment Selection */}
        {currentStep === 1 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Choose Your Family Stage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {familySegments.map((segment) => (
                  <Card 
                    key={segment.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedSegment === segment.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleSegmentSelect(segment.id)}
                  >
                    <CardContent className="p-6 text-center space-y-3">
                      <div className="flex justify-center">
                        {segment.icon}
                      </div>
                      <h3 className="font-semibold">{segment.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {segment.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Goals Selection */}
        {currentStep === 2 && selectedSegment && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Select Your Goals
                <Badge variant="secondary" className="ml-2">
                  {familySegments.find(s => s.id === selectedSegment)?.title}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getAvailableGoals().map((goal) => (
                  <div
                    key={goal.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all hover:bg-accent ${
                      selectedGoals.includes(goal.id) ? 'bg-accent border-primary' : ''
                    }`}
                    onClick={() => handleGoalToggle(goal.id)}
                  >
                    <Checkbox 
                      checked={selectedGoals.includes(goal.id)}
                      onChange={() => handleGoalToggle(goal.id)}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      {goal.icon}
                      <div>
                        <p className="font-medium text-sm">{goal.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {goal.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Back
                </Button>
                <Button onClick={handleGoalsNext} className="flex items-center gap-2">
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Email & Consent */}
        {currentStep === 3 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Complete Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11"
                />
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => setConsent(checked as boolean)}
                />
                <label htmlFor="consent" className="text-sm text-muted-foreground">
                  I consent to receive personalized recommendations and updates about 
                  family office services. You can unsubscribe at any time.
                </label>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Your Selection Summary:</h4>
                <div className="space-y-1">
                  <p className="text-sm">
                    <strong>Family Stage:</strong> {familySegments.find(s => s.id === selectedSegment)?.title}
                  </p>
                  <p className="text-sm">
                    <strong>Goals:</strong> {selectedGoals.length} selected
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Back
                </Button>
                <Button 
                  onClick={handleComplete}
                  disabled={!email || !consent}
                  className="flex items-center gap-2"
                >
                  Complete Setup
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};