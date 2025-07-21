
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TestDataResetCard } from '@/components/admin/TestDataResetCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Settings, 
  Database, 
  AlertTriangle, 
  CheckCircle, 
  Server,
  Key,
  Globe,
  Monitor
} from 'lucide-react';

export function AdminSettings() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 border border-primary/20">
          <Settings className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
          <p className="text-muted-foreground">Manage system configuration and developer tools</p>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-foreground">Database</span>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                Connected
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-foreground">Auth</span>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-sm font-medium text-foreground">Functions</span>
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                Running
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium text-foreground">Storage</span>
              </div>
              <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                78% Full
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* System Configuration */}
        <Card className="bg-card border-border shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 border border-primary/20">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground">System Configuration</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Core system settings and security configuration
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 px-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center space-x-3">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Authentication Provider</span>
                </div>
                <Badge variant="outline" className="bg-background">Supabase Auth</Badge>
              </div>
              
              <div className="flex items-center justify-between py-3 px-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center space-x-3">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Database Status</span>
                </div>
                <Badge className="bg-success/10 text-success border-success/20">Connected</Badge>
              </div>
              
              <div className="flex items-center justify-between py-3 px-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center space-x-3">
                  <Server className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Edge Functions</span>
                </div>
                <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border/50">
              <Button variant="outline" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Configure System Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Environment & Tools */}
        <Card className="bg-card border-border shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-warning/10 border border-warning/20">
                <Monitor className="h-5 w-5 text-warning" />
              </div>
              <div>
                <CardTitle className="text-foreground">Environment & Tools</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Development environment and testing utilities
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-warning/5 border border-warning/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-warning" />
                <div>
                  <span className="text-sm font-medium text-foreground">Development Environment</span>
                  <p className="text-xs text-muted-foreground mt-1">Enhanced debugging enabled</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/30">
                DEV MODE
              </Badge>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Environment</span>
                </div>
                <span className="text-sm text-warning font-medium">Development</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Debug Mode</span>
                </div>
                <span className="text-sm text-success font-medium">Enabled</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <Button variant="outline" className="w-full">
                <Monitor className="h-4 w-4 mr-2" />
                Open Developer Console
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Data Reset Section - Enhanced */}
      <TestDataResetCard />
    </div>
  );
}
