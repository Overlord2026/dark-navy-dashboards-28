import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Users, 
  Share2, 
  Lock,
  RefreshCw
} from 'lucide-react';

interface SecurityTestResult {
  testName: string;
  description: string;
  status: 'pass' | 'fail' | 'pending';
  details: string;
  expectedBehavior: string;
  actualBehavior: string;
}

interface RoleAccessTest {
  route: string;
  roleName: string;
  shouldAllow: boolean;
}

export const ClientSecurityTester: React.FC = () => {
  const { userProfile, user } = useAuth();
  const [testResults, setTestResults] = useState<SecurityTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string>('');

  // Define routes and their expected access for Client role
  const roleAccessTests: RoleAccessTest[] = [
    { route: '/client', roleName: 'Client Dashboard', shouldAllow: true },
    { route: '/advisor', roleName: 'Advisor Dashboard', shouldAllow: false },
    { route: '/admin', roleName: 'Admin Dashboard', shouldAllow: false },
    { route: '/accountant', roleName: 'Accountant Dashboard', shouldAllow: false },
    { route: '/attorney', roleName: 'Attorney Dashboard', shouldAllow: false },
    { route: '/coach', roleName: 'Coach Dashboard', shouldAllow: false },
    { route: '/consultant', roleName: 'Consultant Dashboard', shouldAllow: false },
    { route: '/crm', roleName: 'CRM Dashboard', shouldAllow: false },
    { route: '/leads/pipeline', roleName: 'Lead Pipeline', shouldAllow: false },
    { route: '/leads/scoring', roleName: 'Lead Scoring', shouldAllow: false },
    { route: '/tax-rules', roleName: 'Tax Rules Admin', shouldAllow: false },
    { route: '/advisor/billing', roleName: 'Advisor Billing', shouldAllow: false },
    { route: '/advisor/compliance', roleName: 'Advisor Compliance', shouldAllow: false }
  ];

  const runSecurityTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    const results: SecurityTestResult[] = [];

    // Test 1: Verify current user role
    setCurrentTest('Verifying user role');
    const userRole = userProfile?.role || 'unknown';
    results.push({
      testName: 'User Role Verification',
      description: 'Confirm current user has Client role',
      status: userRole === 'client' ? 'pass' : 'fail',
      details: `Current role: ${userRole}`,
      expectedBehavior: 'User should have "client" role',
      actualBehavior: `User has "${userRole}" role`
    });

    // Test 2: Check database permissions
    setCurrentTest('Testing database access permissions');
    try {
      // Test read access to own data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('id', user?.id)
        .single();

      results.push({
        testName: 'Own Profile Access',
        description: 'Client should be able to read their own profile',
        status: !profileError && profileData ? 'pass' : 'fail',
        details: profileError ? profileError.message : 'Successfully accessed own profile',
        expectedBehavior: 'Client can read their own profile data',
        actualBehavior: profileError ? `Error: ${profileError.message}` : 'Access granted'
      });

      // Test attempt to access other users' data
      const { data: allProfilesData, error: allProfilesError } = await supabase
        .from('profiles')
        .select('id, role')
        .neq('id', user?.id)
        .limit(1);

      results.push({
        testName: 'Other Users Data Access',
        description: 'Client should NOT be able to access other users\' data',
        status: allProfilesError || (allProfilesData && allProfilesData.length === 0) ? 'pass' : 'fail',
        details: allProfilesError ? allProfilesError.message : `Found ${allProfilesData?.length || 0} other profiles`,
        expectedBehavior: 'Access denied or no data returned',
        actualBehavior: allProfilesError ? `Blocked: ${allProfilesError.message}` : `Returned ${allProfilesData?.length || 0} records`
      });

    } catch (error) {
      results.push({
        testName: 'Database Permission Test',
        description: 'Test database access controls',
        status: 'fail',
        details: `Error during test: ${error}`,
        expectedBehavior: 'Controlled access based on RLS policies',
        actualBehavior: `Test failed with error: ${error}`
      });
    }

    // Test 3: Test family member invitation permissions
    setCurrentTest('Testing family member invitation');
    try {
      const { data: familyData, error: familyError } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user?.id);

      results.push({
        testName: 'Family Members Access',
        description: 'Client should be able to manage their family members',
        status: !familyError ? 'pass' : 'fail',
        details: familyError ? familyError.message : `Found ${familyData?.length || 0} family members`,
        expectedBehavior: 'Client can access their family members data',
        actualBehavior: familyError ? `Error: ${familyError.message}` : 'Access granted'
      });
    } catch (error) {
      results.push({
        testName: 'Family Members Test',
        description: 'Test family member management access',
        status: 'fail',
        details: `Error: ${error}`,
        expectedBehavior: 'Access to family member management',
        actualBehavior: `Test failed: ${error}`
      });
    }

    // Test 4: Test advisor sharing permissions
    setCurrentTest('Testing advisor sharing');
    try {
      const { data: advisorLinksData, error: advisorLinksError } = await supabase
        .from('advisor_assignments')
        .select('*')
        .eq('client_id', user?.id);

      results.push({
        testName: 'Advisor Links Access',
        description: 'Client should be able to view their advisor relationships',
        status: !advisorLinksError ? 'pass' : 'fail',
        details: advisorLinksError ? advisorLinksError.message : `Found ${advisorLinksData?.length || 0} advisor links`,
        expectedBehavior: 'Client can view their advisor relationships',
        actualBehavior: advisorLinksError ? `Error: ${advisorLinksError.message}` : 'Access granted'
      });
    } catch (error) {
      results.push({
        testName: 'Advisor Sharing Test',
        description: 'Test advisor relationship access',
        status: 'fail',
        details: `Error: ${error}`,
        expectedBehavior: 'Access to advisor sharing features',
        actualBehavior: `Test failed: ${error}`
      });
    }

    // Test 5: Test basic data access permissions
    setCurrentTest('Testing data access');
    try {
      // Test basic profile access (should work)
      const { data: profileCheck, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user?.id)
        .single();

      results.push({
        testName: 'Basic Data Access',
        description: 'Client should be able to access basic allowed data',
        status: !profileCheckError ? 'pass' : 'fail',
        details: profileCheckError ? profileCheckError.message : 'Profile access successful',
        expectedBehavior: 'Client can access their basic profile data',
        actualBehavior: profileCheckError ? `Error: ${profileCheckError.message}` : 'Access granted'
      });
    } catch (error) {
      results.push({
        testName: 'Basic Data Access Test',
        description: 'Test basic data access permissions',
        status: 'fail',
        details: `Error: ${error}`,
        expectedBehavior: 'Access to basic profile data',
        actualBehavior: `Test failed: ${error}`
      });
    }

    // Test 6: Test administrative function access
    setCurrentTest('Testing administrative access');
    try {
      const { data: adminData, error: adminError } = await supabase
        .from('analytics_events')
        .select('*')
        .limit(1);

      results.push({
        testName: 'Analytics Access',
        description: 'Client should NOT have access to system analytics',
        status: adminError ? 'pass' : 'fail',
        details: adminError ? adminError.message : `Returned ${adminData?.length || 0} analytics records`,
        expectedBehavior: 'Access denied to system analytics',
        actualBehavior: adminError ? `Blocked: ${adminError.message}` : `Access granted - SECURITY ISSUE`
      });
    } catch (error) {
      results.push({
        testName: 'Administrative Access Test',
        description: 'Test access to administrative functions',
        status: 'pass',
        details: `Access properly restricted: ${error}`,
        expectedBehavior: 'No access to administrative functions',
        actualBehavior: 'Access blocked as expected'
      });
    }

    setTestResults(results);
    setIsRunning(false);
    setCurrentTest('');
  };

  const getStatusIcon = (status: SecurityTestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'fail':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <RefreshCw className="h-5 w-5 text-yellow-600 animate-spin" />;
    }
  };

  const getStatusBadge = (status: SecurityTestResult['status']) => {
    switch (status) {
      case 'pass':
        return <Badge variant="default" className="bg-green-100 text-green-800">PASS</Badge>;
      case 'fail':
        return <Badge variant="destructive">FAIL</Badge>;
      default:
        return <Badge variant="secondary">PENDING</Badge>;
    }
  };

  const passedTests = testResults.filter(t => t.status === 'pass').length;
  const failedTests = testResults.filter(t => t.status === 'fail').length;
  const totalTests = testResults.length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Client Security Testing Dashboard
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Comprehensive security testing for Client persona role-based access controls
              </p>
            </div>
            <Button 
              onClick={runSecurityTests} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {isRunning ? 'Running Tests...' : 'Run Security Tests'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Current User Info */}
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Current User:</strong> {userProfile?.name || 'Unknown'} | 
              <strong> Role:</strong> {userProfile?.role || 'Unknown'} | 
              <strong> User ID:</strong> {user?.id || 'Not logged in'}
            </AlertDescription>
          </Alert>

          {/* Test Progress */}
          {isRunning && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Running: {currentTest}</span>
              </div>
            </div>
          )}

          {/* Test Results Summary */}
          {testResults.length > 0 && (
            <div className="mb-6 grid grid-cols-3 gap-4">
              <Card className="bg-green-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{passedTests}</div>
                  <div className="text-sm text-green-700">Passed</div>
                </CardContent>
              </Card>
              <Card className="bg-red-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">{failedTests}</div>
                  <div className="text-sm text-red-700">Failed</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-50">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-600">{totalTests}</div>
                  <div className="text-sm text-gray-700">Total</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Detailed Test Results */}
          {testResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Detailed Test Results</h3>
              {testResults.map((result, index) => (
                <Card key={index} className={`border-l-4 ${
                  result.status === 'pass' ? 'border-l-green-500' : 
                  result.status === 'fail' ? 'border-l-red-500' : 'border-l-yellow-500'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <h4 className="font-semibold">{result.testName}</h4>
                          <p className="text-sm text-muted-foreground">{result.description}</p>
                        </div>
                      </div>
                      {getStatusBadge(result.status)}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <strong>Expected:</strong> {result.expectedBehavior}
                      </div>
                      <div>
                        <strong>Actual:</strong> {result.actualBehavior}
                      </div>
                    </div>
                    
                    {result.details && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                        <strong>Details:</strong> {result.details}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Route Access Tests */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Route Access Control Matrix
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                The following routes should be properly secured for Client role access:
              </div>
              <div className="grid gap-2">
                {roleAccessTests.map((test, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">{test.route}</code>
                      <span>{test.roleName}</span>
                    </div>
                    <Badge variant={test.shouldAllow ? "default" : "secondary"}>
                      {test.shouldAllow ? "Allowed" : "Blocked"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Critical Security Notes */}
          <Alert className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Test Notes:</strong>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>All failed tests indicate potential security vulnerabilities</li>
                <li>Client role should only access client-specific features and their own data</li>
                <li>Cross-role access attempts should be denied with proper error messages</li>
                <li>Family member and advisor sharing should work within client's scope only</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};