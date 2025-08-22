import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Award, GraduationCap, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const NIL_WORKFLOWS = {
  athlete: [
    { step: 'Education & Training', description: 'Learn NIL rules and best practices' },
    { step: 'Profile Setup', description: 'Create your athlete profile and brand assets' },
    { step: 'Disclosure Templates', description: 'Set up required disclosure templates' },
    { step: 'Deal Tracking', description: 'Manage offers and signed agreements' },
    { step: 'Payment Verification', description: 'Track payments and tax documentation' }
  ],
  school: [
    { step: 'Policy Publishing', description: 'Publish NIL rules and guidelines' },
    { step: 'Verification System', description: 'Set up automated compliance checking' },
    { step: 'Monitoring Dashboard', description: 'Track student athlete activities' },
    { step: 'Reporting Tools', description: 'Generate compliance reports' }
  ]
};

interface NILOnboardingProps {
  type: 'athlete' | 'school';
}

export default function NILOnboarding({ type }: NILOnboardingProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    sport: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAthlete = type === 'athlete';
  const totalSteps = 2;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const requiredFields = isAthlete 
      ? ['name', 'organization', 'sport', 'email']
      : ['name', 'organization', 'email'];

    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);

    if (missingFields.length > 0) {
      toast({
        title: "Please complete all fields",
        description: "All fields are required to continue.",
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
          persona: `nil-${type}`,
          ...formData
        });
      }

      toast({
        title: "NIL Workspace Created!",
        description: `Your ${isAthlete ? 'athlete' : 'school'} NIL workspace is ready. Check your email for next steps.`,
      });

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
            <h1 className="text-2xl font-bold">
              {isAthlete ? 'Set Up Your NIL Profile' : 'Set Up Your NIL Compliance System'}
            </h1>
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
            
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-2">
                    {isAthlete ? <Award className="w-5 h-5" /> : <GraduationCap className="w-5 h-5" />}
                    {isAthlete ? 'Athlete Information' : 'School Information'}
                  </CardTitle>
                </CardHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">
                      {isAthlete ? 'Full Name' : 'School Name'}
                    </Label>
                    <Input
                      id="name"
                      placeholder={isAthlete ? 'Your full name' : 'University or School name'}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="organization">
                      {isAthlete ? 'School/University' : 'Athletic Department'}
                    </Label>
                    <Input
                      id="organization"
                      placeholder={isAthlete ? 'Your school name' : 'Athletic department name'}
                      value={formData.organization}
                      onChange={(e) => handleInputChange('organization', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {isAthlete && (
                    <div>
                      <Label htmlFor="sport">Sport</Label>
                      <Input
                        id="sport"
                        placeholder="e.g., Football, Basketball, Tennis"
                        value={formData.sport}
                        onChange={(e) => handleInputChange('sport', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  )}

                  <Button 
                    onClick={() => setCurrentStep(2)}
                    disabled={!formData.name || !formData.organization || (isAthlete && !formData.sport)}
                    className="w-full"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Email and Workflow Preview */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Your NIL Workflow</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Here's what you'll get access to:
                  </p>
                </CardHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Workflow Preview */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-3">Your NIL Process:</h4>
                    <div className="space-y-2">
                      {NIL_WORKFLOWS[type].map((workflow, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                          <div>
                            <div className="font-medium text-sm">{workflow.step}</div>
                            <div className="text-xs text-muted-foreground">{workflow.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-muted/30 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Setup Summary:</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong>Name:</strong> {formData.name}</p>
                      <p><strong>{isAthlete ? 'School' : 'Department'}:</strong> {formData.organization}</p>
                      {isAthlete && <p><strong>Sport:</strong> {formData.sport}</p>}
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubmit}
                    disabled={!formData.email || isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'Creating NIL Workspace...' : 'Create My NIL Workspace'}
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
          <p>⚖️ Built with NCAA compliance in mind</p>
          <p>✨ No credit card required • Cancel anytime</p>
        </div>
      </div>
    </div>
  );
}