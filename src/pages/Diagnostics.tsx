
import React from "react";
import { DiagnosticsTabs } from "@/components/diagnostics/DiagnosticsTabs";
import { DiagnosticsHeader } from "@/components/diagnostics/DiagnosticsHeader";
import { SecureAuthWrapper } from "@/components/auth/SecureAuthWrapper";

const Diagnostics = () => {
  return (
    <SecureAuthWrapper requiredRole="admin">
      <div className="container py-6 space-y-6">
        <DiagnosticsHeader />
        <DiagnosticsTabs />
      </div>
    </SecureAuthWrapper>
  );
};

export default Diagnostics;
