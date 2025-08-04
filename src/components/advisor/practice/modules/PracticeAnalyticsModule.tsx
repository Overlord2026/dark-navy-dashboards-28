import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Calendar,
  Users,
  DollarSign,
  Target,
  Award,
  Filter,
  Download,
  Share
} from 'lucide-react';

export function PracticeAnalyticsModule() {
  const practiceMetrics = {
    totalRevenue: '$302,500',
    revenueGrowth: '+15.2%',
    activeClients: 127,
    clientGrowth: '+8.3%',
    avgClientValue: '$2,380',
    conversionRate: '68%',
    retention: '94.5%',
    referralRate: '23%'
  };

  const revenueBySource = [
    { source: 'Management Fees', amount: '$245,000', percentage: 81 },
    { source: 'Planning Fees', amount: '$35,000', percentage: 12 },
    { source: 'Performance Fees', amount: '$15,500', percentage: 5 },
    { source: 'Other', amount: '$7,000', percentage: 2 }
  ];

  const clientSegments = [
    { segment: 'High Net Worth', count: 28, aum: '$15.2M', color: 'bg-purple-500' },
    { segment: 'Mass Affluent', count: 45, aum: '$6.8M', color: 'bg-blue-500' },
    { segment: 'Professional', count: 32, aum: '$1.8M', color: 'bg-green-500' },
    { segment: 'Institutional', count: 12, aum: '$5.4M', color: 'bg-orange-500' },
    { segment: 'Emerging', count: 10, aum: '$0.4M', color: 'bg-gray-500' }
  ];

  const monthlyMetrics = [
    { month: 'Jan', revenue: 28500, clients: 119, meetings: 45 },
    { month: 'Feb', revenue: 31200, clients: 123, meetings: 52 },
    { month: 'Mar', revenue: 29800, clients: 127, meetings: 48 }
  ];

  const topPerformers = [
    { metric: 'Revenue Growth', value: '+15.2%', rank: '1st', benchmark: 'Top 10%' },
    { metric: 'Client Retention', value: '94.5%', rank: '2nd', benchmark: 'Top 15%' },
    { metric: 'Referral Rate', value: '23%', rank: '3rd', benchmark: 'Top 20%' },
    { metric: 'Conversion Rate', value: '68%', rank: '1st', benchmark: 'Top 5%' }
  ];

  const getSegmentWidth = (count: number, total: number) => {
    return (count / total) * 100;
  };

  const totalClients = clientSegments.reduce((sum, segment) => sum + segment.count, 0);

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-8">
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold">{practiceMetrics.totalRevenue}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">{practiceMetrics.revenueGrowth}</span>
            </div>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold">{practiceMetrics.activeClients}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs text-green-600">{practiceMetrics.clientGrowth}</span>
            </div>
            <p className="text-xs text-muted-foreground">Active Clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold">{practiceMetrics.avgClientValue}</div>
            <p className="text-xs text-muted-foreground">Avg Client Value</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold">{practiceMetrics.conversionRate}</div>
            <p className="text-xs text-muted-foreground">Conversion Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold">{practiceMetrics.retention}</div>
            <p className="text-xs text-muted-foreground">Client Retention</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold">{practiceMetrics.referralRate}</div>
            <p className="text-xs text-muted-foreground">Referral Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold">$24.2M</div>
            <p className="text-xs text-muted-foreground">Total AUM</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-lg font-bold">1.25%</div>
            <p className="text-xs text-muted-foreground">Avg Fee Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue by Source */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Revenue by Source
            </CardTitle>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueBySource.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.source}</span>
                    <div className="text-right">
                      <div className="text-sm font-bold">{item.amount}</div>
                      <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Client Segments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Client Segments
            </CardTitle>
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientSegments.map((segment, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${segment.color}`} />
                    <div>
                      <div className="font-medium text-sm">{segment.segment}</div>
                      <div className="text-xs text-muted-foreground">{segment.count} clients</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">{segment.aum}</div>
                    <div className="text-xs text-muted-foreground">
                      {Math.round(getSegmentWidth(segment.count, totalClients))}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Monthly Performance Trends
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Last 12 Months
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {monthlyMetrics.map((month, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="font-medium text-sm mb-3">{month.month} 2024</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Revenue</span>
                    <span className="text-sm font-medium">${month.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Clients</span>
                    <span className="text-sm font-medium">{month.clients}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Meetings</span>
                    <span className="text-sm font-medium">{month.meetings}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Benchmarks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Industry Benchmarks
          </CardTitle>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {topPerformers.map((performer, index) => (
              <div key={index} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">{performer.rank}</Badge>
                  <Badge variant="outline" className="text-xs">{performer.benchmark}</Badge>
                </div>
                <div className="font-medium text-sm mb-1">{performer.metric}</div>
                <div className="text-2xl font-bold text-green-600">{performer.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Activity Heatmap - Client Interactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Interactive activity heatmap coming soon</p>
            <p className="text-sm">Track daily client interactions, meetings, and follow-ups</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}