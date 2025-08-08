import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Download,
  Filter,
  Target,
  Percent,
  Clock
} from 'lucide-react';

interface CPAReportsAnalyticsProps {
  isPremium?: boolean;
}

export const CPAReportsAnalytics: React.FC<CPAReportsAnalyticsProps> = ({ isPremium }) => {
  const [dateRange, setDateRange] = useState('this-year');
  const [reportType, setReportType] = useState('all');

  const kpiMetrics = [
    {
      title: 'Total Revenue',
      value: '$347,500',
      change: '+24%',
      trend: 'up',
      icon: DollarSign,
      description: 'Revenue growth vs last period'
    },
    {
      title: 'Active Clients',
      value: '234',
      change: '+12',
      trend: 'up',
      icon: Users,
      description: 'Net new clients this period'
    },
    {
      title: 'Avg. Client Value',
      value: '$1,485',
      change: '+8%',
      trend: 'up',
      icon: Target,
      description: 'Average revenue per client'
    },
    {
      title: 'Client Retention',
      value: '94%',
      change: '+2%',
      trend: 'up',
      icon: Percent,
      description: 'Client retention rate'
    }
  ];

  const clientProfitability = [
    {
      client: 'Johnson Family Trust',
      revenue: '$24,500',
      hours: 45,
      rate: '$544',
      profit: '$18,200',
      margin: '74%'
    },
    {
      client: 'TechStart LLC',
      revenue: '$18,750',
      hours: 38,
      rate: '$493',
      profit: '$12,800',
      margin: '68%'
    },
    {
      client: 'Mitchell Holdings',
      revenue: '$31,200',
      hours: 52,
      rate: '$600',
      profit: '$25,600',
      margin: '82%'
    }
  ];

  const servicePackages = [
    {
      service: 'Individual Tax Prep',
      clients: 89,
      avgPrice: '$450',
      revenue: '$40,050',
      growth: '+15%'
    },
    {
      service: 'Business Tax Planning',
      clients: 34,
      avgPrice: '$2,500',
      revenue: '$85,000',
      growth: '+28%'
    },
    {
      service: 'Estate Planning',
      clients: 12,
      avgPrice: '$5,000',
      revenue: '$60,000',
      growth: '+45%'
    },
    {
      service: 'Bookkeeping Services',
      clients: 67,
      avgPrice: '$1,200',
      revenue: '$80,400',
      growth: '+8%'
    }
  ];

  const marketingROI = [
    {
      campaign: 'Tax Season Email Campaign',
      cost: '$1,200',
      leads: 47,
      conversions: 12,
      revenue: '$18,500',
      roi: '1,442%'
    },
    {
      campaign: 'LinkedIn Business Outreach',
      cost: '$850',
      leads: 23,
      conversions: 6,
      revenue: '$24,000',
      roi: '2,724%'
    },
    {
      campaign: 'Referral Program',
      cost: '$2,400',
      leads: 31,
      conversions: 18,
      revenue: '$45,000',
      roi: '1,775%'
    }
  ];

  const renderKPICard = (metric: typeof kpiMetrics[0]) => {
    const IconComponent = metric.icon;
    const isPositive = metric.change.startsWith('+');
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={metric.title}
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <IconComponent className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{metric.title}</CardTitle>
              </div>
              <Badge variant={isPositive ? 'default' : 'destructive'} className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                {metric.change}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-primary mb-1">{metric.value}</div>
            <div className="text-sm text-muted-foreground">{metric.description}</div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Practice Analytics & Reports</h3>
          <p className="text-muted-foreground">Track profitability, client metrics, and business growth</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[150px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map(renderKPICard)}
      </div>

      <Tabs defaultValue="profitability" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profitability">Client Profitability</TabsTrigger>
          <TabsTrigger value="services">Service Tracking</TabsTrigger>
          <TabsTrigger value="marketing">Marketing ROI</TabsTrigger>
        </TabsList>

        <TabsContent value="profitability" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Client Profitability Analysis</CardTitle>
                  <CardDescription>Revenue, hours, and profit margins by client</CardDescription>
                </div>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="high-value">High Value</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-6 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                  <div>Client</div>
                  <div>Revenue</div>
                  <div>Hours</div>
                  <div>Avg Rate</div>
                  <div>Profit</div>
                  <div>Margin</div>
                </div>
                {clientProfitability.map((client, index) => (
                  <div key={index} className="grid grid-cols-6 gap-4 text-sm items-center py-2 border-b">
                    <div className="font-medium">{client.client}</div>
                    <div>{client.revenue}</div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {client.hours}h
                    </div>
                    <div>{client.rate}/hr</div>
                    <div className="text-green-600 font-medium">{client.profit}</div>
                    <div>
                      <Badge variant="outline" className="text-green-600">
                        {client.margin}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Package Performance</CardTitle>
              <CardDescription>Track revenue and growth by service type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {servicePackages.map((service, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <BarChart3 className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{service.service}</div>
                            <div className="text-sm text-muted-foreground">
                              {service.clients} clients • Avg: {service.avgPrice}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-primary">{service.revenue}</div>
                          <Badge variant="default" className="text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {service.growth}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="marketing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Campaign ROI</CardTitle>
              <CardDescription>Performance metrics for lead generation campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-6 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                  <div>Campaign</div>
                  <div>Cost</div>
                  <div>Leads</div>
                  <div>Conversions</div>
                  <div>Revenue</div>
                  <div>ROI</div>
                </div>
                {marketingROI.map((campaign, index) => (
                  <div key={index} className="grid grid-cols-6 gap-4 text-sm items-center py-2 border-b">
                    <div className="font-medium">{campaign.campaign}</div>
                    <div>{campaign.cost}</div>
                    <div>{campaign.leads}</div>
                    <div>{campaign.conversions}</div>
                    <div className="text-green-600 font-medium">{campaign.revenue}</div>
                    <div>
                      <Badge variant="default" className="bg-green-600">
                        {campaign.roi}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">Total Marketing ROI</div>
                    <div className="text-sm text-muted-foreground">
                      $4,450 invested generated $87,500 in revenue
                    </div>
                  </div>
                  <Badge variant="default" className="ml-auto text-lg px-3 py-1 bg-green-600">
                    1,866% ROI
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};