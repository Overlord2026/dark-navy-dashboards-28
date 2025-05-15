
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const ArchitectureTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">System Architecture</h2>
        <p className="text-muted-foreground">
          Overview of the architectural design and component relationships
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Integration Architecture</CardTitle>
          <CardDescription>
            Current system architecture showing how components interact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Architecture diagram will be displayed here</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Key Components</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2"></div>
                <div>
                  <h4 className="font-medium">Client Portal</h4>
                  <p className="text-sm text-muted-foreground">User-facing application for clients</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2"></div>
                <div>
                  <h4 className="font-medium">Admin Dashboard</h4>
                  <p className="text-sm text-muted-foreground">Administrative control panel</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2"></div>
                <div>
                  <h4 className="font-medium">Document Service</h4>
                  <p className="text-sm text-muted-foreground">Document management and storage</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2"></div>
                <div>
                  <h4 className="font-medium">Authentication Service</h4>
                  <p className="text-sm text-muted-foreground">Identity and access management</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2"></div>
                <div>
                  <h4 className="font-medium">User Authentication</h4>
                  <p className="text-sm text-muted-foreground">SSO and identity verification flow</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2"></div>
                <div>
                  <h4 className="font-medium">Document Processing</h4>
                  <p className="text-sm text-muted-foreground">Upload, validation, and storage workflow</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2"></div>
                <div>
                  <h4 className="font-medium">Reporting Pipeline</h4>
                  <p className="text-sm text-muted-foreground">Data aggregation and reporting process</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 mr-2"></div>
                <div>
                  <h4 className="font-medium">Notification System</h4>
                  <p className="text-sm text-muted-foreground">Events and alerts distribution</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
