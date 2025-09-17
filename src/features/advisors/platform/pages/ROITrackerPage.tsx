import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, DollarSign, Users, Calendar, BarChart3, Filter, Download, Eye, ArrowUp, ArrowDown } from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  getMockROIMetrics,
  getMockChannelPerformance,
  getMockChartData,
  formatCurrency,
  formatPercentage,
  getChannelPerformanceColor,
  type ChannelPerformance
} from '../state/roi.mock';

export default function ROITrackerPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [sortField, setSortField] = useState<keyof ChannelPerformance>('roi');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const roiMetrics = getMockROIMetrics();
  const channelData = getMockChannelPerformance();
  const chartData = getMockChartData();

  const handleSort = (field: keyof ChannelPerformance) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedChannelData = [...channelData].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    return 0;
  });

  const getSortIcon = (field: keyof ChannelPerformance) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  return (
    <>
      <Helmet>
        <title>ROI Tracker | Advisor Platform</title>
        <meta name="description" content="Track marketing ROI, campaign performance, and client acquisition metrics" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
              <TrendingUp className="w-6 h-6" />
              ROI Tracker
            </h1>
            <p className="text-muted-foreground">
              Track marketing ROI, campaign performance, and client acquisition metrics
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Month</SelectItem>
                <SelectItem value="3m">3 Months</SelectItem>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="12m">12 Months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button size="sm">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Total Spend</p>
                  <p className="text-3xl font-bold text-foreground">{formatCurrency(roiMetrics.totalSpend)}</p>
                  <p className="text-xs text-muted-foreground mt-1">{roiMetrics.period}</p>
                </div>
                <div className="p-3 bg-red-500/10 rounded-lg">
                  <DollarSign className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Conversion Rate</p>
                  <p className="text-3xl font-bold text-foreground">{formatPercentage(roiMetrics.conversionRate)}</p>
                  <p className="text-xs text-green-600 mt-1">+2.1% vs last period</p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">New Prospects</p>
                  <p className="text-3xl font-bold text-foreground">{roiMetrics.newProspects}</p>
                  <p className="text-xs text-blue-600 mt-1">+15 vs last period</p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">New AUM</p>
                  <p className="text-3xl font-bold text-foreground">{formatCurrency(roiMetrics.newAUM)}</p>
                  <p className="text-xs text-purple-600 mt-1">+18% vs last period</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Spend vs Prospects Bar Chart */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Monthly Spend vs Prospects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                      formatter={(value, name) => [
                        name === 'spend' ? formatCurrency(value as number) : value,
                        name === 'spend' ? 'Spend' : 'Prospects'
                      ]}
                    />
                    <Legend />
                    <Bar 
                      dataKey="spend" 
                      fill="hsl(var(--primary))" 
                      name="Spend"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="prospects" 
                      fill="hsl(var(--secondary))" 
                      name="Prospects"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* ROI Trend Line Chart */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">ROI Trend Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      domain={['dataMin - 1000', 'dataMax + 1000']}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px'
                      }}
                      formatter={(value) => [`${formatPercentage(value as number)}`, 'ROI %']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="roi" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                      name="ROI %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Channel Performance Table */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Channel Performance</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead 
                      className="text-foreground font-semibold cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleSort('channel')}
                    >
                      <div className="flex items-center gap-2">
                        Channel
                        {getSortIcon('channel')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-foreground font-semibold cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleSort('spend')}
                    >
                      <div className="flex items-center gap-2">
                        Spend
                        {getSortIcon('spend')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-foreground font-semibold cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleSort('prospects')}
                    >
                      <div className="flex items-center gap-2">
                        Prospects
                        {getSortIcon('prospects')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-foreground font-semibold cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleSort('conversions')}
                    >
                      <div className="flex items-center gap-2">
                        Conversions
                        {getSortIcon('conversions')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-foreground font-semibold cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleSort('aum')}
                    >
                      <div className="flex items-center gap-2">
                        New AUM
                        {getSortIcon('aum')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-foreground font-semibold cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleSort('costPerConversion')}
                    >
                      <div className="flex items-center gap-2">
                        Cost/Conversion
                        {getSortIcon('costPerConversion')}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-foreground font-semibold cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => handleSort('roi')}
                    >
                      <div className="flex items-center gap-2">
                        ROI %
                        {getSortIcon('roi')}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedChannelData.map((channel) => (
                    <TableRow key={channel.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="font-medium text-foreground">{channel.channel}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-foreground">{formatCurrency(channel.spend)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-foreground">{channel.prospects}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-foreground">{channel.conversions}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatPercentage((channel.conversions / channel.prospects) * 100)} rate
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-foreground font-medium">{formatCurrency(channel.aum)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-foreground">{formatCurrency(channel.costPerConversion)}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(channel.costPerProspect)}/prospect
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${getChannelPerformanceColor(channel.roi)}`}>
                            {formatPercentage(channel.roi / 100)}
                          </span>
                          {channel.roi >= 12000 && (
                            <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50">
                              Excellent
                            </Badge>
                          )}
                          {channel.roi >= 8000 && channel.roi < 12000 && (
                            <Badge variant="outline" className="text-yellow-700 border-yellow-200 bg-yellow-50">
                              Good
                            </Badge>
                          )}
                          {channel.roi < 8000 && (
                            <Badge variant="outline" className="text-red-700 border-red-200 bg-red-50">
                              Needs Improvement
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Top Performing Channels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedChannelData.slice(0, 3).map((channel, index) => (
                  <div key={channel.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{channel.channel}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(channel.aum)} AUM • {formatPercentage(channel.roi / 100)} ROI
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-foreground">{channel.conversions}</div>
                      <div className="text-xs text-muted-foreground">conversions</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="font-medium text-green-800">Best ROI Channel</div>
                  <div className="text-sm text-green-700">
                    Webinar Series delivering {formatPercentage(13900 / 100)} ROI with lowest cost per conversion
                  </div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="font-medium text-blue-800">Highest Volume</div>
                  <div className="text-sm text-blue-700">
                    Webinars generated 45 prospects this period, 20% more than LinkedIn
                  </div>
                </div>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="font-medium text-orange-800">Optimization Opportunity</div>
                  <div className="text-sm text-orange-700">
                    Google Ads has the highest cost per conversion - consider refining targeting
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}