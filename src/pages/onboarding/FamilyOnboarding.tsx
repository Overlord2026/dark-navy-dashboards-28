import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Target, Users, TrendingUp, Home, Heart, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FAMILY_SEGMENTS = [
  { 
    key: 'aspiring', 
    title: 'Aspiring Wealthy', 
    description: 'Building wealth and good financial habits',
    icon: TrendingUp
  },
  { 
    key: 'retirees', 
    title: 'Retirees', 
    description: 'Income, tax, estate, and health planning',
    icon: Users
  }
];

const FAMILY_GOALS = [
  { key: 'build-wealth', label: 'Build Wealth', icon: TrendingUp },
  { key: 'save-taxes', label: 'Save on Taxes', icon: Target },
  { key: 'plan-retirement', label: 'Plan Retirement', icon: Users },
  { key: 'protect-estate', label: 'Protect Estate', icon: Home },
  { key: 'health-longevity', label: 'Health & Longevity', icon: Heart },
  { key: 'organize-docs', label: 'Organize Documents', icon: CheckCircle }
];

export default function FamilyOnboarding() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSegment, setSelectedSegment] = useState(searchParams.get('seg') || '');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = selectedSegment ? 2 : 3;

  const handleSegmentSelect = (segment: string) => {
    setSelectedSegment(segment);
    setCurrentStep(selectedSegment ? currentStep : 2);
  };

  const handleGoalToggle = (goalKey: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalKey) 
        ? prev.filter(g => g !== goalKey)
        : [...prev, goalKey]
    );
  };

  const handleSubmit = async () => {
    if (!email || selectedGoals.length === 0) {
      toast({
        title: "Please complete all fields",
        description: "Select your goals and enter your email to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate workspace creation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Track onboarding event
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('onboard.start', {
          persona: 'families',
          segment: selectedSegment,
          goals: selectedGoals,
          email: email
        });
      }

      toast({
        title: "Workspace Created!",
        description: `Your ${selectedSegment} family workspace is ready. Check your email for next steps.`,
      });

      // Redirect to dashboard or success page
      navigate('/dashboard?new=true');
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Create Your Family Workspace</h1>
            <Badge variant="outline">{currentStep} of {totalSteps}</Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            
            {/* Step 1: Segment Selection (if not pre-selected) */}
            {!selectedSegment && currentStep === 1 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Which best describes your family?</CardTitle>
                </CardHeader>
                
                <div className="grid gap-4">
                  {FAMILY_SEGMENTS.map((segment) => {
                    const IconComponent = segment.icon;
                    return (
                      <Button
                        key={segment.key}
                        variant="outline"
                        className="h-auto p-4 justify-start"
                        onClick={() => handleSegmentSelect(segment.key)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <IconComponent className="w-6 h-6 text-primary" />
                          <div className="text-left">
                            <div className="font-semibold">{segment.title}</div>
                            <div className="text-sm text-muted-foreground">{segment.description}</div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Goals Selection */}
            {selectedSegment && currentStep === (selectedSegment ? 1 : 2) && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>What are your main financial goals?</CardTitle>
                  <p className="text-sm text-muted-foreground">Select all that apply</p>
                </CardHeader>
                
                <div className="grid grid-cols-2 gap-3">
                  {FAMILY_GOALS.map((goal) => {
                    const IconComponent = goal.icon;
                    const isSelected = selectedGoals.includes(goal.key);
                    return (
                      <Button
                        key={goal.key}
                        variant={isSelected ? "default" : "outline"}
                        className="h-auto p-3 justify-start"
                        onClick={() => handleGoalToggle(goal.key)}
                      >
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          <span className="text-sm">{goal.label}</span>
                        </div>
                      </Button>
                    );
                  })}
                </div>

                <Button 
                  onClick={() => setCurrentStep(selectedSegment ? 2 : 3)}
                  disabled={selectedGoals.length === 0}
                  className="w-full"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 3: Email Collection */}
            {selectedSegment && currentStep === (selectedSegment ? 2 : 3) && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Almost done!</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Enter your email to create your workspace and get started.
                  </p>
                </CardHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Selected Goals Summary */}
                  <div>
                    <Label>Your Selected Goals:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedGoals.map(goalKey => {
                        const goal = FAMILY_GOALS.find(g => g.key === goalKey);
                        return goal ? (
                          <Badge key={goalKey} variant="secondary">
                            {goal.label}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubmit}
                    disabled={!email || isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'Creating Workspace...' : 'Create My Workspace'}
                    {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
              </div>
            )}

          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>🔒 Your data is encrypted and secure</p>
          <p>✨ No credit card required • Cancel anytime</p>
        </div>
      </div>
    </div>
  );
}