import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Users, 
  Activity, 
  FileText,
  Database,
  Network,
  Eye,
  Settings
} from 'lucide-react';
import { SecurityAlert } from '@/types/bfo-platform';

export function SecurityDashboard() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [securityScore, setSecurityScore] = useState(95);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Load mock security data
    const mockAlerts: SecurityAlert[] = [
      {
        id: '1',
        type: 'access',
        severity: 'low',
        message: 'New device login detected from Jane Doe',
        timestamp: new Date().toISOString(),
        resolved: false
      },
      {
        id: '2',
        type: 'data',
        severity: 'medium',
        message: 'Large data export detected in CPA module',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        resolved: true
      },
      {
        id: '3',
        type: 'compliance',
        severity: 'high',
        message: 'Missing encryption on sensitive document',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        resolved: false
      }
    ];
    setAlerts(mockAlerts);
  }, []);

  const getSeverityBadge = (severity: string) => {
    const variants = {
      low: 'secondary',
      medium: 'warning',
      high: 'destructive',
      critical: 'destructive'
    } as const;

    return <Badge variant={variants[severity as keyof typeof variants] || 'secondary'}>{severity}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'access':
        return <Users className="h-4 w-4" />;
      case 'data':
        return <Database className="h-4 w-4" />;
      case 'compliance':
        return <FileText className="h-4 w-4" />;
      case 'system':
        return <Settings className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const unresolvedAlerts = alerts.filter(alert => !alert.resolved);
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical' || alert.severity === 'high');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage platform security</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{securityScore}%</div>
            <p className="text-sm text-muted-foreground">Security Score</p>
          </div>
          <Button className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Run Security Scan
          </Button>
        </div>
      </div>

      {/* Security Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{unresolvedAlerts.length}</div>
            <p className="text-xs text-muted-foreground">
              {criticalAlerts.length} critical
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Data Encryption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">100%</div>
            <p className="text-xs text-muted-foreground">
              All data encrypted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Access Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98%</div>
            <p className="text-xs text-muted-foreground">
              Compliance rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">99.9%</div>
            <p className="text-xs text-muted-foreground">
              Uptime this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="access">Access Control</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Critical Alerts */}
          {criticalAlerts.length > 0 && (
            <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Critical Security Issues</AlertTitle>
              <AlertDescription>
                {criticalAlerts.length} critical security issue(s) require immediate attention.
              </AlertDescription>
            </Alert>
          )}

          {/* Security Components Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Components</CardTitle>
                <CardDescription>Status of key security systems</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Authentication System', status: 'operational', score: 100 },
                    { name: 'Data Encryption', status: 'operational', score: 100 },
                    { name: 'Network Security', status: 'operational', score: 98 },
                    { name: 'Access Logging', status: 'operational', score: 95 },
                    { name: 'Backup Systems', status: 'operational', score: 99 },
                    { name: 'Vulnerability Scanning', status: 'warning', score: 85 }
                  ].map((component, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          component.status === 'operational' ? 'bg-green-500' : 
                          component.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                        }`}></div>
                        <span className="font-medium">{component.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{component.score}%</span>
                        <Badge variant={component.status === 'operational' ? 'default' : 'warning'}>
                          {component.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Security Events</CardTitle>
                <CardDescription>Latest security monitoring events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.slice(0, 5).map(alert => (
                    <div key={alert.id} className="flex items-center gap-3 p-3 border rounded">
                      {getTypeIcon(alert.type)}
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                      {getSeverityBadge(alert.severity)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription>Monitor and respond to security events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.map(alert => (
                  <div key={alert.id} className={`p-4 border rounded-lg ${
                    alert.resolved ? 'opacity-60' : ''
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getTypeIcon(alert.type)}
                        <div>
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(alert.severity)}
                        {alert.resolved ? (
                          <Badge variant="secondary">Resolved</Badge>
                        ) : (
                          <Button size="sm" variant="outline">
                            Investigate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Control Policies</CardTitle>
                <CardDescription>Manage user access and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: 'Multi-Factor Authentication', enabled: true, coverage: '100%' },
                    { name: 'Role-Based Access Control', enabled: true, coverage: '98%' },
                    { name: 'Session Management', enabled: true, coverage: '100%' },
                    { name: 'IP Whitelisting', enabled: false, coverage: '0%' },
                    { name: 'Device Registration', enabled: true, coverage: '85%' }
                  ].map((policy, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{policy.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Coverage: {policy.coverage}
                        </p>
                      </div>
                      <Badge variant={policy.enabled ? 'default' : 'secondary'}>
                        {policy.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Monitor current user sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { user: 'John Smith', location: 'New York, US', device: 'Chrome/Windows', active: '2h ago' },
                    { user: 'Jane Doe', location: 'London, UK', device: 'Safari/macOS', active: '5m ago' },
                    { user: 'Mike Johnson', location: 'Toronto, CA', device: 'Firefox/Linux', active: 'Active now' }
                  ].map((session, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{session.user}</p>
                        <p className="text-xs text-muted-foreground">
                          {session.location} • {session.device}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{session.active}</p>
                        <Button size="sm" variant="outline">Revoke</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>GDPR Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Data Processing Records</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Privacy Notices</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data Subject Rights</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <Badge variant="default" className="w-full justify-center mt-4">
                    Compliant
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SOC 2 Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Security Controls</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Availability Controls</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Confidentiality Controls</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <Badge variant="default" className="w-full justify-center mt-4">
                    Compliant
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>HIPAA Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Access Controls</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Audit Logs</span>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data Encryption</span>
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                  <Badge variant="warning" className="w-full justify-center mt-4">
                    Review Required
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Monitoring</CardTitle>
                <CardDescription>Real-time system health and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { metric: 'CPU Usage', value: '23%', status: 'normal' },
                    { metric: 'Memory Usage', value: '67%', status: 'normal' },
                    { metric: 'Disk Space', value: '45%', status: 'normal' },
                    { metric: 'Network Traffic', value: '12 Mbps', status: 'normal' },
                    { metric: 'Database Connections', value: '45/100', status: 'normal' }
                  ].map((metric, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{metric.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{metric.value}</span>
                        <div className={`w-3 h-3 rounded-full ${
                          metric.status === 'normal' ? 'bg-green-500' : 
                          metric.status === 'warning' ? 'bg-orange-500' : 'bg-red-500'
                        }`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
                <CardDescription>Recent system and user activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { action: 'User login: john.smith@example.com', time: '2 minutes ago' },
                    { action: 'Document access: Financial_Report_2024.pdf', time: '5 minutes ago' },
                    { action: 'Security scan completed', time: '15 minutes ago' },
                    { action: 'Database backup started', time: '1 hour ago' },
                    { action: 'Policy update: Data retention policy', time: '2 hours ago' }
                  ].map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-2 text-sm">
                      <span>{entry.action}</span>
                      <span className="text-muted-foreground">{entry.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security policies and preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Authentication Settings</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Configure Multi-Factor Authentication
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Manage Password Policies
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Setup Single Sign-On (SSO)
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Access Control</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Manage User Roles & Permissions
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Configure IP Whitelisting
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Setup Device Registration
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Monitoring & Alerts</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Configure Alert Notifications
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Setup Audit Log Retention
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Manage Security Scans
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}