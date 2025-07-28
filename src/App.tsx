
import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initializeAnalytics } from "@/lib/analytics";
import { setupErrorMonitoring, monitorAuthEvents } from "@/lib/monitoring";
import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";
import { RoleProvider } from "@/context/RoleContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { TenantProvider } from "@/context/TenantContext";
import { AdvisorProvider } from "@/context/AdvisorContext";
import { AuthWrapper } from "@/components/auth/AuthWrapper";
import { getAdvisorAccessRoles } from "@/utils/roleHierarchy";
import { DynamicLandingController } from "@/components/auth/DynamicLandingController";
import { Navigation } from "@/components/Navigation";
import Index from "./pages/Index";
// Dashboard default export
import Dashboard from "./pages/Dashboard";
// Public pages
import WelcomePage from "./pages/WelcomePage";
import RetirementConfidenceScorecard from "./pages/RetirementConfidenceScorecard";
import LongevityScorecard from "./pages/LongevityScorecard";
import PublicFeeCalculator from "./pages/PublicFeeCalculator";
import RetirementIncomeGapAnalyzer from "./pages/RetirementIncomeGapAnalyzer";
import RetirementRoadmapInfo from "./pages/RetirementRoadmapInfo";
import PublicTaxCenter from "./pages/PublicTaxCenter";
import { AuthPage } from "./pages/AuthPage";
import { SecuritySettingsPage } from "./pages/SecuritySettingsPage";
import { ClientDashboard } from "./pages/ClientDashboard";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AccountantDashboard } from "./pages/AccountantDashboard";
import { ConsultantDashboard } from "./pages/ConsultantDashboard";
import { AttorneyDashboard } from "./pages/AttorneyDashboard";
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
import AdvisorInvitePage from "./pages/AdvisorInvitePage";
import ClientOnboardingPage from "./pages/ClientOnboardingPage";
import OnboardingDashboardPage from "./pages/OnboardingDashboardPage";
import MarketplacePage from "./pages/MarketplacePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import MarketplaceAdminPage from "./pages/MarketplaceAdminPage";
import CompliancePage from "./pages/CompliancePage";
import PortfolioPage from "./pages/PortfolioPage";
import GoalsDashboard from "./pages/GoalsDashboard";
import GoalDetailPage from "./pages/GoalDetailPage";
import CreateGoalPage from "./pages/CreateGoalPage";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize analytics and monitoring
    initializeAnalytics();
    setupErrorMonitoring();
    monitorAuthEvents();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TenantProvider>
            <UserProvider>
              <RoleProvider>
                <AdvisorProvider>
                  <SubscriptionProvider>
            <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <DynamicLandingController>
                <div className="min-h-screen bg-background">
                  <Navigation />
                  <Routes>
                  <Route path="/auth" element={<AuthPage />} />
                    
                    {/* Public routes - no authentication required */}
                    <Route path="/welcome" element={<WelcomePage />} />
                    <Route path="/scorecard" element={<RetirementConfidenceScorecard />} />
                    <Route path="/longevity-scorecard" element={<LongevityScorecard />} />
                    <Route path="/calculator" element={<PublicFeeCalculator />} />
                    <Route path="/gap-analyzer" element={<RetirementIncomeGapAnalyzer />} />
                    <Route path="/roadmap-info" element={<RetirementRoadmapInfo />} />
                    <Route path="/tax-center" element={<PublicTaxCenter />} />
                    
                    <Route
                      path="/"
                      element={
                        <AuthWrapper requireAuth={false}>
                          <WelcomePage />
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
                      <AuthWrapper 
                        requireAuth={true}
                        allowedRoles={['client', 'client_premium', 'advisor', 'admin', 'system_administrator', 'tenant_admin']}
                      >
                        <ClientDashboard />
                      </AuthWrapper>
                    }
                  />
                  <Route
                    path="/advisor-dashboard"
                    element={
                      <AuthWrapper
                        requireAuth={true}
                        allowedRoles={['advisor', 'admin', 'tenant_admin', 'system_administrator']}
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
                    path="/accountant-dashboard"
                    element={
                      <AuthWrapper
                        requireAuth={true}
                        allowedRoles={['accountant', 'admin', 'tenant_admin', 'system_administrator']}
                      >
                        <AccountantDashboard />
                      </AuthWrapper>
                    }
                  />
                  <Route
                    path="/consultant-dashboard"
                    element={
                      <AuthWrapper
                        requireAuth={true}
                        allowedRoles={['consultant', 'admin', 'tenant_admin', 'system_administrator']}
                      >
                        <ConsultantDashboard />
                      </AuthWrapper>
                    }
                  />
                  <Route
                    path="/attorney-dashboard"
                    element={
                      <AuthWrapper
                        requireAuth={true}
                        allowedRoles={['attorney', 'admin', 'tenant_admin', 'system_administrator']}
                      >
                        <AttorneyDashboard />
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
                  <Route
                    path="/invite-client"
                    element={
                      <AuthWrapper 
                        requireAuth={true}
                        allowedRoles={getAdvisorAccessRoles()}
                      >
                        <AdvisorInvitePage />
                      </AuthWrapper>
                    }
                  />
                  <Route
                    path="/onboarding-dashboard"
                    element={
                      <AuthWrapper 
                        requireAuth={true}
                        allowedRoles={getAdvisorAccessRoles()}
                      >
                        <OnboardingDashboardPage />
                      </AuthWrapper>
                    }
                  />
                  <Route path="/onboard/:token" element={<ClientOnboardingPage />} />
                  
                  {/* Investment Marketplace Routes */}
                  <Route
                    path="/marketplace"
                    element={
                      <AuthWrapper requireAuth={true}>
                        <MarketplacePage />
                      </AuthWrapper>
                    }
                  />
                  <Route
                    path="/marketplace/product/:id"
                    element={
                      <AuthWrapper requireAuth={true}>
                        <ProductDetailsPage />
                      </AuthWrapper>
                    }
                  />
                  <Route
                    path="/marketplace/admin"
                    element={
                      <AuthWrapper 
                        requireAuth={true}
                        allowedRoles={['admin', 'advisor', 'system_administrator', 'tenant_admin']}
                      >
                        <MarketplaceAdminPage />
                      </AuthWrapper>
                    }
                  />
                  <Route
                    path="/compliance"
                    element={
                      <AuthWrapper 
                        requireAuth={true}
                        allowedRoles={['admin', 'system_administrator', 'tenant_admin']}
                      >
                        <CompliancePage />
                      </AuthWrapper>
                    }
                  />
                  <Route
                    path="/portfolio"
                    element={
                      <AuthWrapper requireAuth={true}>
                        <PortfolioPage />
                      </AuthWrapper>
                    }
                  />

                  {/* Goals & Aspirations Routes */}
                  <Route
                    path="/goals"
                    element={
                      <AuthWrapper requireAuth={true}>
                        <GoalsDashboard />
                      </AuthWrapper>
                    }
                  />
                  <Route
                    path="/goals/create"
                    element={
                      <AuthWrapper requireAuth={true}>
                        <CreateGoalPage />
                      </AuthWrapper>
                    }
                  />
                  <Route
                    path="/goals/:id"
                    element={
                      <AuthWrapper requireAuth={true}>
                        <GoalDetailPage />
                      </AuthWrapper>
                    }
                  />
                  
                  <Route path="/access-denied" element={<AccessDeniedPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
                </div>
              </DynamicLandingController>
            </BrowserRouter>
              </TooltipProvider>
                </SubscriptionProvider>
              </AdvisorProvider>
            </RoleProvider>
          </UserProvider>
        </TenantProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
  );
};

export default App;
