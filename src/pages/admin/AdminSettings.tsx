
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TestDataResetCard } from '@/components/admin/TestDataResetCard';
import { Shield, Settings, Database, AlertTriangle } from 'lucide-react';

export function AdminSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
          <p className="text-muted-foreground">Manage system configuration and developer tools</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* System Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>System Configuration</CardTitle>
            </div>
            <CardDescription>
              Core system settings and security configuration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Authentication Provider</span>
                <span className="text-sm text-muted-foreground">Supabase Auth</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Database Status</span>
                <span className="text-sm text-green-600">Connected</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Edge Functions</span>
                <span className="text-sm text-green-600">Active</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Developer Tools */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Developer Tools</CardTitle>
            </div>
            <CardDescription>
              Development and testing utilities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-yellow-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Development Environment Detected</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Developer tools are available for testing and data management.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Data Reset Section */}
      <TestDataResetCard />
    </div>
  );
}
