import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, Users, FileText, Calculator, BarChart3, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PROFESSIONAL_PLAYBOOKS = [
  { 
    key: 'client-onboarding', 
    title: 'Client Onboarding', 
    description: 'Streamlined process for new client intake',
    icon: Users
  },
  { 
    key: 'financial-planning', 
    title: 'Financial Planning', 
    description: 'Comprehensive planning workflow',
    icon: Calculator
  },
  { 
    key: 'compliance-docs', 
    title: 'Compliance & Documentation', 
    description: 'Required forms and compliance tracking',
    icon: FileText
  },
  { 
    key: 'portfolio-review', 
    title: 'Portfolio Reviews', 
    description: 'Quarterly client review process',
    icon: BarChart3
  }
];

interface ProfessionalOnboardingProps {
  professionalType: 'advisors' | 'cpas' | 'attorneys' | 'realtor';
}

export default function ProfessionalOnboarding({ professionalType }: ProfessionalOnboardingProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [firmName, setFirmName] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [selectedPlaybook, setSelectedPlaybook] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 3;

  const professionalLabels = {
    advisors: { title: 'Advisory Firm', workspace: 'Advisory Practice' },
    cpas: { title: 'CPA Firm', workspace: 'CPA Practice' },
    attorneys: { title: 'Law Firm', workspace: 'Legal Practice' },
    realtor: { title: 'Real Estate Firm', workspace: 'Real Estate Practice' }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!firmName || !selectedPlaybook || !email) {
      toast({
        title: "Please complete all fields",
        description: "Fill in your firm details, select a playbook, and enter your email.",
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
          persona: professionalType,
          firmName,
          playbook: selectedPlaybook,
          email: email
        });
      }

      toast({
        title: "Workspace Created!",
        description: `Your ${professionalLabels[professionalType].workspace} is ready. Check your email for next steps.`,
      });

      // Redirect to dashboard
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
            <h1 className="text-2xl font-bold">Set Up Your {professionalLabels[professionalType].title}</h1>
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
            
            {/* Step 1: Firm Basics */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Tell us about your firm</CardTitle>
                </CardHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="firmName">Firm Name</Label>
                    <Input
                      id="firmName"
                      placeholder="Your Firm Name"
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="logo">Logo (Optional)</Label>
                    <div className="mt-1">
                      <label htmlFor="logo" className="cursor-pointer">
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {logoFile ? logoFile.name : 'Click to upload logo'}
                          </p>
                        </div>
                      </label>
                      <input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={() => setCurrentStep(2)}
                    disabled={!firmName}
                    className="w-full"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Playbook Selection */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Choose your first playbook</CardTitle>
                  <p className="text-sm text-muted-foreground">You can add more playbooks later</p>
                </CardHeader>
                
                <div className="grid gap-4">
                  {PROFESSIONAL_PLAYBOOKS.map((playbook) => {
                    const IconComponent = playbook.icon;
                    const isSelected = selectedPlaybook === playbook.key;
                    return (
                      <Button
                        key={playbook.key}
                        variant={isSelected ? "default" : "outline"}
                        className="h-auto p-4 justify-start"
                        onClick={() => setSelectedPlaybook(playbook.key)}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <IconComponent className="w-6 h-6" />
                          <div className="text-left">
                            <div className="font-semibold">{playbook.title}</div>
                            <div className="text-sm opacity-80">{playbook.description}</div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>

                <Button 
                  onClick={() => setCurrentStep(3)}
                  disabled={!selectedPlaybook}
                  className="w-full"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 3: Email Collection */}
            {currentStep === 3 && (
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

                  {/* Summary */}
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Your Setup:</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong>Firm:</strong> {firmName}</p>
                      <p><strong>First Playbook:</strong> {PROFESSIONAL_PLAYBOOKS.find(p => p.key === selectedPlaybook)?.title}</p>
                      {logoFile && <p><strong>Logo:</strong> {logoFile.name}</p>}
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubmit}
                    disabled={!email || isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'Creating Workspace...' : `Create My ${professionalLabels[professionalType].workspace}`}
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