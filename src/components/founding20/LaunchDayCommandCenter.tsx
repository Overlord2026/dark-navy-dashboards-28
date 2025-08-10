import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, Users, Mail, Calendar, AlertCircle, CheckCircle, 
  Activity, Database, Zap, RefreshCw, FileText, Share
} from 'lucide-react';
import { track } from '@/lib/analytics/track';
import { toast } from 'sonner';

interface KPIMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
}

interface SystemStatus {
  service: string;
  status: 'ok' | 'warning' | 'error';
  uptime: string;
  lastCheck: string;
}

interface QAIssue {
  id: string;
  severity: 'P0' | 'P1';
  area: string;
  description: string;
  owner: string;
  created_at: string;
}

export const LaunchDayCommandCenter: React.FC = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [monitoringDuration, setMonitoringDuration] = useState(0); // hours
  const [selectedTab, setSelectedTab] = useState('overview');

  const [outreachMetrics, setOutreachMetrics] = useState<KPIMetric[]>([
    { label: 'Invites Sent', value: '47', change: '+12', trend: 'up' },
    { label: 'Email Opens', value: '23', change: '+8', trend: 'up' },
    { label: 'Link Clicks', value: '16', change: '+5', trend: 'up' },
    { label: 'Demo Requests', value: '6', change: '+3', trend: 'up' }
  ]);

  const [engagementMetrics, setEngagementMetrics] = useState<KPIMetric[]>([
    { label: 'Overview Views', value: '34', change: '+11', trend: 'up' },
    { label: 'QR Scans', value: '8', change: '+2', trend: 'up' },
    { label: 'PDF Downloads', value: '19', change: '+7', trend: 'up' },
    { label: 'Asset Shares', value: '5', change: '+2', trend: 'up' }
  ]);

  const [systemStatus, setSystemStatus] = useState<SystemStatus[]>([
    { service: 'Resend Email', status: 'ok', uptime: '99.9%', lastCheck: '2 min ago' },
    { service: 'Supabase DB', status: 'ok', uptime: '100%', lastCheck: '1 min ago' },
    { service: 'Stripe Payments', status: 'ok', uptime: '99.8%', lastCheck: '3 min ago' },
    { service: 'Plaid Connect', status: 'warning', uptime: '98.5%', lastCheck: '5 min ago' },
    { service: 'Twilio SMS', status: 'ok', uptime: '99.7%', lastCheck: '2 min ago' },
    { service: 'DocuSign', status: 'ok', uptime: '99.9%', lastCheck: '4 min ago' }
  ]);

  const [qaIssues, setQAIssues] = useState<QAIssue[]>([
    {
      id: '1',
      severity: 'P0',
      area: 'Authentication',
      description: 'Login flow fails for new users on Safari',
      owner: 'Tech Team',
      created_at: '2 hours ago'
    },
    {
      id: '2',
      severity: 'P1',
      area: 'PDF Export',
      description: 'SWAG roadmap PDF missing company logo',
      owner: 'Design Team',
      created_at: '1 hour ago'
    }
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isMonitoring) {
      interval = setInterval(() => {
        setLastUpdate(new Date());
        setMonitoringDuration(prev => prev + 1);
        simulateMetricUpdates();
      }, 3600000); // Update every hour
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMonitoring]);

  const simulateMetricUpdates = () => {
    // Simulate live metric updates
    setOutreachMetrics(prev => prev.map(metric => ({
      ...metric,
      value: (parseInt(metric.value) + Math.floor(Math.random() * 3)).toString(),
      change: `+${Math.floor(Math.random() * 5) + 1}`
    })));

    setEngagementMetrics(prev => prev.map(metric => ({
      ...metric,
      value: (parseInt(metric.value) + Math.floor(Math.random() * 2)).toString(),
      change: `+${Math.floor(Math.random() * 3) + 1}`
    })));
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    setMonitoringDuration(0);
    track('command_center_monitoring_started');
    toast.success('Launch Day monitoring activated - will run for 48 hours');
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
    track('command_center_monitoring_stopped', { duration_hours: monitoringDuration });
    toast.info('Monitoring stopped');
  };

  const triggerFollowUpSequence = () => {
    track('followup_sequence_triggered');
    toast.success('Follow-up email sequence initiated');
  };

  const rerunQASuite = () => {
    track('qa_suite_rerun_triggered');
    toast.info('QA test suite re-run initiated');
  };

  const advanceOutreachTier = () => {
    track('outreach_tier_advanced');
    toast.success('Advanced to next outreach tier');
  };

  const regenerateAssets = () => {
    track('assets_regenerated');
    toast.info('Asset regeneration started');
  };

  const generateWrapUpReport = async (type: 'internal' | 'public') => {
    track('wrapup_report_generated', { type });
    
    const reportData = {
      title: `Founding 20 Launch Report - ${type === 'internal' ? 'Internal' : 'Public'}`,
      timestamp: new Date().toISOString(),
      outreach_stats: outreachMetrics,
      engagement_stats: engagementMetrics,
      system_health: systemStatus,
      qa_performance: qaIssues,
      monitoring_duration: monitoringDuration
    };

    // Simulate report generation
    toast.success(`${type === 'internal' ? 'Internal' : 'Public'} wrap-up report generated`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    return severity === 'P0' ? 'bg-red-500' : 'bg-orange-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gold">Launch Day Command Center</h2>
          <p className="text-white/70">
            Real-time monitoring • {isMonitoring ? `Active ${monitoringDuration}h` : 'Standby'} • 
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="flex gap-2">
          {!isMonitoring ? (
            <Button onClick={startMonitoring} className="bg-green-600 hover:bg-green-700 text-white">
              <Activity className="mr-2 h-4 w-4" />
              Start 48h Monitoring
            </Button>
          ) : (
            <Button onClick={stopMonitoring} variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">
              <Activity className="mr-2 h-4 w-4" />
              Stop Monitoring
            </Button>
          )}
        </div>
      </div>

      {isMonitoring && (
        <Card className="bg-green-900/20 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 font-medium">Live Monitoring Active</span>
              </div>
              <div className="text-green-400 text-sm">
                {Math.round((monitoringDuration / 48) * 100)}% of 48h monitoring complete
              </div>
            </div>
            <Progress value={(monitoringDuration / 48) * 100} className="mt-2" />
          </CardContent>
        </Card>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5 bg-black border border-gold/30">
          <TabsTrigger value="overview" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            Overview
          </TabsTrigger>
          <TabsTrigger value="outreach" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            Outreach
          </TabsTrigger>
          <TabsTrigger value="systems" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            Systems
          </TabsTrigger>
          <TabsTrigger value="qa" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            QA Issues
          </TabsTrigger>
          <TabsTrigger value="actions" className="data-[state=active]:bg-gold data-[state=active]:text-black">
            Actions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...outreachMetrics, ...engagementMetrics].slice(0, 4).map((metric, idx) => (
              <Card key={idx} className="bg-black border-gold/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-white/70 mb-1">
                    {metric.label}
                  </div>
                  <div className="text-xs text-green-400">
                    {metric.change} today
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="bg-black border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  System Health Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {systemStatus.slice(0, 3).map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(service.status)}
                        <span className="text-white text-sm">{service.service}</span>
                      </div>
                      <span className="text-white/70 text-sm">{service.uptime}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-black border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Critical Issues (P0/P1)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {qaIssues.map(issue => (
                    <div key={issue.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(issue.severity)}>
                          {issue.severity}
                        </Badge>
                        <span className="text-white text-sm">{issue.area}</span>
                      </div>
                      <span className="text-white/70 text-sm">{issue.owner}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="outreach" className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {outreachMetrics.map((metric, idx) => (
              <Card key={idx} className="bg-black border-gold/30">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-white mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-white/70 mb-1">
                    {metric.label}
                  </div>
                  <div className="text-xs text-green-400">
                    {metric.change} today
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-black border-gold/30">
            <CardHeader>
              <CardTitle className="text-gold">Outreach Progress by Segment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Sports', 'Longevity', 'RIA'].map((segment, idx) => (
                  <div key={segment} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white">{segment}</span>
                      <span className="text-white/70">{75 - (idx * 15)}% complete</span>
                    </div>
                    <Progress value={75 - (idx * 15)} className="w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="systems" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-4">
            {systemStatus.map((service, idx) => (
              <Card key={idx} className="bg-black border-gold/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(service.status)}
                      <span className="text-white font-medium">{service.service}</span>
                    </div>
                    <Badge className={
                      service.status === 'ok' ? 'bg-green-500' :
                      service.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }>
                      {service.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="text-sm text-white/70">
                    <div>Uptime: {service.uptime}</div>
                    <div>Last check: {service.lastCheck}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="qa" className="space-y-4">
          <div className="space-y-2">
            {qaIssues.map(issue => (
              <Card key={issue.id} className="bg-black border-gold/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge className={getSeverityColor(issue.severity)}>
                        {issue.severity}
                      </Badge>
                      <span className="text-white font-medium">{issue.area}</span>
                    </div>
                    <span className="text-white/70 text-sm">{issue.created_at}</span>
                  </div>
                  <p className="text-white/70 text-sm mb-2">{issue.description}</p>
                  <div className="text-sm text-white/50">
                    Owner: {issue.owner}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="grid lg:grid-cols-2 gap-4">
            <Card className="bg-black border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold">Outreach Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={triggerFollowUpSequence}
                  className="w-full bg-gold text-black hover:bg-gold/90"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Trigger Follow-up Sequence
                </Button>
                
                <Button
                  onClick={advanceOutreachTier}
                  variant="outline"
                  className="w-full border-gold text-gold hover:bg-gold/10"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Advance Outreach Tier
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-black border-gold/30">
              <CardHeader>
                <CardTitle className="text-gold">System Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={rerunQASuite}
                  variant="outline"
                  className="w-full border-gold text-gold hover:bg-gold/10"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Re-run QA Suite
                </Button>
                
                <Button
                  onClick={regenerateAssets}
                  variant="outline"
                  className="w-full border-gold text-gold hover:bg-gold/10"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Regenerate Assets
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-black border-gold/30">
            <CardHeader>
              <CardTitle className="text-gold">Wrap-up Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button
                  onClick={() => generateWrapUpReport('internal')}
                  className="bg-gold text-black hover:bg-gold/90"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Internal Report
                </Button>
                
                <Button
                  onClick={() => generateWrapUpReport('public')}
                  variant="outline"
                  className="border-gold text-gold hover:bg-gold/10"
                >
                  <Share className="mr-2 h-4 w-4" />
                  Generate Public Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};