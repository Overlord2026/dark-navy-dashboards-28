import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
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

// NIL pages
import NILHub from "./pages/NILHub";
import NILIndex from "./pages/NILIndex";
import AthleteProfile from "./pages/AthleteProfile";
import SchoolDashboard from "./pages/nil/school/SchoolDashboard";
import BrandDashboard from "./pages/nil/brand/BrandDashboard";
import NILAdminAnchors from "./pages/admin/NILAdminAnchors";
import AthleteHomeDashboard from "./pages/nil/athlete/AthleteHomeDashboard";
import AgentHomeDashboard from "./pages/nil/agent/AgentHomeDashboard";
import ReadyCheck from "./pages/admin/ReadyCheck";

// QA pages removed for production
// All QA routes, checklists, and testing components removed for production security

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
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
  // NIL Platform routes
  {
    path: "/nil",
    element: <NILHub />
  },
  {
    path: "/nil/index",
    element: <NILIndex />
  },
  {
    path: "/a/:handle",
    element: <AthleteProfile />
  },
  {
    path: "/nil/school/home",
    element: <SchoolDashboard />
  },
  {
    path: "/nil/brand/home",
    element: <BrandDashboard />
  },
  {
    path: "/nil/athlete/home",
    element: <AthleteHomeDashboard />
  },
  {
    path: "/nil/agent/home",
    element: <AgentHomeDashboard />
  },
  {
    path: "/admin/nil/anchors",
    element: <NILAdminAnchors />
  },
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
    path: "/advisor/leads",
    element: React.createElement(() => {
      const { ProLeadsPage } = require('./pages/pro/ProLeadsPage');
      return React.createElement(ProLeadsPage, { persona: 'advisor' });
    })
  },
  {
    path: "/cpa/leads", 
    element: React.createElement(() => {
      const { ProLeadsPage } = require('./pages/pro/ProLeadsPage');
      return React.createElement(ProLeadsPage, { persona: 'cpa' });
    })
  },
  {
    path: "/attorney/leads",
    element: React.createElement(() => {
      const { ProLeadsPage } = require('./pages/pro/ProLeadsPage');
      return React.createElement(ProLeadsPage, { persona: 'attorney' });
    })
  },
  {
    path: "/insurance/leads",
    element: React.createElement(() => {
      const { ProLeadsPage } = require('./pages/pro/ProLeadsPage');
      return React.createElement(ProLeadsPage, { persona: 'insurance' });
    })
  },
  {
    path: "/healthcare/leads", 
    element: React.createElement(() => {
      const { ProLeadsPage } = require('./pages/pro/ProLeadsPage');
      return React.createElement(ProLeadsPage, { persona: 'healthcare' });
    })
  },
  {
    path: "/realtor/leads",
    element: React.createElement(() => {
      const { ProLeadsPage } = require('./pages/pro/ProLeadsPage');
      return React.createElement(ProLeadsPage, { persona: 'realtor' });
    })
  },
  // Pro dashboard routes
  {
    path: "/cpa",
    element: React.createElement(() => {
      const { ProDashboard } = require('./pages/pro/ProDashboard');
      return React.createElement(ProDashboard, { persona: 'cpa' });
    })
  },
  {
    path: "/attorney",
    element: React.createElement(() => {
      const { ProDashboard } = require('./pages/pro/ProDashboard');
      return React.createElement(ProDashboard, { persona: 'attorney' });
    })
  },
  {
    path: "/insurance",
    element: React.createElement(() => {
      const { ProDashboard } = require('./pages/pro/ProDashboard');
      return React.createElement(ProDashboard, { persona: 'insurance' });
    })
  },
  {
    path: "/healthcare",
    element: React.createElement(() => {
      const { ProDashboard } = require('./pages/pro/ProDashboard');
      return React.createElement(ProDashboard, { persona: 'healthcare' });
    })
  },
  {
    path: "/realtor",
    element: React.createElement(() => {
      const { ProDashboard } = require('./pages/pro/ProDashboard');
      return React.createElement(ProDashboard, { persona: 'realtor' });
    })
  },
  {
    path: "/advisor/*",
    element: <ComingSoonPage featureName="Advisor Tools" description="Professional advisor management and client service tools." />
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
    element: <ComingSoonPage featureName="Legal Services" description="Professional legal services and document management." />
  },
  {
    path: "/admin/*",
    element: (
      <AdminRoute roles={['admin', 'tenant_admin', 'system_administrator']}>
        <ComingSoonPage featureName="Administrative Tools" description="Platform administration and user management tools." />
      </AdminRoute>
    )
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
  // QA routes removed for production security
  // 404 catch-all route
  {
    path: "*",
    element: <NotFoundPage />
  }
]);