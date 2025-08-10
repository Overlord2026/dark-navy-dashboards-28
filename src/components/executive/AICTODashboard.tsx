import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Server, Shield, Zap, Activity, Eye, Search, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface TechMetrics {
  system_health: number;
  feature_adoption: number;
  security_score: number;
  uptime: number;
}

interface IpWatchLog {
  id: string;
  type: string;
  term: string;
  source: string;
  date_found: string;
  risk_level: string;
  link: string;
  created_at: string;
}

export function AICTODashboard() {
  const [metrics] = useState<TechMetrics>({
    system_health: 98.5,
    feature_adoption: 73,
    security_score: 94,
    uptime: 99.9
  });

  const [ipWatchData, setIpWatchData] = useState<IpWatchLog[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    fetchIpWatchData();
  }, []);

  const fetchIpWatchData = async () => {
    try {
      const { data, error } = await supabase
        .from('ip_watch_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      setIpWatchData(data || []);
    } catch (error) {
      console.error('Error fetching IP Watch data:', error);
    }
  };

  const runIpScan = async () => {
    setIsScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('ip-watch-scan');
      if (error) throw error;
      await fetchIpWatchData(); // Refresh data
    } catch (error) {
      console.error('Error running IP scan:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const runContentScan = async () => {
    setIsScanning(true);
    try {
      const { data, error } = await supabase.functions.invoke('content-fingerprint-scan');
      if (error) throw error;
      await fetchIpWatchData(); // Refresh data
    } catch (error) {
      console.error('Error running content scan:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const getRiskBadgeVariant = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'destructive';
      case 'warning': return 'default';
      case 'info': return 'secondary';
      default: return 'outline';
    }
  };

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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                IP Watch
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Monitor intellectual property and brand protection
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={runIpScan}
                disabled={isScanning}
              >
                <Search className="h-4 w-4 mr-1" />
                {isScanning ? 'Scanning...' : 'IP Scan'}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={runContentScan}
                disabled={isScanning}
              >
                <Globe className="h-4 w-4 mr-1" />
                {isScanning ? 'Scanning...' : 'Content'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {ipWatchData.filter(item => item.risk_level === 'critical').length}
                  </div>
                  <div className="text-muted-foreground">Critical</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {ipWatchData.filter(item => item.risk_level === 'warning').length}
                  </div>
                  <div className="text-muted-foreground">Warning</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {ipWatchData.filter(item => item.risk_level === 'info').length}
                  </div>
                  <div className="text-muted-foreground">Info</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {ipWatchData.length}
                  </div>
                  <div className="text-muted-foreground">Total</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Recent Findings</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {ipWatchData.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant={getRiskBadgeVariant(item.risk_level)}>
                            {item.risk_level}
                          </Badge>
                          <span className="text-sm font-medium">{item.type}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.term} • {item.source}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(item.date_found).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                  {ipWatchData.length === 0 && (
                    <div className="text-center text-muted-foreground text-sm py-4">
                      No IP Watch findings yet. Run a scan to start monitoring.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <Card className="bg-card border border-border/30 rounded-2xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Technical Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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