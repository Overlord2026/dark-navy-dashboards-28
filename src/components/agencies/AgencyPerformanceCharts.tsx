import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface PerformanceData {
  period: string;
  total_campaigns: number;
  total_leads: number;
  average_cpl: number;
  conversion_rate: number;
  close_rate: number;
  total_ad_spend: number;
}

interface AgencyPerformanceChartsProps {
  agencyId: string;
}

export const AgencyPerformanceCharts: React.FC<AgencyPerformanceChartsProps> = ({
  agencyId
}) => {
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPerformanceData();
  }, [agencyId]);

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
        average_cpl: metric.average_cpl,
        conversion_rate: metric.conversion_rate * 100, // Convert to percentage
        close_rate: metric.close_rate * 100, // Convert to percentage
        total_ad_spend: metric.total_ad_spend
      }));

      setPerformanceData(transformedData);
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
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No performance data available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Leads Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Leads Generated Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="total_leads" 
                stroke="hsl(var(--emerald-primary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--emerald-primary))", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cost Per Lead */}
      <Card>
        <CardHeader>
          <CardTitle>Average Cost Per Lead</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Cost Per Lead']} />
              <Bar 
                dataKey="average_cpl" 
                fill="hsl(var(--gold-primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Conversion Rate */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Rate Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Conversion Rate']} />
              <Line 
                type="monotone" 
                dataKey="conversion_rate" 
                stroke="hsl(var(--blue-primary))" 
                strokeWidth={3}
                dot={{ fill: "hsl(var(--blue-primary))", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Ad Spend */}
      <Card>
        <CardHeader>
          <CardTitle>Ad Spend by Period</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="period" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Ad Spend']} />
              <Bar 
                dataKey="total_ad_spend" 
                fill="hsl(var(--blue-primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};