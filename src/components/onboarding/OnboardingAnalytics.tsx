import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Download,
  Calendar,
  BarChart3,
  FileText
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface OnboardingAnalyticsData {
  totalInvites: number;
  pendingInvites: number;
  inProgressOnboarding: number;
  completedOnboarding: number;
  expiredInvites: number;
  avgTimeToComplete: number;
  conversionRate: number;
  dropOffPoints: { step: string; dropOffRate: number }[];
  completionByTemplate: { template: string; completions: number; total: number }[];
  timeSeriesData: { date: string; invites: number; completions: number; }[];
}

interface InvitationDetails {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  status: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  time_to_complete?: number;
  current_step?: string;
  template?: string;
  ip_address?: string;
  device_info?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function OnboardingAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<OnboardingAnalyticsData>({
    totalInvites: 0,
    pendingInvites: 0,
    inProgressOnboarding: 0,
    completedOnboarding: 0,
    expiredInvites: 0,
    avgTimeToComplete: 0,
    conversionRate: 0,
    dropOffPoints: [],
    completionByTemplate: [],
    timeSeriesData: []
  });
  
  const [invitationDetails, setInvitationDetails] = useState<InvitationDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  
  const { toast } = useToast();

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Mock data for demonstration - in production, these would be real database queries
      const mockAnalytics: OnboardingAnalyticsData = {
        totalInvites: 145,
        pendingInvites: 23,
        inProgressOnboarding: 34,
        completedOnboarding: 67,
        expiredInvites: 21,
        avgTimeToComplete: 4.2,
        conversionRate: 46.2,
        dropOffPoints: [
          { step: 'Email Verification', dropOffRate: 15 },
          { step: 'Personal Info', dropOffRate: 8 },
          { step: 'Document Upload', dropOffRate: 22 },
          { step: 'Risk Assessment', dropOffRate: 12 },
          { step: 'Account Setup', dropOffRate: 5 }
        ],
        completionByTemplate: [
          { template: 'Standard', completions: 45, total: 89 },
          { template: 'Premium', completions: 22, total: 34 },
          { template: 'High Net Worth', completions: 12, total: 22 }
        ],
        timeSeriesData: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          invites: Math.floor(Math.random() * 8) + 2,
          completions: Math.floor(Math.random() * 5) + 1
        }))
      };

      const mockInvitationDetails: InvitationDetails[] = [
        {
          id: '1',
          email: 'john.doe@example.com',
          first_name: 'John',
          last_name: 'Doe',
          status: 'completed',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          started_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
          completed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          time_to_complete: 3.2,
          template: 'Standard',
          ip_address: '192.168.1.1',
          device_info: 'Chrome/Desktop'
        },
        {
          id: '2',
          email: 'jane.smith@example.com',
          first_name: 'Jane',
          last_name: 'Smith',
          status: 'in_progress',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          started_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          current_step: 'Document Upload',
          template: 'Premium',
          ip_address: '192.168.1.2',
          device_info: 'Safari/Mobile'
        }
      ];

      setAnalyticsData(mockAnalytics);
      setInvitationDetails(mockInvitationDetails);
      
    } catch (error) {
      console.error('Error loading analytics data:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportComplianceReport = async () => {
    try {
      const reportData = {
        generated_at: new Date().toISOString(),
        date_range: dateRange,
        summary: analyticsData,
        detailed_invitations: invitationDetails.map(inv => ({
          ...inv,
          audit_trail: {
            created_at: inv.created_at,
            started_at: inv.started_at,
            completed_at: inv.completed_at,
            ip_address: inv.ip_address,
            device_info: inv.device_info
          }
        }))
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `onboarding-compliance-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: "Compliance report has been exported successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Failed to export compliance report.",
        variant: "destructive"
      });
    }
  };

  const exportCSV = async () => {
    try {
      const csvHeaders = [
        'Email', 'Name', 'Status', 'Template', 'Created Date', 'Started Date', 
        'Completed Date', 'Time to Complete (days)', 'Current Step', 'IP Address', 'Device'
      ].join(',');

      const csvRows = invitationDetails.map(inv => [
        inv.email,
        `${inv.first_name} ${inv.last_name}`,
        inv.status,
        inv.template || '',
        new Date(inv.created_at).toLocaleDateString(),
        inv.started_at ? new Date(inv.started_at).toLocaleDateString() : '',
        inv.completed_at ? new Date(inv.completed_at).toLocaleDateString() : '',
        inv.time_to_complete || '',
        inv.current_step || '',
        inv.ip_address || '',
        inv.device_info || ''
      ].map(field => `"${field}"`).join(','));

      const csvContent = [csvHeaders, ...csvRows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `onboarding-analytics-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "CSV Export Complete",
        description: "Analytics data has been exported to CSV.",
      });
    } catch (error) {
      toast({
        title: "Export Error",
        description: "Failed to export CSV.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const statusDistribution = [
    { name: 'Completed', value: analyticsData.completedOnboarding, color: '#00C49F' },
    { name: 'In Progress', value: analyticsData.inProgressOnboarding, color: '#0088FE' },
    { name: 'Pending', value: analyticsData.pendingInvites, color: '#FFBB28' },
    { name: 'Expired', value: analyticsData.expiredInvites, color: '#FF8042' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Onboarding Analytics</h2>
          <p className="text-muted-foreground">
            Track invitation status, completion rates, and identify improvement opportunities
          </p>
        </div>
        <div className="flex gap-2">
          <DatePickerWithRange
            date={{ from: dateRange.from, to: dateRange.to }}
            onDateChange={(range) => {
              if (range?.from && range?.to) {
                setDateRange({ from: range.from, to: range.to });
              }
            }}
          />
          <Button variant="outline" onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={exportComplianceReport}>
            <FileText className="h-4 w-4 mr-2" />
            Compliance Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Invitations</p>
                <p className="text-2xl font-bold">{analyticsData.totalInvites}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  +12% from last period
                </p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{analyticsData.conversionRate}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <p className="text-xs text-green-600">+3.2% improvement</p>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Time to Complete</p>
                <p className="text-2xl font-bold">{analyticsData.avgTimeToComplete}d</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 text-green-600 mr-1" />
                  <p className="text-xs text-green-600">-0.5d faster</p>
                </div>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Onboarding</p>
                <p className="text-2xl font-bold">{analyticsData.inProgressOnboarding}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Require attention
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="funnel">Funnel Analysis</TabsTrigger>
          <TabsTrigger value="templates">Template Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="invites" stroke="#8884d8" name="Invitations Sent" />
                    <Line type="monotone" dataKey="completions" stroke="#82ca9d" name="Completions" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Drop-off Analysis</CardTitle>
              <p className="text-sm text-muted-foreground">
                Identify where clients are dropping out of the onboarding process
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analyticsData.dropOffPoints}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="step" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Drop-off Rate']} />
                  <Bar dataKey="dropOffRate" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Template Performance</CardTitle>
              <p className="text-sm text-muted-foreground">
                Compare completion rates across different onboarding templates
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.completionByTemplate.map((template, index) => {
                  const completionRate = (template.completions / template.total) * 100;
                  return (
                    <div key={template.template} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{template.template}</span>
                        <Badge variant="outline">
                          {template.completions}/{template.total} ({completionRate.toFixed(1)}%)
                        </Badge>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Completion Trends</CardTitle>
              <p className="text-sm text-muted-foreground">
                Track how onboarding performance changes over time
              </p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analyticsData.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="completions" 
                    stroke="#00C49F" 
                    name="Daily Completions"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}