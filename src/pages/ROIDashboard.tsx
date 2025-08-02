import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
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

const mockMetrics: ROIMetrics = {
  totalAdSpend: 12500,
  totalLeads: 45,
  costPerLead: 277.78,
  qualifiedLeads: 23,
  costPerQualifiedAppt: 543.48,
  clientsWon: 8,
  costPerSale: 1562.50,
  showRate1st: 85.2,
  showRate2nd: 72.1,
  showRate3rd: 63.8,
  conversionRate: 17.8,
  appt1Scheduled: 27,
  appt1Attended: 23,
  appt2Scheduled: 18,
  appt2Attended: 13,
  appt3Scheduled: 10,
  appt3Attended: 8
};

const mockChartData: ChartData[] = [
  { date: '2024-01-01', leads: 12, spend: 2500, costPerLead: 208.33, qualified: 8, appointments: 6, clients: 2 },
  { date: '2024-01-08', leads: 8, spend: 2000, costPerLead: 250, qualified: 5, appointments: 4, clients: 1 },
  { date: '2024-01-15', leads: 15, spend: 3000, costPerLead: 200, qualified: 10, appointments: 8, clients: 3 },
  { date: '2024-01-22', leads: 10, spend: 5000, costPerLead: 500, qualified: 0, appointments: 5, clients: 2 }
];

export const ROIDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<ROIMetrics>(mockMetrics);
  const [chartData, setChartData] = useState<ChartData[]>(mockChartData);
  const [funnelData, setFunnelData] = useState<FunnelData[]>([]);
  const [loading, setLoading] = useState(false);
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

  const { toast } = useToast();

  useEffect(() => {
    // Initialize funnel data
    const funnelData = [
      { name: 'Leads', value: metrics.totalLeads, percentage: 100 },
      { name: 'Qualified', value: metrics.qualifiedLeads, percentage: (metrics.qualifiedLeads / metrics.totalLeads) * 100 },
      { name: '1st Appt Scheduled', value: metrics.appt1Scheduled, percentage: (metrics.appt1Scheduled / metrics.totalLeads) * 100 },
      { name: '1st Appt Attended', value: metrics.appt1Attended, percentage: (metrics.appt1Attended / metrics.totalLeads) * 100 },
      { name: '2nd Appt', value: metrics.appt2Attended, percentage: (metrics.appt2Attended / metrics.totalLeads) * 100 },
      { name: '3rd Appt', value: metrics.appt3Attended, percentage: (metrics.appt3Attended / metrics.totalLeads) * 100 },
      { name: 'Clients Won', value: metrics.clientsWon, percentage: (metrics.clientsWon / metrics.totalLeads) * 100 },
    ];
    setFunnelData(funnelData);
  }, [metrics]);

  const exportToCSV = () => {
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

  const MetricCard: React.FC<{ 
    title: string; 
    value: string | number; 
    icon: React.ReactNode; 
    trend?: number; 
    format?: 'currency' | 'percentage' | 'number' 
  }> = ({ title, value, icon, trend, format = 'number' }) => {
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
          <Button onClick={() => setLoading(true)}>
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
              onDateChange={(newDateRange) => setDateRange(newDateRange && newDateRange.from && newDateRange.to ? { from: newDateRange.from, to: newDateRange.to } : { from: new Date(), to: new Date() })}
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
          title="Conversion Rate"
          value={metrics.conversionRate}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
          format="percentage"
        />
      </div>

      {/* Show Rates */}
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

        {/* Performance Over Time */}
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