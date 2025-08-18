import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PersonaSwitcher } from '@/components/PersonaSwitcher';
import { QuickActions } from '@/components/QuickActions';
import { ProgressBar } from '@/components/ProgressBar';
import { usePageView } from '@/hooks/usePageView';
import { 
  Link, Upload, Target, TrendingUp, UserPlus, Calendar,
  GraduationCap, Shield, Activity, Award, Building
} from 'lucide-react';

export const FamiliesPage: React.FC = () => {
  usePageView({ page_name: 'families' });
  
  const [selectedLane, setSelectedLane] = useState<string>('owner');

  const lanes = [
    { key: 'owner', label: 'Business Owner', description: 'Entrepreneurs & founders' },
    { key: 'executive', label: 'Corporate Executive', description: 'C-suite & senior leadership' },
    { key: 'physician', label: 'Physician', description: 'Medical professionals' },
    { key: 'dentist', label: 'Dentist', description: 'Dental practice owners' },
    { key: 'women', label: 'Women in Wealth', description: 'Female executives & entrepreneurs' },
    { key: 'athlete', label: 'Professional Athlete', description: 'Sports & entertainment' },
    { key: 'entertainer', label: 'Entertainer', description: 'Media & entertainment' }
  ];

  const quickActions = [
    { id: 'link-accounts', label: 'Link Accounts', icon: Link, href: '/accounts/connect' },
    { id: 'upload-doc', label: 'Upload Document', icon: Upload, href: '/vault/upload' },
    { id: 'create-goal', label: 'Create Goal', icon: Target, href: '/goals/create' },
    { id: 'run-swag', label: 'Run SWAG™', icon: TrendingUp, href: '/calculators/swag' },
    { id: 'invite-pro', label: 'Invite Professional', icon: UserPlus, href: '/marketplace/invite' },
    { id: 'book-review', label: 'Book Review', icon: Calendar, href: '/meetings/book' }
  ];

  const onboardingSteps = [
    { id: 'email', label: 'Verify Email', completed: true },
    { id: 'profile', label: 'Complete Profile', completed: true },
    { id: 'household', label: 'Add Household', completed: false, current: true },
    { id: 'accounts', label: 'Link Accounts', completed: false },
    { id: 'documents', label: 'Upload Documents', completed: false },
    { id: 'goals', label: 'Set Goals', completed: false },
    { id: 'professional', label: 'Invite Professional', completed: false }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/10">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="mb-2">
            Family Office Platform
          </Badge>
          <h1 className="text-4xl font-bold">Welcome to Your Family Office</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive wealth management designed for modern families
          </p>
        </div>

        {/* Persona Switcher */}
        <PersonaSwitcher />

        {/* Lane Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lanes.map((lane) => (
                <Card 
                  key={lane.key}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedLane === lane.key ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedLane(lane.key)}
                >
                  <CardContent className="p-4">
                    <h3 className="font-medium">{lane.label}</h3>
                    <p className="text-sm text-muted-foreground">{lane.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <QuickActions 
          actions={quickActions}
          title="Quick Actions"
          columns={3}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Onboarding Progress */}
          <ProgressBar 
            steps={onboardingSteps}
            title="Onboarding Progress"
          />

          {/* Education Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education For You
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Wealth Planning Basics</h4>
                    <p className="text-sm text-muted-foreground">4 modules • 2 hours</p>
                  </div>
                  <Badge>New</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Tax Optimization Strategies</h4>
                    <p className="text-sm text-muted-foreground">6 modules • 3 hours</p>
                  </div>
                  <Badge variant="outline">In Progress</Badge>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Browse All Courses
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm">Uploaded tax documents</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm">Created retirement goal</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm">Invited financial advisor</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Two-Factor Authentication</span>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Enabled
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Document Encryption</span>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Privacy Score</span>
                <Badge>95/100</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Review Security Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};