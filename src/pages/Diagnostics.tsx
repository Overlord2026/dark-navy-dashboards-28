
import React from "react";
import { DiagnosticsTabs } from "@/components/diagnostics/DiagnosticsTabs";
import { DiagnosticsHeader } from "@/components/diagnostics/DiagnosticsHeader";
import { SecureAuthWrapper } from "@/components/auth/SecureAuthWrapper";
import { useDiagnostics } from "@/hooks/useDiagnostics";

const Diagnostics = () => {
  const {
    isLoading,
    quickFixes,
    lastRunTimestamp,
    diagnosticResults,
    fixHistory,
    getOverallStatus
  } = useDiagnostics();

  return (
    <SecureAuthWrapper requiredRole="admin">
      <div className="container py-6 space-y-6">
        <DiagnosticsHeader
          isLoading={isLoading}
          timestamp={lastRunTimestamp}
          status={getOverallStatus()}
          quickFixes={quickFixes}
        />
        <DiagnosticsTabs
          results={diagnosticResults || {}}
          recommendations={quickFixes}
          isLoading={isLoading}
          fixHistory={fixHistory}
        />
      </div>
    </SecureAuthWrapper>
  );
};

export default Diagnostics;
