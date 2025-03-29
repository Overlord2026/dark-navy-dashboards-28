
import { DiagnosticResult } from "@/services/diagnostics/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusIcon } from "./StatusIcon";

export interface CoreServicesSummaryProps {
  navigation: DiagnosticResult;
  forms: DiagnosticResult;
  database: DiagnosticResult;
  api: DiagnosticResult;
  authentication: DiagnosticResult;
}

export const CoreServicesSummary = ({
  navigation,
  forms,
  database,
  api,
  authentication,
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
            <StatusIcon status={navigation.status} size="lg" />
            <span className="text-xs mt-2 text-center">{navigation.message}</span>
          </div>
          <div className="flex flex-col items-center p-3 border rounded-md">
            <h3 className="font-medium text-sm mb-2">Forms</h3>
            <StatusIcon status={forms.status} size="lg" />
            <span className="text-xs mt-2 text-center">{forms.message}</span>
          </div>
          <div className="flex flex-col items-center p-3 border rounded-md">
            <h3 className="font-medium text-sm mb-2">Database</h3>
            <StatusIcon status={database.status} size="lg" />
            <span className="text-xs mt-2 text-center">{database.message}</span>
          </div>
          <div className="flex flex-col items-center p-3 border rounded-md">
            <h3 className="font-medium text-sm mb-2">API</h3>
            <StatusIcon status={api.status} size="lg" />
            <span className="text-xs mt-2 text-center">{api.message}</span>
          </div>
          <div className="flex flex-col items-center p-3 border rounded-md">
            <h3 className="font-medium text-sm mb-2">Authentication</h3>
            <StatusIcon status={authentication.status} size="lg" />
            <span className="text-xs mt-2 text-center">{authentication.message}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
