
import React from 'react';
import { ThreeColumnLayout } from "@/components/layout/ThreeColumnLayout";
import { DashboardHeader } from "@/components/ui/DashboardHeader";
import { FeatureFlagToggle } from "@/components/admin/FeatureFlagToggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useFeatureFlagContext } from '@/context/FeatureFlagContext';

const FeatureFlagManager: React.FC = () => {
  const { environment } = useFeatureFlagContext();
  
  return (
    <ThreeColumnLayout title="Feature Flag Manager">
      <div className="container mx-auto py-6 space-y-8">
        <DashboardHeader 
          heading="Feature Flag Manager" 
          text="Manage feature flags for phased development and deployment"
        />
        
        {environment === 'production' && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              You are modifying feature flags in the production environment. These changes will affect all users.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 gap-6">
          <FeatureFlagToggle />
          
          <Card>
            <CardHeader>
              <CardTitle>How to Use Feature Flags</CardTitle>
              <CardDescription>
                Guidelines for implementing phased deployment with feature flags
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">In Components</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`import { useFeatureFlagContext } from '@/context/FeatureFlagContext';

function MyComponent() {
  const { isEnabled } = useFeatureFlagContext();
  
  return (
    <div>
      {isEnabled('ENABLE_ADVANCED_ANALYTICS') && (
        <AdvancedAnalyticsComponent />
      )}
    </div>
  );
}`}</code>
                </pre>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">In Services</h3>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`import { getFeatureFlagService } from '@/services/featureFlagService';

class MyService {
  constructor() {
    this.featureFlags = getFeatureFlagService();
  }
  
  doSomething() {
    if (this.featureFlags.isEnabled('USE_LOCAL_STORAGE')) {
      // Use local storage implementation
    } else {
      // Use API implementation
    }
  }
}`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ThreeColumnLayout>
  );
};

export default FeatureFlagManager;
