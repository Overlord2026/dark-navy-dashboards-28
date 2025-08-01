import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  FunnelChart,
  Funnel,
  LabelList
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Filter,
  Download,
  Calendar,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  Funnel as FunnelIcon,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { format } from 'date-fns';

interface LeadAnalytics {
  totalLeads: number;
  conversionRate: number;
  sourceBreakdown: { source: string; count: number; percentage: number }[];
  funnelData: { stage: string; value: number; conversion: number }[];
  timeSeriesData: { date: string; leads: number; conversions: number }[];
  advisorPerformance: { advisor: string; leads: number; conversions: number; rate: number }[];
  campaignPerformance: { campaign: string; leads: number; conversions: number; cost?: number; roi?: number }[];
}

interface Filters {
  dateRange: { from?: Date; to?: Date };
  advisor?: string;
  source?: string;
  campaign?: string;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff00ff'];

export function LeadAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<LeadAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    dateRange: {
      from: new Date(new Date().setDate(new Date().getDate() - 30)),
      to: new Date()
    }
  });
  const [advisors, setAdvisors] = useState<Array<{ id: string; name: string }>>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [campaigns, setCampaigns] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'funnel' | 'sources' | 'advisors'>('overview');

  useEffect(() => {
    fetchAnalytics();
    fetchFilterOptions();
  }, [filters]);

  const fetchFilterOptions = async () => {
    try {
      // Fetch advisors
      const { data: advisorData } = await supabase
        .from('advisor_profiles' as any)
        .select('id, name');
      
      if (advisorData) {
        setAdvisors(advisorData as any);
      }

      // Fetch unique sources
      const { data: sourceData } = await supabase
        .from('leads' as any)
        .select('source')
        .not('source', 'is', null);
      
      if (sourceData) {
        const uniqueSources = [...new Set((sourceData as any).map((item: any) => item.source))].filter(Boolean) as string[];
        setSources(uniqueSources);
      }

      // Fetch unique campaigns
      const { data: campaignData } = await supabase
        .from('leads' as any)
        .select('campaign_source')
        .not('campaign_source', 'is', null);
      
      if (campaignData) {
        const uniqueCampaigns = [...new Set((campaignData as any).map((item: any) => item.campaign_source))].filter(Boolean) as string[];
        setCampaigns(uniqueCampaigns);
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Build query filters
      let query = supabase.from('leads' as any).select(`
        id,
        source,
        campaign_source,
        status,
        created_at,
        lead_assignments!inner (
          advisor_id,
          advisor:advisor_profiles (
            id,
            name
          )
        )
      `);

      if (filters.dateRange.from) {
        query = query.gte('created_at', filters.dateRange.from.toISOString());
      }
      if (filters.dateRange.to) {
        query = query.lte('created_at', filters.dateRange.to.toISOString());
      }
      if (filters.source) {
        query = query.eq('source', filters.source);
      }
      if (filters.campaign) {
        query = query.eq('campaign_source', filters.campaign);
      }

      const { data: leadsData, error } = await query;

      if (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to fetch analytics data');
        return;
      }

      // Process analytics data
      const processedAnalytics = processLeadAnalytics(leadsData || []);
      setAnalytics(processedAnalytics);

    } catch (error) {
      console.error('Error in fetchAnalytics:', error);
      toast.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  const processLeadAnalytics = (leads: any[]): LeadAnalytics => {
    const totalLeads = leads.length;
    const convertedLeads = leads.filter(lead => 
      ['meeting_scheduled', 'proposal_sent', 'closed_won'].includes(lead.status)
    ).length;
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    // Source breakdown
    const sourceMap = new Map<string, number>();
    leads.forEach(lead => {
      const source = lead.source || 'Unknown';
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
    });
    
    const sourceBreakdown = Array.from(sourceMap.entries()).map(([source, count]) => ({
      source,
      count,
      percentage: (count / totalLeads) * 100
    }));

    // Funnel data
    const statusCounts = {
      new: leads.filter(l => l.status === 'new').length,
      contacted: leads.filter(l => ['contacted', 'qualified'].includes(l.status)).length,
      meeting: leads.filter(l => l.status === 'meeting_scheduled').length,
      proposal: leads.filter(l => l.status === 'proposal_sent').length,
      closed: leads.filter(l => l.status === 'closed_won').length
    };

    const funnelData = [
      { stage: 'New Leads', value: statusCounts.new, conversion: 100 },
      { stage: 'Contacted', value: statusCounts.contacted, conversion: totalLeads > 0 ? (statusCounts.contacted / totalLeads) * 100 : 0 },
      { stage: 'Meeting Set', value: statusCounts.meeting, conversion: totalLeads > 0 ? (statusCounts.meeting / totalLeads) * 100 : 0 },
      { stage: 'Proposal Sent', value: statusCounts.proposal, conversion: totalLeads > 0 ? (statusCounts.proposal / totalLeads) * 100 : 0 },
      { stage: 'Closed Won', value: statusCounts.closed, conversion: totalLeads > 0 ? (statusCounts.closed / totalLeads) * 100 : 0 }
    ];

    // Time series data (group by date)
    const dateMap = new Map<string, { leads: number; conversions: number }>();
    leads.forEach(lead => {
      const date = format(new Date(lead.created_at), 'yyyy-MM-dd');
      const existing = dateMap.get(date) || { leads: 0, conversions: 0 };
      existing.leads += 1;
      if (['meeting_scheduled', 'proposal_sent', 'closed_won'].includes(lead.status)) {
        existing.conversions += 1;
      }
      dateMap.set(date, existing);
    });

    const timeSeriesData = Array.from(dateMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Advisor performance
    const advisorMap = new Map<string, { leads: number; conversions: number }>();
    leads.forEach(lead => {
      if (lead.lead_assignments && lead.lead_assignments.length > 0) {
        const advisor = lead.lead_assignments[0].advisor;
        if (advisor) {
          const advisorName = advisor.name;
          const existing = advisorMap.get(advisorName) || { leads: 0, conversions: 0 };
          existing.leads += 1;
          if (['meeting_scheduled', 'proposal_sent', 'closed_won'].includes(lead.status)) {
            existing.conversions += 1;
          }
          advisorMap.set(advisorName, existing);
        }
      }
    });

    const advisorPerformance = Array.from(advisorMap.entries()).map(([advisor, data]) => ({
      advisor,
      ...data,
      rate: data.leads > 0 ? (data.conversions / data.leads) * 100 : 0
    }));

    // Campaign performance
    const campaignMap = new Map<string, { leads: number; conversions: number }>();
    leads.forEach(lead => {
      const campaign = lead.campaign_source || 'Direct';
      const existing = campaignMap.get(campaign) || { leads: 0, conversions: 0 };
      existing.leads += 1;
      if (['meeting_scheduled', 'proposal_sent', 'closed_won'].includes(lead.status)) {
        existing.conversions += 1;
      }
      campaignMap.set(campaign, existing);
    });

    const campaignPerformance = Array.from(campaignMap.entries()).map(([campaign, data]) => ({
      campaign,
      ...data
    }));

    return {
      totalLeads,
      conversionRate,
      sourceBreakdown,
      funnelData,
      timeSeriesData,
      advisorPerformance,
      campaignPerformance
    };
  };

  const exportToCsv = () => {
    if (!analytics) return;

    const csvData = [
      ['Lead Source Analytics'],
      ['Source', 'Count', 'Percentage'],
      ...analytics.sourceBreakdown.map(item => [item.source, item.count.toString(), item.percentage.toFixed(2) + '%']),
      [],
      ['Conversion Funnel'],
      ['Stage', 'Count', 'Conversion Rate'],
      ...analytics.funnelData.map(item => [item.stage, item.value.toString(), item.conversion.toFixed(2) + '%']),
      [],
      ['Advisor Performance'],
      ['Advisor', 'Leads', 'Conversions', 'Rate'],
      ...analytics.advisorPerformance.map(item => [item.advisor, item.leads.toString(), item.conversions.toString(), item.rate.toFixed(2) + '%'])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lead-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('Analytics exported to CSV');
  };

  const exportToPdf = async () => {
    toast.info('PDF export functionality coming soon');
    // This would integrate with a PDF generation library
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lead Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lead Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No analytics data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Lead Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive lead source and conversion tracking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCsv}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={exportToPdf}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button onClick={fetchAnalytics}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <DatePickerWithRange
                date={filters.dateRange}
                onDateChange={(dateRange) => setFilters(prev => ({ ...prev, dateRange }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Advisor</label>
              <Select 
                value={filters.advisor || 'all'} 
                onValueChange={(value) => setFilters(prev => ({ 
                  ...prev, 
                  advisor: value === 'all' ? undefined : value 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Advisors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Advisors</SelectItem>
                  {advisors.map(advisor => (
                    <SelectItem key={advisor.id} value={advisor.id}>
                      {advisor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Source</label>
              <Select 
                value={filters.source || 'all'} 
                onValueChange={(value) => setFilters(prev => ({ 
                  ...prev, 
                  source: value === 'all' ? undefined : value 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Sources" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  {sources.map(source => (
                    <SelectItem key={source} value={source}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Campaign</label>
              <Select 
                value={filters.campaign || 'all'} 
                onValueChange={(value) => setFilters(prev => ({ 
                  ...prev, 
                  campaign: value === 'all' ? undefined : value 
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Campaigns" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
                  {campaigns.map(campaign => (
                    <SelectItem key={campaign} value={campaign}>
                      {campaign}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              In selected period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Meeting scheduled or higher
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.sourceBreakdown[0]?.source || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.sourceBreakdown[0]?.count || 0} leads
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Active Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.campaignPerformance.length}</div>
            <p className="text-xs text-muted-foreground">
              Running campaigns
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'funnel', label: 'Conversion Funnel', icon: FunnelIcon },
          { id: 'sources', label: 'Sources', icon: PieChartIcon },
          { id: 'advisors', label: 'Advisors', icon: Users }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Chart Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Leads Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="leads" stroke="#8884d8" name="Leads" />
                  <Line type="monotone" dataKey="conversions" stroke="#82ca9d" name="Conversions" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.campaignPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="campaign" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="leads" fill="#8884d8" name="Leads" />
                  <Bar dataKey="conversions" fill="#82ca9d" name="Conversions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'funnel' && (
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={analytics.funnelData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="stage" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Funnel Breakdown</h3>
                {analytics.funnelData.map((stage, index) => (
                  <div key={stage.stage} className="flex items-center justify-between p-3 bg-muted rounded">
                    <div>
                      <div className="font-medium">{stage.stage}</div>
                      <div className="text-sm text-muted-foreground">{stage.value} leads</div>
                    </div>
                    <Badge variant="outline">
                      {stage.conversion.toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'sources' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead Sources Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.sourceBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ source, percentage }) => `${source} (${percentage.toFixed(1)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {analytics.sourceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Source Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.sourceBreakdown.map((source, index) => (
                  <div key={source.source} className="flex items-center justify-between p-3 bg-muted rounded">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <div className="font-medium">{source.source}</div>
                        <div className="text-sm text-muted-foreground">{source.count} leads</div>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {source.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'advisors' && (
        <Card>
          <CardHeader>
            <CardTitle>Advisor Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.advisorPerformance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="advisor" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="leads" fill="#8884d8" name="Leads" />
                  <Bar dataKey="conversions" fill="#82ca9d" name="Conversions" />
                </BarChart>
              </ResponsiveContainer>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Advisor Rankings</h3>
                {analytics.advisorPerformance
                  .sort((a, b) => b.rate - a.rate)
                  .map((advisor, index) => (
                    <div key={advisor.advisor} className="flex items-center justify-between p-3 bg-muted rounded">
                      <div>
                        <div className="font-medium">#{index + 1} {advisor.advisor}</div>
                        <div className="text-sm text-muted-foreground">
                          {advisor.leads} leads • {advisor.conversions} conversions
                        </div>
                      </div>
                      <Badge variant={advisor.rate >= 20 ? 'default' : advisor.rate >= 10 ? 'secondary' : 'outline'}>
                        {advisor.rate.toFixed(1)}%
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}