import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MainLayout } from '@/components/layout/MainLayout';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  FileText, 
  Users, 
  Settings, 
  Book, 
  Video,
  Award,
  Target,
  Calendar,
  MessageSquare
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  icon: React.ReactNode;
  estimatedTime?: string;
  resources?: { name: string; type: 'video' | 'document' | 'link' }[];
}

export default function OnboardingDashboard() {
  const [onboardingSteps] = useState<OnboardingStep[]>([
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Set up your advisor profile with certifications, specializations, and bio',
      status: 'completed',
      icon: <Users className="h-5 w-5" />,
      estimatedTime: '10 minutes',
      resources: [
        { name: 'Profile Setup Guide', type: 'document' },
        { name: 'Professional Photo Tips', type: 'video' }
      ]
    },
    {
      id: 'compliance',
      title: 'Upload Compliance Documents',
      description: 'Upload required licenses, certifications, and compliance documentation',
      status: 'in-progress',
      icon: <FileText className="h-5 w-5" />,
      estimatedTime: '15 minutes',
      resources: [
        { name: 'Required Documents Checklist', type: 'document' },
        { name: 'Document Upload Tutorial', type: 'video' }
      ]
    },
    {
      id: 'platform',
      title: 'Platform Training',
      description: 'Complete training modules on using the advisor platform effectively',
      status: 'pending',
      icon: <Book className="h-5 w-5" />,
      estimatedTime: '45 minutes',
      resources: [
        { name: 'Platform Overview', type: 'video' },
        { name: 'CRM Training Module', type: 'video' },
        { name: 'Proposal Tool Training', type: 'video' }
      ]
    },
    {
      id: 'first-client',
      title: 'Invite Your First Client',
      description: 'Send your first client invitation and complete a sample proposal',
      status: 'pending',
      icon: <Target className="h-5 w-5" />,
      estimatedTime: '20 minutes',
      resources: [
        { name: 'Client Invitation Guide', type: 'document' },
        { name: 'Creating Your First Proposal', type: 'video' }
      ]
    },
    {
      id: 'settings',
      title: 'Configure Preferences',
      description: 'Set up notifications, integrations, and workflow preferences',
      status: 'pending',
      icon: <Settings className="h-5 w-5" />,
      estimatedTime: '15 minutes',
      resources: [
        { name: 'Settings Configuration', type: 'document' }
      ]
    }
  ]);

  const completedSteps = onboardingSteps.filter(step => step.status === 'completed').length;
  const totalSteps = onboardingSteps.length;
  const progressPercent = (completedSteps / totalSteps) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Circle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Award className="h-8 w-8" />
            Advisor Onboarding
          </h1>
          <p className="text-muted-foreground">
            Complete your setup to get the most out of your advisor platform
          </p>
        </div>

        {/* Progress Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Onboarding Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">
                  {completedSteps} of {totalSteps} steps completed
                </span>
                <span className="text-2xl font-bold text-primary">
                  {Math.round(progressPercent)}%
                </span>
              </div>
              <Progress value={progressPercent} className="w-full" />
              
              {progressPercent === 100 ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="font-medium">Congratulations! You've completed your onboarding.</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    You're now ready to use all platform features and start working with clients.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Complete all steps to unlock full platform access and start onboarding clients.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Onboarding Steps */}
        <div className="space-y-4">
          {onboardingSteps.map((step, index) => (
            <Card key={step.id} className={`transition-all ${
              step.status === 'completed' ? 'bg-green-50 border-green-200' :
              step.status === 'in-progress' ? 'bg-blue-50 border-blue-200' :
              'bg-gray-50 border-gray-200'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {getStatusIcon(step.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          {step.icon}
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {step.estimatedTime && (
                          <span className="text-xs text-muted-foreground bg-white px-2 py-1 rounded">
                            {step.estimatedTime}
                          </span>
                        )}
                        {getStatusBadge(step.status)}
                      </div>
                    </div>

                    {step.resources && step.resources.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Resources:</h4>
                        <div className="flex flex-wrap gap-2">
                          {step.resources.map((resource, resourceIndex) => (
                            <Button
                              key={resourceIndex}
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                            >
                              {resource.type === 'video' && <Video className="h-3 w-3 mr-1" />}
                              {resource.type === 'document' && <FileText className="h-3 w-3 mr-1" />}
                              {resource.name}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      {step.status === 'pending' && (
                        <Button size="sm">
                          Start Step
                        </Button>
                      )}
                      {step.status === 'in-progress' && (
                        <Button size="sm">
                          Continue
                        </Button>
                      )}
                      {step.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          Review
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Button variant="outline" className="h-auto p-4 justify-start">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-medium">Schedule Training Call</div>
                    <div className="text-sm text-muted-foreground">
                      Book a 1-on-1 onboarding session
                    </div>
                  </div>
                </div>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 justify-start">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6" />
                  <div className="text-left">
                    <div className="font-medium">Contact Support</div>
                    <div className="text-sm text-muted-foreground">
                      Get help with any questions
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}