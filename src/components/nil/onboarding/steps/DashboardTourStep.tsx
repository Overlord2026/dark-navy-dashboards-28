import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  DollarSign, 
  FileText, 
  Users, 
  BarChart3,
  Calendar,
  Shield,
  Smartphone,
  Bell
} from 'lucide-react';

interface DashboardTourStepProps {
  onComplete: (data: any) => void;
  isLoading: boolean;
}

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  features: string[];
  tips: string[];
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'overview',
    title: 'Dashboard Overview',
    description: 'Your central hub for all NIL activities',
    icon: BarChart3,
    features: [
      'Real-time earnings summary',
      'Active contracts overview',
      'Upcoming deadlines and tasks',
      'Performance metrics'
    ],
    tips: [
      'Check your dashboard daily for updates',
      'Use widgets to customize your view'
    ]
  },
  {
    id: 'contracts',
    title: 'Contracts & Offers',
    description: 'Manage all your NIL deals and agreements',
    icon: FileText,
    features: [
      'Review incoming brand offers',
      'Track contract status and milestones',
      'Upload signed agreements',
      'View payment schedules'
    ],
    tips: [
      'Always review contracts with your advisor',
      'Set reminders for deliverable deadlines'
    ]
  },
  {
    id: 'payments',
    title: 'Payments & Earnings',
    description: 'Track your NIL income and payment history',
    icon: DollarSign,
    features: [
      'View payment history and pending payments',
      'Generate tax documents',
      'Set up automatic deposits',
      'Track earnings by brand and contract'
    ],
    tips: [
      'Save a portion of earnings for taxes',
      'Export data for your accountant regularly'
    ]
  },
  {
    id: 'compliance',
    title: 'Compliance & Documents',
    description: 'Stay compliant with NIL regulations',
    icon: Shield,
    features: [
      'Upload required documents',
      'Track compliance status',
      'Access disclosure templates',
      'Submit required reports'
    ],
    tips: [
      'Keep all documents up to date',
      'Review school NIL policies regularly'
    ]
  },
  {
    id: 'team',
    title: 'Team & Collaboration',
    description: 'Work with your family, advisors, and coaches',
    icon: Users,
    features: [
      'Invite family members and advisors',
      'Set permission levels',
      'Share contract updates',
      'Collaborate on decisions'
    ],
    tips: [
      'Include parents in major decisions',
      'Use the message center for communication'
    ]
  },
  {
    id: 'mobile',
    title: 'Mobile App Features',
    description: 'Stay connected on the go',
    icon: Smartphone,
    features: [
      'Upload content directly from your phone',
      'Receive push notifications for deadlines',
      'Quick approval for time-sensitive offers',
      'Take photos for content creation'
    ],
    tips: [
      'Download the mobile app for convenience',
      'Enable notifications for important updates'
    ]
  }
];

export function DashboardTourStep({ onComplete, isLoading }: DashboardTourStepProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [tourStarted, setTourStarted] = useState(false);

  const currentStep = TOUR_STEPS[currentStepIndex];
  const progress = ((currentStepIndex + 1) / TOUR_STEPS.length) * 100;

  const startTour = () => {
    setTourStarted(true);
  };

  const nextStep = () => {
    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, currentStep.id]));
    
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Tour completed
      handleTourComplete();
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const jumpToStep = (stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
  };

  const handleTourComplete = () => {
    onComplete({
      tourCompleted: true,
      completedSteps: Array.from(completedSteps),
      completedAt: new Date().toISOString()
    });
  };

  const skipTour = () => {
    onComplete({
      tourSkipped: true,
      skippedAt: new Date().toISOString()
    });
  };

  if (!tourStarted) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="bg-primary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <Play className="h-10 w-10 text-primary" />
            </div>
            
            <h3 className="text-2xl font-bold mb-4">Welcome to Your NIL Dashboard!</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Take a guided tour to learn about all the features and tools 
              available to help you manage your NIL activities successfully.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {TOUR_STEPS.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={step.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-medium text-sm">{step.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={startTour} size="lg" className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Start Tour (~5 minutes)
              </Button>
              <Button variant="outline" onClick={skipTour}>
                Skip Tour
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Dashboard Tour</h3>
            <Badge variant="secondary">
              Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Progress</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </CardContent>
      </Card>

      {/* Step Navigation */}
      <div className="flex justify-center">
        <div className="flex gap-2">
          {TOUR_STEPS.map((step, index) => (
            <button
              key={step.id}
              onClick={() => jumpToStep(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentStepIndex 
                  ? 'bg-primary' 
                  : completedSteps.has(step.id)
                  ? 'bg-green-500'
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 rounded-lg p-3">
              <currentStep.icon className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{currentStep.title}</CardTitle>
              <p className="text-muted-foreground">{currentStep.description}</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Features */}
          <div>
            <h4 className="font-medium mb-3">Key Features:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentStep.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Bell className="h-4 w-4 text-yellow-600" />
              Pro Tips:
            </h4>
            <ul className="text-sm space-y-1">
              {currentStep.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mock Preview */}
          <div className="border rounded-lg p-6 bg-muted/20">
            <div className="text-center text-muted-foreground">
              <div className="bg-muted rounded w-full h-32 flex items-center justify-center mb-3">
                <currentStep.icon className="h-12 w-12" />
              </div>
              <p className="text-sm">
                This section would show a preview or demo of the {currentStep.title.toLowerCase()} features
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={previousStep}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={skipTour}>
                Skip Tour
              </Button>

              <Button
                onClick={nextStep}
                disabled={isLoading}
                className="flex items-center gap-2 min-w-32"
              >
                {isLoading ? (
                  'Completing...'
                ) : currentStepIndex === TOUR_STEPS.length - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Complete Tour
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}