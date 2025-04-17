
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SystemHealthSummary } from "@/services/diagnostics/systemHealthService";
import { DiagnosticsSummaryCards } from "./navigation/DiagnosticsSummaryCards";
import { SimpleDiagnosticsView } from "./SimpleDiagnosticsView";

interface SystemHealthSummaryProps {
  summary: SystemHealthSummary;
  onRefresh: () => Promise<void>;
  loading?: boolean;
}

export function SystemHealthSummary({ summary, onRefresh, loading }: SystemHealthSummaryProps) {
  const { services } = summary;
  const errorCount = services.filter(s => s.status === 'error').length;
  const warningCount = services.filter(s => s.status === 'warning').length;
  const successCount = services.filter(s => s.status === 'success').length;

  return (
    <div className="space-y-6">
      <DiagnosticsSummaryCards 
        overallStatus={summary.overall}
        totalRoutes={services.length}
        successCount={successCount}
        warningCount={warningCount}
        errorCount={errorCount}
      />

      <SimpleDiagnosticsView
        title="Service Health Details"
        description="Detailed status of all system components and services"
        results={services.map((service, index) => ({
          id: `${service.name}-${index}`,
          name: service.name,
          status: service.status,
          message: service.message,
          details: service.details
        }))}
        onRunDiagnostics={onRefresh}
        loading={loading}
        showRefreshButton={true}
      />
    </div>
  );
}
