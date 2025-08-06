import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Users, 
  Mail, 
  BarChart3, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Clock,
  Send,
  Eye,
  UserPlus
} from 'lucide-react';
import { CSVContactUpload } from './CSVContactUpload';
import { CampaignBoard } from './CampaignBoard';
import { ContactManager } from './ContactManager';
import { MarketingAnalytics } from './MarketingAnalytics';
import { StaffSOPGuide } from './StaffSOPGuide';
import StaffTaskManager from './StaffTaskManager';
import StaffTrainingModule from './StaffTrainingModule';
import AutomationInsights from './AutomationInsights';

interface CampaignStats {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
}

export function MarketingDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data - replace with real data from your backend
  const campaignStats: CampaignStats = {
    sent: 1248,
    delivered: 1195,
    opened: 487,
    clicked: 143,
    bounced: 53
  };

  const pendingTasks = [
    { id: 1, type: 'bounced', count: 15, message: '15 bounced emails need review' },
    { id: 2, type: 'missing', count: 8, message: '8 contacts missing LinkedIn profiles' },
    { id: 3, type: 'vip', count: 3, message: '3 VIP contacts awaiting approval' }
  ];

  const recentActivity = [
    { action: 'CSV uploaded', count: 245, time: '2 hours ago' },
    { action: 'Campaign sent', count: 89, time: '4 hours ago' },
    { action: 'Contacts reviewed', count: 12, time: '6 hours ago' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Marketing Automation</h1>
          <p className="text-muted-foreground">VIP outreach and campaign management</p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Quick Upload CSV
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Send className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Sent Today</p>
                <p className="text-2xl font-bold">{campaignStats.sent.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Opened</p>
                <p className="text-2xl font-bold">{campaignStats.opened}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((campaignStats.opened / campaignStats.sent) * 100)}% rate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Clicked</p>
                <p className="text-2xl font-bold">{campaignStats.clicked}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((campaignStats.clicked / campaignStats.sent) * 100)}% rate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Needs Review</p>
                <p className="text-2xl font-bold">{pendingTasks.reduce((sum, task) => sum + task.count, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Tasks Alert */}
      {pendingTasks.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-800">
              <Clock className="h-4 w-4 mr-2" />
              Pending Manual Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <span className="text-sm text-yellow-700">{task.message}</span>
                  <Button size="sm" variant="outline">
                    Review
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="sop">SOPs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest marketing automation actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.count} items</p>
                      </div>
                      <Badge variant="outline">{activity.time}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Campaign Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Email delivery and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Delivery Rate</span>
                      <span>{Math.round((campaignStats.delivered / campaignStats.sent) * 100)}%</span>
                    </div>
                    <Progress value={(campaignStats.delivered / campaignStats.sent) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Open Rate</span>
                      <span>{Math.round((campaignStats.opened / campaignStats.delivered) * 100)}%</span>
                    </div>
                    <Progress value={(campaignStats.opened / campaignStats.delivered) * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Click Rate</span>
                      <span>{Math.round((campaignStats.clicked / campaignStats.opened) * 100)}%</span>
                    </div>
                    <Progress value={(campaignStats.clicked / campaignStats.opened) * 100} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <CSVContactUpload />
        </TabsContent>

        <TabsContent value="campaigns">
          <CampaignBoard />
        </TabsContent>

        <TabsContent value="contacts">
          <ContactManager />
        </TabsContent>

        <TabsContent value="analytics">
          <MarketingAnalytics />
        </TabsContent>

        <TabsContent value="tasks">
          <StaffTaskManager />
        </TabsContent>

        <TabsContent value="training">
          <StaffTrainingModule />
        </TabsContent>

        <TabsContent value="automation">
          <AutomationInsights />
        </TabsContent>

        <TabsContent value="sop">
          <StaffSOPGuide />
        </TabsContent>
      </Tabs>
    </div>
  );
}