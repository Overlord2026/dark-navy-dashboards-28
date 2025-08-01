import React from 'react';
import { ThreeColumnLayout } from '@/components/layout/ThreeColumnLayout';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { ComprehensivePersonaQARunner } from '@/components/qa/ComprehensivePersonaQARunner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Users, Navigation2, Smartphone, Lock } from 'lucide-react';

export const ComprehensiveQATest: React.FC = () => {
  return (
    <ThreeColumnLayout title="Comprehensive QA Test Suite">
      <div className="space-y-6">
        <DashboardHeader 
          heading="Comprehensive QA Test Suite"
          text="Complete persona-based testing for authentication, navigation, feature gating, and mobile responsiveness across all user roles."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Lock className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium text-sm">Authentication</div>
              <div className="text-xs text-muted-foreground">Login & role assignment</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Navigation2 className="h-5 w-5 text-green-600" />
            <div>
              <div className="font-medium text-sm">Navigation</div>
              <div className="text-xs text-muted-foreground">Routes & sidebar links</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Users className="h-5 w-5 text-purple-600" />
            <div>
              <div className="font-medium text-sm">Dashboards</div>
              <div className="text-xs text-muted-foreground">Component rendering</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Shield className="h-5 w-5 text-orange-600" />
            <div>
              <div className="font-medium text-sm">Feature Gating</div>
              <div className="text-xs text-muted-foreground">Permission controls</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <Smartphone className="h-5 w-5 text-pink-600" />
            <div>
              <div className="font-medium text-sm">Mobile</div>
              <div className="text-xs text-muted-foreground">Responsive design</div>
            </div>
          </div>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            This comprehensive test suite validates the entire application across all user personas including:
            Client Basic, Client Premium, Financial Advisor, Accountant, Attorney, Consultant, Administrator, and System Administrator.
            Tests cover authentication flows, dashboard access, navigation functionality, feature gating, and mobile responsiveness.
          </AlertDescription>
        </Alert>
        
        <ComprehensivePersonaQARunner />
      </div>
    </ThreeColumnLayout>
  );
};