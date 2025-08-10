import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Clock, Users, BarChart3 } from 'lucide-react';
import { useEdgeFunction } from '@/hooks/useEdgeFunction';

interface OperationalMetrics {
  workflow_efficiency: number;
  staffing_score: number;
  process_optimization: number;
  bottleneck_count: number;
}

export function AICOODashboard() {
  const [metrics, setMetrics] = useState<OperationalMetrics>({
    workflow_efficiency: 87,
    staffing_score: 92,
    process_optimization: 78,
    bottleneck_count: 3
  });

  const { invoke: invokeExpenseIntelligence, loading } = useEdgeFunction('expense-intelligence');

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await invokeExpenseIntelligence();
        if (result.success && result.data) {
          // Update metrics based on expense intelligence
          setMetrics(prev => ({
            ...prev,
            process_optimization: Math.max(60, 100 - (result.data.over_benchmark_count * 10))
          }));
        }
      } catch (error) {
        console.error('Error loading COO data:', error);
      }
    };

    loadData();
  }, []);

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI COO Dashboard</h1>
          <p className="text-muted-foreground">
            Operational excellence and process optimization
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
              <Settings className="h-4 w-4 text-blue-500" />
              Workflow Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatPercentage(metrics.workflow_efficiency)}
            </div>
            <p className="text-xs text-muted-foreground">Process optimization score</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
              <Users className="h-4 w-4 text-emerald-500" />
              Staffing Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatPercentage(metrics.staffing_score)}
            </div>
            <p className="text-xs text-muted-foreground">Resource allocation</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
              <BarChart3 className="h-4 w-4 text-purple-500" />
              Process Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? '...' : formatPercentage(metrics.process_optimization)}
            </div>
            <p className="text-xs text-muted-foreground">Automation potential</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
              <Clock className="h-4 w-4 text-orange-500" />
              Active Bottlenecks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {metrics.bottleneck_count}
            </div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Process Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Client Onboarding</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">95%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Document Processing</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">82%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Expense Management</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">68%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Optimization Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                  Automate expense categorization
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Save 4-6 hours per week
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Implement document templates
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Reduce processing time by 30%
                </p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                  Schedule vendor negotiations
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  Potential 15% cost reduction
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}