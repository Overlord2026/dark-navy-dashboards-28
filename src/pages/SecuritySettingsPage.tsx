
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SecurityAuditDashboard } from '@/components/security/SecurityAuditDashboard';
import { SecurityLoginSection } from '@/components/settings/SecurityLoginSection';
import { MFAEnforcement } from '@/components/security/MFAEnforcement';
import { Shield, Users, Key, AlertTriangle } from 'lucide-react';

export function SecuritySettingsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Settings</h1>
          <p className="text-muted-foreground">
            Manage security policies, authentication, and access controls
          </p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="authentication" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Authentication
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Security Audit
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Multi-Factor Authentication</CardTitle>
                <CardDescription>
                  Ensure your account has additional security layers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MFAEnforcement />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Password Policy</CardTitle>
                <CardDescription>
                  Strong password requirements are enforced system-wide
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Minimum length:</span>
                  <span className="font-medium">12 characters</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Complexity:</span>
                  <span className="font-medium">High entropy required</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Password reuse:</span>
                  <span className="font-medium">Last 12 prevented</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Breach protection:</span>
                  <span className="font-medium">Enabled</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
              <CardDescription>
                Current security posture and recent activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-800 dark:text-green-200">Secure</div>
                  <div className="text-sm text-green-600">All systems operational</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Key className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">Active</div>
                  <div className="text-sm text-blue-600">Authentication services</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">Protected</div>
                  <div className="text-sm text-purple-600">User accounts</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="authentication" className="space-y-6">
          <SecurityLoginSection />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Account Management</CardTitle>
              <CardDescription>
                Manage user permissions, roles, and account lifecycle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>User management features will be implemented in Phase 2</p>
                <p className="text-sm">Including role management, account deactivation, and permission audits</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <SecurityAuditDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
