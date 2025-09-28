import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { CalendarDays, TrendingUp, Users, FileText, Share2, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { hasAdminRole } from '@/lib/admin';

interface KpiSummary {
  window_start: string;
  window_end: string;
  started: number;
  completed: number;
  completion_rate: number;
  exported: number;
  shared: number;
  share_rate: number;
  revalidated: number;
  revalidation_rate: number;
  median_minutes_to_export: number;
}

interface KpiTimeseries {
  d: string;
  started: number;
  completed: number;
  exported: number;
  shared: number;
}

export default function LegacyKpisDashboard() {
  const [summary, setSummary] = useState<KpiSummary | null>(null);
  const [timeseries, setTimeseries] = useState<KpiTimeseries[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(7);
  const [firmOnly, setFirmOnly] = useState(true);
  const { session } = useAuth();

  const loadData = async (days: number) => {
    try {
      setLoading(true);
      
      // Use different RPC functions based on firmOnly toggle
      const summaryFn = firmOnly ? "legacy_kpis_summary_for_caller" : "legacy_kpis_summary";
      const timeseriesFn = firmOnly ? "legacy_kpis_timeseries_for_caller" : "legacy_kpis_timeseries";
      
      // Get summary data
      const { data: summaryData, error: summaryError } = await supabase
        .rpc(summaryFn as any, { days });
      
      if (summaryError) throw summaryError;
      
      // Get timeseries data
      const { data: timeseriesData, error: timeseriesError } = await supabase
        .rpc(timeseriesFn as any, { days });
        
      if (timeseriesError) throw timeseriesError;

      setSummary(summaryData?.[0] || null);
      setTimeseries((timeseriesData as KpiTimeseries[]) || []);
    } catch (error) {
      console.error('Failed to load legacy KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(selectedPeriod);
  }, [selectedPeriod, firmOnly]);

  const handlePeriodChange = (days: number) => {
    setSelectedPeriod(days);
  };

  const emitProofSlip = async () => {
    try {
      const { data, error } = await supabase.rpc("admin_emit_kpi_proofslip", { 
        days: 1, 
        firm_id: null 
      });
      
      if (error) {
        alert(`Emit failed: ${error.message}`);
      } else if (data?.success) {
        alert("ProofSlip emitted.");
      } else {
        alert(`Emit failed: ${data?.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`Emit failed: ${error}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading legacy KPIs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Legacy Planning KPIs</h1>
          <p className="text-muted-foreground">
            Analytics for legacy planning workflow performance
          </p>
          {hasAdminRole(session) && (
            <div className="mt-3 flex gap-2">
              <Button onClick={emitProofSlip} variant="outline" size="sm">
                Emit KPI ProofSlip (today)
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === 7 ? 'default' : 'outline'}
              onClick={() => handlePeriodChange(7)}
              size="sm"
            >
              7d
            </Button>
            <Button
              variant={selectedPeriod === 14 ? 'default' : 'outline'}
              onClick={() => handlePeriodChange(14)}
              size="sm"
            >
              14d
            </Button>
            <Button
              variant={selectedPeriod === 30 ? 'default' : 'outline'}
              onClick={() => handlePeriodChange(30)}
              size="sm"
            >
              30d
            </Button>
          </div>
          <label className="ml-2 inline-flex items-center gap-2 text-sm">
            <input 
              type="checkbox" 
              checked={firmOnly} 
              onChange={e => setFirmOnly(e.target.checked)} 
            />
            My firm only
          </label>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Started</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.started}</div>
              <p className="text-xs text-muted-foreground">
                Legacy flows initiated
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.completed}</div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{summary.completion_rate}%</Badge>
                <p className="text-xs text-muted-foreground">completion rate</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exported</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.exported}</div>
              <p className="text-xs text-muted-foreground">
                Export packages created
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Shared</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.shared}</div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{summary.share_rate}%</Badge>
                <p className="text-xs text-muted-foreground">of completed</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Advanced Metrics */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time to Export
              </CardTitle>
              <CardDescription>
                Median time from flow start to first export
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {summary.median_minutes_to_export 
                  ? `${Math.round(summary.median_minutes_to_export)}m`
                  : 'N/A'
                }
              </div>
              <p className="text-sm text-muted-foreground">
                Median completion time
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Revalidation Rate
              </CardTitle>
              <CardDescription>
                Users who updated items after export
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{summary.revalidated}</div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{summary.revalidation_rate}%</Badge>
                <p className="text-sm text-muted-foreground">of exports</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <Tabs defaultValue="data" className="space-y-4">
        <TabsList>
          <TabsTrigger value="data">Raw Data</TabsTrigger>
          <TabsTrigger value="funnel">Conversion Funnel</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Activity Data</CardTitle>
              <CardDescription>
                Legacy planning activity over the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {timeseries.map((day, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-muted rounded">
                    <span className="font-medium">{new Date(day.d).toLocaleDateString()}</span>
                    <div className="flex gap-4 text-sm">
                      <span>Started: {day.started}</span>
                      <span>Completed: {day.completed}</span>
                      <span>Exported: {day.exported}</span>
                      <span>Shared: {day.shared}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="funnel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>
                Flow progression through the legacy planning process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/10 rounded">
                  <span className="font-medium">Started</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-background rounded-full h-3">
                      <div 
                        className="bg-primary h-3 rounded-full" 
                        style={{ width: '100%' }}
                      />
                    </div>
                    <span className="font-bold">{summary?.started || 0}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-secondary/10 rounded">
                  <span className="font-medium">Completed</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-background rounded-full h-3">
                      <div 
                        className="bg-secondary h-3 rounded-full" 
                        style={{ 
                          width: summary?.started 
                            ? `${(summary.completed / summary.started) * 100}%`
                            : '0%'
                        }}
                      />
                    </div>
                    <span className="font-bold">{summary?.completed || 0}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-accent/10 rounded">
                  <span className="font-medium">Exported</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-background rounded-full h-3">
                      <div 
                        className="bg-accent h-3 rounded-full" 
                        style={{ 
                          width: summary?.started 
                            ? `${(summary.exported / summary.started) * 100}%`
                            : '0%'
                        }}
                      />
                    </div>
                    <span className="font-bold">{summary?.exported || 0}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded">
                  <span className="font-medium">Shared</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-background rounded-full h-3">
                      <div 
                        className="bg-muted-foreground h-3 rounded-full" 
                        style={{ 
                          width: summary?.started 
                            ? `${(summary.shared / summary.started) * 100}%`
                            : '0%'
                        }}
                      />
                    </div>
                    <span className="font-bold">{summary?.shared || 0}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Data Source Info */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-2">Data Source</p>
              <p>
                KPIs are calculated from events in the <code>app_events</code> table using the{' '}
                <code>legacy_kpis_summary</code> and <code>legacy_kpis_timeseries</code> functions.
              </p>
              <p className="mt-2">
                Period: {summary?.window_start ? new Date(summary.window_start).toLocaleDateString() : 'N/A'} 
                {' to '}
                {summary?.window_end ? new Date(summary.window_end).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}