import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, CreditCard, Settings, FileText, Download, Plus, AlertTriangle } from 'lucide-react';
import { SeatManagementPanel } from './SeatManagementPanel';
import { BillingConfigPanel } from './BillingConfigPanel';
import { ComplianceExportPanel } from './ComplianceExportPanel';
import { AgreementTemplatesPanel } from './AgreementTemplatesPanel';
import { OnboardingFlowsPanel } from './OnboardingFlowsPanel';
import { ModuleAccessPanel } from './ModuleAccessPanel';

interface OrganizationAdminDashboardProps {
  organizationId: string;
}

export const OrganizationAdminDashboard: React.FC<OrganizationAdminDashboardProps> = ({
  organizationId
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real implementation, fetch from Supabase
  const stats = {
    totalSeats: 50,
    seatsInUse: 32,
    activeClients: 145,
    monthlyRevenue: 12500,
    pendingAgreements: 8,
    complianceIssues: 2
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Organization Dashboard</h1>
          <p className="text-muted-foreground">
            Manage seats, billing, compliance, and agreements
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Seats
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seat Utilization</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.seatsInUse}/{stats.totalSeats}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((stats.seatsInUse / stats.totalSeats) * 100)}% utilized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Agreements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAgreements}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.complianceIssues}</div>
            <p className="text-xs text-muted-foreground">
              Need resolution
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="seats">Seat Management</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="agreements">Agreements</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest organization activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: 'New client onboarded', user: 'Jane Smith', time: '2 hours ago', type: 'success' },
                    { action: 'Agreement signed', user: 'Mike Johnson', time: '4 hours ago', type: 'info' },
                    { action: 'Seat assigned', user: 'Sarah Wilson', time: '6 hours ago', type: 'info' },
                    { action: 'Compliance export generated', user: 'Admin', time: '1 day ago', type: 'warning' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">by {activity.user}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={activity.type === 'success' ? 'default' : activity.type === 'warning' ? 'secondary' : 'outline'}>
                          {activity.time}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Module Access</CardTitle>
                <CardDescription>Premium features enabled for your organization</CardDescription>
              </CardHeader>
              <CardContent>
                <ModuleAccessPanel organizationId={organizationId} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="seats">
          <SeatManagementPanel organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="billing">
          <BillingConfigPanel organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="compliance">
          <ComplianceExportPanel organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="agreements">
          <AgreementTemplatesPanel organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="onboarding">
          <OnboardingFlowsPanel organizationId={organizationId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};