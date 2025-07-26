import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, User, FileText, CreditCard, CheckCircle, Play } from 'lucide-react';

interface InvitationData {
  id: string;
  advisor_id: string;
  email: string;
  first_name: string;
  last_name: string;
  custom_message?: string;
  onboarding_template: string;
  fee_structure: string;
  premium_modules: string[];
  advisor_name?: string;
  firm_name?: string;
  firm_logo?: string;
  firm_colors?: any;
  expires_at: string;
}

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
  completed: boolean;
}

export function ClientWelcomeFlow() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>('');
  const [welcomeVideoUrl, setWelcomeVideoUrl] = useState<string>('');
  
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: 'welcome',
      title: 'Welcome & Introduction',
      description: 'Learn about our firm and services',
      icon: <Play className="h-4 w-4" />,
      required: true,
      completed: false
    },
    {
      id: 'identity',
      title: 'Identity Verification',
      description: 'Secure verification of your identity',
      icon: <Shield className="h-4 w-4" />,
      required: true,
      completed: false
    },
    {
      id: 'profile',
      title: 'Personal Information',
      description: 'Complete your client profile',
      icon: <User className="h-4 w-4" />,
      required: true,
      completed: false
    },
    {
      id: 'documents',
      title: 'Document Upload',
      description: 'Securely upload required documents',
      icon: <FileText className="h-4 w-4" />,
      required: true,
      completed: false
    },
    {
      id: 'agreements',
      title: 'Agreements & Signatures',
      description: 'Review and sign service agreements',
      icon: <FileText className="h-4 w-4" />,
      required: true,
      completed: false
    },
    {
      id: 'payment',
      title: 'Payment Setup',
      description: 'Configure payment methods and fees',
      icon: <CreditCard className="h-4 w-4" />,
      required: false,
      completed: false
    }
  ]);

  useEffect(() => {
    loadInvitation();
  }, [token]);

  const loadInvitation = async () => {
    if (!token) {
      toast({
        title: "Invalid Invitation",
        description: "The invitation link is invalid or expired.",
        variant: "destructive"
      });
      navigate('/');
      return;
    }

    try {
      // TODO: Uncomment when onboarding tables are created
      // Mock invitation data for demo
      const mockInvitation = {
        id: 'demo-id',
        advisor_id: 'demo-advisor',
        email: 'demo@example.com',
        first_name: 'Demo',
        last_name: 'Client',
        custom_message: 'Welcome to our premium onboarding experience!',
        onboarding_template: 'standard',
        fee_structure: 'aum_based',
        premium_modules: ['estate_planning'],
        advisor_name: 'Demo Advisor',
        firm_name: 'Demo Firm',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      setInvitation(mockInvitation as any);
      setSessionId('demo-session-id');

    } catch (error) {
      console.error('Error loading invitation:', error);
      toast({
        title: "Error",
        description: "Failed to load invitation. Please contact your advisor.",
        variant: "destructive"
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const markStepComplete = async (stepId: string) => {
    if (!sessionId) return;

    try {
      await supabase
        .from('onboarding_step_completions')
        .insert({
          session_id: sessionId,
          step_name: stepId,
          completed_at: new Date().toISOString()
        });

      setSteps(prev => prev.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      ));

    } catch (error) {
      console.error('Error marking step complete:', error);
    }
  };

  const getCurrentProgress = () => {
    const completedSteps = steps.filter(step => step.completed).length;
    return (completedSteps / steps.length) * 100;
  };

  const renderWelcomeStep = () => (
    <Card>
      <CardHeader>
        <div className="text-center space-y-4">
          {invitation?.firm_logo && (
            <img 
              src={invitation.firm_logo} 
              alt="Firm Logo" 
              className="h-16 mx-auto"
            />
          )}
          <div>
            <CardTitle className="text-2xl">
              Welcome, {invitation?.first_name}!
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Welcome to {invitation?.firm_name || 'our firm'}. We're excited to work with you.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {invitation?.custom_message && (
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm italic">"{invitation.custom_message}"</p>
            <p className="text-xs text-muted-foreground mt-2">
              - {invitation?.advisor_name}
            </p>
          </div>
        )}

        {welcomeVideoUrl && (
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <video 
              src={welcomeVideoUrl} 
              controls 
              className="w-full h-full rounded-lg"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">
              Your data is protected with bank-level security
            </p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <User className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold">Personalized Service</h3>
            <p className="text-sm text-muted-foreground">
              Tailored financial planning for your unique needs
            </p>
          </div>
          <div className="text-center p-4 border rounded-lg">
            <FileText className="h-8 w-8 mx-auto mb-2 text-primary" />
            <h3 className="font-semibold">Comprehensive Planning</h3>
            <p className="text-sm text-muted-foreground">
              Complete financial wellness and wealth management
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">What's included in your onboarding:</h4>
          <ul className="space-y-2">
            {steps.map(step => (
              <li key={step.id} className="flex items-center gap-2 text-sm">
                {step.icon}
                <span>{step.title}</span>
                {step.required && <Badge variant="secondary" className="text-xs">Required</Badge>}
              </li>
            ))}
          </ul>
        </div>

        <Button 
          onClick={() => {
            markStepComplete('welcome');
            setCurrentStep(1);
          }}
          className="w-full"
          size="lg"
        >
          Begin Onboarding Process
        </Button>
      </CardContent>
    </Card>
  );

  const renderProgressHeader = () => (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Client Onboarding Progress</h2>
            <Badge variant="outline">
              {steps.filter(s => s.completed).length} of {steps.length} complete
            </Badge>
          </div>
          
          <Progress value={getCurrentProgress()} className="h-2" />
          
          <div className="flex flex-wrap gap-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                  step.completed 
                    ? 'bg-green-100 text-green-800'
                    : index === currentStep
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  step.icon
                )}
                <span>{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p>Loading your invitation...</p>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold mb-2">Invitation Not Found</h2>
            <p className="text-muted-foreground mb-4">
              This invitation link is invalid or has expired.
            </p>
            <Button onClick={() => navigate('/')}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {currentStep === 0 ? (
            renderWelcomeStep()
          ) : (
            <>
              {renderProgressHeader()}
              <div className="text-center">
                <p className="text-muted-foreground">
                  Additional onboarding steps will be implemented here based on the selected template
                </p>
                <Button 
                  onClick={() => setCurrentStep(0)}
                  variant="outline"
                  className="mt-4"
                >
                  Back to Welcome
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}