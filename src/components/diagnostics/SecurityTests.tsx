
import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStatusColor } from "./StatusIcon";
import { SecurityTestResult } from "@/services/diagnostics/types";

interface SecurityTestsProps {
  tests: SecurityTestResult[];
}

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case 'critical':
      return <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Critical</span>;
    case 'high':
      return <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">High</span>;
    case 'medium':
      return <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Medium</span>;
    case 'low':
      return <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Low</span>;
    default:
      return null;
  }
};

const getCategoryBadge = (category: string) => {
  switch (category) {
    case 'authentication':
      return <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Authentication</span>;
    case 'file-security':
      return <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">File Security</span>;
    case 'authorization':
      return <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Authorization</span>;
    case 'data-protection':
      return <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">Data Protection</span>;
    case 'input-validation':
      return <span className="text-xs px-2 py-1 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200">Input Validation</span>;
    default:
      return null;
  }
};

export const SecurityTests = ({ tests }: SecurityTestsProps) => {
  // Group tests by category
  const categories = tests.reduce((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = [];
    }
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, SecurityTestResult[]>);

  const categoryNames: Record<string, string> = {
    'authentication': 'Authentication Security',
    'file-security': 'Document & File Security',
    'authorization': 'Role-Based Access Controls',
    'data-protection': 'Data Protection',
    'input-validation': 'Input Validation'
  };

  // Calculate security test stats
  const totalTests = tests.length;
  const passedTests = tests.filter(test => test.status === 'success').length;
  const warningTests = tests.filter(test => test.status === 'warning').length;
  const errorTests = tests.filter(test => test.status === 'error').length;
  
  // Count by severity
  const criticalIssues = tests.filter(test => test.severity === 'critical' && test.status !== 'success').length;
  const highIssues = tests.filter(test => test.severity === 'high' && test.status !== 'success').length;

  // Determine overall security status
  let overallStatus = 'success';
  if (errorTests > 0 || criticalIssues > 0) {
    overallStatus = 'error';
  } else if (warningTests > 0 || highIssues > 0) {
    overallStatus = 'warning';
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Vulnerability Tests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`mb-4 p-3 rounded-md border ${getStatusColor(overallStatus)}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Overall Security Status:</span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                overallStatus === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                overallStatus === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {overallStatus === 'success' ? 'Secure' : 
                 overallStatus === 'warning' ? 'Needs Attention' : 
                 'Vulnerable'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {passedTests}/{totalTests} Tests Passed
              </span>
              {(criticalIssues > 0 || highIssues > 0) && (
                <span className="text-sm px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                  {criticalIssues} Critical, {highIssues} High Risk Issues
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(categories).map(([category, categoryTests]) => (
            <div key={category} className="space-y-3">
              <h4 className="text-md font-semibold capitalize border-b pb-1">
                {categoryNames[category] || category}
              </h4>
              
              {categoryTests.map((test, index) => (
                <div key={index} className={`p-3 rounded-md border ${getStatusColor(test.status)}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-2">
                      <div>
                        <span className="font-medium">{test.name}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-1">
                        {getSeverityBadge(test.severity)}
                        {getCategoryBadge(test.category)}
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                        {test.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm mt-2">{test.message}</p>
                  {test.remediation && (
                    <div className="mt-2 p-2 bg-background/50 rounded-md border border-gray-200 dark:border-gray-800">
                      <p className="text-xs font-medium">Remediation:</p>
                      <p className="text-xs mt-1">{test.remediation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
