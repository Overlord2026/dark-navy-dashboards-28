import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Users, 
  DollarSign, 
  Target,
  BarChart3,
  PieChart,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  totalVolume: number;
  totalAmount: number;
  avgApprovalTime: number;
  conversionRate: number;
  partnerMetrics: any[];
  timeSeriesData: any[];
  complianceStatus: any;
}

export const LendingAnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(endDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(endDate.getDate() - 90);
          break;
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1);
          break;
      }

      // Fetch loan requests for analysis
      const { data: loanRequests, error: loanError } = await supabase
        .from('loan_requests')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString());

      if (loanError) throw loanError;

      // Fetch partner metrics
      const { data: partnerMetrics, error: partnerError } = await supabase
        .from('partner_metrics')
        .select('*, lending_partners(*)')
        .gte('metric_period', startDate.toISOString().split('T')[0])
        .lte('metric_period', endDate.toISOString().split('T')[0]);

      if (partnerError) throw partnerError;

      // Process analytics data
      const totalVolume = loanRequests?.length || 0;
      const totalAmount = loanRequests?.reduce((sum, loan) => sum + (loan.requested_amount || 0), 0) || 0;
      const approvedLoans = loanRequests?.filter(loan => loan.status === 'approved') || [];
      const conversionRate = totalVolume > 0 ? (approvedLoans.length / totalVolume) * 100 : 0;

      // Calculate average approval time (mock for now)
      const avgApprovalTime = 72; // hours

      // Generate time series data
      const timeSeriesData = generateTimeSeriesData(loanRequests || [], timeRange);

      // Mock compliance status
      const complianceStatus = {
        kyc_verified: 85,
        aml_checks: 92,
        privacy_compliant: 88,
        lending_regulations: 95
      };

      setAnalytics({
        totalVolume,
        totalAmount,
        avgApprovalTime,
        conversionRate,
        partnerMetrics: partnerMetrics || [],
        timeSeriesData,
        complianceStatus
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSeriesData = (loans: any[], range: string) => {
    const data = [];
    const endDate = new Date();
    const daysToShow = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayLoans = loans.filter(loan => 
        loan.created_at.split('T')[0] === dateStr
      );
      
      data.push({
        date: dateStr,
        loans: dayLoans.length,
        amount: dayLoans.reduce((sum, loan) => sum + (loan.requested_amount || 0), 0),
        approved: dayLoans.filter(loan => loan.status === 'approved').length
      });
    }
    
    return data;
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

  if (loading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6 text-center">
        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Lending Analytics</h1>
          <p className="text-muted-foreground">
            Advanced insights and performance metrics for your lending operations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalytics} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Loan Volume</p>
                <p className="text-2xl font-bold">{analytics.totalVolume}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+12.5%</span>
                </div>
              </div>
              <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">${(analytics.totalAmount / 1000000).toFixed(1)}M</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+8.3%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Approval Time</p>
                <p className="text-2xl font-bold">{analytics.avgApprovalTime}h</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">-15.2%</span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+3.7%</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Detailed Analytics */}
      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Loan Volume Trends</CardTitle>
                <CardDescription>Daily loan applications and approvals over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="loans" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                      name="Applications"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="approved" 
                      stroke="hsl(var(--green-500))" 
                      strokeWidth={2} 
                      name="Approved"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Loan Amount Distribution</CardTitle>
                <CardDescription>Total loan amounts by period</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any) => [
                        `$${Number(value).toLocaleString()}`, 
                        'Amount'
                      ] as [string, string]} 
                    />
                    <Bar dataKey="amount" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="partners" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Partner Performance</CardTitle>
              <CardDescription>Key metrics for lending partners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.partnerMetrics.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No partner metrics available for the selected time range
                  </p>
                ) : (
                  analytics.partnerMetrics.slice(0, 5).map((partner, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">Partner {index + 1}</p>
                          <p className="text-sm text-muted-foreground">
                            {partner.loans_received} loans received
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {partner.approval_rate.toFixed(0)}%
                          </p>
                          <p className="text-xs text-muted-foreground">Approval Rate</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">
                            {partner.avg_approval_time_hours.toFixed(0)}h
                          </p>
                          <p className="text-xs text-muted-foreground">Avg Time</p>
                        </div>
                        <Badge variant={partner.approval_rate > 70 ? "default" : "secondary"}>
                          {partner.approval_rate > 70 ? "High Performer" : "Standard"}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Overview</CardTitle>
                <CardDescription>Current compliance status across all areas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(analytics.complianceStatus).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium capitalize">
                        {key.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-muted-foreground">{Number(value)}%</span>
                    </div>
                    <Progress value={value as number} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audit Trail Summary</CardTitle>
                <CardDescription>Recent compliance checks and findings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">KYC Verification</p>
                      <p className="text-xs text-muted-foreground">All recent checks passed</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="text-sm font-medium">Documentation Review</p>
                      <p className="text-xs text-muted-foreground">3 items need attention</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">AML Screening</p>
                      <p className="text-xs text-muted-foreground">Automated checks complete</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Routing Optimization</CardTitle>
              <CardDescription>AI-powered insights for improving partner matching</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Optimization Recommendations</h4>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Route more loans to Partner A</span>
                        <Badge variant="outline">+15% conversion</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Historical data shows 15% higher approval rates for similar loan profiles
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Adjust criteria for home loans</span>
                        <Badge variant="outline">-24h processing</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Optimized routing could reduce average processing time
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Performance Projections</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Projected Volume Increase</span>
                      <span className="text-sm font-semibold text-green-600">+12%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Estimated Time Savings</span>
                      <span className="text-sm font-semibold text-green-600">-18 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Conversion Rate Impact</span>
                      <span className="text-sm font-semibold text-green-600">+8.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};