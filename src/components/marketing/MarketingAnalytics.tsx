import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Mail, 
  Eye, 
  MousePointer, 
  UserPlus,
  Download,
  Calendar,
  Users,
  Target
} from 'lucide-react';

export function MarketingAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');

  // Mock data - replace with real analytics data
  const campaignPerformance = [
    { name: 'VIP Advisors', sent: 245, opened: 98, clicked: 23, converted: 8 },
    { name: 'CPA Beta', sent: 156, opened: 67, clicked: 18, converted: 5 },
    { name: 'Attorney Partnership', sent: 89, opened: 34, clicked: 9, converted: 2 },
    { name: 'Property Managers', sent: 234, opened: 87, clicked: 19, converted: 6 },
    { name: 'Healthcare VIPs', sent: 123, opened: 45, clicked: 12, converted: 3 }
  ];

  const weeklyTrends = [
    { week: 'Week 1', invites: 450, opens: 180, clicks: 45, signups: 12 },
    { week: 'Week 2', invites: 520, opens: 210, clicks: 52, signups: 18 },
    { week: 'Week 3', invites: 680, opens: 272, clicks: 68, signups: 25 },
    { week: 'Week 4', invites: 590, opens: 236, clicks: 59, signups: 21 }
  ];

  const personaDistribution = [
    { name: 'Advisors', value: 35, count: 428 },
    { name: 'Accountants', value: 25, count: 305 },
    { name: 'Attorneys', value: 20, count: 244 },
    { name: 'Property Mgrs', value: 15, count: 183 },
    { name: 'Healthcare', value: 5, count: 61 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const topPerformers = [
    { name: 'VIP Advisor Early Access', conversion: 3.2, status: 'up' },
    { name: 'Healthcare Elite Program', conversion: 2.8, status: 'up' },
    { name: 'Attorney Partnership Drive', conversion: 2.2, status: 'down' },
    { name: 'CPA Beta Launch', conversion: 3.1, status: 'up' },
    { name: 'Property Manager Network', conversion: 2.5, status: 'stable' }
  ];

  const keyMetrics = [
    {
      title: 'Total Invites Sent',
      value: '2,487',
      change: '+12.5%',
      trend: 'up',
      icon: Mail
    },
    {
      title: 'Overall Open Rate',
      value: '41.2%',
      change: '+3.2%',
      trend: 'up',
      icon: Eye
    },
    {
      title: 'Click-Through Rate',
      value: '8.7%',
      change: '-1.1%',
      trend: 'down',
      icon: MousePointer
    },
    {
      title: 'Conversion Rate',
      value: '2.8%',
      change: '+0.8%',
      trend: 'up',
      icon: UserPlus
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Marketing Analytics</h2>
          <p className="text-muted-foreground">Campaign performance and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold">{metric.value}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      {metric.trend === 'up' ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      )}
                      <span className={`text-xs ${
                        metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                  <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>
              Email metrics by campaign
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={campaignPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Bar dataKey="sent" fill="#E5E7EB" name="Sent" />
                <Bar dataKey="opened" fill="#3B82F6" name="Opened" />
                <Bar dataKey="clicked" fill="#10B981" name="Clicked" />
                <Bar dataKey="converted" fill="#F59E0B" name="Converted" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Trends</CardTitle>
            <CardDescription>
              Performance over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Line type="monotone" dataKey="invites" stroke="#3B82F6" name="Invites" />
                <Line type="monotone" dataKey="opens" stroke="#10B981" name="Opens" />
                <Line type="monotone" dataKey="clicks" stroke="#F59E0B" name="Clicks" />
                <Line type="monotone" dataKey="signups" stroke="#EF4444" name="Signups" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Persona Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Distribution</CardTitle>
            <CardDescription>
              Contacts by persona type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={personaDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {personaDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {personaDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Campaigns</CardTitle>
            <CardDescription>
              Highest conversion rates this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((campaign, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {campaign.conversion}% conversion rate
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {campaign.status === 'up' && (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    )}
                    {campaign.status === 'down' && (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <Badge variant={
                      campaign.status === 'up' ? 'default' : 
                      campaign.status === 'down' ? 'destructive' : 'secondary'
                    }>
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights & Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            AI Insights & Recommendations
          </CardTitle>
          <CardDescription>
            Automated suggestions to improve campaign performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-green-400 bg-green-50 p-4">
              <h4 className="font-medium text-green-800">High Performing Segment</h4>
              <p className="text-sm text-green-700 mt-1">
                Healthcare VIPs show 40% higher engagement. Consider increasing allocation to this segment.
              </p>
            </div>
            <div className="border-l-4 border-blue-400 bg-blue-50 p-4">
              <h4 className="font-medium text-blue-800">Optimal Send Time</h4>
              <p className="text-sm text-blue-700 mt-1">
                Tuesday 10 AM shows best open rates. Consider scheduling campaigns for this time window.
              </p>
            </div>
            <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
              <h4 className="font-medium text-yellow-800">Subject Line Optimization</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Subject lines with "VIP" or "Exclusive" show 25% higher open rates. A/B test more variations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}