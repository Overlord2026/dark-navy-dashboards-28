import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Circle, 
  Upload, 
  Users, 
  Calendar,
  Shield,
  Brain,
  Download,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { VaultWatermark } from './VaultWatermark';
import { PatentPendingBadge } from './PatentPendingBadge';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  content: React.ReactNode;
}

export function VaultOnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Your Secure Legacy Vault™',
      description: 'Preserve your family\'s legacy for generations',
      icon: <Shield className="h-6 w-6" />,
      completed: completedSteps.has('welcome'),
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Your Family's Story, Secure Forever
            </h3>
            <p className="text-muted-foreground mb-6">
              Store vital documents, memories, and wisdom—shared your way, for generations.
            </p>
            <PatentPendingBadge />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-gold/20">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">What You Can Store</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Wills, trusts, insurance policies</li>
                  <li>• Family photos, videos, letters</li>
                  <li>• Heirloom recipes and stories</li>
                  <li>• Secure passwords and accounts</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="border-gold/20">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-2">Advanced Features</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• AI Legacy Avatar creation</li>
                  <li>• Event-triggered delivery</li>
                  <li>• Multi-generational access</li>
                  <li>• Complete audit trail</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'upload',
      title: 'Upload & Organize Your Items',
      description: 'Add documents, photos, videos, and messages',
      icon: <Upload className="h-6 w-6" />,
      completed: completedSteps.has('upload'),
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Upload Your Legacy Items</h3>
          
          <div className="grid gap-4">
            <Card className="border-dashed border-2 border-gold/30 hover:border-gold/50 transition-colors">
              <CardContent className="p-8 text-center">
                <Upload className="h-12 w-12 text-gold mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Drag & Drop Files</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Or click to browse and select files from your device
                </p>
                <Button variant="outline" className="border-gold text-gold hover:bg-gold/10">
                  Choose Files
                </Button>
              </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <h5 className="font-medium mb-2">Legal Documents</h5>
                  <p className="text-xs text-muted-foreground">
                    Wills, trusts, POAs, insurance
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <h5 className="font-medium mb-2">Memories</h5>
                  <p className="text-xs text-muted-foreground">
                    Photos, videos, letters, recipes
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <h5 className="font-medium mb-2">Digital Assets</h5>
                  <p className="text-xs text-muted-foreground">
                    Passwords, accounts, crypto keys
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'permissions',
      title: 'Set Access & Permissions',
      description: 'Control who can view and access each item',
      icon: <Users className="h-6 w-6" />,
      completed: completedSteps.has('permissions'),
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Configure Access Control</h3>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Family Members & Heirs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Immediate Family</p>
                    <p className="text-sm text-muted-foreground">Spouse, children</p>
                  </div>
                  <Badge variant="secondary">Full Access</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Extended Family</p>
                    <p className="text-sm text-muted-foreground">Grandchildren, siblings</p>
                  </div>
                  <Badge variant="outline">View Only</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Professional Team</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Attorney</p>
                    <p className="text-sm text-muted-foreground">Legal document access</p>
                  </div>
                  <Badge variant="secondary">Legal Docs</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Financial Advisor</p>
                    <p className="text-sm text-muted-foreground">Financial planning access</p>
                  </div>
                  <Badge variant="secondary">Financial</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'milestones',
      title: 'Set Milestone Triggers',
      description: 'Schedule automatic delivery for future events',
      icon: <Calendar className="h-6 w-6" />,
      completed: completedSteps.has('milestones'),
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Event-Triggered Delivery</h3>
          
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Life Milestones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Circle className="h-4 w-4" />
                  <span>18th Birthday Messages</span>
                  <Badge variant="outline" className="ml-auto">Future</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Circle className="h-4 w-4" />
                  <span>Graduation Letters</span>
                  <Badge variant="outline" className="ml-auto">Future</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Circle className="h-4 w-4" />
                  <span>Wedding Day Videos</span>
                  <Badge variant="outline" className="ml-auto">Future</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Time-Based Release</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Circle className="h-4 w-4" />
                  <span>Annual Family Letters</span>
                  <Badge variant="outline" className="ml-auto">Recurring</Badge>
                </div>
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Circle className="h-4 w-4" />
                  <span>Business Succession Documents</span>
                  <Badge variant="outline" className="ml-auto">Date Trigger</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'avatar',
      title: 'Create Your Legacy Avatar',
      description: 'AI-powered family wisdom for future generations',
      icon: <Brain className="h-6 w-6" />,
      completed: completedSteps.has('avatar'),
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Legacy Copilot™ AI Avatar</h3>
          
          <Card className="border-gold/20 bg-gradient-to-r from-gold/5 to-gold-light/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Brain className="h-12 w-12 text-gold" />
                <div>
                  <h4 className="font-semibold text-lg">AI-Powered Family Wisdom</h4>
                  <p className="text-muted-foreground">
                    Train your avatar to share your life story and values
                  </p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h5 className="font-medium mb-2">What Your Avatar Can Do:</h5>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Answer family history questions</li>
                    <li>• Share business wisdom</li>
                    <li>• Provide life advice</li>
                    <li>• Tell family stories</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Training Process:</h5>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Record audio/video messages</li>
                    <li>• Upload written stories</li>
                    <li>• Answer guided questions</li>
                    <li>• Review and refine responses</li>
                  </ul>
                </div>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-gold to-gold-light text-navy">
                Start Avatar Training
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: 'training',
      title: 'Download Training Materials',
      description: 'Get resources for your family and advisors',
      icon: <Download className="h-6 w-6" />,
      completed: completedSteps.has('training'),
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Training & Support Materials</h3>
          
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Family Member Guides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Family Onboarding Slides</p>
                    <p className="text-sm text-muted-foreground">Getting started guide for relatives</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Next Generation Access Guide</p>
                    <p className="text-sm text-muted-foreground">How heirs can access their legacy</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Professional Team Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Advisor Integration Guide</p>
                    <p className="text-sm text-muted-foreground">How professionals can assist clients</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Compliance & Security Overview</p>
                    <p className="text-sm text-muted-foreground">Security features and audit capabilities</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, steps[currentStep].id]));
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    setCurrentStep(stepIndex);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-navy-light to-navy-dark relative">
      <VaultWatermark opacity={0.05} position="center" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Secure Legacy Vault™ Setup
            </h1>
            <p className="text-white/80 mb-6">
              Let's get your family legacy vault configured step by step
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <PatentPendingBadge />
            </div>
            <Progress value={progress} className="w-full max-w-md mx-auto" />
            <p className="text-sm text-white/60 mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all whitespace-nowrap ${
                    index === currentStep
                      ? 'bg-gold text-navy'
                      : index < currentStep || completedSteps.has(step.id)
                      ? 'bg-gold/20 text-white'
                      : 'bg-white/10 text-white/60'
                  }`}
                >
                  {completedSteps.has(step.id) ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step.icon
                  )}
                  <span className="text-sm font-medium hidden sm:inline">
                    {step.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <Card className="border-gold/20 bg-card/95 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                {steps[currentStep].icon}
                <div>
                  <CardTitle className="text-xl">
                    {steps[currentStep].title}
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {steps[currentStep].description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {steps[currentStep].content}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={currentStep === steps.length - 1}
              className="bg-gradient-to-r from-gold to-gold-light text-navy"
            >
              {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next Step'}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}