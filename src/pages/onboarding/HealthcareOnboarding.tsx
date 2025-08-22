import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HealthcareOnboardingProps {
  segment: 'providers' | 'influencers';
}

export default function HealthcareOnboarding({ segment }: HealthcareOnboardingProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    organizationName: '',
    role: '',
    email: '',
    programName: '',
    cohortSize: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isProviders = segment === 'providers';
  const totalSteps = isProviders ? 2 : 3;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const requiredFields = isProviders 
      ? ['organizationName', 'role', 'email']
      : ['organizationName', 'programName', 'cohortSize', 'email'];

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
      // Simulate submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Track onboarding event
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture('onboard.start', {
          persona: 'healthcare',
          segment: segment,
          ...formData
        });
      }

      if (isProviders) {
        toast({
          title: "Access Request Submitted!",
          description: "Our team will review your request and contact you within 24 hours.",
        });
      } else {
        toast({
          title: "Program Created!",
          description: "Your coaching workspace is ready. Check your email for next steps.",
        });
        navigate('/dashboard?new=true');
      }
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
              {isProviders ? 'Request Healthcare Provider Access' : 'Create Your Coaching Program'}
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
            
            {/* Providers: Step 1 - Organization Info */}
            {isProviders && currentStep === 1 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Organization Information
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    We verify all healthcare providers to ensure compliance and security.
                  </p>
                </CardHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="organizationName">Healthcare Organization</Label>
                    <Input
                      id="organizationName"
                      placeholder="Hospital, Clinic, or Practice Name"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange('organizationName', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="role">Your Role</Label>
                    <Input
                      id="role"
                      placeholder="e.g., Physician, Nurse Practitioner, Admin"
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <Alert>
                    <Shield className="w-4 h-4" />
                    <AlertDescription>
                      Access is limited to verified healthcare providers. We'll verify your credentials before granting access.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    onClick={() => setCurrentStep(2)}
                    disabled={!formData.organizationName || !formData.role}
                    className="w-full"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Influencers: Step 1 - Program Basics */}
            {!isProviders && currentStep === 1 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Program Information
                  </CardTitle>
                </CardHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="organizationName">Business/Brand Name</Label>
                    <Input
                      id="organizationName"
                      placeholder="Your coaching business name"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange('organizationName', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="programName">First Program Name</Label>
                    <Input
                      id="programName"
                      placeholder="e.g., 90-Day Longevity Challenge"
                      value={formData.programName}
                      onChange={(e) => handleInputChange('programName', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <Button 
                    onClick={() => setCurrentStep(2)}
                    disabled={!formData.organizationName || !formData.programName}
                    className="w-full"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Influencers: Step 2 - Cohort Setup */}
            {!isProviders && currentStep === 2 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Set Up Your First Cohort</CardTitle>
                </CardHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cohortSize">Expected Cohort Size</Label>
                    <Input
                      id="cohortSize"
                      type="number"
                      placeholder="How many participants?"
                      value={formData.cohortSize}
                      onChange={(e) => handleInputChange('cohortSize', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">What You'll Get:</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Client enrollment and progress tracking
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Protocol builder and content management
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Automated check-ins and reminders
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Progress analytics and reporting
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => setCurrentStep(3)}
                    disabled={!formData.cohortSize}
                    className="w-full"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Final Step: Email Collection */}
            {currentStep === totalSteps && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>
                    {isProviders ? 'Submit Your Request' : 'Almost Done!'}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {isProviders 
                      ? 'Enter your email to submit your access request.'
                      : 'Enter your email to create your coaching workspace.'
                    }
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

                  {/* Summary */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Summary:</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong>Organization:</strong> {formData.organizationName}</p>
                      {isProviders && <p><strong>Role:</strong> {formData.role}</p>}
                      {!isProviders && <p><strong>Program:</strong> {formData.programName}</p>}
                      {!isProviders && <p><strong>Cohort Size:</strong> {formData.cohortSize}</p>}
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubmit}
                    disabled={!formData.email || isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting 
                      ? (isProviders ? 'Submitting Request...' : 'Creating Workspace...')
                      : (isProviders ? 'Submit Access Request' : 'Create My Coaching Workspace')
                    }
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
          {isProviders && <p>🏥 HIPAA compliant infrastructure</p>}
          <p>✨ No credit card required • Cancel anytime</p>
        </div>
      </div>
    </div>
  );
}