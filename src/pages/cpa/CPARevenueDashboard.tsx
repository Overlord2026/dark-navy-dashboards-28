import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardHeader } from '@/components/ui/DashboardHeader';
import { KpiTile } from '@/components/admin/KpiTile';
import { ResponsiveChart } from '@/components/ui/responsive-chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, Users, Percent, Target, ArrowUpRight } from 'lucide-react';

// Mock data for demonstration
const revenueGrowthData = [
  { month: 'Jan', revenue: 45000, growth: 5.2 },
  { month: 'Feb', revenue: 48000, growth: 6.7 },
  { month: 'Mar', revenue: 52000, growth: 8.3 },
  { month: 'Apr', revenue: 49000, growth: -5.8 },
  { month: 'May', revenue: 54000, growth: 10.2 },
  { month: 'Jun', revenue: 58000, growth: 7.4 },
];

const crossSellData = [
  { service: 'Tax Prep', revenue: 180000, clients: 45 },
  { service: 'Financial Planning', revenue: 95000, clients: 23 },
  { service: 'Bookkeeping', revenue: 120000, clients: 38 },
  { service: 'Payroll', revenue: 75000, clients: 28 },
  { service: 'Advisory', revenue: 65000, clients: 15 },
];

const retentionData = [
  { name: 'Retained', value: 87, color: 'hsl(var(--primary))' },
  { name: 'Churned', value: 13, color: 'hsl(var(--muted))' },
];

const clientSegmentData = [
  { segment: 'Small Business', clients: 45, revenue: 180000, avgFee: 4000 },
  { segment: 'Mid-Market', clients: 23, revenue: 230000, avgFee: 10000 },
  { segment: 'Enterprise', clients: 8, revenue: 320000, avgFee: 40000 },
];

export default function CPARevenueDashboard() {
  return (
    <div className="space-y-6 p-6">
      <DashboardHeader 
        heading="CPA Revenue & Performance Dashboard"
        text="Track cross-sell opportunities, client retention, and fee growth across your practice"
      />

      {/* KPI Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiTile
          title="Monthly Revenue"
          value="$58,000"
          icon={DollarSign}
        />
        <KpiTile
          title="Client Retention"
          value="87%"
          icon={Users}
        />
        <KpiTile
          title="Avg Fee Growth"
          value="+12.3%"
          icon={TrendingUp}
        />
        <KpiTile
          title="Cross-Sell Rate"
          value="34%"
          icon={Target}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue Growth Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveChart height={300}>
              <LineChart data={revenueGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveChart>
          </CardContent>
        </Card>

        {/* Client Retention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Client Retention Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveChart height={300}>
              <PieChart>
                <Pie
                  data={retentionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {retentionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveChart>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Cross-Sell Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Cross-Sell Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveChart height={300}>
              <BarChart data={crossSellData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="service" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveChart>
          </CardContent>
        </Card>

        {/* Client Segment Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Client Segment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {clientSegmentData.map((segment) => (
                <div 
                  key={segment.segment} 
                  className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:border-border/60 transition-colors"
                >
                  <div>
                    <h4 className="font-medium">{segment.segment}</h4>
                    <p className="text-sm text-muted-foreground">
                      {segment.clients} clients • Avg fee: ${segment.avgFee.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">
                      ${segment.revenue.toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm text-green-600">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +8.2%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium">Metric</th>
                  <th className="text-left p-3 font-medium">Current Period</th>
                  <th className="text-left p-3 font-medium">Previous Period</th>
                  <th className="text-left p-3 font-medium">Change</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/40">
                  <td className="p-3">Average Revenue per Client</td>
                  <td className="p-3 font-medium">$7,632</td>
                  <td className="p-3">$6,890</td>
                  <td className="p-3 text-green-600">+10.8%</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="p-3">Client Acquisition Cost</td>
                  <td className="p-3 font-medium">$1,250</td>
                  <td className="p-3">$1,400</td>
                  <td className="p-3 text-green-600">-10.7%</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="p-3">Service Utilization Rate</td>
                  <td className="p-3 font-medium">68%</td>
                  <td className="p-3">61%</td>
                  <td className="p-3 text-green-600">+11.5%</td>
                </tr>
                <tr className="border-b border-border/40">
                  <td className="p-3">Net Promoter Score</td>
                  <td className="p-3 font-medium">72</td>
                  <td className="p-3">68</td>
                  <td className="p-3 text-green-600">+5.9%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}