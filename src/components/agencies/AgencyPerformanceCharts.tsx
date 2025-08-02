import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FunnelChart } from '@/components/analytics/FunnelChart';
import { MetricsFilter } from '@/components/analytics/MetricsFilter';
import { Star } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface PerformanceData {
  period: string;
  total_campaigns: number;
  total_leads: number;
  qualified_leads: number;
  first_appt: number;
  second_appt: number;
  third_appt: number;
  clients_won: number;
  average_cpl: number;
  cost_per_qualified_appt: number;
  first_appt_show_rate: number;
  second_appt_show_rate: number;
  third_appt_show_rate: number;
  lead_to_client_conversion: number;
  conversion_rate: number;
  close_rate: number;
  total_ad_spend: number;
  advisor_rating: number;
}

interface FilterOptions {
  dateRange?: DateRange;
  source?: string;
  advisor?: string;
  agency?: string;
}

interface AgencyPerformanceChartsProps {
  agencyId: string;
}

export const AgencyPerformanceCharts: React.FC<AgencyPerformanceChartsProps> = ({
  agencyId
}) => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [filteredData, setFilteredData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchPerformanceData();
  }, [agencyId]);

  // Filter data based on current filters
  useEffect(() => {
    let filtered = [...performanceData];
    
    if (filters.dateRange?.from || filters.dateRange?.to) {
      // Filter by date range logic would go here
      // For now, we'll use all data
    }
    
    setFilteredData(filtered);
  }, [performanceData, filters]);

  // Generate funnel data
  const funnelData = filteredData.length > 0 ? [
    { 
      stage: 'Leads', 
      count: filteredData.reduce((sum, d) => sum + d.total_leads, 0),
      percentage: 100,
      color: 'hsl(var(--gold))'
    },
    { 
      stage: 'Qualified', 
      count: filteredData.reduce((sum, d) => sum + d.qualified_leads, 0),
      percentage: 30,
      color: 'hsl(var(--emerald))'
    },
    { 
      stage: '1st Appt', 
      count: filteredData.reduce((sum, d) => sum + d.first_appt, 0),
      percentage: 25,
      color: 'hsl(var(--blue-primary))'
    },
    { 
      stage: '2nd Appt', 
      count: filteredData.reduce((sum, d) => sum + d.second_appt, 0),
      percentage: 15,
      color: 'hsl(var(--purple-primary))'
    },
    { 
      stage: '3rd Appt', 
      count: filteredData.reduce((sum, d) => sum + d.third_appt, 0),
      percentage: 8,
      color: 'hsl(var(--orange-primary))'
    },
    { 
      stage: 'Clients', 
      count: filteredData.reduce((sum, d) => sum + d.clients_won, 0),
      percentage: 5,
      color: 'hsl(var(--green-primary))'
    }
  ] : [];

  // Calculate average metrics
  const avgMetrics = filteredData.length > 0 ? {
    costPerQualifiedAppt: filteredData.reduce((sum, d) => sum + d.cost_per_qualified_appt, 0) / filteredData.length,
    firstApptShowRate: filteredData.reduce((sum, d) => sum + d.first_appt_show_rate, 0) / filteredData.length,
    secondApptShowRate: filteredData.reduce((sum, d) => sum + d.second_appt_show_rate, 0) / filteredData.length,
    thirdApptShowRate: filteredData.reduce((sum, d) => sum + d.third_appt_show_rate, 0) / filteredData.length,
    leadToClientConversion: filteredData.reduce((sum, d) => sum + d.lead_to_client_conversion, 0) / filteredData.length,
    advisorRating: filteredData.reduce((sum, d) => sum + d.advisor_rating, 0) / filteredData.length
  } : null;

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('agency_performance_metrics')
        .select('*')
        .eq('agency_id', agencyId)
        .order('period_start', { ascending: true });

      if (error) throw error;

      const transformedData: PerformanceData[] = (data || []).map(metric => ({
        period: `${metric.period_start} - ${metric.period_end}`,
        total_campaigns: metric.total_campaigns,
        total_leads: metric.total_leads,
        qualified_leads: Math.round(metric.total_leads * 0.3), // Mock data
        first_appt: Math.round(metric.total_leads * 0.25),
        second_appt: Math.round(metric.total_leads * 0.15),
        third_appt: Math.round(metric.total_leads * 0.08),
        clients_won: Math.round(metric.total_leads * 0.05),
        average_cpl: metric.average_cpl,
        cost_per_qualified_appt: metric.average_cpl / 0.3,
        first_appt_show_rate: 85,
        second_appt_show_rate: 75,
        third_appt_show_rate: 65,
        lead_to_client_conversion: metric.close_rate * 100,
        conversion_rate: metric.conversion_rate * 100,
        close_rate: metric.close_rate * 100,
        total_ad_spend: metric.total_ad_spend,
        advisor_rating: 4.2 + Math.random() * 0.6 // Mock rating between 4.2-4.8
      }));

      setPerformanceData(transformedData);
      setFilteredData(transformedData);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load performance data."
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse h-64 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (performanceData.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-background to-accent/5 border-gold/20">
        <CardContent className="p-6 text-center">
          <p className="text-gold">No performance data available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <MetricsFilter
        filters={filters}
        onFiltersChange={setFilters}
        sources={['Google Ads', 'Facebook', 'LinkedIn', 'Referral']}
        advisors={['John Smith', 'Jane Doe', 'Mike Wilson']}
        agencies={['Premium Marketing', 'Elite Growth', 'Success Partners']}
      />

      {/* Key Metrics Cards */}
      {avgMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-deep-blue to-deep-blue/80 border-gold/20">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-lg font-playfair text-gold">Cost per Qualified Appt</h3>
                <p className="text-2xl font-bold text-emerald">${avgMetrics.costPerQualifiedAppt.toFixed(0)}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-deep-blue to-deep-blue/80 border-gold/20">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-lg font-playfair text-gold">Show Rates</h3>
                <div className="space-y-1">
                  <p className="text-sm text-emerald">1st: {avgMetrics.firstApptShowRate.toFixed(0)}%</p>
                  <p className="text-sm text-emerald">2nd: {avgMetrics.secondApptShowRate.toFixed(0)}%</p>
                  <p className="text-sm text-emerald">3rd: {avgMetrics.thirdApptShowRate.toFixed(0)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-deep-blue to-deep-blue/80 border-gold/20">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-lg font-playfair text-gold">Lead-to-Client</h3>
                <p className="text-2xl font-bold text-emerald">{avgMetrics.leadToClientConversion.toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-deep-blue to-deep-blue/80 border-gold/20">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="text-lg font-playfair text-gold">Advisor Rating</h3>
                <div className="flex items-center justify-center gap-1">
                  <p className="text-xl font-bold text-emerald">{avgMetrics.advisorRating.toFixed(1)}</p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(avgMetrics.advisorRating) 
                            ? 'text-gold fill-current' 
                            : 'text-gold/30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Funnel Chart */}
      <FunnelChart data={funnelData} title="Lead Conversion Funnel" />

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Leads Over Time */}
      <Card className="bg-gradient-to-br from-background to-accent/5 border-gold/20">
        <CardHeader>
          <CardTitle className="text-gold font-playfair">Leads Generated Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--gold) / 0.1)" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12, fill: 'hsl(var(--gold))' }}
                angle={-45}
                textAnchor="end"
                height={60}
                stroke="hsl(var(--gold))"
              />
              <YAxis stroke="hsl(var(--gold))" tick={{ fill: 'hsl(var(--gold))' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--deep-blue))',
                  border: '1px solid hsl(var(--gold))',
                  borderRadius: '8px',
                  color: 'hsl(var(--gold))'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="total_leads" 
                stroke="hsl(var(--emerald))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--emerald))", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Show Rates Comparison */}
      <Card className="bg-gradient-to-br from-background to-accent/5 border-gold/20">
        <CardHeader>
          <CardTitle className="text-gold font-playfair">Appointment Show Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--gold) / 0.1)" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12, fill: 'hsl(var(--gold))' }}
                angle={-45}
                textAnchor="end"
                height={60}
                stroke="hsl(var(--gold))"
              />
              <YAxis stroke="hsl(var(--gold))" tick={{ fill: 'hsl(var(--gold))' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--deep-blue))',
                  border: '1px solid hsl(var(--gold))',
                  borderRadius: '8px',
                  color: 'hsl(var(--gold))'
                }}
                formatter={(value) => [`${value}%`, 'Show Rate']} 
              />
              <Bar dataKey="first_appt_show_rate" fill="hsl(var(--emerald))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="second_appt_show_rate" fill="hsl(var(--blue-primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="third_appt_show_rate" fill="hsl(var(--purple-primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cost Per Qualified Appointment */}
      <Card className="bg-gradient-to-br from-background to-accent/5 border-gold/20">
        <CardHeader>
          <CardTitle className="text-gold font-playfair">Cost Per Qualified Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--gold) / 0.1)" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12, fill: 'hsl(var(--gold))' }}
                angle={-45}
                textAnchor="end"
                height={60}
                stroke="hsl(var(--gold))"
              />
              <YAxis stroke="hsl(var(--gold))" tick={{ fill: 'hsl(var(--gold))' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--deep-blue))',
                  border: '1px solid hsl(var(--gold))',
                  borderRadius: '8px',
                  color: 'hsl(var(--gold))'
                }}
                formatter={(value) => [`$${typeof value === 'number' ? value.toFixed(0) : value}`, 'Cost Per Qualified Appt']} 
              />
              <Bar 
                dataKey="cost_per_qualified_appt" 
                fill="hsl(var(--gold))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Lead-to-Client Conversion */}
      <Card className="bg-gradient-to-br from-background to-accent/5 border-gold/20">
        <CardHeader>
          <CardTitle className="text-gold font-playfair">Lead-to-Client Conversion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--gold) / 0.1)" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12, fill: 'hsl(var(--gold))' }}
                angle={-45}
                textAnchor="end"
                height={60}
                stroke="hsl(var(--gold))"
              />
              <YAxis stroke="hsl(var(--gold))" tick={{ fill: 'hsl(var(--gold))' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--deep-blue))',
                  border: '1px solid hsl(var(--gold))',
                  borderRadius: '8px',
                  color: 'hsl(var(--gold))'
                }}
                formatter={(value) => [`${value}%`, 'Conversion Rate']} 
              />
              <Line 
                type="monotone" 
                dataKey="lead_to_client_conversion" 
                stroke="hsl(var(--emerald))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--emerald))", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};