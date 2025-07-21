import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { Navigation } from "@/components/Navigation";
import Index from "./pages/Index";
import { AuthPage } from "./pages/AuthPage";
import { SecuritySettingsPage } from "./pages/SecuritySettingsPage";
import { ClientDashboard } from "./pages/ClientDashboard";
import { AdvisorDashboard } from "./pages/AdvisorDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DiagnosticsPage } from "./pages/DiagnosticsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { HealthRecordsPage } from "./pages/HealthRecordsPage";
import { FinancialPlanningPage } from "./pages/FinancialPlanningPage";
import { LegalDocumentsPage } from "./pages/LegalDocumentsPage";
import { InsurancePoliciesPage } from "./pages/InsurancePoliciesPage";
import { InvestmentStrategiesPage } from "./pages/InvestmentStrategiesPage";
import { EducationalContentPage } from "./pages/EducationalContentPage";
import { TrainingModulesPage } from "./pages/TrainingModulesPage";
import { ProfessionalsDirectoryPage } from "./pages/ProfessionalsDirectoryPage";
import { DocumentUploadPage } from "./pages/DocumentUploadPage";
import { DocumentViewPage } from "./pages/DocumentViewPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AccessDeniedPage } from "./pages/AccessDeniedPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Navigation />
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route
                  path="/"
                  element={
                    <AuthWrapper requireAuth={true}>
                      <Index />
                    </AuthWrapper>
                  }
                />
                <Route
                  path="/security"
                  element={
                    <AuthWrapper 
                      requireAuth={true}
                      allowedRoles={['admin', 'tenant_admin', 'system_administrator']}
                    >
                      <SecuritySettingsPage />
                    </AuthWrapper>
                  }
                />
                <Route
                  path="/client-dashboard"
                  element={
                    <AuthWrapper requireAuth={true}>
                      <ClientDashboard />
                    </AuthWrapper>
                  }
                />
                <Route
                  path="/advisor-dashboard"
                  element={
                    <AuthWrapper
                      requireAuth={true}
                      allowedRoles={['advisor']}
                    >
                      <AdvisorDashboard />
                    </AuthWrapper>
                  }
                />
                <Route
                  path="/admin-dashboard"
                  element={
                    <AuthWrapper
                      requireAuth={true}
                      allowedRoles={['admin', 'tenant_admin', 'system_administrator']}
                    >
                      <AdminDashboard />
                    </AuthWrapper>
                  }
                />
                <Route
                  path="/diagnostics"
                  element={
                    <AuthWrapper
                      requireAuth={true}
                      allowedRoles={['developer', 'consultant']}
                    >
                      <DiagnosticsPage />
                    </AuthWrapper>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <AuthWrapper requireAuth={true}>
                      <SettingsPage />
                    </AuthWrapper>
                  }
                />
                <Route
                  path="/health-records"
                  element={
                    <AuthWrapper requireAuth={true}>
                      <HealthRecordsPage />
                    </AuthWrapper>
                  }
                />
                <Route
                  path="/financial-planning"
                  element={
                    <AuthWrapper requireAuth={true}>
                      <FinancialPlanningPage />
                    </AuthWrapper>
                  }
                />
                <Route
                  path="/legal-documents"
                  element={
                    <AuthWrapper requireAuth={true}>
                      <LegalDocumentsPage />
                    </AuthWrapper>
                  }
                />
                <Route
                  path="/insurance-policies"
                  element={
                    <AuthWrapper requireAuth={true}>
                      <InsurancePoliciesPage />
                    </AuthWrapper>
                  }
                />
                <Route
                  path="/investment-strategies"
                  element={
                    <AuthWrapper requireAuth={true}>
                      <InvestmentStrategiesPage />
                    </AuthWrapper>
                  }
                />
                <Route
                  path="/educational-content"
                  element={
                    <AuthWrapper requireAuth={true}>
                      <EducationalContentPage />
                    </AuthWrapper>
                  }
                />
                <Route
                  path="/training-modules"
                  element={
                    <AuthWrapper requireAuth={true}>
                      <TrainingModulesPage />
                    </AuthWrapper>
                  }
                />
                <Route
                  path="/professionals-directory"
                  element={
                    <AuthWrapper requireAuth={true}>
                      <ProfessionalsDirectoryPage />
                    </AuthWrapper>
                  }
                />
                <Route
                  path="/document-upload"
                  element={
                    <AuthWrapper requireAuth={true}>
                      <DocumentUploadPage />
                    </AuthWrapper>
                  }
                />
                <Route
                  path="/document-view/:id"
                  element={
                    <AuthWrapper requireAuth={true}>
                      <DocumentViewPage />
                    </AuthWrapper>
                  }
                />
                <Route path="/access-denied" element={<AccessDeniedPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
