import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Shield, Zap, Activity } from 'lucide-react';

interface TechMetrics {
  system_health: number;
  feature_adoption: number;
  security_score: number;
  uptime: number;
}

export function AICTODashboard() {
  const [metrics] = useState<TechMetrics>({
    system_health: 98.5,
    feature_adoption: 73,
    security_score: 94,
    uptime: 99.9
  });

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI CTO Dashboard</h1>
          <p className="text-muted-foreground">
            Technology infrastructure and innovation metrics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
              <Server className="h-4 w-4 text-blue-500" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatPercentage(metrics.system_health)}
            </div>
            <p className="text-xs text-muted-foreground">Overall system performance</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
              <Zap className="h-4 w-4 text-emerald-500" />
              Feature Adoption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatPercentage(metrics.feature_adoption)}
            </div>
            <p className="text-xs text-muted-foreground">User engagement rate</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
              <Shield className="h-4 w-4 text-purple-500" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatPercentage(metrics.security_score)}
            </div>
            <p className="text-xs text-muted-foreground">Compliance & security</p>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
              <Activity className="h-4 w-4 text-orange-500" />
              System Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {formatPercentage(metrics.uptime)}
            </div>
            <p className="text-xs text-muted-foreground">30-day average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Feature Usage Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">AI CFO Dashboard</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">89%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Compliance Suite</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">76%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Document Vault</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">68%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">CE Marketplace</span>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-muted rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">45%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Technical Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  AI Assistant Integration
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Q2 2025 - Natural language interface
                </p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">
                  Mobile App Launch
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Q3 2025 - iOS and Android apps
                </p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                  Advanced Analytics Engine
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-300">
                  Q4 2025 - Predictive insights
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}