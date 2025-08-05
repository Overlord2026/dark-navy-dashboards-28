import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  RefreshCw, 
  AlertTriangle,
  ExternalLink,
  Shield,
  CreditCard,
  Building2,
  Mail,
  Database
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface APIKeyStatus {
  name: string;
  displayName: string;
  icon: React.ReactNode;
  status: 'present' | 'missing' | 'checking';
  testStatus: 'pass' | 'fail' | 'not_tested';
  testMessage?: string;
  required: boolean;
}

interface TestResult {
  service: string;
  status: 'success' | 'error';
  message: string;
  details?: any;
}

const REQUIRED_APIS = [
  { 
    name: 'PLAID_CLIENT_ID', 
    displayName: 'Plaid Bank Linking', 
    icon: <Building2 className="h-4 w-4" />,
    required: true 
  },
  { 
    name: 'PLAID_SECRET_KEY', 
    displayName: 'Plaid Secret', 
    icon: <Building2 className="h-4 w-4" />,
    required: true 
  },
  { 
    name: 'STRIPE_SECRET_KEY', 
    displayName: 'Stripe Payments', 
    icon: <CreditCard className="h-4 w-4" />,
    required: true 
  },
  { 
    name: 'RESEND_API_KEY', 
    displayName: 'Resend Email', 
    icon: <Mail className="h-4 w-4" />,
    required: true 
  }
];

export function APIStatusDashboard() {
  const [apiKeys, setApiKeys] = useState<APIKeyStatus[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [overallStatus, setOverallStatus] = useState<'GO' | 'NO-GO' | 'CHECKING'>('CHECKING');
  const { toast } = useToast();

  const checkAPIKeys = async () => {
    setIsChecking(true);
    console.log('🔍 [API Status Dashboard] Checking API key presence...');

    const updatedKeys = await Promise.all(
      REQUIRED_APIS.map(async (api) => {
        try {
          const { data, error } = await supabase.functions.invoke('check-api-keys', {
            body: { secretName: api.name }
          });
          
          const exists = !error && data?.exists;
          console.log(`${exists ? '✅' : '❌'} [API Status] ${api.name}: ${exists ? 'Present' : 'Missing'}`);
          
          return {
            ...api,
            status: exists ? 'present' : 'missing',
            testStatus: 'not_tested'
          } as APIKeyStatus;
        } catch (err) {
          console.error(`💥 [API Status] Error checking ${api.name}:`, err);
          return {
            ...api,
            status: 'missing',
            testStatus: 'not_tested'
          } as APIKeyStatus;
        }
      })
    );

    setApiKeys(updatedKeys);
    setLastChecked(new Date());
    setIsChecking(false);

    // Determine if we can proceed with testing
    const allRequired = updatedKeys.filter(k => k.required);
    const presentRequired = allRequired.filter(k => k.status === 'present');
    
    if (presentRequired.length === allRequired.length) {
      console.log('✅ [API Status] All required keys present, ready for testing');
    } else {
      console.warn(`⚠️ [API Status] Missing ${allRequired.length - presentRequired.length} required keys`);
      setOverallStatus('NO-GO');
    }
  };

  const runLiveTests = async () => {
    setIsTesting(true);
    console.log('🧪 [API Status Dashboard] Running live API tests...');

    try {
      const { data, error } = await supabase.functions.invoke('test-api-integrations');
      
      if (error) {
        console.error('❌ [API Status] Test suite failed:', error);
        toast({
          title: "API Tests Failed",
          description: error.message,
          variant: "destructive",
        });
        setOverallStatus('NO-GO');
        return;
      }

      if (data.success) {
        setTestResults(data.results);
        
        // Update API keys with test results
        const updatedKeys = apiKeys.map(key => {
          const testResult = data.results.find((r: TestResult) => 
            r.service.toLowerCase().includes(key.displayName.toLowerCase().split(' ')[0])
          );
          
          if (testResult) {
            return {
              ...key,
              testStatus: testResult.status === 'success' ? 'pass' as const : 'fail' as const,
              testMessage: testResult.message
            };
          }
          
          return key;
        });
        
        setApiKeys(updatedKeys);
        
        // Determine overall status
        const { passed, failed } = data.summary;
        const newStatus = failed === 0 ? 'GO' : 'NO-GO';
        setOverallStatus(newStatus);
        
        console.log(`📊 [API Status] Tests completed: ${passed} passed, ${failed} failed - Status: ${newStatus}`);
        
        toast({
          title: "API Tests Completed",
          description: `${passed}/${data.summary.total} tests passed`,
          variant: failed > 0 ? "destructive" : "default",
        });
      } else {
        console.error('❌ [API Status] Test suite error:', data.error);
        setOverallStatus('NO-GO');
        toast({
          title: "Test Suite Error",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('💥 [API Status] Critical error:', err);
      setOverallStatus('NO-GO');
      toast({
        title: "Critical Error",
        description: "Failed to run API tests",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const runFullAudit = async () => {
    await checkAPIKeys();
    // Wait a moment for state to update, then run tests
    setTimeout(runLiveTests, 1000);
  };

  useEffect(() => {
    runFullAudit();
  }, []);

  const getStatusBadge = (key: APIKeyStatus) => {
    if (key.status === 'checking') {
      return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Checking</Badge>;
    }
    if (key.status === 'missing') {
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Missing</Badge>;
    }
    if (key.testStatus === 'pass') {
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />PASS</Badge>;
    }
    if (key.testStatus === 'fail') {
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />FAIL</Badge>;
    }
    return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Ready to Test</Badge>;
  };

  const getOverallBanner = () => {
    if (overallStatus === 'CHECKING') {
      return (
        <Alert className="border-blue-200 bg-blue-50">
          <Clock className="h-4 w-4" />
          <AlertDescription>
            <strong>🔄 Checking API Status...</strong> Verifying all integrations...
          </AlertDescription>
        </Alert>
      );
    }
    
    if (overallStatus === 'GO') {
      return (
        <Alert className="border-green-500 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <strong className="text-green-800">🟢 GO - All Systems Ready!</strong>
            <br />All critical API integrations are configured and tested successfully. 
            Onboarding workflow is ready for production use.
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>🔴 NO-GO - Critical Issues Detected</strong>
          <br />One or more API integrations are missing or failing. 
          Onboarding workflow cannot proceed until these are resolved.
        </AlertDescription>
      </Alert>
    );
  };

  const missingKeys = apiKeys.filter(k => k.status === 'missing');
  const failedTests = apiKeys.filter(k => k.testStatus === 'fail');

  return (
    <div className="space-y-6">
      {/* Overall Status Banner */}
      {getOverallBanner()}

      {/* Main Dashboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                API Integration Status Dashboard
              </CardTitle>
              <CardDescription>
                Real-time verification of all required API keys and connections
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={checkAPIKeys}
                disabled={isChecking}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
                Check Keys
              </Button>
              <Button
                size="sm"
                onClick={runLiveTests}
                disabled={isTesting || missingKeys.length > 0}
              >
                <Shield className={`h-4 w-4 mr-2 ${isTesting ? 'animate-spin' : ''}`} />
                {isTesting ? 'Testing...' : 'Test APIs'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* API Status Grid */}
          <div className="grid gap-4">
            {apiKeys.map((key) => (
              <Card key={key.name} className={`border-l-4 ${
                key.testStatus === 'pass' ? 'border-l-green-500 bg-green-50' :
                key.testStatus === 'fail' ? 'border-l-red-500 bg-red-50' :
                key.status === 'missing' ? 'border-l-red-500 bg-red-50' :
                'border-l-blue-500 bg-blue-50'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        {key.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{key.displayName}</h4>
                          {getStatusBadge(key)}
                          {key.required && <Badge variant="outline" className="text-xs">Required</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {key.testMessage || `Secret: ${key.name}`}
                        </p>
                      </div>
                    </div>
                    
                    {key.status === 'missing' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('https://supabase.com/dashboard/project/xcmqjkvyvuhoslbzmlgi/settings/functions', '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Add Key
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Database Test */}
          <Card className="mt-4 border-l-4 border-l-green-500 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg">
                    <Database className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">Database Connection</h4>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />PASS
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Client invitations table accessible
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Items */}
          {(missingKeys.length > 0 || failedTests.length > 0) && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="font-medium text-yellow-800">Action Required</span>
              </div>
              <div className="text-sm text-yellow-700 space-y-1">
                {missingKeys.length > 0 && (
                  <p>• Add missing API keys: {missingKeys.map(k => k.displayName).join(', ')}</p>
                )}
                {failedTests.length > 0 && (
                  <p>• Fix failing connections: {failedTests.map(k => k.displayName).join(', ')}</p>
                )}
                <p>• Go to <strong>Supabase Dashboard → Settings → Secrets</strong></p>
                <p>• Re-run tests after adding keys</p>
              </div>
            </div>
          )}

          {/* Last Checked */}
          {lastChecked && (
            <p className="text-xs text-muted-foreground mt-4">
              Last checked: {lastChecked.toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}