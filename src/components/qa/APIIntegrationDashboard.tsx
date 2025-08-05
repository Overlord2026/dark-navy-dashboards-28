import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Loader2,
  Play,
  RefreshCw,
  Database,
  CreditCard,
  Mail,
  Building
} from 'lucide-react';
import { useAPIIntegrationTests } from '@/hooks/useAPIIntegrationTests';
import { QATestResult, APIIntegrationStatus } from '@/types/qa';

const getStatusIcon = (status: APIIntegrationStatus[keyof APIIntegrationStatus]) => {
  switch (status) {
    case 'connected':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'testing':
      return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
    default:
      return <AlertTriangle className="h-5 w-5 text-gray-400" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'passed':
      return <Badge variant="default" className="bg-green-100 text-green-800">Passed</Badge>;
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>;
    case 'warning':
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Warning</Badge>;
    case 'running':
      return <Badge variant="outline">Running</Badge>;
    default:
      return <Badge variant="outline">Pending</Badge>;
  }
};

const formatDuration = (duration?: number) => {
  if (!duration) return 'N/A';
  return `${duration}ms`;
};

export function APIIntegrationDashboard() {
  const { isRunning, results, status, runAllTests } = useAPIIntegrationTests();

  const serviceCards = [
    {
      name: 'Plaid Banking',
      icon: <Building className="h-6 w-6" />,
      status: status.plaid,
      description: 'Bank account integration'
    },
    {
      name: 'Stripe Payments',
      icon: <CreditCard className="h-6 w-6" />,
      status: status.stripe,
      description: 'Payment processing'
    },
    {
      name: 'Resend Email',
      icon: <Mail className="h-6 w-6" />,
      status: status.resend,
      description: 'Email service'
    },
    {
      name: 'Database',
      icon: <Database className="h-6 w-6" />,
      status: status.database,
      description: 'Supabase connection'
    }
  ];

  const passedTests = results.filter(r => r.status === 'passed').length;
  const failedTests = results.filter(r => r.status === 'failed').length;
  const warningTests = results.filter(r => r.status === 'warning').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">API Integration Test Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time status of critical system integrations
          </p>
        </div>
        <Button 
          onClick={runAllTests} 
          disabled={isRunning}
          className="gap-2"
        >
          {isRunning ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Testing...</>
          ) : (
            <><Play className="h-4 w-4" /> Run Tests</>
          )}
        </Button>
      </div>

      {/* Service Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {serviceCards.map((service) => (
          <Card key={service.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {service.name}
              </CardTitle>
              {getStatusIcon(service.status)}
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                {service.icon}
                <div>
                  <p className="text-xs text-muted-foreground">
                    {service.description}
                  </p>
                  <p className="text-sm font-medium capitalize">
                    {service.status.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Test Results Summary */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results Summary</CardTitle>
            <CardDescription>
              Detailed results from the latest test run
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{passedTests}</div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{failedTests}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{warningTests}</div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
            </div>

            <div className="space-y-2">
              {results.map((result) => (
                <div 
                  key={result.id} 
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {result.status === 'passed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {result.status === 'failed' && <XCircle className="h-4 w-4 text-red-500" />}
                    {result.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                    <div>
                      <p className="font-medium">{result.name}</p>
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                      {result.details && (
                        <p className="text-xs text-muted-foreground truncate max-w-md">
                          {result.details}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDuration(result.duration)}
                    </span>
                    {getStatusBadge(result.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Notes */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Admin Review:</strong> Plaid integration shows warnings due to pending "auth" product approval. 
          All other systems are operational. Contact Plaid Support to enable "auth" product for production client ID.
        </AlertDescription>
      </Alert>
    </div>
  );
}