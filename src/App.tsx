
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
import { QABypassIndicator } from "@/components/security/QABypassIndicator";
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
import { AdvisorCPARiskDashboard } from "./pages/AdvisorCPARiskDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AccountantDashboard } from "./pages/AccountantDashboard";
import { ConsultantDashboard } from "./pages/ConsultantDashboard";
import { AttorneyDashboard } from "./pages/AttorneyDashboard";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DiagnosticsPage } from "./pages/DiagnosticsPage";
import NavigationDiagnostics from "./pages/NavigationDiagnostics";
import NavigationQATest from "./pages/NavigationQATest";
import { AuthTestSuite } from "./components/test/AuthTestSuite";
import { SettingsPage } from "./pages/SettingsPage";
import { HealthRecordsPage } from "./pages/HealthRecordsPage";
import { FinancialPlanningPage } from "./pages/FinancialPlanningPage";
import { LegalDocumentsPage } from "./pages/LegalDocumentsPage";
import { InsurancePoliciesPage } from "./pages/InsurancePoliciesPage";
import { InvestmentStrategiesPage } from "./pages/InvestmentStrategiesPage";
import { EducationalContentPage } from "./pages/EducationalContentPage";
import EducationHub from "./pages/EducationHub";
import { TrainingModulesPage } from "./pages/TrainingModulesPage";
import { ProfessionalsDirectoryPage } from "./pages/ProfessionalsDirectoryPage";
import { DocumentUploadPage } from "./pages/DocumentUploadPage";
import { DocumentViewPage } from "./pages/DocumentViewPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AccessDeniedPage } from "./pages/AccessDeniedPage";
import AdvisorInvitePage from "./pages/AdvisorInvitePage";
import ClientOnboardingPage from "./pages/ClientOnboardingPage";
import OnboardingDashboardPage from "./pages/OnboardingDashboardPage";
import { QATestDashboard } from "./pages/QATestDashboard";
import MarketplacePage from "./pages/MarketplacePage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import MarketplaceAdminPage from "./pages/MarketplaceAdminPage";
import CompliancePage from "./pages/CompliancePage";
import PortfolioPage from "./pages/PortfolioPage";
import GoalsDashboard from "./pages/GoalsDashboard";
import GoalDetailPage from "./pages/GoalDetailPage";
import CreateGoalPage from "./pages/CreateGoalPage";
// Removed QA test pages for production
// Removed QA pages for production
import { ComplianceReportingPage } from "./pages/ComplianceReportingPage";
import Reports from "./pages/Reports";
import BusinessCenter from "./pages/BusinessCenter";
import { ProposalWizard } from "./pages/advisor/ProposalWizard";
import { ProposalList } from "./pages/advisor/ProposalList";
import { AnnuitiesPage } from "./pages/AnnuitiesPage";
import { EducationCenter } from "./components/annuities/EducationCenter";
import { ProductComparison } from "./components/annuities/ProductComparison";
import { ContractAnalyzer } from "./components/annuities/ContractAnalyzer";
import { AnnuityCalculators } from "./components/annuities/calculators/AnnuityCalculators";
import { AnnuityMarketplace } from "./components/annuities/marketplace/AnnuityMarketplace";
import { FiduciaryReview } from "./components/annuities/FiduciaryReview";
import ClientsPage from "./pages/advisor/ClientsPage";
import ProspectsPage from "./pages/advisor/ProspectsPage";
import WealthOverviewPage from "./pages/WealthOverviewPage";
// Client pages
import ClientEducationPage from "./pages/client/ClientEducationPage";
import InvestmentsPage from "./pages/client/InvestmentsPage";
import TaxPlanningPage from "./pages/client/TaxPlanningPage";
import InsurancePage from "./pages/client/InsurancePage";
// Wealth pages
import AccountsOverviewPage from "./pages/wealth/AccountsOverviewPage";
import PremiumTaxPage from "./pages/wealth/PremiumTaxPage";
// Health pages
import HealthOverviewPage from "./pages/health/HealthOverviewPage";
// Advisor pages
import AdvisorPortfolioPage from "./pages/advisor/PortfolioPage";
import PerformancePage from "./pages/advisor/PerformancePage";
import BillingPage from "./pages/advisor/BillingPage";
import AdvisorCompliancePage from "./pages/advisor/CompliancePage";
// Accountant pages
import TaxPrepPage from "./pages/accountant/TaxPrepPage";
import AccountantTaxPlanningPage from "./pages/accountant/TaxPlanningPage";
import LedgerPage from "./pages/accountant/LedgerPage";
import StatementsPage from "./pages/accountant/StatementsPage";
// Consultant pages
import ProjectsPage from "./pages/consultant/ProjectsPage";
import AssessmentsPage from "./pages/consultant/AssessmentsPage";
import MethodologiesPage from "./pages/consultant/MethodologiesPage";
import BestPracticesPage from "./pages/consultant/BestPracticesPage";
// Attorney pages
import EstatePlanningPage from "./pages/attorney/EstatePlanningPage";
import BusinessLawPage from "./pages/attorney/BusinessLawPage";
import ContractsPage from "./pages/attorney/ContractsPage";
import ResearchPage from "./pages/attorney/ResearchPage";
// Admin pages
import UsersPage from "./pages/admin/UsersPage";
import RolesPage from "./pages/admin/RolesPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import MonitoringPage from "./pages/admin/MonitoringPage";

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
                  <QABypassIndicator />
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
                        <AuthWrapper requireAuth={false} redirectAuthenticatedTo="/client-dashboard">
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
                    path="/advisor/risk-dashboard"
                    element={
                      <AuthWrapper
                        requireAuth={true}
                        allowedRoles={['advisor', 'admin', 'tenant_admin', 'system_administrator', 'accountant']}
                      >
                        <AdvisorCPARiskDashboard />
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
                    path="/auth-test"
                    element={
                      <AuthWrapper requireAuth={false}>
                        <AuthTestSuite />
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
                    path="/education"
                    element={
                      <AuthWrapper requireAuth={true}>
                        <EducationHub />
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
                    path="/compliance/reporting"
                    element={
                      <AuthWrapper 
                        requireAuth={true}
                        allowedRoles={['admin', 'system_administrator', 'tenant_admin']}
                      >
                        <ComplianceReportingPage />
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

                  {/* Reports Route */}
                  <Route
                    path="/reports"
                    element={
                      <AuthWrapper requireAuth={true}>
                        <Reports />
                      </AuthWrapper>
                    }
                  />

                  {/* Business Center Route */}
                  <Route
                    path="/business-center"
                    element={
                      <AuthWrapper requireAuth={true}>
                        <BusinessCenter />
                      </AuthWrapper>
                    }
                  />

                  {/* Annuities Routes */}
                  <Route path="/annuities" element={<AnnuitiesPage />} />
                  <Route path="/annuities/learn" element={<EducationCenter />} />
                  <Route path="/annuities/compare" element={<ProductComparison />} />
                  <Route path="/annuities/analyze" element={<ContractAnalyzer />} />
                  <Route path="/annuities/calculators" element={<AnnuityCalculators />} />
                  <Route path="/annuities/marketplace" element={<AnnuityMarketplace />} />
                  <Route path="/annuities/review" element={<FiduciaryReview />} />

                  {/* Advisor Proposal Routes */}
                  <Route
                    path="/advisor/proposals"
                    element={
                      <AuthWrapper
                        requireAuth={true}
                        allowedRoles={['advisor', 'admin', 'tenant_admin', 'system_administrator']}
                      >
                        <ProposalList />
                      </AuthWrapper>
                    }
                  />
                  <Route
                    path="/advisor/proposals/new"
                    element={
                      <AuthWrapper
                        requireAuth={true}
                        allowedRoles={['advisor', 'admin', 'tenant_admin', 'system_administrator']}
                      >
                        <ProposalWizard />
                      </AuthWrapper>
                    }
                   />

                   {/* Additional Pages for Missing Routes */}
                   <Route
                     path="/advisor/clients"
                     element={
                       <AuthWrapper
                         requireAuth={true}
                         allowedRoles={['advisor', 'admin', 'tenant_admin', 'system_administrator']}
                       >
                         <ClientsPage />
                       </AuthWrapper>
                     }
                   />
                   <Route
                     path="/advisor/prospects" 
                     element={
                       <AuthWrapper
                         requireAuth={true}
                         allowedRoles={['advisor', 'admin', 'tenant_admin', 'system_administrator']}
                       >
                         <ProspectsPage />
                       </AuthWrapper>
                     }
                   />
                    <Route
                      path="/wealth"
                      element={
                        <AuthWrapper requireAuth={true}>
                          <WealthOverviewPage />
                        </AuthWrapper>
                      }
                    />

                    {/* Client Education & Solutions Routes */}
                    <Route
                      path="/client-education"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['client', 'client_premium', 'advisor', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <ClientEducationPage />
                        </AuthWrapper>
                      }
                    />
                    <Route
                      path="/investments"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['client', 'client_premium', 'advisor', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <InvestmentsPage />
                        </AuthWrapper>
                      }
                    />
                    <Route
                      path="/tax-planning"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['client', 'client_premium', 'advisor', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <TaxPlanningPage />
                        </AuthWrapper>
                      }
                    />
                    <Route
                      path="/insurance"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['client', 'client_premium', 'advisor', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <InsurancePage />
                        </AuthWrapper>
                      }
                    />

                    {/* Wealth Management Routes */}
                    <Route
                      path="/wealth/accounts"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['client', 'client_premium', 'advisor', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <AccountsOverviewPage />
                        </AuthWrapper>
                      }
                    />
                    <Route
                      path="/wealth/premium/tax"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['client_premium', 'advisor', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <PremiumTaxPage />
                        </AuthWrapper>
                      }
                    />

                    {/* Health Optimization Routes */}
                    <Route
                      path="/health"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['client', 'client_premium', 'advisor', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <HealthOverviewPage />
                        </AuthWrapper>
                      }
                    />

                    {/* Advisor Portfolio Management Routes */}
                    <Route
                      path="/advisor/portfolio"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['advisor', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <AdvisorPortfolioPage />
                        </AuthWrapper>
                      }
                    />
                    <Route
                      path="/advisor/performance"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['advisor', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <PerformancePage />
                        </AuthWrapper>
                      }
                    />
                    <Route
                      path="/advisor/billing"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['advisor', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <BillingPage />
                        </AuthWrapper>
                      }
                    />
                    <Route
                      path="/advisor/compliance"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['advisor', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <AdvisorCompliancePage />
                        </AuthWrapper>
                      }
                    />

                    {/* Accountant Routes */}
                    <Route
                      path="/accountant/tax-prep"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['accountant', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <TaxPrepPage />
                        </AuthWrapper>
                      }
                    />
                    <Route
                      path="/accountant/tax-planning"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['accountant', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <AccountantTaxPlanningPage />
                        </AuthWrapper>
                      }
                    />
                    <Route
                      path="/accountant/ledger"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['accountant', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <LedgerPage />
                        </AuthWrapper>
                      }
                    />
                    <Route
                      path="/accountant/statements"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['accountant', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <StatementsPage />
                        </AuthWrapper>
                      }
                    />

                    {/* Consultant Routes */}
                    <Route
                      path="/consultant/projects"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['consultant', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <ProjectsPage />
                        </AuthWrapper>
                      }
                    />
                    <Route
                      path="/consultant/assessments"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['consultant', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <AssessmentsPage />
                        </AuthWrapper>
                      }
                    />
                    <Route
                      path="/consultant/methodologies"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['consultant', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <MethodologiesPage />
                        </AuthWrapper>
                      }
                    />
                    <Route
                      path="/consultant/best-practices"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['consultant', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <BestPracticesPage />
                        </AuthWrapper>
                      }
                    />

                    {/* Attorney Routes */}
                    <Route
                      path="/attorney/estate-planning"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['attorney', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <EstatePlanningPage />
                        </AuthWrapper>
                      }
                    />
                    <Route
                      path="/attorney/business-law"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['attorney', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <BusinessLawPage />
                        </AuthWrapper>
                      }
                    />
                    <Route
                      path="/attorney/contracts"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['attorney', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <ContractsPage />
                        </AuthWrapper>
                      }
                    />
                    <Route
                      path="/attorney/research"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['attorney', 'admin', 'tenant_admin', 'system_administrator']}
                        >
                          <ResearchPage />
                        </AuthWrapper>
                      }
                    />

                    {/* Admin Routes */}
                    <Route
                      path="/admin/users"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['admin', 'tenant_admin', 'system_administrator']}
                        >
                          <UsersPage />
                        </AuthWrapper>
                      }
                    />
                    <Route
                      path="/admin/roles"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['admin', 'tenant_admin', 'system_administrator']}
                        >
                          <RolesPage />
                        </AuthWrapper>
                      }
                    />
                    <Route
                      path="/admin/settings"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['admin', 'tenant_admin', 'system_administrator']}
                        >
                          <AdminSettingsPage />
                        </AuthWrapper>
                      }
                    />
                    <Route
                      path="/admin/monitoring"
                      element={
                        <AuthWrapper
                          requireAuth={true}
                          allowedRoles={['admin', 'tenant_admin', 'system_administrator']}
                        >
                          <MonitoringPage />
                        </AuthWrapper>
                      }
                    />

                     {/* Navigation & QA Testing Routes */}
                     <Route path="/navigation-diagnostics" element={
                       <ProtectedRoute>
                         <NavigationDiagnostics />
                       </ProtectedRoute>
                     } />
                     <Route path="/navigation-qa-test" element={
                       <ProtectedRoute>
                         <NavigationQATest />
                       </ProtectedRoute>
                     } />
                     
                      {/* QA Test Dashboard - Development Only */}
                      <Route
                        path="/qa-dashboard"
                        element={
                          <ProtectedRoute>
                            <QATestDashboard />
                          </ProtectedRoute>
                        }
                      />
                      {/* QA Testing Routes removed for production */}
                      {/* QA brand audit route removed for production */}
                    
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
