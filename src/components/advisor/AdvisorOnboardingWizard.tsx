import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Phone, 
  Users, 
  Target, 
  Shield, 
  Crown, 
  MessageSquare,
  FileText,
  Settings,
  CheckCircle,
  Play
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
}

const steps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to BFO™',
    description: 'Your elite advisor platform awaits',
    icon: Crown,
    component: WelcomeStep
  },
  {
    id: 'communications',
    title: 'Activate Communications',
    description: 'Set up SMS & VoIP with Twilio',
    icon: Phone,
    component: CommunicationsStep
  },
  {
    id: 'client-onboarding',
    title: 'Client Onboarding',
    description: 'Branded invites and magic links',
    icon: Users,
    component: ClientOnboardingStep
  },
  {
    id: 'lead-engine',
    title: 'Lead-to-Sales Engine',
    description: 'SWAG scoring and campaigns',
    icon: Target,
    component: LeadEngineStep
  },
  {
    id: 'document-vault',
    title: 'Document Vault',
    description: 'Secure storage and eSignature',
    icon: Shield,
    component: DocumentVaultStep
  },
  {
    id: 'premium-tools',
    title: 'Premium Tools',
    description: 'Tax scan, estate planning, and more',
    icon: Crown,
    component: PremiumToolsStep
  },
  {
    id: 'linda-ai',
    title: 'Meet Linda AI',
    description: 'Your intelligent assistant',
    icon: MessageSquare,
    component: LindaAIStep
  },
  {
    id: 'complete',
    title: 'Setup Complete',
    description: 'Start managing your practice',
    icon: CheckCircle,
    component: CompleteStep
  }
];

function WelcomeStep() {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="p-4 rounded-full bg-gradient-to-r from-gold/20 to-accent/20">
          <Crown className="h-12 w-12 text-gold" />
        </div>
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-4">Welcome to Boutique Family Office™</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Empowering Elite Advisors with an All-in-One Platform
        </p>
        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <h3 className="text-xl font-semibold">What You Can Do:</h3>
          <ul className="text-left space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span>Manage your client book with advanced dashboards</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span>Automate onboarding and document vaulting</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span>Track leads with SWAG Lead Score™</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span>Run SMS/VoIP communications—all in one place</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span>Access premium private market deals and planning tools</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function CommunicationsStep() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isActivating, setIsActivating] = useState(false);

  const handleActivate = async () => {
    setIsActivating(true);
    // Simulate activation process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsActivating(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Activate SMS & VoIP</h2>
        <p className="text-muted-foreground">
          Simple wizard: Port your number or pick a new one in seconds
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Communication Setup</CardTitle>
          <CardDescription>
            Choose how you want to set up your business communications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="cursor-pointer hover:bg-accent/5 transition-colors">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Port Existing Number</h3>
                <p className="text-sm text-muted-foreground">
                  Keep your current business number
                </p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-accent/5 transition-colors">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Get New Number</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from available numbers
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Features Included:</h4>
            <ul className="text-sm space-y-1">
              <li>• Unified inbox for all communications</li>
              <li>• Compliance-ready call recording</li>
              <li>• SMS automation and templates</li>
              <li>• Voicemail transcription</li>
            </ul>
          </div>
          
          <Button 
            onClick={handleActivate} 
            disabled={isActivating}
            className="w-full"
          >
            {isActivating ? 'Activating...' : 'Activate Communications'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function ClientOnboardingStep() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Users className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Client Onboarding</h2>
        <p className="text-muted-foreground">
          Magic links for instant client onboarding
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Invite System Setup</CardTitle>
          <CardDescription>
            Configure your branded client invitations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">White-labeled Invites</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Your branding, your domain, your professional image
            </p>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Customize Branding
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Email Invitations</h4>
              <p className="text-sm text-muted-foreground">
                Automated email sequences with your branding
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">SMS Invitations</h4>
              <p className="text-sm text-muted-foreground">
                Quick text invites with magic links
              </p>
            </div>
          </div>
          
          <Card className="bg-muted/20">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Auto-linking Features:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Clients automatically linked to your dashboard</li>
                <li>• Progress tracking for each invitation</li>
                <li>• Automated reminders and follow-ups</li>
                <li>• Household member invitations</li>
              </ul>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}

function LeadEngineStep() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Target className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Lead-to-Sales Engine</h2>
        <p className="text-muted-foreground">
          SWAG Lead Score™ and automated campaigns
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>
            SWAG Lead Score™
            <Badge variant="secondary" className="ml-2">
              <Crown className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </CardTitle>
          <CardDescription>
            AI-powered prospect scoring and nurturing system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-emerald-500/10 to-primary/10 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Visual Sales Funnel</h3>
            <div className="flex items-center justify-between text-sm">
              <span>Capture</span>
              <ChevronRight className="h-4 w-4" />
              <span>Score</span>
              <ChevronRight className="h-4 w-4" />
              <span>Nurture</span>
              <ChevronRight className="h-4 w-4" />
              <span>Convert</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-muted/20">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Lead Scoring</h4>
                <ul className="text-sm space-y-1">
                  <li>• Assets Under Management potential</li>
                  <li>• Engagement level tracking</li>
                  <li>• Referral source quality</li>
                  <li>• Response time analytics</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="bg-muted/20">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Campaign Tools</h4>
                <ul className="text-sm space-y-1">
                  <li>• Personalized follow-up sequences</li>
                  <li>• Multi-channel campaigns</li>
                  <li>• A/B testing capabilities</li>
                  <li>• Performance analytics</li>
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <Button className="w-full">
            <Target className="h-4 w-4 mr-2" />
            Setup Lead Scoring
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function DocumentVaultStep() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Secure Document Vault</h2>
        <p className="text-muted-foreground">
          Encrypted storage, eSignature, and compliance
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Document Management System</CardTitle>
          <CardDescription>
            Bank-level security for all your client documents
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
              <CardContent className="p-4 text-center">
                <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold">Upload & Organize</h4>
                <p className="text-sm text-muted-foreground">
                  Drag & drop document management
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-emerald-500/10 to-primary/10">
              <CardContent className="p-4 text-center">
                <Shield className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <h4 className="font-semibold">Bank-Level Security</h4>
                <p className="text-sm text-muted-foreground">
                  256-bit encryption at rest and in transit
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-gold/10 to-accent/10">
              <CardContent className="p-4 text-center">
                <Settings className="h-8 w-8 text-gold mx-auto mb-2" />
                <h4 className="font-semibold">eSignature Ready</h4>
                <p className="text-sm text-muted-foreground">
                  Integrated DocuSign workflows
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-semibold mb-2">Document Categories:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>• Tax Returns & Analysis</div>
              <div>• Estate Planning Documents</div>
              <div>• Investment Statements</div>
              <div>• Insurance Policies</div>
              <div>• Legal Documents</div>
              <div>• Compliance Records</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PremiumToolsStep() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Crown className="h-12 w-12 text-gold mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Premium Advisor Tools</h2>
        <p className="text-muted-foreground">
          Advanced features for elite advisors
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-primary/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Tax Return Scanner</CardTitle>
              <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-700">
                NEW
              </Badge>
            </div>
            <CardDescription>
              AI-powered tax return analysis and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• Instant tax return analysis</li>
              <li>• Optimization opportunities</li>
              <li>• Client presentation reports</li>
              <li>• Integration with Holistiplan</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gold/10 to-accent/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Estate Plan Creator</CardTitle>
              <Badge variant="secondary" className="bg-gold/20 text-gold">
                NEW
              </Badge>
            </div>
            <CardDescription>
              Digital estate planning collaboration tool
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• Attorney collaboration portal</li>
              <li>• Document generation</li>
              <li>• Client review workflows</li>
              <li>• Secure signing process</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Private Market Access</CardTitle>
            <CardDescription>
              Exclusive investment opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• Curated deal flow</li>
              <li>• Due diligence reports</li>
              <li>• Client suitability matching</li>
              <li>• Investment tracking</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-accent/10 to-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Digital Marketing Engine</CardTitle>
            <CardDescription>
              Automated marketing and content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-1">
              <li>• Content calendar automation</li>
              <li>• Social media scheduling</li>
              <li>• Email campaign management</li>
              <li>• Performance analytics</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LindaAIStep() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <MessageSquare className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Meet Linda AI</h2>
        <p className="text-muted-foreground">
          Your intelligent assistant for live support and guidance
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>AI Concierge Support</CardTitle>
          <CardDescription>
            Get instant help with onboarding, tutorials, and troubleshooting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/20">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Linda AI Capabilities</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Step-by-step feature tutorials</li>
                  <li>• Compliance questions and guidance</li>
                  <li>• Technical troubleshooting</li>
                  <li>• Best practices recommendations</li>
                  <li>• Integration assistance</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-4 bg-muted/20">
            <h4 className="font-semibold mb-2">Try asking Linda:</h4>
            <div className="space-y-2">
              <div className="bg-background rounded p-2 text-sm">
                "How do I set up automated client reminders?"
              </div>
              <div className="bg-background rounded p-2 text-sm">
                "What are the compliance requirements for call recording?"
              </div>
              <div className="bg-background rounded p-2 text-sm">
                "How do I customize my client invitation templates?"
              </div>
            </div>
          </div>
          
          <Button className="w-full">
            <MessageSquare className="h-4 w-4 mr-2" />
            Start Chat with Linda
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function CompleteStep() {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="p-4 rounded-full bg-gradient-to-r from-emerald-500/20 to-primary/20">
          <CheckCircle className="h-12 w-12 text-emerald-500" />
        </div>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold mb-4">Setup Complete!</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Your Boutique Family Office™ platform is ready to use
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Invite Your First Client</div>
                <div className="text-sm text-muted-foreground">
                  Send a branded invitation
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Target className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Create Your First Campaign</div>
                <div className="text-sm text-muted-foreground">
                  Start nurturing leads
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <Play className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Watch Demo Videos</div>
                <div className="text-sm text-muted-foreground">
                  Learn advanced features
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4">
              <div className="text-center">
                <MessageSquare className="h-6 w-6 mx-auto mb-2" />
                <div className="font-semibold">Schedule Support Call</div>
                <div className="text-sm text-muted-foreground">
                  Get personalized help
                </div>
              </div>
            </Button>
          </div>
          
          <Button className="w-full" size="lg">
            <Crown className="h-5 w-5 mr-2" />
            Go to Advisor Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

interface AdvisorOnboardingWizardProps {
  onComplete?: () => void;
}

export const AdvisorOnboardingWizard: React.FC<AdvisorOnboardingWizardProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const progress = ((currentStep + 1) / steps.length) * 100;

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Advisor Setup</h1>
          <Badge variant="outline" className="gap-1">
            <Crown className="h-3 w-3" />
            Elite Platform
          </Badge>
        </div>
        
        <Progress value={progress} className="mb-4" />
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <CurrentStepComponent />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex items-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        
        <Button
          onClick={nextStep}
          className="flex items-center gap-2"
        >
          {currentStep === steps.length - 1 ? 'Complete Setup' : 'Continue'}
          {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};