import React from 'react';
import { ToolGate } from '@/components/tools/ToolGate';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  FileText, 
  Users, 
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface NILDashboardProps {
  persona: 'athlete' | 'family' | 'advisor' | 'admin';
}

export function NILDashboard({ persona }: NILDashboardProps) {
  const getPersonaConfig = () => {
    switch (persona) {
      case 'athlete':
        return {
          title: 'Athlete Dashboard',
          subtitle: 'Manage your NIL opportunities and compliance',
          primaryActions: [
            { label: 'View Offers', href: '/nil/offers', icon: DollarSign, toolKey: 'nil-offers' },
            { label: 'Upload Documents', href: '/nil/documents', icon: FileText, toolKey: 'nil-vault' },
            { label: 'Connect Bank', href: '/nil/banking', icon: TrendingUp, toolKey: 'nil-banking' }
          ]
        };
      case 'family':
        return {
          title: 'Family Dashboard',
          subtitle: 'Support your athlete\'s NIL journey',
          primaryActions: [
            { label: 'View Athlete Progress', href: '/nil/athlete-overview', icon: Users, toolKey: 'nil-progress' },
            { label: 'Financial Overview', href: '/nil/finances', icon: DollarSign, toolKey: 'nil-finances' },
            { label: 'Compliance Status', href: '/nil/compliance', icon: CheckCircle, toolKey: 'nil-compliance' }
          ]
        };
      case 'advisor':
        return {
          title: 'Advisor Dashboard',
          subtitle: 'Guide your athletes through NIL compliance',
          primaryActions: [
            { label: 'Client Overview', href: '/nil/clients', icon: Users, toolKey: 'nil-clients' },
            { label: 'Compliance Tools', href: '/nil/compliance-tools', icon: FileText, toolKey: 'nil-compliance-tools' },
            { label: 'Reporting', href: '/nil/reports', icon: TrendingUp, toolKey: 'nil-reports' }
          ]
        };
      case 'admin':
        return {
          title: 'Admin Dashboard',
          subtitle: 'Oversee NIL platform operations',
          primaryActions: [
            { label: 'User Management', href: '/nil/admin/users', icon: Users, toolKey: 'nil-admin-users' },
            { label: 'Compliance Monitoring', href: '/nil/admin/compliance', icon: AlertCircle, toolKey: 'nil-admin-compliance' },
            { label: 'Platform Analytics', href: '/nil/admin/analytics', icon: TrendingUp, toolKey: 'nil-admin-analytics' }
          ]
        };
    }
  };

  const config = getPersonaConfig();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{config.title}</h1>
          <p className="text-muted-foreground">{config.subtitle}</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {persona.charAt(0).toUpperCase() + persona.slice(1)}
        </Badge>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {config.primaryActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {action.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <ToolGate toolKey={action.toolKey || `nil-${action.label.toLowerCase().replace(/\s+/g, '-')}`} fallbackRoute={action.href}>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    data-tool-card={action.toolKey || `nil-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    Open
                  </Button>
                </ToolGate>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Setup Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Profile Completion</span>
              <span>85%</span>
            </div>
            <Progress value={85} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Document Uploads</span>
              <span>60%</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Banking Connection</span>
              <span>100%</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Profile setup completed</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
              <FileText className="h-4 w-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">NIL agreement uploaded</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
              <DollarSign className="h-4 w-4 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Bank account connected</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}