import React, { Suspense } from "react";
import { createBrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { SecureMessagesPage } from "./pages/SecureMessagesPage";
import { HomePage } from "./pages/TabPages";
import { AnnuitiesPage } from "./pages/AnnuitiesPage";
import NotFoundPage from "./components/errors/404Page";
import NoticesPage from "./pages/NoticesPage";
import InsurancePage from "./pages/InsurancePage";
import LendingDashboard from "./pages/LendingDashboard";
import ProfessionalNetworkPage from "./pages/ProfessionalNetworkPage";
import ComplianceAuditPage from "./pages/ComplianceAuditPage";
import FiduciaryInsurancePage from "./pages/FiduciaryInsurancePage";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ClientDashboard } from "./pages/dashboard/ClientDashboard";
import { AdminDashboard } from "./pages/dashboard/AdminDashboard";
import AdvisorDashboard from "./pages/AdvisorDashboard";
import { AccountantDashboard } from "./pages/dashboard/AccountantDashboard";
import { ConsultantDashboard } from "./pages/dashboard/ConsultantDashboard";
import { AttorneyDashboard } from "./pages/dashboard/AttorneyDashboard";
import { TenantAdminDashboard } from "./pages/dashboard/TenantAdminDashboard";
import { SystemAdministratorDashboard } from "./pages/dashboard/SystemAdministratorDashboard";
import { ComingSoonPage } from "./pages/ComingSoonPage";
import { WealthDashboardPage } from "./pages/WealthDashboardPage";
import { AccountsOverviewPage } from "./pages/AccountsOverviewPage";
import { BudgetsPage } from "./pages/BudgetsPage";
import { BillPayPage } from "./pages/BillPayPage";
import { LoanApplicationPage } from "./pages/lending/LoanApplicationPage";
import { LoanStatusPage } from "./pages/lending/LoanStatusPage";
import { PartnerComparisonPage } from "./pages/lending/PartnerComparisonPage";
import { AdvisorLendingDashboard } from "./pages/lending/AdvisorLendingDashboard";
import { AdminRoute } from "./components/auth/AdminRoute";

// Legal pages
import { PrivacyPolicyPage } from "./pages/legal/PrivacyPolicyPage";
import { TermsOfServicePage } from "./pages/legal/TermsOfServicePage";
import { DataProcessingPage } from "./pages/legal/DataProcessingPage";
import { CookiePolicyPage } from "./pages/legal/CookiePolicyPage";

// Help pages
import { GettingStartedPage } from "./pages/help/GettingStartedPage";
import { VideosPage } from "./pages/help/VideosPage";
import { APIPage } from "./pages/help/APIPage";
import { WebinarsPage } from "./pages/help/WebinarsPage";
import EducationPage from "./pages/EducationPage";

// NIL pages - removed
import ReadyCheck from "./pages/admin/ReadyCheck";
import { QAPlaybookPage } from "./pages/qa/QAPlaybookPage";

// Lazy-loaded components
import {
  StartBrandPage, BrandHomePage, SupervisorHomePage,
  ProLeadsAdvisor, ProLeadsCPA, ProLeadsAttorney, ProLeadsInsurance, ProLeadsHealthcare, ProLeadsRealtor,
  ProDashboardCPA, ProDashboardAttorney, ProDashboardInsurance, ProDashboardHealthcare, ProDashboardRealtor,
  Accountants, AccountantsAccess, Attorneys, AttorneysAccess,
  InsuranceHomePage, InsuranceMeetingsPage, InsurancePipelinePage, InsuranceProofPage,
  AdvisorsLayout, AdvisorHomePage, AdvisorLeadsPage, AdvisorMeetingsPage, AdvisorCampaignsPage, AdvisorPipelinePage, AdvisorToolsPage, AdvisorProofPage,
  AttorneyHomePage, AttorneyLeadsPage, AttorneyMeetingsPage, AttorneyMattersPage, AttorneyProofPage,
  InsuranceLifeHomePage, InsuranceLifeLeadsPage, InsuranceLifeToolsPage, InsuranceLifeProofPage,
  MedicareHomePage, MedicareLeadsPage, MedicareSOAPage, MedicareProofPage,
  HealthcareHomePage, HealthcareLeadsPage, HealthcareToolsPage, HealthcareProofPage,
  RealtorHomePage, RealtorLeadsPage, RealtorToolsPage, RealtorProofPage,
  SolutionsPage, InviteAdvisor, InviteRedemption
} from "./routes-lazy";

// QA pages removed for production
// All QA routes, checklists, and testing components removed for production security

const LandingNew = React.lazy(() => import("@/pages/LandingNew"));
const OldHomePage = React.lazy(() => import("./pages/TabPages").then(m => ({ default: m.HomePage })));
const FamilyOnboarding = React.lazy(() => import('./pages/family/FamilyOnboarding').then(m => ({ default: m.FamilyOnboarding })));
const FamilyHomePage = React.lazy(() => import('./pages/family/FamilyHomePage').then(m => ({ default: m.FamilyHomePage })));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Suspense fallback={<div>Loading...</div>}><LandingNew /></Suspense>,
  },
  {
    path: "/old-home",
    element: <Suspense fallback={<div>Loading...</div>}><OldHomePage /></Suspense>,
  },
  {
    path: "/start/families",
    element: <Suspense fallback={<div>Loading...</div>}><FamilyOnboarding /></Suspense>
  },
  {
    path: "/family/home",
    element: <Suspense fallback={<div>Loading...</div>}><FamilyHomePage /></Suspense>
  },
  {
    path: "/annuities",
    element: <AnnuitiesPage />,
  },
  {
    path: "/notices",
    element: <NoticesPage />,
  },
  {
    path: "/insurance",
    element: <InsurancePage />,
  },
  {
    path: "/lending",
    element: <LendingDashboard />,
  },
  {
    path: "/lending/apply",
    element: <LoanApplicationPage />,
  },
  {
    path: "/lending/status/:loanId",
    element: <LoanStatusPage />,
  },
  {
    path: "/lending/partners",
    element: <PartnerComparisonPage />,
  },
  {
    path: "/advisor/lending",
    element: <AdvisorLendingDashboard />,
  },
  {
    path: "/professional-network",
    element: <ProfessionalNetworkPage />,
  },
  {
    path: "/compliance-audit",
    element: <ComplianceAuditPage />,
  },
  {
    path: "/insurance/education/:productType",
    element: <FiduciaryInsurancePage />,
  },
  // Dashboard routes with new layout
  {
    path: "/client-dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <ClientDashboard />,
      }
    ]
  },
  {
    path: "/advisor-dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <AdvisorDashboard />,
      }
    ]
  },
  {
    path: "/admin-dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      }
    ]
  },
  {
    path: "/accountant-dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <AccountantDashboard />,
      }
    ]
  },
  {
    path: "/consultant-dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <ConsultantDashboard />,
      }
    ]
  },
  {
    path: "/attorney-dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <AttorneyDashboard />,
      }
    ]
  },
  {
    path: "/tenant-admin-dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <TenantAdminDashboard />,
      }
    ]
  },
  {
    path: "/system-administrator-dashboard", 
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <SystemAdministratorDashboard />,
      }
    ]
  },
  // NIL Platform routes - removed
  {
    path: "/admin/ready-check",
    element: <ReadyCheck />
  },
  // Education route
  {
    path: "/education",
    element: <EducationPage />
  },
  // Coming Soon routes for missing features
  {
    path: "/client-education",
    element: <ComingSoonPage featureName="Education & Resources" description="Comprehensive educational resources and solution catalog for family office clients." />
  },
  {
    path: "/investments", 
    element: <ComingSoonPage featureName="Investment Solutions" description="Advanced investment management and portfolio optimization tools." />
  },
  {
    path: "/tax-planning",
    element: <ComingSoonPage featureName="Tax Planning" description="Comprehensive tax planning and optimization strategies." />
  },
  {
    path: "/client-lending",
    element: <ComingSoonPage featureName="Lending Solutions" description="Customized lending solutions and credit management tools." />
  },
  {
    path: "/estate-planning", 
    element: <ComingSoonPage featureName="Estate Planning" description="Advanced estate planning and wealth transfer strategies." />
  },
  {
    path: "/wealth",
    element: <WealthDashboardPage />
  },
  {
    path: "/wealth/accounts", 
    element: <AccountsOverviewPage />
  },
  {
    path: "/wealth/goals/budgets",
    element: <BudgetsPage />
  },
  {
    path: "/wealth/bill-pay",
    element: <BillPayPage />
  },
  {
    path: "/health",
    element: <ComingSoonPage featureName="Health Optimization" description="Comprehensive health optimization and wellness management tools." />
  },
  {
    path: "/start/brand",
    element: <Suspense fallback={<div>Loading...</div>}><StartBrandPage /></Suspense>
  },
  {
    path: "/brand/home",
    element: <Suspense fallback={<div>Loading...</div>}><BrandHomePage /></Suspense>
  },
  {
    path: "/supervisor",
    element: <Suspense fallback={<div>Loading...</div>}><SupervisorHomePage /></Suspense>
  },
  {
    path: "/advisor/leads",
    element: <Suspense fallback={<div>Loading...</div>}><ProLeadsAdvisor /></Suspense>
  },
  {
    path: "/cpa/leads", 
    element: <Suspense fallback={<div>Loading...</div>}><ProLeadsCPA /></Suspense>
  },
  {
    path: "/attorney/leads",
    element: <Suspense fallback={<div>Loading...</div>}><ProLeadsAttorney /></Suspense>
  },
  {
    path: "/insurance/leads",
    element: <Suspense fallback={<div>Loading...</div>}><ProLeadsInsurance /></Suspense>
  },
  {
    path: "/healthcare/leads", 
    element: <Suspense fallback={<div>Loading...</div>}><ProLeadsHealthcare /></Suspense>
  },
  {
    path: "/realtor/leads",
    element: <Suspense fallback={<div>Loading...</div>}><ProLeadsRealtor /></Suspense>
  },
  // Pro dashboard routes
  {
    path: "/cpa",
    element: <Suspense fallback={<div>Loading...</div>}><ProDashboardCPA /></Suspense>
  },
  {
    path: "/pros/accountants",
    element: <Suspense fallback={<div>Loading...</div>}><Accountants /></Suspense>
  },
  {
    path: "/pros/accountants/access",
    element: <Suspense fallback={<div>Loading...</div>}><AccountantsAccess /></Suspense>
  },
  {
    path: "/pros/attorneys",
    element: <Suspense fallback={<div>Loading...</div>}><Attorneys /></Suspense>
  },
  {
    path: "/pros/attorneys/access",
    element: <Suspense fallback={<div>Loading...</div>}><AttorneysAccess /></Suspense>
  },
  {
    path: "/attorney",
    element: <Suspense fallback={<div>Loading...</div>}><ProDashboardAttorney /></Suspense>
  },
  {
    path: "/insurance/home",
    element: <Suspense fallback={<div>Loading...</div>}><InsuranceHomePage /></Suspense>
  },
  {
    path: "/insurance/meetings",
    element: <Suspense fallback={<div>Loading...</div>}><InsuranceMeetingsPage /></Suspense>
  },
  {
    path: "/insurance/pipeline",
    element: <Suspense fallback={<div>Loading...</div>}><InsurancePipelinePage /></Suspense>
  },
  {
    path: "/insurance/proof",
    element: <Suspense fallback={<div>Loading...</div>}><InsuranceProofPage /></Suspense>
  },
  {
    path: "/insurance",
    element: <Suspense fallback={<div>Loading...</div>}><ProDashboardInsurance /></Suspense>
  },
  {
    path: "/healthcare",
    element: <Suspense fallback={<div>Loading...</div>}><ProDashboardHealthcare /></Suspense>
  },
  {
    path: "/realtor",
    element: <Suspense fallback={<div>Loading...</div>}><ProDashboardRealtor /></Suspense>
  },
  // Advisor workspace routes
  {
    path: "/advisors",
    element: <Suspense fallback={<div>Loading...</div>}><AdvisorsLayout /></Suspense>,
    children: [
      {
        path: "home",
        element: <Suspense fallback={<div>Loading...</div>}><AdvisorHomePage /></Suspense>
      },
      {
        path: "leads",
        element: <Suspense fallback={<div>Loading...</div>}><AdvisorLeadsPage /></Suspense>
      },
      {
        path: "meetings",
        element: <Suspense fallback={<div>Loading...</div>}><AdvisorMeetingsPage /></Suspense>
      },
      {
        path: "campaigns",
        element: <Suspense fallback={<div>Loading...</div>}><AdvisorCampaignsPage /></Suspense>
      },
      {
        path: "pipeline",
        element: <Suspense fallback={<div>Loading...</div>}><AdvisorPipelinePage /></Suspense>
      },
      {
        path: "tools",
        element: <Suspense fallback={<div>Loading...</div>}><AdvisorToolsPage /></Suspense>
      },
      {
        path: "proof",
        element: <Suspense fallback={<div>Loading...</div>}><AdvisorProofPage /></Suspense>
      }
    ]
  },
  {
    path: "/advisor/*",
    element: <ComingSoonPage featureName="Legacy Advisor Tools" description="Professional advisor management and client service tools." />
  },
  {
    path: "/accountant/*", 
    element: <ComingSoonPage featureName="Accounting Services" description="Professional accounting and tax preparation services." />
  },
  {
    path: "/consultant/*",
    element: <ComingSoonPage featureName="Consulting Services" description="Professional consulting and business advisory services." />
  },
  {
    path: "/attorney/*",
    element: (
      <div className="min-h-screen bg-background">
        <div className="border-b">
          <nav className="container mx-auto px-6 py-3">
            <div className="flex items-center space-x-6">
              <Link to="/attorney/home" className="text-sm font-medium">Home</Link>
              <Link to="/attorney/leads" className="text-sm text-muted-foreground hover:text-foreground">Leads</Link>
              <Link to="/attorney/meetings" className="text-sm text-muted-foreground hover:text-foreground">Meetings</Link>
              <Link to="/attorney/matters" className="text-sm text-muted-foreground hover:text-foreground">Matters</Link>
              <Link to="/attorney/proof" className="text-sm text-muted-foreground hover:text-foreground">Proof</Link>
            </div>
          </nav>
        </div>
        <Routes>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Suspense fallback={<div>Loading...</div>}><AttorneyHomePage /></Suspense>} />
          <Route path="leads" element={<Suspense fallback={<div>Loading...</div>}><AttorneyLeadsPage /></Suspense>} />
          <Route path="meetings" element={<Suspense fallback={<div>Loading...</div>}><AttorneyMeetingsPage /></Suspense>} />
          <Route path="matters" element={<Suspense fallback={<div>Loading...</div>}><AttorneyMattersPage /></Suspense>} />
          <Route path="proof" element={<Suspense fallback={<div>Loading...</div>}><AttorneyProofPage /></Suspense>} />
        </Routes>
      </div>
    )
  },
  {
    path: "/insurance/life/*",
    element: (
      <div className="min-h-screen bg-background">
        <Routes>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Suspense fallback={<div>Loading...</div>}><InsuranceLifeHomePage /></Suspense>} />
          <Route path="leads" element={<Suspense fallback={<div>Loading...</div>}><InsuranceLifeLeadsPage /></Suspense>} />
          <Route path="tools" element={<Suspense fallback={<div>Loading...</div>}><InsuranceLifeToolsPage /></Suspense>} />
          <Route path="proof" element={<Suspense fallback={<div>Loading...</div>}><InsuranceLifeProofPage /></Suspense>} />
        </Routes>
      </div>
    )
  },
  {
    path: "/medicare/*",
    element: (
      <div className="min-h-screen bg-background">
        <Routes>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Suspense fallback={<div>Loading...</div>}><MedicareHomePage /></Suspense>} />
          <Route path="leads" element={<Suspense fallback={<div>Loading...</div>}><MedicareLeadsPage /></Suspense>} />
          <Route path="soa" element={<Suspense fallback={<div>Loading...</div>}><MedicareSOAPage /></Suspense>} />
          <Route path="proof" element={<Suspense fallback={<div>Loading...</div>}><MedicareProofPage /></Suspense>} />
        </Routes>
      </div>
    )
  },
  {
    path: "/health/*",
    element: (
      <div className="min-h-screen bg-background">
        <Routes>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Suspense fallback={<div>Loading...</div>}><HealthcareHomePage /></Suspense>} />
          <Route path="leads" element={<Suspense fallback={<div>Loading...</div>}><HealthcareLeadsPage /></Suspense>} />
          <Route path="tools" element={<Suspense fallback={<div>Loading...</div>}><HealthcareToolsPage /></Suspense>} />
          <Route path="proof" element={<Suspense fallback={<div>Loading...</div>}><HealthcareProofPage /></Suspense>} />
        </Routes>
      </div>
    )
  },
  {
    path: "/realtor/*",
    element: (
      <div className="min-h-screen bg-background">
        <Routes>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Suspense fallback={<div>Loading...</div>}><RealtorHomePage /></Suspense>} />
          <Route path="leads" element={<Suspense fallback={<div>Loading...</div>}><RealtorLeadsPage /></Suspense>} />
          <Route path="tools" element={<Suspense fallback={<div>Loading...</div>}><RealtorToolsPage /></Suspense>} />
          <Route path="proof" element={<Suspense fallback={<div>Loading...</div>}><RealtorProofPage /></Suspense>} />
        </Routes>
      </div>
    )
  },
  {
    path: "/admin/*",
    element: (
      <AdminRoute roles={['admin', 'tenant_admin', 'system_administrator']}>
        <ComingSoonPage featureName="Administrative Tools" description="Platform administration and user management tools." />
      </AdminRoute>
    )
  },
  // Solutions routes
  {
    path: "/solutions/:slug",
    element: <Suspense fallback={<div>Loading...</div>}><SolutionsPage /></Suspense>
  },
  // Legal routes
  {
    path: "/legal/privacy-policy",
    element: <PrivacyPolicyPage />
  },
  {
    path: "/legal/terms-of-service", 
    element: <TermsOfServicePage />
  },
  {
    path: "/legal/data-processing",
    element: <DataProcessingPage />
  },
  {
    path: "/legal/cookie-policy",
    element: <CookiePolicyPage />
  },
  // Help routes
  {
    path: "/help/getting-started",
    element: <GettingStartedPage />
  },
  {
    path: "/help/videos",
    element: <VideosPage />
  },
  {
    path: "/help/api",
    element: <APIPage />
  },
  {
    path: "/help/webinars",
    element: <WebinarsPage />
  },
  {
    path: "/secure-messages",
    element: <SecureMessagesPage />
  },
  {
    path: "/invite/advisor",
    element: <Suspense fallback={<div>Loading...</div>}><InviteAdvisor /></Suspense>
  },
  {
    path: "/invite/:token",
    element: <Suspense fallback={<div>Loading...</div>}><InviteRedemption /></Suspense>
  },
  {
    path: "/qa-playbook",
    element: <QAPlaybookPage />
  },
  // QA routes removed for production security
  // 404 catch-all route
  {
    path: "*",
    element: <NotFoundPage />
  }
]);