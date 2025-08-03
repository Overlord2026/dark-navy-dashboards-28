import React, { useEffect } from "react";
import { DashboardHeader } from "@/components/ui/DashboardHeader";
import ComprehensiveQATestSuite from "@/components/qa/ComprehensiveQATestSuite";
import ComprehensiveNavigationAudit from "@/components/diagnostics/ComprehensiveNavigationAudit";
import ErrorHandlingTestSuite from "@/components/qa/ErrorHandlingTestSuite";
import QASummaryReport from "@/components/qa/QASummaryReport";
import EndToEndQARunner from "@/components/qa/EndToEndQARunner";
import { PersonaSequentialQA } from "@/components/qa/PersonaSequentialQA";
import { ClientRoleSecurityAudit } from "@/components/testing/ClientRoleSecurityAudit";
import { UIUXAuditTester } from "@/components/testing/UIUXAuditTester";
import { VaultComprehensiveTester } from "@/components/testing/VaultComprehensiveTester";
import { UIUXIssueTracker } from "@/components/testing/UIUXIssueTracker";
import { ClientPersonaComprehensiveQA } from "@/components/qa/ClientPersonaComprehensiveQA";
import { AdvisorPersonaComprehensiveQA } from "@/components/qa/AdvisorPersonaComprehensiveQA";
import { measureRoutePerformance } from "@/services/performance/performanceMonitorService";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

const NavigationQATest: React.FC = () => {
  // Check if user has admin permissions for full access, but allow basic access for testing
  const { userProfile } = useAuth();
  const userRole = userProfile?.role || "client";
  const hasAccess = ['admin', 'system_administrator', 'developer'].includes(userRole);
  
  // Measure page load performance
  useEffect(() => {
    const stopMeasuring = measureRoutePerformance('/navigation-qa-test');
    return () => {
      stopMeasuring();
    };
  }, []);

  // Allow limited access for QA testing even without admin role
  if (!hasAccess && userRole !== 'client') {
    toast.error("Limited access - some features may not be available");
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <DashboardHeader 
        heading="Navigation QA Test Suite" 
        text="Comprehensive authentication and navigation testing for all user personas"
      />
      
      <div className="grid grid-cols-1 gap-6">
        <UIUXIssueTracker />
        <AdvisorPersonaComprehensiveQA />
        <ClientPersonaComprehensiveQA />
        <UIUXAuditTester />
        <VaultComprehensiveTester />
        <ClientRoleSecurityAudit />
        <PersonaSequentialQA />
        <EndToEndQARunner />
        <QASummaryReport />
        <ComprehensiveNavigationAudit />
        <ErrorHandlingTestSuite />
        <ComprehensiveQATestSuite />
      </div>
    </div>
  );
};

export default NavigationQATest;