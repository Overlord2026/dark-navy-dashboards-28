import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NILAnalyticsDashboard from '@/components/analytics/NILAnalyticsDashboard';
import NILAdminMonitoring from '@/components/admin/NILAdminMonitoring';
import NILCoachOutreach from '@/components/education/NILCoachOutreach';
import { Trophy, Download, Settings, Users, Mail } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NILAdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">NIL Platform Administration</h1>
          <p className="text-muted-foreground">Manage the NIL Education Platform</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Platform Settings
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="monitoring">Athlete Monitoring</TabsTrigger>
          <TabsTrigger value="outreach">Coach Outreach</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  View NIL Landing Page
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Manage Course Content
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  School Partnerships
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Athlete Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  View All Athletes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Progress Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Send Reminders
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Outreach Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Email Templates
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  School Database
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Campaign Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring">
          <NILAdminMonitoring />
        </TabsContent>

        <TabsContent value="outreach">
          <NILCoachOutreach />
        </TabsContent>

        <TabsContent value="analytics">
          <NILAnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NILAdminDashboard;