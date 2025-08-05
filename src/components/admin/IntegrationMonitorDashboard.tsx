import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  Users,
  Activity,
  RefreshCw,
  Settings,
  Key,
  Globe,
  Database,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

interface IntegrationStatus {
  name: string;
  type: 'api' | 'oauth' | 'webhook' | 'database';
  status: 'active' | 'warning' | 'error' | 'pending';
  lastCheck: string;
  responseTime?: number;
  errorCount?: number;
  uptime?: number;
  keyConfigured: boolean;
  critical: boolean;
}

export const IntegrationMonitorDashboard: React.FC = () => {
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([
    {
      name: 'Stripe Payments',
      type: 'api',
      status: 'active',
      lastCheck: '2 min ago',
      responseTime: 145,
      errorCount: 0,
      uptime: 99.9,
      keyConfigured: true,
      critical: true
    },
    {
      name: 'Plaid Banking',
      type: 'api',
      status: 'active',
      lastCheck: '1 min ago',
      responseTime: 230,
      errorCount: 2,
      uptime: 99.5,
      keyConfigured: true,
      critical: true
    },
    {
      name: 'Finnhub Market Data',
      type: 'api',
      status: 'warning',
      lastCheck: '5 min ago',
      responseTime: 890,
      errorCount: 12,
      uptime: 98.2,
      keyConfigured: true,
      critical: false
    },
    {
      name: 'Zoom Meetings',
      type: 'oauth',
      status: 'active',
      lastCheck: '3 min ago',
      responseTime: 320,
      errorCount: 1,
      uptime: 99.8,
      keyConfigured: true,
      critical: false
    },
    {
      name: 'Resend Email',
      type: 'api',
      status: 'active',
      lastCheck: '1 min ago',
      responseTime: 120,
      errorCount: 0,
      uptime: 100,
      keyConfigured: true,
      critical: true
    },
    {
      name: 'Twilio SMS',
      type: 'api',
      status: 'error',
      lastCheck: '10 min ago',
      responseTime: 0,
      errorCount: 25,
      uptime: 85.4,
      keyConfigured: false,
      critical: false
    },
    {
      name: 'Google Auth',
      type: 'oauth',
      status: 'active',
      lastCheck: '2 min ago',
      responseTime: 180,
      errorCount: 0,
      uptime: 99.9,
      keyConfigured: true,
      critical: true
    },
    {
      name: 'Facebook Ads',
      type: 'api',
      status: 'pending',
      lastCheck: 'Never',
      responseTime: 0,
      errorCount: 0,
      uptime: 0,
      keyConfigured: false,
      critical: false
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error': return 'text-red-500 bg-red-50 border-red-200';
      case 'pending': return 'text-gray-500 bg-gray-50 border-gray-200';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api': return <Zap className="h-4 w-4" />;
      case 'oauth': return <Shield className="h-4 w-4" />;
      case 'webhook': return <Globe className="h-4 w-4" />;
      case 'database': return <Database className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const refreshIntegrations = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update some statuses randomly for demo
    setIntegrations(prev => prev.map(integration => ({
      ...integration,
      lastCheck: 'Just now',
      responseTime: integration.status === 'active' ? Math.floor(Math.random() * 300) + 100 : 0
    })));
    
    setIsRefreshing(false);
    toast({
      title: "Integrations Refreshed",
      description: "All integration statuses have been updated.",
    });
  };

  const criticalIssues = integrations.filter(i => i.critical && (i.status === 'error' || !i.keyConfigured));
  const activeIntegrations = integrations.filter(i => i.status === 'active').length;
  const avgUptime = integrations.reduce((acc, i) => acc + (i.uptime || 0), 0) / integrations.length;
  const totalErrors = integrations.reduce((acc, i) => acc + (i.errorCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Integration Monitor</h1>
          <p className="text-muted-foreground">
            Real-time monitoring of all API integrations and services
          </p>
        </div>
        <Button 
          onClick={refreshIntegrations}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh All
        </Button>
      </div>

      {/* Critical Issues Alert */}
      {criticalIssues.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            <strong>Critical Issues Detected:</strong> {criticalIssues.length} critical integration{criticalIssues.length > 1 ? 's' : ''} require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Services</p>
                <p className="text-2xl font-bold text-green-600">{activeIntegrations}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Average Uptime</p>
                <p className="text-2xl font-bold text-blue-600">{avgUptime.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Errors (24h)</p>
                <p className="text-2xl font-bold text-red-600">{totalErrors}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Issues</p>
                <p className="text-2xl font-bold text-orange-600">{criticalIssues.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((integration, index) => (
          <motion.div
            key={integration.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`relative ${integration.critical ? 'border-primary/20' : ''}`}>
              {integration.critical && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-red-500 text-white text-xs">CRITICAL</Badge>
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getTypeIcon(integration.type)}
                    {integration.name}
                  </CardTitle>
                  {getStatusIcon(integration.status)}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={`text-xs border ${getStatusColor(integration.status)}`}>
                    {integration.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">API Key</span>
                  <div className="flex items-center gap-1">
                    {integration.keyConfigured ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-xs">
                      {integration.keyConfigured ? 'Configured' : 'Missing'}
                    </span>
                  </div>
                </div>

                {integration.uptime !== undefined && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Uptime</span>
                      <span className="text-sm font-medium">{integration.uptime}%</span>
                    </div>
                    <Progress value={integration.uptime} className="h-2" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Response</span>
                    <div className="font-medium">
                      {integration.responseTime ? `${integration.responseTime}ms` : 'N/A'}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Errors</span>
                    <div className="font-medium text-red-500">
                      {integration.errorCount || 0}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Last check: {integration.lastCheck}</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* GO/NO-GO Banner */}
      <Card className={`border-2 ${criticalIssues.length === 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {criticalIssues.length === 0 ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
              <div>
                <h3 className={`text-lg font-bold ${criticalIssues.length === 0 ? 'text-green-800' : 'text-red-800'}`}>
                  {criticalIssues.length === 0 ? 'GO - System Ready' : 'NO-GO - Critical Issues'}
                </h3>
                <p className={`text-sm ${criticalIssues.length === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {criticalIssues.length === 0 
                    ? 'All critical integrations are operational'
                    : `${criticalIssues.length} critical integration${criticalIssues.length > 1 ? 's' : ''} need attention`
                  }
                </p>
              </div>
            </div>
            {criticalIssues.length > 0 && (
              <Button variant="destructive" size="sm">
                Fix Issues
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};