import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Phone, 
  MessageSquare, 
  Shield, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Play,
  Sparkles,
  Users,
  Calendar,
  Bell,
  Calculator
} from 'lucide-react';

interface WalkthroughStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
  action?: string;
  highlight?: string;
}

interface CommunicationsWalkthroughProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  persona: 'advisor' | 'attorney' | 'cpa' | 'client';
}

export function CommunicationsWalkthrough({ 
  isOpen, 
  onClose, 
  onComplete, 
  persona 
}: CommunicationsWalkthroughProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const personaSteps: Record<string, WalkthroughStep[]> = {
    advisor: [
      {
        id: 'welcome',
        title: 'Welcome to Your Professional Communications Hub',
        description: 'Transform how you connect with clients and grow your practice',
        content: (
          <div className="space-y-4">
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Get Ready to Revolutionize Client Communications</h3>
              <p className="text-muted-foreground">
                Your new SMS & VoIP suite includes everything you need: unified inbox, 
                compliance archiving, AI-powered features, and seamless client onboarding.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center p-3 border rounded-lg">
                <Phone className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Professional Line</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <MessageSquare className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">Secure Messaging</p>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm font-medium">100% Compliant</p>
              </div>
            </div>
          </div>
        ),
        action: 'Begin Setup'
      },
      {
        id: 'number-setup',
        title: 'Choose Your Professional Number',
        description: 'Port your existing number or select a new one',
        content: (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">📞 Number Options</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span><strong>Port existing:</strong> Keep your current business number (2-5 days)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span><strong>New number:</strong> Instant activation with area code of choice</span>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground">
              Your number will be your clients' direct line to you—separate from personal calls, 
              with professional voicemail and SMS capabilities.
            </p>
          </div>
        ),
        action: 'Set Up Number'
      },
      {
        id: 'unified-inbox',
        title: 'Your Unified Communications Dashboard',
        description: 'See all calls, texts, and voicemails in one place',
        content: (
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-blue-50">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Sample Conversation
              </h4>
              <div className="space-y-2">
                <div className="flex justify-start">
                  <div className="bg-white p-2 rounded-lg shadow-sm max-w-xs">
                    <p className="text-sm">Hi! I'd like to schedule a consultation about my portfolio.</p>
                    <p className="text-xs text-gray-500">Client • 2:30 PM</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-primary text-primary-foreground p-2 rounded-lg max-w-xs">
                    <p className="text-sm">I'd be happy to help! I have availability tomorrow at 10 AM or 2 PM.</p>
                    <p className="text-xs opacity-80">You • 2:35 PM</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              ✨ <strong>Smart Features:</strong> Auto-transcribed voicemails, click-to-call, 
              message templates, and AI-powered response suggestions.
            </div>
          </div>
        ),
        action: 'Explore Inbox'
      },
      {
        id: 'test-drive',
        title: 'Test Drive Your New System',
        description: 'Send your first message and make a call',
        content: (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <h4 className="font-medium text-amber-900 mb-2">🚀 Try It Now!</h4>
              <p className="text-sm text-amber-800 mb-3">
                Send a test message to our support team to see how smooth the experience is.
              </p>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Test Message
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Don't worry—this is just a practice message to help you get comfortable 
              with the interface before you start using it with clients.
            </div>
          </div>
        ),
        action: 'Send Test Message'
      },
      {
        id: 'ai-features',
        title: 'Activate AI-Powered Automation',
        description: 'Let Linda handle reminders and scheduling',
        content: (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border rounded-lg">
                <Bell className="h-5 w-5 text-primary mb-2" />
                <h5 className="font-medium text-sm">Smart Reminders</h5>
                <p className="text-xs text-muted-foreground">Automatic appointment confirmations</p>
              </div>
              <div className="p-3 border rounded-lg">
                <Calendar className="h-5 w-5 text-primary mb-2" />
                <h5 className="font-medium text-sm">Meeting Prep</h5>
                <p className="text-xs text-muted-foreground">AI-generated call summaries</p>
              </div>
              <div className="p-3 border rounded-lg">
                <Users className="h-5 w-5 text-primary mb-2" />
                <h5 className="font-medium text-sm">Lead Nurturing</h5>
                <p className="text-xs text-muted-foreground">Automated follow-up sequences</p>
              </div>
              <div className="p-3 border rounded-lg">
                <MessageSquare className="h-5 w-5 text-primary mb-2" />
                <h5 className="font-medium text-sm">Smart Replies</h5>
                <p className="text-xs text-muted-foreground">AI-suggested responses</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Linda AI will help automate routine communications while you focus on 
              high-value client interactions.
            </p>
          </div>
        ),
        action: 'Enable AI Features'
      },
      {
        id: 'compliance',
        title: 'Your Communications Are Secure & Compliant',
        description: 'All messages archived for regulatory requirements',
        content: (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-green-600" />
                <h4 className="font-medium text-green-900">Compliance Confirmation</h4>
              </div>
              <div className="space-y-2 text-sm text-green-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>All communications encrypted in transit and at rest</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Messages archived for SEC/FINRA audit requirements</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Search and export capabilities for compliance reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Role-based access controls and audit trails</span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className="w-full justify-center py-2">
              ✅ Your communications platform is now 100% compliant
            </Badge>
          </div>
        ),
        action: 'Complete Setup'
      }
    ],
    // Similar structures for other personas...
    attorney: [
      {
        id: 'welcome',
        title: 'Secure Legal Communications Platform',
        description: 'Attorney-client privilege compliant messaging and calls',
        content: (
          <div className="space-y-4">
            <div className="text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Professional Legal Communications</h3>
              <p className="text-muted-foreground">
                Secure, privileged communications with clients, opposing counsel, and court staff. 
                Built-in litigation hold and privilege protection.
              </p>
            </div>
          </div>
        ),
        action: 'Begin Setup'
      }
      // ... more attorney-specific steps
    ],
    cpa: [
      {
        id: 'welcome',
        title: 'Professional Tax & Accounting Communications',
        description: 'Secure client communications for tax season and beyond',
        content: (
          <div className="space-y-4">
            <div className="text-center">
              <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Streamline Tax Season Communications</h3>
              <p className="text-muted-foreground">
                Secure messaging for sensitive financial data, automated document requests, 
                and multi-client communication management.
              </p>
            </div>
          </div>
        ),
        action: 'Begin Setup'
      }
      // ... more CPA-specific steps
    ],
    client: [
      {
        id: 'welcome',
        title: 'Private Family Communications Hub',
        description: 'Secure messaging with your advisory team',
        content: (
          <div className="space-y-4">
            <div className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Connect with Your Advisory Team</h3>
              <p className="text-muted-foreground">
                Direct, secure line to your advisors, attorneys, and service providers. 
                Schedule appointments and share sensitive documents safely.
              </p>
            </div>
          </div>
        ),
        action: 'Begin Setup'
      }
      // ... more client-specific steps
    ]
  };

  const steps = personaSteps[persona] || personaSteps.advisor;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Completed all steps
      onComplete();
      // Show confetti or celebration here
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <DialogTitle className="text-xl">{currentStepData?.title}</DialogTitle>
              <DialogDescription className="mt-1">
                Step {currentStep + 1} of {steps.length} • {currentStepData?.description}
              </DialogDescription>
            </div>
            <Badge variant="outline">{Math.round(progress)}% Complete</Badge>
          </div>
          <Progress value={progress} className="mb-6" />
        </DialogHeader>

        <div className="space-y-6">
          {currentStepData?.content}
        </div>

        <div className="flex items-center justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={currentStep === 0 ? onClose : handlePrevious}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 0 ? 'Close' : 'Previous'}
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

          <Button onClick={handleNext}>
            {currentStep === steps.length - 1 ? (
              <>
                Complete Setup
                <CheckCircle className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                {currentStepData?.action || 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}