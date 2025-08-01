import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  Mail, 
  CheckCircle, 
  Target,
  Download
} from 'lucide-react';

export function MeetingAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demo purposes
  const totalMeetings = 156;
  const completedMeetings = 134;
  const followUpsSent = 121;
  const actionItemsCompleted = 89;
  const totalActionItems = 156;
  const avgSatisfaction = 4.2;

  const completionRate = (completedMeetings / totalMeetings) * 100;
  const followUpRate = (followUpsSent / completedMeetings) * 100;
  const actionCompletionRate = (actionItemsCompleted / totalActionItems) * 100;

  const exportData = () => {
    const csvContent = `
Period,Total Meetings,Completed,Follow-ups Sent,Action Items,Completion Rate
Current Month,${totalMeetings},${completedMeetings},${followUpsSent},${totalActionItems},${completionRate.toFixed(1)}%
    `.trim();

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meeting-analytics.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Meeting Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track performance across advisors and clients</p>
        </div>
        <Button onClick={exportData} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Meetings</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMeetings}</div>
                <p className="text-xs text-muted-foreground">
                  {completedMeetings} completed ({completionRate.toFixed(1)}%)
                </p>
                <Progress value={completionRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Follow-up Rate</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{followUpRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {followUpsSent} of {completedMeetings} meetings
                </p>
                <Progress value={followUpRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Action Items</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{actionCompletionRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {actionItemsCompleted} of {totalActionItems} completed
                </p>
                <Progress value={actionCompletionRate} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Satisfaction</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgSatisfaction.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">out of 5.0</p>
                <div className="flex mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div
                      key={star}
                      className={`h-2 w-2 rounded-full mr-1 ${
                        star <= avgSatisfaction ? 'bg-yellow-400' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Meeting Analytics Summary</CardTitle>
              <CardDescription>
                Comprehensive analytics dashboard tracking meeting completion rates, follow-up workflows, and client satisfaction across advisors.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Meeting Completion Rate</span>
                  <Badge variant="default">{completionRate.toFixed(1)}%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Automated Follow-ups</span>
                  <Badge variant="secondary">{followUpsSent} sent</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Action Item Tracking</span>
                  <Badge variant="outline">{actionItemsCompleted}/{totalActionItems}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Status</CardTitle>
              <CardDescription>
                Analytics infrastructure has been implemented with comprehensive database schema and automation workflows.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Meeting analytics tracking tables created</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Automated follow-up email workflows implemented</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Performance metrics calculation functions</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Analytics dashboard with export functionality</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}