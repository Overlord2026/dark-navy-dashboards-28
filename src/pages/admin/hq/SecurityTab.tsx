import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export function SecurityTab() {
  const securityMetrics = [
    { label: 'RLS Policies', value: '47', status: 'good', description: 'Active row-level security policies' },
    { label: 'Security Scans', value: '12', status: 'warning', description: 'Pending security reviews' },
    { label: 'Compliance Score', value: '94%', status: 'good', description: 'Overall compliance rating' },
    { label: 'Vulnerabilities', value: '0', status: 'good', description: 'Critical security issues' }
  ];

  const recentAlerts = [
    {
      type: 'warning',
      title: 'Feature Flag Access',
      description: 'New feature flags require security review',
      timestamp: '2 hours ago'
    },
    {
      type: 'info',
      title: 'Database Backup',
      description: 'Daily backup completed successfully',
      timestamp: '6 hours ago'
    },
    {
      type: 'success',
      title: 'Security Scan',
      description: 'Weekly security scan passed all checks',
      timestamp: '1 day ago'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'danger': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Shield className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bfo-subheader p-4 -m-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-bfo-gold" />
            <h2 className="text-xl font-semibold">Security Center</h2>
          </div>
          <Button className="bfo-cta-secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Run Security Scan
          </Button>
        </div>
        <p className="text-sm mt-1 opacity-80">Monitor and manage security posture</p>
      </div>

      {/* Security Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        {securityMetrics.map((metric, index) => (
          <Card key={index} className="bfo-stat">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                  {metric.value}
                </div>
                <div className="text-sm font-medium text-white">{metric.label}</div>
                <div className="text-xs text-gray-300">{metric.description}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Security Alerts */}
      <Card className="bfo-card">
        <CardHeader>
          <CardTitle className="text-white">Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAlerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-black/20 border border-bfo-gold/20">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-white">{alert.title}</h4>
                    <span className="text-xs text-gray-400">{alert.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-300 mt-1">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Overview */}
      <Card className="bfo-card">
        <CardHeader>
          <CardTitle className="text-white">Compliance Framework</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-medium text-white">Data Protection</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">GDPR Compliance</span>
                  <Badge className="bg-green-600 text-white">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">CCPA Compliance</span>
                  <Badge className="bg-green-600 text-white">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Data Encryption</span>
                  <Badge className="bg-green-600 text-white">256-bit AES</Badge>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-white">Financial Compliance</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">SOC 2 Type II</span>
                  <Badge className="bg-green-600 text-white">Certified</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">PCI DSS</span>
                  <Badge className="bg-yellow-600 text-white">In Progress</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">ISO 27001</span>
                  <Badge className="bg-green-600 text-white">Certified</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}