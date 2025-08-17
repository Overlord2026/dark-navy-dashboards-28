import React, { useState } from 'react';
import { AgentRepAgreements } from '@/components/agents/AgentRepAgreements';
import { AdminEmailBanner } from '@/components/admin/AdminEmailBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Shield, 
  FileText, 
  BarChart3, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  DollarSign,
  Activity
} from 'lucide-react';

interface ClientMetrics {
  totalClients: number;
  activeDeals: number;
  complianceScore: number;
  monthlyRevenue: number;
}

interface ComplianceAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  clientName: string;
  dueDate: string;
}

const SportsAgentOS: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const isAdmin = true; // Replace with actual admin check

  const metrics: ClientMetrics = {
    totalClients: 24,
    activeDeals: 8,
    complianceScore: 94,
    monthlyRevenue: 125000
  };

  const complianceAlerts: ComplianceAlert[] = [
    {
      id: '1',
      type: 'warning',
      message: 'NIL disclosure due for endorsement deal',
      clientName: 'Jordan Mitchell',
      dueDate: '2024-01-15'
    },
    {
      id: '2',
      type: 'error',
      message: 'Missing contract amendment signature',
      clientName: 'Alex Rodriguez',
      dueDate: '2024-01-12'
    },
    {
      id: '3',
      type: 'info',
      message: 'Quarterly review scheduled',
      clientName: 'Taylor Johnson',
      dueDate: '2024-01-20'
    }
  ];

  const recentActivity = [
    { action: 'New NIL deal signed', client: 'Jordan Mitchell', amount: '$25,000', time: '2 hours ago' },
    { action: 'Compliance check completed', client: 'Alex Rodriguez', amount: null, time: '4 hours ago' },
    { action: 'Contract renewed', client: 'Taylor Johnson', amount: '$150,000', time: '1 day ago' },
  ];

  const getAlertIcon = (type: ComplianceAlert['type']) => {
    switch (type) {
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'info': return <CheckCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Banner */}
      <AdminEmailBanner isAdmin={isAdmin} className="m-6" />
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Sports Agent OS</h1>
              <p className="text-muted-foreground">
                Comprehensive client and compliance management platform
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button>
                <Users className="w-4 h-4 mr-2" />
                Add Client
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                    <Users className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.totalClients}</div>
                    <p className="text-xs text-muted-foreground">
                      +2 from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                    <Activity className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.activeDeals}</div>
                    <p className="text-xs text-muted-foreground">
                      3 closing this week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                    <Shield className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.complianceScore}%</div>
                    <Progress value={metrics.complianceScore} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${metrics.monthlyRevenue.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +15% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Compliance Alerts & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      Compliance Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {complianceAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">
                            {alert.clientName} • Due: {alert.dueDate}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          Review
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">
                            {activity.client} • {activity.time}
                          </p>
                        </div>
                        {activity.amount && (
                          <Badge variant="outline">{activity.amount}</Badge>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="clients" className="space-y-6">
              <AgentRepAgreements />
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Compliance Center
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Monitor and manage all compliance requirements
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 border rounded-lg">
                      <CheckCircle className="w-8 h-8 mx-auto text-green-500 mb-2" />
                      <h4 className="font-semibold">NIL Disclosures</h4>
                      <p className="text-sm text-muted-foreground">All up to date</p>
                    </div>
                    <div className="text-center p-6 border rounded-lg">
                      <Clock className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
                      <h4 className="font-semibold">Contract Reviews</h4>
                      <p className="text-sm text-muted-foreground">2 pending</p>
                    </div>
                    <div className="text-center p-6 border rounded-lg">
                      <AlertTriangle className="w-8 h-8 mx-auto text-red-500 mb-2" />
                      <h4 className="font-semibold">Action Required</h4>
                      <p className="text-sm text-muted-foreground">1 urgent</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Performance Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                    <p className="text-muted-foreground">
                      Detailed performance insights and reporting coming soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Document Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Document Library</h3>
                    <p className="text-muted-foreground mb-4">
                      Secure document storage and template management
                    </p>
                    <Button>Upload Document</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SportsAgentOS;