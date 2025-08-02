import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  FunnelChart, 
  Funnel, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar, 
  Target, 
  Download,
  FileText,
  Filter,
  Trophy
} from 'lucide-react';
import { useCelebration } from '@/hooks/useCelebration';
import { format, subDays } from 'date-fns';

interface ROIMetrics {
  totalAdSpend: number;
  totalLeads: number;
  costPerLead: number;
  qualifiedLeads: number;
  costPerQualifiedAppt: number;
  clientsWon: number;
  costPerSale: number;
  showRate1st: number;
  showRate2nd: number;
  showRate3rd: number;
  conversionRate: number;
  appt1Scheduled: number;
  appt1Attended: number;
  appt2Scheduled: number;
  appt2Attended: number;
  appt3Scheduled: number;
  appt3Attended: number;
}

interface ChartData {
  date: string;
  leads: number;
  spend: number;
  costPerLead: number;
  qualified: number;
  appointments: number;
  clients: number;
}

interface FunnelData {
  name: string;
  value: number;
  percentage: number;
}

export const ROIDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<ROIMetrics | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [funnelData, setFunnelData] = useState<FunnelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date()
  });
  const [filters, setFilters] = useState({
    advisor: '',
    campaign: '',
    agency: '',
    source: ''
  });
  const [advisors, setAdvisors] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [agencies, setAgencies] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
    fetchFilterOptions();
  }, [dateRange, filters]);

  const fetchFilterOptions = async () => {
    try {
      const [advisorsRes, campaignsRes, agenciesRes] = await Promise.all([
        supabase.from('advisor_profiles').select('id, name, user_id').eq('is_active', true),
        supabase.from('campaigns').select('id, campaign_name').eq('status', 'active'),
        supabase.from('marketing_agencies').select('id, name').eq('status', 'approved'),
      ]);

      setAdvisors(advisorsRes.data || []);
      setCampaigns(campaignsRes.data || []);
      setAgencies(agenciesRes.data || []);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Build query with filters
      let leadsQuery = supabase
        .from('leads')
        .select(`
          *,
          campaigns:campaign_id (campaign_name),
          marketing_agencies:agency_id (name),
          appointments!leads_appointments_lead_id_fkey (
            appt_1_scheduled,
            appt_1_attended,
            appt_2_scheduled,
            appt_2_attended,
            appt_3_scheduled,
            appt_3_attended
          )
        `)
        .gte('created_at', dateRange.from.toISOString())
        .lte('created_at', dateRange.to.toISOString());

      if (filters.advisor) leadsQuery = leadsQuery.eq('advisor_id', filters.advisor);
      if (filters.campaign) leadsQuery = leadsQuery.eq('campaign_id', filters.campaign);
      if (filters.agency) leadsQuery = leadsQuery.eq('agency_id', filters.agency);
      if (filters.source) leadsQuery = leadsQuery.eq('lead_source', filters.source);

      const { data: leads, error: leadsError } = await leadsQuery;

      if (leadsError) throw leadsError;

      // Fetch ad spend data
      let spendQuery = supabase
        .from('ad_spend_tracking')
        .select('*')
        .gte('spend_date', format(dateRange.from, 'yyyy-MM-dd'))
        .lte('spend_date', format(dateRange.to, 'yyyy-MM-dd'));

      if (filters.advisor) spendQuery = spendQuery.eq('advisor_id', filters.advisor);
      if (filters.agency) spendQuery = spendQuery.eq('agency_id', filters.agency);

      const { data: adSpend, error: spendError } = await spendQuery;

      if (spendError) throw spendError;

      // Calculate metrics
      const totalAdSpend = adSpend?.reduce((sum, item) => sum + (item.amount || 0), 0) || 0;
      const totalLeads = leads?.length || 0;
      const qualifiedLeads = leads?.filter(lead => lead.qualified).length || 0;
      const clientsWon = leads?.filter(lead => lead.client_converted).length || 0;

      // Calculate appointment metrics
      let appt1Scheduled = 0, appt1Attended = 0;
      let appt2Scheduled = 0, appt2Attended = 0;
      let appt3Scheduled = 0, appt3Attended = 0;

      leads?.forEach(lead => {
        const appointment = lead.appointments?.[0];
        if (appointment?.appt_1_scheduled) appt1Scheduled++;
        if (appointment?.appt_1_attended) appt1Attended++;
        if (appointment?.appt_2_scheduled) appt2Scheduled++;
        if (appointment?.appt_2_attended) appt2Attended++;
        if (appointment?.appt_3_scheduled) appt3Scheduled++;
        if (appointment?.appt_3_attended) appt3Attended++;
      });

      const costPerLead = totalLeads > 0 ? totalAdSpend / totalLeads : 0;
      const costPerQualifiedAppt = appt1Attended > 0 ? totalAdSpend / appt1Attended : 0;
      const costPerSale = clientsWon > 0 ? totalAdSpend / clientsWon : 0;
      const showRate1st = appt1Scheduled > 0 ? (appt1Attended / appt1Scheduled) * 100 : 0;
      const showRate2nd = appt2Scheduled > 0 ? (appt2Attended / appt2Scheduled) * 100 : 0;
      const showRate3rd = appt3Scheduled > 0 ? (appt3Attended / appt3Scheduled) * 100 : 0;
      const conversionRate = totalLeads > 0 ? (clientsWon / totalLeads) * 100 : 0;

      setMetrics({
        totalAdSpend,
        totalLeads,
        costPerLead,
        qualifiedLeads,
        costPerQualifiedAppt,
        clientsWon,
        costPerSale,
        showRate1st,
        showRate2nd,
        showRate3rd,
        conversionRate,
        appt1Scheduled,
        appt1Attended,
        appt2Scheduled,
        appt2Attended,
        appt3Scheduled,
        appt3Attended
      });

      // Prepare funnel data
      const funnelData = [
        { name: 'Leads', value: totalLeads, percentage: 100 },
        { name: 'Qualified', value: qualifiedLeads, percentage: totalLeads > 0 ? (qualifiedLeads / totalLeads) * 100 : 0 },
        { name: '1st Appt Scheduled', value: appt1Scheduled, percentage: totalLeads > 0 ? (appt1Scheduled / totalLeads) * 100 : 0 },
        { name: '1st Appt Attended', value: appt1Attended, percentage: totalLeads > 0 ? (appt1Attended / totalLeads) * 100 : 0 },
        { name: '2nd Appt', value: appt2Attended, percentage: totalLeads > 0 ? (appt2Attended / totalLeads) * 100 : 0 },
        { name: '3rd Appt', value: appt3Attended, percentage: totalLeads > 0 ? (appt3Attended / totalLeads) * 100 : 0 },
        { name: 'Clients Won', value: clientsWon, percentage: totalLeads > 0 ? (clientsWon / totalLeads) * 100 : 0 },
      ];

      setFunnelData(funnelData);

      // Prepare time-series chart data (group by week)
      const weeklyData = new Map<string, any>();
      
      leads?.forEach(lead => {
        const week = format(new Date(lead.created_at), 'yyyy-MM-dd');
        if (!weeklyData.has(week)) {
          weeklyData.set(week, {
            date: week,
            leads: 0,
            spend: 0,
            qualified: 0,
            appointments: 0,
            clients: 0
          });
        }
        const data = weeklyData.get(week);
        data.leads++;
        if (lead.qualified) data.qualified++;
        if (lead.appointments?.[0]?.appt_1_attended) data.appointments++;
        if (lead.client_converted) data.clients++;
      });

      adSpend?.forEach(spend => {
        const date = format(new Date(spend.spend_date), 'yyyy-MM-dd');
        if (weeklyData.has(date)) {
          weeklyData.get(date).spend += spend.amount || 0;
        } else {
          weeklyData.set(date, {
            date,
            leads: 0,
            spend: spend.amount || 0,
            qualified: 0,
            appointments: 0,
            clients: 0
          });
        }
      });

      const chartData = Array.from(weeklyData.values()).map(data => ({
        ...data,
        costPerLead: data.leads > 0 ? data.spend / data.leads : 0
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setChartData(chartData);

    } catch (error) {
      console.error('Error fetching ROI data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch ROI data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!metrics || !chartData.length) return;

    const csvData = [
      ['Date', 'Leads', 'Ad Spend', 'Cost Per Lead', 'Qualified', 'Appointments', 'Clients'],
      ...chartData.map(row => [
        row.date,
        row.leads,
        row.spend.toFixed(2),
        row.costPerLead.toFixed(2),
        row.qualified,
        row.appointments,
        row.clients
      ])
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `roi-data-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const MetricCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; trend?: number; format?: 'currency' | 'percentage' | 'number' }> = ({ 
    title, 
    value, 
    icon, 
    trend,
    format = 'number' 
  }) => {
    const formatValue = (val: string | number) => {
      if (typeof val === 'string') return val;
      
      switch (format) {
        case 'currency':
          return `$${val.toLocaleString()}`;
        case 'percentage':
          return `${val.toFixed(1)}%`;
        default:
          return val.toLocaleString();
      }
    };

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatValue(value)}</div>
          {trend !== undefined && (
            <p className={`text-xs flex items-center ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              {Math.abs(trend)}% from last period
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading ROI data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">ROI Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track performance across your entire lead funnel</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={fetchData}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Date Range
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <DatePickerWithRange
              date={dateRange}
              onDateChange={setDateRange}
            />

            <Select value={filters.source} onValueChange={(value) => setFilters(prev => ({ ...prev, source: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Sources</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="Google Ads">Google Ads</SelectItem>
                <SelectItem value="Seminar">Seminar</SelectItem>
                <SelectItem value="Agency">Agency</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.advisor} onValueChange={(value) => setFilters(prev => ({ ...prev, advisor: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Advisors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Advisors</SelectItem>
                {advisors.map((advisor) => (
                  <SelectItem key={advisor.id} value={advisor.user_id}>
                    {advisor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.campaign} onValueChange={(value) => setFilters(prev => ({ ...prev, campaign: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Campaigns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Campaigns</SelectItem>
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.campaign_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.agency} onValueChange={(value) => setFilters(prev => ({ ...prev, agency: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="All Agencies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Agencies</SelectItem>
                {agencies.map((agency) => (
                  <SelectItem key={agency.id} value={agency.id}>
                    {agency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => setFilters({ advisor: '', campaign: '', agency: '', source: '' })}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Total Ad Spend"
            value={metrics.totalAdSpend}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            format="currency"
          />
          <MetricCard
            title="Total Leads"
            value={metrics.totalLeads}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <MetricCard
            title="Cost Per Lead"
            value={metrics.costPerLead}
            icon={<Target className="h-4 w-4 text-muted-foreground" />}
            format="currency"
          />
          <MetricCard
            title="Qualified Leads"
            value={metrics.qualifiedLeads}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />
          <MetricCard
            title="Cost Per Qualified Appt"
            value={metrics.costPerQualifiedAppt}
            icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
            format="currency"
          />
          <MetricCard
            title="Clients Won"
            value={metrics.clientsWon}
            icon={<Target className="h-4 w-4 text-muted-foreground" />}
          />
          <MetricCard
            title="Cost Per Sale"
            value={metrics.costPerSale}
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            format="currency"
          />
          <MetricCard
            title="Conversion Rate"
            value={metrics.conversionRate}
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            format="percentage"
          />
        </div>
      )}

      {/* Show Rates */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">1st Appointment Show Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.showRate1st.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {metrics.appt1Attended} attended / {metrics.appt1Scheduled} scheduled
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">2nd Appointment Show Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.showRate2nd.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {metrics.appt2Attended} attended / {metrics.appt2Scheduled} scheduled
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">3rd Appointment Show Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.showRate3rd.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {metrics.appt3Attended} attended / {metrics.appt3Scheduled} scheduled
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Conversion Funnel</CardTitle>
            <CardDescription>Track prospects through each stage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <FunnelChart data={funnelData}>
                <Tooltip formatter={(value, name) => [`${value} (${funnelData.find(d => d.name === name)?.percentage.toFixed(1)}%)`, name]} />
                <Funnel
                  dataKey="value"
                  data={funnelData}
                  isAnimationActive
                >
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${210 + index * 30}, 70%, 50%)`} />
                  ))}
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Time-based ROI */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Over Time</CardTitle>
            <CardDescription>Leads and cost per lead trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="leads" fill="#8884d8" name="Leads" />
                <Line yAxisId="right" type="monotone" dataKey="costPerLead" stroke="#82ca9d" name="Cost Per Lead" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Ad Spend vs Results */}
      <Card>
        <CardHeader>
          <CardTitle>Ad Spend vs Results</CardTitle>
          <CardDescription>Compare investment to outcomes over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="spend" fill="#ffc658" name="Ad Spend" />
              <Bar dataKey="qualified" fill="#8884d8" name="Qualified Leads" />
              <Bar dataKey="clients" fill="#82ca9d" name="Clients Won" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};