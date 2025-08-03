import React from 'react';
import { PersonaDashboardLayout } from '@/components/dashboard/PersonaDashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, FileSpreadsheet, DollarSign, Calendar, MessageCircle, TrendingUp } from 'lucide-react';
import { AccountantNavigationAudit } from '@/components/accountant/AccountantNavigationAudit';
import { useCelebration } from '@/hooks/useCelebration';

export function AccountantDashboard() {
  const { triggerCelebration, CelebrationComponent } = useCelebration();

  return (
    <PersonaDashboardLayout>
      {CelebrationComponent}
      
      {/* Accountant-specific content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Returns Filed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127</div>
            <p className="text-xs text-muted-foreground">
              This tax season
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Pending Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">7</div>
            <p className="text-xs text-muted-foreground">
              Next 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Avg. Refund
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">$3,247</div>
            <p className="text-xs text-muted-foreground">
              Per client return
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Active Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              Tax prep clients
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Audit Section */}
      <div className="mt-8">
        <AccountantNavigationAudit />
      </div>

      {/* Feedback Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Beta Feedback
            </CardTitle>
            <CardDescription>
              Help us improve the accountant experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full" 
              onClick={() => triggerCelebration('success', 'Thank you for your feedback!')}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Request a Feature
            </Button>
            <Button variant="outline" className="w-full">
              Report an Issue
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Development Roadmap
            </CardTitle>
            <CardDescription>
              Upcoming features and improvements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Time Tracking & Billing</span>
                <span className="text-xs text-success bg-success/10 px-2 py-1 rounded">75% Complete</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Advanced Compliance Tools</span>
                <span className="text-xs text-warning bg-warning/10 px-2 py-1 rounded">In Progress</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Client Portal Integration</span>
                <span className="text-xs text-secondary bg-secondary/10 px-2 py-1 rounded">Q2 2024</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PersonaDashboardLayout>
  );
}