import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  CheckSquare, 
  UserPlus, 
  FileText, 
  Calendar,
  Bell,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  Target
} from 'lucide-react';
import { PracticeKPICards } from './PracticeKPICards';
import { PracticeQuickActions } from './PracticeQuickActions';
import { PracticeTodaysAgenda } from './PracticeTodaysAgenda';
import { PracticeCRMModule } from './modules/PracticeCRMModule';
import { PracticePipelineModule } from './modules/PracticePipelineModule';
import { PracticeBillingModule } from './modules/PracticeBillingModule';
import { PracticeRMDModule } from './modules/PracticeRMDModule';
import { PracticeComplianceModule } from './modules/PracticeComplianceModule';
import { PracticeAnalyticsModule } from './modules/PracticeAnalyticsModule';
import { ADVComplianceFilingsModule } from './modules/ADVComplianceFilingsModule';
import { EventAnalyzer } from '@/pages/EventAnalyzer';

export function AdvisorPracticeDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-6 border border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Your Practice. Your Way. Welcome to BFO! 🎯
            </h1>
            <p className="text-muted-foreground">
              The All-in-One Family Office OS for Elite Advisors
            </p>
          </div>
          <Badge variant="secondary" className="px-3 py-1">
            Practice Management
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <PracticeKPICards />

      {/* Quick Actions */}
      <PracticeQuickActions />

      {/* Today's Agenda */}
      <PracticeTodaysAgenda />

      {/* Main Practice Modules */}
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
          <TabsTrigger value="dashboard" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="crm" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">CRM</span>
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Pipeline</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span className="hidden sm:inline">Billing</span>
          </TabsTrigger>
          <TabsTrigger value="rmd" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">RMD</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-1">
            <CheckSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Compliance</span>
          </TabsTrigger>
          <TabsTrigger value="adv-filings" className="flex items-center gap-1">
            <FileSpreadsheet className="h-4 w-4" />
            <span className="hidden sm:inline">ADV Filings</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Events</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1">
            <PieChart className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>New client onboarded</span>
                    <span className="text-muted-foreground">2h ago</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>RMD calculation completed</span>
                    <span className="text-muted-foreground">4h ago</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Proposal sent to client</span>
                    <span className="text-muted-foreground">1d ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Alerts & Notifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Bell className="h-4 w-4 text-amber-500" />
                    <span>3 RMDs due this month</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Bell className="h-4 w-4 text-blue-500" />
                    <span>2 compliance reviews pending</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Bell className="h-4 w-4 text-green-500" />
                    <span>5 invoices ready to send</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>This Month Revenue</span>
                    <span className="font-medium">$42,500</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Pipeline Value</span>
                    <span className="font-medium">$125,000</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Conversion Rate</span>
                    <span className="font-medium">68%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="crm">
          <PracticeCRMModule />
        </TabsContent>

        <TabsContent value="pipeline">
          <PracticePipelineModule />
        </TabsContent>

        <TabsContent value="billing">
          <PracticeBillingModule />
        </TabsContent>

        <TabsContent value="rmd">
          <PracticeRMDModule />
        </TabsContent>

        <TabsContent value="compliance">
          <PracticeComplianceModule />
        </TabsContent>

        <TabsContent value="adv-filings">
          <ADVComplianceFilingsModule />
        </TabsContent>

        <TabsContent value="events">
          <EventAnalyzer />
        </TabsContent>

        <TabsContent value="analytics">
          <PracticeAnalyticsModule />
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Document Vault & E-Signatures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Document management system coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}