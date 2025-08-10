import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, TrendingUp, Zap } from 'lucide-react';
import { useEdgeFunction } from '@/hooks/useEdgeFunction';

interface MarketingMetrics {
  campaign_performance: number;
  channel_roi: number;
  lead_quality: number;
  budget_allocation: number;
}

export function AICMODashboard() {
  const [metrics, setMetrics] = useState<MarketingMetrics>({
    campaign_performance: 0,
    channel_roi: 0,
    lead_quality: 0,
    budget_allocation: 0
  });

  const { invoke: invokeMarketingROI, loading } = useEdgeFunction('calculate-marketing-roi');

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await invokeMarketingROI();
        if (result.success && result.data) {
          setMetrics({
            campaign_performance: result.data.roi_percentage || 0,
            channel_roi: result.data.roas || 0,
            lead_quality: 85, // Mock data
            budget_allocation: 78 // Mock data
          });
        }
      } catch (error) {
        console.error('Error loading CMO data:', error);
      }
    };

    loadData();
  }, []);

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI CMO Dashboard</h1>
          <p className="text-muted-foreground">
            Marketing intelligence and campaign optimization
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
              <Target className="h-4 w-4 text-blue-500" />
              Campaign ROI
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? '...' : formatPercentage(metrics.campaign_performance)}
            </div>
            <p className="text-xs text-muted-foreground">Average across channels</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Channel Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {loading ? '...' : `${metrics.channel_roi.toFixed(1)}x`}
            </div>
            <p className="text-xs text-muted-foreground">Best performing channel</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
              <Users className="h-4 w-4 text-purple-500" />
              Lead Quality Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatPercentage(metrics.lead_quality)}
            </div>
            <p className="text-xs text-muted-foreground">Conversion likelihood</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
              <Zap className="h-4 w-4 text-orange-500" />
              Budget Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatPercentage(metrics.budget_allocation)}
            </div>
            <p className="text-xs text-muted-foreground">Allocation score</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Channel Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">LinkedIn Ads</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">85%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Google Ads</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">72%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Facebook Ads</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">68%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">AI Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Increase LinkedIn budget by 20%
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Highest converting channel for professionals
                </p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                  Optimize Google Ads keywords
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Focus on "financial planning" terms
                </p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                  Pause underperforming campaigns
                </p>
                <p className="text-xs text-orange-700 dark:text-orange-300">
                  3 campaigns with ROAS below 2.0x
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}