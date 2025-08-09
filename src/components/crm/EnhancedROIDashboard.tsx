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
  Clock,
  Gauge,
  TrendingDown,
  FileText
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

interface AgencyKPIs {
  time_to_first_contact: number;
  first_response_sla_percentage: number;
  advisor_responsiveness_score: number;
  average_response_time_minutes: number;
  lead_to_appointment_conversion: number;
  appointment_to_close_conversion: number;
  campaign_attribution_accuracy: number;
  client_lifetime_value: number;
}

interface CohortData {
  campaign_id: string;
  campaign_name: string;
  launch_date: string;
  leads_by_week: number[];
  appointments_by_week: number[];
  closes_by_week: number[];
  revenue_by_week: number[];
  cohort_age_weeks: number;
}

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
  agency_kpis: AgencyKPIs;
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
  first_contact_time: number;
  response_sla: number;
}

const CHART_COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

export function EnhancedROIDashboard() {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<ROIMetrics | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignData[]>([]);
  const [cohorts, setCohorts] = useState<CohortData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedCampaign, setSelectedCampaign] = useState('all');

  useEffect(() => {
    loadEnhancedROIData();
  }, [dateRange, selectedSource, selectedCampaign]);

  const loadEnhancedROIData = async () => {
    setLoading(true);
    try {
      // Enhanced mock data with agency KPIs
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
        close_rate: 23.7,
        agency_kpis: {
          time_to_first_contact: 2.3, // hours
          first_response_sla_percentage: 94.2,
          advisor_responsiveness_score: 8.7,
          average_response_time_minutes: 18,
          lead_to_appointment_conversion: 29.9,
          appointment_to_close_conversion: 23.7,
          campaign_attribution_accuracy: 96.8,
          client_lifetime_value: 20555
        }
      });

      // Enhanced campaign data with agency metrics
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
          period: format(new Date(), 'yyyy-MM'),
          first_contact_time: 1.8,
          response_sla: 96.2
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
          period: format(new Date(), 'yyyy-MM'),
          first_contact_time: 2.1,
          response_sla: 92.8
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
          period: format(new Date(), 'yyyy-MM'),
          first_contact_time: 3.2,
          response_sla: 88.9
        }
      ]);

      // Mock cohort data
      setCohorts([
        {
          campaign_id: '1',
          campaign_name: 'Google Ads - Retirement Planning',
          launch_date: '2024-01-01',
          leads_by_week: [15, 22, 18, 25, 20, 19, 24, 21],
          appointments_by_week: [4, 7, 5, 8, 6, 5, 7, 6],
          closes_by_week: [1, 2, 1, 2, 1, 1, 2, 1],
          revenue_by_week: [20000, 40000, 20000, 40000, 20000, 20000, 40000, 20000],
          cohort_age_weeks: 8
        }
      ]);

      toast({
        title: "Enhanced ROI Data Loaded",
        description: "Agency KPIs and cohort analysis updated successfully",
      });

    } catch (error) {
      console.error('Error loading enhanced ROI data:', error);
      toast({
        title: "Error",
        description: "Failed to load enhanced ROI data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const exportSlideSet = async () => {
    try {
      const slideData = {
        title: "Agency Performance KPIs",
        slides: [
          {
            title: "Campaign Performance Overview",
            metrics: {
              total_spend: metrics?.total_spend,
              total_revenue: metrics?.total_revenue,
              roi_percentage: metrics?.roi_percentage
            }
          },
          {
            title: "Agency KPIs Dashboard",
            kpis: metrics?.agency_kpis
          },
          {
            title: "Cohort Performance Analysis",
            cohorts: cohorts.map(c => ({
              name: c.campaign_name,
              total_leads: c.leads_by_week.reduce((a, b) => a + b, 0),
              total_revenue: c.revenue_by_week.reduce((a, b) => a + b, 0)
            }))
          }
        ],
        generated_at: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(slideData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agency-kpis-slides-${format(new Date(), 'yyyy-MM-dd')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Slide Set Exported",
        description: "Agency KPI slides ready for Deck Hub",
      });
    } catch (error) {
      console.error('Error exporting slides:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export slide set",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading enhanced ROI data...</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      {/* Header with Enhanced Actions */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Agency Performance Dashboard</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Enhanced KPIs, cohort analysis, and slide-ready exports
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={exportSlideSet} variant="outline" className="touch-target">
              <FileText className="h-4 w-4 mr-2" />
              Export Slides
            </Button>
            <Button variant="outline" className="touch-target">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Agency KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Time to First Contact</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  {metrics?.agency_kpis.time_to_first_contact}h
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Clock className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm">
              <ArrowDownRight className="h-4 w-4 text-success mr-1" />
              <span className="text-success font-medium">15% faster</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">First Response SLA</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  {metrics?.agency_kpis.first_response_sla_percentage}%
                </p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <Gauge className="h-6 w-6 md:h-8 md:w-8 text-success" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm">
              <ArrowUpRight className="h-4 w-4 text-success mr-1" />
              <span className="text-success font-medium">Above target</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Advisor Responsiveness</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  {metrics?.agency_kpis.advisor_responsiveness_score}/10
                </p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <TrendingUp className="h-6 w-6 md:h-8 md:w-8 text-warning" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm">
              <ArrowUpRight className="h-4 w-4 text-success mr-1" />
              <span className="text-success font-medium">Excellent rating</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Attribution Accuracy</p>
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  {metrics?.agency_kpis.campaign_attribution_accuracy}%
                </p>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <Target className="h-6 w-6 md:h-8 md:w-8 text-accent" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm">
              <ArrowUpRight className="h-4 w-4 text-success mr-1" />
              <span className="text-success font-medium">High precision</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cohort Analysis Chart */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <CardTitle className="text-foreground flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Campaign Cohort Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cohorts[0]?.leads_by_week.map((leads, index) => ({
              week: `Week ${index + 1}`,
              leads: leads,
              appointments: cohorts[0]?.appointments_by_week[index] || 0,
              closes: cohorts[0]?.closes_by_week[index] || 0,
              revenue: cohorts[0]?.revenue_by_week[index] || 0
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Line type="monotone" dataKey="leads" stroke={CHART_COLORS[0]} strokeWidth={2} />
              <Line type="monotone" dataKey="appointments" stroke={CHART_COLORS[1]} strokeWidth={2} />
              <Line type="monotone" dataKey="closes" stroke={CHART_COLORS[2]} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Campaign Performance Table with Agency Metrics */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Campaign Performance & Agency KPIs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2">Campaign</th>
                  <th className="text-right p-2">Spend</th>
                  <th className="text-right p-2">Leads</th>
                  <th className="text-right p-2">ROI</th>
                  <th className="text-right p-2">1st Contact</th>
                  <th className="text-right p-2">SLA %</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-border/50">
                    <td className="p-2 font-medium">{campaign.campaign_name}</td>
                    <td className="p-2 text-right">${campaign.spend.toLocaleString()}</td>
                    <td className="p-2 text-right">{campaign.leads}</td>
                    <td className="p-2 text-right text-success">{campaign.roi}%</td>
                    <td className="p-2 text-right">{campaign.first_contact_time}h</td>
                    <td className="p-2 text-right">
                      <Badge variant={campaign.response_sla > 90 ? "default" : "destructive"}>
                        {campaign.response_sla}%
                      </Badge>
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