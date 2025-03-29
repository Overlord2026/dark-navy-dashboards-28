
import { DiagnosticResult } from "@/services/diagnostics/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon } from "./StatusIcon";

export interface CoreServicesSummaryProps {
  navigation: DiagnosticResult;
  forms: DiagnosticResult;
  database: DiagnosticResult;
  api: DiagnosticResult;
  authentication: DiagnosticResult;
  navigationTestCount?: { total: number; passed: number };
  formsTestCount?: { total: number; passed: number };
  databaseTestCount?: { total: number; passed: number };
  apiTestCount?: { total: number; passed: number };
  authTestCount?: { total: number; passed: number };
}

export const CoreServicesSummary = ({
  navigation,
  forms,
  database,
  api,
  authentication,
  navigationTestCount,
  formsTestCount,
  databaseTestCount,
  apiTestCount,
  authTestCount,
}: CoreServicesSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Core Services Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <div className="flex flex-col items-center p-3 border rounded-md">
            <h3 className="font-medium text-sm mb-2">Navigation</h3>
            <StatusIcon status={navigation.status} />
            {navigationTestCount && (
              <div className="mt-1 mb-1 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {navigationTestCount.passed} / {navigationTestCount.total} checks
              </div>
            )}
            <span className="text-xs mt-1 text-center">{navigation.message}</span>
          </div>
          <div className="flex flex-col items-center p-3 border rounded-md">
            <h3 className="font-medium text-sm mb-2">Forms</h3>
            <StatusIcon status={forms.status} />
            {formsTestCount && (
              <div className="mt-1 mb-1 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {formsTestCount.passed} / {formsTestCount.total} checks
              </div>
            )}
            <span className="text-xs mt-1 text-center">{forms.message}</span>
          </div>
          <div className="flex flex-col items-center p-3 border rounded-md">
            <h3 className="font-medium text-sm mb-2">Database</h3>
            <StatusIcon status={database.status} />
            {databaseTestCount && (
              <div className="mt-1 mb-1 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {databaseTestCount.passed} / {databaseTestCount.total} checks
              </div>
            )}
            <span className="text-xs mt-1 text-center">{database.message}</span>
          </div>
          <div className="flex flex-col items-center p-3 border rounded-md">
            <h3 className="font-medium text-sm mb-2">API</h3>
            <StatusIcon status={api.status} />
            {apiTestCount && (
              <div className="mt-1 mb-1 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {apiTestCount.passed} / {apiTestCount.total} checks
              </div>
            )}
            <span className="text-xs mt-1 text-center">{api.message}</span>
          </div>
          <div className="flex flex-col items-center p-3 border rounded-md">
            <h3 className="font-medium text-sm mb-2">Authentication</h3>
            <StatusIcon status={authentication.status} />
            {authTestCount && (
              <div className="mt-1 mb-1 text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {authTestCount.passed} / {authTestCount.total} checks
              </div>
            )}
            <span className="text-xs mt-1 text-center">{authentication.message}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
