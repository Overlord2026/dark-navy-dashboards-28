import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { 
  DollarSign, 
  TrendingUp, 
  Target, 
  Users, 
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Filter,
  Zap
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

interface ROIMetrics {
  total_spend: number;
  total_leads: number;
  total_appointments: number;
  total_closed: number;
  total_revenue: number;
  cost_per_lead: number;
  cost_per_appointment: number;
  cost_per_close: number;
  roi_percentage: number;
  ltv: number;
  conversion_rate: number;
  close_rate: number;
}

interface CampaignData {
  id: string;
  campaign_name: string;
  source: string;
  spend: number;
  leads: number;
  appointments: number;
  closed: number;
  revenue: number;
  roi: number;
  cpl: number;
  cpc: number;
  period: string;
}

interface ConversionFunnel {
  stage: string;
  count: number;
  percentage: number;
  conversion_rate?: number;
}

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function ROIDashboard() {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<ROIMetrics | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [funnelData, setFunnelData] = useState<ConversionFunnel[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  useEffect(() => {
    loadROIData();
  }, [dateRange, selectedSource, selectedCampaign]);

  const loadROIData = async () => {
    setLoading(true);
    try {
      // Using mock data for demo
      setMetrics({
        total_spend: 15420,
        total_leads: 127,
        total_appointments: 38,
        total_closed: 9,
        total_revenue: 185000,
        cost_per_lead: 121.42,
        cost_per_appointment: 405.79,
        cost_per_close: 1713.33,
        roi_percentage: 1100,
        ltv: 20555,
        conversion_rate: 29.9,
        close_rate: 23.7
      });

      // Mock campaign data
      setCampaigns([
        {
          id: '1',
          campaign_name: 'Google Ads - Retirement Planning',
          source: 'google_ads',
          spend: 8500,
          leads: 67,
          appointments: 20,
          closed: 5,
          revenue: 95000,
          roi: 1018,
          cpl: 126.87,
          cpc: 425.00,
          period: format(new Date(), 'yyyy-MM')
        },
        {
          id: '2',
          campaign_name: 'Facebook Ads - Wealth Management',
          source: 'facebook_ads',
          spend: 4200,
          leads: 42,
          appointments: 12,
          closed: 3,
          revenue: 60000,
          roi: 1329,
          cpl: 100.00,
          cpc: 350.00,
          period: format(new Date(), 'yyyy-MM')
        },
        {
          id: '3',
          campaign_name: 'LinkedIn Sponsored Content',
          source: 'linkedin',
          spend: 2720,
          leads: 18,
          appointments: 6,
          closed: 1,
          revenue: 30000,
          roi: 1003,
          cpl: 151.11,
          cpc: 453.33,
          period: format(new Date(), 'yyyy-MM')
        }
      ]);

      // Mock funnel data
      setFunnelData([
        { stage: 'Leads', count: 127, percentage: 100 },
        { stage: 'Contacted', count: 98, percentage: 77.2, conversion_rate: 77.2 },
        { stage: 'Qualified', count: 65, percentage: 51.2, conversion_rate: 66.3 },
        { stage: 'Appointments', count: 38, percentage: 29.9, conversion_rate: 58.5 },
        { stage: 'Proposals', count: 18, percentage: 14.2, conversion_rate: 47.4 },
        { stage: 'Closed', count: 9, percentage: 7.1, conversion_rate: 50.0 }
      ]);

      toast({
        title: "ROI Data Loaded",
        description: "Campaign performance data updated successfully",
      });

    } catch (error) {
      console.error('Error loading ROI data:', error);
      toast({
        title: "Error",
        description: "Failed to load ROI data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const sourceMatch = selectedSource === 'all' || campaign.source === selectedSource;
      const campaignMatch = selectedCampaign === 'all' || campaign.id === selectedCampaign;
      return sourceMatch && campaignMatch;
    });
  }, [campaigns, selectedSource, selectedCampaign]);

  const sourceData = useMemo(() => {
    const sourceMap = new Map();
    filteredCampaigns.forEach(campaign => {
      const existing = sourceMap.get(campaign.source) || { source: campaign.source, spend: 0, leads: 0, revenue: 0 };
      existing.spend += campaign.spend;
      existing.leads += campaign.leads;
      existing.revenue += campaign.revenue;
      sourceMap.set(campaign.source, existing);
    });
    return Array.from(sourceMap.values());
  }, [filteredCampaigns]);

  const trendData = useMemo(() => {
    // Generate trend data for the last 30 days
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i);
      days.push({
        date: format(date, 'MMM d'),
        spend: Math.floor(Math.random() * 800) + 200,
        leads: Math.floor(Math.random() * 8) + 2,
        revenue: Math.floor(Math.random() * 15000) + 5000,
        roi: Math.floor(Math.random() * 500) + 200
      });
    }
    return days;
  }, []);

  const exportReport = async () => {
    try {
      const reportData = {
        metrics,
        campaigns: filteredCampaigns,
        funnel: funnelData,
        date_range: dateRange,
        generated_at: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `roi-report-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Report Exported",
        description: "ROI report has been downloaded",
      });
    } catch (error) {
      console.error('Error exporting report:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export report",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading ROI data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">ROI Campaign Dashboard</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <DatePicker
              date={dateRange.from}
              onSelect={(date) => date && setDateRange({...dateRange, from: date})}
            />
            <span>to</span>
            <DatePicker
              date={dateRange.to}
              onSelect={(date) => date && setDateRange({...dateRange, to: date})}
            />
          </div>
          
          <Select value={selectedSource} onValueChange={setSelectedSource}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="google_ads">Google Ads</SelectItem>
              <SelectItem value="facebook_ads">Facebook Ads</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={exportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spend</p>
                <p className="text-2xl font-bold">${metrics?.total_spend.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">12% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${metrics?.total_revenue.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">28% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ROI</p>
                <p className="text-2xl font-bold">{metrics?.roi_percentage}%</p>
              </div>
              <Target className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">15% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cost Per Lead</p>
                <p className="text-2xl font-bold">${metrics?.cost_per_lead.toFixed(0)}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <ArrowDownRight className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">8% reduction</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROI Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>ROI Trend (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="roi" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Source Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Performance by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10b981" />
                <Bar dataKey="spend" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Funnel Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelData.map((stage, index) => (
              <div key={stage.stage} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{stage.stage}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {stage.count} ({stage.percentage.toFixed(1)}%)
                    </span>
                    {stage.conversion_rate && (
                      <Badge variant="outline">
                        {stage.conversion_rate.toFixed(1)}% conversion
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                    style={{ width: `${stage.percentage}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-primary-foreground">
                    {stage.count}
                  </div>
                </div>
                {index < funnelData.length - 1 && (
                  <div className="flex justify-center mt-2">
                    <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Campaign</th>
                  <th className="text-left p-2">Source</th>
                  <th className="text-right p-2">Spend</th>
                  <th className="text-right p-2">Leads</th>
                  <th className="text-right p-2">CPL</th>
                  <th className="text-right p-2">Appointments</th>
                  <th className="text-right p-2">Closed</th>
                  <th className="text-right p-2">Revenue</th>
                  <th className="text-right p-2">ROI</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{campaign.campaign_name}</td>
                    <td className="p-2">
                      <Badge variant="outline">{campaign.source}</Badge>
                    </td>
                    <td className="p-2 text-right">${campaign.spend.toLocaleString()}</td>
                    <td className="p-2 text-right">{campaign.leads}</td>
                    <td className="p-2 text-right">${campaign.cpl.toFixed(0)}</td>
                    <td className="p-2 text-right">{campaign.appointments}</td>
                    <td className="p-2 text-right">{campaign.closed}</td>
                    <td className="p-2 text-right">${campaign.revenue.toLocaleString()}</td>
                    <td className="p-2 text-right">
                      <span className={`font-medium ${campaign.roi > 100 ? 'text-green-600' : 'text-red-600'}`}>
                        {campaign.roi}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}