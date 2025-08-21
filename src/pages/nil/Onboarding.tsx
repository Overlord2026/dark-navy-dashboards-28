import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen, Shield, DollarSign, Settings, Users } from 'lucide-react';
import { useNILOnboardingStore } from '@/features/nil/onboarding/state';

const STEPS = [
  { id: 1, title: 'Role & Jurisdiction', icon: Users, description: 'Define your role and location' },
  { id: 2, title: 'Channels', icon: Settings, description: 'Select your social platforms' },
  { id: 3, title: 'Education', icon: BookOpen, description: 'NIL education enrollment' },
  { id: 4, title: 'Disclosure Preview', icon: Shield, description: 'Review disclosure requirements' },
  { id: 5, title: 'Exclusivity Preferences', icon: Users, description: 'Set partnership preferences' },
  { id: 6, title: 'Payment Method', icon: DollarSign, description: 'Configure payment settings' },
];

const JURISDICTIONS = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
  'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
  'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
  'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

const EXCLUSIVITY_CATEGORIES = [
  'Apparel & Fashion', 'Food & Beverage', 'Technology', 'Automotive', 'Financial Services',
  'Health & Fitness', 'Gaming & Entertainment', 'Education', 'Travel & Hospitality'
];

export default function NILOnboardingWizard() {
  const navigate = useNavigate();
  const {
    currentStep,
    completedSteps,
    role,
    jurisdiction,
    channels,
    disclosurePrefs,
    exclusivityPrefs,
    paymentPrefs,
    isCompleted,
    setStep,
    markStepCompleted,
    updateRole,
    updateJurisdiction,
    updateChannels,
    updateDisclosurePrefs,
    updateExclusivityPrefs,
    updatePaymentPrefs,
    completeOnboarding,
  } = useNILOnboardingStore();

  const progress = (completedSteps.length / 6) * 100;

  const handleNext = () => {
    if (currentStep < 6) {
      setStep(currentStep + 1);
    } else if (currentStep === 6) {
      completeOnboarding();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  };

  const handleSkipStep = () => {
    markStepCompleted(currentStep);
    handleNext();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return role && jurisdiction;
      case 2:
        return channels.length > 0;
      case 3:
        return true; // Education step can be skipped
      case 4:
        return true; // Disclosure preview can be skipped
      case 5:
        return true; // Exclusivity can be skipped
      case 6:
        return true; // Payment can be skipped
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">What is your role in NIL?</Label>
              <RadioGroup 
                value={role || ''} 
                onValueChange={updateRole}
                className="mt-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="athlete" id="athlete" />
                  <Label htmlFor="athlete">Student Athlete</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="brand" id="brand" />
                  <Label htmlFor="brand">Brand/Business</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="advisor" id="advisor" />
                  <Label htmlFor="advisor">Agent/Advisor</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label className="text-base font-medium">Primary Jurisdiction</Label>
              <Select value={jurisdiction} onValueChange={updateJurisdiction}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {JURISDICTIONS.map(state => (
                    <SelectItem key={state} value={state.toLowerCase().replace(' ', '-')}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base font-medium">Select Your Social Media Channels</Label>
              <p className="text-sm text-muted-foreground mt-1">
                Choose the platforms where you'll be active with NIL activities
              </p>
            </div>
            
            <div className="space-y-3">
              {(['IG', 'TikTok', 'YouTube'] as const).map(channel => (
                <div key={channel} className="flex items-center space-x-2">
                  <Checkbox
                    id={channel}
                    checked={channels.includes(channel)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        updateChannels([...channels, channel]);
                      } else {
                        updateChannels(channels.filter(c => c !== channel));
                      }
                    }}
                  />
                  <Label htmlFor={channel} className="font-medium">
                    {channel === 'IG' ? 'Instagram' : channel}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 text-center">
            <div>
              <BookOpen className="h-16 w-16 mx-auto text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">NIL Education Center</h3>
              <p className="text-muted-foreground">
                Learn about compliance, contracts, and best practices for NIL activities
              </p>
            </div>
            
            <div className="grid gap-4">
              <Card className="p-4">
                <h4 className="font-medium">NIL Basics Course</h4>
                <p className="text-sm text-muted-foreground">Understanding your rights and responsibilities</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => {
                    markStepCompleted(3);
                    navigate('/nil/education');
                  }}
                >
                  Start Learning
                </Button>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-medium">Compliance Guidelines</h4>
                <p className="text-sm text-muted-foreground">Stay compliant with NCAA and state regulations</p>
                <Button variant="outline" className="mt-2">
                  View Guidelines
                </Button>
              </Card>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Shield className="h-12 w-12 text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">Disclosure Requirements</h3>
              <p className="text-muted-foreground">
                Preview disclosure templates for your jurisdiction and channels
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Instagram Disclosure Template</h4>
                <p className="text-sm text-muted-foreground">
                  "#ad #sponsored - This post is sponsored by [Brand Name] in partnership with [Athlete Name]"
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="autoGenerate"
                    checked={disclosurePrefs.autoGenerate}
                    onCheckedChange={(checked) => 
                      updateDisclosurePrefs({ autoGenerate: checked as boolean })
                    }
                  />
                  <Label htmlFor="autoGenerate">Auto-generate disclosure text</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="reviewRequired"
                    checked={disclosurePrefs.reviewRequired}
                    onCheckedChange={(checked) => 
                      updateDisclosurePrefs({ reviewRequired: checked as boolean })
                    }
                  />
                  <Label htmlFor="reviewRequired">Require review before posting</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="channelSpecific"
                    checked={disclosurePrefs.channelSpecific}
                    onCheckedChange={(checked) => 
                      updateDisclosurePrefs({ channelSpecific: checked as boolean })
                    }
                  />
                  <Label htmlFor="channelSpecific">Channel-specific templates</Label>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <Users className="h-12 w-12 text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">Exclusivity Preferences</h3>
              <p className="text-muted-foreground">
                Set your preferences for brand partnerships and exclusivity
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Interested Categories</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {EXCLUSIVITY_CATEGORIES.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={exclusivityPrefs.categories.includes(category)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateExclusivityPrefs({
                              categories: [...exclusivityPrefs.categories, category]
                            });
                          } else {
                            updateExclusivityPrefs({
                              categories: exclusivityPrefs.categories.filter(c => c !== category)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={category} className="text-sm">{category}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="exclusiveWindows"
                    checked={exclusivityPrefs.exclusiveWindows}
                    onCheckedChange={(checked) => 
                      updateExclusivityPrefs({ exclusiveWindows: checked as boolean })
                    }
                  />
                  <Label htmlFor="exclusiveWindows">Allow exclusive partnership windows</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="competitorBlocking"
                    checked={exclusivityPrefs.competitorBlocking}
                    onCheckedChange={(checked) => 
                      updateExclusivityPrefs({ competitorBlocking: checked as boolean })
                    }
                  />
                  <Label htmlFor="competitorBlocking">Block direct competitors during partnerships</Label>
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div>
              <DollarSign className="h-12 w-12 text-primary mb-3" />
              <h3 className="text-xl font-semibold mb-2">Payment Preferences</h3>
              <p className="text-muted-foreground">
                Configure your payment and invoicing preferences
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="escrowPreferred"
                  checked={paymentPrefs.escrowPreferred}
                  onCheckedChange={(checked) => 
                    updatePaymentPrefs({ escrowPreferred: checked as boolean })
                  }
                />
                <Label htmlFor="escrowPreferred">Prefer escrow protection for payments</Label>
              </div>
              
              <div>
                <Label className="text-base font-medium">Payment Terms</Label>
                <RadioGroup 
                  value={paymentPrefs.paymentTerms} 
                  onValueChange={(value) => 
                    updatePaymentPrefs({ paymentTerms: value as 'immediate' | 'milestone' | 'completion' })
                  }
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="immediate" id="immediate" />
                    <Label htmlFor="immediate">Immediate payment upon agreement</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="milestone" id="milestone" />
                    <Label htmlFor="milestone">Milestone-based payments</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="completion" id="completion" />
                    <Label htmlFor="completion">Payment upon completion</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="invoiceRequired"
                  checked={paymentPrefs.invoiceRequired}
                  onCheckedChange={(checked) => 
                    updatePaymentPrefs({ invoiceRequired: checked as boolean })
                  }
                />
                <Label htmlFor="invoiceRequired">Require formal invoices</Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">NIL Onboarding Complete!</h1>
              <p className="text-muted-foreground mb-6">
                You're all set to start your NIL journey. Check your browser console for the completion payload.
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate('/nil/education')}>
                  Explore Education
                </Button>
                <Button variant="outline" onClick={() => navigate('/nil/offers')}>
                  Browse Offers
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">NIL Onboarding</h1>
            <Badge variant="secondary">{completedSteps.length}/6 Complete</Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="grid grid-cols-6 gap-2 mb-8">
          {STEPS.map((step) => {
            const StepIcon = step.icon;
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            
            return (
              <button
                key={step.id}
                onClick={() => setStep(step.id)}
                className={`p-3 rounded-lg text-center transition-colors ${
                  isCurrent 
                    ? 'bg-primary text-primary-foreground' 
                    : isCompleted
                    ? 'bg-green-100 text-green-700'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <StepIcon className="h-5 w-5 mx-auto mb-1" />
                <div className="text-xs font-medium">{step.title}</div>
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {React.createElement(STEPS[currentStep - 1].icon, { className: "h-5 w-5" })}
              Step {currentStep}: {STEPS[currentStep - 1].title}
            </CardTitle>
            <p className="text-muted-foreground">{STEPS[currentStep - 1].description}</p>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button variant="ghost" onClick={handleSkipStep}>
              Skip Step
            </Button>
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === 6 ? 'Complete' : 'Next'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}