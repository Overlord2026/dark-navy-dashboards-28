import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Calendar, 
  Star, 
  Download, 
  FileText, 
  Search,
  Target,
  Activity,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  RefreshCw
} from 'lucide-react';

interface AnalyticsMetric {
  title: string;
  value: string | number;
  change: number;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  description: string;
}

interface ChartDataPoint {
  name: string;
  value?: number;
  leads?: number;
  bookings?: number;
  views?: number;
  conversions?: number;
}

const mockMetrics: AnalyticsMetric[] = [
  {
    title: 'Total Leads',
    value: 247,
    change: 12.5,
    changeType: 'positive',
    icon: Target,
    description: 'Client inquiries received this month'
  },
  {
    title: 'Bookings',
    value: 89,
    change: 8.2,
    changeType: 'positive',
    icon: Calendar,
    description: 'Confirmed consultations scheduled'
  },
  {
    title: 'Profile Views',
    value: '3.2K',
    change: -2.1,
    changeType: 'negative',
    icon: Eye,
    description: 'Total profile page visits'
  },
  {
    title: 'Average Rating',
    value: 4.8,
    change: 0.3,
    changeType: 'positive',
    icon: Star,
    description: 'Client satisfaction score'
  },
  {
    title: 'Conversion Rate',
    value: '36%',
    change: 4.7,
    changeType: 'positive',
    icon: TrendingUp,
    description: 'Leads to bookings conversion'
  },
  {
    title: 'Response Time',
    value: '2.4h',
    change: -15.3,
    changeType: 'positive',
    icon: Activity,
    description: 'Average response to inquiries'
  }
];

const monthlyData: ChartDataPoint[] = [
  { name: 'Jan', value: 45, leads: 45, bookings: 12, views: 820, conversions: 27 },
  { name: 'Feb', value: 52, leads: 52, bookings: 18, views: 940, conversions: 35 },
  { name: 'Mar', value: 48, leads: 48, bookings: 15, views: 1100, conversions: 31 },
  { name: 'Apr', value: 61, leads: 61, bookings: 22, views: 1250, conversions: 36 },
  { name: 'May', value: 55, leads: 55, bookings: 19, views: 1180, conversions: 35 },
  { name: 'Jun', value: 67, leads: 67, bookings: 28, views: 1420, conversions: 42 }
];

const serviceData: ChartDataPoint[] = [
  { name: 'Tax Planning', value: 145, leads: 85 },
  { name: 'Estate Planning', value: 120, leads: 72 },
  { name: 'Investment Advisory', value: 98, leads: 58 },
  { name: 'Risk Management', value: 76, leads: 45 },
  { name: 'Business Planning', value: 54, leads: 32 },
  { name: 'Insurance Review', value: 43, leads: 26 }
];

const searchKeywords = [
  { keyword: 'estate planning attorney', searches: 1240, conversions: 45 },
  { keyword: 'tax advisor near me', searches: 980, conversions: 38 },
  { keyword: 'financial planner', searches: 876, conversions: 32 },
  { keyword: 'investment management', searches: 654, conversions: 24 },
  { keyword: 'trust planning', searches: 543, conversions: 21 },
  { keyword: 'retirement planning', searches: 432, conversions: 18 },
  { keyword: 'wealth management', searches: 387, conversions: 16 },
  { keyword: 'tax preparation', searches: 298, conversions: 12 }
];

const engagementData: ChartDataPoint[] = [
  { name: 'Direct Messages', value: 156 },
  { name: 'Profile Downloads', value: 89 },
  { name: 'Document Shares', value: 67 },
  { name: 'Calendar Views', value: 234 },
  { name: 'Review Submissions', value: 45 }
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];

export function MarketplaceAnalytics() {
  const [timeRange, setTimeRange] = useState('6months');
  const [activeTab, setActiveTab] = useState('overview');

  const handleExportCSV = () => {
    const csvData = [
      ['Metric', 'Value', 'Change %', 'Description'],
      ...mockMetrics.map(metric => [
        metric.title,
        metric.value,
        `${metric.change}%`,
        metric.description
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marketplace-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    // In a real implementation, this would generate a PDF report
    alert('PDF export functionality would be implemented with a library like jsPDF or react-pdf');
  };

  const MetricCard = ({ metric }: { metric: AnalyticsMetric }) => {
    const IconComponent = metric.icon;
    const isPositive = metric.changeType === 'positive';
    const isNegative = metric.changeType === 'negative';
    
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{metric.title}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
              <div className="flex items-center gap-1 text-sm">
                {isPositive && <ArrowUpRight className="w-4 h-4 text-green-600" />}
                {isNegative && <ArrowDownRight className="w-4 h-4 text-red-600" />}
                <span className={`${
                  isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-muted-foreground'
                }`}>
                  {Math.abs(metric.change)}%
                </span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
              <IconComponent className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">{metric.description}</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Marketplace Analytics</h1>
          <p className="text-muted-foreground">
            Track your marketplace performance and client engagement
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-2">
              <Download className="w-4 h-4" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-2">
              <FileText className="w-4 h-4" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockMetrics.map((metric, index) => (
              <MetricCard key={index} metric={metric} />
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="leads" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="bookings" stroke="#82ca9d" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Service Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Top Services</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={serviceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversion Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="views" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="leads" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="bookings" stackId="1" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Engagement Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={engagementData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {engagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Service Performance Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Service</th>
                      <th className="text-right p-2">Total Views</th>
                      <th className="text-right p-2">Leads</th>
                      <th className="text-right p-2">Conversion Rate</th>
                      <th className="text-right p-2">Avg. Response Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceData.map((service, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{service.name}</td>
                        <td className="p-2 text-right">{service.value}</td>
                        <td className="p-2 text-right">{service.leads}</td>
                        <td className="p-2 text-right">
                          {service.leads && service.value ? 
                            `${((service.leads / service.value) * 100).toFixed(1)}%` : 
                            'N/A'
                          }
                        </td>
                        <td className="p-2 text-right">2.{index + 1}h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Key Insights Cards */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Peak Performance</h4>
                      <p className="text-sm text-blue-700">
                        Your conversion rate is 36% higher than the marketplace average. 
                        Tax planning services are driving the most engagement.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-900">Opportunity Identified</h4>
                      <p className="text-sm text-green-700">
                        Clients searching for "estate planning attorney" have a 28% higher booking rate. 
                        Consider optimizing your profile for these keywords.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                  <div className="flex items-start gap-3">
                    <Activity className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-amber-900">Response Time Impact</h4>
                      <p className="text-sm text-amber-700">
                        Faster response times (under 2 hours) correlate with 45% higher conversion rates. 
                        Your current average is 2.4 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-2xl font-bold text-primary">#3</div>
                  <div className="text-sm text-muted-foreground">Marketplace Ranking</div>
                </div>
                
                <div className="text-center p-4 bg-secondary/5 rounded-lg">
                  <div className="text-2xl font-bold">94%</div>
                  <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                </div>
                
                <div className="text-center p-4 bg-accent/5 rounded-lg">
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-muted-foreground">Referrals This Month</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Top Search Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Keyword</th>
                      <th className="text-right p-3">Searches</th>
                      <th className="text-right p-3">Your Ranking</th>
                      <th className="text-right p-3">Conversions</th>
                      <th className="text-right p-3">Conversion Rate</th>
                      <th className="text-center p-3">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchKeywords.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{item.keyword}</td>
                        <td className="p-3 text-right">{item.searches.toLocaleString()}</td>
                        <td className="p-3 text-right">
                          <Badge variant={index < 3 ? 'default' : index < 6 ? 'secondary' : 'outline'}>
                            #{index + 1}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">{item.conversions}</td>
                        <td className="p-3 text-right">
                          {((item.conversions / item.searches) * 100).toFixed(1)}%
                        </td>
                        <td className="p-3 text-center">
                          {index % 2 === 0 ? (
                            <TrendingUp className="w-4 h-4 text-green-600 mx-auto" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Keyword Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Keyword Opportunities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { keyword: 'trust planning specialist', potential: 'High', difficulty: 'Medium' },
                  { keyword: 'international tax advisor', potential: 'Medium', difficulty: 'Low' },
                  { keyword: 'family wealth management', potential: 'High', difficulty: 'High' },
                  { keyword: 'estate tax planning', potential: 'Medium', difficulty: 'Medium' },
                  { keyword: 'retirement tax strategy', potential: 'High', difficulty: 'Low' },
                  { keyword: 'business succession planning', potential: 'Medium', difficulty: 'Medium' }
                ].map((opportunity, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <h4 className="font-medium">{opportunity.keyword}</h4>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Potential:</span>
                      <Badge variant={opportunity.potential === 'High' ? 'default' : 'secondary'}>
                        {opportunity.potential}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Difficulty:</span>
                      <Badge variant="outline">
                        {opportunity.difficulty}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}