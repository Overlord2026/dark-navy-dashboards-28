import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Lock,
  Eye,
  Key,
  Database,
  FileText,
  Users,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurityAlert {
  id: string;
  type: 'access' | 'data' | 'compliance' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
  details?: any;
}

interface SecurityMetric {
  name: string;
  value: number;
  target: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
}

interface ComplianceCheck {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'warning';
  description: string;
  lastCheck: string;
  details: string[];
}

const MOCK_ALERTS: SecurityAlert[] = [
  {
    id: '1',
    type: 'access',
    severity: 'medium',
    message: 'Multiple failed login attempts detected',
    timestamp: '2024-01-15T10:30:00Z',
    resolved: false,
    details: { attempts: 5, ip: '192.168.1.100' }
  },
  {
    id: '2',
    type: 'compliance',
    severity: 'high',
    message: 'RLS policy missing on sensitive table',
    timestamp: '2024-01-15T09:15:00Z',
    resolved: false,
    details: { table: 'financial_data', policy: 'user_access' }
  },
  {
    id: '3',
    type: 'data',
    severity: 'low',
    message: 'Unusual data access pattern detected',
    timestamp: '2024-01-15T08:45:00Z',
    resolved: true,
    details: { user: 'analyst@company.com', volume: '500 records' }
  }
];

const SECURITY_METRICS: SecurityMetric[] = [
  {
    name: 'RLS Coverage',
    value: 92,
    target: 100,
    status: 'warning',
    description: 'Percentage of sensitive tables with RLS policies'
  },
  {
    name: 'MFA Adoption',
    value: 87,
    target: 95,
    status: 'warning',
    description: 'Users with multi-factor authentication enabled'
  },
  {
    name: 'Data Encryption',
    value: 100,
    target: 100,
    status: 'good',
    description: 'Data encrypted at rest and in transit'
  },
  {
    name: 'Access Compliance',
    value: 95,
    target: 98,
    status: 'good',
    description: 'User access following principle of least privilege'
  },
  {
    name: 'Audit Coverage',
    value: 78,
    target: 90,
    status: 'warning',
    description: 'Operations with audit logging enabled'
  }
];

const COMPLIANCE_CHECKS: ComplianceCheck[] = [
  {
    id: '1',
    name: 'Row Level Security',
    status: 'warning',
    description: 'Check RLS policies on all sensitive tables',
    lastCheck: '2024-01-15T12:00:00Z',
    details: [
      '✓ user_profiles table has proper RLS',
      '✓ financial_accounts table has proper RLS',
      '⚠ meeting_notes table missing user-specific policy',
      '⚠ document_vault table has overly permissive policy'
    ]
  },
  {
    id: '2',
    name: 'Service Role Usage',
    status: 'passed',
    description: 'Ensure service role not exposed to client',
    lastCheck: '2024-01-15T11:30:00Z',
    details: [
      '✓ No service role usage in client code',
      '✓ Edge functions properly authenticated',
      '✓ Database functions use security definer pattern'
    ]
  },
  {
    id: '3',
    name: 'Input Sanitization',
    status: 'warning',
    description: 'Check for XSS and injection vulnerabilities',
    lastCheck: '2024-01-15T11:00:00Z',
    details: [
      '✓ Form inputs properly validated',
      '✓ SQL queries use parameterized statements',
      '⚠ Some JSON-LD markup needs sanitization',
      '⚠ Remove dangerouslySetInnerHTML where possible'
    ]
  },
  {
    id: '4',
    name: 'Secrets Management',
    status: 'passed',
    description: 'Verify secure handling of API keys and secrets',
    lastCheck: '2024-01-15T10:45:00Z',
    details: [
      '✓ Secrets stored in Supabase vault',
      '✓ Edge functions use Deno.env',
      '✓ No hardcoded API keys in code',
      '✓ Environment variables properly configured'
    ]
  }
];

export function SecurityDashboard() {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<SecurityAlert[]>(MOCK_ALERTS);
  const [runningCheck, setRunningCheck] = useState(false);
  const [lastScan, setLastScan] = useState<string>('2024-01-15T12:00:00Z');

  const runSecurityScan = async () => {
    setRunningCheck(true);
    
    // Simulate security scan
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setLastScan(new Date().toISOString());
    setRunningCheck(false);
    
    toast({
      title: "Security Scan Complete",
      description: "Found 2 warnings and 0 critical issues",
    });
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
    
    toast({
      title: "Alert Resolved",
      description: "Security alert marked as resolved",
    });
  };

  const getMetricColor = (metric: SecurityMetric) => {
    switch (metric.status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'high': return <Badge variant="destructive">High</Badge>;
      case 'medium': return <Badge variant="default">Medium</Badge>;
      case 'low': return <Badge variant="secondary">Low</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const unresolvedAlerts = alerts.filter(alert => !alert.resolved);
  const criticalAlerts = unresolvedAlerts.filter(alert => alert.severity === 'critical');
  const overallScore = Math.round(SECURITY_METRICS.reduce((acc, m) => acc + (m.value / m.target), 0) / SECURITY_METRICS.length * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Security Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor security compliance and threats
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Last Scan</div>
            <div className="text-sm font-medium">
              {new Date(lastScan).toLocaleDateString()}
            </div>
          </div>
          <Button 
            onClick={runSecurityScan}
            disabled={runningCheck}
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            {runningCheck ? 'Scanning...' : 'Run Security Scan'}
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">{overallScore}%</div>
              <Progress value={overallScore} className="h-2" />
              <div className="text-sm text-muted-foreground">
                {overallScore >= 90 ? 'Excellent' : overallScore >= 80 ? 'Good' : 'Needs Attention'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="h-5 w-5" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">{unresolvedAlerts.length}</div>
              <div className="text-sm text-muted-foreground">
                {criticalAlerts.length} critical
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-5 w-5" />
              RLS Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">92%</div>
              <div className="text-sm text-muted-foreground">
                23 of 25 tables protected
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              MFA Adoption
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold">87%</div>
              <div className="text-sm text-muted-foreground">
                174 of 200 users
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
          <TabsTrigger value="metrics">Security Metrics</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Checks</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Security Alerts</CardTitle>
              <CardDescription>
                Unresolved security issues requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {unresolvedAlerts.map(alert => (
                  <div key={alert.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(alert.severity)}
                        <Badge variant="outline">{alert.type}</Badge>
                      </div>
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString()}
                      </div>
                      {alert.details && (
                        <div className="text-sm">
                          <pre className="bg-muted p-2 rounded text-xs">
                            {JSON.stringify(alert.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => resolveAlert(alert.id)}
                    >
                      Resolve
                    </Button>
                  </div>
                ))}
                
                {unresolvedAlerts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                    <div className="text-lg font-medium">No Active Alerts</div>
                    <div>All security issues have been resolved</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SECURITY_METRICS.map(metric => (
              <Card key={metric.name}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{metric.name}</CardTitle>
                  <CardDescription>{metric.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-2xl font-bold ${getMetricColor(metric)}`}>
                        {metric.value}%
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Target: {metric.target}%
                      </span>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                    <div className="flex items-center gap-2">
                      {metric.status === 'good' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {metric.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                      {metric.status === 'critical' && <XCircle className="h-4 w-4 text-red-600" />}
                      <span className="text-sm capitalize">{metric.status}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="space-y-4">
            {COMPLIANCE_CHECKS.map(check => (
              <Card key={check.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getComplianceIcon(check.status)}
                      {check.name}
                    </CardTitle>
                    <Badge variant={check.status === 'passed' ? 'default' : 'secondary'}>
                      {check.status}
                    </Badge>
                  </div>
                  <CardDescription>{check.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Last Check: {new Date(check.lastCheck).toLocaleString()}
                    </div>
                    
                    <div className="space-y-1">
                      {check.details.map((detail, idx) => (
                        <div key={idx} className="text-sm font-mono">
                          {detail}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Events</CardTitle>
              <CardDescription>
                Security-relevant events and user actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">User login</div>
                      <div className="text-sm text-muted-foreground">
                        user@example.com from 192.168.1.100
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      2 hours ago
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Database schema change</div>
                      <div className="text-sm text-muted-foreground">
                        Added RLS policy to meeting_notes table
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      4 hours ago
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Failed login attempt</div>
                      <div className="text-sm text-muted-foreground">
                        Multiple failed attempts from 203.0.113.1
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      6 hours ago
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Critical Security Alert:</strong> {criticalAlerts.length} critical issue(s) require immediate attention.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}